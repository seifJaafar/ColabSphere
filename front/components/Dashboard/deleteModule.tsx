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
import { DeleteModule } from "@/actions/projects/moduleActions";
import { Button } from "@/components/ui/button";

import { useToast } from "@/hooks/use-toast";

export function DeleteModuleDialog({ moduleData }: { moduleData: any }) {
  const { toast } = useToast();

  const handleSubmit = async () => {
    console.log(moduleData);
    const response = await DeleteModule(moduleData.ModuleID);
    if (response.success) {
      toast({
        title: "Success !",
        description: "Module deleted successfully",
      });
      window.location.reload();
    } else {
      toast({
        title: "Error !",
        description: "Module could not be deleted",
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
          <DialogTitle>Delete module</DialogTitle>
        </DialogHeader>
        <div className="flex w-full h-full my-3 text-white">
          <p>
            Are you sure you want to delete the " {moduleData.title} " module ?
          </p>
        </div>
        <DialogFooter>
          <Button variant="destructive" className="mr-2" onClick={handleSubmit}>
            Delete module
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
