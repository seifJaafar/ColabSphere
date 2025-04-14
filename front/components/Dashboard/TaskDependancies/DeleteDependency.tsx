"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteDependency } from "@/actions/projects/TaskDependancies";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function DeleteDependencyDialog({
  DepID,
  open,
  onOpenChange,
}: {
  DepID: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { toast } = useToast();
  const handleDeleteDependency = async () => {
    try {
      const response = await deleteDependency(DepID);
      if (response.success) {
        toast({
          title: "Success !",
          description: "Dependency deleted successfully",
        });
        onOpenChange(false);
        window.location.reload();
      } else {
        toast({
          title: "Error !",
          description: "Dependency could not be deleted",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting dependency:", error);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-6">
        <DialogHeader>
          <DialogTitle>Delete Dependency</DialogTitle>
        </DialogHeader>
        <div className="flex w-full h-full my-3 text-white">
          <p>Are you sure you want to delete this dependency?</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteDependency} // Call the delete function here
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
