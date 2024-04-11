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
import { signup } from "@/api/User";
import { loginUser } from "@/helpers/authHelper";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";
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
      alert("Passwords do not match");
      return;
    }
    // console.log(formData);

    const data = await signup(formData);
    // console.log(data);

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
    <div className="w-[100vw] h-[100vh] ">
      <Card className="mx-auto max-w-sm align-middle mt-6 shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">SignUp</CardTitle>
          <CardDescription>
            Enter the Details to create a new account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="Username">Username</Label>
              <Input
                id="Username"
                name="Username"
                placeholder="Aditya"
                required
                type="text"
              />
            </div>
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
            <div className="space-y-2">
              <Label htmlFor="cpassword">Confirm Password</Label>
              <Input id="cpassword" name="cpassword" required type="password" />
            </div>

            {loading ? (
              <Button disabled className="w-full">
                {" "}
                <BiLoader className="animate-spin" />
                ..loading
              </Button>
            ) : (
              <Button className="w-full" type="submit" onClick={handleSignup}>
                Signup
              </Button>
            )}
          </div>
          <div className="w-full ">
            Don't have an account?{" "}
            <Button
              variant="link"
              className={"p-0"}
              onClick={() => {
                navigate("/Login");
              }}
            >
              Login
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full flex gap-1 items-center">
            <FaGoogle /> Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Signup;
