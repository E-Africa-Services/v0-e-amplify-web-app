"use server"

import { createClient } from "@/lib/supabase/server"

export async function getWalletBalance(userId: string) {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase.from("credits").select("balance").eq("user_id", userId).single()

    if (error && error.code !== "PGRST116") throw error

    return { balance: data?.balance || 0 }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to fetch wallet balance",
    }
  }
}

export async function fundWallet(userId: string, amount: number, paymentMethod: string) {
  const supabase = await createClient()

  if (amount <= 0) {
    return { error: "Amount must be greater than 0" }
  }

  try {
    // Create payment record
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .insert({
        user_id: userId,
        amount,
        currency: "NGN",
        payment_method: paymentMethod,
        payment_status: "pending",
      })
      .select()
      .single()

    if (paymentError) throw paymentError

    return { success: true, paymentId: payment.id }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to fund wallet",
    }
  }
}

export async function debitWallet(userId: string, amount: number, description: string) {
  const supabase = await createClient()

  if (amount <= 0) {
    return { error: "Amount must be greater than 0" }
  }

  try {
    const { data: wallet, error: walletError } = await supabase
      .from("credits")
      .select("balance")
      .eq("user_id", userId)
      .single()

    if (walletError) throw walletError

    if (!wallet || wallet.balance < amount) {
      return { error: "Insufficient wallet balance" }
    }

    // Debit wallet
    const { error: updateError } = await supabase
      .from("credits")
      .update({ balance: wallet.balance - amount })
      .eq("user_id", userId)

    if (updateError) throw updateError

    // Log transaction
    await supabase.from("credit_transactions").insert({
      user_id: userId,
      amount: -amount,
      type: "debit",
      description,
    })

    return { success: true, newBalance: wallet.balance - amount }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to debit wallet",
    }
  }
}

export async function getWalletTransactions(userId: string, limit = 20, offset = 0) {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from("credit_transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error

    return { transactions: data }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Failed to fetch transactions",
    }
  }
}
