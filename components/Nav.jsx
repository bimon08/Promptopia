"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { SignIn, SignOut, useSession, getProviders } from "next-auth/react";

const Nav = () => {
  return (
    <nav className=" flex-between mb-16 w-full pt-3">
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

      {/* Mobile Nav */}
      <div className="hidden sm:flex"></div>
    </nav>
  );
};

export default Nav;
