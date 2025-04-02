"use client";
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User } from "@heroui/user";
import { useUserStore } from "@/config/UserStore";
import { useRouter } from "next/navigation";
interface ConfirmFormProps extends React.ComponentPropsWithoutRef<"div"> {
  username: string;
  email: string;
  avatar: string;
  id: string;
  accessToken: string;
  refreshToken: string;
}
export function ConfirmForm({
  className,
  username,
  email,
  avatar,
  accessToken,
  refreshToken,
  id,
  ...props
}: ConfirmFormProps) {
  const Router = useRouter();
  const setUser = useUserStore((state) => state.setUser);
  const { toast } = useToast();
  console.log("avatar", avatar);
  const handleConfirm = async () => {
    try {
      const data = {
        accessToken,
        refreshToken,
        username,
        email,
        id,
      };
      const response = await fetch("/api/auth/confirmLogging", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        toast({
          title: "Error",
          description: "Error confirming your information",
          variant: "destructive",
        });
      }
      setUser({
        username,
        email,
        avatar,
        id,
      });
      toast({
        title: "Success",
        description: "Your information has been confirmed",
        variant: "default",
      });
      Router.push("/dashboard/projects");
    } catch (e) {
      toast({
        title: "Error",
        description: "Error confirming your information",
        variant: "destructive",
      });
    }
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Confirm your information</CardTitle>
          <CardDescription>
            confirm your information to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 mt-4">
            <div className="grid">
              <User
                avatarProps={{
                  src:
                    avatar && avatar !== "null" && avatar !== ""
                      ? avatar
                      : "/Seifjaafar.webp",
                  alt: "Avatar",
                }}
                description={email}
                name={username}
                className="justify-start"
              />
            </div>
          </div>
        </CardContent>
        <CardContent>
          <div className="flex items-center justify-between gap-6 mt-4">
            <Button onClick={handleConfirm} variant="default" size="lg">
              Continue
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => {
                Router.push("/");
              }}
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
