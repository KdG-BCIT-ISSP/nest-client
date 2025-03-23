"use client";

import { useEffect, useState } from "react";
import { getAllUsers } from "@/app/api/member/get/route";
import { getPost } from "@/app/api/post/get/route";
import { getArticle } from "@/app/api/article/get/route";
import DoughnutChart from "@/components/DoughnutChart";
import BarGraph from "@/components/BarGraph";
import SideMenu from "@/components/SideMenu";

export default function StatisticsPage() {
  const [loading, setLoading] = useState(true);
  const [userRoles, setUserRoles] = useState<{ [key: string]: number }>({});
  const [postCount, setPostCount] = useState(0);
  const [articleCount, setArticleCount] = useState(0);
  const [posts, setPosts] = useState([]);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [users, posts, articles] = await Promise.all([
          getAllUsers(),
          getPost(),
          getArticle(),
        ]);

        // Count user roles
        const roleCount: { [key: string]: number } = {};
        users.forEach((user: { role: string | number }) => {
          roleCount[user.role] = (roleCount[user.role] || 0) + 1;
        });

        setUserRoles(roleCount);
        setPostCount(posts.length);
        setArticleCount(articles.length);
        setPosts(posts);
        setArticles(articles);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex">
      <SideMenu admin />
      <div className="p-4 sm:ml-64 w-full">
        <h1 className="text-2xl font-bold mb-6">Statistics Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DoughnutChart
            title="Users by Role"
            labels={Object.keys(userRoles)}
            data={Object.values(userRoles)}
          />
          <DoughnutChart
            title="Content Distribution"
            labels={["Posts", "Articles"]}
            data={[postCount, articleCount]}
          />
        </div>
        <BarGraph title="Posts (Last 6 Months)" data={posts} months={6} />
        <BarGraph title="Articles (Last 3 Months)" data={articles} months={3} />
      </div>
    </div>
  );
}
