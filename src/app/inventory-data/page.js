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
  Camera,
  Box,
  CheckCircle,
  Trash,
  MapPin,
  ScanLine,
  Calendar,
  User,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import LayoutDashboard from "../components/LayoutDashboard";
import Swal from "sweetalert2";

export default function InventoryDataPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedItems, setSelectedItems] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

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
      tanggalPengecekan: "2025-10-28",
      terakhirDiperbarui: "2025-10-28 14:05:33",
      diperbaruiOleh: "Yovan Sakti",
      spesifikasi: "1080p, Night Vision, IP Camera",
      kodeUnik: "V-905-JKL-E",
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

    return matchesSearch && matchesCategory;
  });

  // Hitung statistik
  const stats = {
    total: inventoryData.length,
    perangkat: inventoryData.filter((item) => item.kategori === "Perangkat")
      .length,
    material: inventoryData.filter((item) => item.kategori === "Material")
      .length,
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

  // Fungsi untuk menampilkan detail dengan SweetAlert
  const handleShowDetail = (item) => {
    Swal.fire({
      title: `<div class="font-poppins text-lg font-semibold text-black">Detail Aset IT</div>`,
      html: `
      <div class="font-poppins text-left space-y-3 max-h-[50vh] overflow-y-auto pr-2">
        <!-- Header Info -->
        <div>
          <h4 class="text-base font-semibold text-gray-900">${item.nama}</h4>
          <p class="text-xs text-gray-500 mt-1">${item.jenisAset} • ${
        item.kategori
      }</p>
        </div>

        <!-- Informasi Dasar -->
        <div>
          <h5 class="text-xs font-medium text-gray-700 mb-2">INFORMASI</h5>
          <div class="bg-gray-50 rounded-lg p-3 space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-xs text-gray-600">ID Aset</span>
              <span class="text-xs font-medium text-blue-700">${item.id}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs text-gray-600">Kode Unik</span>
              <span class="text-xs font-mono text-blue-600">${
                item.kodeUnik
              }</span>
            </div>
          </div>
        </div>

        <!-- Identifikasi -->
        <div>
          <h5 class="text-xs font-medium text-gray-700 mb-2">IDENTIFIKASI</h5>
          <div class="bg-gray-50 rounded-lg p-3 space-y-2">
            ${
              item.serialNumber
                ? `
            <div class="flex justify-between items-center">
              <span class="text-xs text-gray-600">Serial Number</span>
              <span class="text-xs font-mono text-gray-700">${item.serialNumber}</span>
            </div>
            `
                : ""
            }
            ${
              item.barcode
                ? `
            <div class="flex justify-between items-center">
              <span class="text-xs text-gray-600">Barcode</span>
              <span class="text-xs font-mono text-gray-700">${item.barcode}</span>
            </div>
            `
                : ""
            }
          </div>
        </div>

        <!-- Spesifikasi -->
        <div>
          <h5 class="text-xs font-medium text-gray-700 mb-2">SPESIFIKASI</h5>
          <div class="bg-gray-50 rounded-lg p-3">
            <p class="text-xs text-gray-700">${item.spesifikasi}</p>
          </div>
        </div>

        <!-- Lokasi -->
        <div>
          <h5 class="text-xs font-medium text-gray-700 mb-2">LOKASI</h5>
          <div class="bg-gray-50 rounded-lg p-3 space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-xs text-gray-600">Lokasi</span>
              <span class="text-xs font-medium text-gray-700">${
                item.lokasi
              }</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs text-gray-600">Departemen</span>
              <span class="text-xs font-medium text-gray-700">${
                item.departemen
              }</span>
            </div>
          </div>
        </div>

        <!-- Update Terakhir -->
        <div>
          <h5 class="text-xs font-medium text-gray-700 mb-2">UPDATE TERAKHIR</h5>
          <div class="bg-gray-50 rounded-lg p-3 space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-xs text-gray-600">Tanggal Pengecekan</span>
              <span class="text-xs font-medium text-gray-700">${
                item.tanggalPengecekan
              }</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs text-gray-600">Dicek Oleh</span>
              <span class="text-xs font-medium text-gray-700">${
                item.diperbaruiOleh
              }</span>
            </div>
          </div>
        </div>
      </div>
    `,
      width: "500px",
      padding: "16px",
      showCloseButton: true,
      showConfirmButton: true,
      confirmButtonText: "Tutup",
      confirmButtonColor: "#2563eb",
      customClass: {
        popup: "rounded-xl font-poppins",
        closeButton: "text-gray-400 hover:text-gray-600 text-lg -mt-1 -mr-1",
        confirmButton: "font-poppins font-medium text-sm px-10 py-2",
      },
    });
  };
  // Fungsi untuk menutup modal detail
  const handleCloseDetail = () => {
    setShowDetailModal(false);
    setSelectedItem(null);
  };

  // Fungsi untuk menghapus item dengan konfirmasi
  const handleDeleteItem = (item) => {
    Swal.fire({
      title: "Hapus Aset?",
      text: `Anda yakin ingin menghapus ${item.nama} (${item.id})?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#28a745",

      cancelButtonColor: "#d65130ff",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        // Logika hapus data disini
        // Contoh: hapus dari state atau API call

        Swal.fire({
          title: "Berhasil!",
          text: `Aset ${item.nama} berhasil dihapus`,
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        });
      }
    });
  };

  const getCategoryIcon = (kategori, jenisAset) => {
    if (kategori === "Material") {
      return <Cable className="w-4 h-4 text-green-600" />;
    }

    // Untuk semua Perangkat (Komputer, Server, CCTV, dll) gunakan warna biru
    return <Cpu className="w-4 h-4 text-blue-600" />;
  };

  const toggleItemExpansion = (id) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  // Mobile Card View
  const MobileItemCard = ({ item }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-3 hover:shadow-md transition-shadow">
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
          className="text-gray-400 hover:text-gray-600"
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

      {/* Location & Date */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center text-xs text-gray-500">
          <MapPin className="w-3 h-3 mr-1" />
          {item.lokasi}
        </div>
        <div className="text-xs text-gray-500">{item.tanggalPengecekan}</div>
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

          {/* Departemen */}
          <div>
            <div className="text-xs font-semibold text-gray-500 mb-1">
              DEPARTEMEN
            </div>
            <div className="text-xs text-gray-600">{item.departemen}</div>
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
            <button
              onClick={() => handleShowDetail(item)}
              className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs"
            >
              <Eye className="w-3 h-3 mr-1" />
              Detail
            </button>
            <button
              onClick={() => handleDeleteItem(item)}
              className="flex-1 flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-xs"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Hapus Data
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <LayoutDashboard activeMenu={1}>
      <div className="max-w-7xl mx-auto px-3 md:px-4 py-4 md:py-2 space-y-4 md:space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-600 rounded-xl shadow-lg p-4 md:p-6 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center">
              <Box className="w-6 h-6 md:w-7 md:h-7 mr-2 md:mr-3" />
              <div>
                <h1 className="text-xl md:text-2xl font-semibold">
                  INVENTARIS ASET IT
                </h1>
                <p className="text-blue-100 mt-1 text-xs md:text-sm">
                  Daftar lengkap semua perangkat dan material IT perusahaan
                </p>
              </div>
            </div>

            <div className="mt-4 lg:mt-0 flex gap-2 md:gap-3">
              <button
                onClick={() => router.push("/scanning")}
                className="flex items-center px-3 py-2 md:px-4 md:py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold text-xs md:text-sm"
              >
                <ScanLine className="w-4 h-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Pindai Aset Baru</span>
                <span className="sm:hidden">Pindai Aset Baru</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats - Refined Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Kartu Perangkat IT */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-base md:text-lg font-semibold text-gray-800">
                  Perangkat IT
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mt-1">
                  {stats.perangkat}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Total perangkat terdaftar: Komputer, Server, CCTV, dan lainnya
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Cpu className="w-7 h-7 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Kartu Material IT */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-base md:text-lg font-semibold text-gray-800">
                  Material IT
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mt-1">
                  {stats.material}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Total material terdaftar: Kabel, trunking, pipa jaringan, dan
                  pendukung
                </div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Cable className="w-7 h-7 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Search and Filter Section */}
          <div className="p-4 md:p-6 border-b border-gray-200">
            <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row gap-3 md:gap-4">
              {/* Search Input */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Cari berdasarkan ID, nama aset, lokasi, atau nomor identifikasi..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                  />
                </div>
              </div>

              {/* Filters */}
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
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Table/Cards Section */}
          {!isMobile ? (
            /* Desktop Table View */
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-gray-700 font-medium">
                      ID Aset
                    </th>
                    <th className="px-4 py-3 text-left text-gray-700 font-medium">
                      Detail Aset
                    </th>
                    <th className="px-4 py-3 text-left text-gray-700 font-medium">
                      Identifikasi
                    </th>
                    <th className="px-4 py-3 text-left text-gray-700 font-medium">
                      Lokasi
                    </th>
                    <th className="px-4 py-3 text-left text-gray-700 font-medium">
                      Update Terakhir
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
                            <span className="text-blue-600 font-mono">
                              {item.kodeUnik}
                            </span>
                          </div>
                          {item.serialNumber && (
                            <div className="text-xs text-gray-600">
                              <span className="font-mono">
                                {item.serialNumber}
                              </span>
                            </div>
                          )}
                          {item.barcode && (
                            <div className="text-xs text-gray-600">
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
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleShowDetail(item)}
                            className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Detail
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item)}
                            className="flex items-center px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-xs"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Hapus Data
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
