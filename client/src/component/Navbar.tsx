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
    <Menubar className="flex justify-center h-14 items-center gap-3 ">
      <MenubarMenu>
        <MenubarTrigger className="flex items-center gap-1 justify-center cursor-pointer">
          {" "}
          <MdHome className="h-6 w-6 " /> Home
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            New Tab <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <Link to="/link">
        <MenubarMenu>
          <div className="cursor-pointer flex gap-1 items-center">
            <FaLink className="h-6 w-6" />
            Links
          </div>
        </MenubarMenu>
      </Link>
      <MenubarMenu>
        <MenubarTrigger className="flex justify-center items-center gap-1 cursor-pointer">
          {" "}
          <RiAdminFill className="h-6 w-6" />
          Profile
        </MenubarTrigger>
        <MenubarContent>
          <MenubarSeparator />
          <MenubarItem inset>View Profile</MenubarItem>
          <MenubarSeparator />
          <MenubarItem inset>
            <Button onClick={handleLogout}>Logout</Button>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
