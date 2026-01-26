import api from "@/api/axios/axiosConfig";

export const logout = async (): Promise<{ message: string }> => {
  const res = await api.post("/api/auth/logout");
  return res.data;
};
