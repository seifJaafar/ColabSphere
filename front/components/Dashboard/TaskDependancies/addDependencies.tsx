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
import { addDependency } from "@/actions/projects/TaskDependancies";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export function AddDependenciesDialog({ tasks }: { tasks: any[] }) {
  const [selectedTask, setSelectedTask] = useState("");
  const [dependsonTask, setDependsOnTask] = useState("");
  const [dependencyType, setDependencyType] = useState("");

  const { toast } = useToast();
  useEffect(() => {
    console.log("Tasks in AddDependenciesDialog:", tasks);
  }, []);
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await addDependency(
      selectedTask,
      dependsonTask,
      dependencyType
    );
    if (response.success) {
      toast({
        title: "Success",
        description: response.message,
        variant: "default",
      });
      setSelectedTask("");
      setDependsOnTask("");
      setDependencyType("");
      window.location.reload(); // Reload the page to reflect changes
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
        <Button variant="default" className="">
          Create Task Dependency
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="mb-4">
          <DialogTitle>Create Dependency</DialogTitle>
          <DialogDescription>
            Add a new Dependency between tasks.
          </DialogDescription>
        </DialogHeader>
        {tasks && tasks.length > 0 ? (
          <div className="">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {" "}
                {/* Two columns for better layout */}
                <div>
                  <Label htmlFor="task" className="text-white mb-3">
                    Task
                  </Label>
                  <Select
                    name="task"
                    required
                    value={selectedTask}
                    onValueChange={(value) => setSelectedTask(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Task" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Task</SelectLabel>
                        {tasks.map((task) => (
                          <SelectItem
                            key={task.taskID}
                            value={task.taskID}
                            disabled={dependsonTask === task.taskID}
                            className={
                              dependsonTask === task.taskID ? "opacity-50" : ""
                            }
                          >
                            {task.title}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="dependsOn" className="text-white mb-3">
                    Depends On
                  </Label>
                  <Select
                    name="dependsOn"
                    value={dependsonTask}
                    onValueChange={(value) => setDependsOnTask(value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Task" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Depends on</SelectLabel>
                        {tasks.map((task) => (
                          <SelectItem
                            key={task.taskID}
                            value={task.taskID}
                            disabled={selectedTask === task.taskID}
                            className={
                              selectedTask === task.taskID ? "opacity-50" : ""
                            }
                          >
                            {task.title}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="">
                  <Label htmlFor="dependencyType" className="text-white mb-3">
                    Dependency Type
                  </Label>
                  <Select
                    name="dependencyType"
                    value={dependencyType}
                    onValueChange={(value) => setDependencyType(value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select dependency type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Dependency type</SelectLabel>
                        <SelectItem value="finish_to_start">
                          Finish to Start (F→S)
                        </SelectItem>
                        <SelectItem value="start_to_start">
                          Start to Start (S→S)
                        </SelectItem>
                        <SelectItem value="finish_to_finish">
                          Finish to Finish (F→F)
                        </SelectItem>
                        <SelectItem value="start_to_finish">
                          Start to Finish (S→F)
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" variant="default">
                  Add Dependency
                </Button>
              </DialogFooter>
            </form>
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            No tasks available to create a dependency.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
