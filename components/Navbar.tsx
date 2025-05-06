"use client";
export const dynamic = "force-dynamic";

import {
  Bell,
  Bookmark,
  FileText,
  Home,
  Key,
  LogOut,
  Menu,
  Shield,
  User,
  Users,
} from "lucide-react";
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
import { buildProfileLinks, ProfileLink } from "@/app/lib/profileLinks";

export default function Navbar() {
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation("common");
  const [userData] = useAtom(userAtom);
  const [announcementState, setAnnouncementState] = useAtom(announcementAtom);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const router = useRouter();
  const isAuthenticated =
    typeof window !== "undefined" && !!localStorage.getItem("accessToken");

  const [, , removeCookie] = useCookies(["refreshToken"]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isUserDropdownOpen) return;
    const onClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [isUserDropdownOpen]);

  if (!mounted) return null;

  const NAV_LINKS = [
    { href: "/", label: t("navigation.home") },
    { href: "/curated-articles", label: t("navigation.articles") },
    { href: "/posts", label: t("navigation.community") },
  ];

  const PROFILE_LINKS: ProfileLink[] = buildProfileLinks(t);

  const USER_DROPDOWN_LINKS: ProfileLink[] = [
    ...(userData.role === "ADMIN" || userData.role === "SUPER_ADMIN"
      ? [{ href: "/admin", label: t("navigation.admin"), section: "" }]
      : []),
    ...PROFILE_LINKS,
  ];

  const isSearchPage = pathname === "/search";

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

  const handleLogout = () => {
    removeCookie("refreshToken", { path: "/" });
    localStorage.removeItem("accessToken");
    window.location.href = "/";
  };

  return (
    <>
      {/* LEFT NAV DRAWER */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-mobileNav shadow-lg
           transform ${isNavDrawerOpen ? "translate-x-0" : "-translate-x-full"}
           transition-transform duration-300 ease-in-out z-40`}
      >
        <div className="p-4 space-y-6">
          <button onClick={() => setIsNavDrawerOpen(false)} className="pb-8">
            ✕ Close
          </button>
          <LocaleSwitcher />
          {!isSearchPage && <SearchBar />}
          <ul className="mt-6 space-y-4 text-tertiary font-bold">
            <li
              onClick={() => {
                router.push("/");
                setIsNavDrawerOpen(false);
              }}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <Home size={20} /> <span>{t("navigation.home")}</span>
            </li>
            <li
              onClick={() => {
                router.push("/curated-articles");
                setIsNavDrawerOpen(false);
              }}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <FileText size={20} /> <span>{t("navigation.articles")}</span>
            </li>
            <li
              onClick={() => {
                router.push("/posts");
                setIsNavDrawerOpen(false);
              }}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <Users size={20} /> <span>{t("navigation.community")}</span>
            </li>
          </ul>
        </div>
      </aside>

      {/* RIGHT PROFILE DRAWER */}
      <aside
        ref={dropdownRef}
        className={`fixed inset-y-0 right-0 w-64 bg-white shadow-lg
           transform ${isProfileDrawerOpen ? "translate-x-0" : "translate-x-full"}
           transition-transform duration-300 ease-in-out z-40`}
      >
        <div className="p-4">
          <button
            onClick={() => setIsProfileDrawerOpen(false)}
            className="mb-4"
          >
            ✕ Close
          </button>
          <div className="flex flex-col items-center mb-6 pt-10">
            <Image
              src={userData.avatar || "/images/default_profile_image.png"}
              alt="avatar"
              width={80}
              height={80}
              className="rounded-full"
            />
            <h3 className="mt-2 font-semibold">{userData.username}</h3>
            <p className="text-sm text-gray-500 truncate">{userData.email}</p>
          </div>
          <ul className="space-y-4 font-semibold">
            {(userData.role === "ADMIN" || userData.role === "SUPER_ADMIN") && (
              <li
                onClick={() => {
                  handleLinkClick("/admin");
                  setIsProfileDrawerOpen(false);
                }}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <Shield size={20} /> <span>{t("navigation.admin")}</span>
              </li>
            )}
            <li
              onClick={() => {
                handleLinkClick("/profile");
                setIsProfileDrawerOpen(false);
              }}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <User size={20} /> <span>{t("navigation.profile")}</span>
            </li>
            <li
              onClick={() => {
                handleLinkClick("/profile", "saved-posts");
                setIsProfileDrawerOpen(false);
              }}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <Bookmark size={20} /> <span>{t("navigation.savedPosts")}</span>
            </li>
            <li
              onClick={() => {
                handleLinkClick("/profile", "my-posts");
                setIsProfileDrawerOpen(false);
              }}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <FileText size={20} /> <span>{t("navigation.myPosts")}</span>
            </li>
            <li
              onClick={() => {
                handleLinkClick("/profile", "notifications");
                setIsProfileDrawerOpen(false);
              }}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <Bell size={20} /> <span>{t("navigation.notifications")}</span>
            </li>
            <li
              onClick={() => {
                handleLinkClick("/profile", "reset-password");
                setIsProfileDrawerOpen(false);
              }}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <Key size={20} /> <span>{t("navigation.resetPassword")}</span>
            </li>
            <hr />
            <li
              onClick={() => {
                handleLogout();
                setIsProfileDrawerOpen(false);
              }}
              className="flex items-center space-x-2 text-red-600 cursor-pointer"
            >
              <LogOut size={20} /> <span>{t("navigation.signOut")}</span>
            </li>
          </ul>
        </div>
      </aside>

      {/* ───────── MOBILE TOGGLE BUTTONS ───────── */}
      <nav className="block md:hidden fixed top-0 left-0 right-0 bg-primary border-b z-50">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => {
              setIsProfileDrawerOpen(false);
              setIsNavDrawerOpen((o) => !o);
            }}
            className="p-2"
          >
            <Menu />
          </button>

          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo.svg" alt="Logo" width={25} height={25} />
            <span className="text-xl font-semibold text-secondary">NEST</span>
          </Link>

          {isAuthenticated ? (
            <button
              onClick={() => {
                setIsNavDrawerOpen(false);
                setIsProfileDrawerOpen((o) => !o);
              }}
              className="w-8 h-8 rounded-full overflow-hidden"
            >
              <Image
                src={userData.avatar || "/images/default_profile_image.png"}
                alt="avatar"
                width={70}
                height={70}
                className="w-8 h-8 rounded-full"
              />
            </button>
          ) : (
            <Link
              href="/auth/login"
              className="px-3 py-1 bg-secondary text-white rounded-md text-sm"
            >
              {t("navigation.login")}
            </Link>
          )}
        </div>
      </nav>

      {/* ───────── DESKTOP ───────── */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 bg-primary border-b z-50">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between p-5">
          <Link href="/" className="flex items-center space-x-3">
            <Image src="/logo.svg" alt="Logo" width={25} height={25} />
            <span className="text-xl font-semibold text-secondary">NEST</span>
          </Link>

          {!isSearchPage && (
            <div className="flex-1 mx-4 max-w-sm">
              <SearchBar />
            </div>
          )}

          <div className="hidden md:flex space-x-8">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-secondary">
                {l.label}
              </Link>
            ))}
          </div>

          <LocaleSwitcher />

          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsUserDropdownOpen((o) => !o)}
                  className="rounded-full focus:ring-4 focus:ring-gray-300"
                >
                  <Image
                    src={userData.avatar || "/images/default_profile_image.png"}
                    alt="avatar"
                    width={70}
                    height={70}
                    className="w-8 h-8 rounded-full"
                  />
                  {announcementState.newAnnouncement && (
                    <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
                  )}
                </button>

                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border divide-y rounded-md shadow-lg z-50">
                    <div className="px-4 py-3">
                      <div className="text-sm text-gray-900">
                        {userData.username}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {userData.email}
                      </div>
                    </div>
                    <ul>
                      {USER_DROPDOWN_LINKS.map((item) => (
                        <li key={item.section || item.href}>
                          <button
                            onClick={() =>
                              handleLinkClick(item.href, item.section)
                            }
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          >
                            {item.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                    <div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        {t("navigation.signOut")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 bg-secondary text-white rounded-md"
                >
                  {t("navigation.login")}
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 bg-tertiary text-white rounded-md"
                >
                  {t("navigation.register")}
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}
