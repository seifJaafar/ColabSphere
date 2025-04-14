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
      },
      setUser: (user) =>
        set(() => ({
          user,
        })),
      updateAvatar: (avatarUrl) =>
        set((state) => ({
          user: {
            ...state.user,
            avatar: avatarUrl,
          },
        })),
      logout: () => {
        set(() => ({
          user: {
            email: "",
            username: "",
            avatar: "",
            id: "",
          },
        }));
        localStorage.removeItem("user-store"); // safer than clearing all storage
      },
    }),
    {
      name: "user-store", // Local storage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user }), // Optional: Save only what's needed
    }
  )
);
