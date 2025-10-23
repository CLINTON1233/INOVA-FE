"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Download,
  Send,
  AlertTriangle,
  CheckSquare,
  Square,
  FileText,
  User,
  Calendar,
  MapPin,
  Shield,
  Cpu,
  Cable,
  Camera,
  Eye,
  Zap,
  BarChart3,
  Database,
  Brain,
  ScanLine,
  ChevronDown,
  ChevronUp,
  BarChart,
  PieChart,
  TrendingUp,
  Activity,
  Printer,
  FileDown,
} from "lucide-react";
import LayoutDashboard from "../components/LayoutDashboard";

export default function ReportsAnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("daily");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const router = useRouter();

  // Data laporan sesuai dengan proposal
  const reportData = [
    {
      id: "RPT-001",
      scanId: "PC-IT-2025-001",
      jenisAset: "Komputer",
      kategori: "Perangkat",
      lokasi: "Infrastruktur & Jaringan",
      nomorSeri: "NS-PC-887632",
      status: "Valid",
      tanggalScan: "2025-10-28",
      waktuScan: "14:30:15",
      verifiedBy: "Clinton Alfaro",
      department: "IT Infrastructure & Networking",
      validationTime: "2 detik",
      uniqueCode: "V-901-XYZ-A",
      periode: "daily"
    },
    {
      id: "RPT-002",
      scanId: "MAT-KBL-045",
      jenisAset: "Kabel RJ45",
      kategori: "Material",
      lokasi: "Workshop 2",
      barcode: "BC-RJ45-554321",
      status: "Valid",
      tanggalScan: "2025-10-28",
      waktuScan: "14:25:40",
      verifiedBy: "Wahyu Hidayat",
      department: "Facilities & Networking",
      validationTime: "1.5 detik",
      uniqueCode: "V-902-ABC-B",
      periode: "daily"
    },
    {
      id: "RPT-003",
      scanId: "SRV-NET-012",
      jenisAset: "Server",
      kategori: "Perangkat",
      lokasi: "Ruang Server L3",
      nomorSeri: "NS-SRV-992345",
      status: "Error",
      tanggalScan: "2025-10-28",
      waktuScan: "14:18:22",
      verifiedBy: "Ikhsan Kurniawan",
      department: "System Operation",
      validationTime: "3 detik",
      uniqueCode: "V-903-DEF-C",
      periode: "daily"
    },
    {
      id: "RPT-004",
      scanId: "CCTV-SEC-003",
      jenisAset: "CCTV",
      kategori: "Perangkat",
      lokasi: "Pintu Gerbang",
      nomorSeri: "NS-CCTV-661234",
      status: "Valid",
      tanggalScan: "2025-10-27",
      waktuScan: "16:20:15",
      verifiedBy: "Yovan Sakti",
      department: "Facilities & Networking",
      validationTime: "2.2 detik",
      uniqueCode: "V-905-JKL-E",
      periode: "daily"
    },
    {
      id: "RPT-005",
      scanId: "LPT-IT-2025-002",
      jenisAset: "Laptop",
      kategori: "Perangkat",
      lokasi: "Main Office L2",
      nomorSeri: "NS-LPT-445321",
      status: "Pending",
      tanggalScan: "2025-10-27",
      waktuScan: "15:45:30",
      verifiedBy: "Clinton Alfaro",
      department: "IT Infrastructure & Networking",
      validationTime: "2.5 detik",
      uniqueCode: "V-906-MNO-F",
      periode: "daily"
    },
    {
      id: "RPT-006",
      scanId: "MAT-TRK-987",
      jenisAset: "Trunking",
      kategori: "Material",
      lokasi: "Kantor Utama L1",
      barcode: "BC-TRK-773216",
      status: "Valid",
      tanggalScan: "2025-10-26",
      waktuScan: "13:10:05",
      verifiedBy: "Mahmud Amma Rizki",
      department: "Operations & End User Service",
      validationTime: "1.8 detik",
      uniqueCode: "V-904-GHI-D",
      periode: "weekly"
    },
    {
      id: "RPT-007",
      scanId: "MAT-PIP-056",
      jenisAset: "Pipa Jaringan",
      kategori: "Material",
      lokasi: "Workshop 1",
      barcode: "BC-PIP-998765",
      status: "Error",
      tanggalScan: "2025-10-26",
      waktuScan: "12:45:10",
      verifiedBy: "Wahyu Hidayat",
      department: "Facilities & Networking",
      validationTime: "4 detik",
      uniqueCode: "V-907-PQR-G",
      periode: "weekly"
    },
    {
      id: "RPT-008",
      scanId: "SWT-NET-008",
      jenisAset: "Network Switch",
      kategori: "Perangkat",
      lokasi: "Ruang Server L3",
      nomorSeri: "NS-SWT-778899",
      status: "Valid",
      tanggalScan: "2025-10-25",
      waktuScan: "11:20:15",
      verifiedBy: "Ikhsan Kurniawan",
      department: "System Operation",
      validationTime: "1.7 detik",
      uniqueCode: "V-908-STU-H",
      periode: "weekly"
    }
  ];

  // Data statistik
  const stats = {
    total: reportData.length,
    valid: reportData.filter(item => item.status === "Valid").length,
    error: reportData.filter(item => item.status === "Error").length,
    pending: reportData.filter(item => item.status === "Pending").length,
    perangkat: reportData.filter(item => item.kategori === "Perangkat").length,
    material: reportData.filter(item => item.kategori === "Material").length,
    daily: reportData.filter(item => item.periode === "daily").length,
    weekly: reportData.filter(item => item.periode === "weekly").length
  };

  // Analytics data
  const analyticsData = {
    successRate: Math.round((stats.valid / stats.total) * 100),
    avgValidationTime: "2.1s",
    mostActiveUser: "Clinton Alfaro",
    mostScannedLocation: "Infrastruktur & Jaringan",
    dailyAverage: 12,
    weeklyTotal: 45
  };

  // Filter data berdasarkan periode dan kriteria
  const filteredReports = reportData.filter(item => {
    const matchesPeriod = selectedPeriod === "all" || item.periode === selectedPeriod;
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus;
    const matchesCategory = selectedCategory === "all" || item.kategori === selectedCategory;
    
    const matchesStartDate = !startDate || item.tanggalScan >= startDate;
    const matchesEndDate = !endDate || item.tanggalScan <= endDate;

    return matchesPeriod && matchesStatus && matchesCategory && matchesStartDate && matchesEndDate;
  });

  // Toggle select item
  const toggleSelectItem = (id) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  // Select all items
  const toggleSelectAll = () => {
    if (selectedItems.length === filteredReports.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredReports.map(item => item.id));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Valid":
        return "bg-green-100 text-green-700 border-green-200";
      case "Error":
        return "bg-red-100 text-red-700 border-red-200";
      case "Pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Valid":
        return <CheckCircle className="w-4 h-4" />;
      case "Error":
        return <XCircle className="w-4 h-4" />;
      case "Pending":
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getCategoryIcon = (kategori) => {
    switch (kategori) {
      case "Perangkat":
        return <Cpu className="w-4 h-4 text-blue-600" />;
      case "Material":
        return <Cable className="w-4 h-4 text-green-600" />;
      default:
        return <Shield className="w-4 h-4 text-gray-600" />;
    }
  };

  // Export to PDF function
  const exportToPDF = () => {
    const selectedData = selectedItems.length > 0 
      ? reportData.filter(item => selectedItems.includes(item.id))
      : filteredReports;
    
    alert(`Mengekspor ${selectedData.length} data ke PDF...`);
    // Implement PDF export logic here
  };

  // Export to Excel function
  const exportToExcel = () => {
    const selectedData = selectedItems.length > 0 
      ? reportData.filter(item => selectedItems.includes(item.id))
      : filteredReports;
    
    alert(`Mengekspor ${selectedData.length} data ke Excel...`);
    // Implement Excel export logic here
  };

  return (
    <LayoutDashboard activeMenu={5}>
      <div className="max-w-7xl mx-auto px-3 md:px-4 py-2 md:py-2 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-semibold flex items-center">
                <BarChart3 className="w-6 h-6 mr-3" />
               REPORTS & ANALYTICS
              </h1>
              <p className="text-blue-100 text-sm mt-2">
                Laporan lengkap dan analisis data pengecekan aset IT per periode
              </p>
            </div>
            <div className="mt-4 lg:mt-0 flex items-center space-x-4 text-blue-100 text-sm">
              <div className="flex items-center">
                <Database className="w-4 h-4 mr-2" />
                <span>Total Data: {stats.total}</span>
              </div>
              <div className="flex items-center">
                <Activity className="w-4 h-4 mr-2" />
                <span>Real-time Analytics</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-4 text-center border-l-4 border-blue-500">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-500">Total Scan</div>
            <div className="text-xs text-blue-600 font-medium mt-1">
             Semua Periode
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 text-center border-l-4 border-green-500">
            <div className="text-2xl font-bold text-gray-900">{stats.valid}</div>
            <div className="text-sm text-gray-500">Valid</div>
            <div className="text-xs text-green-600 font-medium mt-1">
               Berhasil Divalidasi
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 text-center border-l-4 border-red-500">
            <div className="text-2xl font-bold text-gray-900">{stats.error}</div>
            <div className="text-sm text-gray-500">Error</div>
            <div className="text-xs text-red-600 font-medium mt-1">
               Perlu Tindakan
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 text-center border-l-4 border-yellow-500">
            <div className="text-2xl font-bold text-gray-900">{stats.pending}</div>
            <div className="text-sm text-gray-500">Pending</div>
            <div className="text-xs text-yellow-600 font-medium mt-1">
               Menunggu Verifikasi
            </div>
          </div>
        </div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-semibold text-gray-900">{analyticsData.successRate}%</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Validation Time</p>
                <p className="text-2xl font-semibold text-gray-900">{analyticsData.avgValidationTime}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Most Active User</p>
                <p className="text-lg font-semibold text-gray-900">{analyticsData.mostActiveUser}</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <User className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Most Scanned Location</p>
                <p className="text-lg font-semibold text-gray-900">{analyticsData.mostScannedLocation}</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <MapPin className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Controls Section */}
          <div className="p-4 md:p-6 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Period Selection */}
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedPeriod("daily")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedPeriod === "daily"
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100 border border-gray-300"
                  }`}
                >
                  Harian
                </button>
                <button
                  onClick={() => setSelectedPeriod("weekly")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedPeriod === "weekly"
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100 border border-gray-300"
                  }`}
                >
                  Mingguan
                </button>
                <button
                  onClick={() => setSelectedPeriod("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedPeriod === "all"
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100 border border-gray-300"
                  }`}
                >
                  Semua
                </button>
              </div>

              {/* Date Range */}
              <div className="flex gap-2 flex-1">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Dari Tanggal"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  placeholder="Sampai Tanggal"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-2">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="all">Semua Status</option>
                  <option value="Valid">Valid</option>
                  <option value="Error">Error</option>
                  <option value="Pending">Pending</option>
                </select>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="all">Semua Kategori</option>
                  <option value="Perangkat">Perangkat</option>
                  <option value="Material">Material</option>
                </select>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </button>
              </div>
            </div>

            {/* Additional Filters */}
            {showFilters && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Departemen
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
                      <option value="">Semua Departemen</option>
                      <option value="IT Infrastructure & Networking">IT Infrastructure</option>
                      <option value="Facilities & Networking">Facilities</option>
                      <option value="System Operation">System Operation</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lokasi
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
                      <option value="">Semua Lokasi</option>
                      <option value="Infrastruktur & Jaringan">Infrastruktur & Jaringan</option>
                      <option value="Workshop 2">Workshop 2</option>
                      <option value="Ruang Server L3">Ruang Server L3</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Waktu Validasi
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
                      <option value="">Semua Waktu</option>
                      <option value="fast">Cepat (&lt;2s)</option>
                      <option value="medium">Sedang (2-3s)</option>
                      <option value="slow">Lambat (&gt;3s)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Bulk Actions */}
            {selectedItems.length > 0 && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="text-blue-800 text-sm font-medium flex items-center">
                    <CheckSquare className="w-4 h-4 mr-2" />
                    {selectedItems.length} laporan dipilih
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={exportToPDF}
                      className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm"
                    >
                      <FileDown className="w-4 h-4 mr-2" />
                      Export PDF
                    </button>
                    <button
                      onClick={exportToExcel}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export Excel
                    </button>
                    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
                      <Printer className="w-4 h-4 mr-2" />
                      Print
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Reports Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <button
                      onClick={toggleSelectAll}
                      className="flex items-center text-gray-700 font-medium"
                    >
                      {selectedItems.length === filteredReports.length &&
                      filteredReports.length > 0 ? (
                        <CheckSquare className="w-4 h-4 mr-2 text-blue-600" />
                      ) : (
                        <Square className="w-4 h-4 mr-2 text-gray-400" />
                      )}
                      Pilih
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-gray-700 font-medium">ID Scan</th>
                  <th className="px-4 py-3 text-left text-gray-700 font-medium">Detail Aset</th>
                  <th className="px-4 py-3 text-left text-gray-700 font-medium">Lokasi</th>
                  <th className="px-4 py-3 text-left text-gray-700 font-medium">Status</th>
                  <th className="px-4 py-3 text-left text-gray-700 font-medium">Tanggal & Waktu</th>
                  <th className="px-4 py-3 text-left text-gray-700 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredReports.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleSelectItem(item.id)}
                        className="flex items-center"
                      >
                        {selectedItems.includes(item.id) ? (
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Square className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-blue-700">{item.scanId}</div>
                      <div className="text-xs text-gray-500 mt-1 flex items-center">
                        {getCategoryIcon(item.kategori)}
                        <span className="ml-1">{item.kategori}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-gray-900">{item.jenisAset}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {item.nomorSeri || item.barcode}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        Kode: {item.uniqueCode}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center text-gray-700">
                        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                        {item.lokasi}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {item.department}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {getStatusIcon(item.status)}
                        <span className="ml-1">{item.status}</span>
                      </span>
                      <div className="text-xs text-gray-500 mt-1">
                        {item.validationTime}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">{item.tanggalScan}</div>
                      <div className="text-xs text-gray-500">{item.waktuScan}</div>
                      <div className="text-xs text-gray-400 mt-1">
                        {item.periode === "daily" ? "Harian" : "Mingguan"}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <button className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs">
                          <Eye className="w-3 h-3 mr-1" />
                          Detail
                        </button>
                        <button 
                          onClick={exportToExcel}
                          className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-xs"
                        >
                          <FileDown className="w-3 h-3 mr-1" />
                          Export Excel
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredReports.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Tidak ada data laporan ditemukan</p>
              <p className="text-gray-400 text-sm mt-2">
                Coba sesuaikan periode atau filter pencarian Anda
              </p>
            </div>
          )}

          {/* Summary Footer */}
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600">
              <div>
                Menampilkan {filteredReports.length} dari {stats.total} laporan
              </div>
              <div className="flex gap-4 mt-2 sm:mt-0">
                <span>Perangkat: {stats.perangkat}</span>
                <span>Material: {stats.material}</span>
                <span>Harian: {stats.daily}</span>
                <span>Mingguan: {stats.weekly}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutDashboard>
  );
}