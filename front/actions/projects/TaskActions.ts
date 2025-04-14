"use server";
import api from "@/config/axios";
export async function GetMyTasks(projectID: string) {
  try {
    if (!projectID) {
      return { success: false, message: "Please provide a project ID" };
    }
    const response = await api.get(
      `/projectsService/tasks/myTasks/${projectID}`
    );
    if (response.data.success) {
      return { success: true, tasks: response.data.tasks };
    } else {
      return { success: false, message: response.data.message, tasks: [] };
    }
  } catch (err: any) {
    const message = "something went wrong";
    return { success: false, message, tasks: [] };
  }
}
export async function AssignTask(taskID: string, userID: string) {
  try {
    if (!taskID || !userID) {
      return {
        success: false,
        message: "Please provide a task ID and user ID",
      };
    }
    const response = await api.post(`/projectsService/tasks/assign/${taskID}`, {
      assignTo: userID,
    });
    if (response.data.success) {
      return { success: true, message: response.data.message };
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (err: any) {
    const message = err.response?.data?.message || "something went wrong";
    return { success: false, message };
  }
}
export async function deleteTask(taskID: string) {
  try {
    if (!taskID) {
      return { success: false, message: "Please provide a task ID" };
    }
    const response = await api.delete(`/projectsService/tasks/${taskID}`);
    if (response.data.success) {
      return { success: true, message: response.data.message };
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (err: any) {
    const message = err.response?.data?.message || "something went wrong";
    return { success: false, message: message };
  }
}
export async function updateTask(task: any, taskID: string) {
  try {
    if (!task || !taskID) {
      return { success: false, message: "Please provide a task and task ID" };
    }
    const response = await api.put(`/projectsService/tasks/${taskID}`, {
      task,
    });
    if (response.data.success) {
      return { success: true, message: response.data.message };
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (err: any) {
    const message = err.response?.data?.message || "something went wrong";
    return { success: false, message };
  }
}
export async function GetTasks(projectID: string) {
  try {
    if (!projectID) {
      return { success: false, message: "Please provide a project ID" };
    }
    const response = await api.get(`/projectsService/tasks/all/${projectID}`);
    if (response.data.success) {
      return {
        success: true,
        tasks: response.data.data,
        roles: response.data.roles,
      };
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (err: any) {
    const message = err.response?.data?.message || "something went wrong";
    return { success: false, message };
  }
}
export async function AddTask(task: any, projectID: string) {
  try {
    if (!task || !projectID) {
      return {
        success: false,
        message: "Please provide a task and project ID",
      };
    }
    if (
      !task.title ||
      !task.difficulty ||
      !task.dueDate ||
      !task.priority ||
      !task.status ||
      !task.module
    ) {
      return {
        success: false,
        message: "Please provide all task details",
      };
    }

    const response = await api.post(`/projectsService/tasks/all/${projectID}`, {
      task,
    });
    if (response.data.success) {
      return { success: true, message: response.data.message };
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (err: any) {
    const message = err.response?.data?.message || "something went wrong";
    return { success: false, message };
  }
}
