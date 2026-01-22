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
  CheckSquare,
  Square,
  FileText,
  User,
  Calendar,
  MapPin,
  Cpu,
  Cable,
  Eye,
  BarChart3,
  Database,
  Activity,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Printer,
  FileDown,
  Package,
  List,
} from "lucide-react";
import LayoutDashboard from "../components/LayoutDashboard";
import ProtectedPage from "../components/ProtectedPage";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";

export default function ReportsAnalyticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("daily");
  const [selectedItems, setSelectedItems] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedPeriod, setExpandedPeriod] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const periodReports = [
    {
      periodId: "PERIOD-2025-10-28",
      periodType: "daily",
      date: "2025-10-28",
      displayDate: "Monday, 28 October 2025",
      totalScans: 3,
      valid: 2,
      error: 1,
      pending: 0,
      items: [
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
          scanMethod: "QR Code Scan",
          notes: "Device in good condition and functioning normally",
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
          scanMethod: "Barcode Scan",
          notes: "Cable available in sufficient stock",
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
          scanMethod: "QR Code Scan",
          notes: "Server experiencing overheating, requires immediate maintenance",
        },
      ],
    },
    {
      periodId: "PERIOD-2025-10-27",
      periodType: "daily",
      date: "2025-10-27",
      displayDate: "Sunday, 27 October 2025",
      totalScans: 2,
      valid: 1,
      error: 0,
      pending: 1,
      items: [
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
          scanMethod: "QR Code Scan",
          notes: "CCTV functioning optimally, recordings stored properly",
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
          scanMethod: "Manual Input",
          notes: "Waiting for supervisor confirmation for rescanning",
        },
      ],
    },
    {
      periodId: "PERIOD-2025-10-26",
      periodType: "daily",
      date: "2025-10-26",
      displayDate: "Saturday, 26 October 2025",
      totalScans: 2,
      valid: 1,
      error: 1,
      pending: 0,
      items: [
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
          scanMethod: "Barcode Scan",
          notes: "Trunking installed neatly and securely",
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
          scanMethod: "Barcode Scan",
          notes: "Pipe damaged at connection, requires replacement",
        },
      ],
    },
    {
      periodId: "WEEK-2025-43",
      periodType: "weekly",
      date: "2025-10-20",
      endDate: "2025-10-26",
      displayDate: "Week 43 (20-26 Oct 2025)",
      totalScans: 15,
      valid: 12,
      error: 2,
      pending: 1,
      items: [
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
          scanMethod: "QR Code Scan",
          notes: "Switch operating normally, all ports active",
        },
      ],
    },
  ];

  const stats = {
    total: periodReports.reduce((sum, period) => sum + period.totalScans, 0),
    valid: periodReports.reduce((sum, period) => sum + period.valid, 0),
    error: periodReports.reduce((sum, period) => sum + period.error, 0),
    pending: periodReports.reduce((sum, period) => sum + period.pending, 0),
    daily: periodReports.filter((period) => period.periodType === "daily").length,
    weekly: periodReports.filter((period) => period.periodType === "weekly").length,
  };

  const analyticsData = {
    successRate: Math.round((stats.valid / stats.total) * 100),
    avgValidationTime: "2.1s",
    mostActiveUser: "Clinton Alfaro",
    mostScannedLocation: "Infrastructure & Networking",
  };

  const filteredPeriods = periodReports.filter((period) => {
    return selectedPeriod === "all" || period.periodType === selectedPeriod;
  });

  const toggleSelectPeriod = (periodId) => {
    setSelectedItems((prev) =>
      prev.includes(periodId)
        ? prev.filter((id) => id !== periodId)
        : [...prev, periodId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === filteredPeriods.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredPeriods.map((period) => period.periodId));
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
        return <Cpu className="w-4 h-4 text-gray-600" />;
    }
  };

  const getActiveTabColor = (color) => {
    switch (color) {
      case "blue":
        return "bg-blue-600 text-white shadow-md";
      default:
        return "bg-blue-600 text-white shadow-md";
    }
  };

  const getActiveBadgeColor = (color) => {
    switch (color) {
      case "blue":
        return "bg-blue-500 text-white";
      default:
        return "bg-blue-500 text-white";
    }
  };

  const togglePeriodExpansion = (periodId) => {
    setExpandedPeriod(expandedPeriod === periodId ? null : periodId);
  };

  const showPeriodDetail = (period) => {
    Swal.fire({
      title: `<div class="font-poppins text-lg font-semibold text-black">${period.displayDate} - Inspection Report</div>`,
      html: `
        <div class="font-poppins text-left space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <div class="bg-white rounded-lg p-4 border border-gray-200">
            <div class="grid grid-cols-4 gap-3 text-center">
              <div class="bg-gray-100 p-3 rounded-lg">
                <div class="text-xl font-bold text-gray-800">${period.totalScans}</div>
                <div class="text-xs text-gray-600">Total Scans</div>
              </div>
              <div class="bg-gray-100 p-3 rounded-lg">
                <div class="text-xl font-bold text-gray-800">${period.valid}</div>
                <div class="text-xs text-gray-600">Valid</div>
              </div>
              <div class="bg-gray-100 p-3 rounded-lg">
                <div class="text-xl font-bold text-gray-800">${period.error}</div>
                <div class="text-xs text-gray-600">Error</div>
              </div>
              <div class="bg-gray-100 p-3 rounded-lg">
                <div class="text-xl font-bold text-gray-800">${period.pending}</div>
                <div class="text-xs text-gray-600">Pending</div>
              </div>
            </div>
          </div>

          <div>
            <h5 class="text-sm font-semibold text-gray-700 mb-3">SCANNED ITEMS (${period.items.length})</h5>
            <div class="space-y-3">
              ${period.items
                .map(
                  (item) => `
                <div class="bg-white rounded-lg border border-gray-200 p-3">
                  <div class="flex justify-between items-start mb-2">
                    <div class="flex items-center space-x-2">
                      <span class="font-medium text-gray-900">${item.assetType}</span>
                      <span class="text-xs px-2 py-1 rounded-full ${getStatusColor(item.status)}">
                        ${item.status}
                      </span>
                    </div>
                    <div class="text-xs text-gray-500 font-mono">${item.scanId}</div>
                  </div>
                  
                  <div class="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div><strong>Location:</strong> ${item.location}</div>
                    <div><strong>Verified By:</strong> ${item.verifiedBy}</div>
                    <div><strong>Scan Time:</strong> ${item.scanTime}</div>
                    <div><strong>Validation:</strong> ${item.validationTime}</div>
                  </div>

                  ${item.notes
                    ? `
                    <div class="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                      <strong>Notes:</strong> ${item.notes}
                    </div>
                  `
                    : ""}
                </div>
              `
                )
                .join("")}
            </div>
          </div>
        </div>
      `,
      width: "550px",
      padding: "15px",
      showCloseButton: true,
      showConfirmButton: true,
      confirmButtonText: "Close",
      confirmButtonColor: "#2563eb",
      customClass: {
        popup: "rounded-xl font-poppins bg-white",
        closeButton: "text-gray-400 hover:text-gray-600",
        confirmButton: "font-poppins font-medium text-sm px-8 py-2",
      },
    });
  };

  const getExportData = (selectedOnly = false) => {
    return selectedOnly && selectedItems.length > 0
      ? periodReports.filter((period) => selectedItems.includes(period.periodId))
      : filteredPeriods;
  };

  const exportToExcel = (selectedOnly = false) => {
    const dataToExport = getExportData(selectedOnly);
    
    if (dataToExport.length === 0) {
      Swal.fire({
        title: "No Data",
        text: "There is no data to export.",
        icon: "warning",
        confirmButtonColor: "#1e40af",
      });
      return;
    }

    try {
      const excelData = [];
      const summaryData = [
        ["PERIODIC REPORTS SUMMARY"],
        [""],
        ["Export Date", new Date().toLocaleDateString()],
        ["Total Periods", dataToExport.length],
        ["Total Scans", dataToExport.reduce((sum, p) => sum + p.totalScans, 0)],
        ["Valid Scans", dataToExport.reduce((sum, p) => sum + p.valid, 0)],
        ["Error Scans", dataToExport.reduce((sum, p) => sum + p.error, 0)],
        ["Pending Scans", dataToExport.reduce((sum, p) => sum + p.pending, 0)],
        [""],
        ["PERIOD LIST"],
        ["Period", "Type", "Date", "Total Scans", "Valid", "Error", "Pending", "Success Rate"]
      ];

      dataToExport.forEach(period => {
        summaryData.push([
          period.displayDate,
          period.periodType === "daily" ? "Daily" : "Weekly",
          period.date,
          period.totalScans,
          period.valid,
          period.error,
          period.pending,
          `${Math.round((period.valid / period.totalScans) * 100)}%`
        ]);
      });

      const detailData = [
        ["DETAILED SCAN REPORT"],
        [""],
        ["Period", "Scan ID", "Asset Type", "Category", "Location", "Serial/Barcode", "Status", 
         "Scan Date", "Scan Time", "Verified By", "Department", "Validation Time", "Unique Code", "Scan Method", "Notes"]
      ];

      dataToExport.forEach(period => {
        period.items.forEach(item => {
          detailData.push([
            period.displayDate,
            item.scanId,
            item.assetType,
            item.category,
            item.location,
            item.serialNumber || item.barcode,
            item.status,
            item.scanDate,
            item.scanTime,
            item.verifiedBy,
            item.department,
            item.validationTime,
            item.uniqueCode,
            item.scanMethod,
            item.notes || ""
          ]);
        });
      });

      const workbook = XLSX.utils.book_new();
      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
      const detailSheet = XLSX.utils.aoa_to_sheet(detailData);
      
      XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");
      XLSX.utils.book_append_sheet(workbook, detailSheet, "Detailed Report");

      const summaryColWidths = [
        { wch: 30 }, { wch: 10 }, { wch: 15 }, { wch: 12 }, { wch: 8 }, { wch: 8 }, { wch: 8 }, { wch: 12 }
      ];
      summarySheet['!cols'] = summaryColWidths;

      const detailColWidths = [
        { wch: 25 }, { wch: 15 }, { wch: 20 }, { wch: 12 }, { wch: 25 }, { wch: 20 }, 
        { wch: 10 }, { wch: 12 }, { wch: 10 }, { wch: 20 }, { wch: 25 }, { wch: 15 }, 
        { wch: 15 }, { wch: 15 }, { wch: 40 }
      ];
      detailSheet['!cols'] = detailColWidths;

      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
      const filename = `Periodic_Reports_${timestamp}.xlsx`;

      XLSX.writeFile(workbook, filename);

      Swal.fire({
        title: "Success!",
        text: `Data has been exported to ${filename}`,
        icon: "success",
        confirmButtonColor: "#1e40af",
      });

    } catch (error) {
      console.error("Error exporting to Excel:", error);
      Swal.fire({
        title: "Export Failed",
        text: "Failed to export data to Excel. Please try again.",
        icon: "error",
        confirmButtonColor: "#1e40af",
      });
    }
  };

  const exportToPDF = async (selectedOnly = false) => {
    const dataToExport = getExportData(selectedOnly);
    
    if (dataToExport.length === 0) {
      Swal.fire({
        title: "No Data",
        text: "There is no data to export.",
        icon: "warning",
        confirmButtonColor: "#1e40af",
      });
      return;
    }

    try {
      Swal.fire({
        title: 'Generating PDF...',
        text: 'Please wait while we generate your PDF report.',
        icon: 'info',
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const pdf = new jsPDF('p', 'mm', 'a4');
      let yPosition = 20;
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 15;

      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(40, 40, 40);
      pdf.text('PERIODIC INSPECTION REPORTS', pageWidth / 2, yPosition, { align: 'center' });
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(100, 100, 100);
      yPosition += 8;
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(40, 40, 40);
      pdf.text('SUMMARY OVERVIEW', margin, yPosition);
      yPosition += 8;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Total Periods: ${dataToExport.length}`, margin, yPosition);
      yPosition += 5;
      pdf.text(`Total Scans: ${dataToExport.reduce((sum, p) => sum + p.totalScans, 0)}`, margin, yPosition);
      yPosition += 5;
      pdf.text(`Valid: ${dataToExport.reduce((sum, p) => sum + p.valid, 0)}`, margin, yPosition);
      yPosition += 5;
      pdf.text(`Error: ${dataToExport.reduce((sum, p) => sum + p.error, 0)}`, margin, yPosition);
      yPosition += 5;
      pdf.text(`Pending: ${dataToExport.reduce((sum, p) => sum + p.pending, 0)}`, margin, yPosition);
      yPosition += 15;

      dataToExport.forEach((period, index) => {
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(30, 64, 175);
        pdf.text(`${period.displayDate} (${period.periodType === 'daily' ? 'Daily' : 'Weekly'})`, margin, yPosition);
        yPosition += 7;

        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Scans: ${period.totalScans} | Valid: ${period.valid} | Error: ${period.error} | Pending: ${period.pending} | Success Rate: ${Math.round((period.valid / period.totalScans) * 100)}%`, margin, yPosition);
        yPosition += 10;

        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(40, 40, 40);
        pdf.text('Scan ID', margin, yPosition);
        pdf.text('Asset Type', margin + 30, yPosition);
        pdf.text('Status', margin + 70, yPosition);
        pdf.text('Location', margin + 95, yPosition);
        pdf.text('Verified By', margin + 140, yPosition);
        yPosition += 4;

        pdf.setDrawColor(200, 200, 200);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 6;

        pdf.setFont('helvetica', 'normal');
        period.items.forEach(item => {
          if (yPosition > 270) {
            pdf.addPage();
            yPosition = 20;
            pdf.setFontSize(8);
            pdf.setFont('helvetica', 'bold');
            pdf.text('Scan ID', margin, yPosition);
            pdf.text('Asset Type', margin + 30, yPosition);
            pdf.text('Status', margin + 70, yPosition);
            pdf.text('Location', margin + 95, yPosition);
            pdf.text('Verified By', margin + 140, yPosition);
            yPosition += 10;
          }

          pdf.setFontSize(7);
          pdf.text(item.scanId, margin, yPosition);
          pdf.text(item.assetType, margin + 30, yPosition);
          
          pdf.setTextColor(
            item.status === 'Valid' ? 34 : item.status === 'Error' ? 239 : 245,
            item.status === 'Valid' ? 197 : item.status === 'Error' ? 68 : 158,
            item.status === 'Valid' ? 94 : item.status === 'Error' ? 68 : 11
          );
          pdf.text(item.status, margin + 70, yPosition);
          
          pdf.setTextColor(40, 40, 40);
          pdf.text(item.location.length > 20 ? item.location.substring(0, 20) + '...' : item.location, margin + 95, yPosition);
          pdf.text(item.verifiedBy, margin + 140, yPosition);
          
          yPosition += 5;
        });

        yPosition += 10;
      });

      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
      const filename = `Periodic_Reports_${timestamp}.pdf`;

      pdf.save(filename);

      Swal.close();
      Swal.fire({
        title: "Success!",
        text: `PDF report has been generated as ${filename}`,
        icon: "success",
        confirmButtonColor: "#1e40af",
      });

    } catch (error) {
      console.error("Error generating PDF:", error);
      Swal.close();
      Swal.fire({
        title: "PDF Generation Failed",
        text: "Failed to generate PDF report. Please try again.",
        icon: "error",
        confirmButtonColor: "#1e40af",
      });
    }
  };

  const printReport = (selectedOnly = false) => {
    const dataToPrint = getExportData(selectedOnly);
    
    if (dataToPrint.length === 0) {
      Swal.fire({
        title: "No Data",
        text: "There is no data to print.",
        icon: "warning",
        confirmButtonColor: "#1e40af",
      });
      return;
    }

    const printWindow = window.open('', '_blank');
    const timestamp = new Date().toLocaleDateString();
    
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Periodic Reports - ${timestamp}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            margin: 20px; 
            color: #333;
          }
          .header { 
            text-align: center; 
            margin-bottom: 30px;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 10px;
          }
          .header h1 { 
            color: #2563eb; 
            margin: 0;
            font-size: 24px;
          }
          .summary { 
            background: #f8fafc; 
            padding: 15px; 
            border-radius: 5px; 
            margin-bottom: 20px;
            border-left: 4px solid #2563eb;
          }
          .period { 
            margin-bottom: 25px; 
            page-break-inside: avoid;
          }
          .period-header { 
            background: #1e40af; 
            color: white; 
            padding: 10px; 
            border-radius: 5px 5px 0 0;
            font-weight: bold;
          }
          .period-summary {
            background: #dbeafe;
            padding: 8px 10px;
            font-size: 14px;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 10px;
          }
          th { 
            background: #e2e8f0; 
            padding: 8px; 
            text-align: left;
            border: 1px solid #cbd5e1;
          }
          td { 
            padding: 8px; 
            border: 1px solid #cbd5e1;
            font-size: 12px;
          }
          .valid { color: #16a34a; font-weight: bold; }
          .error { color: #dc2626; font-weight: bold; }
          .pending { color: #d97706; font-weight: bold; }
          .footer { 
            text-align: center; 
            margin-top: 30px; 
            color: #6b7280; 
            font-size: 12px;
          }
          @media print {
            body { margin: 0.5in; }
            .period { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>PERIODIC INSPECTION REPORTS</h1>
          <p>Generated on: ${timestamp}</p>
        </div>

        <div class="summary">
          <strong>SUMMARY:</strong> 
          ${dataToPrint.length} Periods | 
          ${dataToPrint.reduce((sum, p) => sum + p.totalScans, 0)} Total Scans |
          ${dataToPrint.reduce((sum, p) => sum + p.valid, 0)} Valid |
          ${dataToPrint.reduce((sum, p) => sum + p.error, 0)} Error |
          ${dataToPrint.reduce((sum, p) => sum + p.pending, 0)} Pending
        </div>

        ${dataToPrint.map(period => `
          <div class="period">
            <div class="period-header">
              ${period.displayDate} - ${period.periodType === 'daily' ? 'Daily Report' : 'Weekly Report'}
            </div>
            <div class="period-summary">
              Total Scans: ${period.totalScans} | 
              Valid: ${period.valid} | 
              Error: ${period.error} | 
              Pending: ${period.pending} | 
              Success Rate: ${Math.round((period.valid / period.totalScans) * 100)}%
            </div>
            <table>
              <thead>
                <tr>
                  <th>Scan ID</th>
                  <th>Asset Type</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Verified By</th>
                  <th>Scan Time</th>
                </tr>
              </thead>
              <tbody>
                ${period.items.map(item => `
                  <tr>
                    <td>${item.scanId}</td>
                    <td>${item.assetType}</td>
                    <td>${item.category}</td>
                    <td>${item.location}</td>
                    <td class="${item.status.toLowerCase()}">${item.status}</td>
                    <td>${item.verifiedBy}</td>
                    <td>${item.scanTime}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `).join('')}

        <div class="footer">
          Generated by IT Inventory System - Seatrium &copy; ${new Date().getFullYear()}
        </div>

        <script>
          window.onload = function() {
            window.print();
            setTimeout(() => {
              window.close();
            }, 500);
          }
        </script>
      </body>
      </html>
    `;

    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  const handleBulkExport = (type, selectedOnly = false) => {
    if (selectedOnly && selectedItems.length === 0) {
      Swal.fire({
        title: "No Selection",
        text: "Please select periods to export.",
        icon: "warning",
        confirmButtonColor: "#1e40af",
      });
      return;
    }

    switch (type) {
      case 'excel':
        exportToExcel(selectedOnly);
        break;
      case 'pdf':
        exportToPDF(selectedOnly);
        break;
      case 'print':
        printReport(selectedOnly);
        break;
      default:
        break;
    }
  };

  const MobilePeriodCard = ({ period }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <button
            onClick={() => toggleSelectPeriod(period.periodId)}
            className="mr-3 mt-1"
          >
            {selectedItems.includes(period.periodId) ? (
              <CheckSquare className="w-5 h-5 text-blue-600" />
            ) : (
              <Square className="w-5 h-5 text-gray-400" />
            )}
          </button>
          <div>
            <div className="font-bold text-blue-700 text-sm flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {period.displayDate}
            </div>
            <div className="text-xs text-gray-500 mt-1 flex items-center">
              <Package className="w-3 h-3 mr-1" />
              {period.totalScans} items scanned
            </div>
          </div>
        </div>
        <button
          onClick={() => togglePeriodExpansion(period.periodId)}
          className="text-gray-400"
        >
          {expandedPeriod === period.periodId ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </button>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex space-x-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3 mr-1" />
            {period.valid}
          </span>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-700">
            <XCircle className="w-3 h-3 mr-1" />
            {period.error}
          </span>
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
            <Clock className="w-3 h-3 mr-1" />
            {period.pending}
          </span>
        </div>
        <div className="text-xs text-gray-500">
          {period.periodType === "daily" ? "Daily" : "Weekly"} Report
        </div>
      </div>

      {expandedPeriod === period.periodId && (
        <div className="border-t border-gray-200 pt-3 mt-3 space-y-3">
          <div>
            <div className="text-xs font-semibold text-gray-500 mb-2">
              RECENT SCANS ({period.items.length} items)
            </div>
            <div className="space-y-2">
              {period.items.slice(0, 3).map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center">
                    {getCategoryIcon(item.category)}
                    <span className="ml-2 font-medium">{item.assetType}</span>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
              {period.items.length > 3 && (
                <div className="text-xs text-gray-500 text-center">
                  + {period.items.length - 3} more items...
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={() => showPeriodDetail(period)}
              className="flex-1 flex items-center justify-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs"
            >
              <Eye className="w-3 h-3 mr-1" />
              View Full Report
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <ProtectedPage> {
    <LayoutDashboard activeMenu={5}>
      <div className="max-w-7xl mx-auto px-3 md:px-4 py-2 md:py-2 space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-semibold flex items-center">
                <BarChart3 className="w-6 h-6 mr-3" />
                PERIODIC REPORTS & ANALYTICS
              </h1>
              <p className="text-blue-100 text-sm mt-2">
                Complete inspection reports and analytics organized by period
                (Daily/Weekly)
              </p>
            </div>
            <div className="mt-4 lg:mt-0 flex items-center space-x-4 text-blue-100 text-sm">
              <div className="flex items-center">
                <Database className="w-4 h-4 mr-2" />
                <span>Total Periods: {periodReports.length}</span>
              </div>
              <div className="flex items-center">
                <Activity className="w-4 h-4 mr-2" />
                <span>Period-based Analytics</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-lg p-4 text-center border-l-4 border-blue-500">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-500">Total Scans</div>
            <div className="text-xs text-blue-600 font-medium mt-1">All Periods</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 text-center border-l-4 border-green-500">
            <div className="text-2xl font-bold text-gray-900">{stats.valid}</div>
            <div className="text-sm text-gray-500">Valid</div>
            <div className="text-xs text-green-600 font-medium mt-1">Successfully Validated</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 text-center border-l-4 border-red-500">
            <div className="text-2xl font-bold text-gray-900">{stats.error}</div>
            <div className="text-sm text-gray-500">Error</div>
            <div className="text-xs text-red-600 font-medium mt-1">Requires Action</div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-4 text-center border-l-4 border-yellow-500">
            <div className="text-2xl font-bold text-gray-900">{stats.pending}</div>
            <div className="text-sm text-gray-500">Pending</div>
            <div className="text-xs text-yellow-600 font-medium mt-1">Waiting Verification</div>
          </div>
        </div>

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

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 md:p-6 space-y-4 border-b border-gray-200">
            <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-3 md:mb-4 flex items-center">
              <List className="w-4 h-4 md:w-5 md:h-5 mr-2 text-blue-600" />
              Period-Based Reports Overview
            </h3>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex space-x-1 overflow-x-auto">
                {[
                  {
                    id: "all",
                    label: "All Periods",
                    count: periodReports.length,
                    color: "blue",
                  },
                  {
                    id: "daily",
                    label: "Daily Reports",
                    count: stats.daily,
                    color: "blue",
                  },
                  {
                    id: "weekly",
                    label: "Weekly Reports",
                    count: stats.weekly,
                    color: "blue",
                  },
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

            {selectedItems.length > 0 && (
              <div className="mt-4 p-3 md:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 md:gap-3">
                  <div className="text-blue-800 text-sm font-medium flex items-center">
                    <CheckSquare className="w-4 h-4 mr-2" />
                    {selectedItems.length} periods selected for bulk export
                  </div>
                  <div className="flex gap-1 md:gap-2 flex-wrap">
                    <button
                      onClick={() => handleBulkExport('pdf', true)}
                      className="flex items-center px-3 py-1.5 md:px-4 md:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-xs"
                    >
                      <FileDown className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                      Export PDF
                    </button>
                    <button
                      onClick={() => handleBulkExport('excel', true)}
                      className="flex items-center px-3 py-1.5 md:px-4 md:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-xs"
                    >
                      <Download className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                      Export Excel
                    </button>
                    <button
                      onClick={() => handleBulkExport('print', true)}
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

          {!isMobile ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <button
                        onClick={toggleSelectAll}
                        className="flex items-center text-gray-700 font-medium"
                      >
                        {selectedItems.length === filteredPeriods.length &&
                        filteredPeriods.length > 0 ? (
                          <CheckSquare className="w-4 h-4 mr-2 text-blue-600" />
                        ) : (
                          <Square className="w-4 h-4 mr-2 text-gray-400" />
                        )}
                        Period Date
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-gray-700 font-medium">
                      Scan Summary
                    </th>
                    <th className="px-4 py-3 text-left text-gray-700 font-medium">
                      Status Overview
                    </th>
                    <th className="px-4 py-3 text-left text-gray-700 font-medium">
                      Report Type
                    </th>
                    <th className="px-4 py-3 text-left text-gray-700 font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPeriods.map((period) => (
                    <tr
                      key={period.periodId}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <button
                            onClick={() => toggleSelectPeriod(period.periodId)}
                            className="mr-3"
                          >
                            {selectedItems.includes(period.periodId) ? (
                              <CheckSquare className="w-4 h-4 text-blue-600" />
                            ) : (
                              <Square className="w-4 h-4 text-gray-400" />
                            )}
                          </button>
                          <div>
                            <div className="font-medium text-blue-700 flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              {period.displayDate}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {period.periodType === "daily"
                                ? "Daily Inspection Report"
                                : "Weekly Summary Report"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-gray-900">
                          {period.totalScans} Items Scanned
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          <div className="flex items-center space-x-4">
                            <span className="flex items-center">
                              <Package className="w-3 h-3 mr-1" />
                              {period.items.length} detailed records
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex space-x-2 mb-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            {period.valid} Valid
                          </span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-700">
                            <XCircle className="w-3 h-3 mr-1" />
                            {period.error} Error
                          </span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
                            <Clock className="w-3 h-3 mr-1" />
                            {period.pending} Pending
                          </span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Success Rate:{" "}
                          {Math.round((period.valid / period.totalScans) * 100)}%
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            period.periodType === "daily"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-purple-100 text-purple-700"
                          }`}
                        >
                          {period.periodType === "daily" ? "Daily" : "Weekly"}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => showPeriodDetail(period)}
                            className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-xs"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View Report
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-3 md:p-4">
              {filteredPeriods.map((period) => (
                <MobilePeriodCard key={period.periodId} period={period} />
              ))}
            </div>
          )}

          {filteredPeriods.length === 0 && (
            <div className="text-center py-8 md:py-12">
              <FileText className="w-10 h-10 md:w-12 md:h-12 text-gray-400 mx-auto mb-3 md:mb-4" />
              <p className="text-gray-500 text-base md:text-lg">
                No period reports found
              </p>
              <p className="text-gray-400 text-sm mt-1 md:mt-2">
                Try adjusting your period filter criteria
              </p>
            </div>
          )}

          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600">
              <div>
                Showing {filteredPeriods.length} of {periodReports.length} period reports
              </div>
              <div className="flex gap-4 mt-2 sm:mt-0">
                <span>Daily: {stats.daily}</span>
                <span>Weekly: {stats.weekly}</span>
                <span>Total Scans: {stats.total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutDashboard>
    }</ProtectedPage>
  );
}