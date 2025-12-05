import EditShowPage from "@/app/components/editShow/EditShow";
import { NewShow } from "@/app/models/newShow";
import { Show } from "@/app/models/show";
import { createClient } from '@/app/utils/supabase/server';
import { isAdmin } from '@/app/utils/userService';
import Unauthorized from "@/app/components/Unauthorized";

export default async function NewShowPage() {
    // Check if user is admin
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const currentUserId = user?.id;
    const userIsAdmin = await isAdmin(currentUserId);

    if (!userIsAdmin) {
        return <Unauthorized message="You don't have permission to create shows" />;
    }

    const newShow: Show = NewShow;
    return <EditShowPage show={newShow} presignedImageUrl={null} />
}
