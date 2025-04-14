import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import api from "@/config/axios";
import { cookies } from "next/headers";
export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const pathname = url.pathname;
  try {
    const AccessResponse = await api.get("/validate").catch((error) => {
      // ✅ Explicitly handle 401 and 403 without throwing
      if (error.response?.status === 401 || error.response?.status === 403) {
        return error.response; // Return response object instead of throwing
      }
      throw error; // Re-throw other errors
    });
    if (AccessResponse.status === 200) {
      const isAuthenticated = AccessResponse.data.valid;
      if (isAuthenticated) {
        if (pathname === "/") {
          url.pathname = "/dashboard/projects";
          return NextResponse.redirect(url);
        }
        if (pathname === "/login" || pathname === "/register") {
          url.pathname = "/dashboard/projects ";
          return NextResponse.redirect(url);
        }
      } else {
        if (pathname.startsWith("/dashboard")) {
          url.pathname = "/login";
          return NextResponse.redirect(url);
        }
      }
    } else {
      if (pathname.startsWith("/dashboard")) {
        url.pathname = "/login";
        return NextResponse.redirect(url);
      }
    }
  } catch (error: any) {
    console.error(error);
  }

  return NextResponse.next();
}

// 🌍 Apply Middleware to Specific Paths
export const config = {
  matcher: ["/", "/dashboard/:path*"], // Apply to these routes
};
