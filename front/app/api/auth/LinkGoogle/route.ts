import { NextResponse } from "next/server";

const API_BASE_URL = process.env.API;
export async function GET() {
  return NextResponse.redirect(`${API_BASE_URL}/authService/auth/linkGoogle`);
}
