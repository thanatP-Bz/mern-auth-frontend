import api from "@/api/axios/axiosConfig";
import type { Disable2FAReponse } from "@/types/authUser";

export const disable2FAApi = async (
  password: string,
): Promise<Disable2FAReponse> => {
  // ✅ Only send password in body if it's not empty (for OAuth users, don't send password field at all)
  const body = password ? { password } : {};

  const res = await api.post<Disable2FAReponse>(`/api/2fa/disable`, body);

  return res.data;
};
