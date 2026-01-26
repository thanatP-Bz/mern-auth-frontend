import { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../../api/authentication/auth/registerApi";
import { resendVerificationEmail } from "@/api/authentication/email/resendVerificationEmail";
import { useAuthContext } from "../../hooks/useAuthContext";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { BadgeCheck, BadgeAlert, User, Lock, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Register = () => {
  const { dispatch } = useAuthContext();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("click");

    if (form.password.length < 8) {
      toast("Password must be at least 8 characters", {
        icon: <BadgeAlert className="w-5 h-5 text-red-500" />,
        style: {
          background: "white",
          color: "red",
          border: "1px solid red",
        },
      });
      return false;
    }

    try {
      const data = await registerUser(form.name, form.email, form.password);
      setUserEmail(form.email);
      setShowVerificationMessage(true);

      dispatch({
        type: "REGISTER",
        payload: {
          user: {
            _id: data.user._id,
            name: data.user.name,
            email: data.user.email,
            twoFactorEnabled: data.user.twoFactorEnabled,
            hasPassword: data.user.hasPassword,
          }, // ← Just pass the whole user object
        },
      });

      toast("Register Successfully!", {
        icon: <BadgeCheck className="w-5 h-5 text-green-500" />,
        style: {
          background: "white",
          color: "green",
          border: "1px solid green",
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message = error.response?.data?.message;

      toast(
        (message?.includes("verification")
          ? "Please verify email before logging in, check your inbox"
          : message) || "Something went wrong",
        {
          icon: <BadgeAlert className="w-5 h-5 text-red-500" />,
          style: {
            background: "white",
            color: "red",
            border: "1px solid red",
          },
        },
      );
    }

    setForm({ name: "", email: "", password: "" });
  };
  console.log(userEmail);
  const handleResendEmail = async () => {
    try {
      setLoading(true);
      await resendVerificationEmail(userEmail);
      toast("Verification email resent Successfully!", {
        icon: <BadgeCheck className="w-5 h-5 text-green-500" />,
        style: {
          background: "white",
          color: "green",
          border: "1px solid green",
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message = error.response?.data?.message;
      toast(message || "Something went wrong", {
        icon: <BadgeAlert className="w-5 h-5 text-red-500" />,
        style: {
          background: "white",
          color: "red",
          border: "1px solid red",
        },
      });
    }
  };

  if (showVerificationMessage) {
    return (
      <div>
        <p>
          We sent a verification link to <strong>{userEmail}</strong>
          Please check your inbox and click the link to verify your account
        </p>
        <button
          type="submit"
          onClick={handleResendEmail}
          disabled={loading}
          className="cursor-pointer"
        >
          didn't get email? resend
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto p-8 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label>Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              className="pl-10 border-none"
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              className="pl-10 border-none"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              className="pl-10 border-none"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          className="mt-5 w-full cursor-pointer bg-gray-800 text-white hover:bg-gray-900"
        >
          submit
        </Button>
      </form>

      {/* Navigation Links */}
      <div className="mt-6 text-center space-y-3">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
          >
            Login here
          </Link>
        </p>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Forgot your password?{" "}
            <Link
              to="/forget-password"
              className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
            >
              Reset it here
            </Link>
          </p>
        </div>

        <Link
          to="/auth"
          className="block text-sm text-gray-500 hover:text-gray-700 mt-4"
        >
          ← Back to options
        </Link>

        {showVerificationMessage && (
          <div>
            <h3>Check Your Email!</h3>
            <p>
              We're send the verification link to your email. Please check your
              inbox
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
