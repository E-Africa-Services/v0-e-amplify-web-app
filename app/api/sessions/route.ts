import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const searchParams = request.nextUrl.searchParams
  const upcoming = searchParams.get("upcoming") === "true"
  const limit = parseInt(searchParams.get("limit") || "10")

  try {
    let query = supabase
      .from("sessions")
      .select(
        `
        id,
        title,
        description,
        scheduled_at,
        duration_minutes,
        price,
        status,
        mentor_id,
        mentee_id,
        profiles:mentor_id(id, name, avatar_url, role)
      `
      )

    if (upcoming) {
      const now = new Date().toISOString()
      query = query.gte("scheduled_at", now)
    }

    const { data, error } = await query
      .order("scheduled_at", { ascending: true })
      .limit(limit)

    if (error) throw error

    return NextResponse.json({
      data: data?.map((session: any) => ({
        ...session,
        mentor: session.profiles,
      })),
    })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch sessions" },
      { status: 500 }
    )
  }
}
