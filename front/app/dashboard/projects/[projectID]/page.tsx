import { ProjectDetailsComponent } from "@/components/Dashboard/ProjectDetails";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { PieChartComponent } from "@/components/Dashboard/PieChart";
import { BarChartComponent } from "@/components/Dashboard/BarChart";
import { LineChartDotted } from "@/components/Dashboard/LineChartDotted";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getProject } from "@/actions/projects/projectActions";
export default async function ProjectDetails({
  params,
}: {
  params: Promise<{ projectID: string }>;
}) {
  const projectID = (await params).projectID;
  const projectData = await getProject(projectID);
  if (!projectData.success) {
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
                <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{"Project :" + projectID}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="container mx-auto flex flex-1 flex-col gap-4 p-2 md:p-4">
          <p>Error fetching project data</p>
        </div>
      </main>
    );
  } else {
    const project = projectData.project;
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
                <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{"Project: " + project.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="container mx-auto flex flex-1 flex-col gap-4 p-2 md:p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="aspect-video rounded-xl bg-muted/50">
              <PieChartComponent />
            </div>
            <div className="aspect-video rounded-xl bg-muted/50">
              <LineChartDotted />
            </div>
            <div className="aspect-video rounded-xl bg-muted/50">
              <BarChartComponent />
            </div>
          </div>
          <ProjectDetailsComponent
            projectID={projectID}
            roles={project.roles}
            title={project.title}
          />
        </div>
      </main>
    );
  }
}
