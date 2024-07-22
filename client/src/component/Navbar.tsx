import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { MdHome } from "react-icons/md";

import { RiAdminFill } from "react-icons/ri";
import { FaLink } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "@/helpers/authHelper";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const navigate = useNavigate();
  function handleLogout() {
    logoutUser();
    navigate("/login");
  }

  return (
    // <Menubar className="flex justify-center h-14 items-center gap-3 ">
    //   <Link to="/">
    //     {" "}
    //     <MenubarMenu>
    //       <MenubarTrigger className="flex items-center gap-1 justify-center cursor-pointer">
    //         {" "}
    //         <MdHome className="h-6 w-6 " /> Home
    //       </MenubarTrigger>
    //     </MenubarMenu>
    //   </Link>

    //   <Link to="/link">
    //     <MenubarMenu>
    //       <div className="cursor-pointer flex gap-1 items-center">
    //         <FaLink className="h-6 w-6" />
    //         Links
    //       </div>
    //     </MenubarMenu>
    //   </Link>
    //   <MenubarMenu>
    //     <Button onClick={handleLogout}>Logout</Button>
    //   </MenubarMenu>
    // </Menubar>
    <div className="w-full bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex space-x-4">
            <Link
              to="/"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition duration-150 ease-in-out"
            >
              <MdHome className="h-5 w-5 mr-1" />
              Home
            </Link>
            <Link
              to="/link"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition duration-150 ease-in-out"
            >
              <FaLink className="h-5 w-5 mr-1" />
              Links
            </Link>
          </div>
          <Button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
          >
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
