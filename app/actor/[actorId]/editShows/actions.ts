'use server';

import { addActorToShow, removeActorFromShow } from "@/app/actor/ActorService";
import { revalidatePath } from "next/cache";

export async function handleRemoveShowFromActor(formData: FormData) {
  const actorId = Number(formData.get("actorId"));
  const showId = Number(formData.get("showId"));
  
  if (!actorId || !showId) return;
  
  await removeActorFromShow(actorId, showId);
  revalidatePath(`/actor/${actorId}/editShows`);
}

export async function handleAddShowToActor(formData: FormData) {
  const actorId = Number(formData.get("actorId"));
  const showId = Number(formData.get("showId"));
  
  if (!actorId || !showId) return;
  
  await addActorToShow(actorId, showId);
  revalidatePath(`/actor/${actorId}/editShows`);
} 