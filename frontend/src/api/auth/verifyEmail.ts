import axios from "axios";

export const verifyEmail = async (
  token: string
): Promise<{ message: string }> => {
  const res = await axios.get(
    `http://localhost:4004/api/auth/verify-email?token=${token}`
  );

  return res.data;
};
