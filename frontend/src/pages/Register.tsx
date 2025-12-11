import { useState } from "react";
import { useNavigate } from "react-router";
import { registerUser } from "../api/registerApi";
import { useAuthContext } from "../hooks/useAuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { BadgeCheck, BadgeAlert } from "lucide-react";

const Register = () => {
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const user = await registerUser(form.name, form.email, form.password);
      dispatch({ type: "REGISTER", payload: user });

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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    setForm({ name: "", email: "", password: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="name"
        name="name"
        value={form.name}
        placeholder="name"
        onChange={handleChange}
        required
      />

      <input
        type="email"
        name="email"
        value={form.email}
        placeholder="email"
        onChange={handleChange}
        required
      />

      <input
        type="password"
        name="password"
        value={form.password}
        placeholder="password"
        onChange={handleChange}
        required
      />

      <Button
        type="submit"
        className="text-white bg-emerald-600 box-border border border-transparent hover:bg-warning-strong focus:ring-4 focus:ring-warning-medium shadow-xs font-medium leading-5 rounded-full text-sm px-4 py-2.5 focus:outline-none cursor-pointer"
      >
        Register
      </Button>
    </form>
  );
};

export default Register;
