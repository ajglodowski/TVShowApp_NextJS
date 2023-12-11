'use client'

import { ShowTag } from "@/app/models/showTag";
import { useState } from "react";

export default function ShowTagsSection({currentTags, allTags}: {currentTags: ShowTag[] | null, allTags: ShowTag[] | null} ) {
    
    const unusedTags = allTags?.filter((allTag) => !currentTags?.some((currentTag) => currentTag.id === allTag.id));
    const [editingTags, setEditingTags] = useState(false);

    function CurrentTagsSection() {
        if (currentTags === null) return (
            <div>
                <h1>Error fetching tags</h1>
            </div>
        );
    
        if (currentTags.length === 0) return (
            <div>
                <h1>No tags yet</h1>
            </div>
        );

        return (
            <div>
                {editingTags && <h1>Current Tags:</h1>}
                <ul className='flex flex-row flex-wrap'>
                    {currentTags.map((tag: ShowTag) => (
                        <li key={tag.id} className='bg-slate-400 rounded-md m-1 p-1'>
                            <h2 className='text-lg'>{tag.name}</h2>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    function AllTagsSection() {
        if (allTags === null || unusedTags === null) return (
            <div>
                <h1>Error fetching other tags</h1>
            </div>
        )

        console.log(unusedTags);

        return (
            <div>
                <h1>Other Tags:</h1>
                <ul className='flex flex-row flex-wrap'>
                    {unusedTags!.map((tag: ShowTag) => (
                        <li key={tag.id} className='bg-slate-400 rounded-md m-1 p-1'>
                            <h2 className='text-lg'>{tag.name}</h2>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
  
    return (
      <div className=''>
        <span className="flex justify-between">
            <h1 className='text-2xl font-bold'>Tags</h1>
            <button 
                className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
                onClick={() => setEditingTags(!editingTags)}>
                {editingTags ? 'Done' : 'Edit'}
            </button>
        </span>
        <CurrentTagsSection />
        {editingTags && <AllTagsSection /> }
      </div>
    );
  
  }