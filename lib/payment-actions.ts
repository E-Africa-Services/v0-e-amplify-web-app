"use server"

import { createClient } from "@/lib/supabase/server"

export async function initializePayment(amount: number, email: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "User not authenticated" }
  }

  if (amount <= 0) {
    return { error: "Amount must be greater than 0" }
  }

  try {
    const paystackPublicKey = process.env.NEXT_PUBLIC_PAYSTACK_KEY
    if (!paystackPublicKey) {
      return { error: "Paystack configuration missing" }
    }

    // Create payment record in database
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .insert({
        user_id: user.id,
        amount,
        currency: "NGN",
        payment_method: "paystack",
        payment_status: "pending",
      })
      .select()
      .single()

    if (paymentError) throw paymentError

    return {
      success: true,
      paymentId: payment.id,
      amount,
      email,
    }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to initialize payment",
    }
  }
}

export async function verifyPayment(reference: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "User not authenticated" }
  }

  try {
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY
    if (!paystackSecretKey) {
      return { error: "Paystack configuration missing" }
    }

    // Verify with Paystack API
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
      },
    })

    const data = await response.json()

    if (!data.status || data.data.status !== "success") {
      return { error: "Payment verification failed" }
    }

    // Update payment record
    const { error: updateError } = await supabase
      .from("payments")
      .update({
        payment_status: "completed",
        paystack_reference: reference,
        paystack_transaction_id: data.data.id,
        completed_at: new Date().toISOString(),
      })
      .eq("paystack_reference", reference)

    if (updateError) throw updateError

    // Add credits to user
    const creditAmount = Math.floor(data.data.amount / 100) // Convert from kobo to naira
    await addCredits(user.id, creditAmount, "payment")

    return { success: true, amount: creditAmount }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to verify payment",
    }
  }
}

export async function addCredits(userId: string, amount: number, type: string) {
  const supabase = await createClient()

  try {
    // Get or create credit record
    const { data: existingCredits } = await supabase.from("credits").select().eq("user_id", userId).single()

    if (existingCredits) {
      await supabase
        .from("credits")
        .update({ balance: existingCredits.balance + amount })
        .eq("user_id", userId)
    } else {
      await supabase.from("credits").insert({
        user_id: userId,
        balance: amount,
      })
    }

    // Log transaction
    await supabase.from("credit_transactions").insert({
      user_id: userId,
      amount,
      type,
      description: `Added ${amount} credits via ${type}`,
    })

    return { success: true }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to add credits",
    }
  }
}
