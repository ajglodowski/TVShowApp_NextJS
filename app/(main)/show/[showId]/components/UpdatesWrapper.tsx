"use client";

import { useState, useTransition } from "react";
import { UserUpdate } from "@/app/models/userUpdate";
import { dateToString } from "@/app/utils/timeUtils";
import { getUserUpdateMessage } from "@/app/utils/getUserUpdateMessage";
import HideToggleButton from "./HideToggleButton";
import { PencilIcon, CheckIcon } from "lucide-react";
import { useRouter } from "next/navigation";

type ToggleHiddenFunction = (updateId: number) => Promise<boolean>;

export default function UpdatesWrapper({ 
    updates, 
    toggleHidden 
}: { 
    updates: UserUpdate[],
    toggleHidden: ToggleHiddenFunction
}) {
    const [isEditMode, setIsEditMode] = useState(false);
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    
    // In normal mode, only show non-hidden updates
    // In edit mode, show all updates
    const visibleUpdates = isEditMode
        ? updates
        : updates.filter(update => !update.hidden);

    // Wrapper function to handle toggle and refresh
    const handleToggleHidden = async (updateId: number) => {
        const success = await toggleHidden(updateId);
        if (success) {
            // Refresh the server component to get updated data
            startTransition(() => {
                router.refresh();
            });
        }
    };

    return (
        <div className={isPending ? "opacity-70 pointer-events-none" : ""}>
            <div className='flex justify-between items-center mb-4'>
                <h2 className='text-7xl font-bold my-auto tracking-tighter'>Your Updates</h2>
                <button 
                    onClick={() => setIsEditMode(!isEditMode)}
                    className='p-1 mx-2 rounded-lg outline outline-white hover:bg-white hover:text-black flex items-center gap-1.5'
                    title={isEditMode ? "Done editing" : "Edit updates"}
                    disabled={isPending}
                >
                    {isEditMode ? (
                        <>
                            <CheckIcon size={16} />
                            <span>Done</span>
                        </>
                    ) : (
                        <>
                            <PencilIcon size={16} />
                            <span>Edit</span>
                        </>
                    )}
                </button>
            </div>
            
            {isEditMode && (
                <p className="text-sm mb-2 text-white">
                    Click the eye icon to hide or show updates. Hidden updates are only visible in edit mode.
                </p>
            )}
            
            {isPending && (
                <p className="text-sm text-white mb-2">Updating changes...</p>
            )}
            
            <ul className="mt-4">
                {visibleUpdates.map((update, index) => (
                    <li key={update.id || index}
                        className={`border border-white rounded-full p-2 px-4 my-2 w-full transition-opacity 
                            ${isEditMode && update.hidden ? 'opacity-50' : ''}`}
                    >
                        <span className="flex justify-between items-center">
                            <p className="text-lg">{getUserUpdateMessage(update)}</p>
                            <span className="flex items-center">
                                <p className="pr-2 pl-4 text-sm">{dateToString(update.updateDate)}</p>
                                {isEditMode && (
                                    <HideToggleButton 
                                        updateId={update.id} 
                                        isHidden={update.hidden} 
                                        toggleHidden={handleToggleHidden} 
                                    />
                                )}
                            </span>
                        </span>
                    </li>
                ))}
                
                {isEditMode && visibleUpdates.length === 0 && (
                    <p className="text-center py-4 text-xl">No updates found</p>
                )}
                
                {!isEditMode && updates.filter(update => !update.hidden).length === 0 && (
                    <p className="text-center py-4 text-xl">
                        No visible updates. Click Edit to manage hidden updates.
                    </p>
                )}
            </ul>
        </div>
    );
} 