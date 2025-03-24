import Link from "next/link";
import { useCookies } from "react-cookie";
import { useTranslation } from "react-i18next";

export default function SideMenu({ admin = false }: { admin?: boolean }) {
  const { t } = useTranslation("dashboard");
  const [, , removeCookie] = useCookies(["refreshToken"]);
  const links = admin
    ? [
        { href: "/admin/user-access", label: t("dashboard.userAccess") },
        { href: "/admin/posts", label: t("dashboard.posts") },
        { href: "/admin/articles", label: t("dashboard.articles") },
        { href: "/admin/reported-posts", label: t("dashboard.reportedPosts") },
        {
          href: "/admin/reported-articles",
          label: t("dashboard.reportedArticles"),
        },
        {
          href: "/admin/reported-comments",
          label: t("dashboard.reportedComments"),
        },
        { href: "/admin/statistics", label: t("dashboard.statistics") },
        { href: "/admin/tag-management", label: t("dashboard.tagManagement") },
      ]
    : [
        { href: "/profile", label: t("dashboard.profile") },
        { href: "/profile/saved-posts", label: t("dashboard.savedPosts") },
        { href: "/profile/notifications", label: t("dashboard.notifications") },
        { href: "reset", label: t("dashboard.resetPassword") },
      ];

  const handleLogout = async () => {
    try {
      removeCookie("refreshToken", { path: "/" });
      localStorage.removeItem("accessToken");
      window.location.href = "/";
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <aside
      id="default-sidebar"
      className="fixed top-0 left-0 z-10 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
      aria-label="Sidebar"
    >
      <div className="h-full pt-32 px-3 py-4 overflow-y-auto bg-gray-50">
        <ul className="space-y-2 font-medium">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="flex items-center p-2 text-gray-900 rounded-lg group"
              >
                <span className="flex-1 ms-3 whitespace-nowrap">
                  {link.label}
                </span>
              </Link>
            </li>
          ))}
          <li>
            <button
              onClick={handleLogout}
              className="w-full text-left flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
            >
              <span className="flex-1 ms-3 whitespace-nowrap">
                {t("dashboard.logout")}
              </span>
            </button>
          </li>
        </ul>
      </div>
    </aside>
  );
}
