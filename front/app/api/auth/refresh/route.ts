import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.API;

export async function POST(req: NextRequest) {
  try {
    const { refreshToken } = await req.json();

    if (!refreshToken) {
      console.log("No refresh token found.");
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const response = await fetch(`${API_BASE_URL}/authService/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      console.log("Failed to refresh token:", response.status);
      return NextResponse.redirect(new URL("/login", req.url));
    }
    const data = await response.json();
    const { accessToken, newRefreshToken } = data;

    return NextResponse.json({ accessToken, newRefreshToken }, { status: 200 });
  } catch (error) {
    console.error("Internal server error:", error);
    return NextResponse.json(
      { error: "Internal Server Error refreshing" },
      { status: 500 }
    );
  }
}
