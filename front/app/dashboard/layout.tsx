import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/app/provider";
import "@/app/globals.css";
import { Toaster } from "@/components/ui/toaster";
import { SocketProvider } from "@/providers/socketProvider";

import { AppSidebar } from "@/components/Dashboard/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dashboard",
  description: "ColabSphere's UX Friendly Dashboard",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          <SidebarProvider>
            <SocketProvider>
              {" "}
              {/* Now properly wrapping children */}
              <AppSidebar />
              <SidebarInset>{children}</SidebarInset>
              <Toaster />
            </SocketProvider>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
