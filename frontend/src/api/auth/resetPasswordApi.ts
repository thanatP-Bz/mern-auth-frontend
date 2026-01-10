import api from "../axios/axiosConfig";

export const resetPassword = async (token: string, newPassword: string) => {
  const res = await api.post(`/api/auth/reset-password/${token}`, {
    password: newPassword,
  });

  return res.data;
};
