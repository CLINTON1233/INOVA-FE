"use client";

import { useState, useEffect, useRef } from "react";
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
  ScanLine,
  Cpu,
  Cable,
  Server,
  Box,
  MapPin,
  X,
  Trash2,
} from "lucide-react";
import Swal from "sweetalert2";
import LayoutDashboard from "../components/LayoutDashboard";

export default function SerialScanningPage() {
  const [manualInput, setManualInput] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [inputType, setInputType] = useState(""); // "serial" atau "barcode"
  const [checkHistory, setCheckHistory] = useState([]);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [currentScanData, setCurrentScanData] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [dataToDelete, setDataToDelete] = useState(null);
  const [isSubmittingAll, setIsSubmittingAll] = useState(false);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);
  const [deletedDataInfo, setDeletedDataInfo] = useState(null);
  const videoRef = useRef(null);

  const router = useRouter();

  // Daftar lokasi sesuai dengan proposal
  const locationOptions = [
    "Infrastruktur & Jaringan",
    "Workshop 1",
    "Workshop 2",
    "Ruang Server L3",
    "Kantor Utama L1",
    "Pintu Gerbang",
    "Main Office L2",
    "Gudang Material",
    "Operations Center",
    "Facilities Area",
  ];

  // Load riwayat dari localStorage saat komponen mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("scanCheckHistory");
    if (savedHistory) {
      setCheckHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Simpan riwayat ke localStorage setiap kali ada perubahan
  useEffect(() => {
    if (checkHistory.length > 0) {
      localStorage.setItem("scanCheckHistory", JSON.stringify(checkHistory));
    }
  }, [checkHistory]);
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Failed to access camera:", err);
        setCameraError(
          "Unable to access the camera. Please make sure camera permissions are granted."
        );
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  // Fungsi untuk menambah data ke riwayat pengecekan
  const addToCheckHistory = (scanData) => {
    const newCheckItem = {
      id: `CHK-${Date.now()}`,
      timestamp: new Date().toISOString(),
      tanggal: new Date().toLocaleDateString("id-ID"),
      waktu: new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      ...scanData,
      status: "Checked", // Status sementara sebelum submit
      submitted: false,
    };

    setCheckHistory((prev) => [newCheckItem, ...prev]); // Simpan semua item tanpa batasan
    return newCheckItem;
  };

  // Fungsi simulasi scan dengan data sesuai proposal
  const handleScan = () => {
    setScanResult("loading");
    setManualInput("");
    setIsSubmitting(false);
    setInputType("");

    setTimeout(() => {
      const isError = Math.random() < 0.2; // 20% chance of error
      const isDevice = Math.random() < 0.6; // 60% device, 40% material

      if (isError) {
        const errorData = {
          status: "error",
          id: "ERR-SCAN-001",
          assetType: "Unrecognized",
          category: "Error",
          location: "",
          message: "Invalid serial number/barcode format. Please rescan.",
          inputType: "scan",
        };

        setScanResult(errorData);
        addToCheckHistory(errorData);
      } else {
        const assets = isDevice
          ? // Device data (Serial Numbers)
            [
              {
                id: "PC-IT-2025-001",
                assetType: "Computer",
                category: "Device",
                location: "",
                serialNumber: "SN-PC-887632",
              },
              {
                id: "SRV-NET-012",
                assetType: "Server",
                category: "Device",
                location: "",
                serialNumber: "SN-SRV-992345",
              },
              {
                id: "CCTV-SEC-003",
                assetType: "CCTV",
                category: "Device",
                location: "",
                serialNumber: "SN-CCTV-661234",
              },
            ]
          : // Material data (Barcodes)
            [
              {
                id: "MAT-CBL-045",
                assetType: "RJ45 Cable",
                category: "Material",
                location: "",
                barcode: "BC-RJ45-554321",
              },
              {
                id: "MAT-TRK-987",
                assetType: "Trunking",
                category: "Material",
                location: "",
                barcode: "BC-TRK-773216",
              },
              {
                id: "MAT-PVC-123",
                assetType: "PVC Pipe",
                category: "Material",
                location: "",
                barcode: "BC-PVC-445533",
              },
            ];

        const randomAsset = assets[Math.floor(Math.random() * assets.length)];
        const successData = {
          status: "success",
          ...randomAsset,
          message: `Success! ${
            isDevice ? "Serial Number" : "Barcode"
          } detected.`,
          inputType: "scan",
        };

        setScanResult(successData);
        addToCheckHistory(successData);
        setInputType(isDevice ? "serial" : "barcode");
      }
    }, 2000);
  };

  // Fungsi untuk manual check
  const handleManualCheck = (e) => {
    e.preventDefault();
    if (!manualInput) return;

    setScanResult("loading");
    setIsSubmitting(false);

    // Deteksi apakah input nomor seri atau barcode
    const isSerial = manualInput.toUpperCase().includes("NS-");
    const isBarcode = manualInput.toUpperCase().includes("BC-");
    setInputType(isSerial ? "serial" : isBarcode ? "barcode" : "");

    setTimeout(() => {
      if (manualInput.toUpperCase().includes("ERROR")) {
        const errorData = {
          status: "error",
          id: "INVALID-INPUT",
          jenisAset: "Tidak Valid",
          kategori: "Error",
          lokasi: "",
          message:
            "Format input tidak valid. Pastikan format nomor seri (NS-XXX) atau barcode (BC-XXX).",
          inputType: isSerial ? "serial" : "barcode",
        };

        setScanResult(errorData);
        addToCheckHistory(errorData);
      } else {
        const isPerangkat = isSerial || Math.random() < 0.5;
        const successData = isPerangkat
          ? {
              id: "PC-MAN-001",
              jenisAset: "Komputer",
              kategori: "Perangkat",
              lokasi: "",
              nomorSeri: manualInput,
            }
          : {
              id: "MAT-MAN-001",
              jenisAset: "Material",
              kategori: "Material",
              lokasi: "",
              barcode: manualInput,
            };
        const finalData = {
          status: "success",
          ...successData,
          message: `Valid! Manual input ${
            isPerangkat ? "serial number" : "barcode"
          } detected.`,
          inputType: isSerial ? "serial" : "barcode",
        };

        setScanResult(finalData);
        addToCheckHistory(finalData);
        setManualInput(""); // Reset input manual setelah berhasil
      }
    }, 1500);
  };

  // Fungsi untuk membuka modal lokasi dengan SweetAlert
  const handleOpenLocationModal = (scanData) => {
    let selectedLocation = scanData.lokasi || "";

    Swal.fire({
      title: `<div class="font-poppins text-lg font-semibold text-black">Select Asset Checking Location</div>`,
      html: `
  <div class="font-poppins text-left space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Select Location</label>
      <select 
        id="locationSelect" 
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
      >
        <option value="">Select location...</option>
        ${locationOptions
          .map(
            (location) =>
              `<option value="${location}" ${
                location === selectedLocation ? "selected" : ""
              }>${location}</option>`
          )
          .join("")}
      </select>
    </div>

    <div class="bg-gray-100 p-3 rounded-lg">
      <p class="text-sm text-blue-700">
        <strong>Data to be updated:</strong><br/>
        Asset: ${scanData.jenisAset}<br/>
        Category: ${scanData.kategori}<br/>
        ID: ${scanData.id}
      </p>
    </div>
  </div>
  `,
      width: "500px",
      padding: "8px",
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Save Location",
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#6b7280",
      reverseButtons: true,
      customClass: {
        popup: "rounded-xl font-poppins",
        confirmButton: "px-4 py-2 text-sm font-medium",
        cancelButton: "px-6 py-2 text-sm font-medium",
      },
      preConfirm: () => {
        const select = document.getElementById("locationSelect");
        const location = select.value;
        if (!location) {
          Swal.showValidationMessage("Please select a location first");
          return false;
        }
        return location;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedLocation = result.value;

        // Update data with selected location
        const updatedData = {
          ...scanData,
          lokasi: updatedLocation,
        };

        // Update check history with new location
        setCheckHistory((prev) =>
          prev.map((item) =>
            item.id === scanData.id ? { ...item, ...updatedData } : item
          )
        );

        // Tampilkan konfirmasi sukses
        Swal.fire({
          title: "Location Saved Successfully!",
          text: `Location ${updatedLocation} has been added to ${scanData.jenisAset}.`,
          icon: "success",
          confirmButtonColor: "#28a745",
          confirmButtonText: "OK",
          customClass: {
            popup: "font-poppins rounded-xl",
            confirmButton: "px-8 py-2 text-sm font-medium",
          },
        });
      }
    });
  };

  // Fungsi untuk menyimpan lokasi saja
  const handleSaveLocation = () => {
    if (!selectedLocation || !currentScanData) return;

    // Update data dengan lokasi yang dipilih
    const updatedData = {
      ...currentScanData,
      lokasi: selectedLocation,
    };

    // Update riwayat dengan lokasi baru
    setCheckHistory((prev) =>
      prev.map((item) =>
        item.id === currentScanData.id ? { ...item, ...updatedData } : item
      )
    );

    setShowLocationModal(false);
    setSelectedLocation("");
  };

  // Fungsi untuk submit data individual
  // Fungsi untuk submit data individual dengan SweetAlert
  const handleSubmitSingle = async (scanData) => {
    if (!scanData.lokasi) {
      Swal.fire({
        title: "Location Not Selected",
        text: "Please select a location before submitting the data.",
        icon: "warning",
        confirmButtonColor: "#2563eb",
        confirmButtonText: "OK",
        customClass: {
          popup: "font-poppins rounded-xl",
          confirmButton: "px-4 py-2 text-sm font-medium rounded-lg",
        },
      });
      return;
    }

    setIsSubmitting(true);

    // Show loading SweetAlert
    Swal.fire({
      title: "Sending Data...",
      text: `Submitting data for ${scanData.jenisAset}`,
      icon: "info",
      showConfirmButton: false,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
      customClass: {
        popup: "font-poppins rounded-xl",
      },
    });

    const submittedData = {
      ...scanData,
      uniqueCode: `V-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      status: "Pending Validation",
      submitted: true,
      submittedAt: new Date().toISOString(),
    };

    // Update riwayat dengan status submitted
    setCheckHistory((prev) =>
      prev.map((item) =>
        item.id === scanData.id ? { ...item, ...submittedData } : item
      )
    );

    console.log("Submitting Single Data:", submittedData);

    // Simulasi proses pengiriman
    setTimeout(() => {
      setIsSubmitting(false);

      // Tutup loading dan tampilkan sukses
      Swal.fire({
        title: "Successfully Sent!",
        html: `
    <div class="text-center">
   
      <p class="text-gray-700 font-grey-700 mb-2 mt-0">The data has been successfully sent for validation!</p>
      <div class="bg-gray-50 p-3 rounded-lg mt-3">
        <p class="text-sm text-gray-600"><strong>Data Details:</strong></p>
        <p class="text-xs text-gray-600">${submittedData.jenisAset} (${submittedData.id})</p>
        <p class="text-xs text-gray-600">Location: ${submittedData.lokasi}</p>
        <p class="text-xs text-blue-600 font-mono mt-1">Code: ${submittedData.uniqueCode}</p>
      </div>
    </div>
  `,
        icon: "success",
        confirmButtonColor: "#10B981",
        confirmButtonText: "Continue Scanning",
        customClass: {
          popup: "font-poppins rounded-xl",
          confirmButton: "px-6 py-2 text-sm font-medium rounded-lg",
        },
      });
    }, 1500);
  };

  // Fungsi untuk submit semua data dengan SweetAlert
  const handleSubmitAll = async () => {
    const dataToSubmit = checkHistory.filter(
      (item) => item.status === "Checked" && item.lokasi && !item.submitted
    );

    if (dataToSubmit.length === 0) {
      Swal.fire({
        title: "No Data Available",
        text: "There is no data ready to be submitted. Please make sure all items have a selected location.",
        icon: "info",
        confirmButtonColor: "#2563eb",
        confirmButtonText: "OK",
        customClass: {
          popup: "font-poppins rounded-xl",
          confirmButton: "px-4 py-2 text-sm font-medium rounded-lg",
        },
      });
      return;
    }

    setIsSubmittingAll(true);

    // Show loading SweetAlert
    Swal.fire({
      title: "Submitting All Data...",
      html: `
    <div class="text-center">
      <p class="text-gray-700 mb-2">Sending ${dataToSubmit.length} data item(s)...</p>
      <div class="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div class="bg-blue-600 h-2 rounded-full animate-pulse"></div>
      </div>
    </div>
  `,
      showConfirmButton: false,
      allowOutsideClick: false,
      customClass: {
        popup: "font-poppins rounded-xl",
      },
    });

    const submittedData = dataToSubmit.map((item) => ({
      ...item,
      uniqueCode: `V-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      status: "Pending Validation",
      submitted: true,
      submittedAt: new Date().toISOString(),
    }));

    // Update semua data yang dikirim
    setCheckHistory((prev) =>
      prev.map((item) => {
        const submittedItem = submittedData.find((sub) => sub.id === item.id);
        return submittedItem ? { ...item, ...submittedItem } : item;
      })
    );

    console.log("Submitting All Data:", submittedData);

    // Simulasi proses pengiriman
    setTimeout(() => {
      setIsSubmittingAll(false);

      // Close loading and show success
      Swal.fire({
        title: "All Data Successfully Submitted!",
        html: `
    <div class="text-center">
      <p class="text-gray-700 font-grey-700 mb-2 mt-0">${submittedData.length} data item(s) have been successfully submitted!</p>
      <div class="bg-gray-50 p-3 rounded-lg mt-3">
        <p class="text-sm text-gray-600"><strong>Details:</strong></p>
        <p class="text-xs text-gray-600">Total items: ${submittedData.length}</p>
        <p class="text-xs text-gray-600">Status: Awaiting Manager Validation</p>
      </div>
    </div>
  `,
        icon: "success",
        showCancelButton: true,
        confirmButtonColor: "#10B981",
        cancelButtonColor: "#6B7280",
        confirmButtonText: "View Verification",
        cancelButtonText: "Continue Scanning",
        reverseButtons: true,
        customClass: {
          popup: "font-poppins rounded-xl",
          confirmButton: "px-6 py-2 text-sm font-medium rounded-lg",
          cancelButton: "px-6 py-2 text-sm font-medium rounded-lg",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.setItem(
            "lastSubmittedScan",
            JSON.stringify(submittedData)
          );
          router.push("/validation-verification");
        }
      });
    }, 2000);
  };

  // Fungsi untuk menghapus data dari riwayat - PERBAIKAN
  const handleDeleteData = async (scanData) => {
    const result = await Swal.fire({
      title: `Delete ${scanData.jenisAset}?`,
      text: "Deleted data cannot be restored!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4CAF50",
      reverseButtons: true,
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "font-poppins rounded-xl",
        confirmButton: "px-4 py-2 text-sm font-medium",
        cancelButton: "px-4 py-2 text-sm font-medium",
      },
    });

    if (result.isConfirmed) {
      // Hapus data dari state dengan filter yang benar
      setCheckHistory((prev) => {
        const newHistory = prev.filter((item) => item.id !== scanData.id);

        // Update localStorage dengan data yang baru
        if (newHistory.length > 0) {
          localStorage.setItem("scanCheckHistory", JSON.stringify(newHistory));
        } else {
          // Jika tidak ada data lagi, hapus dari localStorage
          localStorage.removeItem("scanCheckHistory");
        }

        return newHistory;
      });

      // Tampilkan SweetAlert sukses
      Swal.fire({
        title: "Deleted Successfully!",
        text: `${scanData.jenisAset} (${scanData.id}) has been successfully deleted.`,
        icon: "success",
        confirmButtonColor: "#1e40af",
        confirmButtonText: "OK",
        customClass: {
          popup: "font-poppins rounded-xl",
          confirmButton: "px-4 py-2 text-sm font-medium rounded-lg",
        },
      });
    }
  };


  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-700 border-green-200";
      case "error":
        return "bg-red-100 text-red-700 border-red-200";
      case "Pending Validation":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Checked":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
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

  const getStatusText = (status) => {
    switch (status) {
      case "success":
        return "Berhasil";
      case "error":
        return "Error";
      case "Pending Validation":
        return "Terkirim";
      case "Checked":
        return "Dicek";
      default:
        return status;
    }
  };

  // Hitung data yang siap dikirim
  const readyToSubmitCount = checkHistory.filter(
    (item) => item.status === "Checked" && item.lokasi && !item.submitted
  ).length;

  return (
    <LayoutDashboard activeMenu={2}>
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-2 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-600 rounded-xl shadow-lg p-4 sm:p-6 text-white">
          <h1 className="text-xl sm:text-2xl font-semibold flex items-center">
            <ScanLine className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
            SCAN IT DEVICES & MATERIALS
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm mt-1 sm:mt-2">
            Scan IT devices or materials, select the location, and submit for
            verification. The checking data will be temporarily stored before
            being sent.
          </p>
        </div>

        {/* 1. Camera / Scanner Area */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3 sm:p-4 md:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
            <ScanLine className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
            Camera Scanner – Detect IT Devices & Materials
          </h2>

          <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center mb-4 sm:mb-6">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            ></video>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4/5 h-4/5 border-4 border-dashed border-white/50 rounded-lg"></div>
              {/* Red line removed */}
            </div>

            {cameraError && (
              <div className="absolute inset-0 bg-black/70 text-white text-center flex items-center justify-center p-3 sm:p-4">
                <div>
                  <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2" />
                  <p className="text-xs sm:text-sm">{cameraError}</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
            <div className="flex items-center">
              <Cpu className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-blue-600" />
              <span>
                Scan <strong>Serial Number</strong> for IT Devices
              </span>
            </div>
            <div className="flex items-center">
              <Cable className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-green-600" />
              <span>
                Scan <strong>Barcode</strong> for Materials
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleScan}
              className="flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-lg disabled:opacity-50 text-sm sm:text-base w-full sm:w-auto"
              disabled={scanResult === "loading" || isSubmitting}
            >
              {scanResult === "loading" ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Scanning in Progress...
                </>
              ) : (
                <>
                  <ScanLine className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Start Camera Scanning
                </>
              )}
            </button>
          </div>
        </div>

        {/* 2. Manual Input & Scan Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Manual Input */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
              <Clipboard className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-600" />
              Manual Input
            </h2>
            <form
              onSubmit={handleManualCheck}
              className="space-y-3 sm:space-y-4"
            >
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Enter Serial Number or Barcode
                </label>
                <input
                  type="text"
                  placeholder="Example: NS-PC-887632 or BC-RJ45-554321"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-xs sm:text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 transition disabled:opacity-50 text-sm"
                disabled={scanResult === "loading" || isSubmitting}
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Check Validity
              </button>
            </form>
          </div>

          {/* Latest Scan Result */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-400" />
              Latest Inspection Result
            </h2>

            {scanResult === "loading" && (
              <div className="text-center py-6 sm:py-8 text-gray-500">
                <svg
                  className="animate-spin mx-auto h-6 w-6 sm:h-8 sm:w-8 text-blue-500 mb-2 sm:mb-3"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <p className="font-medium text-sm sm:text-base">
                  Processing inspection...
                </p>
                <p className="text-xs sm:text-sm mt-1">
                  Detecting format and validity
                </p>
              </div>
            )}

            {scanResult && scanResult !== "loading" && (
              <div
                className={`p-3 sm:p-4 rounded-lg border-l-4 ${
                  scanResult.status === "success"
                    ? "bg-green-50 border-green-500"
                    : "bg-red-50 border-red-500"
                }`}
              >
                <div
                  className={`flex items-center mb-2 sm:mb-3 ${
                    scanResult.status === "success"
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  {scanResult.status === "success" ? (
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                  )}
                  <span className="font-bold text-base sm:text-lg capitalize">
                    {getStatusText(scanResult.status)}
                  </span>
                </div>

                <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Asset ID:</span>
                    <span className="font-bold text-gray-800 text-xs sm:text-sm">
                      {scanResult.id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Type:</span>
                    <span className="text-gray-800">
                      {scanResult.jenisAset}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Category:</span>
                    <span className="flex items-center">
                      {getCategoryIcon(scanResult.kategori)}
                      <span className="ml-1">{scanResult.kategori}</span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">
                      {inputType === "serial" ? "Serial Number:" : "Barcode:"}
                    </span>
                    <span className="font-mono text-blue-600 text-xs sm:text-sm">
                      {scanResult.nomorSeri || scanResult.barcode}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-gray-600 mt-2 sm:mt-3 border-t pt-2 sm:pt-3">
                  {scanResult.message}
                </p>
              </div>
            )}

            {!scanResult && scanResult !== "loading" && (
              <div className="text-center py-6 sm:py-8 text-gray-500">
                <Box className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 text-gray-400" />
                <p className="font-medium text-sm sm:text-base">
                  No inspection results yet
                </p>
                <p className="text-xs sm:text-sm mt-1">
                  Use the Camera Scanner or Manual Input
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 3. Recent Inspection History */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-600" />
              Recent Inspection History
            </h2>
            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto">
              <span className="text-xs sm:text-sm text-gray-500">
                {checkHistory.length} items
              </span>
              {readyToSubmitCount > 0 && (
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                  {readyToSubmitCount} ready to submit
                </span>
              )}
            </div>
          </div>

          {checkHistory.length === 0 ? (
            <div className="text-center py-6 sm:py-8 text-gray-500">
              <Box className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 text-gray-400" />
              <p className="font-medium text-sm sm:text-base">
                No inspection history yet
              </p>
              <p className="text-xs sm:text-sm mt-1">
                Use the camera scanner or manual input to start checking
              </p>
            </div>
          ) : (
            <>
              {/* Desktop View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="text-gray-500 uppercase text-xs border-b border-gray-200">
                      <th className="py-2 font-medium">Asset ID</th>
                      <th className="py-2 font-medium">Asset Type</th>
                      <th className="py-2 font-medium">Category</th>
                      <th className="py-2 font-medium">Location</th>
                      <th className="py-2 font-medium">Status</th>
                      <th className="py-2 font-medium">Date</th>
                      <th className="py-2 font-medium">Time</th>
                      <th className="py-2 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {checkHistory.map((item, index) => (
                      <tr
                        key={item.id}
                        className="border-b border-gray-100 hover:bg-gray-50 text-gray-800"
                      >
                        <td className="py-3 font-medium">
                          <div className="flex items-center">
                            {getCategoryIcon(item.kategori)}
                            <span className="ml-2 text-sm">{item.id}</span>
                          </div>
                        </td>
                        <td className="py-3 text-gray-600 text-sm">
                          {item.jenisAset}
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-1 text-xs rounded-full font-semibold ${
                              item.kategori === "Perangkat"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {item.kategori}
                          </span>
                        </td>
                        <td className="py-3 text-gray-600 text-sm">
                          {item.lokasi || (
                            <span className="text-orange-600 text-xs">
                              Not selected
                            </span>
                          )}
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-1 text-xs rounded-full font-semibold border ${getStatusColor(
                              item.status
                            )}`}
                          >
                            {getStatusText(item.status)}
                          </span>
                        </td>
                        <td className="py-3 text-gray-600 text-sm">
                          {item.tanggal}
                        </td>
                        <td className="py-3 text-gray-600 text-sm">
                          {item.waktu}
                        </td>
                        <td className="py-3">
                          <div className="flex space-x-1 sm:space-x-2">
                            <button
                              onClick={() => handleOpenLocationModal(item)}
                              className="flex items-center px-2 sm:px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition"
                              title="Select Location"
                            >
                              <MapPin className="w-3 h-3 mr-1" />
                              <span className="hidden sm:inline">Location</span>
                            </button>

                            {item.status === "Checked" && item.lokasi && (
                              <button
                                onClick={() => handleSubmitSingle(item)}
                                disabled={isSubmitting}
                                className="flex items-center px-2 sm:px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                                title="Submit Data"
                              >
                                <Send className="w-3 h-3 mr-1" />
                                <span className="hidden sm:inline">Submit</span>
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteData(item)}
                              className="flex items-center px-2 sm:px-3 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition"
                              title="Delete Data"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              <span className="hidden sm:inline">Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile & Tablet View */}
              <div className="md:hidden space-y-3">
                {checkHistory.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-200 rounded-lg p-3 bg-white hover:bg-gray-50 transition"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        {getCategoryIcon(item.kategori)}
                        <div className="font-bold text-sm text-gray-700 ml-2">
                          {item.id}
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-semibold border ${getStatusColor(
                          item.status
                        )}`}
                      >
                        {getStatusText(item.status)}
                      </span>
                    </div>

                    <div className="text-xs text-gray-600 space-y-1">
                      <div className="flex justify-between">
                        <span className="font-medium">Type:</span>{" "}
                        {item.jenisAset}
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Category:</span>
                        <span
                          className={`px-1 rounded text-xs ${
                            item.kategori === "Perangkat"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {item.kategori}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Location:</span>
                        {item.lokasi ? (
                          <span className="text-gray-800 text-right max-w-[120px] truncate">
                            {item.lokasi}
                          </span>
                        ) : (
                          <span className="text-orange-600 text-xs">
                            Not selected
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">
                          {item.nomorSeri ? "Serial Number:" : "Barcode:"}
                        </span>
                        <span className="font-mono text-blue-600 text-xs max-w-[100px] truncate">
                          {item.nomorSeri || item.barcode}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>{item.tanggal}</span>
                        <span>{item.waktu}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2 mt-3 pt-2 border-t border-gray-100">
                      <button
                        onClick={() => handleOpenLocationModal(item)}
                        className="flex-1 flex items-center justify-center px-2 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition"
                      >
                        <MapPin className="w-3 h-3 mr-1" />
                        Location
                      </button>

                      {item.status === "Checked" && item.lokasi && (
                        <button
                          onClick={() => handleSubmitSingle(item)}
                          disabled={isSubmitting}
                          className="flex-1 flex items-center justify-center px-2 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                        >
                          <Send className="w-3 h-3 mr-1" />
                          Submit
                        </button>
                      )}

                      <button
                        onClick={() => handleDeleteData(item)}
                        className="flex-1 flex items-center justify-center px-2 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Submit All Button */}
              {readyToSubmitCount > 0 && (
                <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200">
                  <button
                    onClick={handleSubmitAll}
                    disabled={isSubmittingAll}
                    className="w-full flex items-center justify-center px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 transition disabled:opacity-50 text-sm sm:text-base"
                  >
                    {isSubmittingAll ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending {readyToSubmitCount} items...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                        Submit All ({readyToSubmitCount} items)
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        {/* Location Selection Modal */}
        {showLocationModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-4 sm:p-6 mx-2">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                  Select Asset Inspection Location
                </h3>
                <button
                  onClick={() => setShowLocationModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    Choose Location
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">Select location...</option>
                    {locationOptions.map((location, index) => (
                      <option key={index} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bg-gray-100 p-2 sm:p-3 rounded-lg">
                  <p className="text-xs sm:text-sm text-blue-700">
                    <strong>Data to be updated:</strong>
                    <br />
                    Asset: {currentScanData?.jenisAset}
                    <br />
                    Category: {currentScanData?.kategori}
                    <br />
                    ID: {currentScanData?.id}
                  </p>
                </div>

                <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4">
                  <button
                    onClick={() => setShowLocationModal(false)}
                    className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveLocation}
                    disabled={!selectedLocation}
                    className="flex-1 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center text-sm"
                  >
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Save Location
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-4 sm:p-6 mx-2">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-red-600" />
                  Confirm Delete Data
                </h3>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <p className="text-gray-600 text-sm sm:text-base">
                  Are you sure you want to delete this inspection record?
                </p>

                <div className="bg-gray-100 p-2 sm:p-3 rounded-lg">
                  <p className="text-xs sm:text-sm text-red-700">
                    <strong>Data to be deleted:</strong>
                    <br />
                    ID: {dataToDelete?.id}
                    <br />
                    Type: {dataToDelete?.jenisAset}
                    <br />
                    Category: {dataToDelete?.kategori}
                    <br />
                    Status: {getStatusText(dataToDelete?.status)}
                  </p>
                </div>

                <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-3 sm:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center justify-center text-sm"
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Delete Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Success Modal */}
        {showDeleteSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-4 sm:p-6 mx-2">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600" />
                  Successfully Deleted
                </h3>
                <button
                  onClick={() => setShowDeleteSuccessModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="text-center">
                  <CheckCircle className="w-8 h-8 sm:w-12 sm:h-12 text-green-500 mx-auto mb-3 sm:mb-4" />
                  <p className="text-gray-700 font-medium text-sm sm:text-base">
                    The record has been successfully deleted from history!
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2">
                    {deletedDataInfo?.jenisAset} ({deletedDataInfo?.id})
                  </p>
                </div>

                <div className="flex justify-center pt-3 sm:pt-4">
                  <button
                    onClick={() => setShowDeleteSuccessModal(false)}
                    className="px-4 sm:px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center text-sm"
                  >
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    OK
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </LayoutDashboard>
  );
}
