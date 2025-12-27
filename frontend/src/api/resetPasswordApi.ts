import axios from "axios";

export const resetPassword = async (token: string, newPassword: string) => {
  const res = await axios.post(
    `http://localhost:4004/api/auth/reset-password/${token}`,
    { password: newPassword }
  );

  return res.data;
};
