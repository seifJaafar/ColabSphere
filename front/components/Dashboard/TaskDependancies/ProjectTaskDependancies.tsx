"use client";
import { useState, useEffect } from "react";
import TaskDependencyGraph from "@/components/Dashboard/TaskDependancies/TaskDependancyGraph";
import { AddDependenciesDialog } from "@/components/Dashboard/TaskDependancies/addDependencies";
import { getDependencies } from "@/actions/projects/TaskDependancies";

const ProjectTaskDependancies = ({ projectId }: { projectId: string }) => {
  const [tasks, setTasks] = useState([]);
  const [dependencies, setDependencies] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDependencies(projectId);
        if (response.success) {
          setTasks(response.tasks);
          setDependencies(response.dependencies);
          setIsOwner(response.isOwner);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [projectId]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-[60vh] flex-1 rounded-xl bg-muted/50 p-4 md:p-6">
      <h2 className="text-xl font-bold mb-4">Task Dependencies</h2>
      {isOwner && (
        <div className="my-5">
          <AddDependenciesDialog tasks={tasks} />
        </div>
      )}
      <div className="border border-gray-700 rounded-lg overflow-hidden">
        <TaskDependencyGraph tasks={tasks} dependencies={dependencies} />
      </div>
    </div>
  );
};

export default ProjectTaskDependancies;
