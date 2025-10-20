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
  Menu,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import LayoutDashboard from "../components/LayoutDashboard";

export default function ValidationVerificationPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedItems, setSelectedItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scanData, setScanData] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");
  const [isMobile, setIsMobile] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const router = useRouter();

  // Deteksi ukuran layar
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Ambil data dari localStorage saat komponen mount
  useEffect(() => {
    const savedScanData = localStorage.getItem("lastSubmittedScan");
    if (savedScanData) {
      setScanData(JSON.parse(savedScanData));
    }
  }, []);

  // Data sesuai dengan proposal - Perangkat dan Material IT
  const validationItems = [
    {
      id: 1,
      serialNumber: scanData?.serial || "PC-IT-2025-001",
      assetType: "Komputer",
      kategori: "Perangkat",
      location: scanData?.location || "Infrastruktur & Jaringan",
      department: "IT Infrastructure & Networking",
      lastVerified: "2025-09-20",
      status: "pending",
      uniqueCode: scanData?.uniqueCode || "V-901-XYZ-A",
      scanDate: scanData?.date || "2025-10-28",
      scanTime: scanData?.time || "14:30:15",
      verifiedBy: "Clinton Alfaro",
      buktiFoto: "/api/placeholder/80/60",
      jenisID: "Nomor Seri",
      idValue: scanData?.serial || "NS-PC-887632",
    },
    {
      id: 2,
      serialNumber: "MAT-KBL-045",
      assetType: "Kabel RJ45",
      kategori: "Material",
      location: "Workshop 2",
      department: "Facilities & Networking",
      lastVerified: "2025-09-18",
      status: "valid",
      uniqueCode: "V-902-ABC-B",
      scanDate: "2025-10-28",
      scanTime: "14:25:40",
      verifiedBy: "Wahyu Hidayat",
      buktiFoto: "/api/placeholder/80/60",
      jenisID: "Barcode",
      idValue: "BC-RJ45-554321",
    },
    {
      id: 3,
      serialNumber: "SRV-NET-012",
      assetType: "Server",
      kategori: "Perangkat",
      location: "Ruang Server L3",
      department: "System Operation",
      lastVerified: "2025-09-15",
      status: "error",
      uniqueCode: "V-903-DEF-C",
      scanDate: "2025-10-28",
      scanTime: "14:18:22",
      verifiedBy: "Ikhsan Kurniawan",
      buktiFoto: "/api/placeholder/80/60",
      jenisID: "Nomor Seri",
      idValue: "NS-SRV-992345",
    },
    {
      id: 4,
      serialNumber: "MAT-TRK-987",
      assetType: "Trunking",
      kategori: "Material",
      location: "Kantor Utama L1",
      department: "Operations & End User Service",
      lastVerified: "2025-09-22",
      status: "pending",
      uniqueCode: "V-904-GHI-D",
      scanDate: "2025-10-28",
      scanTime: "14:10:05",
      verifiedBy: "Mahmud Amma Rizki",
      buktiFoto: "/api/placeholder/80/60",
      jenisID: "Barcode",
      idValue: "BC-TRK-773216",
    },
    {
      id: 5,
      serialNumber: "CCTV-SEC-003",
      assetType: "CCTV",
      kategori: "Perangkat",
      location: "Pintu Gerbang",
      department: "Facilities & Networking",
      lastVerified: "2025-09-19",
      status: "valid",
      uniqueCode: "V-905-JKL-E",
      scanDate: "2025-10-28",
      scanTime: "14:05:33",
      verifiedBy: "Yovan Sakti",
      buktiFoto: "/api/placeholder/80/60",
      jenisID: "Nomor Seri",
      idValue: "NS-CCTV-661234",
    },
    {
      id: 6,
      serialNumber: "LPT-IT-2025-002",
      assetType: "Laptop",
      kategori: "Perangkat",
      location: "Main Office L2",
      department: "IT Infrastructure & Networking",
      lastVerified: "2025-09-25",
      status: "pending",
      uniqueCode: "V-906-MNO-F",
      scanDate: "2025-10-28",
      scanTime: "13:55:20",
      verifiedBy: "Clinton Alfaro",
      buktiFoto: "/api/placeholder/80/60",
      jenisID: "Nomor Seri",
      idValue: "NS-LPT-445321",
    },
    {
      id: 7,
      serialNumber: "MAT-PIP-056",
      assetType: "Pipa Jaringan",
      kategori: "Material",
      location: "Workshop 1",
      department: "Facilities & Networking",
      lastVerified: "2025-09-28",
      status: "error",
      uniqueCode: "V-907-PQR-G",
      scanDate: "2025-10-28",
      scanTime: "13:45:10",
      verifiedBy: "Wahyu Hidayat",
      buktiFoto: "/api/placeholder/80/60",
      jenisID: "Barcode",
      idValue: "BC-PIP-998765",
    },
  ];

  // Filter data berdasarkan search, status, dan tab aktif
  const filteredItems = validationItems.filter((item) => {
    const matchesSearch =
      item.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.assetType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.idValue.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === "all" || item.status === selectedStatus;
    const matchesTab = activeTab === "all" || item.status === activeTab;
    return matchesSearch && matchesStatus && matchesTab;
  });

  // Hitung statistik
  const stats = {
    total: validationItems.length,
    valid: validationItems.filter((item) => item.status === "valid").length,
    pending: validationItems.filter((item) => item.status === "pending").length,
    error: validationItems.filter((item) => item.status === "error").length,
  };

  // Toggle select item
  const toggleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  // Select all items
  const toggleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map((item) => item.id));
    }
  };

  // Handle bulk action
  const handleBulkAction = (action) => {
    if (selectedItems.length === 0) return;

    setIsSubmitting(true);

    // Simulasi API call
    setTimeout(() => {
      console.log(`Performing ${action} on items:`, selectedItems);
      alert(`${action} berhasil dilakukan pada ${selectedItems.length} item`);
      setSelectedItems([]);
      setIsSubmitting(false);

      // Redirect ke laporan setelah verifikasi massal
      if (action === "approve") {
        router.push("/reports");
      }
    }, 2000);
  };

  // Handle individual verification
  const handleVerifyItem = (itemId, status) => {
    setIsSubmitting(true);

    // Simulasi API call
    setTimeout(() => {
      console.log(`Verifying item ${itemId} as ${status}`);
      alert(`Item berhasil diverifikasi sebagai ${status}`);
      setIsSubmitting(false);
      setExpandedItem(null); // Tutup expanded item setelah verifikasi
    }, 1500);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "valid":
        return "bg-green-100 text-green-700 border-green-200";
      case "error":
        return "bg-red-100 text-red-700 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "valid":
        return <CheckCircle className="w-4 h-4" />;
      case "error":
        return <XCircle className="w-4 h-4" />;
      case "pending":
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

  const getCategoryColor = (kategori) => {
    switch (kategori) {
      case "Perangkat":
        return "bg-blue-100 text-blue-700";
      case "Material":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Fungsi helper untuk warna tab aktif
  const getActiveTabColor = (color) => {
    switch (color) {
      case "blue":
        return "bg-blue-600 text-white shadow-md";
      case "yellow":
        return "bg-yellow-500 text-white shadow-md";
      case "green":
        return "bg-green-600 text-white shadow-md";
      case "red":
        return "bg-red-600 text-white shadow-md";
      default:
        return "bg-blue-600 text-white shadow-md";
    }
  };

  // Fungsi helper untuk warna badge aktif
  const getActiveBadgeColor = (color) => {
    switch (color) {
      case "blue":
        return "bg-blue-500 text-white";
      case "yellow":
        return "bg-yellow-400 text-white";
      case "green":
        return "bg-green-500 text-white";
      case "red":
        return "bg-red-500 text-white";
      default:
        return "bg-blue-500 text-white";
    }
  };

  // Toggle expand item di mobile
  const toggleExpandItem = (itemId) => {
    setExpandedItem(expandedItem === itemId ? null : itemId);
  };

  return (
    <LayoutDashboard activeMenu={3}>
      <div className="max-w-7xl mx-auto px-3 md:px-4 py-2 md:py-6 space-y-4 md:space-y-6">
        {/* Header dengan gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg p-4 md:p-6 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold flex items-center">
                <CheckCircle className="w-6 h-6 md:w-7 md:h-7 mr-2 md:mr-3" />
                Validasi & Verifikasi Aset IT
              </h1>
              <p className="text-blue-100 mt-2 text-xs md:text-base">
                Sistem validasi otomatis menggunakan teknologi AI untuk
                memastikan keakuratan data serial number dan barcode
              </p>
            </div>

            {scanData && (
              <div className="mt-3 md:mt-0 p-3 md:p-4 bg-blue-500/30 backdrop-blur-sm rounded-lg border border-blue-400">
                <div className="flex items-center text-blue-100 text-xs md:text-sm">
                  <ScanLine className="w-4 h-4 mr-2" />
                  <span className="truncate">
                    Scan Terakhir: <strong>{scanData.serial}</strong> -{" "}
                    {scanData.time}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Status Sistem AI */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mt-3 md:mt-4">
            <div className="flex items-center space-x-1 md:space-x-2 text-xs">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="truncate">Deteksi AI Aktif</span>
            </div>
            <div className="flex items-center space-x-1 md:space-x-2 text-xs">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="truncate">OCR Berjalan</span>
            </div>
            <div className="flex items-center space-x-1 md:space-x-2 text-xs">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="truncate">Database Online</span>
            </div>
            <div className="flex items-center space-x-1 md:space-x-2 text-xs">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="truncate">Validasi Real-time</span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <div className="bg-white rounded-xl shadow-lg p-3 md:p-4 text-center border-l-4 border-green-500">
            <div className="text-xl md:text-2xl font-bold text-gray-900">
              {stats.valid}
            </div>
            <div className="text-xs md:text-sm text-gray-500">Tervalidasi</div>
            <div className="text-xs text-green-600 font-medium mt-1">
              ✓ Data Akurat
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-3 md:p-4 text-center border-l-4 border-yellow-500">
            <div className="text-xl md:text-2xl font-bold text-gray-900">
              {stats.pending}
            </div>
            <div className="text-xs md:text-sm text-gray-500">Menunggu</div>
            <div className="text-xs text-yellow-600 font-medium mt-1">
              ⏳ Perlu Verifikasi
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-3 md:p-4 text-center border-l-4 border-red-500">
            <div className="text-xl md:text-2xl font-bold text-gray-900">
              {stats.error}
            </div>
            <div className="text-xs md:text-sm text-gray-500">Error</div>
            <div className="text-xs text-red-600 font-medium mt-1">
              ⚠ Perlu Tindakan
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-3 md:p-4 text-center border-l-4 border-blue-500">
            <div className="text-xl md:text-2xl font-bold text-gray-900">
              {stats.total}
            </div>
            <div className="text-xs md:text-sm text-gray-500">Total Aset</div>
            <div className="text-xs text-blue-600 font-medium mt-1">
              📊 Semua Kategori
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg p-1 md:p-2">
          <div className="flex space-x-1 overflow-x-auto">
            {[
              { id: "all", label: "Semua", count: stats.total, color: "blue" },
              {
                id: "pending",
                label: "Menunggu",
                count: stats.pending,
                color: "yellow",
              },
              {
                id: "valid",
                label: "Tervalidasi",
                count: stats.valid,
                color: "green",
              },
              { id: "error", label: "Error", count: stats.error, color: "red" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-none py-2 md:py-3 px-2 md:px-4 rounded-lg text-xs md:text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? getActiveTabColor(tab.color)
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center justify-center space-x-1 md:space-x-2">
                  <span className="whitespace-nowrap">{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.5 md:px-2 md:py-1 rounded-full text-xs ${
                      activeTab === tab.id
                        ? getActiveBadgeColor(tab.color)
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-lg p-3 md:p-6">
          <div className="flex flex-col gap-3 md:gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Cari berdasarkan nomor seri, barcode, jenis aset, atau lokasi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                />
              </div>
            </div>

            {/* Filter Section */}
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="flex-1 px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                >
                  <option value="all">Semua Status</option>
                  <option value="pending">Menunggu</option>
                  <option value="valid">Tervalidasi</option>
                  <option value="error">Error</option>
                </select>

                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  <span className="hidden md:inline">Filter Lainnya</span>
                  <span className="md:hidden">Filter</span>
                </button>
              </div>

              {/* Additional Filters (Collapsible) */}
              {showFilters && (
                <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50 rounded-lg">
                  <select className="px-3 py-2 border border-gray-300 rounded text-sm">
                    <option>Semua Kategori</option>
                    <option>Perangkat</option>
                    <option>Material</option>
                  </select>
                  <select className="px-3 py-2 border border-gray-300 rounded text-sm">
                    <option>Semua Lokasi</option>
                    <option>Infrastruktur & Jaringan</option>
                    <option>Workshop 2</option>
                    <option>Ruang Server L3</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedItems.length > 0 && (
            <div className="mt-3 md:mt-4 p-3 md:p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex flex-col gap-3">
                <div className="text-blue-800 text-sm font-medium flex items-center">
                  <CheckSquare className="w-4 h-4 mr-2" />
                  {selectedItems.length} item dipilih untuk verifikasi massal
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => handleBulkAction("approve")}
                    disabled={isSubmitting}
                    className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 text-xs md:text-sm"
                  >
                    <CheckCircle className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                    Setujui
                  </button>
                  <button
                    onClick={() => handleBulkAction("reject")}
                    disabled={isSubmitting}
                    className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 text-xs md:text-sm"
                  >
                    <XCircle className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                    Tolak
                  </button>
                  <button
                    onClick={() => handleBulkAction("export")}
                    disabled={isSubmitting}
                    className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50 text-xs md:text-sm"
                  >
                    <Download className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                    Export
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Validation Items */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {isMobile ? (
            /* Mobile View - Card Layout */
            <div className="divide-y divide-gray-200">
              {filteredItems.map((item) => (
                <div key={item.id} className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                      <button
                        onClick={() => toggleSelectItem(item.id)}
                        className="mr-3"
                      >
                        {selectedItems.includes(item.id) ? (
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Square className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                      <div>
                        <div className="font-medium text-blue-700 text-sm">
                          {item.serialNumber}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center">
                          {getCategoryIcon(item.kategori)}
                          <span className="ml-1">{item.kategori}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleExpandItem(item.id)}
                      className="text-gray-400"
                    >
                      {expandedItem === item.id ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium text-gray-900 text-sm">
                      {item.assetType}
                    </div>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {getStatusIcon(item.status)}
                      <span className="ml-1 capitalize">
                        {item.status === "valid"
                          ? "Tervalidasi"
                          : item.status === "pending"
                          ? "Menunggu"
                          : "Error"}
                      </span>
                    </span>
                  </div>

                  {/* Expanded Content */}
                  {expandedItem === item.id && (
                    <div className="mt-3 space-y-3 border-t pt-3">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <div className="text-gray-500">Lokasi</div>
                          <div className="text-gray-900">{item.location}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Departemen</div>
                          <div className="text-gray-900">{item.department}</div>
                        </div>
                        <div>
                          <div className="text-gray-500">Scan Date</div>
                          <div className="text-gray-900">
                            {item.scanDate} {item.scanTime}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">Diverifikasi Oleh</div>
                          <div className="text-gray-900">{item.verifiedBy}</div>
                        </div>
                      </div>

                      <div className="text-xs">
                        <div className="text-gray-500">ID Value</div>
                        <div className="text-gray-900 font-mono">
                          {item.idValue}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-2">
                        {item.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleVerifyItem(item.id, "valid")}
                              disabled={isSubmitting}
                              className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 text-xs"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Setujui
                            </button>
                            <button
                              onClick={() => handleVerifyItem(item.id, "error")}
                              disabled={isSubmitting}
                              className="flex-1 flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 text-xs"
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Tolak
                            </button>
                          </>
                        )}
                        <button className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs">
                          <Eye className="w-3 h-3 mr-1" />
                          Detail
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* Desktop View - Table Layout */
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <button
                        onClick={toggleSelectAll}
                        className="flex items-center text-gray-700 font-medium"
                      >
                        {selectedItems.length === filteredItems.length &&
                        filteredItems.length > 0 ? (
                          <CheckSquare className="w-4 h-4 mr-2 text-blue-600" />
                        ) : (
                          <Square className="w-4 h-4 mr-2 text-gray-400" />
                        )}
                        ID Aset
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-gray-700 font-medium">
                      Jenis & Kategori
                    </th>
                    <th className="px-4 py-3 text-left text-gray-700 font-medium">
                      Lokasi & Departemen
                    </th>
                    <th className="px-4 py-3 text-left text-gray-700 font-medium">
                      Detail Pemindaian
                    </th>
                    <th className="px-4 py-3 text-left text-gray-700 font-medium">
                      Status Validasi
                    </th>
                    <th className="px-4 py-3 text-left text-gray-700 font-medium">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredItems.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <button
                            onClick={() => toggleSelectItem(item.id)}
                            className="mr-3"
                          >
                            {selectedItems.includes(item.id) ? (
                              <CheckSquare className="w-4 h-4 text-blue-600" />
                            ) : (
                              <Square className="w-4 h-4 text-gray-400" />
                            )}
                          </button>
                          <div>
                            <div className="font-medium text-blue-700">
                              {item.serialNumber}
                            </div>
                            <div className="text-xs text-gray-500 mt-1 flex items-center">
                              {getCategoryIcon(item.kategori)}
                              <span className="ml-1">{item.kategori}</span>
                            </div>
                            <div className="text-xs text-gray-400 font-mono mt-1">
                              {item.jenisID}: {item.idValue}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-gray-900">
                          {item.assetType}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          <span
                            className={`px-2 py-1 rounded-full ${getCategoryColor(
                              item.kategori
                            )}`}
                          >
                            {item.kategori}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center text-gray-700">
                          <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                          {item.location}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {item.department}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-xs text-gray-600 space-y-1">
                          <div className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {item.scanDate} - {item.scanTime}
                          </div>
                          <div className="flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            {item.verifiedBy}
                          </div>
                          <div className="flex items-center text-blue-600">
                            <Camera className="w-3 h-3 mr-1" />
                            <span className="text-xs">Lihat Bukti Foto</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            item.status
                          )}`}
                        >
                          {getStatusIcon(item.status)}
                          <span className="ml-1 capitalize">
                            {item.status === "valid"
                              ? "Tervalidasi"
                              : item.status === "pending"
                              ? "Menunggu"
                              : "Error"}
                          </span>
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          {item.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleVerifyItem(item.id, "valid")}
                                disabled={isSubmitting}
                                className="flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 text-xs"
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Setujui
                              </button>
                              <button
                                onClick={() => handleVerifyItem(item.id, "error")}
                                disabled={isSubmitting}
                                className="flex items-center px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 text-xs"
                              >
                                <XCircle className="w-3 h-3 mr-1" />
                                Tolak
                              </button>
                            </>
                          )}
                          <button className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs">
                            <Eye className="w-3 h-3 mr-1" />
                            Detail
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Empty State */}
          {filteredItems.length === 0 && (
            <div className="text-center py-8 md:py-12">
              <AlertTriangle className="w-8 h-8 md:w-12 md:h-12 text-gray-400 mx-auto mb-3 md:mb-4" />
              <p className="text-gray-500 text-base md:text-lg">
                Tidak ada data validasi ditemukan
              </p>
              <p className="text-gray-400 text-xs md:text-sm mt-1 md:mt-2">
                Coba sesuaikan pencarian atau kriteria filter Anda
              </p>
            </div>
          )}
        </div>

        {/* Quick Actions Footer */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 flex items-center">
            <Zap className="w-4 h-4 md:w-5 md:h-5 mr-2 text-blue-600" />
            Aksi Cepat
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <button
              onClick={() => router.push("/scanning")}
              className="flex flex-col items-center justify-center p-3 md:p-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-gray-800 hover:text-blue-700 shadow-sm"
            >
              <Camera className="w-5 h-5 md:w-6 md:h-6 mb-1 md:mb-2 text-blue-600" />
              <span className="text-xs md:text-sm font-semibold text-center">
                Mulai Pemindaian Baru
              </span>
              <span className="text-xs text-gray-600 mt-1 hidden md:block">
                Tambah Data Aset Baru
              </span>
            </button>

            <button
              onClick={() => router.push("/reports")}
              className="flex flex-col items-center justify-center p-3 md:p-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-gray-800 hover:text-green-700 shadow-sm"
            >
              <BarChart3 className="w-5 h-5 md:w-6 md:h-6 mb-1 md:mb-2 text-green-600" />
              <span className="text-xs md:text-sm font-semibold text-center">
                Laporan
              </span>
              <span className="text-xs text-gray-600 mt-1 hidden md:block">
                Export Excel
              </span>
            </button>

            <button
              onClick={() => router.push("/monitoring")}
              className="flex flex-col items-center justify-center p-3 md:p-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-gray-800 hover:text-purple-700 shadow-sm"
            >
              <Eye className="w-5 h-5 md:w-6 md:h-6 mb-1 md:mb-2 text-purple-600" />
              <span className="text-xs md:text-sm font-semibold text-center">
                Monitoring
              </span>
              <span className="text-xs text-gray-600 mt-1 hidden md:block">
                Real-time
              </span>
            </button>

            <button
              onClick={() => handleBulkAction("export")}
              className="flex flex-col items-center justify-center p-3 md:p-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition text-gray-800 hover:text-orange-700 shadow-sm"
            >
              <Download className="w-5 h-5 md:w-6 md:h-6 mb-1 md:mb-2 text-orange-600" />
              <span className="text-xs md:text-sm font-semibold text-center">
                Export Data
              </span>
              <span className="text-xs text-gray-600 mt-1 hidden md:block">
                Format Excel
              </span>
            </button>
          </div>
        </div>
      </div>
    </LayoutDashboard>
  );
}