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
import Swal from "sweetalert2";

export default function ReportsAnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("daily");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedItem, setExpandedItem] = useState(null);

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

  // Report data according to proposal
  const reportData = [
    {
      id: "RPT-001",
      scanId: "PC-IT-2025-001",
      assetType: "Computer",
      category: "Perangkat",
      location: "Infrastructure & Networking",
      serialNumber: "NS-PC-887632",
      status: "Valid",
      scanDate: "2025-10-28",
      scanTime: "14:30:15",
      verifiedBy: "Clinton Alfaro",
      department: "IT Infrastructure & Networking",
      validationTime: "2 seconds",
      uniqueCode: "V-901-XYZ-A",
      period: "daily",
      scanMethod: "QR Code Scan",
      notes: "Device in good condition and functioning normally"
    },
    {
      id: "RPT-002",
      scanId: "MAT-KBL-045",
      assetType: "RJ45 Cable",
      category: "Material",
      location: "Workshop 2",
      barcode: "BC-RJ45-554321",
      status: "Valid",
      scanDate: "2025-10-28",
      scanTime: "14:25:40",
      verifiedBy: "Wahyu Hidayat",
      department: "Facilities & Networking",
      validationTime: "1.5 seconds",
      uniqueCode: "V-902-ABC-B",
      period: "daily",
      scanMethod: "Barcode Scan",
      notes: "Cable available in sufficient stock"
    },
    {
      id: "RPT-003",
      scanId: "SRV-NET-012",
      assetType: "Server",
      category: "Perangkat",
      location: "Server Room L3",
      serialNumber: "NS-SRV-992345",
      status: "Error",
      scanDate: "2025-10-28",
      scanTime: "14:18:22",
      verifiedBy: "Ikhsan Kurniawan",
      department: "System Operation",
      validationTime: "3 seconds",
      uniqueCode: "V-903-DEF-C",
      period: "daily",
      scanMethod: "QR Code Scan",
      notes: "Server experiencing overheating, requires immediate maintenance"
    },
    {
      id: "RPT-004",
      scanId: "CCTV-SEC-003",
      assetType: "CCTV",
      category: "Perangkat",
      location: "Main Gate",
      serialNumber: "NS-CCTV-661234",
      status: "Valid",
      scanDate: "2025-10-27",
      scanTime: "16:20:15",
      verifiedBy: "Yovan Sakti",
      department: "Facilities & Networking",
      validationTime: "2.2 seconds",
      uniqueCode: "V-905-JKL-E",
      period: "daily",
      scanMethod: "QR Code Scan",
      notes: "CCTV functioning optimally, recordings stored properly"
    },
    {
      id: "RPT-005",
      scanId: "LPT-IT-2025-002",
      assetType: "Laptop",
      category: "Perangkat",
      location: "Main Office L2",
      serialNumber: "NS-LPT-445321",
      status: "Pending",
      scanDate: "2025-10-27",
      scanTime: "15:45:30",
      verifiedBy: "Clinton Alfaro",
      department: "IT Infrastructure & Networking",
      validationTime: "2.5 seconds",
      uniqueCode: "V-906-MNO-F",
      period: "daily",
      scanMethod: "Manual Input",
      notes: "Waiting for supervisor confirmation for rescanning"
    },
    {
      id: "RPT-006",
      scanId: "MAT-TRK-987",
      assetType: "Trunking",
      category: "Material",
      location: "Main Office L1",
      barcode: "BC-TRK-773216",
      status: "Valid",
      scanDate: "2025-10-26",
      scanTime: "13:10:05",
      verifiedBy: "Mahmud Amma Rizki",
      department: "Operations & End User Service",
      validationTime: "1.8 seconds",
      uniqueCode: "V-904-GHI-D",
      period: "weekly",
      scanMethod: "Barcode Scan",
      notes: "Trunking installed neatly and securely"
    },
    {
      id: "RPT-007",
      scanId: "MAT-PIP-056",
      assetType: "Network Pipe",
      category: "Material",
      location: "Workshop 1",
      barcode: "BC-PIP-998765",
      status: "Error",
      scanDate: "2025-10-26",
      scanTime: "12:45:10",
      verifiedBy: "Wahyu Hidayat",
      department: "Facilities & Networking",
      validationTime: "4 seconds",
      uniqueCode: "V-907-PQR-G",
      period: "weekly",
      scanMethod: "Barcode Scan",
      notes: "Pipe damaged at connection, requires replacement"
    },
    {
      id: "RPT-008",
      scanId: "SWT-NET-008",
      assetType: "Network Switch",
      category: "Perangkat",
      location: "Server Room L3",
      serialNumber: "NS-SWT-778899",
      status: "Valid",
      scanDate: "2025-10-25",
      scanTime: "11:20:15",
      verifiedBy: "Ikhsan Kurniawan",
      department: "System Operation",
      validationTime: "1.7 seconds",
      uniqueCode: "V-908-STU-H",
      period: "weekly",
      scanMethod: "QR Code Scan",
      notes: "Switch operating normally, all ports active"
    }
  ];

  // Statistics data
  const stats = {
    total: reportData.length,
    valid: reportData.filter(item => item.status === "Valid").length,
    error: reportData.filter(item => item.status === "Error").length,
    pending: reportData.filter(item => item.status === "Pending").length,
    perangkat: reportData.filter(item => item.category === "Perangkat").length,
    material: reportData.filter(item => item.category === "Material").length,
    daily: reportData.filter(item => item.period === "daily").length,
    weekly: reportData.filter(item => item.period === "weekly").length
  };

  // Analytics data
  const analyticsData = {
    successRate: Math.round((stats.valid / stats.total) * 100),
    avgValidationTime: "2.1s",
    mostActiveUser: "Clinton Alfaro",
    mostScannedLocation: "Infrastructure & Networking",
    dailyAverage: 12,
    weeklyTotal: 45
  };

  // Filter data based on period and criteria
  const filteredReports = reportData.filter(item => {
    const matchesPeriod = selectedPeriod === "all" || item.period === selectedPeriod;
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus;
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    
    const matchesStartDate = !startDate || item.scanDate >= startDate;
    const matchesEndDate = !endDate || item.scanDate <= endDate;

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
  const showDetail = (item) => {
    Swal.fire({
      title: `<div class="font-poppins text-lg font-semibold text-black">Inspection Report Details</div>`,
      html: `
        <div class="font-poppins text-left space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          <!-- Header Info -->
          <div class="bg-white rounded-lg p-4 border border-gray-200">
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
                <span class="text-xs text-gray-600">Report ID</span>
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
                <span class="text-xs font-medium text-gray-700">${item.scanDate}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-xs text-gray-600">Time</span>
                <span class="text-xs font-medium text-gray-700">${item.scanTime}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-xs text-gray-600">Validation Time</span>
                <span class="text-xs font-medium text-gray-700">${item.validationTime}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-xs text-gray-600">Period</span>
                <span class="text-xs font-medium text-gray-700">${item.period === "daily" ? "Daily" : "Weekly"}</span>
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
      padding: "8px",
      showCloseButton: true,
      showConfirmButton: true,
      confirmButtonText: "Close",
      confirmButtonColor: "#2563eb",
      customClass: {
        popup: "rounded-xl font-poppins bg-white",
        closeButton: "text-gray-400 hover:text-gray-600 text-lg -mr-1 mt-0",
        confirmButton: "font-poppins font-medium text-sm px-8 py-2",
      }
    });
  };

  // Export to PDF function
  const exportToPDF = (selectedOnly = false) => {
    const dataToExport = selectedOnly && selectedItems.length > 0 
      ? reportData.filter(item => selectedItems.includes(item.id))
      : filteredReports;
    
    Swal.fire({
      title: 'Export PDF',
      text: `Exporting ${dataToExport.length} data to PDF format...`,
      icon: 'info',
      confirmButtonText: 'OK',
      confirmButtonColor: '#2563eb',
    });
    // Implement PDF export logic here
  };

  // Export to Excel function
  const exportToExcel = (selectedOnly = false) => {
    const dataToExport = selectedOnly && selectedItems.length > 0 
      ? reportData.filter(item => selectedItems.includes(item.id))
      : filteredReports;
    
    Swal.fire({
      title: 'Export Excel',
      text: `Exporting ${dataToExport.length} data to Excel format...`,
      icon: 'info',
      confirmButtonText: 'OK',
      confirmButtonColor: '#2563eb',
    });
    // Implement Excel export logic here
  };

  // Print function
  const printReport = (selectedOnly = false) => {
    const dataToPrint = selectedOnly && selectedItems.length > 0 
      ? reportData.filter(item => selectedItems.includes(item.id))
      : filteredReports;
    
    Swal.fire({
      title: 'Print Report',
      text: `Printing ${dataToPrint.length} report data...`,
      icon: 'info',
      confirmButtonText: 'OK',
      confirmButtonColor: '#2563eb',
    });
    // Implement print logic here
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
              {item.scanId}
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
          {item.serialNumber || item.barcode}
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
          <span className="ml-1">{item.status}</span>
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

          {/* Scan Details */}
          <div>
            <div className="text-xs font-semibold text-gray-500 mb-1">
              SCAN DETAILS
            </div>
            <div className="text-xs text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>Scan Method:</span>
                <span>{item.scanMethod}</span>
              </div>
              <div className="flex justify-between">
                <span>Validation Time:</span>
                <span>{item.validationTime}</span>
              </div>
              <div className="flex justify-between">
                <span>Period:</span>
                <span>{item.period === "daily" ? "Daily" : "Weekly"}</span>
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
              onClick={() => showDetail(item)}
              className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs"
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
                Complete reports and analysis of IT asset inspection data per period
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
            <div className="text-sm text-gray-500">Total Scans</div>
            <div className="text-xs text-blue-600 font-medium mt-1">
             All Periods
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 text-center border-l-4 border-green-500">
            <div className="text-2xl font-bold text-gray-900">{stats.valid}</div>
            <div className="text-sm text-gray-500">Valid</div>
            <div className="text-xs text-green-600 font-medium mt-1">
               Successfully Validated
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 text-center border-l-4 border-red-500">
            <div className="text-2xl font-bold text-gray-900">{stats.error}</div>
            <div className="text-sm text-gray-500">Error</div>
            <div className="text-xs text-red-600 font-medium mt-1">
               Requires Action
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 text-center border-l-4 border-yellow-500">
            <div className="text-2xl font-bold text-gray-900">{stats.pending}</div>
            <div className="text-sm text-gray-500">Pending</div>
            <div className="text-xs text-yellow-600 font-medium mt-1">
               Waiting Verification
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

        {/* Combined Control Panel and Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Search, Filter, and Bulk Actions Section */}
          <div className="p-4 md:p-6 space-y-4 border-b border-gray-200">
            <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 flex items-center">
              <BarChart3 className="w-4 h-4 md:w-5 md:h-5 mr-2 text-black-600" />
              Report Data & Analytics Overview
            </h3>

            {/* Search and Filter Row */}
            <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row gap-3 md:gap-4">
              {/* Search Input */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search scan ID, asset type, location, or serial number..."
                    value={""}
                    onChange={(e) => {}}
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
                      <option value="Valid">Valid</option>
                      <option value="Error">Error</option>
                      <option value="Pending">Pending</option>
                    </select>

                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                    >
                      <option value="all">All Categories</option>
                      <option value="Perangkat">Perangkat</option>
                      <option value="Material">Material</option>
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
                          <option value="Valid">Valid</option>
                          <option value="Error">Error</option>
                          <option value="Pending">Pending</option>
                        </select>
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                        >
                          <option value="all">All Categories</option>
                          <option value="Perangkat">Perangkat</option>
                          <option value="Material">Material</option>
                        </select>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Period Selection */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex space-x-1 overflow-x-auto">
                {[
                  { id: "all", label: "All", count: stats.total, color: "blue" },
                  { id: "daily", label: "Daily", count: stats.daily, color: "blue" },
                  { id: "weekly", label: "Weekly", count: stats.weekly, color: "blue" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedPeriod(tab.id)}
                    className={`flex-shrink-0 py-2 md:py-3 px-3 md:px-4 rounded-lg text-xs md:text-sm font-medium transition-all ${
                      selectedPeriod === tab.id
                        ? getActiveTabColor(tab.color)
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center space-x-1 md:space-x-2">
                      <span>{tab.label}</span>
                      <span
                        className={`px-1.5 md:px-2 py-0.5 md:py-1 rounded-full text-xs ${
                          selectedPeriod === tab.id
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

            {/* Bulk Actions - Only shown if items are selected */}
            {selectedItems.length > 0 && (
              <div className="mt-4 p-3 md:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 md:gap-3">
                  <div className="text-blue-800 text-sm font-medium flex items-center">
                    <CheckSquare className="w-4 h-4 mr-2" />
                    {selectedItems.length} reports selected for bulk export
                  </div>
                  <div className="flex gap-1 md:gap-2 flex-wrap">
                    <button
                      onClick={() => exportToPDF(true)}
                      className="flex items-center px-3 py-1.5 md:px-4 md:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-xs"
                    >
                      <FileDown className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                      Export PDF
                    </button>
                    <button
                      onClick={() => exportToExcel(true)}
                      className="flex items-center px-3 py-1.5 md:px-4 md:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-xs"
                    >
                      <Download className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                      Export Excel
                    </button>
                    <button 
                      onClick={() => printReport(true)}
                      className="flex items-center px-3 py-1.5 md:px-4 md:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs"
                    >
                      <Printer className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                      Print
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
                        {selectedItems.length === filteredReports.length &&
                        filteredReports.length > 0 ? (
                          <CheckSquare className="w-4 h-4 mr-2 text-blue-600" />
                        ) : (
                          <Square className="w-4 h-4 mr-2 text-gray-400" />
                        )}
                        Scan ID
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
                      Report Status
                    </th>
                    <th className="px-4 py-3 text-left text-gray-700 font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredReports.map((item) => (
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
                              {item.scanId}
                            </div>
                            <div className="text-xs text-gray-500 mt-1 flex items-center">
                              {getCategoryIcon(item.category)}
                              <span className="ml-1">{item.category}</span>
                            </div>
                            <div className="text-xs text-gray-400 font-mono mt-1">
                              {item.serialNumber || item.barcode}
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
                        <div className="text-xs text-gray-400 mt-1">
                          Code: {item.uniqueCode}
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
                            <Clock className="w-3 h-3 mr-1" />
                            <span className="text-xs">{item.validationTime}</span>
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
                          <span className="ml-1">{item.status}</span>
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          {item.period === "daily" ? "Daily Report" : "Weekly Report"}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => showDetail(item)}
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
              {filteredReports.map((item) => (
                <MobileItemCard key={item.id} item={item} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {filteredReports.length === 0 && (
            <div className="text-center py-8 md:py-12">
              <FileText className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-3 md:mb-4" />
              <p className="text-gray-500 text-base md:text-lg">
                No report data found
              </p>
              <p className="text-gray-400 text-sm mt-1 md:mt-2">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}

          {/* Summary Footer */}
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600">
              <div>
                Showing {filteredReports.length} of {stats.total} reports
              </div>
              <div className="flex gap-4 mt-2 sm:mt-0">
                <span>Perangkat: {stats.perangkat}</span>
                <span>Material: {stats.material}</span>
                <span>Daily: {stats.daily}</span>
                <span>Weekly: {stats.weekly}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutDashboard>
  );
}