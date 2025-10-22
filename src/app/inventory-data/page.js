"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  Cpu,
  Cable,
  Server,
  Monitor,
  Keyboard,
  Mouse,
  Camera,
  Wifi,
  Box,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  MapPin,
  Calendar,
  User,
  Shield,
  Zap,
  ChevronDown,
  ChevronUp,
  Smartphone,
} from "lucide-react";
import LayoutDashboard from "../components/LayoutDashboard";

export default function InventoryDataPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedItems, setSelectedItems] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [isMobile, setIsMobile] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const router = useRouter();

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Data inventory sesuai dengan proposal
  const inventoryData = [
    {
      id: "PC-IT-2025-001",
      nama: "Komputer Workstation",
      jenisAset: "Komputer",
      kategori: "Perangkat",
      serialNumber: "NS-PC-887632",
      lokasi: "Infrastruktur & Jaringan",
      departemen: "IT Infrastructure & Networking",
      status: "active",
      tanggalPengecekan: "2025-10-28",
      terakhirDiperbarui: "2025-10-28 14:30:15",
      diperbaruiOleh: "Clinton Alfaro",
      spesifikasi: "Intel i7, 16GB RAM, 512GB SSD",
      kodeUnik: "V-901-XYZ-A",
    },
    {
      id: "MAT-KBL-045",
      nama: "Kabel RJ45 CAT6",
      jenisAset: "Kabel RJ45",
      kategori: "Material",
      barcode: "BC-RJ45-554321",
      lokasi: "Workshop 2",
      departemen: "Facilities & Networking",
      status: "active",
      tanggalPengecekan: "2025-10-28",
      terakhirDiperbarui: "2025-10-28 14:25:40",
      diperbaruiOleh: "Wahyu Hidayat",
      spesifikasi: "CAT6, 5 meter, UTP",
      kodeUnik: "V-902-ABC-B",
    },
    {
      id: "SRV-NET-012",
      nama: "Server Rack",
      jenisAset: "Server",
      kategori: "Perangkat",
      serialNumber: "NS-SRV-992345",
      lokasi: "Ruang Server L3",
      departemen: "System Operation",
      status: "maintenance",
      tanggalPengecekan: "2025-10-28",
      terakhirDiperbarui: "2025-10-28 14:18:22",
      diperbaruiOleh: "Ikhsan Kurniawan",
      spesifikasi: "Dell PowerEdge, 32GB RAM, 1TB SSD",
      kodeUnik: "V-903-DEF-C",
    },
    {
      id: "MAT-TRK-987",
      nama: "Trunking PVC",
      jenisAset: "Trunking",
      kategori: "Material",
      barcode: "BC-TRK-773216",
      lokasi: "Kantor Utama L1",
      departemen: "Operations & End User Service",
      status: "active",
      tanggalPengecekan: "2025-10-28",
      terakhirDiperbarui: "2025-10-28 14:10:05",
      diperbaruiOleh: "Mahmud Amma Rizki",
      spesifikasi: "PVC 50x50mm, 2 meter",
      kodeUnik: "V-904-GHI-D",
    },
    {
      id: "CCTV-SEC-003",
      nama: "Camera CCTV HD",
      jenisAset: "CCTV",
      kategori: "Perangkat",
      serialNumber: "NS-CCTV-661234",
      lokasi: "Pintu Gerbang",
      departemen: "Facilities & Networking",
      status: "active",
      tanggalPengecekan: "2025-10-28",
      terakhirDiperbarui: "2025-10-28 14:05:33",
      diperbaruiOleh: "Yovan Sakti",
      spesifikasi: "1080p, Night Vision, IP Camera",
      kodeUnik: "V-905-JKL-E",
    },
    {
      id: "LPT-IT-2025-002",
      nama: "Laptop Dell",
      jenisAset: "Laptop",
      kategori: "Perangkat",
      serialNumber: "NS-LPT-445321",
      lokasi: "Main Office L2",
      departemen: "IT Infrastructure & Networking",
      status: "inactive",
      tanggalPengecekan: "2025-10-28",
      terakhirDiperbarui: "2025-10-28 13:55:20",
      diperbaruiOleh: "Clinton Alfaro",
      spesifikasi: "Dell Latitude, i5, 8GB RAM",
      kodeUnik: "V-906-MNO-F",
    },
    {
      id: "MAT-PIP-056",
      nama: "Pipa Jaringan",
      jenisAset: "Pipa Jaringan",
      kategori: "Material",
      barcode: "BC-PIP-998765",
      lokasi: "Workshop 1",
      departemen: "Facilities & Networking",
      status: "active",
      tanggalPengecekan: "2025-10-28",
      terakhirDiperbarui: "2025-10-28 13:45:10",
      diperbaruiOleh: "Wahyu Hidayat",
      spesifikasi: "PVC 20mm, 3 meter",
      kodeUnik: "V-907-PQR-G",
    },
    {
      id: "MON-IT-2025-008",
      nama: "Monitor LED 24inch",
      jenisAset: "Monitor",
      kategori: "Perangkat",
      serialNumber: "NS-MON-112233",
      lokasi: "HR Department",
      departemen: "Operations & End User Service",
      status: "active",
      tanggalPengecekan: "2025-10-27",
      terakhirDiperbarui: "2025-10-27 16:20:15",
      diperbaruiOleh: "Mahmud Amma Rizki",
      spesifikasi: "24inch, 1080p, LED",
      kodeUnik: "V-908-STU-H",
    },
  ];

  // Filter data
  const filteredItems = inventoryData.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.lokasi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.serialNumber &&
        item.serialNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.barcode &&
        item.barcode.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === "all" || item.kategori === selectedCategory;
    const matchesStatus =
      selectedStatus === "all" || item.status === selectedStatus;
    const matchesTab = activeTab === "all" || item.status === activeTab;

    return matchesSearch && matchesCategory && matchesStatus && matchesTab;
  });

  // Hitung statistik
  const stats = {
    total: inventoryData.length,
    perangkat: inventoryData.filter((item) => item.kategori === "Perangkat")
      .length,
    material: inventoryData.filter((item) => item.kategori === "Material")
      .length,
    active: inventoryData.filter((item) => item.status === "active").length,
    maintenance: inventoryData.filter((item) => item.status === "maintenance")
      .length,
    inactive: inventoryData.filter((item) => item.status === "inactive").length,
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

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 border-green-200";
      case "maintenance":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "inactive":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4" />;
      case "maintenance":
        return <Clock className="w-4 h-4" />;
      case "inactive":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getCategoryIcon = (kategori, jenisAset) => {
    if (kategori === "Material") {
      return <Cable className="w-4 h-4 text-green-600" />;
    }

    switch (jenisAset) {
      case "Komputer":
        return <Cpu className="w-4 h-4 text-blue-600" />;
      case "Server":
        return <Server className="w-4 h-4 text-purple-600" />;
      case "Laptop":
        return <Monitor className="w-4 h-4 text-indigo-600" />;
      case "CCTV":
        return <Camera className="w-4 h-4 text-orange-600" />;
      case "Monitor":
        return <Monitor className="w-4 h-4 text-cyan-600" />;
      default:
        return <Box className="w-4 h-4 text-gray-600" />;
    }
  };

  const toggleItemExpansion = (id) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  // Mobile Card View
  const MobileItemCard = ({ item }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <button
            onClick={() => toggleSelectItem(item.id)}
            className="mr-3 mt-1"
          >
            {selectedItems.includes(item.id) ? (
              <CheckCircle className="w-5 h-5 text-blue-600" />
            ) : (
              <Box className="w-5 h-5 text-gray-400" />
            )}
          </button>
          <div>
            <div className="font-bold text-blue-700 text-sm">{item.id}</div>
            <div className="text-xs text-gray-500 mt-1 flex items-center">
              {getCategoryIcon(item.kategori, item.jenisAset)}
              <span className="ml-1">{item.kategori}</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => toggleItemExpansion(item.id)}
          className="text-gray-400"
        >
          {expandedItem === item.id ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Basic Info */}
      <div className="mb-3">
        <div className="font-semibold text-gray-900 text-base">{item.nama}</div>
        <div className="text-sm text-gray-600">{item.jenisAset}</div>
        <div className="text-xs text-gray-500 mt-1">{item.spesifikasi}</div>
      </div>

      {/* Status */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
            item.status
          )}`}
        >
          {getStatusIcon(item.status)}
          <span className="ml-1 capitalize">
            {item.status === "active"
              ? "Aktif"
              : item.status === "maintenance"
              ? "Maintenance"
              : "Non-Aktif"}
          </span>
        </span>
        <div className="text-xs text-gray-500 text-right">
          <div>{item.tanggalPengecekan}</div>
        </div>
      </div>

      {/* Expanded Details */}
      {expandedItem === item.id && (
        <div className="border-t border-gray-200 pt-3 mt-3 space-y-3">
          {/* Identifikasi */}
          <div>
            <div className="text-xs font-semibold text-gray-500 mb-1">
              IDENTIFIKASI
            </div>
            <div className="text-sm">
              <span className="font-medium">Kode Unik: </span>
              <span className="text-blue-600 font-mono">{item.kodeUnik}</span>
            </div>
            {item.serialNumber && (
              <div className="text-xs text-gray-600 mt-1">
                Serial: <span className="font-mono">{item.serialNumber}</span>
              </div>
            )}
            {item.barcode && (
              <div className="text-xs text-gray-600 mt-1">
                Barcode: <span className="font-mono">{item.barcode}</span>
              </div>
            )}
          </div>

          {/* Lokasi */}
          <div>
            <div className="text-xs font-semibold text-gray-500 mb-1">
              LOKASI
            </div>
            <div className="flex items-center text-sm text-gray-700">
              <MapPin className="w-4 h-4 mr-1 text-gray-400" />
              {item.lokasi}
            </div>
            <div className="text-xs text-gray-500 mt-1">{item.departemen}</div>
          </div>

          {/* Update Info */}
          <div>
            <div className="text-xs font-semibold text-gray-500 mb-1">
              UPDATE TERAKHIR
            </div>
            <div className="text-xs text-gray-600">
              <div className="flex items-center">
                <User className="w-3 h-3 mr-1" />
                {item.diperbaruiOleh}
              </div>
              <div className="flex items-center mt-1">
                <Calendar className="w-3 h-3 mr-1" />
                {item.terakhirDiperbarui}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs">
              <Eye className="w-3 h-3 mr-1" />
              Detail
            </button>
            <button className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-xs">
              <Edit className="w-3 h-3 mr-1" />
              Edit
            </button>
            <button className="flex-1 flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-xs">
              <Trash2 className="w-3 h-3 mr-1" />
              Hapus
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <LayoutDashboard activeMenu={1}>
      <div className="max-w-7xl mx-auto px-3 md:px-4 py-4 md:py-6 space-y-4 md:space-y-6">
        {/* Header dengan gradient - Mobile Optimized */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg p-4 md:p-6 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center">
              <Box className="w-6 h-6 md:w-7 md:h-7 mr-2 md:mr-3" />
              <div>
                <h1 className="text-xl md:text-2xl font-semibold">
                  Data Inventaris Aset IT
                </h1>
                <p className="text-blue-100 mt-1 text-xs md:text-sm">
                  Data lengkap semua perangkat dan material IT
                </p>
              </div>
            </div>

            <div className="mt-4 lg:mt-0 flex gap-2 md:gap-3">
              <button
                onClick={() => router.push("/scanning")}
                className="flex items-center px-3 py-2 md:px-4 md:py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold text-xs md:text-sm"
              >
                <Plus className="w-4 h-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Tambah Aset Baru</span>
                <span className="sm:hidden">Tambah</span>
              </button>
              <button className="flex items-center px-3 py-2 md:px-4 md:py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold text-xs md:text-sm">
                <Download className="w-4 h-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Export Data</span>
                <span className="sm:hidden">Export</span>
              </button>
            </div>
          </div>

          {/* Status Sistem - Mobile Optimized */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mt-4">
            <div className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Sistem Aktif</span>
            </div>
            <div className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>{stats.total} Data Aset</span>
            </div>
            <div className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Pemindaian Siap</span>
            </div>
            <div className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Semua Fitur Aktif</span>
            </div>
          </div>
        </div>

        {/* Quick Stats - Mobile Optimized */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-4">
          {[
            {
              label: "Total Aset",
              value: stats.total,
              sub: "Semua Kategori",
              color: "text-blue-600",
            },
            {
              label: "Perangkat",
              value: stats.perangkat,
              sub: "Serial Number",
              color: "text-blue-600",
            },
            {
              label: "Material",
              value: stats.material,
              sub: "Barcode",
              color: "text-green-600",
            },
            {
              label: "Aktif",
              value: stats.active,
              sub: "✓ Beroperasi",
              color: "text-green-600",
            },
            {
              label: "Maintenance",
              value: stats.maintenance,
              sub: "⏳ Perbaikan",
              color: "text-yellow-600",
            },
            {
              label: "Non-Aktif",
              value: stats.inactive,
              sub: "✗ Tidak Digunakan",
              color: "text-red-600",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-lg p-3 md:p-4 text-center"
            >
              <div className="text-lg md:text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              <div className="text-xs md:text-sm text-gray-500">
                {stat.label}
              </div>
              <div className={`text-xs ${stat.color} font-medium mt-1`}>
                {stat.sub}
              </div>
            </div>
          ))}
        </div>

     {/* Combined Control Panel and Inventory Table */}
<div className="bg-white rounded-xl shadow-lg overflow-hidden">
  {/* Search, Filter, Tabs, and Bulk Actions Section */}
  <div className="p-4 md:p-6 space-y-4 border-b border-gray-200">
    {/* Search and Filter Row */}
    <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row gap-3 md:gap-4">
      {/* Search Input */}
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Cari ID, nama, serial, barcode, atau lokasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
          />
        </div>
      </div>

      {/* Filters - Mobile Collapsible */}
      <div className="flex flex-col md:flex-row gap-2">
        {!isMobile ? (
          <>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
            >
              <option value="all">Semua Kategori</option>
              <option value="Perangkat">Perangkat</option>
              <option value="Material">Material</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
            >
              <option value="all">Semua Status</option>
              <option value="active">Aktif</option>
              <option value="maintenance">Maintenance</option>
              <option value="inactive">Non-Aktif</option>
            </select>

            <button className="flex items-center px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm">
              <Filter className="w-4 h-4 mr-2" />
              <span className="hidden md:inline">Filter Lainnya</span>
              <span className="md:hidden">Filter</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter
              {showFilters ? (
                <ChevronUp className="w-4 h-4 ml-2" />
              ) : (
                <ChevronDown className="w-4 h-4 ml-2" />
              )}
            </button>

            {showFilters && (
              <div className="flex gap-2 mt-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                >
                  <option value="all">Semua Kategori</option>
                  <option value="Perangkat">Perangkat</option>
                  <option value="Material">Material</option>
                </select>

                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                >
                  <option value="all">Semua Status</option>
                  <option value="active">Aktif</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="inactive">Non-Aktif</option>
                </select>
              </div>
            )}
          </>
        )}
      </div>
    </div>

    {/* Tab Navigation - Integrated */}
    <div className="border-t border-gray-200 pt-4">
      <div className="flex space-x-1 overflow-x-auto">
        {[
          { id: "all", label: "Semua", count: stats.total },
          { id: "active", label: "Aktif", count: stats.active },
          { id: "maintenance", label: "Maintenance", count: stats.maintenance },
          { id: "inactive", label: "Non-Aktif", count: stats.inactive },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 py-2 md:py-3 px-3 md:px-4 rounded-lg text-xs md:text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-blue-600 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <div className="flex items-center space-x-1 md:space-x-2">
              <span>{tab.label}</span>
              <span
                className={`px-1.5 md:px-2 py-0.5 md:py-1 rounded-full text-xs ${
                  activeTab === tab.id
                    ? "bg-blue-500 text-white"
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

    {/* Bulk Actions - Integrated */}
    {selectedItems.length > 0 && (
      <div className="mt-4 p-3 md:p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 md:gap-3">
          <div className="text-blue-800 text-sm font-medium flex items-center">
            <CheckCircle className="w-4 h-4 mr-2" />
            {selectedItems.length} aset dipilih
          </div>
          <div className="flex gap-1 md:gap-2 flex-wrap">
            <button className="flex items-center px-3 py-1.5 md:px-4 md:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-xs">
              <Download className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              Export
            </button>
            <button className="flex items-center px-3 py-1.5 md:px-4 md:py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition text-xs">
              <Edit className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              Edit Massal
            </button>
            <button className="flex items-center px-3 py-1.5 md:px-4 md:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-xs">
              <Trash2 className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
              Hapus
            </button>
          </div>
        </div>
      </div>
    )}
  </div>

  {/* Inventory Table/Cards Section */}
  {!isMobile ? (
    /* Desktop Table View */
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
                  <CheckCircle className="w-4 h-4 mr-2 text-blue-600" />
                ) : (
                  <Box className="w-4 h-4 mr-2 text-gray-400" />
                )}
                ID Aset
              </button>
            </th>
            <th className="px-4 py-3 text-left text-gray-700 font-medium">
              Detail Aset
            </th>
            <th className="px-4 py-3 text-left text-gray-700 font-medium">
              Identifikasi
            </th>
            <th className="px-4 py-3 text-left text-gray-700 font-medium">
              Lokasi & Departemen
            </th>
            <th className="px-4 py-3 text-left text-gray-700 font-medium">
              Status & Update
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
                      <CheckCircle className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Box className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  <div>
                    <div className="font-bold text-blue-700">
                      {item.id}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center">
                      {getCategoryIcon(item.kategori, item.jenisAset)}
                      <span className="ml-1">{item.kategori}</span>
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="font-semibold text-gray-900">
                  {item.nama}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {item.jenisAset}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {item.spesifikasi}
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="space-y-1">
                  <div className="text-sm">
                    <span className="font-medium">Kode Unik: </span>
                    <span className="text-blue-600 font-mono">
                      {item.kodeUnik}
                    </span>
                  </div>
                  {item.serialNumber && (
                    <div className="text-xs text-gray-600">
                      Serial:{" "}
                      <span className="font-mono">
                        {item.serialNumber}
                      </span>
                    </div>
                  )}
                  {item.barcode && (
                    <div className="text-xs text-gray-600">
                      Barcode:{" "}
                      <span className="font-mono">{item.barcode}</span>
                    </div>
                  )}
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="flex items-center text-gray-700">
                  <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                  {item.lokasi}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {item.departemen}
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="space-y-2">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {getStatusIcon(item.status)}
                    <span className="ml-1 capitalize">
                      {item.status === "active"
                        ? "Checked"
                        : item.status === "maintenance"
                        ? "Pending"
                        : "Not Validated"}
                    </span>
                  </span>
                  <div className="text-xs text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {item.tanggalPengecekan}
                    </div>
                    <div className="flex items-center mt-1">
                      <User className="w-3 h-3 mr-1" />
                      {item.diperbaruiOleh}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <div className="flex gap-2">
                  <button className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs">
                    <Eye className="w-3 h-3 mr-1" />
                    Detail
                  </button>
                  <button className="flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-xs">
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </button>
                  <button className="flex items-center px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-xs">
                    <Trash2 className="w-3 h-3 mr-1" />
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    /* Mobile Card View */
    <div className="p-3 md:p-4">
      {filteredItems.map((item) => (
        <MobileItemCard key={item.id} item={item} />
      ))}
    </div>
  )}

  {/* Empty State */}
  {filteredItems.length === 0 && (
    <div className="text-center py-8 md:py-12">
      <Box className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-3 md:mb-4" />
      <p className="text-gray-500 text-base md:text-lg">
        Tidak ada data inventaris ditemukan
      </p>
      <p className="text-gray-400 text-sm mt-1 md:mt-2">
        Coba sesuaikan pencarian atau filter Anda
      </p>
    </div>
  )}
</div>
</div>
    </LayoutDashboard>
  );
}
