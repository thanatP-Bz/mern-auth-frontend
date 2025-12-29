import axios from "axios";
import axiosInstance from "@/utils/axiosInstance";
import type { AuthUser } from "../types/authUser";

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthUser> => {
  const res = await axios.post<AuthUser>(
    "http://localhost:4004/api/auth/login",
    {
      email,
      password,
    }
  );

  return res.data;
};

export const logout = async () => {
  const response = await axiosInstance.post(`/auth/logout`);
  return response.data;
};
