import { LoadingImageSkeleton } from "../../image/LoadingImageSkeleton";

export default function ShowTileSkeleton() {

    return (
        <div
            className="w-48 h-48 overflow-hidden rounded-lg bg-white/5"
        >
            <LoadingImageSkeleton />;
        </div>
    );
};