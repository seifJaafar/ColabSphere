"use client";
import React, { useActionState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { getLocalTimeZone, today } from "@internationalized/date";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DateInput } from "@heroui/date-input";
import { AddProject } from "@/actions/projects/projectActions";
import { useToast } from "@/hooks/use-toast";
export function CreateProjectForm() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { toast } = useToast();
  const [state, formAction, isPending] = useActionState(AddProject, {
    success: false,
    message: "",
    redirectURL: "", // Ensure this matches the expected return type of registerUser
  });
  useEffect(() => {
    if (state.message) {
      toast({
        title: state.success ? "Success!" : "Error",
        description: state.message,
        variant: state.success ? "default" : "destructive",
      });
    }
    if (state.success) {
      window.location.reload();
    }
  }, [state]);
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="default">
            <Plus />
            New project
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Start New Project</DialogTitle>
            <DialogDescription>
              Fill out the form below to start a new project
            </DialogDescription>
          </DialogHeader>
          <ProjectForm formAction={formAction} isPending={isPending} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="default">
          <Plus />
          New project
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Start New Project</DrawerTitle>
          <DrawerDescription>
            Fill out the form below to start a new project
          </DrawerDescription>
        </DrawerHeader>
        <ProjectForm
          className="px-4"
          formAction={formAction}
          isPending={isPending}
        />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function ProjectForm({
  className,
  formAction,
  isPending,
}: React.ComponentProps<"form"> & { formAction: any; isPending: boolean }) {
  return (
    <form
      className={cn("grid items-start gap-4", className)}
      action={formAction}
    >
      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          type="title"
          id="title"
          defaultValue="Project #1"
          name="title"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="DueDate">Due Date</Label>
        <DateInput
          className="max-w-sm"
          label={"Due date"}
          name="DueDate"
          variant="bordered"
          size="sm"
          errorMessage={(value) => {
            if (value.isInvalid) {
              return "Please enter a valid date later than today";
            }
          }}
          isRequired
          minValue={today(getLocalTimeZone()) as any}
        />
      </div>

      <Button type="submit">
        {isPending ? (
          <>
            <Loader2 className="animate-spin" />
            Please wait
          </>
        ) : (
          "Create Project"
        )}
      </Button>
    </form>
  );
}
