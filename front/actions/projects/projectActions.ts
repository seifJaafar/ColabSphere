"use server";
import api from "@/config/axios";
import { url } from "inspector";
type EmailInvite = {
  email: string;
  valid: boolean;
};
export async function GetGoogleToken(projectID: string) {
  try {
    if (!projectID) {
      return { success: false, message: "Please provide a project ID" };
    }
    const response = await api.get(
      `/projectsService/projects/googleToken/${projectID}`,
      {}
    );
    if (response.data.success) {
      return { success: true, token: response.data.googleToken };
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (e: any) {
    return {
      success: false,
      message: "An error occurred while fetching the project",
    };
  }
}
export async function DeleteProject(projectID: string) {
  try {
    if (!projectID) {
      return { success: false, message: "Please provide a project ID" };
    }
    const response = await api.delete(
      `/projectsService/projects/${projectID}`,
      {}
    );
    if (response.data.success) {
      return { success: true, message: response.data.message };
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (err: any) {
    return {
      success: false,
      message: "An error occurred while deleting the project",
    };
  }
}
export async function UpdateProject(
  projectID: string,
  title: string,
  DueDate: Date | string
) {
  try {
    if (!projectID) {
      return { success: false, message: "Please provide a project ID" };
    }
    if (!title || !DueDate) {
      return { success: false, message: "Please fill all the fields" };
    }
    const data = {
      title,
      DueDate,
    };
    const response = await api.put(
      `/projectsService/projects/${projectID}`,
      data,
      {}
    );
    if (response.data.success) {
      return { success: true, message: response.data.message };
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (e: any) {
    return {
      success: false,
      message: "An error occurred while updating the project",
    };
  }
}
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
      success: false,
      message: "An error occurred while fetching the project",
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
      success: false,
      message: "An error occurred while sending the invite",
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
      success: false,
      message: "An error occurred while sending the invite",
    };
  }
}
export async function GetMembers(projectID: string) {
  try {
    if (!projectID) {
      return { success: false, message: "Please provide a project ID" };
    }
    const response = await api.get(
      `/projectsService/projects/team/${projectID}`,
      {}
    );
    if (response.data.success) {
      return { success: true, members: response.data.teamMembers };
    } else {
      return { success: false, members: [] };
    }
  } catch (e) {
    return {
      success: false,
      message: "An error occurred while fetching the members",
      members: [],
    };
  }
}
export async function GetCalendarList(projectID: string) {
  try {
    if (!projectID) {
      return { success: false, message: "Please provide a project ID" };
    }
    const response = await api.get(
      `/projectsService/projects/calendar/list/${projectID}`,
      {}
    );

    if (response.data.success) {
      return { success: true, calendars: response.data.calendars };
    } else {
      return { success: false, message: response.data.message, calendars: [] };
    }
  } catch (e: any) {
    return {
      success: false,
      message: "An error occurred while fetching the drive files",
      calendars: [],
    };
  }
}
export async function LeaveProject(projectID: string) {
  try {
    if (!projectID) {
      return { success: false, message: "Please provide a project ID" };
    }
    const response = await api.get(
      `/projectsService/projects/leave/${projectID}`,
      {}
    );
    if (response.data.success) {
      return { success: true, message: response.data.message };
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (err) {
    return {
      success: false,
      message: "An error occurred while leaving the project",
    };
  }
}
export async function DriveList(projectID: string) {
  try {
    if (!projectID) {
      return { success: false, message: "Please provide a project ID" };
    }
    const response = await api.get(
      `/projectsService/projects/drive/folders/${projectID}`,
      {}
    );

    if (response.data.success) {
      return { success: true, folders: response.data.folders };
    } else {
      return { success: false, message: response.data.message, fodlers: [] };
    }
  } catch (e: any) {
    return {
      success: false,
      message: "An error occurred while fetching the drive files",
      fodlers: [],
    };
  }
}
export async function GetCalendar(projectID: string) {
  try {
    if (!projectID) {
      return { success: false, message: "Please provide a project ID" };
    }
    const response = await api.get(
      `/projectsService/projects/calendar/url/${projectID}`,
      {}
    );
    if (response.data.success) {
      return { success: true, url: response.data.calendarLink };
    } else {
      return { success: false, message: response.data.message, url: "" };
    }
  } catch (e: any) {
    return {
      success: false,
      message: "An error occurred while fetching the drive files",
      url: "",
    };
  }
}
export async function GetDriveFolder(projectID: string) {
  try {
    if (!projectID) {
      return { success: false, message: "Please provide a project ID" };
    }
    const response = await api.get(
      `/projectsService/projects/drive/url/${projectID}`,
      {}
    );
    if (response.data.success) {
      return { success: true, url: response.data.folderLink };
    } else {
      return { success: false, message: response.data.message, url: "" };
    }
  } catch (err: any) {
    return {
      success: false,
      message: "An error occurred while fetching the drive files",
      url: "",
    };
  }
}
export async function ShareCalendar(projectID: string, calendarID: string) {
  try {
    if (!projectID) {
      return { success: false, message: "Please provide a project ID" };
    }
    if (!calendarID) {
      return { success: false, message: "Please provide a folder ID" };
    }
    const response = await api.post(
      `/projectsService/projects/calendar/share/${projectID}`,
      { calendarID },
      {}
    );
    if (response.data.success) {
      return { success: true, embedUrl: response.data.calendarLink };
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (e: any) {
    return {
      success: false,
      message: "An error occurred while sharing the calendar",
    };
  }
}
export async function ShareDriveFolder(projectID: string, folderID: string) {
  try {
    if (!projectID) {
      return { success: false, message: "Please provide a project ID" };
    }
    if (!folderID) {
      return { success: false, message: "Please provide a folder ID" };
    }
    const response = await api.post(
      `/projectsService/projects/drive/share/${projectID}`,
      { folderID },
      {}
    );
    if (response.data.success) {
      return { success: true, embedUrl: response.data.folderLink };
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (e: any) {
    return {
      success: false,
      message: "An error occurred while sharing the folder",
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
