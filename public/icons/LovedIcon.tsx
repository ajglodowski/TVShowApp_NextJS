export const LovedIcon = (props: IconProps) => {
    const color = props.color;
    const size = props.size;
    let colorClass = "text-";
    if (color === 'none' || color === undefined) colorClass += "white";
    else if (color === 'default') colorClass += "blue-400";
    else colorClass += color;
    const sizeClass = size ? `w-${size} h-${size}` : "w-6 h-6";
    return (
        <svg className={`${sizeClass} ${colorClass} fill-current`} viewBox="0 0 24 24">
            <path d="m12.7 20.7 6.2-7.1c2.7-3 2.6-6.5.8-8.7A5 5 0 0 0 16 3c-1.3 0-2.7.4-4 1.4A6.3 6.3 0 0 0 8 3a5 5 0 0 0-3.7 1.9c-1.8 2.2-2 5.8.8 8.7l6.2 7a1 1 0 0 0 1.4 0Z"/>
        </svg>
    );
}
  