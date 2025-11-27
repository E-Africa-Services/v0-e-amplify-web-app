import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { data, error } = await supabase.from("credits").select("balance").eq("user_id", user.id).single()

    if (error && error.code !== "PGRST116") throw error

    const balance = data?.balance || 0

    return NextResponse.json({
      success: true,
      balance,
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch balance",
      },
      { status: 500 },
    )
  }
}
