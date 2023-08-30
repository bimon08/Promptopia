"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";

const Nav = () => {
  const { data: session } = useSession();
  const [providers, setProviders] = useState(null);
  const [toggleDropdown, setToggleDropdown] = useState(false);

  useEffect(() => {
    async function fetchProviders() {
      const response = await getProviders();
      setProviders(response);
    }
    fetchProviders();
  }, []);

  const handleDropdownToggle = () => {
    setToggleDropdown((prevToggle) => !prevToggle);
  };

  const handleDropdownItemClick = () => {
    setToggleDropdown(false);
  };

  const renderAuthButtons = () => {
    console.log("Session:", session); // Add this line for debugging
    if (session?.user) {
      return (
        <div className="flex gap-3 md:gap-5">
          <Link href="/create-prompt" className="black_btn">
            Create Post
          </Link>
          <button className="outline_btn" type="button" onClick={signOut}>
            Sign Out
          </button>
          <Link href="/profile">
            <Image
              className="rounded-full"
              src={session.user.image}
              alt="Profile"
              width={37}
              height={37}
            />
          </Link>
        </div>
      );
    } else if (providers) {
      return (
        <div className="flex gap-3 md:gap-5">
          {Object.values(providers).map((provider) => (
            <button
              key={provider.name}
              className="black_btn"
              type="button"
              onClick={() => signIn(provider.id)}
            >
              Sign In
            </button>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderMobileDropdown = () => {
    if (session?.user) {
      return (
        <div className="relative flex sm:hidden">
          <div className="flex">
            <Image
              className="rounded-full"
              onClick={handleDropdownToggle}
              src={session.user.image}
              alt="Profile"
              width={37}
              height={37}
            />
            {toggleDropdown && (
              <div className="dropdown">
                <Link
                  href="/profile"
                  className="dropdown_link"
                  onClick={handleDropdownItemClick}
                >
                  Profile
                </Link>
                <Link
                  href="/create-prompt"
                  className="dropdown_link"
                  onClick={handleDropdownItemClick}
                >
                  Create Prompt
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    handleDropdownItemClick();
                    signOut();
                  }}
                  className="black_btn mt-5 w-full"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <nav className="flex-between mb-16 w-full pt-3">
      <Link href="/" className="flex gap-2">
        <Image
          src="/assets/images/logo.svg"
          alt="Promptopia logo"
          width={30}
          height={30}
          className="object-contain"
        />
        <p className="logo_text">Promptopia</p>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden sm:flex">{renderAuthButtons()}</div>

      {/* Mobile Navigation */}
      {renderMobileDropdown()}
    </nav>
  );
};

export default Nav;
