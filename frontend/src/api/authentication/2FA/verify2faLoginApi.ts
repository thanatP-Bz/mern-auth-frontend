import type { LoginSuccessResponse } from "@/types/authUser";
import api from "@/api/axios/axiosConfig";

export const verify2FALoginApi = async (
  userId: string,
  token: string,
): Promise<LoginSuccessResponse> => {
  const res = await api.post<LoginSuccessResponse>(
    "/api/auth/verify-2fa-login",
    {
      userId,
      token,
    },
  );

  return res.data;
};
