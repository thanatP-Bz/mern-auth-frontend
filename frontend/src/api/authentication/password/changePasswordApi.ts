import api from "@/api/axios/axiosConfig";

export const changePasswordApi = async (
  email: string,
  oldPassword: string,
  newPassword: string,
): Promise<{ message: string }> => {
  const res = await api.patch("/api/auth/change-password", {
    email,
    oldPassword,
    newPassword,
  });

  return res.data;
};
