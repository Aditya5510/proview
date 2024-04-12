// import { Button } from "./components/ui/button";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DashBoard from "./views/DashBoard";
import Login from "./views/Login";
import Signup from "./views/Signup";
import PrivateRoute from "./helpers/PrivateRoute";
import Link from "./views/Link";

import { Toaster } from "@/components/ui/sonner";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <DashBoard />
      </PrivateRoute>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/Signup",
    element: <Signup />,
  },
  {
    path: "/Link",
    element: (
      <PrivateRoute>
        <Link />
      </PrivateRoute>
    ),
  },
  {
    path: "/data/:id",
    element: <DashBoard />,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;
