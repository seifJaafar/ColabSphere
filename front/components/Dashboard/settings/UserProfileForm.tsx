"use client";
import React, { useActionState, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Check, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { UpdateProfile } from "@/actions/auth/UserActions";
import { useUserStore } from "@/config/UserStore";
import { useRouter } from "next/navigation";
import { User } from "@heroui/user";
export function ProfileForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const handleRefresh = () => {
    setEmail(user?.email);
    setUsername(user?.username);
    setAvatar(user?.avatar);
  };
  const handleCancel = () => {
    setEmail("");
    setUsername("");
    setAvatar("");
  };
  const { toast } = useToast();
  const [state, formAction, isPending] = useActionState(UpdateProfile, {
    success: false,
    message: "",
    data: {
      email: user.email,
      username: user.username,
      avatar: user.avatar,
      id: user.id,
    }, // Ensure this matches the expected return type of registerUser
  });
  useEffect(() => {
    setEmail(user?.email);
    setUsername(user?.username);
    setAvatar(user?.avatar);
  }, [user]);
  useEffect(() => {
    if (state && state.message) {
      toast({
        title: state.success ? "Success!" : "Error",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      });
      if (state.data) {
        setUser(state.data);
        setEmail(state.data.email);
        setUsername(state.data.username);
        setAvatar(state.data.avatar);
      }
    }
  }, [state]);
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setAvatar(URL.createObjectURL(file));
    }
  };
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form action={formAction}>
        <div className="grid grid-cols-2 gap-6">
          <Input name="id" type="hidden" value={user.id} />
          <div className="grid gap-2 w-[60%] ">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              placeholder="m@example.com"
              defaultValue={user?.email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2 w-[60%] ">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              name="username"
              placeholder="Username"
              defaultValue={user?.username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2 w-[60%]">
            <Label htmlFor="avatar">Avatar</Label>
            <Input
              id="avatar"
              type="file"
              name="avatar"
              placeholder="Avatar"
              onChange={handleAvatarChange}
            />
          </div>
          <div className="grid gap-2">
            <User
              avatarProps={{
                src: avatar,
                alt: "Avatar",
              }}
              description={email}
              name={username}
              className="justify-start"
            />
          </div>
        </div>
        <div className="flex justify-center items-center gap-10 mt-10 mx-auto">
          <Button size={"lg"} disabled={isPending} type="submit">
            {isPending ? <Loader2 className="animate-spin" /> : <Check />}
            {isPending ? "Update..." : "Update profile"}
          </Button>
          <Button
            variant={"secondary"}
            size={"lg"}
            disabled={isPending}
            type="button"
            onClick={handleRefresh}
          >
            <RefreshCcw />
            Refresh
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
