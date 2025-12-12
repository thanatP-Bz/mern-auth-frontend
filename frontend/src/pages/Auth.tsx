import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Login from "./Login";
import Register from "./Register";

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
      </div>
    </div>
  );
};

export default Auth;
