import { Actor, ActorParams } from "@/app/models/actor";
import { Show, ShowPropertiesWithService } from "@/app/models/show";
import { createClient } from "@/app/utils/supabase/server";
import { refreshShowEmbedding } from "@/app/utils/recommendations/ShowEmbeddingService";

export async function getActor( actorId: string ): Promise<Actor | null> {
    const supabase = await createClient();
    const { data: actorData } = await supabase.from("actor").select(ActorParams).match({id: actorId}).single();
    if (!actorData) return null;   
    const actor: Actor = actorData;
    return actor;
}

export async function getShowsForActor( actorId: string ): Promise<Show[] | null> {
    const supabase = await createClient();
    const { data: showData } = await supabase.from("ActorShowRelationship").select(`show: showId (${ShowPropertiesWithService})`).match({ actorId: actorId });
    if (!showData) return null;   
    const shows: Show[] = showData.map((obj) => obj.show as unknown as Show);
    return shows;
}

export async function addActorToShow(actorId: number, showId: number): Promise<boolean> {
    const supabase = await createClient();
    const { error } = await supabase.from("ActorShowRelationship").insert({ actorId, showId });
    if (error) {
        console.error(error);
        return false;
    }
    // Refresh show embedding asynchronously (fire and forget)
    refreshShowEmbedding(showId).catch((err) => {
        console.error("Failed to refresh show embedding:", err);
    });
    return true;
}

export async function removeActorFromShow(actorId: number, showId: number): Promise<boolean> {
    const supabase = await createClient();
    const { error } = await supabase.from("ActorShowRelationship").delete().match({ actorId, showId });
    if (error) {
        console.error(error);
        return false;
    }
    // Refresh show embedding asynchronously (fire and forget)
    refreshShowEmbedding(showId).catch((err) => {
        console.error("Failed to refresh show embedding:", err);
    });
    return true;
}

/**
 * Find an actor by exact name match (case-insensitive)
 */
export async function findActorByNameExactCI(name: string): Promise<Actor | null> {
    const supabase = await createClient();
    // Use ilike without wildcards for case-insensitive exact match
    const { data: actorData } = await supabase
        .from("actor")
        .select(ActorParams)
        .ilike('name', name.trim())
        .maybeSingle();
    
    if (!actorData) return null;
    return actorData as Actor;
}

/**
 * Create a new actor with the given name
 */
export async function createActor(name: string): Promise<Actor | null> {
    const supabase = await createClient();
    const { data: actorData, error } = await supabase
        .from("actor")
        .insert({ name: name.trim() })
        .select(ActorParams)
        .single();
    
    if (error) {
        console.error("Error creating actor:", error);
        return null;
    }
    
    return actorData as Actor;
}