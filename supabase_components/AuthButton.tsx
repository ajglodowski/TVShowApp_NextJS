import { createClient } from '@/app/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getUser, getUserImageURL } from '@/app/utils/userService'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import Image from "next/image";
import { getPresignedUserImageURL } from '@/app/profile/UserService'
import { backdropBackground } from '@/app/utils/stylingConstants'

export default async function AuthButton() {
  const supabase = await createClient();
  
  const { data: { user }, } = await supabase.auth.getUser();

  const userInfo = user ? await getUser(user.id) : null 

  const signOut = async () => {
    'use server'

    const supabase = await createClient();
    await supabase.auth.signOut()
    return redirect('/login')
  }

  const ProfilePic = async () => {
    if (!userInfo) {
      return (
        <Image
          src="/images/placeholder-user.jpg"
          width={40}
          height={40}
          alt="Avatar"  
          className="overflow-hidden rounded-full"
        />
      )
    } else if (userInfo && userInfo.profilePhotoURL) {
      const profilePhotoURL = await getPresignedUserImageURL(userInfo.profilePhotoURL);
      return (
        <Image
          src={profilePhotoURL!}
          width={40}
          height={40}
          alt="Avatar"
          className="overflow-hidden rounded-full"
        />
      )
    } else {
      return (
        <Image
          src="/images/placeholder-user.jpg"
          width={40}
          height={40}
          alt="Avatar"
          className="overflow-hidden rounded-full"
        />
      )
    }
  }

  const ActiveUser = () => {
    return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={`overflow-hidden rounded-full`}
        >
          <ProfilePic />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={`${backdropBackground} text-white`}>
        <DropdownMenuLabel>Hey {userInfo?.username}!</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href="/profile">
          <DropdownMenuItem>
              Your Profile
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <form action={signOut}>
            <button>
              Logout
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>);
  }


  return user && userInfo ? (
    <div className="flex justify-center items-center p-1 m-2">
      <ActiveUser />
    </div>
  ) : (
    <Link
      href="/login"
      className="flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
    >
      <Button
        variant="outline"
        size="icon"
        className={`${backdropBackground} text-white rounded-md px-8 mx-2 py-2`}
      >
        Login
      </Button>
    </Link>
  )
}
