"use server";
import api from "@/config/axios";
export async function getChatRoomMessages(chatroomId: string) {
  try {
    const response = await api.get(`/chatroomsService/chatrooms/${chatroomId}`);
    console.log(response.data);
    if (response.data) {
      return {
        success: true,
        messages: response.data.messages,
      };
    } else {
      return { success: false, message: response.data.message, messages: [] };
    }
  } catch (err) {
    console.error("Error getting chat room messages:", err);
    return {
      success: false,
      message: "something went wrong",
    };
  }
}
export async function getChatRooms() {
  try {
    const response = await api.get("/chatroomsService/chatrooms");
    if (response.data) {
      return {
        success: true,
        message: response.data.message,
        chats: response.data.chatrooms,
      };
    } else {
      return { success: false, message: response.data.message, chats: [] };
    }
  } catch (err) {
    console.error("Error getting chat rooms:", err);
    return {
      success: false,
      message: "something went wrong",
    };
  }
}
