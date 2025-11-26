import { getAllTags, getAllTagCategories, getTags } from "../ShowService";
import ShowTagsSectionContent from "./ShowTagsSectionContent";

export async function ShowTagsSection({showId, isAdmin}: {showId: string, isAdmin: boolean} ) {
    
    const [currentTags, allTags, tagCategories] = await Promise.all([
        getTags(showId),
        getAllTags(),
        getAllTagCategories(),
    ]);

    return (
        <ShowTagsSectionContent showId={showId} currentTags={currentTags} allTags={allTags} tagCategories={tagCategories} isAdmin={isAdmin} />
    );
  
}

export const LoadingShowTagsSection = () => {
    return (
        <div>
            <h2>Loading...</h2>
        </div>
    );
}