import { Link } from "react-router-dom";

const Auth = () => {
  return (
    <div className="text-center space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-3">Welcome Back!</h2>
        <p className="text-gray-600">Choose an option to get started</p>
      </div>

      <div className="space-y-4">
        <Link
          to="/login"
          className="block w-full py-3 px-6 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
        >
          Login to Your Account
        </Link>

        <Link
          to="/register"
          className="block w-full py-3 px-6 border-2 border-indigo-600 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
        >
          Create New Account
        </Link>
      </div>

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
    </div>
  );
};

export default Auth;
