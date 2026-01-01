import { useState } from "react";
import { Link } from "react-router-dom";
import { forgetPassword } from "@/api/auth/forgetPasswordApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, BadgeCheck, BadgeAlert, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await forgetPassword(email);

      toast("Reset link sent to your email!", {
        icon: <BadgeCheck className="w-5 h-5 text-green-500" />,
        style: {
          background: "white",
          color: "green",
          border: "1px solid green",
        },
      });

      setIsSuccess(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast(error.response?.data?.message || "Something went wrong", {
        icon: <BadgeAlert className="w-5 h-5 text-red-500" />,
        style: {
          background: "white",
          color: "red",
          border: "1px solid red",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Success Screen
  if (isSuccess) {
    return (
      <div className="w-full max-w-sm mx-auto p-8 bg-white rounded-2xl shadow-md text-center">
        <div className="mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <BadgeCheck className="w-10 h-10 text-green-600" />
          </div>
        </div>
        <h2 className="text-2xl font-semibold mb-3">Check Your Email</h2>
        <p className="text-gray-600 mb-2">
          We've sent a password reset link to
        </p>
        <p className="text-gray-800 font-medium mb-6">{email}</p>
        <p className="text-sm text-gray-500 mb-6">
          The link will expire in 15 minutes.
        </p>

        <div className="space-y-3">
          <Link
            to="/login"
            className="block w-full py-2 text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
          >
            <ArrowLeft className="inline w-4 h-4 mr-1" />
            Back to Login
          </Link>

          <Link
            to="/auth"
            className="block text-sm text-gray-500 hover:text-gray-700"
          >
            Back to options
          </Link>
        </div>
      </div>
    );
  }

  // Forgot Password Form
  return (
    <div className="w-full max-w-sm mx-auto p-8 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-3">
        Forgot Password?
      </h2>
      <p className="text-gray-600 text-center text-sm mb-6">
        Enter your email address and we'll send you a link to reset your
        password.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label>Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              className="pl-10 border-none"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full cursor-pointer bg-gray-800 text-white hover:bg-gray-900"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </Button>
      </form>

      {/* Navigation Links */}
      <div className="mt-6 text-center space-y-2">
        <Link
          to="/auth/login"
          className="block text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
        >
          <ArrowLeft className="inline w-4 h-4 mr-1" />
          Back to Login
        </Link>

        <Link
          to="/auth"
          className="block text-sm text-gray-500 hover:text-gray-700"
        >
          Back to options
        </Link>
      </div>
    </div>
  );
};

export default ForgetPassword;
