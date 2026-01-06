import axios from "axios";

/* export const verifyEmail = async (
  token: string
): Promise<{ message: string }> => {
  const res = await axios.get(
    `http://localhost:4004/api/auth/verify-email?token=${token}`
  );

  return res.data;
}; */

export const verifyEmail = async (
  token: string
): Promise<{ message: string }> => {
  console.log("🌐 Frontend sending token:", token);
  console.log("🌐 Token length:", token.length);

  const res = await axios.get(
    `http://localhost:4004/api/auth/verify-email?token=${token}`
  );

  console.log("🌐 Response from backend:", res.data);

  return res.data;
};
