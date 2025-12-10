import { useState } from "react";
import { useNavigate } from "react-router";
import { loginUser } from "../api/loginApi";
import { useAuthContext } from "../hooks/useAuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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

    if (!form.email || !form.password) {
      toast("Please enter Email and Password", {
        style: {
          background: "#0ea5e9", // sky-500
          color: "white",
          border: "1px solid #0ea5e9",
        },
      });
    }

    try {
      const user = await loginUser(form.email, form.password);
      dispatch({ type: "LOGIN", payload: user });

      navigate("/");
    } catch (error) {
      console.log(error);
      toast("Incorrect Password", {
        style: {
          background: "#0ea5e9", // sky-500
          color: "white",
          border: "1px solid #0ea5e9",
        },
      });
    }

    setForm({ email: "", password: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

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
