import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React from "react";
import { login } from "@/api/User";
import { loginUser } from "@/helpers/authHelper";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BiLoader } from "react-icons/bi";

function Login() {
  const [error, setServerError] = React.useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const formData = {
    email: "",
    password: "",
  };

  const handleSignup = async () => {
    const emailInput = document.getElementById("email") as HTMLInputElement;
    const passwordInput = document.getElementById(
      "password"
    ) as HTMLInputElement;
    setLoading(true);
    formData.email = emailInput.value;
    formData.password = passwordInput.value;
    const data = await login(formData);
    if (data.error) {
      setServerError(data.error);
      toast.error(data.error);
      setLoading(false);
    } else {
      loginUser(data);
      navigate("/");
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 to-gray-800">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-96 bg-white shadow-2xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold tracking-tight">
              Login
            </CardTitle>
            <CardDescription className="text-gray-500">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </Label>
              <Input
                id="email"
                name="email"
                placeholder="m@example.com"
                required
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </Label>
              <Input
                id="password"
                name="password"
                required
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              {loading ? (
                <Button disabled className="w-full bg-gray-800 text-white">
                  <BiLoader className="animate-spin mr-2" />
                  Loading
                </Button>
              ) : (
                <Button
                  className="w-full bg-gray-800 text-white hover:bg-gray-700"
                  type="submit"
                  onClick={handleSignup}
                >
                  Login
                </Button>
              )}
            </motion.div>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-2 border-t border-gray-200 pt-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Button
                variant="link"
                className="p-0 text-gray-800 hover:text-gray-600"
                onClick={() => navigate("/signup")}
              >
                Sign up
              </Button>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}

export default Login;
