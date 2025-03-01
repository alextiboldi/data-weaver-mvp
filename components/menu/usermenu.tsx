import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  LogOutIcon,
  MessageSquareIcon,
  Sparkles,
  StarIcon,
} from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "../ui/menubar";

type Props = {};

const UserMenu = (props: Props) => {
  const user = {
    name: "Test User",
    email: "alex.tiboldi@gmail.com",
    avatar: "https://avatars.githubusercontent.com/u/204366",
  };
  return (
    <MenubarMenu>
      <MenubarTrigger className="flex items-center gap-2">
        <Avatar className="h-6 w-6">
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <span className="font-medium">{user.name}</span>
      </MenubarTrigger>
      <MenubarContent align="end">
        <MenubarItem>
          <StarIcon className="mr-2 h-4 w-4" />
          Upgrade to Pro
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem>
          <MessageSquareIcon className="mr-2 h-4 w-4" />
          Feedback
        </MenubarItem>
        <MenubarSeparator />
        <MenubarItem>
          <LogOutIcon className="mr-2 h-4 w-4" />
          Logout
        </MenubarItem>
      </MenubarContent>
    </MenubarMenu>
  );
};

export default UserMenu;
