import React, { useState, useEffect, useMemo } from "react";
import { DataTableComponent } from "@/components/Dashboard/DataTableComponent";
import { Button } from "../ui/button";
import { Avatar } from "@heroui/avatar";
import { Badge } from "@/components/ui/badge";
import { AddTaskDialog } from "@/components/Dashboard/addTask";
import { GetTasks } from "@/actions/projects/TaskActions";
import { useUserStore } from "@/config/UserStore";
import { UpdateTaskDialog } from "@/components/Dashboard/updateTask";
import { DeleteTaskDialog } from "@/components/Dashboard/DeleteTasks";
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

const formatTimestamp = (timestamp: number) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(timestamp));
};

export function TasksDataTable({ projectID }: { projectID: string }) {
  const [tasks, setTasks] = useState([]);
  const [roles, setRoles] = useState<string[]>([]);
  const user = useUserStore((state) => state.user);
  useEffect(() => {
    const fetchTasks = async () => {
      const response = await GetTasks(projectID);
      if (response.success) {
        setTasks(response.tasks);
        setRoles(response.roles);
      } else {
        setTasks([]);
        setRoles([]);
      }
    };
    fetchTasks();
  }, [projectID]);

  // Define columns dynamically based on roles & assigned tasks
  const columns = useMemo(() => {
    const baseColumns = [
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
              className={`text-white px-3 py-1 rounded-md ${
                status === "completed"
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-orange-500 hover:bg-orange-600"
              }`}
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
        id: "assignedTo",
        header: "Assigned To",
        cell: ({ row }: { row: any }) => {
          const assignedTo = row.original.assignedTo;
          return (
            <div className="flex items-center gap-2">
              {assignedTo?.avatar ? (
                <div className="">
                  <Avatar src="/Seifjaafar.webp" />
                  <span>{assignedTo?.email}</span>
                </div>
              ) : (
                <span>Not Assigned</span>
              )}
            </div>
          );
        },
      },
    ];

    const isManagerOrOwner =
      roles.includes("owner") || roles.includes("manager");

    if (
      isManagerOrOwner ||
      tasks.some((task) => task.assignedTo?.id === user.id)
    ) {
      baseColumns.push({
        id: "actions",
        header: "Actions",
        cell: ({ row }: { row: any }) => {
          const assignedTo = row.original.assignedTo;
          const isAssignedToUser = assignedTo?.id === user.id;

          if (isManagerOrOwner) {
            return (
              <div className="flex items-center gap-4">
                <UpdateTaskDialog taskData={row.original} />
                <DeleteTaskDialog taskData={row.original} />
              </div>
            );
          }

          if (isAssignedToUser) {
            return (
              <Button
                variant="outline"
                size="sm"
                onClick={() => alert(`Taking action on ${row.original.title}`)}
              >
                Take Action
              </Button>
            );
          }

          return <></>;
        },
      });
    }

    return baseColumns;
  }, [roles, user, tasks]);

  // Recompute when roles or current user changes

  return (
    <div className="flex flex-col gap-2">
      {(roles.includes("owner") || roles.includes("manager")) && (
        <div className="w-[100%] mt-7">
          <AddTaskDialog projectID={projectID} />
        </div>
      )}
      <DataTableComponent
        data={tasks}
        columns={columns}
        SearchField={"title"}
      />
    </div>
  );
}
