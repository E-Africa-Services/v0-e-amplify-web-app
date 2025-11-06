"use server"

import { createClient } from "@/lib/supabase/server"
import { createServiceRoleClient } from "@/lib/supabase/service"
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

  // Check if email already exists in profiles table
  try {
    const { data: existingProfile, error: checkError } = await supabase
      .from("profiles")
      .select("email")
      .eq("email", email.toLowerCase())
      .maybeSingle()

    if (existingProfile) {
      return { error: "This email is already registered. Please sign in instead." }
    }

    // If there's a query error (not "not found"), log it but continue
    if (checkError && !checkError.message.includes("no rows")) {
      console.error("Error checking email uniqueness:", checkError)
    }
  } catch (err) {
    console.error("Unexpected error checking email:", err)
    // Continue with signup even if check fails
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
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/callback?next=/login?verified=true`,
    },
  })

  if (authError) {
    // Return user-friendly error messages
    if (authError.message.includes("already registered") || 
        authError.message.includes("User already registered")) {
      return { error: "This email is already registered. Please sign in instead." }
    }
    return { error: authError.message }
  }

  if (!authData.user) {
    return { error: "Failed to create account. Please try again." }
  }
  const userId = authData.user.id

  if (!userId) {
    return { error: "Failed to create account. Please try again." }
  }

  if (authData.user) {
    // Create profile with all onboarding data using service role client when possible
    let profileError = null
    try {
      let serviceClient
      try {
        serviceClient = createServiceRoleClient()
      } catch (e) {
        // Service role not available in this environment; we'll fallback to user client
        serviceClient = null
      }

      const profilePayload = {
        user_id: authData.user.id,
        name: fullName,
        email: email,
        goal: goal || null,
        bio: whyHere || null,
      }

      if (serviceClient) {
        const { error } = await serviceClient.from("profiles").insert(profilePayload)
        profileError = error
      } else {
        const { error } = await supabase.from("profiles").insert(profilePayload)
        profileError = error
      }
    } catch (err) {
      console.error("Unexpected error creating profile:", err)
      profileError = { message: String(err) }
    }

    if (profileError) {
      // If profile exists, ignore. Otherwise log and continue (do not block signup)
      const msg = String(profileError.message || profileError)
      if (msg.includes("duplicate") || msg.includes("unique") || msg.includes("already exists")) {
        console.log("Profile already exists for user:", authData.user.id)
      } else {
        console.error("Error creating user profile:", profileError)
        // Don't block account creation — return success but inform client to finish profile
        return { error: "Account created but profile setup failed. Please complete your profile in settings." }
      }
    }

    // Insert skills if provided
    if (skills) {
      const skillsArray = skills.split(",").map((skill) => skill.trim()).filter(Boolean)

      if (skillsArray.length > 0) {
        // Try to find profile id
        let profileData = null
        try {
          // First try with regular client (should work if profile was just created)
          const { data, error } = await supabase.from("profiles").select("id").eq("user_id", userId).single()
          if (!error && data) {
            profileData = data
          } else {
            console.log("Could not fetch profile for skills insertion:", error?.message)
          }
        } catch (e) {
          console.error("Error fetching profile id for skills insertion:", e)
        }

        if (profileData) {
          const skillsToInsert = skillsArray.map((skill) => ({
            profile_id: profileData.id,
            skill_name: skill,
          }))

          // Try to insert skills - don't block signup if this fails
          try {
            let skillsInserted = false
            
            // Try service client first if available
            try {
              const serviceClient = createServiceRoleClient()
              const { error } = await serviceClient.from("skills").insert(skillsToInsert)
              if (!error) {
                skillsInserted = true
              } else {
                console.log("Service client skills insert failed, trying regular client:", error.message)
              }
            } catch (serviceError) {
              console.log("Service client not available or failed, using regular client")
            }

            // Fallback to regular client if service client failed
            if (!skillsInserted) {
              const { error } = await supabase.from("skills").insert(skillsToInsert)
              if (error) {
                console.log("Skills insertion failed (can be added later in settings):", error.message)
              } else {
                skillsInserted = true
              }
            }

            if (skillsInserted) {
              console.log(`Successfully inserted ${skillsToInsert.length} skill(s)`)
            }
          } catch (e) {
            console.log("Skills insertion skipped (can be added in settings):", e)
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

  // Send password reset email with 24 hours expiration
  // Supabase will redirect to this URL after verifying the token
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

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { error: "User not authenticated" }
  }

  // Update to new password
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

// For settings page - change password when user knows their old password
export async function changePassword(oldPassword: string, newPassword: string) {
  const supabase = await createClient()

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { error: "User not authenticated" }
  }

  // Check if new password is the same as old password
  if (oldPassword === newPassword) {
    return { error: "New password must be different from your current password" }
  }

  // Verify the old password is correct by attempting to sign in
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: oldPassword,
  })
  
  if (signInError) {
    return { error: "Current password is incorrect" }
  }

  // Update to new password
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
