import { NextResponse, NextRequest } from "next/server";
import api from "@/config/axios";
import { cookies } from "next/headers";
export async function POST(req: NextRequest) {
  try {
    const { userID, resetToken } = await req.json();
    if (!userID || !resetToken) {
      return NextResponse.json({
        valid: false,
        message: "Invalid or expired reset token",
      });
    }
    const response = await api.get(
      `/authService/auth/validateReset/${userID}/${resetToken}`
    );
    if (response?.data?.valid && response?.data?.TempToken) {
      const cookieStore = await cookies();
      const tempToken = response.data.TempToken;
      cookieStore.delete("sidebar:state");
      cookieStore.set("accessToken", tempToken, {
        maxAge: 1 * 24 * 60 * 60,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      cookieStore.set("id", userID, {
        maxAge: 15 * 60,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      return NextResponse.json({ valid: true }, { status: 200 });
    } else {
      return NextResponse.json(
        { valid: false, message: "Invalid or expired reset token" },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        valid: false,
        message: error.response?.data.message || "Internal server error",
      },
      { status: error.response?.status || 500 }
    );
  }
}
