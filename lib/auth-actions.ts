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
    return { error: authError.message }
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
      return { error: "Failed to create profile. Please try again." }
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
          return { error: "Failed to save skills. Please update them later in your profile." }
        }

        if (profileData) {
          const skillsToInsert = skillsArray.map((skill) => ({
            profile_id: profileData.id,
            skill_name: skill,
          }))

          const { error: skillsError } = await supabase.from("skills").insert(skillsToInsert)
          
          if (skillsError) {
            console.error("Error inserting skills:", skillsError)
            return { error: "Failed to save skills. Please update them later in your profile." }
          }
        }
      }
    }
  }
  
  return { success: true }
}

export async function signIn(email: string, password: string) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  redirect("/dashboard")
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
