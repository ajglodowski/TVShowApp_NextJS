import { createClient } from "@/utils/supabase/server";
import { getList, getShowsForList } from "./ListService";
import { dateToString } from "@/utils/timeUtils";
import ListShowsSection from "./components/ListShowsSection";

function ListNotFound() {
  return (
    <div className='text-center my-auto mx-auto'>
        <h1 className='text-4xl font-bold'>Uh oh</h1>
        <h2 className='text-2xl'>List not found</h2>
        <h2 className='text-5xl'>😞</h2>
    </div>
  );
}


export default async function ListPage({ params }: { params: Promise<{ listId: string }> }) {
  const listId = (await params).listId;

  // User Data
  const supabase = await createClient();
  const { data: { user }, } = await supabase.auth.getUser();
  const currentUserId = user?.id;
  const loggedIn = currentUserId !== undefined;

  const [listData, listShows] = await Promise.all([
    getList(listId), getShowsForList(listId)
  ]);

  if (loggedIn) { console.log("Logged in") }

  if (!listData) {
    return <ListNotFound />
  }

  return (
    <div className="">
        <div>
            <span className="flex justify-between">
                <h1 className="text-4xl font-bold">{listData.name}</h1>
                {listData.private && <span className="underline my-auto">Private</span>}
                {!listData.private && <span className="underline my-auto">Public</span>}
            </span>
            <p>{listData.description}</p>
            <p>Created: {dateToString(listData.created_at)}</p>
            {listData.updated_at && <p>Updated: {dateToString(listData.updated_at)}</p> }
            <ListShowsSection shows={listShows} />
        </div>
    </div>

  );
}