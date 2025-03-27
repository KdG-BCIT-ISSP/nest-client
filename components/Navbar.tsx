"use client";
export const dynamic = "force-dynamic";

import MenuIcon from "@/public/svg/Menu";
import SearchBar from "./SearchBar";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useCookies } from "react-cookie";
import { useAtom } from "jotai";
import { userAtom } from "@/atoms/user/atom";
import { useTranslation } from "next-i18next";
import LocaleSwitcher from "./LocaleSwitcher";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation("common");
  const [userData] = useAtom(userAtom);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const pathname = usePathname();
  const isAuthenticated =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const [, , removeCookie] = useCookies(["refreshToken"]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
    };

    if (isUserDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isUserDropdownOpen]);

  if (!mounted) {
    return null;
  }

  const NAV_LINKS = [
    { href: "/", label: t("navigation.home") },
    { href: "/curated-articles", label: t("navigation.articles") },
    { href: "/posts", label: t("navigation.community") },
  ];

  const USER_DROPDOWN_LINKS = [
    ...(userData.role === "ADMIN" || userData.role === "SUPER_ADMIN"
      ? [{ href: "/admin/user-access", label: t("navigation.admin") }]
      : []),
    { href: "/profile", label: t("navigation.profile") },
    { href: "/profile/saved-posts", label: t("navigation.savedPosts") },
    { href: "/profile/notifications", label: t("navigation.notifications") },
  ];

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen((prev) => !prev);
  };

  const handleLogout = () => {
    removeCookie("refreshToken", { path: "/" });
    localStorage.removeItem("accessToken");
    window.location.href = "/";
  };

  const isSearchPage = pathname === "/search";

  return (
    <nav className="fixed top-0 left-0 right-0 bg-primary border-gray-200 z-50">
      <div className="max-w-screen-xl flex items-center justify-between mx-auto p-5">
        <Link href="/" className="flex items-center space-x-3">
          <span className="text-2xl font-semibold whitespace-nowrap text-secondary">
            LOGO
          </span>
        </Link>
        {!isSearchPage && (
          <div className="flex-1 mx-4 max-w-sm">
            <SearchBar />
          </div>
        )}

        <div className="hidden md:flex md:items-center md:space-x-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-gray-900 hover:text-secondary"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="px-2">
          <LocaleSwitcher />
        </div>
        <div className="flex items-center space-x-3">
          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleUserDropdown}
                type="button"
                className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300"
              >
                <span className="sr-only">Open user menu</span>
                <Image
                  className="w-8 h-8 rounded-full"
                  src={userData.avatar || "/images/default_profile_image.png"}
                  alt="User profile"
                  width={70}
                  height={70}
                  priority
                />
              </button>

              {isUserDropdownOpen && (
                <div className="z-50 absolute right-0 mt-2 w-48 bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg">
                  <div className="px-4 py-3">
                    <span className="block text-sm text-gray-900">
                      {userData.username}
                    </span>
                    <span className="block text-sm text-gray-500 truncate">
                      {userData.email}
                    </span>
                  </div>
                  <ul className="py-2">
                    {USER_DROPDOWN_LINKS.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <button
                        onClick={handleLogout}
                        className="block px-4 py-2 w-full text-left text-sm text-red-600 hover:bg-gray-100"
                      >
                        {t("navigation.signOut")}
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-2 px-2">
              <Link
                href="/auth/login"
                className="px-4 py-2 text-sm font-medium text-white bg-secondary rounded-md"
              >
                {t("navigation.login")}
              </Link>
              <Link
                href="/auth/signup"
                className="px-4 py-2 text-sm font-medium text-white bg-tertiary rounded-md"
              >
                {t("navigation.register")}
              </Link>
            </div>
          )}

          <button
            data-collapse-toggle="navbar-user"
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
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
