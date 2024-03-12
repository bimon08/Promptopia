import Link from "next/link";
import Image from "next/image";
import DialogForm from "./DialogForm";
import { useEffect, useState } from "react";
import { signIn, signOut, useSession, getProviders } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { cn } from "@src/lib/utils";

const Nav = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [providers, setProviders] = useState<any | null>();
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
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

  const renderAuthButtons = () =>
    providers &&
    Object.values(providers).map((provider: any) => (
      <button
        key={provider.name}
        onClick={() => {
           console.log("Provider ID:", provider.id);
          signIn(provider.id)}
        } 
        className="black_btn"
      >
        Sign in
      </button>
    ));

  const renderUserMenu = () => (
    <div className="flex gap-3 md:gap-5">
      <Button
        className={cn(
          "black_btn",
          "px-4 py-2 text-sm font-semibold",
          theme === "light"
            ? "bg-gray-800 text-white hover:bg-gray-700"
            : "bg-gray-200 text-gray-800 hover:bg-gray-300",
        )}
        onClick={closeDialog}
      >
        Create Post
      </Button>
      <button
        type="button"
        onClick={handleSignOut}
        className={cn(
          "flex items-center justify-center rounded-full border px-5 py-1.5 text-center font-inter text-sm transition-all",
          theme === "light"
            ? "border-gray-300 bg-transparent text-gray-800 hover:bg-gray-200"
            : "border-gray-600 bg-transparent text-white hover:bg-gray-700",
        )}
      >
        Sign Out
      </button>
      <Link href="/profile">
        {session?.user?.image && (
          <Image
            src={session.user.image}
            width={37}
            height={37}
            className="rounded-full"
            alt="profile"
            onClick={() => setToggleDropdown(!toggleDropdown)}
          />
        )}
      </Link>
    </div>
  );

  const renderMobileMenu = () => (
    <div className="relative flex sm:hidden">
      {status === "authenticated" ? (
        <div className="flex">
          <Image
            src={session?.user?.image ?? ""}
            width={37}
            height={37}
            className="rounded-full"
            alt="profile"
            onClick={() => setToggleDropdown(!toggleDropdown)}
          />
          {toggleDropdown && (
            <div className="dropdown">
              <Link
                href="/profile"
                className="dropdown_link"
                onClick={() => setToggleDropdown(false)}
              >
                My Profile
              </Link>
              <Link
                href="/create-message"
                className="dropdown_link"
                onClick={() => setToggleDropdown(false)}
              >
                Create message
              </Link>
              <button
                type="button"
                onClick={() => {
                  setToggleDropdown(false);
                  handleSignOut();
                }}
                className="black_btn mt-5 w-full"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      ) : (
        renderAuthButtons()
      )}
    </div>
  );

  return (
    <nav className="flex w-full items-center justify-between p-6">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/assets/images/logo.svg"
          alt="logo"
          width={30}
          height={30}
          className="object-contain"
        />
        <p
          className={cn(
            "logo_text",
            theme === "light" ? "text-gray-800" : "text-gray-300",
          )}
        >
          Empower
        </p>
      </Link>
      <div className="hidden sm:flex">
        {status === "authenticated" ? renderUserMenu() : renderAuthButtons()}
        {renderMobileMenu()}
      </div>
      <button
        className={cn(
          "flex items-center justify-center rounded-full border px-5 py-1.5 text-center font-inter text-sm transition-all",
          theme === "light"
            ? "border-gray-300 bg-transparent text-gray-800 hover:bg-gray-200"
            : "border-gray-600 bg-transparent text-white hover:bg-gray-700",
        )}
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        {theme === "light" ? <Moon /> : <Sun />}
      </button>
      <DialogForm open={showDialog} onClose={closeDialog} onSubmit={() => {}} />
    </nav>
  );
};

export default Nav;
