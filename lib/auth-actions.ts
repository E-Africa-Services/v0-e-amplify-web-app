"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function signUp(
  email: string,
  password: string,
  fullName: string,
  goal?: string,
  skills?: string,
  whyHere?: string
) {
  const supabase = await createClient()

  // Validate inputs
  if (!email || !password || !fullName) {
    return { error: "Email, password, and name are required" }
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters long" }
  }

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: fullName,
      },
      emailRedirectTo:
        process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/callback`,
    },
  })

  if (authError) {
    // Return user-friendly error messages
    if (authError.message.includes("already registered")) {
      return { error: "This email is already registered. Please sign in instead." }
    }
    return { error: authError.message }
  }

  if (!authData.user) {
    return { error: "Failed to create account. Please try again." }
  }

  if (authData.user) {
    // Create profile with all onboarding data
    const { error: profileError } = await supabase.from("profiles").insert({
      user_id: authData.user.id,
      name: fullName,
      email: email,
      goal: goal || null,
      bio: whyHere || null,
    })

    if (profileError) {
      console.error("Error creating user profile:", profileError)
      
      // Check if it's a duplicate user_id error (profile already exists)
      if (profileError.message.includes("duplicate") || profileError.message.includes("unique")) {
        // Profile already exists, this is okay - user might be re-registering
        console.log("Profile already exists for user:", authData.user.id)
      } else {
        return { error: "Account created but profile setup failed. Please complete your profile in settings." }
      }
    }

    // Insert skills if provided
    if (skills) {
      const skillsArray = skills.split(",").map((skill) => skill.trim()).filter(Boolean)
      
      if (skillsArray.length > 0) {
        const { data: profileData, error: profileQueryError } = await supabase
          .from("profiles")
          .select("id")
          .eq("user_id", authData.user.id)
          .single()

        if (profileQueryError) {
          console.error("Error fetching profile:", profileQueryError)
          // Don't fail signup for skills error
        } else if (profileData) {
          const skillsToInsert = skillsArray.map((skill) => ({
            profile_id: profileData.id,
            skill_name: skill,
          }))

          const { error: skillsError } = await supabase.from("skills").insert(skillsToInsert)
          
          if (skillsError) {
            console.error("Error inserting skills:", skillsError)
            // Don't fail signup for skills error
          }
        }
      }
    }
  }
  
  return { success: true }
}

export async function signIn(email: string, password: string) {
  const supabase = await createClient()

  // Validate inputs
  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // Return user-friendly error messages
    if (error.message.includes("Invalid login credentials") || 
        error.message.includes("Invalid email or password")) {
      return { error: "Invalid email or password. Please try again." }
    } else if (error.message.includes("Email not confirmed")) {
      return { error: "Please verify your email before signing in. Check your inbox for the verification link." }
    }
    return { error: error.message }
  }

  redirect("/feed")
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/")
}

export async function getCurrentUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
}

export async function requestPasswordReset(email: string) {
  const supabase = await createClient()

  // First, check if the email exists in profiles (registered users)
  const { data: profileData, error: profileError } = await supabase
    .from("profiles")
    .select("user_id, email")
    .eq("email", email)
    .single()

  if (profileError || !profileData) {
    return { error: "No account found with this email address" }
  }

  // Check if the user's email is verified in auth.users
  const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers()
  
  if (usersError) {
    console.error("Error checking user verification:", usersError)
    // Fallback: try to send reset email anyway
  } else {
    const user = users?.find(u => u.email === email)
    
    if (!user) {
      return { error: "No account found with this email address" }
    }

    if (!user.email_confirmed_at) {
      return { error: "Email not verified. Please verify your email first before resetting your password." }
    }
  }

  // Send password reset email
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/reset-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function updatePassword(newPassword: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
