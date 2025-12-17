/**
 * Backfill script for ShowEmbedding table.
 * 
 * Fetches all shows with their tags, services, and actors, computes deterministic
 * embeddings, and upserts them into the ShowEmbedding table.
 * 
 * Run with: npx tsx scripts/backfillShowEmbeddings.ts
 * 
 * Requires environment variables (loaded from .env.local):
 * - NEXT_PUBLIC_SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY (for write access)
 */

import { config } from "dotenv";
import { resolve } from "path";

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), ".env.local") });

import { createClient, SupabaseClient } from "@supabase/supabase-js";
import {
  computeShowEmbedding,
  embeddingToPostgresVector,
  type ShowEmbeddingInput,
} from "../app/utils/recommendations/embedding";

// Batch size for upserts
const BATCH_SIZE = 100;

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing required environment variables:");
    console.error("- NEXT_PUBLIC_SUPABASE_URL");
    console.error("- SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  // Create Supabase client with service role for write access
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  console.log("Starting ShowEmbedding backfill...");

  // Fetch all shows with their services, tags, and actors
  console.log("Fetching shows...");
  const { data: shows, error: showsError } = await supabase
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
    `);

  if (showsError) {
    console.error("Error fetching shows:", showsError);
    process.exit(1);
  }

  if (!shows || shows.length === 0) {
    console.log("No shows found.");
    process.exit(0);
  }

  console.log(`Found ${shows.length} shows.`);

  // Process shows and compute embeddings
  const embeddings: { showId: number; embedding: string }[] = [];

  for (const show of shows) {
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

    // Extract release year from releaseDate
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

    embeddings.push({
      showId: show.id,
      embedding: pgVector,
    });
  }

  console.log(`Computed ${embeddings.length} embeddings.`);

  // Upsert in batches
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < embeddings.length; i += BATCH_SIZE) {
    const batch = embeddings.slice(i, i + BATCH_SIZE);
    console.log(
      `Upserting batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(
        embeddings.length / BATCH_SIZE
      )} (${batch.length} items)...`
    );

    const { error: upsertError } = await supabase
      .from("ShowEmbedding")
      .upsert(
        batch.map((item) => ({
          showId: item.showId,
          embedding: item.embedding,
          updated_at: new Date().toISOString(),
        })),
        { onConflict: "showId" }
      );

    if (upsertError) {
      console.error(`Error upserting batch:`, upsertError);
      errorCount += batch.length;
    } else {
      successCount += batch.length;
    }
  }

  console.log("\nBackfill complete!");
  console.log(`- Success: ${successCount}`);
  console.log(`- Errors: ${errorCount}`);

  // Optionally, also backfill user embeddings
  if (process.argv.includes("--include-users")) {
    console.log("\nBackfilling user embeddings...");
    await backfillUserEmbeddings(supabase);
  }
}

async function backfillUserEmbeddings(supabase: SupabaseClient) {
  // Get all users who have at least one rating
  const { data: users, error: usersError } = await supabase
    .from("UserShowDetails")
    .select("userId")
    .not("rating", "is", null);

  if (usersError) {
    console.error("Error fetching users with ratings:", usersError);
    return;
  }

  // Get unique user IDs
  const uniqueUserIds = Array.from(new Set(users?.map((u) => u.userId) || []));
  console.log(`Found ${uniqueUserIds.length} users with ratings.`);

  let successCount = 0;
  let errorCount = 0;

  for (const userId of uniqueUserIds) {
    const { error: rpcError } = await supabase.rpc("refresh_user_embedding", {
      p_user_id: userId,
    });

    if (rpcError) {
      console.error(`Error refreshing embedding for user ${userId}:`, rpcError);
      errorCount++;
    } else {
      successCount++;
    }

    // Progress update every 50 users
    if ((successCount + errorCount) % 50 === 0) {
      console.log(`Progress: ${successCount + errorCount}/${uniqueUserIds.length}`);
    }
  }

  console.log("\nUser embedding backfill complete!");
  console.log(`- Success: ${successCount}`);
  console.log(`- Errors: ${errorCount}`);
}

main().catch((err) => {
  console.error("Backfill failed:", err);
  process.exit(1);
});

