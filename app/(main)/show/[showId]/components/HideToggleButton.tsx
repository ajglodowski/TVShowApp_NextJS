"use client";

import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export default function HideToggleButton({ 
    updateId, 
    isHidden,
    toggleHidden
}: { 
    updateId: number, 
    isHidden: boolean,
    toggleHidden: (updateId: number) => Promise<void>
}) {
    const [isLoading, setIsLoading] = useState(false);

    const handleToggle = async () => {
        setIsLoading(true);
        await toggleHidden(updateId);
        setIsLoading(false);
    };

    return (
        <button 
            onClick={handleToggle}
            disabled={isLoading}
            className="ml-2 p-1.5 rounded-lg outline outline-white hover:bg-white hover:text-black transition-colors"
            title={isHidden ? "Unhide update" : "Hide update"}
        >
            {isHidden ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
        </button>
    );
} 