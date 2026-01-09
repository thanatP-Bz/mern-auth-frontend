import api from "../axios/axiosConfig";

export const verifyEmail = async (
  token: string
): Promise<{ message: string }> => {
  const res = await api.get(`/api/auth/verify-email?token=${token}`);

  return res.data;
};
