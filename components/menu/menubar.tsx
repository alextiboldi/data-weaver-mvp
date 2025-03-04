"use client";
import React from "react";
import { Menu } from "./menu";
import UserMenu from "./usermenu";
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "../ui/menubar";
import {
  FileIcon,
  ImportIcon,
  LogOutIcon,
  MessageSquareIcon,
  StarIcon,
  PlusIcon,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { useRouter } from "next/navigation";
import useStore from "@/store/app-store";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { NewProjectWizard } from "@/components/NewProjectWizard";

type Props = {};

const MenuBar = (props: Props) => {
  const router = useRouter();
  const { selectedProject } = useStore();
  const user = {
    name: "Alex Tiboldi",
    email: "alex.tiboldi@gmail.com",
    avatar: "https://avatars.githubusercontent.com/u/204366",
  };

  const navigateTo = (path: string) => () => {
    router.push(`/dashboard/${selectedProject?.id}/${path}`);
  };
  return (
    <Menubar className=" flex justify-between rounded-lg px-2 py-1 mt-2 mb-4">
      <div className="flex items-center">
        {/* File Menu */}
        <MenubarMenu>
          <MenubarTrigger>Project</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Overview</MenubarItem>

            <MenubarSeparator />
            <MenubarSub>
              <MenubarSubTrigger>Open Recent</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem>Email link</MenubarItem>
                <MenubarItem>Messages</MenubarItem>
                <MenubarItem>Notes</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarSeparator />
            <Dialog>
              <DialogTrigger asChild>
                <MenubarItem onSelect={(e) => e.preventDefault()}>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  New Project
                </MenubarItem>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <NewProjectWizard />
              </DialogContent>
            </Dialog>
            <MenubarSeparator />
            <MenubarItem>Settings</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Explore</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={navigateTo("data")}>Schema</MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={navigateTo("query")}>Sql</MenubarItem>
            <MenubarItem>Editor</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Glossary</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={navigateTo("dictionary")}>
              Overview
            </MenubarItem>
            <MenubarItem>Documentation</MenubarItem>
          </MenubarContent>
        </MenubarMenu>

        <MenubarMenu>
          <MenubarTrigger>Search</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>Full Text</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        {/* <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent>
            <MenubarCheckboxItem>Always Show Bookmarks Bar</MenubarCheckboxItem>
            <MenubarCheckboxItem checked>
              Always Show Full URLs
            </MenubarCheckboxItem>
            <MenubarSeparator />
            <MenubarItem inset>
              Reload <MenubarShortcut>⌘R</MenubarShortcut>
            </MenubarItem>
            <MenubarItem disabled inset>
              Force Reload <MenubarShortcut>⇧⌘R</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem inset>Toggle Fullscreen</MenubarItem>
            <MenubarSeparator />
            <MenubarItem inset>Hide Sidebar</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Profiles</MenubarTrigger>
          <MenubarContent>
            <MenubarRadioGroup value="benoit">
              <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
              <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
              <MenubarRadioItem value="Luis">Luis</MenubarRadioItem>
            </MenubarRadioGroup>
            <MenubarSeparator />
            <MenubarItem inset>Edit...</MenubarItem>
            <MenubarSeparator />
            <MenubarItem inset>Add Profile...</MenubarItem>
          </MenubarContent> */}
      </div>

      <div className="flex items-center">
        {/* User Menu */}
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
      </div>
    </Menubar>
  );
};

export default MenuBar;
