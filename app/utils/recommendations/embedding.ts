/**
 * Deterministic show embedding utilities for pgvector recommendations.
 * 
 * Creates fixed-size (256-dim) feature vectors from show properties using
 * feature hashing (FNV-1a). No external APIs or ML models required.
 * 
 * Weights are calibrated to match the existing `get_similar_show_ids` SQL function:
 * - Tags: strongest signal (1.0)
 * - Length: medium signal (0.6)
 * - Service: medium signal (0.4)
 * - Actors: small signal (0.3) - intentionally low to avoid dominating
 * - Extras (booleans/seasons/year): tie-breakers only (0.05-0.10)
 */

import { ShowLength } from "@/app/models/showLength";

// Embedding dimension - must match the vector(256) in ShowEmbedding table
export const EMBEDDING_DIM = 256;

/**
 * Input data needed to compute a show embedding.
 * This is a subset of show properties plus related tags/services/actors.
 */
export type ShowEmbeddingInput = {
  showId: number;
  name: string;
  serviceIds: number[];
  tagIds: number[];
  actorIds: number[];
  running: boolean;
  limitedSeries: boolean;
  currentlyAiring: boolean;
  length: ShowLength | string | null;
  totalSeasons: number;
  releaseYear: number | null; // extracted from releaseDate
};

/**
 * FNV-1a hash function - fast, deterministic, good distribution.
 * Returns a 32-bit unsigned integer.
 */
function fnv1aHash(str: string): number {
  let hash = 2166136261; // FNV offset basis
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    // FNV prime * hash (with 32-bit overflow)
    hash = Math.imul(hash, 16777619);
    hash = hash >>> 0; // Convert to unsigned
  }
  return hash;
}

/**
 * Hash a feature string into a bucket index [0, EMBEDDING_DIM).
 */
function featureToBucket(feature: string): number {
  return fnv1aHash(feature) % EMBEDDING_DIM;
}

/**
 * Get the sign for a feature (for signed random projections).
 * This helps with collision handling - features that hash to the same
 * bucket will partially cancel if they have opposite signs.
 */
function featureSign(feature: string): number {
  // Use a different seed by appending a suffix
  const hash = fnv1aHash(feature + "_sign");
  return hash % 2 === 0 ? 1 : -1;
}

/**
 * Add a feature to the embedding vector.
 * Uses feature hashing with signed random projection.
 */
function addFeature(
  embedding: number[],
  feature: string,
  weight: number = 1.0
): void {
  const bucket = featureToBucket(feature);
  const sign = featureSign(feature);
  embedding[bucket] += sign * weight;
}

/**
 * Bucket totalSeasons into categories for better generalization.
 */
function seasonsBucket(totalSeasons: number): string {
  if (totalSeasons <= 1) return "seasons:1";
  if (totalSeasons <= 3) return "seasons:2-3";
  if (totalSeasons <= 6) return "seasons:4-6";
  if (totalSeasons <= 10) return "seasons:7-10";
  return "seasons:10+";
}

/**
 * Bucket release year into decades/eras.
 */
function yearBucket(year: number | null): string {
  if (year === null) return "year:unknown";
  if (year < 2000) return "year:pre-2000";
  if (year < 2010) return "year:2000s";
  if (year < 2015) return "year:2010-2014";
  if (year < 2020) return "year:2015-2019";
  if (year < 2023) return "year:2020-2022";
  return "year:2023+";
}

/**
 * L2 normalize a vector to unit length.
 * Returns a new array; does not modify input.
 */
export function normalizeVector(vec: number[]): number[] {
  const magnitude = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0));
  if (magnitude === 0) {
    return vec.slice(); // Return copy of zero vector
  }
  return vec.map((v) => v / magnitude);
}

/**
 * Compute a deterministic embedding for a show based on its properties.
 * 
 * Weights are calibrated to match the existing `get_similar_show_ids` SQL function:
 * - Tags: strongest signal (SQL: +5 per tag)
 * - Length: medium signal (SQL: +3)
 * - Service: medium signal (SQL: +2)
 * - Actors: small signal (SQL: +3, but we halve it intentionally)
 * - Extras: tie-breakers only
 * 
 * Features used:
 * - tag:<tagId> for each tag (weight: 1.0 - baseline/strongest)
 * - length:<value> for show episode length (weight: 0.6)
 * - service:<serviceId> for each service (weight: 0.4)
 * - actor:<actorId> for each actor (weight: 0.3 - intentionally small)
 * - running/limitedSeries/currentlyAiring booleans (weight: 0.08 - tie-breakers)
 * - seasons:<bucket> for total seasons (weight: 0.06 - tie-breaker)
 * - year:<bucket> for release year (weight: 0.05 - tie-breaker)
 * 
 * @param input Show properties needed for embedding
 * @returns Normalized 256-dimensional embedding vector
 */
export function computeShowEmbedding(input: ShowEmbeddingInput): number[] {
  // Initialize zero vector
  const embedding = new Array(EMBEDDING_DIM).fill(0);

  // === CORE FEATURES (match SQL behavior) ===

  // Tag features (weight: 1.0 - strongest signal, baseline)
  for (const tagId of input.tagIds) {
    addFeature(embedding, `tag:${tagId}`, 1.0);
  }

  // Length feature (weight: 0.6 - ≈3/5 of tags, matches SQL ratio)
  const lengthValue = input.length ?? ShowLength.NONE;
  addFeature(embedding, `length:${lengthValue}`, 0.4);

  // Service features (weight: 0.4 - ≈2/5 of tags, matches SQL ratio)
  for (const serviceId of input.serviceIds) {
    addFeature(embedding, `service:${serviceId}`, 0.4);
  }

  // Actor features (weight: 0.3 - small impact as requested)
  for (const actorId of input.actorIds) {
    addFeature(embedding, `actor:${actorId}`, 0.5);
  }

  // === EXTRA FEATURES (tie-breakers only) ===

  // Boolean features (weight: 0.08 - very low, just tie-breakers)
  addFeature(embedding, `running:${input.running}`, 0.1);
  addFeature(embedding, `limitedSeries:${input.limitedSeries}`, 0.7);
  addFeature(embedding, `currentlyAiring:${input.currentlyAiring}`, 0.08);

  // Seasons bucket (weight: 0.06 - tie-breaker)
  addFeature(embedding, seasonsBucket(input.totalSeasons), 0.06);

  // Year bucket (weight: 0.05 - tie-breaker)
  addFeature(embedding, yearBucket(input.releaseYear), 0.01);

  // Normalize to unit vector for cosine similarity
  return normalizeVector(embedding);
}

/**
 * Format an embedding vector as a pgvector-compatible string.
 * Example output: "[0.1,0.2,0.3,...]"
 */
export function embeddingToPostgresVector(embedding: number[]): string {
  return `[${embedding.join(",")}]`;
}

/**
 * Parse a pgvector string back to a number array.
 */
export function postgresVectorToEmbedding(pgVector: string): number[] {
  // Remove brackets and split
  const inner = pgVector.slice(1, -1);
  return inner.split(",").map(Number);
}

