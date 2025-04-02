import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.API;

export async function POST(req: NextRequest) {
  try {
    const { accessToken, refreshToken, username, email, id } = await req.json();

    // Validate required fields
    if (!id || !username || !email || !accessToken || !refreshToken) {
      return NextResponse.json(
        { error: "Missing required user data or tokens." },
        { status: 400 }
      );
    }

    // Set cookies securely
    const cookieStore = await cookies();
    cookieStore.set("refreshToken", refreshToken, {
      maxAge: 7 * 24 * 60 * 60, // 7 days
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/", // Ensures cookies are sent across all routes
    });

    cookieStore.set("accessToken", accessToken, {
      maxAge: 15 * 60, // 15 minutes
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return NextResponse.json(
      { message: "Tokens stored successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error storing tokens:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
