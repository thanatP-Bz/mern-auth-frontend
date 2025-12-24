import axios from "axios";
import type { passwordUser } from "@/types/emailUser";

export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<passwordUser> => {
  const res = await axios.post(
    "http://localhost:4004/api/auth/reset-password",
    {
      token,
      newPassword,
    }
  );
  return res.data;
};
