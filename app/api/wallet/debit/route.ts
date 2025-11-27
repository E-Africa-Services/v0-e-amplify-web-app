import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { amount, description } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    // Get current balance
    const { data: wallet, error: walletError } = await supabase
      .from("credits")
      .select("balance")
      .eq("user_id", user.id)
      .single()

    if (walletError) throw walletError

    if (!wallet || wallet.balance < amount) {
      return NextResponse.json({ error: "Insufficient wallet balance" }, { status: 400 })
    }

    // Debit wallet
    const newBalance = wallet.balance - amount

    const { error: updateError } = await supabase.from("credits").update({ balance: newBalance }).eq("user_id", user.id)

    if (updateError) throw updateError

    // Log transaction
    const { error: logError } = await supabase.from("credit_transactions").insert({
      user_id: user.id,
      amount: -amount,
      type: "debit",
      description: description || "Wallet debit",
    })

    if (logError) throw logError

    return NextResponse.json({
      success: true,
      debitedAmount: amount,
      newBalance,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to debit wallet",
      },
      { status: 500 },
    )
  }
}
