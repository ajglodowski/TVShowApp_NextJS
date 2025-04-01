import { Actor, ActorParams } from "../models/actor";
import { Show, ShowProperties } from "../models/show";
import { createClient } from "../utils/supabase/server";

export async function getActor( actorId: string ): Promise<Actor | null> {
    const supabase = await createClient();
    const { data: actorData } = await supabase.from("actor").select(ActorParams).match({id: actorId}).single();
    if (!actorData) return null;   
    const actor: Actor = actorData;
    return actor;
}

export async function getShowsForActor( actorId: string ): Promise<Show[] | null> {
    const supabase = await createClient();
    const { data: showData } = await supabase.from("actor").select(`show: showId (${ShowProperties})`).match({id: actorId});
    if (!showData) return null;   
    const shows: Show[] = showData.map((obj) => obj.show as unknown as Show);
    return shows;
}