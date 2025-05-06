import { TFunction } from "next-i18next";

export interface ProfileLink {
  href: string;
  label: string;
  section: string;
}

export const buildProfileLinks = (t: TFunction): ProfileLink[] => [
  { href: "/profile", label: t("navigation.profile"), section: "profile" },
  {
    href: "/profile",
    label: t("navigation.notifications"),
    section: "notifications",
  },
  {
    href: "/profile",
    label: t("navigation.savedPosts"),
    section: "saved-posts",
  },
  { href: "/profile", label: t("navigation.myPosts"), section: "my-posts" },
  {
    href: "/profile",
    label: t("navigation.resetPassword"),
    section: "reset-password",
  },
];
