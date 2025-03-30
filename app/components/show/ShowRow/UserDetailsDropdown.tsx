import { UserShowDataWithUserInfo } from "@/app/models/userShowData";
import { UserDetails } from "./UserDetails";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { AvatarsBubbleRow } from "./AvatarsBubbleRow";
import { backdropBackground } from "@/app/utils/stylingConstants";
export const UserDetailsDropdown = ({ currentUserInfo, otherUsersInfo }: { currentUserInfo: UserShowDataWithUserInfo, otherUsersInfo: UserShowDataWithUserInfo[] }) => {
    
    return (
        <div className="w-full flex justify-end">
            <div className="flex items-center ">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className={`${backdropBackground} py-6 -px-2 border`}>
                            <AvatarsBubbleRow currentUserInfo={currentUserInfo} otherUsersInfo={otherUsersInfo}/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className='bg-black text-white'>
                        {otherUsersInfo.map((userInfo, index) =>
                            <DropdownMenuItem key={`${userInfo.user.id}_${index}`}>
                                <UserDetails userInfo={userInfo} />
                            </DropdownMenuItem> 
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );

}