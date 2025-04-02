"use server";
import api from "@/config/axios";
type EmailInvite = {
  email: string;
  valid: boolean;
};
export async function getProject(projectID: string) {
  try {
    if (!projectID) {
      return { success: false, message: "Please provide a project ID" };
    }
    const response = await api.get(`/projectsService/projects/${projectID}`);
    if (response.data.success) {
      return { success: true, project: response.data.data };
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (e: any) {
    return {
      success: e.response.data.success || false,
      message:
        e.response.data.message ||
        "An error occurred while fetching the project",
    };
  }
}
export async function InviteByemails(emails: EmailInvite[], projectId: string) {
  try {
    if (!projectId) {
      return { success: false, message: "Please provide a project" };
    }
    if (emails.length === 0) {
      return { success: false, message: "Please provide at least one email" };
    }
    const emailData = emails.map((email) => {
      if (email.valid) {
        return email.email;
      }
    });

    const response = await api.post(
      "/projectsService/projects/inviteEmails",
      {
        emails: emailData,
        projectID: projectId,
      },
      {}
    );
    if (response.data.success) {
      return { success: true, message: response.data.message };
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (e: any) {
    return {
      success: e.response.data.success || false,
      message:
        e.response.data.message || "An error occurred while sending the invite",
    };
  }
}
export async function InviteByLink(projectID: string) {
  try {
    if (!projectID) {
      return { success: false, message: "Please provide a project ID" };
    }

    // Call the backend API
    const response = await api.get(
      `/projectsService/projects/inviteLink/${projectID}`,
      {}
    );

    // Handle success or failure based on the response
    if (response.data.success) {
      // Success: Handle success, show the message

      return { success: true, message: response.data.message };
    } else {
      // Failure: Handle failure, show the message

      return { success: false, message: response.data.message };
    }
  } catch (e: any) {
    return {
      success: e.response.data.success || false,
      message:
        e.response.data.message || "An error occurred while sending the invite",
    };
  }
}

export async function GetProjects() {
  try {
    const response = await api.get("/projectsService/projects", {});
    if (response.data.projects) {
      return { projects: response.data.projects };
    } else {
      return { projects: [] };
    }
  } catch (err: any) {
    console.log("Something went wrong");
    return { projects: [] };
  }
}
export async function AddProject(prevState: any, formData: FormData) {
  try {
    const title = formData.get("title");
    const DueDate = formData.get("DueDate");
    if (!title || !DueDate) {
      return {
        success: false,
        message: "Please fill all the fields",
        redirectURL: "",
      };
    }
    const data = {
      title,
      DueDate,
    };
    const response = await api.post("/projectsService/projects", data, {});

    return {
      success: true,
      message: "Project Added Successfully",
      redirectURL: "/dashboard",
    };
  } catch (e: any) {
    return {
      success: false,
      message: e.response.data.message || "Something went wrong",
    };
  }
}
