import { RatingColors } from "@/app/models/rating";

export const DislikedIcon = (props: IconProps) => {
    const color = props.color;
    const size = props.size;
    var colorClass = "text-";
    if (color === 'none' || color === undefined) colorClass += "white";
    else if (color === 'default') colorClass += RatingColors.Disliked;
    else colorClass += color;
    const sizeClass = size ? `w-${size} h-${size}` : "w-6 h-6";
    return (
        <svg className={`${sizeClass} ${colorClass} fill-current`} viewBox="0 0 24 24">
            <path d="M12.3657 23.1119C12.6127 23.6473 13.1484 24 13.75 24C14.9922 24 15.9723 23.6414 16.4904 22.7076C16.7159 22.3011 16.8037 21.8647 16.8438 21.4828C16.8826 21.1126 16.8826 20.7188 16.8826 20.3715L16.8825 17H20.0164C21.854 17 23.2408 15.3523 22.9651 13.5451L21.5921 4.54507C21.3697 3.08717 20.1225 2 18.6434 2H8L8 15H8.37734L12.3657 23.1119Z"/>
            <path d="M6 15H3.98322C2.32771 15 1 13.6489 1 12V5C1 3.35111 2.32771 2 3.98322 2H6L6 15Z"/>
        </svg>
    );
}
  