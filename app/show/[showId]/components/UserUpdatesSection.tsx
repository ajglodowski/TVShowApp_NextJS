import { UserUpdate } from "@/app/models/userUpdate";
import { getUserUpdateMessage } from "@/utils/getUserUpdateMessage";

export default function UserUpdatesSection ({ userUpdates }: { userUpdates: UserUpdate[] | null }) {

    if (!userUpdates) return (<></>);

    if (userUpdates.length === 0) return (<div>No updates</div>);

    return (
        <div>
        {userUpdates.map((update, index) => (
            <div key={index}>{getUserUpdateMessage(update)}</div>
        ))}
        </div>
    );
};