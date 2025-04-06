"use client"

import type React from "react"

import { useRouter } from "next/navigation"
import { use, useState } from "react"
import { useForm } from "react-hook-form"

import { User } from "@/app/models/user"
import { backdropBackground } from "@/app/utils/stylingConstants"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { AtSign } from "lucide-react"
import ProfilePictureSection from "./ProfilePictureSection"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/hooks/use-toast"

export type ProfileFormValues = {
    username: string
    name: string
    bio: string
    isPrivate: boolean
}

type ProfileFormProps = {
    userData: User
    email: string | undefined
    presignedImageUrl: string | null
    saveFunction: (data: ProfileFormValues) => Promise<boolean>
}

export function EditProfileForm({ userData, email, presignedImageUrl, saveFunction }: ProfileFormProps) {
    const router = useRouter()

    const { toast } = useToast();

    const form = useForm<ProfileFormValues>({
        defaultValues: {
            username: userData.username || "",
            name: userData.name || "",
            bio: userData.bio || "",
            isPrivate: userData.private || false,
        },
    })

    async function onSubmit(data: ProfileFormValues) {
        // This would be replaced with actual API call to update the profile
        const success = await saveFunction(data);
        if (success) {
            toast({
                title: "Profile updated",
                description: "Your profile has been successfully updated.",
                action: <Button variant="outline" className={`bg-black text-white hover:bg-white hover:text-black`} onClick={() => router.push("/profile")}>Go to Profile</Button>,
            })
        } else {
            toast({
                title: "Error",
                description: "There was an error updating your profile. Please try again.",
            })
        }
    }

    return (
        <div>
            <ProfilePictureSection userData={userData} presignedImageUrl={presignedImageUrl} />

            <div className="my-4">
                <Label>Email</Label>
                <p className="underline">{email}</p>
                <p className="text-muted-foreground text-sm text-white/70">
                    This is your login email. It cannot be changed.
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl className={`${backdropBackground}`}>
                                    <div className="relative flex-1 w-full mb-4 md:mb-0 rounded-md px-4 py-2 border-white border">
                                        <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                                        <input
                                        className="ml-4 bg-inherit text-white"
                                        name="username"
                                        placeholder="yourusername"
                                        required
                                        />
                                    </div>
                                </FormControl>
                                <FormDescription className="text-white/80">
                                    This is your public display name. It can be your real name or a pseudonym.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl className={`${backdropBackground}`}>
                                    <Input className="" placeholder="John Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Bio</FormLabel>
                                <FormControl className={`${backdropBackground}`}>
                                    <Textarea
                                        placeholder="Tell us a little bit about yourself"
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="isPrivate"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base">Private Account</FormLabel>
                                    <FormDescription className="text-white/80">
                                        When your account is private, only people you approve can see your profile and updates.
                                    </FormDescription>
                                </div>
                                <FormControl className="ml-16">
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        aria-label="Private account"
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <div className="flex w-full items-center justify-center space-x-4">
                        <Button
                            type="button"
                            variant="outline"
                            className={`bg-red-700 hover:bg-white hover:text-red-700 hover:border-red-700 text-white`}
                            onClick={() => router.back()}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="outline"
                            className={`${backdropBackground} hover:bg-white hover:text-black`}
                            type="submit"
                        >
                            Update profile
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
