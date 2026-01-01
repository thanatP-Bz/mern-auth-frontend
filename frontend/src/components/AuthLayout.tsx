import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 p-2">
            TaskManager
          </h1>
        </div>

        {/* Forms render here - NO card wrapper */}
        <Outlet />

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-8">
          © 2025 TaskManager. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
