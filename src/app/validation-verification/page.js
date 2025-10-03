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
} from "lucide-react";
import LayoutDashboard from "../components/LayoutDashboard";

export default function ValidationVerificationPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedItems, setSelectedItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scanData, setScanData] = useState(null);

  const router = useRouter();

  // Ambil data dari localStorage saat komponen mount
  useEffect(() => {
    const savedScanData = localStorage.getItem('lastSubmittedScan');
    if (savedScanData) {
      setScanData(JSON.parse(savedScanData));
    }
  }, []);

  // Data dummy untuk validation items
  const validationItems = [
    {
      id: 1,
      serialNumber: scanData?.serial || "PC-00456-SN",
      assetType: "Desktop Computer",
      location: scanData?.location || "IT Room 2F",
      department: "IT Infrastructure",
      lastVerified: "2025-09-20",
      status: "pending",
      uniqueCode: scanData?.uniqueCode || "V-901-XYZ-A",
      scanDate: scanData?.date || "2025-09-29",
      scanTime: scanData?.time || "14:30",
      verifiedBy: "Clinton Alfaro"
    },
    {
      id: 2,
      serialNumber: "LPT-8891-SN",
      assetType: "Laptop",
      location: "Finance L3",
      department: "Finance",
      lastVerified: "2025-09-18",
      status: "valid",
      uniqueCode: "V-902-ABC-B",
      scanDate: "2025-09-29",
      scanTime: "14:25",
      verifiedBy: "Sarah Johnson"
    },
    {
      id: 3,
      serialNumber: "MOU-7742-SN",
      assetType: "Mouse",
      location: "HR L2",
      department: "Human Resources",
      lastVerified: "2025-09-15",
      status: "error",
      uniqueCode: "V-903-DEF-C",
      scanDate: "2025-09-29",
      scanTime: "14:20",
      verifiedBy: "Mike Chen"
    },
    {
      id: 4,
      serialNumber: "KBD-5566-SN",
      assetType: "Keyboard",
      location: "Marketing L1",
      department: "Marketing",
      lastVerified: "2025-09-22",
      status: "pending",
      uniqueCode: "V-904-GHI-D",
      scanDate: "2025-09-29",
      scanTime: "14:15",
      verifiedBy: "Emily Davis"
    },
    {
      id: 5,
      serialNumber: "MON-3321-SN",
      assetType: "Monitor",
      location: "Operations L4",
      department: "Operations",
      lastVerified: "2025-09-19",
      status: "valid",
      uniqueCode: "V-905-JKL-E",
      scanDate: "2025-09-29",
      scanTime: "14:10",
      verifiedBy: "Robert Wilson"
    }
  ];

  // Filter data berdasarkan search dan status
  const filteredItems = validationItems.filter(item => {
    const matchesSearch = item.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.assetType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // Toggle select item
  const toggleSelectItem = (id) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  // Select all items
  const toggleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map(item => item.id));
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

  return (
     <LayoutDashboard activeMenu={3}> 
      <div className="max-w-7xl mx-auto px-3 md:px-4 py-4 md:py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <CheckCircle className="w-6 h-6 mr-3 text-green-600" />
              Validation & Verification
            </h1>
            <p className="text-gray-600 mt-2">
              Verify and validate scanned asset data before final submission
            </p>
          </div>
          
          {scanData && (
            <div className="mt-4 lg:mt-0 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center text-sm text-blue-800">
                <FileText className="w-4 h-4 mr-2" />
                <span>Last Scan: <strong>{scanData.serial}</strong> at {scanData.time}</span>
              </div>
            </div>
          )}
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by serial number, asset type, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="valid">Valid</option>
                <option value="error">Error</option>
              </select>

              <button className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </button>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedItems.length > 0 && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="text-blue-800 text-sm font-medium">
                  {selectedItems.length} item(s) selected
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleBulkAction("approve")}
                    disabled={isSubmitting}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 text-sm"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Selected
                  </button>
                  <button
                    onClick={() => handleBulkAction("reject")}
                    disabled={isSubmitting}
                    className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 text-sm"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject Selected
                  </button>
                  <button
                    onClick={() => handleBulkAction("export")}
                    disabled={isSubmitting}
                    className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition disabled:opacity-50 text-sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Validation Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <button
                      onClick={toggleSelectAll}
                      className="flex items-center text-gray-700 font-medium"
                    >
                      {selectedItems.length === filteredItems.length && filteredItems.length > 0 ? (
                        <CheckSquare className="w-4 h-4 mr-2 text-blue-600" />
                      ) : (
                        <Square className="w-4 h-4 mr-2 text-gray-400" />
                      )}
                      Serial Number
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left text-gray-700 font-medium">Asset Type</th>
                  <th className="px-4 py-3 text-left text-gray-700 font-medium">Location</th>
                  <th className="px-4 py-3 text-left text-gray-700 font-medium">Scan Details</th>
                  <th className="px-4 py-3 text-left text-gray-700 font-medium">Status</th>
                  <th className="px-4 py-3 text-left text-gray-700 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
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
                          <div className="font-medium text-blue-700">{item.serialNumber}</div>
                          <div className="text-xs text-gray-500 mt-1">{item.uniqueCode}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="font-medium text-gray-900">{item.assetType}</div>
                      <div className="text-xs text-gray-500 mt-1">{item.department}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center text-gray-700">
                        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                        {item.location}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-xs text-gray-600 space-y-1">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {item.scanDate} at {item.scanTime}
                        </div>
                        <div className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {item.verifiedBy}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                        {getStatusIcon(item.status)}
                        <span className="ml-1 capitalize">{item.status}</span>
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
                              Approve
                            </button>
                            <button
                              onClick={() => handleVerifyItem(item.id, "error")}
                              disabled={isSubmitting}
                              className="flex items-center px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 text-xs"
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Reject
                            </button>
                          </>
                        )}
                        <button className="flex items-center px-3 py-1 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition text-xs">
                          <Send className="w-3 h-3 mr-1" />
                          Details
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredItems.length === 0 && (
            <div className="text-center py-12">
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No validation items found</p>
              <p className="text-gray-400 text-sm mt-2">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>

        {/* Summary Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Verification Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-700">2</div>
              <div className="text-sm text-green-600">Valid Assets</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-700">2</div>
              <div className="text-sm text-yellow-600">Pending Review</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="text-2xl font-bold text-red-700">1</div>
              <div className="text-sm text-red-600">Errors Found</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-700">5</div>
              <div className="text-sm text-blue-600">Total Assets</div>
            </div>
          </div>
        </div>
      </div>
    </LayoutDashboard>
  );
}


// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import {
//   ChevronDown,
//   ChevronRight,
//   Home,
//   FileText,
//   Shield,
//   Calendar,
//   HelpCircle,
//   Settings,
//   Bell,
//   User,
//   X,
//   Menu,
//   ListChecks,
//   Clock,
//   Scan,
//   CheckCircle,
//   Check,
//   Send,
//   AlertCircle,
// } from "lucide-react";

// // Dummy
// const DUMMY_TODAY_SCAN_COUNT = 15;

// export default function ValidationVerificationPage() {
//   const router = useRouter();
//   const [activeMenu, setActiveMenu] = useState(3); // index menu Validation
//   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//   const [lastScanData, setLastScanData] = useState(null);
//   const [isVerifying, setIsVerifying] = useState(false);

//   // Ambil data terakhir dari localStorage
//   useEffect(() => {
//     const dataString = localStorage.getItem("lastSubmittedScan");
//     if (dataString) {
//       setLastScanData(JSON.parse(dataString));
//     } else {
//       setLastScanData({
//         serial: "PC-00456-SN",
//         uniqueCode: "V-901-XYZ-A",
//         location: "IT Room 2F",
//         date: new Date().toLocaleDateString("en-US"),
//         time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
//         isDummy: true,
//       });
//     }
//   }, []);

//   const menuItems = [
//     { icon: Home, label: "Home", href: "/dashboard" },
//     { icon: FileText, label: "Inventory Data" },
//     { icon: Shield, label: "Serial Scanning", href: "/scanning" },
//     { icon: ListChecks, label: "Validation & Verification", href: "/validation-verification" },
//     { icon: Calendar, label: "History & Activity Log" },
//     { icon: Settings, label: "Reports & Analytics" },
//     { icon: Settings, label: "User Management" },
//     { icon: Settings, label: "System Settings" },
//     { icon: HelpCircle, label: "User Guide" },
//   ];

//   const getCurrentTime = () =>
//     new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
//   const getCurrentDate = () =>
//     new Date().toLocaleDateString("en-US", {
//       weekday: "long",
//       day: "numeric",
//       month: "long",
//       year: "numeric",
//     });

//   const handleFinalVerification = () => {
//     if (!lastScanData) return;
//     setIsVerifying(true);
//     setTimeout(() => {
//       alert(`Verifikasi untuk ${lastScanData.serial} berhasil ✅`);
//       localStorage.removeItem("lastSubmittedScan");
//       router.push("/scanning");
//     }, 2500);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       {/* 🔹 NAVBAR */}
//       <nav className="bg-white shadow-sm">
//         <div className="px-4 py-3 flex items-center justify-between">
//           <Image
//             src="/seatrium.png"
//             alt="Seatrium Logo"
//             width={200}
//             height={200}
//             className="object-contain"
//             priority
//           />

//           <div className="flex items-center space-x-2">
//             <button className="hidden md:block p-2 hover:bg-gray-100 rounded-lg relative">
//               <Bell className="w-5 h-5 text-gray-600" />
//               <span className="absolute top-2 right-2 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
//             </button>

//             <button className="hidden md:flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition">
//               <User className="w-4 h-4" />
//               <span>Clinton Alfaro</span>
//               <ChevronDown className="w-4 h-4" />
//             </button>

//             <button
//               className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
//               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
//             >
//               <Menu className="w-5 h-5 text-gray-800" />
//             </button>
//           </div>
//         </div>

//         {/* Desktop Menu */}
//         <div className="hidden md:block bg-blue-600 px-4">
//           <div className="flex flex-wrap items-center gap-1 py-2">
//             {menuItems.map((item, index) => (
//               <button
//                 key={index}
//                 onClick={() => item.href && router.push(item.href)}
//                 className={`flex items-center space-x-1 px-3 py-2 text-white hover:bg-blue-700 text-sm transition ${
//                   activeMenu === index ? "bg-blue-700" : ""
//                 }`}
//               >
//                 <item.icon className="w-4 h-4" />
//                 <span>{item.label}</span>
//               </button>
//             ))}
//             <div className="ml-auto text-white text-sm py-2 px-3 opacity-80">
//               {getCurrentDate()}
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* ✅ MAIN CONTENT pakai layout dashboard */}
//       <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
//         <h1 className="text-2xl font-bold text-gray-800 flex items-center">
//           <ListChecks className="w-6 h-6 mr-3 text-green-600" />
//           Validation & Verification
//         </h1>

//         {/* 🟦 Summary Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//           <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
//             <Calendar className="w-6 h-6 text-blue-600 mb-2" />
//             <p className="text-xs text-gray-500">DATE</p>
//             <p className="font-semibold text-gray-800 text-center text-sm">
//               {getCurrentDate()}
//             </p>
//           </div>

//           <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
//             <Clock className="w-6 h-6 text-blue-600 mb-2" />
//             <p className="text-xs text-gray-500">TIME</p>
//             <p className="font-bold text-gray-800 text-lg">{getCurrentTime()}</p>
//           </div>

//           <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center">
//             <Scan className="w-6 h-6 text-green-600 mb-2" />
//             <p className="text-xs text-gray-500">TOTAL SCANNED TODAY</p>
//             <p className="font-bold text-gray-800 text-3xl">
//               {DUMMY_TODAY_SCAN_COUNT + (!lastScanData?.isDummy ? 1 : 0)}
//             </p>
//           </div>
//         </div>

//         {/* 🟨 Detail Box */}
//         <div className="bg-white rounded-xl shadow p-6 border">
//           <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center border-b pb-2">
//             <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
//             Latest Submitted Data
//           </h2>

//           {lastScanData ? (
//             <div className="space-y-3">
//               <div className="flex justify-between border-b pb-1 text-sm">
//                 <span className="text-gray-500">Serial Number:</span>
//                 <span className="font-bold bg-blue-50 px-2 rounded">
//                   {lastScanData.serial}
//                 </span>
//               </div>
//               <div className="flex justify-between border-b pb-1 text-sm">
//                 <span className="text-gray-500">Unique Code:</span>
//                 <span className="font-semibold">{lastScanData.uniqueCode}</span>
//               </div>
//               <div className="flex justify-between border-b pb-1 text-sm">
//                 <span className="text-gray-500">Location:</span>
//                 <span className="font-semibold">{lastScanData.location}</span>
//               </div>
//               <div className="flex justify-between border-b pb-1 text-sm">
//                 <span className="text-gray-500">Time Submitted:</span>
//                 <span className="font-semibold">
//                   {lastScanData.time} ({lastScanData.date})
//                 </span>
//               </div>
//               <div className="flex justify-between border-b pb-1 text-sm">
//                 <span className="text-gray-500">OCR Verification:</span>
//                 <span className="font-bold text-green-600 flex items-center">
//                   <Check className="w-4 h-4 mr-1" /> Verified
//                 </span>
//               </div>

//               <textarea
//                 placeholder="Manual Verification Notes (Optional)"
//                 className="w-full border rounded-lg p-2 text-sm mt-2"
//                 rows={3}
//               ></textarea>

//               <button
//                 onClick={handleFinalVerification}
//                 disabled={isVerifying}
//                 className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition mt-2"
//               >
//                 {isVerifying ? "Finalizing..." : "Finalize Verification"}
//               </button>
//             </div>
//           ) : (
//             <div className="text-center py-8 text-gray-500">
//               <AlertCircle className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
//               No submitted data found.
//             </div>
//           )}
//         </div>

//         {/* 📝 Instructions */}
//         <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
//           <h3 className="text-blue-800 font-semibold text-sm flex items-center mb-2">
//             <HelpCircle className="w-4 h-4 mr-2" />
//             Verification Guide
//           </h3>
//           <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
//             <li>Pastikan Serial Number dan Unique Code sesuai aset fisik.</li>
//             <li>Isi catatan manual jika ada koreksi.</li>
//             <li>Tekan Finalize untuk simpan ke sistem.</li>
//           </ul>
//         </div>
//       </main>
//     </div>
//   );
// }


