import { getAllTags, getTags } from "../ShowService";
import ShowTagsSectionContent from "./ShowTagsSectionContent";

export async function ShowTagsSection({showId, isAdmin}: {showId: string, isAdmin: boolean} ) {
    
    const [currentTags, allTags] = await Promise.all([
        getTags(showId),
        getAllTags(),
    ]);

    return (
        <ShowTagsSectionContent showId={showId} currentTags={currentTags} allTags={allTags} isAdmin={isAdmin} />
    );
  
}

export const LoadingShowTagsSection = () => {
    return (
        <div>
            <h2>Loading...</h2>
        </div>
    );
}