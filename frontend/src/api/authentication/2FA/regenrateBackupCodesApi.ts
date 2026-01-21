import api from "@/api/axios/axiosConfig";
import type { RegenerateBackupCodesResponse } from "@/types/authUser";

export const regenerateBackupCodesApi =
  async (): Promise<RegenerateBackupCodesResponse> => {
    const res = await api.post(`/api/auth/2fa/regenerate-backup-codes`);

    return res.data;
  };
