"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { useMemo } from "react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title);

type BarGraphProps = {
  title?: string;
  data: { createdAt: string }[];
  months?: number; // How many past months to show
};

export default function BarGraph({
  title = "Monthly Stats",
  data,
  months = 6,
}: BarGraphProps) {
  // Memoize the grouped data to avoid recalculating unless data or months change
  const grouped = useMemo(() => {
    const now = new Date();
    const labels: string[] = [];

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      labels.push(
        date.toLocaleString("default", { month: "short", year: "2-digit" })
      );
    }

    const count: Record<string, number> = {}; // Initialize an object to hold counts for each month label
    labels.forEach((label) => (count[label] = 0));

    data.forEach(({ createdAt }) => {
      const date = new Date(createdAt);
      const label = date.toLocaleString("default", {
        month: "short",
        year: "2-digit",
      });
      if (count[label] !== undefined) count[label]++;
    });

    return {
      labels,
      values: labels.map((label) => count[label]),
    };
  }, [data, months]);

  const chartData = {
    labels: grouped.labels,
    datasets: [
      {
        label: title,
        data: grouped.values,
        backgroundColor: "#06b6d4",
      },
    ],
  };

  const options = {
    responsive: true,
    scales: { y: { beginAtZero: true } },
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md w-full">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <Bar data={chartData} options={options} />
    </div>
  );
}
