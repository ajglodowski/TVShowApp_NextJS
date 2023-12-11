export enum Rating {
    DISLIKED = "Disliked",
    MEH = "Meh",
    LIKED = "Liked",
    LOVED = "Loved"
}

export const RatingPoints = {
    [Rating.DISLIKED]: -2,
    [Rating.MEH]: 0,
    [Rating.LIKED]: 1,
    [Rating.LOVED]: 3
}

export const RatingColors = {
    [Rating.DISLIKED]: 'red-500',
    [Rating.MEH]: 'yellow-500',
    [Rating.LIKED]: 'green-500',
    [Rating.LOVED]: 'blue-500'
}