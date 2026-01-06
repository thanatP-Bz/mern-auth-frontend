import axios from "axios";

export const resendVerificationEmail = async (
  email: string
): Promise<{ message: string }> => {
  const res = await axios.post<{ message: string }>(
    `http://localhost:4004/api/auth/resend-verification`,
    { email }
  );

  return res.data;
};
