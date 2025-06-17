import { Tag, SwatchBook, Lightbulb, Users, Folder } from "lucide-react";
import { LucideIcon } from "lucide-react";

export type TagCategory = {
    id: number;
    name: string;
    created_at: Date;
}

export const getTagCategoryIcon = (categoryName: string): LucideIcon => {
    switch (categoryName) {
        case "None":
            return Tag;
        case "Genre":
            return SwatchBook;
        case "Theme":
            return Lightbulb;
        case "Producer":
            return Users;
        case "Collection":
            return Folder;
        case "Attribute":
            return Tag;
        default:
            return Tag;
    }
}; 