import axios from "axios";
import type { AuthUser } from "../types/authUser";

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthUser> => {
  const res = await axios.post<AuthUser>(
    "http://localhost:4004/api/auth/login",
    {
      email,
      password,
    }
  );

  console.log(res);
  return res.data;
};
