import { useState } from "react";
import { useAuthContext } from "@/hooks/useAuthContext";
import { changePasswordApi } from "@/api/auth/changePasswordApi";
import { toast } from "sonner";
import { BadgeAlert, BadgeCheck } from "lucide-react";
import { Link } from "react-router";

const ChangePassword = () => {
  const { user } = useAuthContext();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.email) {
      return toast("user not found", {
        icon: <BadgeAlert className="w-5 h-5 text-red-500" />,
        style: {
          background: "white",
          color: "red",
          border: "1px solid red",
        },
      });
    }

    if (newPassword !== confirmNewPassword) {
      return toast("new password not matched", {
        icon: <BadgeAlert className="w-5 h-5 text-red-500" />,
        style: {
          background: "white",
          color: "red",
          border: "1px solid red",
        },
      });
    }

    try {
      await changePasswordApi(user?.email, oldPassword, newPassword);

      toast("Password change sccussfully!", {
        icon: <BadgeCheck className="w-5 h-5 text-green-500" />,
        style: {
          background: "white",
          color: "green",
          border: "1px solid green",
        },
      });
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
    }
  };
  return (
    <div>
      <h2>change passowrd</h2>
      <form action="submit" onSubmit={handleSubmit}>
        <div>
          <input
            type="password"
            name="password"
            placeholder="enter old password"
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="enter new password"
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="enter new password"
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
        </div>
        <button type="submit">submit</button>
        <Link to="/home">back to page</Link>
      </form>
    </div>
  );
};

export default ChangePassword;
