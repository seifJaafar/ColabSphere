"use client"; // Ensure this is treated as a client-side component

import React, { useState } from "react";
import Link from "next/link";
import { TeamSwitcher } from "@/components/ui/team-switcher";
import { InviteDialog } from "@/components/Dashboard/InviteDialog";
import { IconBrandGoogleDrive } from "@tabler/icons-react";
import { Calendar, DoorOpen, Github, LineChart } from "lucide-react";
import { TasksDataTable } from "@/components/Dashboard/TasksDataTable";
import { MembersDataTable } from "@/components/Dashboard/MembersDataTable";
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

import { Button } from "@/components/ui/button";

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
    ...(roles && (roles.includes("owner") || roles.includes("manager"))
      ? [{ name: "Modules", logo: "Library" }]
      : []),
  ];

  // State to track active tab
  const [activeTab, setActiveTab] = useState(teams[0]);

  const renderComponent = () => {
    switch (activeTab.name) {
      case "Tasks":
        return <TasksDataTable projectID={projectID} />;
      case "Team":
        return <MembersDataTable />;
      case "My Tasks":
        return <TasksDataTable projectID={projectID} />;
      case "Modules":
        if (roles.includes("owner") || roles.includes("manager")) {
          return <ModulesDataTable projectID={projectID} />;
        }
        break;
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
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" title="View Google Drive">
                  <IconBrandGoogleDrive />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Google Drive Folder</DialogTitle>
                  <DialogDescription>
                    Access the project's Google Drive folder
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-center items-center w-full h-full text-muted">
                  <h2>This is the folder</h2>
                </div>
              </DialogContent>
            </Dialog>

            {/* Calendar Dialog */}
            <Dialog>
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
            </Dialog>

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
            {/*Linkk to analytics page*/}

            {(roles.includes("owner") || roles.includes("manager")) && (
              <Link href={`projects/${projectID}/analytics`}>
                <Button variant="outline" size="icon" title="View Analytics">
                  <LineChart />
                </Button>
              </Link>
            )}
            {
              /*Leave Project*/
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
                    <p>
                      Are you sure you want to the leave the {title}'s team ?
                    </p>
                  </div>
                  <DialogFooter>
                    <Button variant="destructive" className="mr-2">
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
