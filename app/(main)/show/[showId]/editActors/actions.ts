'use server';

import { addActorToShow as addActor, removeActorFromShow as removeActor } from "@/app/(main)/actor/ActorService";
import { revalidatePath } from "next/cache";

export async function handleRemoveActor(formData: FormData) {
  const actorId = Number(formData.get("actorId"));
  const showId = Number(formData.get("showId"));
  
  if (!actorId || !showId) return;
  
  await removeActor(actorId, showId);
  revalidatePath(`/show/${showId}/editActors`);
}

export async function handleAddActorToShow(formData: FormData) {
  const actorId = Number(formData.get("actorId"));
  const showId = Number(formData.get("showId"));
  
  if (!actorId || !showId) return;
  
  await addActor(actorId, showId);
  revalidatePath(`/show/${showId}/editActors`);
} 