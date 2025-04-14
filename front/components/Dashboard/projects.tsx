"use client";
import React, { useState } from "react";

import { CreateProjectForm } from "@/components/Dashboard/CreateProjectForm";
import { Plus, Pencil, Trash } from "lucide-react";
import { Avatar, AvatarGroup } from "@heroui/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { UpdateProjectDialog } from "@/components/Dashboard/UpdateProject";
import { DeleteProjectDialog } from "@/components/Dashboard/DeleteProject";
import { User } from "@heroui/user";
type Member = {
  userId: string;
  username: string;
  email: string;
  avatar: string;
  role: string[];
};

// Define the Owner type

// Define the Project type
type Project = {
  id: string;
  title: string;
  owner: Member;
  roles: string[];
  status: "In Progress" | "Completed";
  teams: Member[];
};

interface ProjectsProps {
  projects: Project[];
  itemsPerPage?: number; // Allow customization of items per page
}

export function Projects({ projects, itemsPerPage = 6 }: ProjectsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Slice filtered projects based on pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const selectedProjects = filteredProjects.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const Router = useRouter();
  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex w-full flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <div className="flex items-center gap-4">
          <CreateProjectForm />
          <div className="w-full sm:max-w-sm">
            <Input
              type="text"
              id="search"
              placeholder="Search the projects..."
              onChange={(e) => {
                setCurrentPage(1);
                setSearchQuery(e.target.value);
              }}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {selectedProjects.length === 0 ? (
        <div className="text-center">
          <p className="text-2xl font-bold uppercase tracking-wide">
            No projects yet
          </p>
          <Button
            className="mt-4"
            size="lg"
            variant="default"
            onClick={() => Router.push("/addProject")}
          >
            Add New Project
            <Plus size={16} />
          </Button>
        </div>
      ) : (
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {selectedProjects.map((project, index) => (
              <div className="aspect-video rounded-xl" key={index}>
                <Card key={index}>
                  <CardHeader className="flex flex-row justify-between">
                    <CardTitle className="text-xl font-bold">
                      {project.title}
                    </CardTitle>
                    {project.roles &&
                      project.roles.length > 0 &&
                      (project.roles.includes("owner") ||
                        project.roles.includes("manager")) && (
                        <div className="flex gap-3">
                          <UpdateProjectDialog projectData={project} />
                          <DeleteProjectDialog projectData={project} />
                        </div>
                      )}
                  </CardHeader>
                  <CardContent>
                    {project.teams && project.teams.length > 0 ? (
                      <AvatarGroup
                        size="sm"
                        max={5}
                        className="mb-4"
                        color="default"
                        isBordered
                        total={project.teams.length}
                      >
                        {project.teams.slice(0, 5).map((member, index) => (
                          <Avatar
                            key={index}
                            src={
                              member.avatar ||
                              "https://i.pravatar.cc/150?u=default"
                            } // Default avatar if missing
                            alt={member.username || "User"}
                          />
                        ))}
                      </AvatarGroup>
                    ) : (
                      <p className="text-gray-500 text-sm mb-7">
                        No members yet in the team
                      </p>
                    )}

                    <div className="w-full flex items-center">
                      <Progress
                        value={
                          (project.totalCompletedTasks / project.totalTasks) *
                          100
                        }
                        className="w-[60%]"
                      />
                      <span className="ml-2 text-sm font-semibold">
                        {Math.round(
                          (project.totalCompletedTasks / project.totalTasks) *
                            100
                        )}
                        %
                      </span>
                    </div>
                    <div className="flex gap-3 mt-4">
                      {project.owner ? (
                        <div className="flex gap-3 items-center">
                          <User
                            avatarProps={{
                              src: project.owner.avatar,
                              alt: project.owner.username,
                            }}
                            description={project.owner.email}
                            name={project.owner.username}
                          />{" "}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm mt-4">
                          Unkonw Owner
                        </p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="flex items-center justify-between w-full">
                      <Badge
                        className={`text-white px-3 py-1 rounded-md ${
                          project.status === "Completed"
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-orange-500 hover:bg-orange-600"
                        }`}
                      >
                        {project.status +
                          " / " +
                          new Date(project.dueDate).toISOString().split("T")[0]}
                      </Badge>

                      <Button
                        size="sm"
                        onClick={() => {
                          Router.push(`/dashboard/projects/${project.id}`);
                        }}
                      >
                        View Project
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    isActive={!(currentPage === 1)}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i}>
                    <Button
                      variant={currentPage === i + 1 ? "default" : "outline"}
                      onClick={() => handlePageChange(i + 1)}
                    >
                      {i + 1}
                    </Button>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    isActive={!(currentPage === totalPages)}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </section>
      )}
    </div>
  );
}
