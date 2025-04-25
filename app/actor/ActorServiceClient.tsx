'use client'

import { Actor } from "../models/actor";
import { createClient } from "../utils/supabase/client";

export async function searchActors(query: string): Promise<Actor[] | null> {
    const supabase = createClient();
    const { data: actorData } = await supabase.from("actor").select('id, name').ilike('name', `%${query}%`).limit(10);
    if (!actorData) return null;
    const actors: Actor[] = actorData;
    return actors;
}