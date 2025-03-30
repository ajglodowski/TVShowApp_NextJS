import { UserUpdate } from "@/app/models/userUpdate";
import { getUserUpdateMessage } from "@/app/utils/getUserUpdateMessage";
import { dateToString } from "@/app/utils/timeUtils";

export default function UserUpdatesSection ({ userUpdates }: { userUpdates: UserUpdate[] | null }) {

    if (!userUpdates) return (<></>);

    if (userUpdates.length === 0) return (<div>No updates</div>);

    return (
        <ul>
            {userUpdates.map((update, index) => (
                <li key={index}
                    className="border border-white rounded-full p-2 px-4 my-2 w-full"
                >
                    <span className="flex justify-between">
                        <p>{getUserUpdateMessage(update)}</p>
                        <p className="pr-2 pl-4">{dateToString(update.updateDate)}</p>
                    </span>
                </li>
            ))}
        </ul>
    );
};