"use client";
export const dynamic = "force-dynamic";

import { Menu } from "lucide-react";
import SearchBar from "./search/SearchBar";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { useCookies } from "react-cookie";
import { useAtom } from "jotai";
import { userAtom } from "@/atoms/user/atom";
import { useTranslation } from "next-i18next";
import LocaleSwitcher from "./LocaleSwitcher";
import { announcementAtom } from "@/atoms/announcement/atom";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation("common");
  const [userData] = useAtom(userAtom);
  const [announcementState, setAnnouncementState] = useAtom(announcementAtom);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
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
      ? [{ href: "/admin", label: t("navigation.admin") }]
      : []),
    { href: "/profile", label: t("navigation.profile"), section: "profile" },
    {
      href: "/profile",
      label: t("navigation.savedPosts"),
      section: "saved-posts",
    },
    {
      href: "/profile",
      label: t("navigation.notifications"),
      section: "notifications",
    },
  ];

  const handleLinkClick = (href: string, section?: string) => {
    if (section) {
      router.push(`/profile?section=${section}`);
      if (section === "notifications") {
        setAnnouncementState((prev) => ({ ...prev, newAnnouncement: false }));
      }
    } else {
      router.push(href);
    }
    setIsUserDropdownOpen(false);
  };

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
    <>
      {/* ───────────── MOBILE VIEW ───────────── */}
      <nav className="block md:hidden fixed top-0 left-0 right-0 bg-primary border-b border-gray-200 z-50">
        <div className="flex items-center justify-between p-4">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="p-2"
          >
            <Menu />
          </button>

          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.svg" alt="Logo" width={25} height={25} />
            <span className="text-xl font-semibold text-secondary">NEST</span>
          </Link>

          {isAuthenticated ? (
            <div className="relative mt-2">
              <button
                onClick={toggleUserDropdown}
                className="w-8 h-8 rounded-full overflow-hidden"
              >
                <Image
                  className="w-8 h-8 rounded-full"
                  src={userData.avatar || "/images/default_profile_image.png"}
                  alt="User profile"
                  width={70}
                  height={70}
                  priority
                />
                {announcementState.newAnnouncement && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
                )}
              </button>
              {isUserDropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-lg z-50"
                >
                  <div className="px-3 py-2 text-sm text-gray-800">
                    {userData.username}
                  </div>
                  <ul>
                    {USER_DROPDOWN_LINKS.map((item) => (
                      <li key={item.href + (item.section || "")}>
                        <button
                          onClick={() => {
                            handleLinkClick(item.href, item.section);
                            setMobileMenuOpen(false);
                          }}
                          className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {item.label}
                        </button>
                      </li>
                    ))}
                    <li>
                      <button
                        onClick={() => {
                          handleLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        {t("navigation.signOut")}
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="px-3 py-1 bg-secondary text-white rounded-md text-sm"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t("navigation.login")}
            </Link>
          )}
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b">
            {!isSearchPage && (
              <div className="px-4 py-2 border-b">
                <SearchBar />
              </div>
            )}

            <div className="px-4 pt-2 pb-3 space-y-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {isAuthenticated ? (
              <div className="px-4 pt-2 pb-3 border-t space-y-1">
                {USER_DROPDOWN_LINKS.map((item) => (
                  <button
                    key={item.href + (item.section || "")}
                    onClick={() => {
                      handleLinkClick(item.href, item.section);
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-base text-gray-700 hover:bg-gray-100"
                  >
                    {item.label}
                  </button>
                ))}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-base text-red-600 hover:bg-gray-100"
                >
                  {t("navigation.signOut")}
                </button>
              </div>
            ) : (
              <div className="px-4 pt-2 pb-3 border-t">
                <Link
                  href="/auth/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-secondary hover:bg-gray-100"
                >
                  {t("navigation.register")}
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* ───────────── WEB VIEW ───────────── */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 bg-primary border-gray-200 z-50">
        <div className="max-w-screen-xl flex items-center justify-between mx-auto p-5">
          <Link href="/" className="flex items-center space-x-3">
            <Image src="/logo.svg" alt="Logo" width={25} height={25} />
            <span className="text-xl font-semibold whitespace-nowrap text-secondary">
              NEST
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
                  {announcementState.newAnnouncement && (
                    <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
                  )}
                </button>
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg">
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
                        <li key={link.href + (link.section || "")}>
                          <button
                            onClick={() =>
                              handleLinkClick(link.href, link.section)
                            }
                            className="block px-4 py-2 w-full text-left text-sm text-gray-700 hover:bg-lightGray"
                          >
                            {link.label}
                          </button>
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
              <Menu />
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
