"use server";
import api from "@/config/axios";
export async function deleteDependency(dependencyId: string) {
  try {
    if (!dependencyId) {
      return {
        success: false,
        message: "Please provide a dependency ID",
      };
    }
    const response = await api.delete(
      `/projectsService/dependencies/${dependencyId}`
    );
    if (response.data) {
      return {
        success: true,
        message: response.data.message,
      };
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (err) {
    console.error("Error deleting dependency:", err);
    return {
      success: false,
      message: "something went wrong",
    };
  }
}
export async function addDependency(
  taskId: string,
  dependsOnId: string,
  dependencyType: string
) {
  try {
    if (!taskId || !dependsOnId || !dependencyType) {
      return {
        success: false,
        message: "Please provide all required fields",
      };
    }
    const response = await api.post("/projectsService/dependencies", {
      taskId,
      dependsOnId,
      dependencyType,
    });
    if (response.data) {
      return {
        success: true,
        message: response.data.message,
      };
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (err: any) {
    const message = "something went wrong";
    return { success: false, message };
  }
}
export async function getDependencies(projectID: string) {
  try {
    if (!projectID) {
      return {
        success: false,
        message: "Please provide a project ID",
      };
    }
    const response = await api.get(
      `/projectsService/dependencies/project/${projectID}`
    );

    if (response.data) {
      console.log(response.data.roles);
      return {
        success: true,
        tasks: response.data.tasks,
        dependencies: response.data.dependencies,
        isOwner: response.data.roles.includes("owner"),
      };
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (err: any) {
    const message = err.response?.data?.message || "something went wrong";
    return { success: false, message };
  }
}
