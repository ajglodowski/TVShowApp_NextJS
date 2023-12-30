
'use client'

import { Rating } from '@/app/models/rating';
import { UserShowData } from '@/app/models/userShowData';
import { UserUpdateCategory } from '@/app/models/userUpdateType';
import { Error, Favorite, FavoriteBorder, RemoveCircle, RemoveCircleOutline, ThumbDown, ThumbDownOutlined, ThumbUp, ThumbUpOutlined } from '@mui/icons-material';
import { useState } from 'react';

export default function UserRatingsSection ({ userInfo, updateFunction }: { userInfo: UserShowData | null, updateFunction: Function }) {
    const [currentRating, setCurrentRating] = useState<Rating | null>(userInfo?.rating || null);
    const ratings = Object.values(Rating) as Rating[];

    if (!userInfo) return (<></>);

    function updateRating(rating: Rating| null) {
        const updateCategory = rating ? UserUpdateCategory.ChangedRating : UserUpdateCategory.RemovedRating;
        var updateResponse = updateFunction({ updateType: updateCategory , userId: userInfo!.userId, showId: userInfo!.showId, newValue: rating });
        if (updateResponse) setCurrentRating(rating);
        else console.error(`Error updating rating to ${rating}`);
    }

    function getRatingIcon(rating: Rating) {
        switch (rating) {
            case Rating.LOVED:
                return <FavoriteBorder fontSize='large' />
            case Rating.LIKED:
                return <ThumbUpOutlined fontSize='large' />
            case Rating.MEH:
                return <RemoveCircleOutline fontSize='large' />
            case Rating.DISLIKED:
                return <ThumbDownOutlined fontSize='large' />
            default:
                return <Error fontSize='large' />
        }
    }

    function currentRatingIcon() {
        switch (currentRating) {
            case Rating.LOVED:
                return <Favorite fontSize='large' />
            case Rating.LIKED:
                return <ThumbUp fontSize='large' />
            case Rating.MEH:
                return <RemoveCircle fontSize='large' />
            case Rating.DISLIKED:
                return <ThumbDown fontSize='large' />
            default:
                return <Error fontSize='large' />
        }
    }

    return (
        <div className='my-auto'>
            <div className='flex items-center'>
                Your Rating: {currentRating ? currentRating : 'No Rating'}
                {/*currentRating && <div className='px-1'>{currentRatingIcon()}</div>*/}
                {currentRating && <button 
                    onClick={() => updateRating(null)}
                    className='p-1 mx-2 rounded-lg outline outline-white hover:bg-white hover:text-black'>
                    Remove Rating
                </button> }
            </div>
            <div className='flex text-center'>
                {ratings.map((rating) => {
                    if (rating === currentRating) {
                        return (
                            <div key={rating} className=''>
                                <div className='px-1'>{currentRatingIcon()}</div>
                                <h4>{currentRating}</h4>
                            </div>
                        );
                    } else
                    return (
                        <div key={rating} className=''>
                            <button onClick={() => updateRating(rating)}>
                                <div className='px-1'>{getRatingIcon(rating)}</div>
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
