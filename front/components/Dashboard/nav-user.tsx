"use client";

import { BadgeCheck, Bell, ChevronsUpDown, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUserStore } from "@/config/UserStore";
import { Avatar } from "@heroui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { logoutUser } from "@/actions/auth/actions";
import { useRouter } from "next/navigation";

export function NavUser({
  user,
}: {
  user: {
    username: string;
    email: string;
    avatar: string | null;
  };
}) {
  const { isMobile } = useSidebar();
  const { toast } = useToast();
  const Router = useRouter();
  const logout = useUserStore((state) => state.logout);
  const handleLogout = async () => {
    try {
      const response = await logoutUser();
      if (response.success) {
        logout();
        toast({
          title: "Goodbye!",
          description: response.message,
          variant: "default",
        });
        Router.push("/login");
      } else {
        toast({
          title: "Error!",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (e: any) {
      toast({
        title: "Error!",
        description:
          e.response?.data?.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar
                showFallback
                name={user.username || "unkown"}
                src={user.avatar || undefined}
                radius="lg"
              />

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.username}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar
                  showFallback
                  name={user.username || "unkown"}
                  src={user.avatar || undefined}
                />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {user.username}
                  </span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={() => Router.push("/dashboard/settings")}
              >
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
