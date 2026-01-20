import api from "@/api/axios/axiosConfig";

export const resendVerificationEmail = async (
  email: string,
): Promise<{ message: string }> => {
  const res = await api.post<{ message: string }>(
    `/api/auth/resend-verification`,
    { email },
  );

  return res.data;
};
