"use client";
import React, { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddModule } from "@/actions/projects/moduleActions";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function AddModuleDialog({ projectID }: { projectID: string }) {
  const [moduleTitle, setModuleTitle] = useState("");

  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await AddModule(moduleTitle, projectID);
    toast({
      title: response.success ? "Success!" : "Error",
      description: response.message,
      variant: response.success ? "default" : "destructive",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="">
          Create Module
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="mb-4">
          <DialogTitle>Create Module</DialogTitle>
          <DialogDescription>Add a new module for tasks.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="text-white">Module Title</Label>
            <Input
              name="moduleTitle"
              required
              value={moduleTitle}
              onChange={(e) => setModuleTitle(e.target.value)}
              placeholder="Module #1"
              className="text-white mt-2"
            />
          </div>
          <DialogFooter>
            <Button type="submit" variant="default">
              Create Module
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
