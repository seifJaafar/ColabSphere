"use server";
import api from "@/config/axios"; // Import your Axios instance
import { cookies } from "next/headers";

export async function loginUser(prevState: any, formData: FormData) {
  try {
    const email = formData.get("email");
    const password = formData.get("password");
    const userData = {
      email,
      password,
    };
    if (!userData.email || !userData.password) {
      return { success: false, message: "All fields are required" };
    }
    const response = await api.post("/authService/auth/login", userData, {
      withCredentials: true,
    });
    if (response.status === 200) {
      const refreshToken = response.data.refreshToken;
      const accessToken = response.data.accessToken;
      if (!refreshToken || !accessToken) {
        return { success: false, message: "Invalid credentials" };
      }
      const cookiStore = await cookies();
      cookiStore.set("refreshToken", refreshToken, {
        maxAge: 7 * 24 * 60 * 60,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      cookiStore.set("accessToken", accessToken, {
        maxAge: 15 * 60,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      return {
        success: true,
        message: "Welcome back!",
        data: response.data?.userData,
        redirectURL: "/",
      };
    }

    return {
      success: false,
      message: "Error logging in",
    };
  } catch (e: any) {
    return { success: false, message: e.response?.data?.message };
  }
}
export async function logoutUser() {
  try {
    const response = await api.post(
      "/authService/auth/logout",
      {},
      {
        withCredentials: true,
      }
    );
    if (response.status === 200) {
      const cookiStore = await cookies();
      cookiStore.delete("refreshToken");
      cookiStore.delete("accessToken");
    }
    return {
      success: true,
      message: "Logged out successfully",
      redirectURL: "/login",
    };
  } catch (e: any) {
    return { success: false, message: e.response?.data?.message };
  }
}
export async function resetPassword(prevState: any, formData: FormData) {
  try {
    const Newpassword = formData.get("new_password");
    const ConfirmPassword = formData.get("confirm_password");
    const cookieStore = await cookies();
    const userID = cookieStore.get("id")?.value;

    const userData = {
      Newpassword,
      ConfirmPassword,
    };
    if (!userData.Newpassword || !userData.ConfirmPassword) {
      return { success: false, message: "All fields are required" };
    }
    if (!userID) {
      return { success: false, message: "Invalid or expired reset token" };
    }
    if (userData.Newpassword !== userData.ConfirmPassword) {
      return { success: false, message: "Passwords do not match" };
    }
    const response = await api.put(
      `/authService/auth/resetPassword/${userID}`,
      userData
    );
    if (response.status === 200) {
      cookieStore.delete("id");
    }
    return {
      success: true,
      message: response.data.message,
      redirectURL: "/login",
    };
  } catch (e: any) {
    return {
      success: false,
      message: e.response?.data?.message,
      redirecURL: "/",
    };
  }
}
export async function ForgetPasswordrequest(
  prevState: any,
  formData: FormData
) {
  try {
    const email = formData.get("email");
    const userData = {
      email,
    };
    if (!userData.email) {
      return { success: false, message: "All fields are required" };
    }
    const response = await api.post(
      "/authService/auth/requestResetPassword",
      userData
    );

    return {
      success: true,
      message: response.data.message,
    };
  } catch (e: any) {
    return { success: false, message: e.response?.data?.message };
  }
}
export async function registerUser(prevState: any, formData: FormData) {
  try {
    const email = formData.get("email");
    const username = formData.get("username");
    const password = formData.get("password");
    const userData = {
      email,
      username,
      password,
    };
    if (!userData.email || !userData.username || !userData.password) {
      return { success: false, message: "All fields are required" };
    }
    const response = await api.post("/authService/auth/register", userData);

    return {
      success: true,
      message: response.data.message,
      data: response.data,
      redirectURL: "/login",
    };
  } catch (e: any) {
    console.log(e.response?.data);
    return { success: false, message: e.response?.data?.message };
  }
}
