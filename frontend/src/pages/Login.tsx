/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router";
import { loginUser } from "../api/loginApi";
import { useAuthContext } from "../hooks/useAuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BadgeCheck, BadgeAlert } from "lucide-react";

const Login = () => {
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const user = await loginUser(form.email, form.password);
      dispatch({ type: "LOGIN", payload: user });

      localStorage.setItem("user", JSON.stringify(user));

      toast("Login Successfully!", {
        icon: <BadgeCheck className="w-5 h-5 text-green" />,
        style: {
          background: "white",
          color: "green",
          border: "green 1px solid",
        },
      });

      navigate("/");
    } catch (error: any) {
      console.log(error);
      toast(error.response?.data?.message || "somthing went wrong", {
        icon: <BadgeAlert className="w-5 h-5 text-red" />,
        style: {
          background: "white",
          color: "red",
          border: "red 1px solid",
        },
      });
    }

    setForm({ email: "", password: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        value={form.email}
        placeholder="email"
        onChange={handleChange}
      />

      <input
        type="password"
        name="password"
        value={form.password}
        placeholder="password"
        onChange={handleChange}
      />

      <Button
        type="submit"
        className="text-white bg-emerald-600 box-border border border-transparent hover:bg-warning-strong focus:ring-4 focus:ring-warning-medium shadow-xs font-medium leading-5 rounded-full text-sm px-4 py-2.5 focus:outline-none cursor-pointer"
      >
        Log In
      </Button>
    </form>
  );
};

export default Login;
