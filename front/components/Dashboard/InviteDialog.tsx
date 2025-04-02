"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Check, Plus, X, AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { InviteByemails } from "@/actions/projects/projectActions";
import { useToast } from "@/hooks/use-toast";
export function InviteDialog({ projectID }: { projectID: string }) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const [emails, setEmails] = useState<{ email: string; valid: boolean }[]>([]);
  const Link = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/dashboard/invite/${projectID}`;
  const handleInvite = async (emails: any, projectID: string) => {
    try {
      const response = await InviteByemails(emails, projectID);
      if (response.success) {
        toast({
          title: "Success!",
          description: response.message,
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: response.message,
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(err);
    }
  };
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(Link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Email validation regex
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && event.currentTarget.value.trim()) {
      event.preventDefault();
      const newEmail = event.currentTarget.value.trim();

      if (!emails.some((e) => e.email === newEmail)) {
        setEmails([
          ...emails,
          { email: newEmail, valid: isValidEmail(newEmail) },
        ]);
      }
      event.currentTarget.value = "";
    }
  };

  // Remove an email
  const handleDelete = (emailToRemove: string) => {
    setEmails(emails.filter((e) => e.email !== emailToRemove));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" title="Invite Members">
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="mb-5">
          <DialogTitle>Invite Members</DialogTitle>
          <DialogDescription>Invite new members to the team</DialogDescription>
        </DialogHeader>

        {/* Invite Link Section */}
        <div className="flex justify-center items-center w-full gap-4 text-muted">
          <Input value={Link} className="text-white" readOnly />
          <Button
            variant="secondary"
            size="default"
            title="Copy to clipboard"
            onClick={copyToClipboard}
          >
            {copied ? <Check className="text-green-600" /> : <Copy />}
          </Button>
        </div>
        <DialogDescription className="ml-2">
          Invite using the web URL
        </DialogDescription>
        <Separator className="my-2" />

        {/* Email Input Section */}
        <div>
          <Input
            placeholder="Enter email and press Enter"
            onKeyDown={handleKeyDown}
          />
          <DialogDescription className="ml-2 mt-3">
            Invite using email
          </DialogDescription>

          {/* Emails List */}
          <div className="mt-3 flex flex-wrap gap-2">
            {emails.map(({ email, valid }) => (
              <div
                key={email}
                className={`flex items-center px-3 py-1 rounded-lg text-white ${
                  valid ? "bg-gray-700" : "bg-red-600"
                }`}
              >
                <div className="flex items-center">
                  {!valid && (
                    <AlertCircle className="w-4 h-4 mr-2 text-white" />
                  )}
                  <span>{email}</span>
                  <button onClick={() => handleDelete(email)}>
                    <X className="h-4 w-4 ml-2 text-white hover:text-gray-300" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="default"
            size="default"
            onClick={() => {
              handleInvite(emails, projectID);
            }}
          >
            <span>Invite Members</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
