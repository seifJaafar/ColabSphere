"use client"; // Ensure this is treated as a client-side component

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { TeamSwitcher } from "@/components/ui/team-switcher";
import { InviteDialog } from "@/components/Dashboard/InviteDialog";

import { Calendar, DoorOpen, Github, LineChart } from "lucide-react";
import { TasksDataTable } from "@/components/Dashboard/TasksDataTable";
import { MembersDataTable } from "@/components/Dashboard/MembersDataTable";
import { MyTasksDataTable } from "@/components/Dashboard/MyTasksDataTable";
import { ModulesDataTable } from "@/components/Dashboard/ModulesDataTable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GoogleDriveTab } from "@/components/Dashboard/GoogleDriveTab";
import { GoogleCalendarTab } from "@/components/Dashboard/GoogleCalendarTab";
import { Button } from "@/components/ui/button";
import { LeaveProject } from "@/actions/projects/projectActions";
import { useRouter } from "next/navigation";

export function ProjectDetailsComponent({
  projectID,
  roles,
  title,
}: {
  projectID: string;
  roles: string[];
  title: string;
}) {
  const teams = [
    { name: "Tasks", logo: "GalleryVerticalEnd" },
    { name: "Team", logo: "Users" },
    { name: "My Tasks", logo: "ListChecks" },
    { name: "Task Dependancies", logo: "ListChecks" },
    ,
    ...(roles && (roles.includes("owner") || roles.includes("manager"))
      ? [{ name: "Modules", logo: "Library" }]
      : []),
  ];

  // State to track active tab
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(teams[0]);
  const [tasksDataFetched, setTasksDataFetched] = useState(false);
  const [membersDataFetched, setMembersDataFetched] = useState(false);
  const [modulesDataFetched, setModulesDataFetched] = useState(false);
  const handleLeaveProject = async () => {
    try {
      const res = await LeaveProject(projectID);
      if (res.success) {
        router.push("/dashboard/projects");
      } else {
        alert("Error leaving project");
      }
    } catch (err) {
      console.error(err);
      alert("Error leaving project");
    }
  };
  // Effect to load data when the active tab changes
  useEffect(() => {
    if (activeTab.name === "Tasks" && !tasksDataFetched) {
      setTasksDataFetched(true); // Prevent multiple fetches for tasks
    }
    if (activeTab.name === "Team" && !membersDataFetched) {
      setMembersDataFetched(true); // Prevent multiple fetches for team members
    }
    if (activeTab.name === "Modules" && !modulesDataFetched) {
      setModulesDataFetched(true); // Prevent multiple fetches for modules
    }
    if (activeTab.name === "Task Dependancies" && !tasksDataFetched) {
      setTasksDataFetched(true); // Prevent multiple fetches for tasks
    }
  }, [activeTab, tasksDataFetched, membersDataFetched, modulesDataFetched]);

  const renderComponent = () => {
    switch (activeTab.name) {
      case "Tasks":
        return tasksDataFetched ? (
          <TasksDataTable projectID={projectID} />
        ) : null;
      case "Team":
        return membersDataFetched ? (
          <MembersDataTable projectID={projectID} />
        ) : null;
      case "My Tasks":
        return tasksDataFetched ? (
          <MyTasksDataTable projectID={projectID} />
        ) : null;
      case "Task Dependancies":
        return tasksDataFetched ? (
          <div className="flex flex-col items-center justify-center w-full h-full text-muted">
            <Button
              variant={"secondary"}
              size={"lg"}
              onClick={() => {
                window.open(`/dashboard/dependancies/${projectID}`, "_blank");
              }}
            >
              Open Task Dependancy graph
            </Button>
          </div>
        ) : null;
      case "Modules":
        if (roles.includes("owner") || roles.includes("manager")) {
          return modulesDataFetched ? (
            <ModulesDataTable projectID={projectID} />
          ) : null;
        }
        break;
      default:
        return null;
    }
  };

  return (
    <section>
      <div className="min-h-[60vh] flex-1 rounded-xl bg-muted/50 p-4 md:p-6">
        <header className="flex flex-col md:flex-row justify-between items-center w-full gap-2">
          <div className="w-full md:w-[20%]">
            <TeamSwitcher teams={teams} onTeamChange={setActiveTab} />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center md:justify-end items-center gap-2">
            {roles.includes("owner") || roles.includes("manager") ? (
              <InviteDialog projectID={projectID} />
            ) : null}

            {/* Google Drive Dialog */}
            <GoogleDriveTab
              projectID={projectID}
              isowner={roles.includes("owner")}
            />

            {/* Google Drive Dialog */}

            {/* Calendar Dialog */}
            <GoogleCalendarTab
              projectID={projectID}
              isowner={roles.includes("owner")}
            />
            {/*<Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" title="View Calendar">
                  <Calendar />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Calendar</DialogTitle>
                  <DialogDescription>
                    View the project's calendar
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center items-center w-full h-full text-muted">
                  <h2>This is the calendar</h2>
                </div>
              </DialogContent>
            </Dialog> */}

            {/* Github Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" title="View Github">
                  <Github />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Github</DialogTitle>
                  <DialogDescription>
                    Access the project's Github repository
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center items-center w-full h-full text-muted">
                  <h2>This is the Github</h2>
                </div>
              </DialogContent>
            </Dialog>
            {/* Link to analytics page */}

            {(roles.includes("owner") || roles.includes("manager")) && (
              <Link href={`projects/${projectID}/analytics`}>
                <Button variant="outline" size="icon" title="View Analytics">
                  <LineChart />
                </Button>
              </Link>
            )}
            {
              /* Leave Project */
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon" title="Leave Project">
                    <DoorOpen />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Leave Project</DialogTitle>
                  </DialogHeader>
                  <div className="flex w-full h-full text-white">
                    <p>Are you sure you want to leave the {title}'s team?</p>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="destructive"
                      className="mr-2"
                      onClick={handleLeaveProject}
                    >
                      Leave
                    </Button>
                    <Button variant="outline">Cancel</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            }
          </div>
        </header>
        <section>{renderComponent()}</section>
      </div>
    </section>
  );
}
