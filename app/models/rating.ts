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
    [Rating.DISLIKED]: 'red-400',
    [Rating.MEH]: 'yellow-400',
    [Rating.LIKED]: 'green-400',
    [Rating.LOVED]: 'blue-400'
}