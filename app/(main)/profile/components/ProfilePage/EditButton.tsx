import { createClient } from "@/app/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import Link from "next/link";

export default async function EditButton({ userId }: { userId: string }) {

    const supabase = await createClient();
    const userData = (await supabase.auth.getUser()).data.user;
    const currentUserId = userData?.id;

    if (currentUserId != userId) return <></>;

    return (
         <Link href={`/profile/edit`}>
            <Button
                variant="outline"
                size="sm"
                className="border-white/20 bg-white/5 hover:bg-white hover:text-black hover:border-white transition-all"
            >
                <Pencil className="w-4 h-4 mr-2" />
                Edit Profile
            </Button>
         </Link>
    );
}