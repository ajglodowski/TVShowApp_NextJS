import { backdropBackground } from "@/app/utils/stylingConstants";
import { createClient } from "@/app/utils/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function EditButton({ userId }: { userId: string }) {

    const supabase = await createClient();
    const userData = (await supabase.auth.getUser()).data.user;
    const currentUserId = userData?.id;

    if (currentUserId != userId) return <></>;

    return (
         <Link
            href={`/profile/edit`}
        >
            <Button
                variant="outline"
                className={`${backdropBackground} hover:bg-white hover:text-black`}
                >
                Edit
            </Button>
         </Link>
    );
}