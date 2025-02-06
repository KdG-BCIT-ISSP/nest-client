import Link from "next/link";

const SIDE_MENU_LINKS = [
  { href: "/profile", label: "Profile" },
  { href: "/profile/saved-posts", label: "Saved Posts" },
  { href: "/profile/notifications", label: "Notifications" },
  { href: "reset", label: "Reset Password" },
  { href: "home", label: "Log out" },
];

export default function SideMenu() {
  return (
    <aside
      id="default-sidebar"
      className="fixed top-0 left-0 z-60 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
      aria-label="Sidebar"
    >
      <div className="h-full pt-32 px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
        <ul className="space-y-2 font-medium">
          {SIDE_MENU_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <span className="flex-1 ms-3 whitespace-nowrap">
                  {link.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
