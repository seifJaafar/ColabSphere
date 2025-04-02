"use server";
import api from "@/config/axios"; // Import your Axios instance

export async function UpdatePassword(prevState: any, formData: FormData) {
  try {
    const id = formData.get("id");
    console.log(id);
    const previousPassword = formData.get("previous_password");
    const newPassword = formData.get("new_password");
    const data = {
      previousPassword,
      newPassword,
    };
    const response = await api.put(
      `/usersService/user/updatePassword/${id}`,
      data,
      {}
    );
    return {
      success: true,
      message: "Password Updated Successfully",
    };
  } catch (e: any) {
    return {
      success: false,
      message: e.response.data.message,
    };
  }
}
export async function UpdateProfile(prevState: any, formData: FormData) {
  try {
    const id = formData.get("id");

    const response = await api.put(
      `/usersService/user/updateProfile/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    const newData = response.data.updatedUser;
    return {
      success: true,
      message:
        "Profile Updated Successfully Please wait a second to see the new avatar",
      data: newData,
    };
  } catch (e: any) {
    return {
      success: false,
      message: e.response.data.message,
      data: null,
    };
  }
}
