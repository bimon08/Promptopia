"use client";

import React, { useEffect, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Avatar,
  NavbarMenu,
  NavbarMenuToggle,
} from "@nextui-org/react";
import Image from "next/image";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { cn } from "@src/lib/utils";
import DialogForm from "./DialogForm";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    // Make sure that the theme is synchronized when the component mounts
    document.body.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const handleSignOut = async () => {
    await signOut();
    router.replace("/");
  };

  const closeDialog = () => setShowDialog(!showDialog);

  const renderAuthButtons = () => {
    if (session) {
      return (
        <>
          <button
            className={cn(
              "mr-2 py-2 text-xs font-semibold transition duration-300 ease-in-out",
              theme === "light"
                ? "text-black hover:bg-opacity-80"
                : "text-white hover:bg-opacity-80",
            )}
            onClick={handleSignOut}
          >
            Sign Out
          </button>
          <button
            onClick={closeDialog}
            className={cn(
              "py-2 text-xs font-semibold transition duration-300 ease-in-out",
              theme === "light"
                ? "text-black hover:bg-opacity-80"
                : "text-white hover:bg-opacity-80",
            )}
          >
            Create Post
          </button>
        </>
      );
    } else {
      return (
        <button
          className={cn(
            "py-2 text-xs font-semibold transition duration-300 ease-in-out",
            theme === "light"
              ? "text-black hover:bg-opacity-80"
              : "text-white hover:bg-opacity-80",
          )}
          onClick={() => signIn()}
        >
          Sign In
        </button>
      );
    }
  };

  return (
    <Navbar shouldHideOnScroll onMenuOpenChange={setIsMenuOpen}>
      <NavbarMenuToggle
        aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        className="sm:hidden"
      />
      <NavbarBrand className="items-center gap-2 sm:flex">
        <Image
          src="/assets/images/logo.svg"
          alt="logo"
          width={30}
          height={30}
          className="hidden rounded-full object-cover sm:flex"
          onClick={() => router.push("/")}
        />
        <p
          className={cn(
            "font-bold",
            theme === "light" ? "text-black" : "text-white",
          )}
        >
          Build And Grow
        </p>
      </NavbarBrand>

      <NavbarContent justify="end">
        {/* Theme Toggle Buttons */}
        <NavbarItem className="flex items-center">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={cn(
              "rounded-full p-2 focus:outline-none",
              theme === "light" ? "text-black" : "text-white",
            )}
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </NavbarItem>

        <NavbarItem className="hidden sm:flex">
          {renderAuthButtons()}
        </NavbarItem>

        {/* Avatar */}
        <NavbarItem>
          {session?.user?.image && (
            <Avatar
              src={session.user?.image || ""}
              color="primary"
              onClick={() => router.push("/profile")}
              size="sm"
              alt="user_image"
            />
          )}
        </NavbarItem>
      </NavbarContent>

      {/* Mobile Menu for Authentication */}
      <NavbarMenu>{renderAuthButtons()}</NavbarMenu>

      <DialogForm open={showDialog} onClose={closeDialog} onSubmit={() => {}} />
    </Navbar>
  );
}
