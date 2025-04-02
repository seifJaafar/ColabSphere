import React, { useState, useEffect, useMemo } from "react";
import { DataTableComponent } from "@/components/Dashboard/DataTableComponent";

import { AddTaskDialog } from "@/components/Dashboard/addTask";
import { useUserStore } from "@/config/UserStore";
import { GetModules } from "@/actions/projects/moduleActions";
import { UpdateModuleDialog } from "@/components/Dashboard/updateModule";
import { DeleteModuleDialog } from "@/components/Dashboard/deleteModule";
import { AddModuleDialog } from "@/components/Dashboard/addModule";
export function ModulesDataTable({ projectID }: { projectID: string }) {
  const [modules, setModules] = useState([]);
  const [roles, setRoles] = useState<string[]>([]);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    const fetchModules = async () => {
      const response = await GetModules(projectID);
      if (response.success && response.modules && response.modules.length > 0) {
        const modulesData = response.modules;
        setModules(modulesData);
      }
    };
    fetchModules();
  }, []);
  const columns = useMemo(() => {
    const baseColumns = [
      {
        accessorKey: "title",
        header: "Task Title",
        cell: ({ row }: { row: any }) => row.getValue("title"),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }: { row: any }) => {
          return (
            <div className="flex items-center gap-4">
              <UpdateModuleDialog moduleData={row.original} />
              <DeleteModuleDialog moduleData={row.original} />
            </div>
          );
        },
      },
    ];

    return baseColumns;
  }, []);

  // Recompute when roles or current user changes

  return (
    <div className="flex flex-col gap-2">
      <div className="w-[100%] mt-7">
        <AddModuleDialog projectID={projectID} />
      </div>
      <DataTableComponent
        data={modules}
        columns={columns}
        SearchField={"title"}
      />
    </div>
  );
}
