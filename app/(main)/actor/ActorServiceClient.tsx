'use client'

import { Actor } from "@/app/models/actor";
import { createClient } from "@/app/utils/supabase/client";

export async function searchActors(query: string): Promise<Actor[] | null> {
    const supabase = createClient();
    const { data: actorData } = await supabase.from("actor").select('id, name').ilike('name', `%${query}%`).limit(10);
    if (!actorData) return null;
    const actors: Actor[] = actorData;
    return actors;
}