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
  QrCode,
  ScanLine,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import LayoutDashboard from "../components/LayoutDashboard";
import Swal from "sweetalert2";

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

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Get data from localStorage when component mounts
  useEffect(() => {
    const savedScanData = localStorage.getItem("lastSubmittedScan");
    if (savedScanData) {
      setScanData(JSON.parse(savedScanData));
    }
  }, []);

  // Data according to proposal - IT Perangkats and Materials
  const validationItems = [
    {
      id: 1,
      serialNumber: scanData?.serial || "PC-IT-2025-001",
      assetType: "Computer",
      category: "Perangkat",
      location: scanData?.location || "Infrastructure & Networking",
      department: "IT Infrastructure & Networking",
      lastVerified: "2025-09-20",
      status: "pending",
      uniqueCode: scanData?.uniqueCode || "V-901-XYZ-A",
      scanDate: scanData?.date || "2025-10-28",
      scanTime: scanData?.time || "14:30:15",
      verifiedBy: "Clinton Alfaro",
      photoEvidence: "/api/placeholder/80/60",
      idType: "Serial Number",
      idValue: scanData?.serial || "NS-PC-887632",
    },
    {
      id: 2,
      serialNumber: "MAT-KBL-045",
      assetType: "RJ45 Cable",
      category: "Material",
      location: "Workshop 2",
      department: "Facilities & Networking",
      lastVerified: "2025-09-18",
      status: "valid",
      uniqueCode: "V-902-ABC-B",
      scanDate: "2025-10-28",
      scanTime: "14:25:40",
      verifiedBy: "Wahyu Hidayat",
      photoEvidence: "/api/placeholder/80/60",
      idType: "Barcode",
      idValue: "BC-RJ45-554321",
    },
    {
      id: 3,
      serialNumber: "SRV-NET-012",
      assetType: "Server",
      category: "Perangkat",
      location: "Server Room L3",
      department: "System Operation",
      lastVerified: "2025-09-15",
      status: "error",
      uniqueCode: "V-903-DEF-C",
      scanDate: "2025-10-28",
      scanTime: "14:18:22",
      verifiedBy: "Ikhsan Kurniawan",
      photoEvidence: "/api/placeholder/80/60",
      idType: "Serial Number",
      idValue: "NS-SRV-992345",
    },
    {
      id: 4,
      serialNumber: "MAT-TRK-987",
      assetType: "Trunking",
      category: "Material",
      location: "Main Office L1",
      department: "Operations & End User Service",
      lastVerified: "2025-09-22",
      status: "pending",
      uniqueCode: "V-904-GHI-D",
      scanDate: "2025-10-28",
      scanTime: "14:10:05",
      verifiedBy: "Mahmud Amma Rizki",
      photoEvidence: "/api/placeholder/80/60",
      idType: "Barcode",
      idValue: "BC-TRK-773216",
    },
    {
      id: 5,
      serialNumber: "CCTV-SEC-003",
      assetType: "CCTV",
      category: "Perangkat",
      location: "Main Gate",
      department: "Facilities & Networking",
      lastVerified: "2025-09-19",
      status: "valid",
      uniqueCode: "V-905-JKL-E",
      scanDate: "2025-10-28",
      scanTime: "14:05:33",
      verifiedBy: "Yovan Sakti",
      photoEvidence: "/api/placeholder/80/60",
      idType: "Serial Number",
      idValue: "NS-CCTV-661234",
    },
    {
      id: 6,
      serialNumber: "LPT-IT-2025-002",
      assetType: "Laptop",
      category: "Perangkat",
      location: "Main Office L2",
      department: "IT Infrastructure & Networking",
      lastVerified: "2025-09-25",
      status: "pending",
      uniqueCode: "V-906-MNO-F",
      scanDate: "2025-10-28",
      scanTime: "13:55:20",
      verifiedBy: "Clinton Alfaro",
      photoEvidence: "/api/placeholder/80/60",
      idType: "Serial Number",
      idValue: "NS-LPT-445321",
    },
    {
      id: 7,
      serialNumber: "MAT-PIP-056",
      assetType: "Network Pipe",
      category: "Material",
      location: "Workshop 1",
      department: "Facilities & Networking",
      lastVerified: "2025-09-28",
      status: "error",
      uniqueCode: "V-907-PQR-G",
      scanDate: "2025-10-28",
      scanTime: "13:45:10",
      verifiedBy: "Wahyu Hidayat",
      photoEvidence: "/api/placeholder/80/60",
      idType: "Barcode",
      idValue: "BC-PIP-998765",
    },
  ];

  // Filter data based on search, status, and active tab
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

  // Calculate statistics
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

    // Simulate API call
    setTimeout(() => {
      console.log(`Performing ${action} on items:`, selectedItems);
      alert(`${action} successfully performed on ${selectedItems.length} items`);
      setSelectedItems([]);
      setIsSubmitting(false);

      // Redirect to reports after bulk verification
      if (action === "approve") {
        router.push("/reports-analytics");
      }
    }, 2000);
  };

  // Handle individual verification
  const handleVerifyItem = (itemId, status) => {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log(`Verifying item ${itemId} as ${status}`);
      alert(`Item successfully verified as ${status}`);
      setIsSubmitting(false);
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

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Perangkat":
        return <Cpu className="w-4 h-4 text-blue-600" />;
      case "Material":
        return <Cable className="w-4 h-4 text-green-600" />;
      default:
        return <Shield className="w-4 h-4 text-gray-600" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "Perangkat":
        return "bg-blue-100 text-blue-700";
      case "Material":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Helper function for active tab colors
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

  // Helper function for active badge colors
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

  const toggleItemExpansion = (id) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  // Function to show details with SweetAlert
  const handleShowDetail = (item) => {
    Swal.fire({
      title: `<div class="font-poppins text-lg font-semibold text-black">Scanning Result Details</div>`,
      html: `
      <div class="font-poppins text-left space-y-3 max-h-[50vh] overflow-y-auto pr-2">
        <!-- Header Info -->
        <div>
          <h4 class="text-base font-semibold text-gray-900">${item.assetType}</h4>
          <p class="text-xs text-gray-500 mt-1">${item.category} • ${item.idType}</p>
        </div>

        <!-- Asset Information -->
        <div>
          <h5 class="text-xs font-medium text-gray-700 mb-2">ASSET INFORMATION</h5>
          <div class="bg-gray-50 rounded-lg p-3 space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-xs text-gray-600">Asset ID</span>
              <span class="text-xs font-medium text-blue-700">${item.serialNumber}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs text-gray-600">${item.idType}</span>
              <span class="text-xs font-mono text-blue-600">${item.idValue}</span>
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
          <div class="bg-gray-50 rounded-lg p-3 space-y-2">
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
          <div class="bg-gray-50 rounded-lg p-3 space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-xs text-gray-600">Date</span>
              <span class="text-xs font-medium text-gray-700">${item.scanDate}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs text-gray-600">Time</span>
              <span class="text-xs font-medium text-gray-700">${item.scanTime}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-xs text-gray-600">Inspected By</span>
              <span class="text-xs font-medium text-gray-700">${item.verifiedBy}</span>
            </div>
          </div>
        </div>

        <!-- Validation Status -->
        <div>
          <h5 class="text-xs font-medium text-gray-700 mb-2">VALIDATION STATUS</h5>
          <div class="bg-gray-50 rounded-lg p-3">
            <div class="flex justify-between items-center">
              <span class="text-xs text-gray-600">Status</span>
              <span class="text-xs font-medium ${
                item.status === "valid"
                  ? "text-green-600"
                  : item.status === "pending"
                  ? "text-yellow-600"
                  : "text-red-600"
              }">
                ${
                  item.status === "valid"
                    ? "Validated"
                    : item.status === "pending"
                    ? "Pending Validation"
                    : "Validation Error"
                }
              </span>
            </div>
            <div class="flex justify-between items-center mt-2">
              <span class="text-xs text-gray-600">Last Verified</span>
              <span class="text-xs font-medium text-gray-700">${item.lastVerified}</span>
            </div>
          </div>
        </div>

        <!-- Photo Evidence -->
        <div>
          <h5 class="text-xs font-medium text-gray-700 mb-2">PHOTO EVIDENCE</h5>
          <div class="bg-gray-50 rounded-lg p-3 text-center">
            <div class="w-20 h-16 bg-gray-200 rounded mx-auto flex items-center justify-center">
              <Camera class="w-6 h-6 text-gray-400" />
            </div>
            <p class="text-xs text-gray-600 mt-2">Scanning result photo evidence</p>
            <button class="text-xs text-blue-600 mt-1 hover:text-blue-700">
              View Full Photo
            </button>
          </div>
        </div>
      </div>
    `,
      width: "500px",
      padding: "8px",
      showCloseButton: true,
      showConfirmButton: true,
      confirmButtonText: "Close",
      confirmButtonColor: "#2563eb",
      customClass: {
        popup: "rounded-xl font-poppins",
        closeButton: "text-gray-400 hover:text-gray-600 text-lg -mt-1 mb-2 -mr-1",
        confirmButton: "font-poppins font-medium text-sm px-8 py-2",
      },
    });
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
              <CheckSquare className="w-5 h-5 text-blue-600" />
            ) : (
              <Square className="w-5 h-5 text-gray-400" />
            )}
          </button>
          <div>
            <div className="font-bold text-blue-700 text-sm">
              {item.serialNumber}
            </div>
            <div className="text-xs text-gray-500 mt-1 flex items-center">
              {getCategoryIcon(item.category)}
              <span className="ml-1">{item.category}</span>
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
        <div className="font-semibold text-gray-900 text-base">
          {item.assetType}
        </div>
        <div className="text-xs text-gray-400 font-mono mt-1">
          {item.idType}: {item.idValue}
        </div>
      </div>

      {/* Status & Location */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
            item.status
          )}`}
        >
          {getStatusIcon(item.status)}
          <span className="ml-1 capitalize">
            {item.status === "valid"
              ? "Validated"
              : item.status === "pending"
              ? "Pending"
              : "Serial Number or Barcode Error"}
          </span>
        </span>
        <div className="text-xs text-gray-500 text-right">
          <div className="flex items-center">
            <MapPin className="w-3 h-3 mr-1" />
            {item.location}
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {expandedItem === item.id && (
        <div className="border-t border-gray-200 pt-3 mt-3 space-y-3">
          {/* Department & Verification */}
          <div>
            <div className="text-xs font-semibold text-gray-500 mb-1">
              DEPARTMENT & VERIFICATION
            </div>
            <div className="text-sm text-gray-700">{item.department}</div>
            <div className="text-xs text-gray-600 mt-1 flex items-center">
              <User className="w-3 h-3 mr-1" />
              {item.verifiedBy}
            </div>
            <div className="text-xs text-gray-600 mt-1 flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {item.scanDate} - {item.scanTime}
            </div>
          </div>

          {/* Unique Code */}
          <div>
            <div className="text-xs font-semibold text-gray-500 mb-1">
              UNIQUE CODE
            </div>
            <div className="text-sm font-mono text-blue-600">
              {item.uniqueCode}
            </div>
          </div>

          {/* Photo Evidence */}
          <div>
            <div className="text-xs font-semibold text-gray-500 mb-1">
              EVIDENCE
            </div>
            <button className="flex items-center text-blue-600 text-xs">
              <Camera className="w-3 h-3 mr-1" />
              View Photo Evidence
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            {item.status === "pending" && (
              <>
                <button
                  onClick={() => handleVerifyItem(item.id, "valid")}
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 text-xs"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Approve
                </button>
                <button
                  onClick={() => handleVerifyItem(item.id, "error")}
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 text-xs"
                >
                  <XCircle className="w-3 h-3 mr-1" />
                  Reject
                </button>
              </>
            )}
            <button
              onClick={() => handleShowDetail(item)}
              className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs"
            >
              <Eye className="w-3 h-3 mr-1" />
              Details
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <LayoutDashboard activeMenu={3}>
      <div className="max-w-7xl mx-auto px-3 md:px-4 py-2 md:py-2 space-y-4 md:space-y-6">
        {/* Header with gradient - Mobile Optimized */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-600 rounded-xl shadow-lg p-4 md:p-6 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center">
              <CheckCircle className="w-6 h-6 md:w-6 md:h-6 mr-2 md:mr-3" />
              <div>
                <h1 className="text-xl md:text-2xl font-semibold">
                  IT ASSET VALIDATION & VERIFICATION
                </h1>
                <p className="text-blue-100 mt-1 text-xs md:text-sm">
                  Automated validation system using AI technology
                </p>
              </div>
            </div>

            {scanData && (
              <div className="mt-4 lg:mt-0 p-3 md:p-4 bg-blue-500/30 backdrop-blur-sm rounded-lg border border-blue-400">
                <div className="flex items-center text-blue-100 text-xs md:text-sm">
                  <ScanLine className="w-4 h-4 mr-2" />
                  <span>
                    Last Scan: <strong>{scanData.serial}</strong>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* AI System Status - Mobile Optimized */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 mt-4">
            <div className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>AI Detection Active</span>
            </div>
            <div className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>OCR Running</span>
            </div>
            <div className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Database Online</span>
            </div>
            <div className="flex items-center space-x-1 md:space-x-2 text-xs md:text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Real-time Validation</span>
            </div>
          </div>
        </div>

        {/* Quick Stats - Mobile Optimized */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          {[
            {
              label: "Validated",
              value: stats.valid,
              sub: "Accurate Data",
              color: "text-green-600",
              border: "border-green-500",
            },
            {
              label: "Pending",
              value: stats.pending,
              sub: "Needs Verification",
              color: "text-yellow-600",
              border: "border-yellow-500",
            },
            {
              label: "Error",
              value: stats.error,
              sub: "Needs Action",
              color: "text-red-600",
              border: "border-red-500",
            },
            {
              label: "Total Assets",
              value: stats.total,
              sub: "All Categories",
              color: "text-blue-600",
              border: "border-blue-500",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg md:rounded-xl shadow-sm md:shadow-lg p-3 md:p-4 text-center border-l-4 ${stat.border}`}
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

        {/* Quick Actions Footer - Mobile Optimized */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 flex items-center">
            <ScanLine className="w-4 h-4 md:w-5 md:h-5 mr-2 text-black-600" />
            Perform Asset Re-Check
          </h3>
          <div className="space-y-3">
            {/* Full Width Button with original colors */}
            <button
              onClick={() => router.push("/scanning")}
              className="w-full flex flex-col items-center justify-center p-4 md:p-6 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 text-gray-800 hover:text-blue-700 shadow-sm hover:shadow-md"
            >
              <ScanLine className="w-6 h-6 md:w-8 md:h-8 mb-2 md:mb-3 text-blue-600" />
              <span className="text-sm md:text-lg font-semibold">
                Start New Scan
              </span>
              <span className="text-xs md:text-sm text-gray-600 mt-1 md:mt-2">
                Scan Perangkats or materials for checking process
              </span>
            </button>

            {/* Additional Information */}
            <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
              <span>Last scanned: October 28, 2025, 14:30</span>
              <span className="text-green-600 font-medium">✓ System Ready</span>
            </div>
          </div>
        </div>

        {/* Combined Control Panel and Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Search, Filter, Tabs, and Bulk Actions Section */}
          <div className="p-4 md:p-6 space-y-4 border-b border-gray-200">
            <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 flex items-center">
              <QrCode className="w-4 h-4 md:w-5 md:h-5 mr-2 text-black-600" />
              Asset Data from Serial Number & Barcode Scanning Results
            </h3>

            {/* Search and Filter Row */}
            <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row gap-3 md:gap-4">
              {/* Search Input */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search serial number, barcode, asset type, or location..."
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
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="valid">Validated</option>
                      <option value="error">Error</option>
                    </select>

                    <button className="flex items-center px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm">
                      <Filter className="w-4 h-4 mr-2" />
                      <span className="hidden md:inline">More Filters</span>
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
                          value={selectedStatus}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                        >
                          <option value="all">All Status</option>
                          <option value="pending">Pending</option>
                          <option value="valid">Validated</option>
                          <option value="error">Error</option>
                        </select>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Tab Navigation - Integrated with colored tabs */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex space-x-1 overflow-x-auto">
                {[
                  {
                    id: "all",
                    label: "All",
                    count: stats.total,
                    color: "blue",
                  },
                  {
                    id: "pending",
                    label: "Pending",
                    count: stats.pending,
                    color: "blue",
                  },
                  {
                    id: "valid",
                    label: "Validated",
                    count: stats.valid,
                    color: "blue",
                  },
                  {
                    id: "error",
                    label: "Error",
                    count: stats.error,
                    color: "blue",
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-shrink-0 py-2 md:py-3 px-3 md:px-4 rounded-lg text-xs md:text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? getActiveTabColor(tab.color)
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center space-x-1 md:space-x-2">
                      <span>{tab.label}</span>
                      <span
                        className={`px-1.5 md:px-2 py-0.5 md:py-1 rounded-full text-xs ${
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

            {/* Bulk Actions - Integrated for validation page */}
            {selectedItems.length > 0 && (
              <div className="mt-4 p-3 md:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 md:gap-3">
                  <div className="text-blue-800 text-sm font-medium flex items-center">
                    <CheckSquare className="w-4 h-4 mr-2" />
                    {selectedItems.length} items selected for bulk verification
                  </div>
                  <div className="flex gap-1 md:gap-2 flex-wrap">
                    <button
                      onClick={() => handleBulkAction("approve")}
                      disabled={isSubmitting}
                      className="flex items-center px-3 py-1.5 md:px-4 md:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 text-xs"
                    >
                      <CheckCircle className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                      Approve
                    </button>
                    <button
                      onClick={() => handleBulkAction("reject")}
                      disabled={isSubmitting}
                      className="flex items-center px-3 py-1.5 md:px-4 md:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 text-xs"
                    >
                      <XCircle className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                      Reject
                    </button>
               
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Table/Cards Section */}
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
                          <CheckSquare className="w-4 h-4 mr-2 text-blue-600" />
                        ) : (
                          <Square className="w-4 h-4 mr-2 text-gray-400" />
                        )}
                        Asset ID
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-gray-700 font-medium">
                      Type & Category
                    </th>
                    <th className="px-4 py-3 text-left text-gray-700 font-medium">
                      Location & Department
                    </th>
                    <th className="px-4 py-3 text-left text-gray-700 font-medium">
                      Scan Details
                    </th>
                    <th className="px-4 py-3 text-left text-gray-700 font-medium">
                      Validation Status
                    </th>
                    <th className="px-4 py-3 text-left text-gray-700 font-medium">
                      Actions
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
                              {getCategoryIcon(item.category)}
                              <span className="ml-1">{item.category}</span>
                            </div>
                            <div className="text-xs text-gray-400 font-mono mt-1">
                              {item.idType}: {item.idValue}
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
                              item.category
                            )}`}
                          >
                            {item.category}
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
                           <span className="text-xs">View Photo Evidence</span>
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
                              ? "Validated"
                              : item.status === "pending"
                              ? "Pending"
                              : "Error"}
                          </span>
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          {item.status === "pending" && (
                            <>
                              <button
                                onClick={() =>
                                  handleVerifyItem(item.id, "valid")
                                }
                                disabled={isSubmitting}
                                className="flex items-center px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 text-xs"
                              >
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Approve
                              </button>
                              <button
                                onClick={() =>
                                  handleVerifyItem(item.id, "error")
                                }
                                disabled={isSubmitting}
                                className="flex items-center px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 text-xs"
                              >
                                <XCircle className="w-3 h-3 mr-1" />
                                Reject
                              </button>
                            </>
                          )}
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
              <AlertTriangle className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-3 md:mb-4" />
              <p className="text-gray-500 text-base md:text-lg">
                No validation data found
              </p>
              <p className="text-gray-400 text-sm mt-1 md:mt-2">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>
    </LayoutDashboard>
  );
}