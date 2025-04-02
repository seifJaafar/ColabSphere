"use client";
import React from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Trash2 } from "lucide-react";
import { deleteTask } from "@/actions/projects/TaskActions";
import { Button } from "@/components/ui/button";

import { useToast } from "@/hooks/use-toast";

export function DeleteTaskDialog({ taskData }: { taskData: any }) {
  const { toast } = useToast();

  const handleSubmit = async () => {
    console.log(taskData);
    const response = await deleteTask(taskData.taskID);
    if (response.success) {
      toast({
        title: "Success !",
        description: "Task deleted successfully",
      });
      window.location.reload();
    } else {
      toast({
        title: "Error !",
        description: "Task could not be deleted",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Trash2 />
        </Button>
      </DialogTrigger>
      <DialogContent className=" p-6">
        <DialogHeader>
          <DialogTitle>Delete task</DialogTitle>
        </DialogHeader>
        <div className="flex w-full h-full my-3 text-white">
          <p>Are you sure you want to delete the " {taskData.title} " task ?</p>
        </div>
        <DialogFooter>
          <Button variant="destructive" className="mr-2" onClick={handleSubmit}>
            Delete task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
