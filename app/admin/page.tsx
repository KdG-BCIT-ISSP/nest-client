"use client";
export const dynamic = "force-dynamic";

import ReportedArticlesComponent from "@/components/admin/ReportedArticles";
import ReportedCommentsComponent from "@/components/admin/ReportedComments";
import ReportedPostsComponent from "@/components/admin/ReportedPosts";
import StatisticsComponent from "@/components/admin/Statistics";
import TagManagementComponent from "@/components/admin/TagManagement";
import UserAccessComponent from "@/components/admin/UserAccess";
import SideMenu from "@/components/SideMenu";
import TopArticles from "@/components/TopArticles";
import TopPosts from "@/components/TopPosts";
import { useState } from "react";

const UserAccess = () => <UserAccessComponent />;
const Posts = () => (
  <div className="p-4">
    <h1 className="text-2xl font-bold mb-4">Top Posts Page</h1>
    <TopPosts limit={3} sortBy="likesCount" title="Top Liked Posts" />
    <TopPosts limit={3} sortBy="viewCount" title="Most Viewed Posts" />
    <TopPosts limit={3} sortBy="shareCount" title="Most Shared Posts" />
  </div>
);
const Articles = () => (
  <div className="p-4">
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
  const [selectedComponent, setSelectedComponent] = useState<React.ReactNode>(
    <UserAccess />
  );

  const adminItems = [
    {
      label: "User Access",
      component: <UserAccess />,
      onClick: () => setSelectedComponent(<UserAccess />),
    },
    {
      label: "Posts",
      component: <Posts />,
      onClick: () => setSelectedComponent(<Posts />),
    },
    {
      label: "Articles",
      component: <Articles />,
      onClick: () => setSelectedComponent(<Articles />),
    },
    {
      label: "Reported Posts",
      component: <ReportedPosts />,
      onClick: () => setSelectedComponent(<ReportedPosts />),
    },
    {
      label: "Reported Articles",
      component: <ReportedArticles />,
      onClick: () => setSelectedComponent(<ReportedArticles />),
    },
    {
      label: "Reported Comments",
      component: <ReportedComments />,
      onClick: () => setSelectedComponent(<ReportedComments />),
    },
    {
      label: "Statistics",
      component: <Statistics />,
      onClick: () => setSelectedComponent(<Statistics />),
    },
    {
      label: "Tag Management",
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
