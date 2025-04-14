"use client";
import React, { useEffect, useState } from "react";
import { getLocalTimeZone, today, DateValue } from "@internationalized/date";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddModule, GetModules } from "@/actions/projects/moduleActions";
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

export function AddTaskDialog({ projectID }: { projectID: string }) {
  const [modules, setModule] = useState<string[]>([]);
  const [moduleTitle, setModuleTitle] = useState("");
  const [DueDate, setDueDate] = useState("");
  const [task, setTask] = useState({
    title: "",
    dueDate: "" as DateValue | string, // Either DateValue or string
    difficulty: "",
    priority: "",
    status: "",
    module: "",
  });
  const { toast } = useToast();

  const handleTaskSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Ensure dueDate is correctly formatted
    if (DueDate) {
      const { year, month, day } = DueDate;
      console.log(year, month, day);
      const convertedDueDate = new Date(year, month - 1, day);
      setTask({ ...task, dueDate: convertedDueDate }); // Save ISO string as dueDate
    }

    // Make API call to add task
    const response = await AddTask(task, projectID);
    toast({
      title: response.success ? "Success!" : "Error",
      description: response.message,
      variant: response.success ? "default" : "destructive",
    });
    if (response.success) {
      window.location.reload(); // Reload the page to fetch updated tasks
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await AddModule(moduleTitle, projectID);
    toast({
      title: response.success ? "Success!" : "Error",
      description: response.message,
      variant: response.success ? "default" : "destructive",
    });
    if (response.success) {
      window.location.reload(); // Reload the page to fetch updated modules
    }
  };

  const fetchModules = async () => {
    const response = await GetModules(projectID);
    if (response.success && response.modules && response.modules.length > 0) {
      const modules = response.modules.map((mod: any) => mod.title);
      setModule(modules);
    }
  };

  useEffect(() => {
    fetchModules();
  }, [projectID]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size="lg">
          Add New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="<-[100%] p-6">
        {" "}
        {/* Increased width slightly */}
        <Tabs defaultValue="task" className="w-full">
          <TabsList className="inline-flex gap-2 mb-4">
            <TabsTrigger value="task">Task</TabsTrigger>
            <TabsTrigger value="module">Module</TabsTrigger>
          </TabsList>

          <TabsContent value="task">
            <div className="w-full  mx-auto">
              {" "}
              {/* Added max width & centered */}
              <DialogHeader className="mb-4">
                <DialogTitle>Create Task</DialogTitle>
                <DialogDescription>
                  Make sure to link the task to a module. If you haven't created
                  one yet, use the "Module" tab.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleTaskSubmit} className="space-y-4">
                <div>
                  <Label className="text-white">Task Title</Label>
                  <Input
                    name="title"
                    required
                    value={task.title}
                    onChange={(e) =>
                      setTask({ ...task, title: e.target.value })
                    }
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
                    value={
                      DueDate ? (DueDate as unknown as DateValue) : undefined
                    }
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
                      onValueChange={(value) =>
                        setTask({ ...task, status: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Status</SelectLabel>
                          <SelectItem value="not_started">
                            Not started
                          </SelectItem>
                          <SelectItem value="in_progress">
                            In progress
                          </SelectItem>
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
                      onValueChange={(value) =>
                        setTask({ ...task, module: value })
                      }
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
                    Create Task
                  </Button>
                </DialogFooter>
              </form>
            </div>
          </TabsContent>

          <TabsContent value="module">
            <div className="w-full max-w-[450px] mx-auto">
              <DialogHeader className="mb-4">
                <DialogTitle>Create Module</DialogTitle>
                <DialogDescription>
                  Add a new module for tasks.
                </DialogDescription>
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
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
