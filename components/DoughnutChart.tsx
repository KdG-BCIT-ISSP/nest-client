"use client";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

type DoughnutChartProps = {
  labels: string[];
  data: number[];
  title?: string;
  colours?: string[];
};

export default function DoughnutChart({
  labels,
  data,
  title,
  colours,
}: DoughnutChartProps) {
  const chartData = {
    labels,
    datasets: [
      {
        label: title || "Dataset",
        data,
        backgroundColor: colours || [
          "#f87171",
          "#60a5fa",
          "#34d399",
          "#fbbf24",
          "#c084fc",
          "#f472b6",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="w-full max-w-sm mx-auto">
      <Doughnut data={chartData} />
    </div>
  );
}
