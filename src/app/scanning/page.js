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
  Loader2,
} from "lucide-react";
import Swal from "sweetalert2";
import LayoutDashboard from "../components/LayoutDashboard";

export default function SerialScanningPage() {
  const [manualInput, setManualInput] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [inputType, setInputType] = useState("");
  const [checkHistory, setCheckHistory] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [currentScanData, setCurrentScanData] = useState(null);
  const [isSubmittingAll, setIsSubmittingAll] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isLoadingLocations, setIsLoadingLocations] = useState(false);
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [locationSearch, setLocationSearch] = useState("");
  const videoRef = useRef(null);

  const router = useRouter();

  // API Base URL
  const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

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

  // ============================================
  // FUNGSI UNTUK MENGAMBIL LOKASI DARI DATABASE
  // ============================================

  // Fungsi untuk mengambil data lokasi dari backend
  const fetchLocations = async (searchTerm = "") => {
    try {
      setIsLoadingLocations(true);
      let url = `${API_BASE_URL}/api/location/all`;
      
      if (searchTerm) {
        url = `${API_BASE_URL}/api/location/search?q=${encodeURIComponent(searchTerm)}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        // Format data lokasi untuk frontend
        const formattedLocations = data.locations.map(loc => ({
          value: loc.location_code,
          label: `${loc.area} - ${loc.location_name}`,
          fullData: loc
        }));
        
        setLocations(formattedLocations);
        setFilteredLocations(formattedLocations);
      } else {
        console.error("Failed to fetch locations:", data.error);
        // Fallback ke data dummy jika API gagal
        setFallbackLocations();
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
      // Fallback ke data dummy jika ada error
      setFallbackLocations();
    } finally {
      setIsLoadingLocations(false);
    }
  };

  // Data fallback jika API gagal
  const setFallbackLocations = () => {
    const fallbackLocations = [
      { value: "INF-JAR", label: "Infrastruktur & Jaringan" },
      { value: "WS-01", label: "Workshop 1" },
      { value: "WS-02", label: "Workshop 2" },
      { value: "RSV-L3", label: "Ruang Server L3" },
      { value: "KAN-L1", label: "Kantor Utama L1" },
      { value: "PG-MAIN", label: "Pintu Gerbang" },
      { value: "OFF-L2", label: "Main Office L2" },
      { value: "GUD-MAT", label: "Gudang Material" },
      { value: "OPC-CTR", label: "Operations Center" },
      { value: "FAC-AREA", label: "Facilities Area" },
    ];
    setLocations(fallbackLocations);
    setFilteredLocations(fallbackLocations);
  };

  // Load lokasi saat komponen mount
  useEffect(() => {
    fetchLocations();
  }, []);

  // Filter lokasi berdasarkan pencarian
  useEffect(() => {
    if (locationSearch) {
      const filtered = locations.filter(loc =>
        loc.label.toLowerCase().includes(locationSearch.toLowerCase())
      );
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations(locations);
    }
  }, [locationSearch, locations]);

  // Inisialisasi kamera
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
    if (scanData.status === "error" || scanData.id.includes("NO-DETECTION") || scanData.id.includes("ERROR")) {
      return null;
    }

    const newCheckItem = {
      id: scanData.id || `CHK-${Date.now()}`,
      timestamp: scanData.timestamp || new Date().toISOString(),
      tanggal: scanData.tanggal || new Date().toLocaleDateString("id-ID"),
      waktu: scanData.waktu || new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
      ...scanData,
      status: scanData.status || "Checked",
      submitted: scanData.submitted || false,
      lokasi: scanData.lokasi || "", // Kode lokasi
      lokasiLabel: scanData.lokasiLabel || "", // Label lokasi untuk display
    };

    setCheckHistory((prev) => [newCheckItem, ...prev]);
    return newCheckItem;
  };

  // ============================================
  // FUNGSI DETECTION DENGAN BACKEND YOLO
  // ============================================

  const handleCameraCapture = async () => {
    if (!videoRef.current) {
      Swal.fire({
        title: "Camera Error",
        text: "Camera not available. Please check camera permissions.",
        icon: "error",
        confirmButtonText: "OK",
      });
      return;
    }

    setIsDetecting(true);
    setScanResult("loading");

    try {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      const imageData = canvas.toDataURL("image/jpeg", 0.8);

      const response = await fetch(`${API_BASE_URL}/api/detect/camera`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image_data: imageData }),
      });

      const result = await response.json();

      if (result.success && result.detected_items && result.detected_items.length > 0) {
        const detectedItems = result.detected_items.map((item, index) => {
          const scanData = {
            id: item.id,
            jenisAset: item.asset_type,
            kategori: item.category,
            lokasi: item.location || "",
            lokasiLabel: "",
            nomorSeri: item.serial_number,
            brand: item.brand,
            confidence: item.confidence,
            confidencePercent: (item.confidence * 100).toFixed(1),
            inputType: "camera",
            status: "success",
            message: `Detected: ${item.asset_type} ${item.brand !== "N/A" ? `(${item.brand})` : ""} with ${(item.confidence * 100).toFixed(1)}% confidence`,
            timestamp: new Date().toISOString(),
            tanggal: new Date().toLocaleDateString("id-ID"),
            waktu: new Date().toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
            resultImageUrl: result.result_image_url,
            originalImageUrl: result.original_image_url,
          };

          return scanData;
        });

        detectedItems.forEach((item) => addToCheckHistory(item));

        if (detectedItems.length > 0) {
          setScanResult(detectedItems[0]);
        }

        Swal.fire({
          title: "Detection Complete!",
          html: `
            <div class="text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p class="text-lg font-semibold">Found ${result.total_detected} device(s)/material(s)</p>
              <div class="mt-3 space-y-1">
                ${detectedItems
                  .map(
                    (item) =>
                      `<p class="text-sm text-gray-600">• ${item.jenisAset} (${item.brand}) - ${item.confidencePercent}%</p>`
                  )
                  .join("")}
              </div>
            </div>
          `,
          icon: "success",
          confirmButtonText: "OK",
          customClass: {
            popup: "font-poppins rounded-xl",
            confirmButton: "px-6 py-2 text-sm font-medium rounded-lg bg-green-600 hover:bg-green-700",
          },
        });
      } else {
        const errorData = {
          status: "error",
          id: "NO-DETECTION",
          jenisAset: "No Device Detected",
          kategori: "Error",
          message: result.message || "No devices detected in the image. Please try again with better lighting.",
          inputType: "camera",
        };

        setScanResult(errorData);

        Swal.fire({
          title: "No Devices Detected",
          text: "Try to capture a clearer image with better lighting.",
          icon: "info",
          confirmButtonText: "Try Again",
        });
      }
    } catch (error) {
      console.error("Detection error:", error);

      const errorData = {
        status: "error",
        id: "DETECTION-ERROR",
        jenisAset: "Detection Failed",
        kategori: "Error",
        message: "Failed to process image. Please check if the backend server is running.",
        inputType: "camera",
      };

      setScanResult(errorData);

      Swal.fire({
        title: "Detection Failed",
        text: "Please make sure the backend server is running on port 5000.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsDetecting(false);
    }
  };

  // Fungsi untuk manual check
  const handleManualCheck = (e) => {
    e.preventDefault();
    if (!manualInput) return;

    setScanResult("loading");
    setIsSubmitting(false);

    const isSerial = manualInput.toUpperCase().includes("NS-");
    const isBarcode = manualInput.toUpperCase().includes("BC-");
    setInputType(isSerial ? "serial" : isBarcode ? "barcode" : "");

    setTimeout(() => {
      if (manualInput.toUpperCase().includes("ERROR")) {
        const errorData = {
          status: "error",
          id: "INVALID-INPUT",
          jenisAset: "Invalid Input",
          kategori: "Error",
          lokasi: "",
          brand: "N/A",
          confidencePercent: "0",
          message: "Format input tidak valid. Pastikan format nomor seri (NS-XXX) atau barcode (BC-XXX).",
          inputType: isSerial ? "serial" : "barcode",
        };

        setScanResult(errorData);
      } else {
        const isPerangkat = isSerial || Math.random() < 0.5;
        const successData = isPerangkat
          ? {
              id: `PC-MAN-${Date.now().toString().slice(-6)}`,
              jenisAset: "Komputer",
              kategori: "Perangkat",
              lokasi: "",
              lokasiLabel: "",
              nomorSeri: manualInput,
              brand: Math.random() > 0.5 ? "Dell" : "HP",
              confidencePercent: "95.0",
            }
          : {
              id: `MAT-MAN-${Date.now().toString().slice(-6)}`,
              jenisAset: "Material",
              kategori: "Material",
              lokasi: "",
              lokasiLabel: "",
              barcode: manualInput,
              brand: "N/A",
              confidencePercent: "98.0",
            };
        const finalData = {
          status: "success",
          ...successData,
          message: `Valid! Manual input ${isPerangkat ? "serial number" : "barcode"} detected.`,
          inputType: isSerial ? "serial" : "barcode",
        };

        setScanResult(finalData);
        addToCheckHistory(finalData);
        setManualInput("");
      }
    }, 1500);
  };

  // ============================================
  // FUNGSI SET LOCATION UNTUK SEMUA ITEM
  // ============================================

  const handleSetLocationForAll = async () => {
    const itemsWithoutLocation = checkHistory.filter(
      (item) => !item.lokasi && item.status !== "error"
    );

    if (itemsWithoutLocation.length === 0) {
      Swal.fire({
        title: "All Items Scanning Have Location",
        text: "All detected items already have location assigned.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return;
    }

    // Tampilkan modal dengan data lokasi dari database
    const { value: location } = await Swal.fire({
      title: `<div class="font-poppins text-lg font-semibold text-black">Set Location Scanning for All Items</div>`,
      html: `
        <div class="font-poppins text-left space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Select Location for ${itemsWithoutLocation.length} items
            </label>
            
            <div class="relative">
              <input 
                type="text" 
                id="locationSearchInput"
                placeholder="Search location..." 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm mb-2"
                oninput="document.getElementById('locationSelectAll').dispatchEvent(new Event('input'))"
              />
              
              <select 
                id="locationSelectAll" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                size="5"
              >
                <option value="">Select location...</option>
                ${locations
                  .map((location) => 
                    `<option value="${location.value}" data-label="${location.label}">${location.label}</option>`
                  )
                  .join("")}
              </select>
              
              ${
                isLoadingLocations 
                  ? `<div class="text-center py-2 text-sm text-gray-500">
                      <Loader2 class="w-4 h-4 animate-spin inline mr-1" />
                      Loading locations...
                    </div>`
                  : ""
              }
            </div>
          </div>

          <div class="bg-gray-100 p-3 rounded-lg">
            <p class="text-sm text-blue-700">
              <strong>Items to be updated:</strong><br/>
              <span class="text-xs">
                ${itemsWithoutLocation
                  .map((item) => `• ${item.jenisAset} (${item.id})`)
                  .join("<br/>")}
              </span>
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
      confirmButtonText: "Apply to All Items",
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#6b7280",
      reverseButtons: true,
      customClass: {
        popup: "rounded-xl font-poppins",
        confirmButton: "px-4 py-2 text-sm font-medium",
        cancelButton: "px-6 py-2 text-sm font-medium",
      },
      didOpen: () => {
        // Tambahkan event listener untuk pencarian
        const searchInput = document.getElementById('locationSearchInput');
        const select = document.getElementById('locationSelectAll');
        
        if (searchInput) {
          searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const options = select.querySelectorAll('option');
            
            options.forEach(option => {
              if (option.value === '') return;
              const label = option.textContent.toLowerCase();
              option.style.display = label.includes(searchTerm) ? '' : 'none';
            });
          });
        }
      },
      preConfirm: () => {
        const select = document.getElementById('locationSelectAll');
        const selectedOption = select.options[select.selectedIndex];
        const locationCode = select.value;
        const locationLabel = selectedOption ? selectedOption.getAttribute('data-label') : '';
        
        if (!locationCode) {
          Swal.showValidationMessage("Please select a location first");
          return false;
        }
        return { locationCode, locationLabel };
      },
    });

    if (location) {
      // Update semua item yang belum memiliki lokasi
      const updatedHistory = checkHistory.map((item) => {
        if (!item.lokasi && item.status !== "error") {
          return { 
            ...item, 
            lokasi: location.locationCode,
            lokasiLabel: location.locationLabel
          };
        }
        return item;
      });

      setCheckHistory(updatedHistory);

      // Tampilkan konfirmasi sukses
      Swal.fire({
        title: "Location Applied Successfully!",
        html: `
          <div class="text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p class="text-lg font-semibold">Location set for ${itemsWithoutLocation.length} items</p>
            <p class="text-sm text-gray-600">Location: <strong>${location.locationLabel}</strong></p>
            <p class="text-xs text-gray-500">Code: ${location.locationCode}</p>
          </div>
        `,
        icon: "success",
        confirmButtonColor: "#28a745",
        confirmButtonText: "OK",
        customClass: {
          popup: "font-poppins rounded-xl",
          confirmButton: "px-8 py-2 text-sm font-medium",
        },
      });
    }
  };

  // ============================================
  // FUNGSI SET LOCATION UNTUK SATU ITEM
  // ============================================

  const handleSetLocationForItem = async (item) => {
    const { value: location } = await Swal.fire({
      title: `<div class="font-poppins text-lg font-semibold text-black">Set Location for ${item.jenisAset}</div>`,
      html: `
        <div class="font-poppins text-left space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Select Location
            </label>
            
            <div class="relative">
              <input 
                type="text" 
                id="locationSearchInputSingle"
                placeholder="Search location..." 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm mb-2"
              />
              
              <select 
                id="locationSelectSingle" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                size="5"
              >
                <option value="">Select location...</option>
                ${locations
                  .map((location) => 
                    `<option value="${location.value}" data-label="${location.label}">${location.label}</option>`
                  )
                  .join("")}
              </select>
              
              ${
                isLoadingLocations 
                  ? `<div class="text-center py-2 text-sm text-gray-500">
                      <Loader2 class="w-4 h-4 animate-spin inline mr-1" />
                      Loading locations...
                    </div>`
                  : ""
              }
            </div>
          </div>

          <div class="bg-gray-100 p-3 rounded-lg">
            <p class="text-sm text-blue-700">
              <strong>Item Details:</strong><br/>
              <span class="text-xs">
                • ${item.jenisAset} (${item.id})<br/>
                • Brand: ${item.brand || "N/A"}<br/>
                • Category: ${item.kategori}
              </span>
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
      confirmButtonText: "Apply Location",
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#6b7280",
      reverseButtons: true,
      customClass: {
        popup: "rounded-xl font-poppins",
        confirmButton: "px-4 py-2 text-sm font-medium",
        cancelButton: "px-6 py-2 text-sm font-medium",
      },
      didOpen: () => {
        const searchInput = document.getElementById('locationSearchInputSingle');
        const select = document.getElementById('locationSelectSingle');
        
        if (searchInput && select) {
          searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const options = select.querySelectorAll('option');
            
            options.forEach(option => {
              if (option.value === '') return;
              const label = option.textContent.toLowerCase();
              option.style.display = label.includes(searchTerm) ? '' : 'none';
            });
          });
        }
      },
      preConfirm: () => {
        const select = document.getElementById('locationSelectSingle');
        const selectedOption = select.options[select.selectedIndex];
        const locationCode = select.value;
        const locationLabel = selectedOption ? selectedOption.getAttribute('data-label') : '';
        
        if (!locationCode) {
          Swal.showValidationMessage("Please select a location first");
          return false;
        }
        return { locationCode, locationLabel };
      },
    });

    if (location) {
      // Update item dengan lokasi baru
      const updatedHistory = checkHistory.map((historyItem) => {
        if (historyItem.id === item.id) {
          return { 
            ...historyItem, 
            lokasi: location.locationCode,
            lokasiLabel: location.locationLabel
          };
        }
        return historyItem;
      });

      setCheckHistory(updatedHistory);

      Swal.fire({
        title: "Location Applied Successfully!",
        html: `
          <div class="text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p class="text-sm text-gray-600">Location set for <strong>${item.jenisAset}</strong></p>
            <p class="text-sm text-gray-600">Location: <strong>${location.locationLabel}</strong></p>
            <p class="text-xs text-gray-500">Code: ${location.locationCode}</p>
          </div>
        `,
        icon: "success",
        confirmButtonColor: "#28a745",
        confirmButtonText: "OK",
        customClass: {
          popup: "font-poppins rounded-xl",
          confirmButton: "px-8 py-2 text-sm font-medium",
        },
      });
    }
  };

  // ============================================
  // FUNGSI SUBMIT DATA KE BACKEND
  // ============================================

  const handleSubmitSingle = async (scanData) => {
    if (!scanData.lokasi) {
      Swal.fire({
        title: "Location Not Selected",
        text: "Please set location before submitting the data.",
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

    try {
      // Kirim ke API untuk assign lokasi
      const response = await fetch(`${API_BASE_URL}/api/location/assign-multiple`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          asset_ids: [scanData.id],
          location_code: scanData.lokasi,
          scanned_by: "Scanner User", // Ganti dengan user yang login
          notes: `Submitted via scanning app - ${scanData.jenisAset}`
        }),
      });

      const result = await response.json();

      if (result.success) {
        const submittedData = {
          ...scanData,
          uniqueCode: `V-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          status: "Pending Validation",
          submitted: true,
          submittedAt: new Date().toISOString(),
        };

        // Update riwayat
        setCheckHistory((prev) =>
          prev.map((item) =>
            item.id === scanData.id ? { ...item, ...submittedData } : item
          )
        );

        Swal.fire({
          title: "Successfully Sent!",
          html: `
            <div class="text-center">
              <p class="text-gray-700 font-grey-700 mb-2 mt-0">The data has been successfully sent for validation!</p>
              <div class="bg-gray-50 p-3 rounded-lg mt-3">
                <p class="text-sm text-gray-600"><strong>Data Details:</strong></p>
                <p class="text-xs text-gray-600">${scanData.jenisAset} (${scanData.id})</p>
                <p class="text-xs text-gray-600">Location: ${scanData.lokasiLabel || scanData.lokasi}</p>
                <p class="text-xs text-gray-600">Status: ${result.message}</p>
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
      } else {
        throw new Error(result.message || "Failed to submit data");
      }
    } catch (error) {
      console.error("Submission error:", error);
      Swal.fire({
        title: "Submission Failed",
        text: error.message || "Failed to submit data. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fungsi untuk submit semua data
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

    try {
      // Kirim ke API untuk assign multiple assets
      const response = await fetch(`${API_BASE_URL}/api/location/assign-multiple`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          asset_ids: dataToSubmit.map(item => item.id),
          location_code: dataToSubmit[0].lokasi, // Asumsi semua memiliki lokasi yang sama
          scanned_by: "Scanner User", // Ganti dengan user yang login
          notes: `Batch submission via scanning app - ${dataToSubmit.length} items`
        }),
      });

      const result = await response.json();

      if (result.success) {
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

        Swal.fire({
          title: "All Data Successfully Submitted!",
          html: `
            <div class="text-center">
              <p class="text-gray-700 font-grey-700 mb-2 mt-0">${result.success_count} data item(s) have been successfully submitted!</p>
              <div class="bg-gray-50 p-3 rounded-lg mt-3">
                <p class="text-sm text-gray-600"><strong>Details:</strong></p>
                <p class="text-xs text-gray-600">Total items: ${dataToSubmit.length}</p>
                <p class="text-xs text-gray-600">Success: ${result.success_count}</p>
                <p class="text-xs text-gray-600">Failed: ${result.failed_count || 0}</p>
                <p class="text-xs text-gray-600">Status: Awaiting Manager Validation</p>
              </div>
            </div>
          `,
          icon: "success",
          showCancelButton: true,
          confirmButtonColor: "#20a051ff",
          cancelButtonColor: "#374151",
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
            localStorage.setItem("lastSubmittedScan", JSON.stringify(submittedData));
            router.push("/validation-verification");
          }
        });
      } else {
        throw new Error(result.message || "Failed to submit data");
      }
    } catch (error) {
      console.error("Batch submission error:", error);
      Swal.fire({
        title: "Submission Failed",
        text: error.message || "Failed to submit data. Please try again.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsSubmittingAll(false);
    }
  };

  // ============================================
  // FUNGSI DELETE DATA
  // ============================================

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
      setCheckHistory((prev) => {
        const newHistory = prev.filter((item) => item.id !== scanData.id);

        if (newHistory.length > 0) {
          localStorage.setItem("scanCheckHistory", JSON.stringify(newHistory));
        } else {
          localStorage.removeItem("scanCheckHistory");
        }

        return newHistory;
      });

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

  const handleDeleteAll = async () => {
    if (checkHistory.length === 0) return;

    const result = await Swal.fire({
      title: "Delete All Detection Results?",
      html: `
        <div class="text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
          <p class="text-gray-700">You are about to delete <strong>${checkHistory.length} items</strong> from detection history.</p>
          <p class="text-sm text-red-600 mt-2">This action cannot be undone!</p>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete all!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      customClass: {
        popup: "font-poppins rounded-xl",
        confirmButton: "px-6 py-2 text-sm font-medium rounded-lg",
        cancelButton: "px-6 py-2 text-sm font-medium rounded-lg",
      },
    });

    if (result.isConfirmed) {
      setCheckHistory([]);
      localStorage.removeItem("scanCheckHistory");
      setScanResult(null);

      Swal.fire({
        title: "All Data Deleted!",
        text: `${checkHistory.length} items have been removed from history.`,
        icon: "success",
        confirmButtonColor: "#10b981",
        confirmButtonText: "OK",
        customClass: {
          popup: "font-poppins rounded-xl",
          confirmButton: "px-6 py-2 text-sm font-medium rounded-lg",
        },
      });
    }
  };

  // Helper functions
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
        return "Success";
      case "error":
        return "Error";
      case "Pending Validation":
        return "Pending Validation";
      case "Checked":
        return "Checked";
      default:
        return status;
    }
  };

  // Hitung data yang siap dikirim
  const readyToSubmitCount = checkHistory.filter(
    (item) => item.status === "Checked" && item.lokasi && !item.submitted
  ).length;

  // Filter hanya item yang bukan error
  const validCheckHistory = checkHistory.filter(
    (item) => !item.id.includes("NO-DETECTION") && 
               !item.id.includes("ERROR") && 
               !item.id.includes("INVALID")
  );

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
            Scan IT devices or materials using camera, select the location for all items, and submit for verification.
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
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-red-500/50 animate-pulse"></div>
              <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-red-500/50 animate-pulse"></div>
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

          <button
            onClick={handleCameraCapture}
            className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-lg disabled:opacity-50 text-sm"
            disabled={isDetecting || scanResult === "loading"}
          >
            {isDetecting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                Detecting Devices...
              </>
            ) : (
              <>
                <Camera className="w-4 h-4 mr-2" />
                Capture & Detect
              </>
            )}
          </button>
        </div>

        {/* 2. Manual Input & Scan Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Manual Input */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
              <Clipboard className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-600" />
              Manual Input (Simulation)
            </h2>
            <form
              onSubmit={handleManualCheck}
              className="space-y-3 sm:space-y-4"
            >
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  Enter Serial Number or Barcode (Simulation)
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
                Check Validity (Simulate)
              </button>
            </form>
          </div>

          {/* Latest Scan Result */}
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-400" />
              Latest Detection Result
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
                  Processing detection...
                </p>
                <p className="text-xs sm:text-sm mt-1">
                  Analyzing image with YOLO model
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
                    <span className="font-medium text-gray-600">Brand:</span>
                    <span className="text-blue-600 font-medium">
                      {scanResult.brand || "N/A"}
                    </span>
                  </div>
                  {scanResult.confidencePercent && scanResult.confidencePercent !== "N/A" && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">
                        Confidence:
                      </span>
                      <span className="font-bold text-green-600">
                        {scanResult.confidencePercent}%
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-gray-600 mt-2 sm:mt-3 border-t pt-2 sm:pt-3">
                  {scanResult.message}
                </p>
              </div>
            )}

            {!scanResult && scanResult !== "loading" && (
              <div className="text-center py-6 sm:py-8 text-gray-500">
                <Camera className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 text-gray-400" />
                <p className="font-medium text-sm sm:text-base">
                  No detection results yet
                </p>
                <p className="text-xs sm:text-sm mt-1">
                  Use the Camera Capture to detect devices
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 3. Recent Inspection History */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 gap-2">
            <div className="flex items-center">
              <h2 className="text-base sm:text-lg font-semibold text-gray-800 flex items-center">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-gray-600" />
                Recent Detection History
              </h2>
            </div>
            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-2">
              <div className="flex gap-2">
                {/* Tombol Set Location for All */}
                <button
                  onClick={handleSetLocationForAll}
                  className="flex items-center px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition"
                  title="Set Location for All Items"
                  disabled={validCheckHistory.length === 0 || isLoadingLocations}
                >
                  {isLoadingLocations ? (
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  ) : (
                    <MapPin className="w-3 h-3 mr-1" />
                  )}
                  Set Location Scanning for All
                </button>

                {/* Tombol Delete All */}
                {validCheckHistory.length > 0 && (
                  <button
                    onClick={handleDeleteAll}
                    className="flex items-center px-3 py-1.5 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition"
                    title="Delete All History"
                  >
                    <Trash2 className="w-3 h-3 mr-1" />
                    Delete All Items
                  </button>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-gray-500">
                  {validCheckHistory.length} items
                </span>
                {readyToSubmitCount > 0 && (
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                    {readyToSubmitCount} ready to submit
                  </span>
                )}
              </div>
            </div>
          </div>

          {validCheckHistory.length === 0 ? (
            <div className="text-center py-6 sm:py-8 text-gray-500">
              <Box className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 text-gray-400" />
              <p className="font-medium text-sm sm:text-base">
                No detection history yet
              </p>
              <p className="text-xs sm:text-sm mt-1">
                Use the camera scanner or manual input to start
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
                      <th className="py-2 font-medium">Brand</th>
                      <th className="py-2 font-medium">Confidence</th>
                      <th className="py-2 font-medium">Scan Location</th>
                      <th className="py-2 font-medium">Status</th>
                      <th className="py-2 font-medium">Date</th>
                      <th className="py-2 font-medium">Time</th>
                      <th className="py-2 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {validCheckHistory.map((item) => (
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
                          <span className="font-medium text-blue-600">
                            {item.brand || "N/A"}
                          </span>
                        </td>
                        <td className="py-3">
                          <span
                            className={`px-2 py-1 text-xs rounded-full font-semibold ${
                              item.confidencePercent >= 80
                                ? "bg-green-100 text-green-700"
                                : item.confidencePercent >= 60
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {item.confidencePercent || "N/A"}%
                          </span>
                        </td>
                        <td className="py-3 text-gray-600 text-sm">
                          {item.lokasiLabel || item.lokasi ? (
                            <div className="max-w-[150px] truncate" title={item.lokasiLabel || item.lokasi}>
                              {item.lokasiLabel || item.lokasi}
                            </div>
                          ) : (
                            <button
                              onClick={() => handleSetLocationForItem(item)}
                              className="text-xs text-orange-600 hover:text-orange-700 font-medium flex items-center"
                            >
                              <MapPin className="w-3 h-3 mr-1" />
                              Set Location
                            </button>
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
                {validCheckHistory.map((item) => (
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
                        <span className="font-medium">Brand:</span>
                        <span className="text-blue-600 font-medium">
                          {item.brand || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Confidence:</span>
                        <span className="font-bold text-green-600">
                          {item.confidencePercent}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Location:</span>
                        {item.lokasiLabel || item.lokasi ? (
                          <span className="text-gray-800 text-right max-w-[120px] truncate">
                            {item.lokasiLabel || item.lokasi}
                          </span>
                        ) : (
                          <button
                            onClick={() => handleSetLocationForItem(item)}
                            className="text-xs text-orange-600 hover:text-orange-700 font-medium flex items-center"
                          >
                            <MapPin className="w-3 h-3 mr-1" />
                            Set Location
                          </button>
                        )}
                      </div>
                      <div className="flex justify-between text-gray-400">
                        <span>{item.tanggal}</span>
                        <span>{item.waktu}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2 mt-3 pt-2 border-t border-gray-100">
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
      </div>
    </LayoutDashboard>
  );
}