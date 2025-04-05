// components/admin/AdminPageClient.tsx
"use client";

import { useState } from "react";
import { useTranslation } from "next-i18next";

// Import your admin components
import ReportedArticlesComponent from "@/components/admin/ReportedArticles";
import ReportedCommentsComponent from "@/components/admin/ReportedComments";
import ReportedPostsComponent from "@/components/admin/ReportedPosts";
import StatisticsComponent from "@/components/admin/Statistics";
import TagManagementComponent from "@/components/admin/TagManagement";
import TopArticles from "@/components/admin/TopArticles";
import TopPosts from "@/components/admin/TopPosts";
import SideMenu from "@/components/SideMenu";
import UserAccessComponent from "@/components/admin/UserAccess";

// Define the props type for our client component
interface AdminPageClientProps {
  user: {
    role: string;
  };
}

export default function AdminPageClient({ user }: AdminPageClientProps) {
  const { t } = useTranslation("dashboard");

  // Set the initial component:
  // If the user is SUPER_ADMIN, show UserAccess; otherwise, show the Posts view.
  const initialComponent =
    user.role === "SUPER_ADMIN" ? (
      <UserAccessComponent />
    ) : (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4 text-black">Top Posts Page</h1>
        <TopPosts limit={3} sortBy="likesCount" title="Top Liked Posts" />
        <TopPosts limit={3} sortBy="viewCount" title="Most Viewed Posts" />
        <TopPosts limit={3} sortBy="shareCount" title="Most Shared Posts" />
      </div>
    );

  const [selectedComponent, setSelectedComponent] =
    useState<React.ReactNode>(initialComponent);

  // Build the admin menu items.
  // Only include the "User Access" menu if the user is a SUPER_ADMIN.
  const adminItems = [
    ...(user.role === "SUPER_ADMIN"
      ? [
          {
            label: t("dashboard.userAccess"),
            component: <UserAccessComponent />,
            onClick: () => setSelectedComponent(<UserAccessComponent />),
          },
        ]
      : []),
    {
      label: t("dashboard.posts"),
      component: (
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4 text-black">Top Posts Page</h1>
          <TopPosts limit={3} sortBy="likesCount" title="Top Liked Posts" />
          <TopPosts limit={3} sortBy="viewCount" title="Most Viewed Posts" />
          <TopPosts limit={3} sortBy="shareCount" title="Most Shared Posts" />
        </div>
      ),
      onClick: () =>
        setSelectedComponent(
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-4 text-black">
              Top Posts Page
            </h1>
            <TopPosts limit={3} sortBy="likesCount" title="Top Liked Posts" />
            <TopPosts limit={3} sortBy="viewCount" title="Most Viewed Posts" />
            <TopPosts limit={3} sortBy="shareCount" title="Most Shared Posts" />
          </div>
        ),
    },
    {
      label: t("dashboard.articles"),
      component: (
        <div className="p-4 text-black">
          <h1 className="text-2xl font-bold mb-4">Top Articles Page</h1>
          <TopArticles limit={5} sortBy="viewCount" title="Top Articles" />
        </div>
      ),
      onClick: () =>
        setSelectedComponent(
          <div className="p-4 text-black">
            <h1 className="text-2xl font-bold mb-4">Top Articles Page</h1>
            <TopArticles limit={5} sortBy="viewCount" title="Top Articles" />
          </div>
        ),
    },
    {
      label: t("dashboard.reportedPosts"),
      component: <ReportedPostsComponent />,
      onClick: () => setSelectedComponent(<ReportedPostsComponent />),
    },
    {
      label: t("dashboard.reportedArticles"),
      component: <ReportedArticlesComponent />,
      onClick: () => setSelectedComponent(<ReportedArticlesComponent />),
    },
    {
      label: t("dashboard.reportedComments"),
      component: <ReportedCommentsComponent />,
      onClick: () => setSelectedComponent(<ReportedCommentsComponent />),
    },
    {
      label: t("dashboard.statistics"),
      component: <StatisticsComponent />,
      onClick: () => setSelectedComponent(<StatisticsComponent />),
    },
    {
      label: t("dashboard.tagManagement"),
      component: <TagManagementComponent />,
      onClick: () => setSelectedComponent(<TagManagementComponent />),
    },
  ];

  return (
    <div className="flex">
      <SideMenu
        admin
        customItems={adminItems}
        onItemSelect={(item) => item.onClick && item.onClick()}
      />
      <div className="flex-1 p-6 sm:ml-64">
        <div className="container mx-auto max-w-5xl">{selectedComponent}</div>
      </div>
    </div>
  );
}
