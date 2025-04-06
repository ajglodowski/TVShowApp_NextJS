
'use client'

import { Rating } from '@/app/models/rating';
import { UserShowData } from '@/app/models/userShowData';
import { UserUpdateCategory } from '@/app/models/userUpdateType';
import { DislikedIcon } from '@/public/icons/DislikedIcon';
import { LikedIcon } from '@/public/icons/LikedIcon';
import { LovedIcon } from '@/public/icons/LovedIcon';
import { MehIcon } from '@/public/icons/MehIcon';
import { useState } from 'react';

export default function UserRatingsSection ({ userInfo, updateFunction }: { userInfo: UserShowData | null, updateFunction: Function }) {
    const [currentRating, setCurrentRating] = useState<Rating | null>(userInfo?.rating || null);
    const ratings = Object.values(Rating) as Rating[];

    if (!userInfo) return (<></>);

    function updateRating(rating: Rating| null) {
        const updateCategory = rating ? UserUpdateCategory.ChangedRating : UserUpdateCategory.RemovedRating;
        const updateResponse = updateFunction({ updateType: updateCategory , userId: userInfo!.userId, showId: userInfo!.showId, newValue: rating });
        if (updateResponse) setCurrentRating(rating);
        else console.error(`Error updating rating to ${rating}`);
    }

    function getRatingIcon(rating: Rating) {
        switch (rating) {
            case Rating.LOVED:
                return <LovedIcon size={8}/>
            case Rating.LIKED:
                return <LikedIcon size={8}/>
            case Rating.MEH:
                return <MehIcon size={8}/>
            case Rating.DISLIKED:
                return <DislikedIcon size={8}/>
            default:
                return <></>
        }
    }

    function currentRatingIcon() {
        switch (currentRating) {
            case Rating.LOVED:
                return <LovedIcon color='default' size={8}/>
            case Rating.LIKED:
                return <LikedIcon color='default' size={8}/>
            case Rating.MEH:
                return <MehIcon color='default' size={8}/>
            case Rating.DISLIKED:
                return <DislikedIcon color='default' size={8}/>
            default:
                return <></>
        }
    }

    return (
        <div className='my-auto'>
            <div className='flex items-center'>
                Your Rating: {currentRating ? currentRating : 'No Rating'}
                {/*currentRating && <div className='px-1'>{currentRatingIcon()}</div>*/}
                {currentRating && <button 
                    onClick={() => updateRating(null)}
                    className='p-1 mx-2 my-2 rounded-lg outline outline-white hover:bg-white hover:text-black'>
                    Remove Rating
                </button> }
            </div>
            <div className='flex text-center justify-center'>
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
