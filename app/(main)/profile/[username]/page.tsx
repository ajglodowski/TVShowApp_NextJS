import { cacheLife } from "next/dist/server/use-cache/cache-life";
import UserProfile from "../components/ProfilePage/UserProfile";

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
    const username = (await params).username;
    return <UserProfile username={username} />
}