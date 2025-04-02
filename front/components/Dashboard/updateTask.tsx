"use client";
import React, { useEffect, useState } from "react";
import {
  getLocalTimeZone,
  today,
  DateValue,
  CalendarDate,
} from "@internationalized/date";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GetModules } from "@/actions/projects/moduleActions";
import { updateTask } from "@/actions/projects/TaskActions";
import { Pen, Trash2 } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DateInput } from "@heroui/react";
import { useToast } from "@/hooks/use-toast";
import { AddTask } from "@/actions/projects/TaskActions";

export function UpdateTaskDialog({ taskData }: { taskData: any }) {
  const [modules, setModule] = useState<string[]>([]);
  const [moduleTitle, setModuleTitle] = useState("");
  const [DueDate, setDueDate] = useState(null as DateValue | null);
  const [task, setTask] = useState({
    title: "",
    dueDate: "" as DateValue | string, // Either DateValue or string
    difficulty: "",
    priority: "",
    status: "",
    module: "",
  });
  const { toast } = useToast();
  useEffect(() => {
    const parsedDate = new Date(taskData.dueDate);

    // Convert to CalendarDate, required by @heroui/react
    const dateValue = new CalendarDate(
      parsedDate.getFullYear(),
      parsedDate.getMonth() + 1,
      parsedDate.getDate()
    );
    setDueDate(dateValue);

    setTask(taskData);
    setModuleTitle(taskData.module);
  }, []);
  const handleTaskSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const { year, month, day } = DueDate;
    const convertedDueDate = new Date(year, month - 1, day);
    const newTask = {
      ...task,
      dueDate: convertedDueDate,
      assignTo: taskData.assignTo,
    };

    const response = await updateTask(newTask, taskData.taskID);
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

  const fetchModules = async () => {
    const response = await GetModules(taskData.projectID);
    if (response.success && response.modules && response.modules.length > 0) {
      const modules = response.modules.map((mod: any) => mod.title);
      setModule(modules);
    }
  };

  useEffect(() => {
    fetchModules();
  }, [taskData.projectID]);

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
                value={task.title}
                onChange={(e) => setTask({ ...task, title: e.target.value })}
                placeholder="Task #1"
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
            <div className="grid grid-cols-2 gap-4">
              {" "}
              {/* Two columns for better layout */}
              <div>
                <Label htmlFor="difficulty" className="text-white mb-3">
                  Difficulty
                </Label>
                <Select
                  name="difficulty"
                  required
                  value={task.difficulty}
                  onValueChange={(value) =>
                    setTask({ ...task, difficulty: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Difficulty</SelectLabel>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority" className="text-white mb-3">
                  Priority
                </Label>
                <Select
                  name="priority"
                  value={task.priority}
                  onValueChange={(value) =>
                    setTask({ ...task, priority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Priority</SelectLabel>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status" className="text-white mb-3">
                  Status
                </Label>
                <Select
                  name="status"
                  required
                  value={task.status}
                  onValueChange={(value) => setTask({ ...task, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Status</SelectLabel>
                      <SelectItem value="not_started">Not started</SelectItem>
                      <SelectItem value="in_progress">In progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="delayed">Delayed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="module" className="text-white mb-3">
                  Module
                </Label>
                <Select
                  name="module"
                  required
                  value={task.module}
                  onValueChange={(value) => setTask({ ...task, module: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a module" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Module</SelectLabel>
                      {modules.map((mod) => (
                        <SelectItem key={mod} value={mod}>
                          {mod}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
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
