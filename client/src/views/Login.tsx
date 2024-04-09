import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React from "react";
import { login } from "@/api/User";
import { loginUser } from "@/helpers/authHelper";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";

function Login() {
  const [error, setServerError] = React.useState("");
  const navigate = useNavigate();

  const formData = {
    email: "",
    password: "",
  };

  const handleSignup = async () => {
    const emailInput = document.getElementById("email") as HTMLInputElement;
    const passwordInput = document.getElementById(
      "password"
    ) as HTMLInputElement;

    formData.email = emailInput.value;
    formData.password = passwordInput.value;

    const data = await login(formData);

    if (data.error) {
      setServerError(data.error);
    } else {
      loginUser(data);
      navigate("/");
    }
  };

  return (
    <div className="w-[100vw] h-[100vh] ">
      <Card className="mx-auto max-w-sm align-middle mt-6 shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>Login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="m@example.com"
                required
                type="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" required type="password" />
            </div>
            <Button className="w-full" type="submit" onClick={handleSignup}>
              Login
            </Button>
          </div>
          <div className="w-full ">
            Don't have an account?{" "}
            <Button
              variant="link"
              className={"p-0"}
              onClick={() => {
                navigate("/signup");
              }}
            >
              Signup
            </Button>
          </div>
        </CardContent>
        <CardFooter className=" border-t-lime-200">
          <Button className="w-full flex gap-1 items-center">
            <FaGoogle /> Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Login;
