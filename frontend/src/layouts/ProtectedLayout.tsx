import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar"; // Adjust path to your navbar

const ProtectedLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedLayout;
