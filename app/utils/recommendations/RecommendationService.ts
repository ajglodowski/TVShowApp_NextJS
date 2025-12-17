/**
 * Service for fetching personalized show recommendations.
 * Uses pgvector embeddings stored in Postgres via Supabase RPCs.
 */

import { createClient } from "@/app/utils/supabase/server";

/**
 * Result from the get_recommendations_for_user RPC
 */
export type RecommendationResult = {
  showId: number;
  similarityScore: number;
  isFallback: boolean;
};

/**
 * Get personalized show recommendations for a user.
 * 
 * Uses the precomputed UserEmbedding for fast ANN search.
 * Falls back to trending shows if user has no embedding (new user or no ratings).
 * 
 * @param userId The user's UUID
 * @param limit Maximum number of recommendations to return (default: 20)
 * @returns Array of recommended show IDs with similarity scores
 */
export async function getRecommendationsForUser(
  userId: string,
  limit: number = 20
): Promise<RecommendationResult[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_recommendations_for_user", {
    p_user_id: userId,
    p_limit: limit,
  });

  if (error) {
    console.error("Error fetching recommendations:", error);
    throw new Error(`Failed to fetch recommendations: ${error.message}`);
  }

  if (!data || !Array.isArray(data)) {
    return [];
  }

  return data.map((row: { showId: number; similarity_score: number; is_fallback: boolean }) => ({
    showId: row.showId,
    similarityScore: row.similarity_score,
    isFallback: row.is_fallback,
  }));
}

/**
 * Refresh a user's embedding based on their current ratings.
 * Call this after a user rates/unrates a show.
 * 
 * @param userId The user's UUID
 */
export async function refreshUserEmbedding(userId: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.rpc("refresh_user_embedding", {
    p_user_id: userId,
  });

  if (error) {
    console.error("Error refreshing user embedding:", error);
    throw new Error(`Failed to refresh user embedding: ${error.message}`);
  }
}

/**
 * Check if a user has an embedding (has rated shows with non-Meh ratings).
 * Useful for UI to show "rate some shows to get recommendations" message.
 * 
 * @param userId The user's UUID
 * @returns true if user has an embedding, false otherwise
 */
export async function userHasEmbedding(userId: string): Promise<boolean> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("UserEmbedding")
    .select("userId")
    .eq("userId", userId)
    .single();

  if (error) {
    // PGRST116 = no rows returned, which is expected if user has no embedding
    if (error.code === "PGRST116") {
      return false;
    }
    console.error("Error checking user embedding:", error);
    return false;
  }

  return !!data;
}

/**
 * Get personalized recommendations for which watchlist shows to start.
 * 
 * Ranks shows in the user's watchlist (status = 3) by similarity to their
 * preference vector. Falls back to most recently added if no embedding exists.
 * 
 * @param userId The user's UUID
 * @param limit Maximum number of recommendations to return (default: 20)
 * @returns Array of watchlist show IDs ranked by preference match
 */
export async function getWatchlistStartRecommendationsForUser(
  userId: string,
  limit: number = 20
): Promise<RecommendationResult[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_watchlist_start_recommendations_for_user", {
    p_user_id: userId,
    p_limit: limit,
  });

  if (error) {
    console.error("Error fetching watchlist start recommendations:", error);
    throw new Error(`Failed to fetch watchlist start recommendations: ${error.message}`);
  }

  if (!data || !Array.isArray(data)) {
    return [];
  }

  return data.map((row: { showId: number; similarity_score: number; is_fallback: boolean }) => ({
    showId: row.showId,
    similarityScore: row.similarity_score,
    isFallback: row.is_fallback,
  }));
}

