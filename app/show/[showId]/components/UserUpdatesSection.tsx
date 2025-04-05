import { getUserUpdateMessage } from "@/app/utils/getUserUpdateMessage";
import { dateToString } from "@/app/utils/timeUtils";
import { getUserUpdates } from "../UserShowDataService";

export default async function UserUpdatesSection ({ showId, currentUserId }: { showId: number, currentUserId: string | undefined }) {

    const userUpdates = await getUserUpdates({ showId: showId, userId: currentUserId});

    if (userUpdates == null) return (<></>);

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