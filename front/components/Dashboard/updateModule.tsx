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
import { Pen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { useToast } from "@/hooks/use-toast";
import { UpdateModule } from "@/actions/projects/moduleActions";

export function UpdateModuleDialog({
  moduleData,
}: {
  moduleData: { title: string; ModuleID: string };
}) {
  const [title, setTitle] = useState(moduleData.title);
  const { toast } = useToast();
  useEffect(() => {
    console.log("Module Data", moduleData);
    setTitle(moduleData.title);
  }, [moduleData]);
  const handleTaskSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await UpdateModule(title, moduleData.ModuleID);
    if (response.success) {
      toast({
        title: "Success",
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
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Pen></Pen>
        </Button>
      </DialogTrigger>
      <DialogContent className="<-[100%] p-6">
        {" "}
        {/* Increased width slightly */}
        <div className="w-full  mx-auto">
          {" "}
          {/* Added max width & centered */}
          <DialogHeader className="mb-4">
            <DialogTitle>Update Task</DialogTitle>
            <DialogDescription>
              Make sure to link the task to a module. If you haven't created one
              yet, use the "Module" tab.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleTaskSubmit} className="space-y-4">
            <div>
              <Label className="text-white">Task Title</Label>
              <Input
                name="title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Development"
                className="text-white mt-2"
              />
            </div>
            <DialogFooter>
              <Button type="submit" variant="default">
                Update Module
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
