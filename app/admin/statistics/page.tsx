"use client";

import { useEffect, useState } from "react";
import DoughnutChart from "@/components/DoughnutChart";
import BarGraph from "@/components/BarGraph";
import SideMenu from "@/components/SideMenu";
import { get } from "@/app/lib/fetchInterceptor";

export default function StatisticsPage() {
  const [loading, setLoading] = useState(true);
  const [userRoles, setUserRoles] = useState<{ [key: string]: number }>({});
  const [regionCount, setRegionCount] = useState<{ [key: string]: number }>({});
  const [postCount, setPostCount] = useState(0);
  const [articleCount, setArticleCount] = useState(0);
  const [posts, setPosts] = useState([]);
  const [articles, setArticles] = useState([]);

  const [totalPostViews, setTotalPostViews] = useState(0);
  const [totalArticleViews, setTotalArticleViews] = useState(0);
  const [postShares, setPostShares] = useState(0);
  const [articleShares, setArticleShares] = useState(0);
  const [postLikes, setPostLikes] = useState(0);
  const [articleLikes, setArticleLikes] = useState(0);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [users, posts, articles] = await Promise.all([
          get("/api/member/all"),
          get("/api/posts"),
          get("/api/article"),
        ]);

        // Count user roles
        const roleCount: { [key: string]: number } = {};
        const regionCount: { [key: string]: number } = {};

        users.forEach((user: { role: string; region?: string }) => {
          roleCount[user.role] = (roleCount[user.role] || 0) + 1;
          if (user.region) {
            regionCount[user.region] = (regionCount[user.region] || 0) + 1;
          }
        });

        setUserRoles(roleCount);
        setRegionCount(regionCount);
        setPostCount(posts.length);
        setArticleCount(articles.length);
        setPosts(posts);
        setArticles(articles);

        const getTotal = (
          arr: { [key: string]: number }[],
          key: string
        ): number => arr.reduce((sum, item) => sum + Number(item[key] || 0), 0);

        setTotalPostViews(getTotal(posts, "viewCount"));
        setTotalArticleViews(getTotal(articles, "viewCount"));
        setPostShares(getTotal(posts, "shareCount"));
        setArticleShares(getTotal(articles, "shareCount"));
        setPostLikes(getTotal(posts, "likesCount"));
        setArticleLikes(getTotal(articles, "likesCount"));
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 mb-10">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold mb-2">Post Stats</h2>
            <p>
              Total Post Views: <strong>{totalPostViews}</strong>
            </p>
            <p>
              Total Post Shares: <strong>{postShares}</strong>
            </p>
            <p>
              Total Post Likes: <strong>{postLikes}</strong>
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold mb-2">Article Stats</h2>
            <p>
              Total Article Views: <strong>{totalArticleViews}</strong>
            </p>
            <p>
              Total Article Shares: <strong>{articleShares}</strong>
            </p>
            <p>
              Total Article Likes: <strong>{articleLikes}</strong>
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <DoughnutChart
            title="Users by Role"
            labels={Object.keys(userRoles)}
            data={Object.values(userRoles)}
            colours={[
              "#f87171", // hex red
              "rgb(96, 165, 250)", // rgb blue
              "green", // named color
              "#fbbf24", // hex yellow
              "purple", // named
              "rgb(244, 114, 182)", // rgb pink
            ]}
          />
          <DoughnutChart
            title="Content Distribution"
            labels={["Posts", "Articles"]}
            data={[postCount, articleCount]}
          />
          <DoughnutChart
            title="Users by Region"
            labels={Object.keys(regionCount)}
            data={Object.values(regionCount)}
            colours={[
              "#f87171", // red
              "#60a5fa", // blue
              "#34d399", // green
              "#fbbf24", // yellow
              "#a78bfa", // purple
              "#f472b6", // pink
              "#fb923c", // orange
              "#818cf8", // indigo
              "#4ade80", // lime
              "#38bdf8", // sky
              "#c084fc", // violet
            ]}
          />
        </div>
        <div className="space-y-10">
          <BarGraph
            title="Posts (Last 6 Months)"
            data={posts}
            months={6}
            colour="rgb(96, 165, 250)"
          />
          <BarGraph
            title="Articles (Last 3 Months)"
            data={articles}
            months={3}
            colour="red"
          />
        </div>
      </div>
    </div>
  );
}
