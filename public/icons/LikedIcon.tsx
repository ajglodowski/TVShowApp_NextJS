import { RatingColors } from "@/app/models/rating";

export const LikedIcon = (props: IconProps) => {
    const color = props.color;
    const size = props.size;
    let colorClass = "text-";
    if (color === 'none' || color === undefined) colorClass += "white";
    else if (color === 'default') colorClass += RatingColors.Liked;
    else colorClass += color;
    const sizeClass = size ? `w-${size} h-${size}` : "w-6 h-6";
    return (
        <svg className={`${sizeClass} ${colorClass} fill-current`} viewBox="0 0 24 24">
            <path d="M12.3657 0.888071C12.6127 0.352732 13.1484 0 13.75 0C14.9922 0 15.9723 0.358596 16.4904 1.29245C16.7159 1.69889 16.8037 2.13526 16.8438 2.51718C16.8826 2.88736 16.8826 3.28115 16.8826 3.62846L16.8825 7H20.0164C21.854 7 23.2408 8.64775 22.9651 10.4549L21.5921 19.4549C21.3697 20.9128 20.1225 22 18.6434 22H8L8 9H8.37734L12.3657 0.888071Z"/>
            <path d="M6 9H3.98322C2.32771 9 1 10.3511 1 12V19C1 20.6489 2.32771 22 3.98322 22H6L6 9Z"/>
        </svg>
    );
}
  