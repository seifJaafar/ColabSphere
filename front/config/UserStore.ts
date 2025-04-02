import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type User = {
  email: string;
  username: string;
  avatar: string;
  id: string;
};

type UserState = {
  user: User;
  setUser: (user: User) => void;
  updateAvatar: (avatarUrl: string) => void;
  logout: () => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: {
        email: "",
        username: "",
        avatar: "",
        id: "",
      }, // Initial state
      setUser: (user) => {
        set({ user });
      },
      updateAvatar: (avatarUrl) => {
        set((state) => ({
          user: { ...state.user, avatar: avatarUrl },
        }));
      }, // Function to set user data
      logout: () => {
        localStorage.clear();
        set({
          user: {
            email: "",
            username: "",
            avatar: "",
            id: "",
          },
        });
      }, // Function to remove user data
    }),
    {
      name: "user-store", // Key for localStorage
      storage: createJSONStorage(() => localStorage), // Persist in localStorage
    }
  )
);
