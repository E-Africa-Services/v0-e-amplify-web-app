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
    const { amount, paymentMethod } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    if (!paymentMethod || !["paystack", "stripe"].includes(paymentMethod)) {
      return NextResponse.json({ error: "Invalid payment method" }, { status: 400 })
    }

    const { data: payment, error } = await supabase
      .from("payments")
      .insert({
        user_id: user.id,
        amount: Math.round(amount * 100),
        currency: "NGN",
        payment_method: paymentMethod,
        payment_status: "pending",
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      amount,
      paymentMethod,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fund wallet",
      },
      { status: 500 },
    )
  }
}
