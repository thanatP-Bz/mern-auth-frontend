import api from "@/api/axios/axiosConfig";
import type { Disable2FAReponse } from "@/types/authUser";

export const disable2FAApi = async (
  password: string,
): Promise<Disable2FAReponse> => {
  const res = await api.post<Disable2FAReponse>(`/api/auth/2fa/disable`, {
    password,
  });

  return res.data;
};
