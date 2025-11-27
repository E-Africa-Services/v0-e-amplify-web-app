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
    const { amount, email } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    // Create payment record
    const { data: payment, error } = await supabase
      .from("payments")
      .insert({
        user_id: user.id,
        amount: Math.round(amount * 100), // Convert to kobo
        currency: "NGN",
        payment_method: "paystack",
        payment_status: "pending",
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      amount,
      email: email || user.email,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to initialize payment",
      },
      { status: 500 },
    )
  }
}
