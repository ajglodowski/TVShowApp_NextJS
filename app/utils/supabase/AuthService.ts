'use server'
import { headers } from 'next/headers'
import { createClient } from '@/app/utils/supabase/server'
import { redirect } from 'next/navigation'

type CreateUserParams = {
    id: string
    username: string
    name: string | null
}

// Check if username already exists
export const checkUsernameExists = async (username: string) => {
    const supabase = await createClient()
    
    const { data, error } = await supabase
        .from('user')
        .select('username')
        .eq('username', username)
        .maybeSingle()
    
    if (error) {
        console.error('Error checking username:', error)
        return true // Assume username exists if there's an error
    }
    
    return !!data // Return true if data exists (username taken)
}

export const createUser = async (userDetails: CreateUserParams) => {
    const supabase = await createClient()
    const { id, username, name } = userDetails

    // Check if username is taken before inserting
    const usernameExists = await checkUsernameExists(username)
    if (usernameExists) {
        return { error: 'Username already exists', data: null }
    }

    const { data, error } = await supabase
        .from('user')
        .insert([{ id: id, username: username, name:name }])
        .select()

    if (error) {
        console.error('Error creating user:', error)
        return { error: error.message, data: null }
    }

    return { error: null, data }
}

export const signUp = async (formData: FormData) => {
    'use server'

    const origin = (await headers()).get('origin')
    const email = formData.get('email')
    const password = formData.get('password') 
    const confirmPassword = formData.get('confirmPassword')
    const username = formData.get('username')
    const name = formData.get('name')

    if (!email || !password || !username) {
        return redirect('/signup?message=Please fill in all fields')
    }
    if (typeof email !== 'string' || typeof password !== 'string' || typeof username !== 'string') {
        return redirect('/signup?message=Invalid input')
    }
    if (email.length < 5 || email.length > 50) {
        return redirect('/signup?message=Email must be between 5 and 50 characters')
    }
    if (username.length < 3 || username.length > 20) {
        return redirect('/signup?message=Username must be between 3 and 20 characters')
    }  

    // Username validation - check for invalid characters
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
        return redirect('/signup?message=Username can only contain letters, numbers, and underscores')
    }

    // Check if username already exists
    const usernameExists = await checkUsernameExists(username)
    if (usernameExists) {
        return redirect('/signup?message=Username already taken')
    }

    // Password validation
    if (password !== confirmPassword) {
        return redirect('/signup?message=Passwords do not match')
    }
    if (password.length < 8) {
        return redirect('/signup?message=Password must be at least 8 characters long')
    }
    
    const supabase = await createClient();

    // First, create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${origin}/auth/callback`,
        },
    })
    
    if (authError) {
        return redirect('/signup?message=Could not authenticate user')
    }

    // Get the user ID from the auth data
    if (!authData.user?.id) {
        return redirect('/signup?message=Failed to get user ID')
    }

    // Then, create user in the database with the auth ID
    const { error: userError } = await createUser({ 
        id: authData.user.id,
        username, 
        name: (typeof name === 'string' ? name : null) 
    })
    
    if (userError) {
        // If database user creation fails, we should clean up the auth user
        console.error('Failed to create database user after auth creation:', userError)
        return redirect(`/signup?message=${encodeURIComponent(userError)}`)
    }

    return redirect('/signup?message=Check email to continue sign in process')
}