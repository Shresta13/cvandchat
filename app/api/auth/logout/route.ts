import { NextResponse } from "next/server"

export async function POST() {
  const res = NextResponse.json({ success: true })
  
  // Clear the auth cookie
  res.cookies.set("auth", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0, // Expire immediately
  })

  return res
}
