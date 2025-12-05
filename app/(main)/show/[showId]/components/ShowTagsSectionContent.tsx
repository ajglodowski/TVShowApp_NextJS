'use client'

import { addShowTag, removeShowTag } from "@/app/components/show/ClientShowService";
import { ShowTag } from "@/app/models/showTag";
import { TagCategory } from "@/app/models/tagCategory";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useState } from "react";
import { backdropBackground } from "@/app/utils/stylingConstants";

export default function ShowTagsSectionContent({showId, currentTags, allTags, tagCategories, isAdmin}: {showId: string, currentTags: ShowTag[] | null, allTags: ShowTag[] | null, tagCategories: TagCategory[] | null, isAdmin: boolean} ) {
    
    const [editingTags, setEditingTags] = useState(false);
    const [appliedTags, setAppliedTags] = useState<ShowTag[]>(currentTags ? currentTags : []);

    const unusedTags = () => allTags?.filter((allTag) => !appliedTags?.some((currentTag) => currentTag.id === allTag.id));

    async function addTag(tag: ShowTag) {
        if (appliedTags.includes(tag)) return;
        const response = await addShowTag(showId, tag);
        if (response) {
            if (appliedTags === null) setAppliedTags([tag]);
            else setAppliedTags([...appliedTags, tag]);
        }
    }

    async function removeTag(tag: ShowTag) {
        const response = await removeShowTag(showId, tag);
        if (response) setAppliedTags(appliedTags.filter((appliedTag) => appliedTag.id !== tag.id));
    }

    const tagStyle = `${backdropBackground} p-1 px-2 m-1 rounded-full border border-white/30 hover:bg-white/20 text-white transition-colors`;

    function CurrentTagsSection() {
        if (currentTags === null) return (
            <div>
                <h1>Error fetching tags</h1>
            </div>
        );
    
        if (appliedTags.length === 0) return (
            <div>
                <h1>No tags yet</h1>
            </div>
        );

        return (
            <div>
                <ul className='flex flex-row flex-wrap'>
                    {appliedTags.map((tag: ShowTag) => (
                        <li key={tag.id}>
                            {editingTags &&
                                <button
                                    className={tagStyle}
                                    onClick={() => removeTag(tag)}>
                                    <h2 className=''>{tag.name}</h2>
                                </button>
                            }
                            {!editingTags &&
                                <Link href={`/search?tags=${tag.id}`}>
                                    <h2 className={`${backdropBackground} p-1 px-2 mx-2 rounded-full border border-white/30 hover:bg-white/20 text-white transition-colors`}>{tag.name}</h2>
                                </Link>
                            }
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    function AllTagsSection() {
        if (allTags === null || unusedTags() === null) return (
            <div>
                <h1>Error fetching other tags</h1>
            </div>
        );
        if (tagCategories === null) return (
            <div>
                <h1>Error fetching tag categories</h1>
            </div>
        );
        return (
            <div>
                <h1>Add tags:</h1>
                {tagCategories.map((category: TagCategory) => {
                    const categoryTags = unusedTags()!.filter((tag: ShowTag) => tag.category.id === category.id);
                    if (categoryTags.length === 0) return null;
                    return (
                        <div key={category.id} className="mb-4">
                            <div className="overflow-x-auto">
                                <div className="flex flex-row flex-nowrap">
                                    {categoryTags.map((tag: ShowTag) => (
                                        <button 
                                            key={tag.id} 
                                            className={tagStyle + ' flex-shrink-0 flex items-center gap-1'}
                                            onClick={()=>{addTag(tag)}}
                                        >
                                            <h2 className=''>{tag.name}</h2>
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }
  
    return (
      <div className=''>
        <span className="flex justify-between">
            <h1 className='text-2xl font-bold my-auto'>Tags</h1>
            {isAdmin && (
              <button 
                  className={`${backdropBackground} p-1 px-3 mx-2 my-2 rounded-lg border border-white/30 hover:bg-white/20 text-white transition-colors`}
                  onClick={() => setEditingTags(!editingTags)}>
                  {editingTags ? 'Done' : 'Edit'}
              </button>
            )}
        </span>
        <CurrentTagsSection />
        {editingTags && <AllTagsSection /> }
      </div>
    );
  
  }