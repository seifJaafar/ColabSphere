"use client";
import React, { useActionState, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Check, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { UpdatePassword } from "@/actions/auth/UserActions";
import { useUserStore } from "@/config/UserStore";

export function UpdatePasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const user = useUserStore((state) => state.user);
  const [previousPassword, setPreviousPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleCancel = () => {
    setPreviousPassword("");
    setNewPassword("");
  };
  const { toast } = useToast();
  const [state, formAction, isPending] = useActionState(UpdatePassword, {
    success: false,
    message: "", // Ensure this matches the expected return type of registerUser
  });

  useEffect(() => {
    if (state && state.message) {
      toast({
        title: state.success ? "Success!" : "Error",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      });
    }
  }, [state]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form action={formAction}>
        <div className="grid grid-cols-2 gap-6">
          <Input name="id" type="hidden" value={user.id} />
          <div className="grid gap-2 w-[60%] ">
            <Label htmlFor="previous_password">Previous password</Label>
            <Input
              id="previous_password"
              type={showPassword ? "text" : "password"}
              name="previous_password"
              onChange={(e) => setPreviousPassword(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2 w-[60%] ">
            <Label htmlFor="new_password">New password</Label>
            <div className="flex gap-2">
              <Input
                id="new_password"
                type={showPassword ? "text" : "password"}
                name="new_password"
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <Button
                variant={"outline"}
                size="icon"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </Button>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center gap-10 mt-10 mx-auto">
          <Button size={"lg"} disabled={isPending} type="submit">
            {isPending ? <Loader2 className="animate-spin" /> : <Check />}
            {isPending ? "Update..." : "Update password"}
          </Button>
          <Button
            variant={"destructive"}
            size={"lg"}
            disabled={isPending}
            type="button"
            onClick={handleCancel}
          >
            <X size={5} />
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
