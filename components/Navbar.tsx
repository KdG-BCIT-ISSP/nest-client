import MenuIcon from "@/public/svg/Menu";
import SearchBar from "./SearchBar";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { useAtom } from "jotai";
import { isAuthenticatedAtom } from "@/atoms/auth/atom";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/curated-articles", label: "Articles" },
  { href: "/posts", label: "Community" },
];

const USER_DROPDOWN_LINKS = [
  { href: "/profile", label: "Profile" },
  { href: "/profile/saved-posts", label: "Saved Posts" },
  { href: "/profile/notifications", label: "Notification" },
];

export default function Navbar() {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isAuthenticated] = useAtom(isAuthenticatedAtom);

  const [, , removeCookie] = useCookies(["refreshToken"]);

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    removeCookie("refreshToken", { path: "/" });
    localStorage.removeItem("accessToken");
    window.location.href = "/";
  };

  return (
    <nav className="bg-primary border-gray-200 dark:bg-gray-900 z-50">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-5">
        <Link href="/" className="flex items-center space-x-3">
          <span className="text-2xl font-semibold whitespace-nowrap dark:text-white text-secondary">
            LOGO
          </span>
        </Link>

        <div className="flex-1 mx-4 max-w-sm">
          <SearchBar />
        </div>

        <div className="hidden md:flex md:items-center md:space-x-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-900 hover:text-secondary dark:text-white dark:hover:text-secondary"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-3">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={toggleUserDropdown}
                type="button"
                className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              >
                <span className="sr-only">Open user menu</span>
                <Image
                  className="w-8 h-8 rounded-full"
                  src="/images/default_profile_image.png"
                  alt="User profile"
                  width={32}
                  height={32}
                  priority
                />
              </button>

              {isUserDropdownOpen && (
                <div className="z-50 absolute right-0 mt-2 w-48 bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg dark:bg-gray-700 dark:border-gray-600 dark:divide-gray-600">
                  <div className="px-4 py-3">
                    <span className="block text-sm text-gray-900 dark:text-white">
                      Bonnie Green
                    </span>
                    <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                      name@flowbite.com
                    </span>
                  </div>
                  <ul className="py-2">
                    {USER_DROPDOWN_LINKS.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100
                                     dark:hover:bg-gray-600 dark:text-gray-200"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block px-4 py-2 w-full text-left text-sm text-red-600
                                   hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200"
                      >
                        Sign out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            // not logged in
            <div className="flex items-center space-x-4 px-2">
              <Link
                href="/auth/login"
                className="px-4 py-2 text-sm font-medium text-white bg-secondary rounded-md"
              >
                Log In
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 text-sm font-medium text-white bg-tertiary rounded-md "
              >
                Sign Up
              </Link>
            </div>
          )}

          <button
            data-collapse-toggle="navbar-user"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-user"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <MenuIcon />
          </button>
        </div>
      </div>
    </nav>
  );
}
