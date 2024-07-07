import { UserShowDataWithUserInfo } from "@/app/models/userShowData";
import { UserDetails } from "./UserDetails";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
export const UserDetailsDropdown = ({ currentUserInfo, otherUsersInfo }: { currentUserInfo: UserShowDataWithUserInfo, otherUsersInfo: UserShowDataWithUserInfo[] }) => {
    
    return (
        <div className="w-full md:w-1/4 flex justify-center">
            <div className="mx-auto">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className=" bg-transparent h-16 border">
                            <UserDetails userInfo={currentUserInfo} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className='bg-black text-white'>
                        {otherUsersInfo.map((userInfo) =>
                            <DropdownMenuItem key={userInfo.user.id}>
                                <UserDetails userInfo={userInfo} />
                            </DropdownMenuItem> 
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );

}