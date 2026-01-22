"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  Scan,
  Clipboard,
  Search,
  CheckCircle,
  AlertTriangle,
  Send,
  AlertCircle,
  Calendar,
  Cpu,
  Cable,
  Server,
  Box,
  MapPin,
  X,
  Trash2,
  Filter,
  Download,
  Eye,
  FileText,
  User,
  Clock,
  BarChart3,
  PieChart,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Database,
  Shield,
  CheckSquare,
  XCircle,
  Zap,
  Activity,
  History as HistoryIcon,
} from "lucide-react";
import LayoutDashboard from "../components/LayoutDashboard";
import ProtectedPage from "../components/ProtectedPage";
import Swal from "sweetalert2";

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const router = useRouter();

  // History data according to proposal
  const historyData = [
    {
      id: "HIS-001",
      scanId: "PC-IT-2025-001",
      assetType: "Computer",
      category: "Perangkat",
      location: "Infrastructure & Networking",
      serialNumber: "NS-PC-887632",
      barcode: null,
      status: "Valid",
      statusColor: "green",
      date: "2025-10-28",
      time: "14:30:15",
      verifiedBy: "Clinton Alfaro",
      department: "IT Infrastructure & Networking",
      scanMethod: "Camera",
      validationTime: "2 seconds",
      uniqueCode: "V-901-XYZ-A",
      notes: "Serial number valid, device condition good",
      activityType: "scan_validation",
    },
    {
      id: "HIS-002",
      scanId: "MAT-KBL-045",
      assetType: "RJ45 Cable",
      category: "Material",
      location: "Workshop 2",
      serialNumber: null,
      barcode: "BC-RJ45-554321",
      status: "Valid",
      statusColor: "green",
      date: "2025-10-28",
      time: "14:25:40",
      verifiedBy: "Wahyu Hidayat",
      department: "Facilities & Networking",
      scanMethod: "Camera",
      validationTime: "1.5 seconds",
      uniqueCode: "V-902-ABC-B",
      notes: "Barcode read clearly",
      activityType: "scan_validation",
    },
    {
      id: "HIS-003",
      scanId: "SRV-NET-012",
      assetType: "Server",
      category: "Perangkat",
      location: "Server Room L3",
      serialNumber: "NS-SRV-992345",
      barcode: null,
      status: "Error",
      statusColor: "red",
      date: "2025-10-28",
      time: "14:18:22",
      verifiedBy: "Ikhsan Kurniawan",
      department: "System Operation",
      scanMethod: "Manual Input",
      validationTime: "3 seconds",
      uniqueCode: "V-903-DEF-C",
      notes: "Serial number format does not match standard",
      activityType: "validation_error",
    },
    {
      id: "HIS-004",
      scanId: "MAT-TRK-987",
      assetType: "Trunking",
      category: "Material",
      location: "Main Office L1",
      serialNumber: null,
      barcode: "BC-TRK-773216",
      status: "Valid",
      statusColor: "green",
      date: "2025-10-28",
      time: "14:10:05",
      verifiedBy: "Mahmud Amma Rizki",
      department: "Operations & End User Service",
      scanMethod: "Camera",
      validationTime: "1.8 seconds",
      uniqueCode: "V-904-GHI-D",
      notes: "Material in new condition",
      activityType: "scan_validation",
    },
    {
      id: "HIS-005",
      scanId: "CCTV-SEC-003",
      assetType: "CCTV",
      category: "Perangkat",
      location: "Main Gate",
      serialNumber: "NS-CCTV-661234",
      barcode: null,
      status: "Valid",
      statusColor: "green",
      date: "2025-10-28",
      time: "14:05:33",
      verifiedBy: "Yovan Sakti",
      department: "Facilities & Networking",
      scanMethod: "Camera",
      validationTime: "2.2 seconds",
      uniqueCode: "V-905-JKL-E",
      notes: "Device functioning normally",
      activityType: "scan_validation",
    },
    {
      id: "HIS-006",
      scanId: "LPT-IT-2025-002",
      assetType: "Laptop",
      category: "Perangkat",
      location: "Main Office L2",
      serialNumber: "NS-LPT-445321",
      barcode: null,
      status: "Pending",
      statusColor: "yellow",
      date: "2025-10-28",
      time: "13:55:20",
      verifiedBy: "Clinton Alfaro",
      department: "IT Infrastructure & Networking",
      scanMethod: "Manual Input",
      validationTime: "2.5 seconds",
      uniqueCode: "V-906-MNO-F",
      notes: "Waiting for supervisor confirmation",
      activityType: "pending_validation",
    },
    {
      id: "HIS-007",
      scanId: "MAT-PIP-056",
      assetType: "Network Pipe",
      category: "Material",
      location: "Workshop 1",
      serialNumber: null,
      barcode: "BC-PIP-998765",
      status: "Error",
      statusColor: "red",
      date: "2025-10-28",
      time: "13:45:10",
      verifiedBy: "Wahyu Hidayat",
      department: "Facilities & Networking",
      scanMethod: "Camera",
      validationTime: "4 seconds",
      uniqueCode: "V-907-PQR-G",
      notes: "Barcode damaged, requires manual input",
      activityType: "validation_error",
    },
    {
      id: "HIS-008",
      scanId: "SWT-NET-008",
      assetType: "Network Switch",
      category: "Perangkat",
      location: "Server Room L3",
      serialNumber: "NS-SWT-778899",
      barcode: null,
      status: "Valid",
      statusColor: "green",
      date: "2025-10-27",
      time: "16:20:15",
      verifiedBy: "Ikhsan Kurniawan",
      department: "System Operation",
      scanMethod: "Camera",
      validationTime: "1.7 seconds",
      uniqueCode: "V-908-STU-H",
      notes: "Switch functioning optimally",
      activityType: "scan_validation",
    },
  ];

  // Statistics data
  const stats = {
    total: historyData.length,
    valid: historyData.filter((item) => item.status === "Valid").length,
    error: historyData.filter((item) => item.status === "Error").length,
    pending: historyData.filter((item) => item.status === "Pending").length,
    perangkat: historyData.filter((item) => item.category === "Perangkat")
      .length,
    material: historyData.filter((item) => item.category === "Material").length,
  };

  // Activity log data
  const activityLog = [
    {
      id: "ACT-001",
      action: "scan_success",
      description: "Successfully scanned Computer device",
      user: "Clinton Alfaro",
      timestamp: "2025-10-28 14:30:15",
      icon: "scan",
      color: "blue",
    },
    {
      id: "ACT-002",
      action: "validation_success",
      description: "Validation successful for RJ45 Cable",
      user: "Wahyu Hidayat",
      timestamp: "2025-10-28 14:25:40",
      icon: "check",
      color: "green",
    },
    {
      id: "ACT-003",
      action: "validation_error",
      description: "Serial number format validation error for Server",
      user: "Ikhsan Kurniawan",
      timestamp: "2025-10-28 14:18:22",
      icon: "alert",
      color: "red",
    },
    {
      id: "ACT-004",
      action: "manual_input",
      description: "Manual input for Trunking data",
      user: "Mahmud Amma Rizki",
      timestamp: "2025-10-28 14:10:05",
      icon: "clipboard",
      color: "orange",
    },
    {
      id: "ACT-005",
      action: "scan_success",
      description: "CCTV scanning successful",
      user: "Yovan Sakti",
      timestamp: "2025-10-28 14:05:33",
      icon: "scan",
      color: "blue",
    },
    {
      id: "ACT-006",
      action: "pending_validation",
      description: "Laptop validation waiting for approval",
      user: "Clinton Alfaro",
      timestamp: "2025-10-28 13:55:20",
      icon: "clock",
      color: "yellow",
    },
  ];

  // Function to show history details with SweetAlert
  const handleShowDetail = (item) => {
    Swal.fire({
      title: `<div class="font-poppins text-lg font-semibold text-black">Inspection History Details</div>`,
      html: `
      <div class="font-poppins text-left space-y-3 max-h-[50vh] overflow-y-auto pr-2">
        <!-- Header Info -->
        <div class="bg-white rounded-lg p-3 border border-gray-200">
          <h4 class="text-base font-semibold text-gray-900">${item.assetType}</h4>
          <p class="text-xs text-gray-500 mt-1">${item.category} • ${item.scanMethod}</p>
        </div>

        <!-- Asset Information -->
        <div>
          <h5 class="text-xs font-medium text-gray-700 mb-2">ASSET INFORMATION</h5>
          <div class="bg-white rounded-lg p-3 space-y-2 border border-gray-200">
            <div class="flex justify-between items-center">
              <span class="text-xs text-gray-600">Scan ID</span>
              <span class="text-xs font-medium text-blue-700">${item.scanId}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs text-gray-600">History ID</span>
              <span class="text-xs font-medium text-gray-700">${item.id}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs text-gray-600">${item.serialNumber ? 'Serial Number' : 'Barcode'}</span>
              <span class="text-xs font-mono text-blue-600">${item.serialNumber || item.barcode}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs text-gray-600">Unique Code</span>
              <span class="text-xs font-mono text-gray-700">${item.uniqueCode}</span>
            </div>
          </div>
        </div>

        <!-- Location & Department -->
        <div>
          <h5 class="text-xs font-medium text-gray-700 mb-2">LOCATION & DEPARTMENT</h5>
          <div class="bg-white rounded-lg p-3 space-y-2 border border-gray-200">
            <div class="flex justify-between items-center">
              <span class="text-xs text-gray-600">Location</span>
              <span class="text-xs font-medium text-gray-700">${item.location}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs text-gray-600">Department</span>
              <span class="text-xs font-medium text-gray-700">${item.department}</span>
            </div>
          </div>
        </div>

        <!-- Inspection Time -->
        <div>
          <h5 class="text-xs font-medium text-gray-700 mb-2">INSPECTION TIME</h5>
          <div class="bg-white rounded-lg p-3 space-y-2 border border-gray-200">
            <div class="flex justify-between items-center">
              <span class="text-xs text-gray-600">Date</span>
              <span class="text-xs font-medium text-gray-700">${item.date}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs text-gray-600">Time</span>
              <span class="text-xs font-medium text-gray-700">${item.time}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs text-gray-600">Validation Time</span>
              <span class="text-xs font-medium text-gray-700">${item.validationTime}</span>
            </div>
          </div>
        </div>

        <!-- Status & Verification -->
        <div>
          <h5 class="text-xs font-medium text-gray-700 mb-2">STATUS & VERIFICATION</h5>
          <div class="bg-white rounded-lg p-3 space-y-2 border border-gray-200">
            <div class="flex justify-between items-center">
              <span class="text-xs text-gray-600">Status</span>
              <span class="text-xs font-medium ${
                item.status === "Valid"
                  ? "text-green-600"
                  : item.status === "Pending"
                  ? "text-yellow-600"
                  : "text-red-600"
              }">
                ${item.status}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs text-gray-600">Scan Method</span>
              <span class="text-xs font-medium text-gray-700">${item.scanMethod}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs text-gray-600">Verified By</span>
              <span class="text-xs font-medium text-gray-700">${item.verifiedBy}</span>
            </div>
          </div>
        </div>

        <!-- Notes -->
        ${
          item.notes
            ? `
        <div>
          <h5 class="text-xs font-medium text-gray-700 mb-2">NOTES</h5>
          <div class="bg-white rounded-lg p-3 border border-gray-200">
            <p class="text-xs text-gray-700">${item.notes}</p>
          </div>
        </div>
        `
            : ""
        }
      </div>
    `,
      width: "500px",
      padding: "16px",
      showCloseButton: true,
      showConfirmButton: true,
      confirmButtonText: "Close",
      confirmButtonColor: "#2563eb",
      customClass: {
        popup: "rounded-xl font-poppins bg-white",
        closeButton: "text-gray-400 hover:text-gray-600 text-lg -mt-1 -mr-1",
        confirmButton: "font-poppins font-medium text-sm px-4 py-2",
      }
    });
  };

  const [expandedItem, setExpandedItem] = useState(null);

  const toggleItemExpansion = (id) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  // Filter data based on criteria
  const filteredHistory = historyData.filter((item) => {
    const matchesSearch =
      item.scanId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.assetType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.serialNumber &&
        item.serialNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.barcode &&
        item.barcode.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      selectedStatus === "all" || item.status === selectedStatus;
    const matchesDate = !selectedDate || item.date === selectedDate;
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "valid" && item.status === "Valid") ||
      (activeTab === "error" && item.status === "Error") ||
      (activeTab === "pending" && item.status === "Pending");

    return matchesSearch && matchesStatus && matchesDate && matchesTab;
  });

  const getStatusColor = (color) => {
    switch (color) {
      case "green":
        return "bg-green-100 text-green-700 border-green-200";
      case "red":
        return "bg-red-100 text-red-700 border-red-200";
      case "yellow":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Perangkat":
        return <Cpu className="w-4 h-4 text-blue-600" />;
      case "Material":
        return <Cable className="w-4 h-4 text-green-600" />;
      default:
        return <Server className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActivityIcon = (iconType) => {
    switch (iconType) {
      case "scan":
        return <Scan className="w-4 h-4" />;
      case "check":
        return <CheckCircle className="w-4 h-4" />;
      case "alert":
        return <AlertTriangle className="w-4 h-4" />;
      case "clipboard":
        return <Clipboard className="w-4 h-4" />;
      case "clock":
        return <Clock className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (color) => {
    switch (color) {
      case "blue":
        return "bg-blue-100 text-blue-700";
      case "green":
        return "bg-green-100 text-green-700";
      case "red":
        return "bg-red-100 text-red-700";
      case "orange":
        return "bg-orange-100 text-orange-700";
      case "yellow":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const exportToExcel = () => {
    // Simulate Excel export
    alert(`Exporting ${filteredHistory.length} data to Excel...`);
  };

  return (
    <ProtectedPage> {
    <LayoutDashboard activeMenu={4}>
      <div className="max-w-7xl mx-auto px-3 md:px-4 py-4 md:py-2 space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-semibold flex items-center">
                <HistoryIcon className="w-6 h-6 mr-3" />
                HISTORY & ACTIVITY LOG
              </h1>
              <p className="text-blue-100 text-sm mt-2">
                Complete history of scanning, validation, and IT asset system activities
              </p>
            </div>
            <div className="mt-4 lg:mt-0 flex items-center space-x-4 text-blue-100 text-sm">
              <div className="flex items-center">
                <Database className="w-4 h-4 mr-2" />
                <span>Total Data: {stats.total}</span>
              </div>
              <div className="flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                <span>Integrated System</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-4 text-center border-l-4 border-blue-500">
            <div className="text-xl md:text-2xl font-bold text-gray-900">
              {stats.total}
            </div>
            <div className="text-xs md:text-sm text-gray-500">Total Scans</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 text-center border-l-4 border-green-500">
            <div className="text-xl md:text-2xl font-bold text-gray-900">
              {stats.valid}
            </div>
            <div className="text-xs md:text-sm text-gray-500">Valid</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 text-center border-l-4 border-red-500">
            <div className="text-xl md:text-2xl font-bold text-gray-900">
              {stats.error}
            </div>
            <div className="text-xs md:text-sm text-gray-500">Error</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 text-center border-l-4 border-yellow-500">
            <div className="text-xl md:text-2xl font-bold text-gray-900">
              {stats.pending}
            </div>
            <div className="text-xs md:text-sm text-gray-500">Pending</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 text-center border-l-4 border-blue-400">
            <div className="text-xl md:text-2xl font-bold text-gray-900">
              {stats.perangkat}
            </div>
            <div className="text-xs md:text-sm text-gray-500">Perangkat</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 text-center border-l-4 border-green-400">
            <div className="text-xl md:text-2xl font-bold text-gray-900">
              {stats.material}
            </div>
            <div className="text-xs md:text-sm text-gray-500">Material</div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - Combined History Card */}
          <div className="xl:col-span-2">
            {/* Combined Card: Tab Navigation + Search & Filters + History Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Search, Filters, and Tabs Section */}
                <div className="p-4 md:p-6 space-y-4">
                  {/* Search and Filters Row */}
                  <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row gap-3 md:gap-4">
                    {/* Search Input */}
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          type="text"
                          placeholder="Search by ID, asset type, location, or serial number..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                        />
                      </div>
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex gap-2">
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                      >
                        <option value="all">All Status</option>
                        <option value="Valid">Valid</option>
                        <option value="Error">Error</option>
                        <option value="Pending">Pending</option>
                      </select>

                      <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
                      >
                        <Filter className="w-4 h-4 mr-2" />
                        <span className="hidden md:inline">Filter</span>
                        <span className="md:hidden">Filter</span>
                      </button>
                    </div>
                  </div>

                  {/* Additional Filters */}
                  {showFilters && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date
                          </label>
                          <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                          </label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
                            <option value="">All Categories</option>
                            <option value="Perangkat">Perangkat</option>
                            <option value="Material">Material</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Scan Method
                          </label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
                            <option value="">All Methods</option>
                            <option value="Camera">Camera</option>
                            <option value="Manual Input">Manual Input</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Border Line ABOVE Tab Navigation */}
                  <div className="border-t border-gray-200 pt-4">
                    {/* Tab Navigation */}
                    <div className="flex space-x-1 overflow-x-auto">
                      {[
                        { id: "all", label: "All", count: stats.total },
                        { id: "valid", label: "Valid", count: stats.valid },
                        { id: "error", label: "Error", count: stats.error },
                        {
                          id: "pending",
                          label: "Pending",
                          count: stats.pending,
                        },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex-shrink-0 py-2 md:py-3 px-3 md:px-4 rounded-lg text-xs md:text-sm font-medium transition-all min-w-[90px] ${
                            activeTab === tab.id
                              ? "bg-blue-600 text-white shadow-md"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          <div className="flex items-center justify-center space-x-1 md:space-x-2">
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
                </div>
              </div>

              {/* History Table - Desktop & Mobile */}
              <div className="overflow-x-auto">
                {/* Desktop Table */}
                <table className="w-full text-sm hidden md:table">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-gray-700 font-medium">
                        Scan ID
                      </th>
                      <th className="px-4 py-3 text-left text-gray-700 font-medium">
                        Asset Type
                      </th>
                      <th className="px-4 py-3 text-left text-gray-700 font-medium">
                        Location & Department
                      </th>
                      <th className="px-4 py-3 text-left text-gray-700 font-medium">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-gray-700 font-medium">
                        Inspection Date
                      </th>
                      <th className="px-4 py-3 text-left text-gray-700 font-medium">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredHistory.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-4">
                          <div className="font-medium text-blue-700">
                            {item.scanId}
                          </div>
                          <div className="text-xs text-gray-500 mt-1 flex items-center">
                            {getCategoryIcon(item.category)}
                            <span className="ml-1">{item.category}</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-medium text-gray-900">
                            {item.assetType}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {item.serialNumber || item.barcode}
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
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              item.statusColor
                            )}`}
                          >
                            {item.status === "Valid" ? (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            ) : item.status === "Error" ? (
                              <XCircle className="w-3 h-3 mr-1" />
                            ) : (
                              <Clock className="w-3 h-3 mr-1" />
                            )}
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-900">
                            {item.date}
                          </div>
                          <div className="text-xs text-gray-500">
                            {item.time}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleShowDetail(item)}
                              className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              Details
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Mobile Dropdown Cards */}
                <div className="md:hidden space-y-3 p-4">
                  {filteredHistory.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                    >
                      {/* Header - Always Visible */}
                      <div className="p-4 border-b border-gray-200">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              {getCategoryIcon(item.category)}
                              <div className="ml-2">
                                <div className="font-bold text-blue-700 text-sm">
                                  {item.scanId}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {item.category}
                                </div>
                              </div>
                            </div>
                            <div className="font-semibold text-gray-900 text-base mb-1">
                              {item.assetType}
                            </div>
                            <div className="text-xs text-gray-600 font-mono mb-2">
                              {item.serialNumber || item.barcode}
                            </div>
                          </div>
                          <button
                            onClick={() => toggleItemExpansion(item.id)}
                            className="text-gray-400 hover:text-gray-600 ml-2"
                          >
                            {expandedItem === item.id ? (
                              <ChevronUp className="w-5 h-5" />
                            ) : (
                              <ChevronDown className="w-5 h-5" />
                            )}
                          </button>
                        </div>

                        {/* Quick Info */}
                        <div className="flex justify-between items-center mt-3">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              item.statusColor
                            )}`}
                          >
                            {item.status === "Valid" ? (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            ) : item.status === "Error" ? (
                              <XCircle className="w-3 h-3 mr-1" />
                            ) : (
                              <Clock className="w-3 h-3 mr-1" />
                            )}
                            {item.status}
                          </span>
                          <div className="text-xs text-gray-500 text-right">
                            <div>{item.date}</div>
                            <div>{item.time}</div>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Details - Dropdown Content */}
                      {expandedItem === item.id && (
                        <div className="p-4 bg-gray-50 border-t border-gray-200">
                          <div className="space-y-3">
                            {/* Location & Department */}
                            <div>
                              <div className="text-xs font-semibold text-gray-500 mb-1">
                                LOCATION & DEPARTMENT
                              </div>
                              <div className="flex items-center text-sm text-gray-700 mb-1">
                                <MapPin className="w-3 h-3 mr-2 text-gray-400" />
                                {item.location}
                              </div>
                              <div className="text-xs text-gray-600 ml-5">
                                {item.department}
                              </div>
                            </div>

                            {/* Additional Information */}
                            <div>
                              <div className="text-xs font-semibold text-gray-500 mb-1">
                                INFORMATION
                              </div>
                              <div className="text-xs text-gray-600 space-y-1">
                                <div className="flex justify-between">
                                  <span>History ID:</span>
                                  <span className="font-medium">{item.id}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Unique Code:</span>
                                  <span className="font-mono">
                                    {item.uniqueCode}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Scan Method:</span>
                                  <span>{item.scanMethod}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Validation Time:</span>
                                  <span>{item.validationTime}</span>
                                </div>
                              </div>
                            </div>

                            {/* Notes */}
                            {item.notes && (
                              <div>
                                <div className="text-xs font-semibold text-gray-500 mb-1">
                                  NOTES
                                </div>
                                <div className="text-xs text-gray-600 bg-white p-2 rounded border">
                                  {item.notes}
                                </div>
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-2">
                              <button
                                onClick={() => handleShowDetail(item)}
                                className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs"
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                 Details
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Empty State */}
                {filteredHistory.length === 0 && (
                  <div className="text-center py-12">
                    <Box className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">
                      No history data found
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      Try adjusting your search or filters
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Activity Log & Analytics */}
          <div className="space-y-6">
            {/* Activity Log */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-blue-600" />
                Latest Activity Log
              </h3>

              <div className="space-y-4">
                {activityLog.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="p-2 rounded-full bg-gray-100">
                      {getActivityIcon(activity.icon)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 font-medium">
                        {activity.description}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-500">
                          {activity.user}
                        </span>
                        <span className="text-xs text-gray-400">
                          {activity.timestamp}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 text-center text-sm font-medium text-gray-600 hover:text-gray-800 transition">
                View All Activities &rarr;
              </button>
            </div>

            {/* Quick Analytics */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                Quick Analytics
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Success Rate
                    </p>
                    <p className="text-xs text-gray-600">
                      Validation success ratio
                    </p>
                  </div>
                  <div className="text-2xl font-semibold text-gray-800">
                    {Math.round((stats.valid / stats.total) * 100)}%
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Avg. Validation Time
                    </p>
                    <p className="text-xs text-gray-600">
                      Average validation time
                    </p>
                  </div>
                  <div className="text-lg font-semibold text-gray-800">2.1s</div>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Most Active User
                    </p>
                    <p className="text-xs text-gray-600">
                      User with most activities
                    </p>
                  </div>
                  <div className="text-sm font-semibold text-gray-800">
                    Clinton Alfaro
                  </div>
                </div>

                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Most Scanned Location
                    </p>
                    <p className="text-xs text-gray-600">
                      Location with most scans
                    </p>
                  </div>
                    <div className="text-sm font-semibold text-gray-800">
                    Infrastructure
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutDashboard>
    }</ProtectedPage>
  );
}