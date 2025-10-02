"use client";

import { useState } from "react";
import {
  Box,
  CheckCircle,
  AlertTriangle,
  Shield,
  Zap,
  TrendingUp,
  Filter,
  FileText,
  ChevronDown,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useRouter } from "next/navigation";
import LayoutDashboard from "../components/LayoutDashboard";

export default function DashboardPage() {
  // Quick Statistics
  const stats = [
    {
      label: "Total IT Assets",
      value: 168,
      icon: Box,
      color: "bg-blue-600",
      trend: 5,
      change: "up",
    },
    {
      label: "Verified Today",
      value: 14,
      icon: CheckCircle,
      color: "bg-green-600",
      trend: 2,
      change: "up",
    },
    {
      label: "Pending Checks",
      value: 10,
      icon: AlertTriangle,
      color: "bg-yellow-600",
      trend: 1,
      change: "down",
    },
    {
      label: "Serial Number Errors",
      value: 5,
      icon: Shield,
      color: "bg-red-600",
      trend: 0,
      change: "neutral",
    },
  ];

  // Activity Chart Data
  const chartData = [
    { name: "Mon", Valid: 5, Error: 1 },
    { name: "Tue", Valid: 8, Error: 0 },
    { name: "Wed", Valid: 3, Error: 1 },
    { name: "Thu", Valid: 12, Error: 2 },
    { name: "Fri", Valid: 6, Error: 0 },
  ];

  // Recent Check History (UPDATED with Date)
  const recentChecks = [
    {
      id: "PC-00123",
      assetType: "Komputer",
      location: "IT Infarstructure & Networking",
      status: "Valid",
      date: "2025-09-28",
      time: "10:21:05",
    },
    {
      id: "LPT-045",
      assetType: "Laptop",
      location: "Main Office L2",
      status: "Valid",
      date: "2025-09-28",
      time: "10:18:15",
    },
    {
      id: "CCTV-012",
      assetType: "CCTV",
      location: "Workshop 1",
      status: "Valid",
      date: "2025-09-27",
      time: "10:15:40",
    },
    {
      id: "KBD-987",
      assetType: "Keyboard",
      location: "HR L1",
      status: "Valid",
      date: "2025-09-27",
      time: "10:05:00",
    },
    {
      id: "SW-00342",
      assetType: "Perangkat Jaringan",
      location: "Server Room L3",
      status: "Error",
      date: "2025-09-26",
      time: "09:58:12",
    },
  ].slice(0, 5);

  // Asset Status Summary
  const assetStatusData = [
    { name: "Valid", value: 140, color: "#10B981" },
    { name: "Error", value: 5, color: "#EF4444" },
    { name: "Pending", value: 23, color: "#F59E0B" },
  ];

  // Asset Type Distribution
  const assetTypeData = [
    { name: "Komputer/Laptop", count: 48 },
    { name: "Perangkat Jaringan (Server/Switch)", count: 35 },
    { name: "Periferal (Monitor, Keyboard, Mouse, dll.)", count: 65 },
    { name: "Keamanan (CCTV, Webcam, dll.)", count: 20 },
  ].sort((a, b) => b.count - a.count);
  
  // Total Asset yang Dihitung
  const totalAssets = assetTypeData.reduce((sum, item) => sum + item.count, 0);
  const router = useRouter();

  const getStatusColor = (status) => {
    switch (status) {
      case "Valid":
        return "bg-green-100 text-green-700";
      case "Error":
        return "bg-red-100 text-red-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Cari aset dengan jumlah terbanyak untuk 'Action Needed'
  const maxAsset = assetTypeData[0];

  return (
    <LayoutDashboard>
      <div className="space-y-4 md:space-y-8">
        {/* 1. Quick Statistics (Cards) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {stats.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition p-4 flex flex-col justify-between border-b-4 border-l-2"
              style={{ borderColor: item.color.replace("bg-", "") }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-xl md:text-2xl font-bold text-gray-900">
                    {item.value}
                  </div>
                  <div className="text-xs md:text-sm text-gray-500 font-medium mt-1">
                    {item.label}
                  </div>
                </div>
                <div className={`${item.color} p-2 rounded-lg text-white`}>
                  <item.icon className="w-5 h-5" />
                </div>
              </div>
              <div
                className={`flex items-center mt-3 text-xs font-semibold ${
                  item.change === "up"
                    ? "text-green-600"
                    : item.change === "down"
                    ? "text-red-600"
                    : "text-gray-500"
                }`}
              >
                {item.change === "up" && (
                  <TrendingUp className="w-3 h-3 mr-1" />
                )}
                {item.change === "down" && (
                  <ChevronDown className="w-3 h-3 mr-1 transform rotate-180" />
                )}
                {item.change === "neutral" && <span className="mr-1">-</span>}
                {item.trend} today
              </div>
            </div>
          ))}
        </div>

        {/* 2. Quick Actions Section */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Zap className="w-5 h-5 text-blue-600 mr-2" /> Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => router.push("/scanning")}
              className="flex flex-col items-center justify-center p-3 md:p-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition border border-gray-200 text-gray-700"
            >
              <Shield
                className="w-7 h-7 mb-1 font-bold text-blue-700"
                strokeWidth={2.5}
              />
              <span className="text-sm font-semibold text-center mt-1">
                Start Scan
              </span>
            </button>

            <button className="flex flex-col items-center justify-center p-3 md:p-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition border border-gray-200 text-gray-700">
              <CheckCircle
                className="w-7 h-7 mb-1 font-bold text-green-700"
                strokeWidth={2.5}
              />
              <span className="text-sm font-semibold text-center mt-1">
                Bulk Verify
              </span>
            </button>

            <button className="flex flex-col items-center justify-center p-3 md:p-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition border border-gray-200 text-gray-700">
              <FileText
                className="w-7 h-7 mb-1 font-bold text-purple-700"
                strokeWidth={2.5}
              />
              <span className="text-sm font-semibold text-center mt-1">
                Generate Report
              </span>
            </button>

            <button className="flex flex-col items-center justify-center p-3 md:p-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition border border-gray-200 text-gray-700">
              <Filter
                className="w-7 h-7 mb-1 font-bold text-gray-700"
                strokeWidth={2.5}
              />
              <span className="text-sm font-semibold text-center mt-1">
                Manage Filters
              </span>
            </button>
          </div>
        </div>

        {/* 3. Charts & Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Asset Status Pie Chart */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-4 md:p-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-4">
              Asset Status Summary
            </h2>
            <div className="flex flex-col items-center justify-center h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assetStatusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    fill="#8884d8"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {assetStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs mt-2">
                {assetStatusData.map((item) => (
                  <div key={item.name} className="flex items-center">
                    <span
                      className="block w-2 h-2 rounded-full mr-1"
                      style={{ backgroundColor: item.color }}
                    ></span>
                    {item.name} ({item.value})
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Weekly Activity Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-4 md:p-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-4">
              Daily Check Activity (Last 5 Days)
            </h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E5E7EB"
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip />
                <Bar
                  dataKey="Valid"
                  fill="#3B82F6"
                  stackId="a"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="Error"
                  fill="#EF4444"
                  stackId="a"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 🧭 4. Recent History & Asset Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Recent Asset Checks (UPDATED) */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-4">
              Recent Asset Checks
            </h2>

            {/* 🖥️ Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-gray-500 uppercase text-xs border-b border-gray-200">
                    <th className="py-2 font-medium">Asset ID</th>
                    <th className="py-2 font-medium">Type</th>
                    <th className="py-2 font-medium">Location</th>
                    <th className="py-2 font-medium">Status</th>
                    <th className="py-2 font-medium">Date</th>
                    <th className="py-2 font-medium">Time</th>
                  </tr>
                </thead>

                <tbody>
                  {recentChecks.map((row, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-50 text-gray-800"
                    >
                      <td className="py-3 font-medium">{row.id}</td>
                      <td className="py-3 text-gray-600">{row.assetType}</td>
                      <td className="py-3 text-gray-600">{row.location}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full font-semibold ${getStatusColor(
                            row.status
                          )}`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3 text-gray-600">{row.date}</td>
                      <td className="py-3 text-gray-600">{row.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 📱 Mobile Card View */}
            <div className="md:hidden space-y-3">
              {recentChecks.map((row, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-3 bg-white hover:bg-gray-50 transition"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-bold text-sm text-blue-700">
                      {row.id}
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-semibold ${getStatusColor(
                        row.status
                      )}`}
                    >
                      {row.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span className="font-medium">Type:</span> {row.assetType}
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Location:</span>{" "}
                      {row.location}
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Date:</span> {row.date}
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Time:</span> {row.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-4 w-full text-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition">
              View Full Log &rarr;
            </button>
          </div>

          {/* Asset Type Distribution (DIPERBARUI) */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-4">
              Asset Type Distribution
            </h2>
            <div className="space-y-3">
              {assetTypeData.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm text-gray-700 mb-1">
                    <span className="font-medium">{item.name}</span>
                    <span className="font-bold">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full"
                      style={{
                        // Perhitungan persentase menggunakan totalAssets yang baru
                        width: `${(item.count / totalAssets) * 100}%`,
                        backgroundColor:
                          index === 0
                            ? "#3B82F6"
                            : index === 1
                            ? "#F59E0B"
                            : index === 2
                            ? "#10B981"
                            : "#6B7280",
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
              <p className="text-sm text-blue-800">
                Total: {totalAssets} Assets. <br />
                Action Needed: {maxAsset.count} {maxAsset.name} are the
                majority.
              </p>
            </div>
          </div>
        </div>
      </div>
    </LayoutDashboard>
  );
}