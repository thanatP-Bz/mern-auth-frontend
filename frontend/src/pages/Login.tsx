/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router";
import { loginUser } from "../api/loginApi";
import { useAuthContext } from "../hooks/useAuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Mail } from "lucide-react";
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
    <div className="w-full max-w-sm mx-auto p-8 bg-card rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label>Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              className="pl-10  border-none"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              className="pl-10  border-none"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </div>
        </div>

        <Button type="submit" className="mt-5 w-full cursor-pointer">
          Log In
        </Button>
      </form>
    </div>
  );
};

export default Login;
