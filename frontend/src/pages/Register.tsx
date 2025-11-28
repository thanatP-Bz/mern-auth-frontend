import { useState } from "react";
import { useNavigate } from "react-router";
import { registerUser } from "../api/registerApi";
import { useAuthContext } from "../hooks/useAuthContext";

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
      dispatch({ type: "LOGIN", payload: user });
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>register</h2>

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

      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
