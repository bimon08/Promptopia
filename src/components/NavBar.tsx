import React, { useEffect, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@nextui-org/react";
import Image from "next/image";
import DialogForm from "./DialogForm";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { cn } from "@src/lib/utils";


export const AcmeLogo = () => (
  <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
    <path
      clipRule="evenodd"
      d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

export default function NavbarContentDemo() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [providers, setProviders] = useState<any | null>();
  const { data: session, status } = useSession();
  const router = useRouter();
  const { theme, setTheme } = useTheme();


  useEffect(() => {
    const getProvider = async () => {
      try {
        const res = await getProviders();
        setProviders(res);
      } catch (error) {
        console.error("Error fetching providers:", error);
      }
    };
    getProvider();
  }, []);

  const closeDialog = () => setShowDialog(!showDialog);
  const handleSignOut = async () => {
    await signOut();
    router.replace("/");
  };

  const renderAuthButtons = () => {
    if (session) {
      return (
        <>
          <NavbarItem>
            <button color="foreground" onClick={closeDialog}>
              Create Post
            </button>
          </NavbarItem>
          <NavbarItem>
            <button color="danger" onClick={handleSignOut}>
              Sign Out
            </button>
          </NavbarItem>
          
        </>
      );
    } else {
      return (
        <NavbarItem>
          <button color="foreground" onClick={() => signIn()}>
            Sign In
          </button>
        </NavbarItem>
      );
    }
  };

  const menuItems = [
    "Profile",
    "Dashboard",
    "Activity",
    "Analytics",
    "System",
    "Deployments",
    "My Settings",
    "Team Settings",
    "Help & Feedback",
    "Log Out",
  ];

  return (
    <Navbar
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      shouldHideOnScroll
    >
      <NavbarBrand className="hidden  gap-2 sm:flex">
        <Image
          src="/assets/images/onePunchMan.png"
          alt="logo"
          width={30}
          height={30}
          className="hidden rounded-full object-cover sm:block"
          onClick={() => router.push("/")}
        />
        <p className="font-bold text-inherit">Empower</p>
      </NavbarBrand>
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        />
        <p className="font-bold text-inherit">Empower</p>
      </NavbarContent>

      <NavbarContent className="hidden gap-4 sm:flex" justify="center">
        {renderAuthButtons()}
      </NavbarContent>

      <NavbarContent as="div" justify="end">
        {" "}
        <NavbarItem>
          <Button
            variant={"ghost"}
           
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? <Sun /> : <Moon />}
          </Button>
        </NavbarItem>
        <NavbarItem>
          {session?.user?.image && (
            <Avatar
              // bordered
              src={session.user?.image || ""}
              color="primary"
              onClick={() => router.push("/profile")}
              // pointer
              size="sm"
              alt="user_image"
            />
          )}
        </NavbarItem>
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              color={
                index === 2
                  ? "warning"
                  : index === menuItems.length - 1
                  ? "danger"
                  : "foreground"
              }
              href="#"
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
      <DialogForm open={showDialog} onClose={closeDialog} onSubmit={() => {}} />
    </Navbar>
  );
}
