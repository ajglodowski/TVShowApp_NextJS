import { TagCategory } from "./tagCategory";

export type ShowTag = {
    id: number;
    name: string;
    created_at: Date;
    category: TagCategory;
}