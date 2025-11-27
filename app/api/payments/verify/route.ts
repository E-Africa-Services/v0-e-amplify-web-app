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
    const { reference } = await request.json()

    if (!reference) {
      return NextResponse.json({ error: "Reference is required" }, { status: 400 })
    }

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY
    if (!paystackSecretKey) {
      return NextResponse.json({ error: "Payment gateway not configured" }, { status: 500 })
    }

    // Verify with Paystack
    const verifyResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
      },
    })

    const verifyData = await verifyResponse.json()

    if (!verifyData.status || verifyData.data.status !== "success") {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 })
    }

    const amountInNaira = verifyData.data.amount / 100

    // Update payment record
    const { error: updateError } = await supabase
      .from("payments")
      .update({
        payment_status: "completed",
        paystack_reference: reference,
        paystack_transaction_id: verifyData.data.id,
        completed_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .eq("paystack_reference", reference)

    if (updateError) throw updateError

    // Add credits to user
    const { data: wallet } = await supabase.from("credits").select("balance").eq("user_id", user.id).single()

    const newBalance = (wallet?.balance || 0) + amountInNaira

    const { error: creditError } = await supabase
      .from("credits")
      .upsert({
        user_id: user.id,
        balance: newBalance,
      })
      .eq("user_id", user.id)

    if (creditError) throw creditError

    // Log transaction
    await supabase.from("credit_transactions").insert({
      user_id: user.id,
      amount: amountInNaira,
      type: "payment",
      description: `Payment of ₦${amountInNaira} via Paystack (Ref: ${reference})`,
    })

    return NextResponse.json({
      success: true,
      amount: amountInNaira,
      newBalance,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to verify payment",
      },
      { status: 500 },
    )
  }
}
