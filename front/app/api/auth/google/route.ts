import { NextResponse, NextRequest } from "next/server";

const API_BASE_URL = process.env.API;
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  console.log(userId);
  if (userId) {
    return NextResponse.redirect(
      `${API_BASE_URL}/authService/auth/googleAuth?userId=${userId}`
    );
  }
  return NextResponse.redirect(`${API_BASE_URL}/authService/auth/googleAuth`);
}
