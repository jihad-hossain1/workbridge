import { create } from "zustand";
import { persist } from "zustand/middleware";

export type LoginInterface = {
  userId: string;
  name: string;
  email: string;
  _auth_token: string;
  accessToken: string;
  businessId?: number | string;
};

export const loginInitialState: LoginInterface = {
  userId: "",
  name: "",
  email: "",
  _auth_token: "",
  accessToken: "",
  businessId: "",
};

export enum LocalStorageKeys {
  AUTH = "_auth_user_",
}

export interface AuthState extends LoginInterface {
  loggedUser: (user: LoginInterface) => void;
  logoutUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...loginInitialState,
      loggedUser: (user) => set(() => ({ ...user })),
      logoutUser: () => set(() => ({ ...loginInitialState })),
    }),
    {
      name: LocalStorageKeys.AUTH,
    },
  ),
);
