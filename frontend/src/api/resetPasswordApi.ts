import axios from "axios";
import type { ResetPasswordResponse } from "@/types/resetPasswordPayload";

export const resetPassword = async (
  token: string,
  newPassword: string
): Promise<ResetPasswordResponse> => {
  const res = await axios.post<ResetPasswordResponse>(
    "http://localhost:4004/api/auth/reset-password",
    {
      token,
      password: newPassword,
    }
  );
  return res.data;
};
