import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getUser, getUserImageURL } from '@/utils/userService'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import Image from "next/image";

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

  const ProfilePic = () => {
    if (userInfo && userInfo.profilePhotoURL) {
      const profilePhotoURL = getUserImageURL(userInfo.profilePhotoURL);
      return (
        <Image
          src={profilePhotoURL}
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
          className="overflow-hidden rounded-full"
        >
          <ProfilePic />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className='bg-black text-white'>
        <DropdownMenuLabel>Hey {userInfo?.username}!</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Your Profile</DropdownMenuItem>
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
      className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
    >
      Login
    </Link>
  )
}
