import React from "react";
import { DataTableComponent } from "@/components/Dashboard/DataTableComponent";
import { Button } from "../ui/button";
import { Avatar } from "@heroui/avatar";
const users = [
  {
    email: "user1@example.com",
    name: "John Doe",
    avatar: "/Seifjaafar.webp",
    role: "Software Engineer",
    TotalTasks: 15,
  },
  {
    email: "user2@example.com",
    name: "Jane Smith",
    avatar: "/Seifjaafar.webp",
    role: "Frontend Developer",
    TotalTasks: 8,
  },
  {
    email: "user3@example.com",
    name: "Alice Johnson",
    avatar: "/Seifjaafar.webp",
    role: "Backend Developer",
    TotalTasks: 12,
  },
  {
    email: "user4@example.com",
    name: "Bob Brown",
    avatar: "/Seifjaafar.webp",
    role: "DevOps Engineer",
    TotalTasks: 5,
  },
  {
    email: "user5@example.com",
    name: "Charlie Davis",
    avatar: "/Seifjaafar.webp",
    role: "QA Engineer",
    TotalTasks: 20,
  },
  {
    email: "user6@example.com",
    name: "Daniel White",
    avatar: "/Seifjaafar.webp",
    role: "Product Manager",
    TotalTasks: 7,
  },
  {
    email: "user7@example.com",
    name: "Emily Green",
    avatar: "/Seifjaafar.webp",
    role: "UX/UI Designer",
    TotalTasks: 18,
  },
  {
    email: "user8@example.com",
    name: "Frank Harris",
    avatar: "/Seifjaafar.webp",
    role: "Data Scientist",
    TotalTasks: 10,
  },
  {
    email: "user9@example.com",
    name: "Grace Lewis",
    avatar: "/Seifjaafar.webp",
    role: "Machine Learning Engineer",
    TotalTasks: 22,
  },
  {
    email: "user10@example.com",
    name: "Henry Walker",
    avatar: "/Seifjaafar.webp",
    role: "Cybersecurity Analyst",
    TotalTasks: 6,
  },
  {
    email: "user11@example.com",
    name: "Ivy Adams",
    avatar: "/Seifjaafar.webp",
    role: "Tech Lead",
    TotalTasks: 14,
  },
];
const columns = [
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }: { row: any }) => row.getValue("email"),
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }: { row: any }) => row.getValue("name"),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }: { row: any }) => row.getValue("role"),
  },
  {
    accessorKey: "TotalTasks",
    header: "Total Tasks",
    cell: ({ row }: { row: any }) => row.getValue("TotalTasks"),
  },
  {
    id: "avatar",
    header: "Avatar",
    cell: ({ row }: { row: any }) => {
      return (
        <div className="flex items-center gap-2">
          <Avatar src="/Seifjaafar.webp" />
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }: { row: any }) => {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => alert(`Viewing ${row.getValue("name")}`)}
        >
          View
        </Button>
      );
    },
  },
];

export function MembersDataTable() {
  return (
    <DataTableComponent data={users} columns={columns} SearchField={"name"} />
  );
}
