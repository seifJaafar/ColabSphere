"use client";
import React, { useState, useEffect } from "react";
import { DataTableComponent } from "@/components/Dashboard/DataTableComponent";

import { Avatar } from "@heroui/avatar";
import { GetMembers } from "@/actions/projects/projectActions";
import { access } from "fs";

const columns = [
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }: { row: any }) => row.getValue("email"),
  },
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }: { row: any }) => row.getValue("username"),
  },
  {
    accessorKey: "roles",
    header: "Roles",
    cell: ({ row }: { row: any }) => {
      const roles = row.original.roles;
      if (roles && roles.length > 0) {
        const string = roles.map((role: any) => role).join(", ");
        return string;
      } else {
        return "No roles assigned";
      }
    },
  },

  {
    id: "avatar",
    header: "Avatar",
    cell: ({ row }: { row: any }) => {
      const avatar = row.original.avatar;
      return (
        <div className="flex items-center gap-2">
          <Avatar src={avatar} />
        </div>
      );
    },
  },
  {
    accessorKey: "totalTasks",
    header: "Total Tasks",
    cell: ({ row }: { row: any }) => {
      const tasks = row.original.totalTasks;
      return tasks ? tasks : 0;
    },
  },
];

export function MembersDataTable({ projectID }: { projectID: string }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchUsers = async () => {
      const response = await GetMembers(projectID);

      if (response.success) {
        console.log("Users fetched successfully:", response.members);
        setUsers(response.members);
      } else {
        console.error("Error fetching users:", response.message);
        setUsers([]);
      }
      setLoading(false);
    };
    fetchUsers();
  }, [projectID]);
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <DataTableComponent data={users} columns={columns} SearchField="username" />
  );
}
