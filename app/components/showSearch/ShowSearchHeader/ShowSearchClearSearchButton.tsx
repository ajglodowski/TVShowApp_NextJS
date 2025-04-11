"use client";

import { X } from "lucide-react";
import Link from "next/link";

type ClearSearchButtonProps = {
    href: string;
}

export default function ClearSearchButton({ href }: ClearSearchButtonProps) {
    return (
        <Link
            href={href}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 flex items-center justify-center"
        >
            <X className="h-4 w-4" />
        </Link>
    );
} 