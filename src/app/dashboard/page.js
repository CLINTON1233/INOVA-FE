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
  Camera,
  Cpu,
  Cable,
  Server,
  Eye,
  Settings,
  BarChart2,
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
  // Statistik 
  const stats = [
    {
      label: "Total Aset IT",
      value: 245,
      icon: Box,
      color: "bg-blue-600",
      trend: 12,
      change: "up",
      description: "Perangkat & Material IT",
    },
    {
      label: "Terverifikasi Hari Ini",
      value: 18,
      icon: CheckCircle,
      color: "bg-green-600",
      trend: 3,
      change: "up",
      description: "Nomor Seri & Barcode",
    },
    {
      label: "Pengecekan Tertunda",
      value: 15,
      icon: AlertTriangle,
      color: "bg-blue-400",
      trend: 2,
      change: "down",
      description: "Menunggu Validasi",
    },
    {
      label: "Error Nomor Seri/Barcode",
      value: 7,
      icon: Shield,
      color: "bg-red-600",
      trend: 1,
      change: "up",
      description: "Perlu Scan Ulang",
    },
  ];

  // Data Grafik Aktivitas - Sesuai monitoring real-time di proposal
  const chartData = [
    { name: "Sen", Valid: 8, Error: 2, Tertunda: 3 },
    { name: "Sel", Valid: 12, Error: 1, Tertunda: 2 },
    { name: "Rab", Valid: 15, Error: 0, Tertunda: 5 },
    { name: "Kam", Valid: 10, Error: 3, Tertunda: 4 },
    { name: "Jum", Valid: 14, Error: 1, Tertunda: 2 },
  ];

  // Ringkasan Status Aset - Disesuaikan dengan persentase yang diminta
  const assetStatusData = [
    { name: "Valid", value: 185, color: "#2563eb" }, // Biru utama
    { name: "Tertunda", value: 38, color: "#6366f1" }, // Biru ungu
    { name: "Error", value: 22, color: "#dc2626" }, // Merah
  ];

  // Riwayat Pengecekan Terbaru - Disesuaikan dengan jenis aset di proposal
  const recentChecks = [
    {
      id: "PC-IT-2025-001",
      jenisAset: "Komputer",
      kategori: "Perangkat",
      lokasi: "Infrastruktur & Jaringan",
      status: "Valid",
      tanggal: "2025-10-28",
      waktu: "14:30:15",
      nomorSeri: "NS-PC-887632",
    },
    {
      id: "MAT-KBL-045",
      jenisAset: "Kabel RJ45",
      kategori: "Material",
      lokasi: "Workshop 2",
      status: "Valid",
      tanggal: "2025-10-28",
      waktu: "14:25:40",
      barcode: "BC-RJ45-554321",
    },
    {
      id: "SRV-NET-012",
      jenisAset: "Server",
      kategori: "Perangkat",
      lokasi: "Ruang Server L3",
      status: "Valid",
      tanggal: "2025-10-28",
      waktu: "14:18:22",
      nomorSeri: "NS-SRV-992345",
    },
    {
      id: "MAT-TRK-987",
      jenisAset: "Trunking",
      kategori: "Material",
      lokasi: "Kantor Utama L1",
      status: "Tertunda",
      tanggal: "2025-10-28",
      waktu: "14:10:05",
      barcode: "BC-TRK-773216",
    },
    {
      id: "CCTV-SEC-003",
      jenisAset: "CCTV",
      kategori: "Perangkat",
      lokasi: "Pintu Gerbang",
      status: "Error",
      tanggal: "2025-10-28",
      waktu: "14:05:33",
      nomorSeri: "NS-CCTV-661234",
    },
  ].slice(0, 5);

  // Distribusi Jenis Aset - Disesuaikan dengan kategori di proposal
  const assetTypeData = [
    { name: "Periferal (Keyboard, Mouse, Monitor)", jumlah: 75, icon: "🖱️" },
    { name: "Komputer & Laptop", jumlah: 52, icon: "💻" },
    { name: "Perangkat Jaringan (Server, Switch)", jumlah: 48, icon: "🔄" },
    { name: "Material (Kabel, RJ45, Trunking, Pipa)", jumlah: 45, icon: "🔌" },
    { name: "Keamanan (CCTV, Webcam, Speaker)", jumlah: 25, icon: "📹" },
  ].sort((a, b) => b.jumlah - a.jumlah);

  const totalAset = assetTypeData.reduce((sum, item) => sum + item.jumlah, 0);
  const router = useRouter();

  const getStatusColor = (status) => {
    switch (status) {
      case "Valid":
        return "bg-green-100 text-green-700 border-green-200"; // Hijau untuk Valid
      case "Error":
        return "bg-red-100 text-red-700 border-red-200"; // Merah untuk Error
      case "Tertunda":
        return "bg-blue-100 text-blue-700 border-blue-200"; // Biru untuk Tertunda
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getCategoryIcon = (kategori) => {
    switch (kategori) {
      case "Perangkat":
        return <Cpu className="w-4 h-4 text-blue-600" />;
      case "Material":
        return <Cable className="w-4 h-4 text-green-600" />;
      default:
        return <Server className="w-4 h-4 text-gray-600" />;
    }
  };

  // Custom Tooltip untuk pie chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const total = assetStatusData.reduce((sum, item) => sum + item.value, 0);
      const percentage = ((data.value / total) * 100).toFixed(1);

      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{data.name}</p>
          <p className="text-sm text-gray-600">
            {data.value} aset ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <LayoutDashboard>
      <div className="space-y-4 md:space-y-8">
        {/* Header Dashboard */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg p-6 text-white">
          <h1 className="text-2xl md:text-2xl font-semibold mb-2">
            Sistem Inventaris Aset IT
          </h1>
          <p className="text-blue-100 text-xs md:text-base">
            Validasi Otomatis Serial Number atau Barcode Aset IT (Perangkat &
            Material)
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="bg-blue-500 px-3 py-1 rounded-full text-xs font-medium">
              Deteksi Perangkat & Material
            </span>
            <span className="bg-blue-500 px-3 py-1 rounded-full text-xs font-medium">
              Scanning Serial Number
            </span>
            <span className="bg-blue-500 px-3 py-1 rounded-full text-xs font-medium">
              Scanning Barcode
            </span>
            <span className="bg-blue-500 px-3 py-1 rounded-full text-xs font-medium">
              Validasi Otomatis
            </span>
            <span className="bg-blue-500 px-3 py-1 rounded-full text-xs font-medium">
              Report & Analytics
            </span>
          </div>
        </div>

        {/* 1. Statistik Cepat (Kartu) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {stats.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition p-4 flex flex-col justify-between border-l-4"
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
                  <div className="text-xs text-gray-400 mt-1">
                    {item.description}
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
                {item.trend} hari ini
              </div>
            </div>
          ))}
        </div>

        {/* 2. Bagian Aksi Cepat - Sesuai use case di proposal */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Zap className="w-5 h-5 text-blue-600 mr-2" /> Mulai Pengecekan Aset
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => router.push("/scanning")}
              className="flex flex-col items-center justify-center p-3 md:p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition text-gray-700 hover:text-blue-700"
            >
              <Camera
                className="w-7 h-7 mb-1 font-bold text-blue-600"
                strokeWidth={2.5}
              />
              <span className="text-sm font-semibold text-center mt-1">
                Mulai Scan
              </span>
              <span className="text-xs text-gray-600 mt-1">
                Cek Perangkat & Material
              </span>
            </button>

            <button
              onClick={() => router.push("/validation-verification")}
              className="flex flex-col items-center justify-center p-3 md:p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition text-gray-700 hover:text-green-700"
            >
              <CheckCircle
                className="w-7 h-7 mb-1 font-bold text-green-600"
                strokeWidth={2.5}
              />
              <span className="text-sm font-semibold text-center mt-1">
                Status Validasi
              </span>
              <span className="text-xs text-gray-600 mt-1">
                Periksa Hasil Pengecekan Aset
              </span>
            </button>

            <button
              onClick={() => router.push("/reports")}
              className="flex flex-col items-center justify-center p-3 md:p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition text-gray-700 hover:text-purple-700"
            >
              <FileText
                className="w-7 h-7 mb-1 font-bold text-purple-600"
                strokeWidth={2.5}
              />
              <span className="text-sm font-semibold text-center mt-1">
                Laporan Pengecekan
              </span>
              <span className="text-xs text-gray-600 mt-1">
                Lihat data Laporan Pengecekan Aset
              </span>
            </button>

            <button
              onClick={() => router.push("/monitoring")}
              className="flex flex-col items-center justify-center p-3 md:p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition text-gray-700 hover:text-orange-700"
            >
              <BarChart2
                className="w-7 h-7 mb-1 text-orange-600"
                strokeWidth={2.5}
              />
              <span className="text-sm font-semibold text-center mt-1">
                Statistik
              </span>
              <span className="text-xs text-gray-600 mt-1 text-center">
                Lihat Persentase & Statistik Pengecekan Perangkat
              </span>
            </button>
          </div>
        </div>

        {/* 3. Grafik & Ringkasan */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Grafik Pie Status Aset */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-4 md:p-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-4">
              Status Validasi Aset
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
                  <Tooltip content={<CustomTooltip />} />
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

          {/* Grafik Aktivitas Mingguan */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-4 md:p-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-4">
              Aktivitas Pengecekan Harian (5 Hari Terakhir)
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
                  fill="#2563eb" // Biru utama
                  stackId="a"
                  radius={[4, 4, 0, 0]}
                  name="Valid"
                />
                <Bar
                  dataKey="Tertunda"
                  fill="#6366f1" // Biru ungu
                  stackId="a"
                  radius={[4, 4, 0, 0]}
                  name="Tertunda"
                />
                <Bar
                  dataKey="Error"
                  fill="#dc2626" // Merah
                  stackId="a"
                  radius={[4, 4, 0, 0]}
                  name="Error"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Riwayat Terbaru & Distribusi Aset */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Pengecekan Aset Terbaru */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-4">
              Pengecekan Aset Terbaru
            </h2>

            {/* Tampilan Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-gray-500 uppercase text-xs border-b border-gray-200">
                    <th className="py-2 font-medium">ID Aset</th>
                    <th className="py-2 font-medium">Jenis</th>
                    <th className="py-2 font-medium">Kategori</th>
                    <th className="py-2 font-medium">Lokasi</th>
                    <th className="py-2 font-medium">Status</th>
                    <th className="py-2 font-medium">Tanggal</th>
                  </tr>
                </thead>

                <tbody>
                  {recentChecks.map((row, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-100 hover:bg-gray-50 text-gray-800"
                    >
                      <td className="py-3 font-medium">
                        <div className="flex items-center">
                          {getCategoryIcon(row.kategori)}
                          <span className="ml-2">{row.id}</span>
                        </div>
                      </td>
                      <td className="py-3 text-gray-600">{row.jenisAset}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full font-semibold ${
                            row.kategori === "Perangkat"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {row.kategori}
                        </span>
                      </td>
                      <td className="py-3 text-gray-600">{row.lokasi}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full font-semibold border ${getStatusColor(
                            row.status
                          )}`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3 text-gray-600">
                        <div>{row.tanggal}</div>
                        <div className="text-xs text-gray-400">{row.waktu}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tampilan Mobile */}
            <div className="md:hidden space-y-3">
              {recentChecks.map((row, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-3 bg-white hover:bg-gray-50 transition"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      {getCategoryIcon(row.kategori)}
                      <div className="font-bold text-sm text-gray-700 ml-2">
                        {row.id}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded-full font-semibold border ${getStatusColor(
                        row.status
                      )}`}
                    >
                      {row.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span className="font-medium">Jenis:</span>{" "}
                      {row.jenisAset}
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Kategori:</span>
                      <span
                        className={`px-1 rounded text-xs ${
                          row.kategori === "Perangkat"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {row.kategori}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Lokasi:</span> {row.lokasi}
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">ID Unik:</span>
                      {row.nomorSeri || row.barcode}
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>{row.tanggal}</span>
                      <span>{row.waktu}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => router.push("/history")}
              className="mt-4 w-full text-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition"
            >
              Lihat Log Lengkap &rarr;
            </button>
          </div>

          {/* Distribusi Jenis Aset */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-4">
              Distribusi Jenis Aset
            </h2>
            <div className="space-y-3">
              {assetTypeData.map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between text-sm text-gray-700 mb-1">
                    <span className="font-medium flex items-center">
                      <span className="mr-2">{item.icon}</span>
                      {item.name}
                    </span>
                    <span className="font-bold">{item.jumlah}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="h-2.5 rounded-full"
                      style={{
                        width: `${(item.jumlah / totalAset) * 100}%`,
                        backgroundColor:
                          index === 0
                            ? "#22c55e" // Hijau untuk Periferal
                            : index === 1
                            ? "#3b82f6" // Biru untuk Komputer & Laptop
                            : index === 2
                            ? "#f97316" // Orange untuk Perangkat Jaringan
                            : index === 3
                            ? "#dc2626" // Merah untuk Material
                            : "#8b5cf6", // Ungu untuk Keamanan
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-3 bg-gray-100 border-l-4 border-gray-400 rounded-r-lg">
              <p className="text-sm text-gray-700">
                <strong>Total: {totalAset} Aset</strong>
                <br />
                Sistem dapat membaca <strong>Nomor Seri</strong> untuk Perangkat
                dan <strong>Barcode</strong> untuk Material secara otomatis.
              </p>
            </div>
          </div>
        </div>

        {/* 5. Status Sistem */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <h2 className="text-sm md:text-base font-semibold text-gray-800 mb-4">
            Status Sistem INOVA
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-gray-800 shadow-sm">
              <div className="text-sm font-semibold text-green-700">
                Deteksi Aset
              </div>
              <div className="text-[10px] text-gray-600 mt-1">
                Pengenalan Otomatis
              </div>
              <div className="text-xs font-semibold text-green-800 mt-1">
                Aktif
              </div>
            </div>
            <div className="text-center p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-gray-800 shadow-sm">
              <div className="text-sm font-semibold text-green-700">
                Pembaca Teks
              </div>
              <div className="text-[10px] text-gray-600 mt-1">
                Ekstraksi Otomatis
              </div>
              <div className="text-xs font-semibold text-green-800 mt-1">
                Aktif
              </div>
            </div>
            <div className="text-center p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-gray-800 shadow-sm">
              <div className="text-sm font-semibold text-green-700">
                Penyimpanan Data
              </div>
              <div className="text-[10px] text-gray-600 mt-1">Database</div>
              <div className="text-xs font-semibold text-green-800 mt-1">
                Online
              </div>
            </div>
            <div className="text-center p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-gray-800 shadow-sm">
              <div className="text-sm font-semibold text-green-700">
                Kecerdasan Buatan
              </div>
              <div className="text-[10px] text-gray-600 mt-1">Real-time</div>
              <div className="text-xs font-semibold text-green-800 mt-1">
                95% Akurat
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutDashboard>
  );
}
