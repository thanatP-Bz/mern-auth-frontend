import axios from "axios";

export const resetPassword = async (token: string, newPassword: string) => {
  console.log("=== FRONTEND API CALL ===");
  console.log("Token being sent:", token);
  console.log("Token length:", token.length);
  console.log("Password:", newPassword ? "***exists***" : "missing");
  const res = await axios.post(
    `http://localhost:4004/api/auth/reset-password/${token}`,
    { password: newPassword } // Make sure it's "password", not "newPassword"
  );

  console.log("API Response:", res.data);
  return res.data;
};
