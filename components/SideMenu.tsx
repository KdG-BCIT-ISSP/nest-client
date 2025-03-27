"use client";
import { useCookies } from "react-cookie";
import { useTranslation } from "next-i18next";

type MenuItem = {
  label: string;
  component?: React.ReactNode; // The component to render when clicked
  onClick?: () => void; // Optional click handler
};

interface SideMenuProps {
  admin?: boolean;
  customItems?: MenuItem[]; // Allow custom menu items
  onItemSelect?: (item: MenuItem) => void; // Callback for item selection
}

export default function SideMenu({
  admin = false,
  customItems,
  onItemSelect,
}: SideMenuProps) {
  const { t } = useTranslation("dashboard");
  const [, , removeCookie] = useCookies(["refreshToken"]);

  // Default menu items if no custom items are provided
  const defaultItems: MenuItem[] = admin
    ? [
        { label: t("dashboard.userAccess") },
        { label: t("dashboard.posts") },
        { label: t("dashboard.articles") },
        { label: t("dashboard.reportedPosts") },
        { label: t("dashboard.reportedArticles") },
        { label: t("dashboard.reportedComments") },
        { label: t("dashboard.statistics") },
        { label: t("dashboard.tagManagement") },
      ]
    : [
        { label: t("dashboard.profile") },
        { label: t("dashboard.savedPosts") },
        { label: t("dashboard.notifications") },
        { label: t("dashboard.resetPassword") },
      ];

  const menuItems = customItems || defaultItems;

  const handleLogout = async () => {
    try {
      removeCookie("refreshToken", { path: "/" });
      localStorage.removeItem("accessToken");
      window.location.href = "/";
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.onClick) {
      item.onClick();
    }
    if (onItemSelect) {
      onItemSelect(item);
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
          {menuItems.map((item, index) => (
            <li key={index}>
              <button
                onClick={() => handleItemClick(item)}
                className="w-full text-left flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100 group"
              >
                <span className="flex-1 ms-3 whitespace-nowrap">
                  {item.label}
                </span>
              </button>
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
