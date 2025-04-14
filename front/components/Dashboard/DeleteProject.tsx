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
import { DeleteProject } from "@/actions/projects/projectActions";

import { Button } from "@/components/ui/button";

import { useToast } from "@/hooks/use-toast";

export function DeleteProjectDialog({ projectData }: { projectData: any }) {
  const { toast } = useToast();

  const handleSubmit = async () => {
    const response = await DeleteProject(projectData.id);
    if (response.success) {
      toast({
        title: "Success !",
        description: "Project deleted successfully",
      });
      window.location.reload();
    } else {
      toast({
        title: "Error !",
        description: "Project could not be deleted",
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
          <DialogTitle>Delete Project</DialogTitle>
        </DialogHeader>
        <div className="flex w-full h-full my-3 text-white">
          <p>
            Are you sure you want to delete the " {projectData.title} " project
            ?
          </p>
        </div>
        <DialogFooter>
          <Button variant="destructive" className="mr-2" onClick={handleSubmit}>
            Delete project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
