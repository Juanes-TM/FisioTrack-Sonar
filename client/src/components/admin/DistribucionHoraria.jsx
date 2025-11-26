import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function DistribucionHoraria({ data }) {
  const labels = data.map((d) => d.hora);
  const counts = data.map((d) => d.count);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Citas",
        data: counts,
        backgroundColor: "rgba(13, 148, 136, 0.8)",
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        ticks: {
          font: { size: 11 },
        },
      },
      y: {
        ticks: {
          stepSize: 2,
          font: { size: 11 },
        },
      },
    },
  };

  return (
    <div className="w-full h-full">
      <Bar data={chartData} options={options} />
    </div>
  );
}
