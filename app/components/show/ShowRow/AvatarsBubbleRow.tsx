import { UserShowDataWithUserInfo } from "@/app/models/userShowData";
import AvatarBubble from "./AvatarBubble";
import AvatarBubbleLoading from "./AvatarBubbleLoading";
import { Suspense } from "react";

export const AvatarsBubbleRow = ({ currentUserInfo, otherUsersInfo }: { currentUserInfo: UserShowDataWithUserInfo, otherUsersInfo: UserShowDataWithUserInfo[] }) => {
    
    const users = [currentUserInfo, ...otherUsersInfo];

    return (
        <div className="flex items-center">
            {users.map((user, index) => (
                <div key={`${user.user.id}_${index}_bubble`}
                    style={{
                        marginLeft: index > 0 ? "-20px" : "0",
                        zIndex: users.length - index,
                    }}
                >
                    <AvatarBubble userInfo={user} />
                </div>
            ))}
        </div>
    );

}