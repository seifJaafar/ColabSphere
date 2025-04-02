"use server";
import api from "@/config/axios";

export async function DeleteModule(moduleID: string) {
  try {
    if (!moduleID) {
      return {
        success: false,
        message: "Please provide a module ID",
      };
    }
    const response = await api.delete(`/projectsService/modules/${moduleID}`);
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
export async function UpdateModule(title: string, moduleID: string) {
  try {
    console.log("Module ID", moduleID);
    console.log("Module Title", title);
    if (!title || !moduleID) {
      return {
        success: false,
        message: "Please provide a module title and module ID",
      };
    }
    const response = await api.put(`/projectsService/modules/${moduleID}`, {
      title: title,
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
export async function AddModule(moduleTitle: string, projectID: string) {
  try {
    console.log(projectID);
    if (!moduleTitle || !projectID) {
      return {
        success: false,
        message: "Please provide a module title and project ID",
      };
    }
    const response = await api.post(
      `/projectsService/modules/all/${projectID}`,
      {
        title: moduleTitle,
      }
    );
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
export async function GetModules(projectID: string) {
  try {
    if (!projectID) {
      return {
        success: false,
        message: "Please provide a project ID",
        modules: [],
      };
    }
    const response = await api.get(`/projectsService/modules/all/${projectID}`);
    return {
      success: true,
      modules: response.data.data,
    };
  } catch (err: any) {
    const message = err.response?.data?.message || "something went wrong";
    return { success: false, message, modules: [] };
  }
}
