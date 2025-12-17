"use server";

/**
 * Server-side service for managing show embeddings.
 * This should be called after show properties, tags, or services are updated.
 */

import { createClient } from "@/app/utils/supabase/server";
import {
  computeShowEmbedding,
  embeddingToPostgresVector,
  type ShowEmbeddingInput,
} from "./embedding";

/**
 * Refresh/compute the embedding for a single show.
 * Fetches the show's current tags, services, and actors, computes the embedding,
 * and upserts it into ShowEmbedding.
 * 
 * @param showId The show ID to refresh embedding for
 * @returns true if successful, false otherwise
 */
export async function refreshShowEmbedding(showId: number): Promise<boolean> {
  try {
    const supabase = await createClient();

    // Fetch show with services, tags, and actors
    const { data: show, error: showError } = await supabase
      .from("show")
      .select(`
        id,
        name,
        running,
        limitedSeries,
        currentlyAiring,
        length,
        totalSeasons,
        releaseDate,
        ShowServiceRelationship(serviceId),
        ShowTagRelationship(tagId),
        ActorShowRelationship(actorId)
      `)
      .eq("id", showId)
      .single();

    if (showError || !show) {
      console.error("Error fetching show for embedding:", showError);
      return false;
    }

    // Extract service IDs
    const serviceIds = (show.ShowServiceRelationship || []).map(
      (rel: { serviceId: number }) => rel.serviceId
    );

    // Extract tag IDs
    const tagIds = (show.ShowTagRelationship || []).map(
      (rel: { tagId: number }) => rel.tagId
    );

    // Extract actor IDs
    const actorIds = (show.ActorShowRelationship || []).map(
      (rel: { actorId: number }) => rel.actorId
    );

    // Extract release year
    let releaseYear: number | null = null;
    if (show.releaseDate) {
      const date = new Date(show.releaseDate);
      if (!isNaN(date.getTime())) {
        releaseYear = date.getFullYear();
      }
    }

    // Build embedding input
    const input: ShowEmbeddingInput = {
      showId: show.id,
      name: show.name,
      serviceIds,
      tagIds,
      actorIds,
      running: show.running ?? false,
      limitedSeries: show.limitedSeries ?? false,
      currentlyAiring: show.currentlyAiring ?? false,
      length: show.length,
      totalSeasons: show.totalSeasons ?? 1,
      releaseYear,
    };

    // Compute embedding
    const embedding = computeShowEmbedding(input);
    const pgVector = embeddingToPostgresVector(embedding);

    // Upsert into ShowEmbedding
    const { error: upsertError } = await supabase
      .from("ShowEmbedding")
      .upsert(
        {
          showId: show.id,
          embedding: pgVector,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "showId" }
      );

    if (upsertError) {
      console.error("Error upserting show embedding:", upsertError);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error refreshing show embedding:", error);
    return false;
  }
}

/**
 * Refresh embeddings for multiple shows.
 * Useful for batch operations.
 * 
 * @param showIds Array of show IDs to refresh
 * @returns Object with counts of successes and failures
 */
export async function refreshShowEmbeddings(
  showIds: number[]
): Promise<{ success: number; failed: number }> {
  let success = 0;
  let failed = 0;

  for (const showId of showIds) {
    const result = await refreshShowEmbedding(showId);
    if (result) {
      success++;
    } else {
      failed++;
    }
  }

  return { success, failed };
}

