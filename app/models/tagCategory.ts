import { Tag, SwatchBook, Lightbulb, Users, Folder, MapPin } from "lucide-react";
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
        case "Location":
            return MapPin;
        default:
            return Tag;
    }
}; 