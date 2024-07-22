import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React from "react";
import { signup } from "@/api/User";
import { loginUser } from "@/helpers/authHelper";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BiLoader } from "react-icons/bi";

function Signup() {
  const [error, setServerError] = React.useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const formData = {
    username: "",
    email: "",
    password: "",
  };

  const handleSignup = async () => {
    setLoading(true);
    const usernameInput = document.getElementById(
      "Username"
    ) as HTMLInputElement;
    const emailInput = document.getElementById("email") as HTMLInputElement;
    const passwordInput = document.getElementById(
      "password"
    ) as HTMLInputElement;
    const confirmPasswordInput = document.getElementById(
      "cpassword"
    ) as HTMLInputElement;

    formData.username = usernameInput.value;
    formData.email = emailInput.value;
    formData.password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    if (formData.password !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    const data = await signup(formData);

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
              Sign Up
            </CardTitle>
            <CardDescription className="text-gray-500">
              Create a new account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label
                htmlFor="Username"
                className="text-sm font-medium text-gray-700"
              >
                Username
              </Label>
              <Input
                id="Username"
                name="Username"
                placeholder="johndoe"
                required
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
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
                placeholder="john@example.com"
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
            <div className="space-y-2">
              <Label
                htmlFor="cpassword"
                className="text-sm font-medium text-gray-700"
              >
                Confirm Password
              </Label>
              <Input
                id="cpassword"
                name="cpassword"
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
                  Sign Up
                </Button>
              )}
            </motion.div>
            <p className="text-sm text-center text-gray-600">
              Already have an account?{" "}
              <Button
                variant="link"
                className="p-0 text-gray-800 hover:text-gray-600"
                onClick={() => navigate("/Login")}
              >
                Log in
              </Button>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default Signup;
