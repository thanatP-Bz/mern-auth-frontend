import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Login from "./Login";
import Register from "./Register";
import { Link } from "react-router-dom";

const Auth = () => {
  return (
    <div>
      <div className="max-w-md mx-auto p-6">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="login" className="flex-1 cursor-pointer">
              Login
            </TabsTrigger>
            <TabsTrigger value="register" className="flex-1 cursor-pointer">
              Register
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Login />
          </TabsContent>

          <TabsContent value="register">
            <Register />
          </TabsContent>
        </Tabs>
        <div className="flex items-center justify-center p-4">
          <h4>forget your password?</h4>{" "}
          <Link to="/forget-password" className="ml-2 text-blue-500 underline">
            click here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Auth;
