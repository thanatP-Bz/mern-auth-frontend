import api from "@/api/axios/axiosConfig";
import type { Verify2FASetupResponse } from "@/types/authUser";

export const verify2FASetupApi = async (
  token: string,
): Promise<Verify2FASetupResponse> => {
  const res = await api.post<Verify2FASetupResponse>("/api/2fa/verify-setup", {
    token,
  });
  return res.data;
};
