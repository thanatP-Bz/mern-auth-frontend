import { useState } from "react";
import { useNavigate } from "react-router";
import { loginUser } from "../api/loginApi";
import { useAuthContext } from "../hooks/useAuthContext";

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
      /* localStorage.setItem("user", JSON.stringify(user)); */
      navigate("/");
    } catch (error) {
      console.log(error);
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

      <button type="submit">Log In</button>
    </form>
  );
};

export default Login;
