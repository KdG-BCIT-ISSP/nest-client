"use client";
export const dynamic = "force-dynamic";

import ReportedArticlesComponent from "@/components/admin/ReportedArticles";
import ReportedCommentsComponent from "@/components/admin/ReportedComments";
import ReportedPostsComponent from "@/components/admin/ReportedPosts";
import StatisticsComponent from "@/components/admin/Statistics";
import TagManagementComponent from "@/components/admin/TagManagement";
import UserAccessComponent from "@/components/admin/UserAccess";
import SideMenu from "@/components/SideMenu";
import TopArticles from "@/components/admin/TopArticles";
import TopPosts from "@/components/admin/TopPosts";
import { useState } from "react";
import { useTranslation } from "next-i18next";

const UserAccess = () => <UserAccessComponent />;
const Posts = () => (
  <div className="p-4">
    <h1 className="text-2xl font-bold mb-4 text-black">Top Posts Page</h1>
    <TopPosts limit={3} sortBy="likesCount" title="Top Liked Posts" />
    <TopPosts limit={3} sortBy="viewCount" title="Most Viewed Posts" />
    <TopPosts limit={3} sortBy="shareCount" title="Most Shared Posts" />
  </div>
);
const Articles = () => (
  <div className="p-4 text-black">
    <h1 className="text-2xl font-bold mb-4">Top Articles Page</h1>
    <TopArticles limit={5} sortBy="viewCount" title="Top Articles" />
  </div>
);
const ReportedPosts = () => <ReportedPostsComponent />;
const ReportedArticles = () => <ReportedArticlesComponent />;
const ReportedComments = () => <ReportedCommentsComponent />;
const Statistics = () => <StatisticsComponent />;
const TagManagement = () => <TagManagementComponent />;

export default function AdminPage() {
  const { t } = useTranslation("dashboard");
  const [selectedComponent, setSelectedComponent] = useState<React.ReactNode>(
    <UserAccess />
  );

  const adminItems = [
    {
      label: t("dashboard.userAccess"),
      component: <UserAccess />,
      onClick: () => setSelectedComponent(<UserAccess />),
    },
    {
      label: t("dashboard.posts"),
      component: <Posts />,
      onClick: () => setSelectedComponent(<Posts />),
    },
    {
      label: t("dashboard.articles"),
      component: <Articles />,
      onClick: () => setSelectedComponent(<Articles />),
    },
    {
      label: t("dashboard.reportedPosts"),
      component: <ReportedPosts />,
      onClick: () => setSelectedComponent(<ReportedPosts />),
    },
    {
      label: t("dashboard.reportedArticles"),
      component: <ReportedArticles />,
      onClick: () => setSelectedComponent(<ReportedArticles />),
    },
    {
      label: t("dashboard.reportedComments"),
      component: <ReportedComments />,
      onClick: () => setSelectedComponent(<ReportedComments />),
    },
    {
      label: t("dashboard.statistics"),
      component: <Statistics />,
      onClick: () => setSelectedComponent(<Statistics />),
    },
    {
      label: t("dashboard.tagManagement"),
      component: <TagManagement />,
      onClick: () => setSelectedComponent(<TagManagement />),
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
