import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookistore = await cookies();
    const token = cookistore.get("accessToken")?.value || null;
    return NextResponse.json({ token });
  } catch (error) {
    console.error("Error getting auth token:", error);
  }
}
