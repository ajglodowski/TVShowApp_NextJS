import { RatingColors } from "@/app/models/rating";

export const MehIcon = (props: IconProps) => {
    const color = props.color;
    const size = props.size;
    var colorClass = "text-";
    if (color === 'none' || color === undefined) colorClass += "white";
    else if (color === 'default') colorClass += RatingColors.Meh;
    else colorClass += color;
    const sizeClass = size ? `w-${size} h-${size}` : "w-6 h-6";
    return (
        <svg className={`${sizeClass} ${colorClass} fill-current`} viewBox="0 0 24 24">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12ZM6.5 10.5C5.94772 10.5 5.5 10.9477 5.5 11.5V12.5C5.5 13.0523 5.94772 13.5 6.5 13.5H17.5C18.0523 13.5 18.5 13.0523 18.5 12.5V11.5C18.5 10.9477 18.0523 10.5 17.5 10.5H6.5Z"/>
        </svg>
    );
}
  