import { createClient } from "@/app/utils/supabase/server";
import UserProfile from "./components/ProfilePage/UserProfile";
import { getUser } from "@/app/utils/userService";

export default async function CurrentUserProfilePage() {
    const supabase = await createClient();
    const { data: { user }, } = await supabase.auth.getUser();
    const currentUserId = user?.id;
    const loggedIn = currentUserId !== undefined;
    
    const NotLoggedIn = () => {
        return (
            <div className='text-center my-auto mx-auto'>
                <h1 className='text-4xl font-bold'>Uh oh</h1>
                <h2 className='text-2xl'>You must be logged in to view this page</h2>
                <h2 className='text-5xl'>😞</h2>
            </div>
        );
    }
    if (!loggedIn) return <NotLoggedIn />;

    const userData = await getUser(currentUserId);
    if (!userData) return <NotLoggedIn />;

    return <UserProfile username={userData.username} />
}