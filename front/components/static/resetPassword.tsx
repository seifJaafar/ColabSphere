"use client";
import React, { useActionState, useEffect } from "react";
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
import { resetPassword } from "@/actions/auth/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
export function ResetForm({
  className,
  userID,
  resetToken,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  userID: string;
  resetToken: string;
}) {
  const Router = useRouter();
  const { toast } = useToast();
  const [valid, setValid] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [state, formAction, isPending] = useActionState(resetPassword, {
    success: false,
    message: "",
    redirectURL: "",
  });
  useEffect(() => {
    const validate = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/auth/validateReset`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userID, resetToken }),
          }
        );
        const data = await response.json();
        if (data.valid) setValid(true);
        else setValid(false);
      } catch (e: any) {
        setValid(false);
      } finally {
        setLoading(false);
      }
    };
    if (resetToken && userID) {
      validate();
    } else {
      setLoading(false);
    }
  }, [resetToken, userID]);
  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? "Success!" : "Error",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      });
      if (state.redirectURL) {
        Router.push(state.redirectURL);
      }
    }
  }, [state]);
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {loading ? (
        <div className="text-center p-4 text-xl text-muted-foreground">
          <p>Checking reset link validity...</p>
        </div>
      ) : valid ? (
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Reset Password</CardTitle>
            <CardDescription>
              Enter your new password to reset your password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction}>
              <div className="grid gap-6">
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="new_password">New password</Label>
                    <Input
                      id="new_password"
                      type="password"
                      name="new_password"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirm_password">Confirm password</Label>
                    <Input
                      id="confirm_password"
                      type="password"
                      name="confirm_password"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    {isPending ? "Loading..." : "Reset password"}
                  </Button>
                </div>
                <div className="text-center text-sm flex justify-center gap-28">
                  <a href="/register" className="underline underline-offset-4">
                    Sign up
                  </a>
                  <a href="/login" className="underline underline-offset-4">
                    Sign In
                  </a>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center p-4 text-xl text-muted-foreground">
          <p>
            Invalid or expired reset link. Please request a new password reset.
          </p>
          <a href="/forgot-password" className="underline underline-offset-4">
            Request a new reset link
          </a>
        </div>
      )}

      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
