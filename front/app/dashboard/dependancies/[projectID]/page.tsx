import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import ProjectTaskDependancies from "@/components/Dashboard/TaskDependancies/ProjectTaskDependancies";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default async function ProjectDetails({
  params,
}: {
  params: Promise<{ projectID: string }>;
}) {
  const projectID = (await params).projectID;

  return (
    <main className="w-full min-h-screen overflow-hidden bg-background">
      <header className="flex h-16 shrink-0 items-center gap-2 px-4 md:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 h-4 hidden md:block"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/projects">
                Project Task Dependancies
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <div className="container mx-auto flex flex-1 flex-col gap-4 p-2 md:p-4">
        <ProjectTaskDependancies projectId={projectID} />
      </div>
    </main>
  );
}
