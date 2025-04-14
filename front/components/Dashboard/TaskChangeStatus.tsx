"use client";
import React, { use, useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { updateTask } from "@/actions/projects/TaskActions";
import { Pen } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { useToast } from "@/hooks/use-toast";

export function TaskChnageStatus({
  taskStatus,
  taskID,
}: {
  taskStatus: string;
  taskID: string;
}) {
  const [newStatus, setNewStatus] = useState("");
  const { toast } = useToast();
  useEffect(() => {
    setNewStatus(taskStatus);
  }, [taskStatus]);
  const handleTaskSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const newTask = {
      status: newStatus,
    };

    const response = await updateTask(newTask, taskID);
    if (response.success) {
      toast({
        title: "Success !",
        description: "Task updated successfully",
      });
      window.location.reload();
    } else {
      toast({
        title: "Error !",
        description: "Failed to update task",
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
              <Label htmlFor="status" className="text-white mb-3">
                Status
              </Label>
              <Select
                name="status"
                required
                value={newStatus}
                onValueChange={(value) => setNewStatus(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    <SelectItem value="in_progress">In progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="delayed">Delayed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter>
              <Button type="submit" variant="default">
                Update Task
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
