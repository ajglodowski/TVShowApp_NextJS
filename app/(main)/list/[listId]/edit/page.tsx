import { cacheLife } from "next/dist/server/use-cache/cache-life";

export default async function EditShowListPage({ params }: { params: Promise<{ listId: string }> }) {
    
    const listIdString = (await params).listId;
    

    return (
        <div>TODO</div>
    );
} 