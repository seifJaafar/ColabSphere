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
import { UpdateProject } from "@/actions/projects/projectActions";
import { Pen } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  getLocalTimeZone,
  today,
  DateValue,
  CalendarDate,
} from "@internationalized/date";
import { DateInput } from "@heroui/react";
import { useToast } from "@/hooks/use-toast";

export function UpdateProjectDialog({
  projectData,
}: {
  projectData: { title: string; id: string; dueDate: string };
}) {
  const [title, setTitle] = useState(projectData.title);
  const { toast } = useToast();
  const [DueDate, setDueDate] = useState(null as DateValue | null);
  useEffect(() => {
    const parsedDate = new Date(projectData.dueDate);

    // Convert to CalendarDate, required by @heroui/react
    const dateValue = new CalendarDate(
      parsedDate.getFullYear(),
      parsedDate.getMonth() + 1,
      parsedDate.getDate()
    );
    setDueDate(dateValue);

    setTitle(projectData.title);
  }, [projectData]);
  const handleTaskSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const { year, month, day } = DueDate;
    console.log("DueDate", DueDate);
    const convertedDueDate = new Date(year, month - 1, day);
    console.log("convertedDueDate", convertedDueDate);
    const response = await UpdateProject(
      projectData.id,
      title,
      convertedDueDate
    );

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
            <DialogTitle>Update Project</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleTaskSubmit} className="space-y-4">
            <div className="flex items-center gap-4">
              <div>
                <Label className="text-white">Project Title</Label>
                <Input
                  name="title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Development"
                  className="text-white mt-2"
                />
              </div>
              <div>
                <Label className="text-white ">Due Date</Label>
                <DateInput
                  label="Due date"
                  name="dueDate"
                  variant="bordered"
                  value={DueDate}
                  onChange={(date) => setDueDate(date)}
                  size="sm"
                  isRequired
                  className="mt-2"
                  minValue={today(getLocalTimeZone()) as any}
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" variant="default">
                Update Project
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
