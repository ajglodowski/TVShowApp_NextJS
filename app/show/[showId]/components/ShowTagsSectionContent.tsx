'use client'

import { addShowTag, removeShowTag } from "@/app/components/show/ClientShowService";
import { ShowTag } from "@/app/models/showTag";
import { useState } from "react";

export default function ShowTagsSectionContent({showId, currentTags, allTags}: {showId: string, currentTags: ShowTag[] | null, allTags: ShowTag[] | null} ) {
    
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

    const tagStyle = 'p-1 px-2 m-1 rounded-full outline outline-white hover:bg-white hover:text-black';

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
                                <h2 className='p-1 px-2 mx-2 rounded-full outline outline-white'>{tag.name}</h2>
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
        return (
            <div>
                <h1>Other Tags:</h1>
                <ul className='flex flex-row flex-wrap'>
                    {unusedTags()!.map((tag: ShowTag) => (
                        <button key={tag.id} 
                            className={tagStyle}
                            onClick={()=>{addTag(tag)}}
                        >
                            <h2 className=''>{tag.name}</h2>
                        </button>
                    ))}
                </ul>
            </div>
        );
    }
  
    return (
      <div className=''>
        <span className="flex justify-between">
            <h1 className='text-2xl font-bold my-auto'>Tags</h1>
            <button 
                className='p-1 mx-2 my-2 rounded-lg outline outline-white hover:bg-white hover:text-black'
                onClick={() => setEditingTags(!editingTags)}>
                {editingTags ? 'Done' : 'Edit'}
            </button>
        </span>
        <CurrentTagsSection />
        {editingTags && <AllTagsSection /> }
      </div>
    );
  
  }