import { cookies } from "next/headers";
import { createClient } from "./supabase/server";
import { User } from "@/app/models/user";

export async function getUser( userId: string ): Promise<User | null> {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore);
    const { data: userData } = await supabase.from("user").select().match({id: userId}).single();
    
    if (!userData) return null;   
    
    return userData as User;
}