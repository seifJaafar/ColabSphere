"use client";
import React, { useState, useEffect } from "react";
import { DataTableComponent } from "@/components/Dashboard/DataTableComponent";
import { Badge } from "@/components/ui/badge";
import { TaskChnageStatus } from "@/components/Dashboard/TaskChangeStatus";
import { GetMyTasks } from "@/actions/projects/TaskActions";

const getDifficulityColor = (difficulty: string) => {
  switch (difficulty) {
    case "easy":
      return "bg-green-500 hover:bg-green-600";
    case "medium":
      return "bg-orange-500 hover:bg-orange-600";
    case "hard":
      return "bg-red-500 hover:bg-red-600";
    default:
      return "bg-gray-500 hover:bg-gray-600";
  }
};

const priorityColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "bg-red-500 hover:bg-red-600";
    case "medium":
      return "bg-orange-500 hover:bg-orange-600";
    case "low":
      return "bg-green-500 hover:bg-green-600";
    default:
      return "bg-gray-500 hover:bg-gray-600";
  }
};
const statusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-500 hover:bg-green-600";
    case "in-progress":
      return "bg-orange-500 hover:bg-orange-600";
    case "not-started":
      return "bg-gray-500 hover:bg-gray-600 ";
    default:
      return "bg-red-500 hover:bg-red-600";
  }
};

const formatTimestamp = (timestamp: number) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(timestamp));
};

export function MyTasksDataTable({ projectID }: { projectID: string }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await GetMyTasks(projectID);
      if (response.success) {
        setTasks(response.tasks);
      } else {
        setTasks([]);
      }
    };
    fetchTasks();
  }, [projectID]);

  // Define columns dynamically based on roles & assigned tasks
  const columns = [
    {
      accessorKey: "title",
      header: "Task Title",
      cell: ({ row }: { row: any }) => row.getValue("title"),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: { row: any }) => {
        const status = row.getValue("status");
        return (
          <Badge
            className={`text-white px-3 py-1 rounded-md ${statusColor(status)}`}
          >
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "difficulty",
      header: "Difficulty",
      cell: ({ row }: { row: any }) => {
        const difficulty = row.getValue("difficulty");
        return (
          <Badge
            className={`text-white px-3 py-1 rounded-md ${getDifficulityColor(
              difficulty
            )}`}
          >
            {difficulty}
          </Badge>
        );
      },
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }: { row: any }) => {
        const priority = row.getValue("priority");
        return (
          <Badge
            className={`text-white px-3 py-1 rounded-md ${priorityColor(
              priority
            )}`}
          >
            {priority}
          </Badge>
        );
      },
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }: { row: any }) => {
        const duedate = row.getValue("dueDate");
        return formatTimestamp(duedate);
      },
    },
    {
      accessorKey: "module",
      header: "Module",
      cell: ({ row }: { row: any }) => row.getValue("module"),
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }: { row: any }) => {
        const createdAt = row.getValue("createdAt");
        return formatTimestamp(createdAt);
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: { row: any }) => {
        const taskStatus = row.original.status;
        const taskID = row.original.taskID;
        return (
          <div className="flex gap-2">
            <TaskChnageStatus taskStatus={taskStatus} taskID={taskID} />
          </div>
        );
      },
    },
  ];

  // Recompute when roles or current user changes

  return (
    <div className="flex flex-col gap-2">
      <DataTableComponent
        data={tasks}
        columns={columns}
        SearchField={"title"}
      />
    </div>
  );
}
