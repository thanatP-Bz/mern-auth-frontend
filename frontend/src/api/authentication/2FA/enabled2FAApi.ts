import type { Enabled2FAResponse } from "@/types/authUser";
import api from "@/api/axios/axiosConfig";

export const enable2FAApi = async (): Promise<Enabled2FAResponse> => {
  const res = await api.post(`/api/2fa/enable`);
  return res.data;
};
