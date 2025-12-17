/**
 * Recommendations module - exports all recommendation utilities
 */

export {
  computeShowEmbedding,
  embeddingToPostgresVector,
  postgresVectorToEmbedding,
  normalizeVector,
  EMBEDDING_DIM,
  type ShowEmbeddingInput,
} from "./embedding";

export {
  getRecommendationsForUser,
  getWatchlistStartRecommendationsForUser,
  refreshUserEmbedding,
  userHasEmbedding,
  type RecommendationResult,
} from "./RecommendationService";

export {
  refreshShowEmbedding,
  refreshShowEmbeddings,
} from "./ShowEmbeddingService";

