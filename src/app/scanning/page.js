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
  Hash,
  Info,
  Barcode,
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
  const [isScanningSerial, setIsScanningSerial] = useState(false);
  const [selectedDeviceForSerial, setSelectedDeviceForSerial] = useState(null);
  const [serialScanResult, setSerialScanResult] = useState(null);
  const [isDetectingSerial, setIsDetectingSerial] = useState(false);
  
  const videoRef = useRef(null);
  const serialVideoRef = useRef(null);

  const router = useRouter();

  // API Base URL
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

  useEffect(() => {
    const savedHistory = localStorage.getItem("scanCheckHistory");
    if (savedHistory) {
      setCheckHistory(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    if (checkHistory.length > 0) {
      localStorage.setItem("scanCheckHistory", JSON.stringify(checkHistory));
    }
  }, [checkHistory]);

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
        const formattedLocations = data.locations.map(loc => ({
          value: loc.location_code,
          label: `${loc.area} - ${loc.location_name}`,
          fullData: loc
        }));
        
        setLocations(formattedLocations);
        setFilteredLocations(formattedLocations);
      } else {
        console.error("Failed to fetch locations:", data.error);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    } finally {
      setIsLoadingLocations(false);
    }
  };

  // Load lokasi saat komponen mount
  useEffect(() => {
    fetchLocations();
  }, []);

  // Inisialisasi kamera utama
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

  // Fungsi untuk menambah/memperbarui data ke riwayat
  const updateCheckHistory = (scanData) => {
    if (scanData.status === "error" || scanData.id.includes("NO-DETECTION") || scanData.id.includes("ERROR")) {
      return null;
    }

    setCheckHistory((prev) => {
      // Cek apakah device sudah ada di history
      const existingIndex = prev.findIndex(item => item.id === scanData.id);
      
      if (existingIndex >= 0) {
        // Update device yang sudah ada
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          ...scanData,
          updatedAt: new Date().toISOString()
        };
        return updated;
      } else {
        // Tambah device baru
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
          lokasi: scanData.lokasi || "",
          lokasiLabel: scanData.lokasiLabel || "",
        };
        return [newCheckItem, ...prev];
      }
    });
  };

  // ============================================
  // FUNGSI DETECTION PERANGKAT
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
            nomorSeri: item.serial_number || "",
            brand: item.brand,
            confidence: item.confidence,
            confidencePercent: (item.confidence * 100).toFixed(1),
            inputType: "camera",
            status: "device_detected", // Status baru
            message: `Detected: ${item.asset_type} ${item.brand !== "N/A" ? `(${item.brand})` : ""}`,
            timestamp: new Date().toISOString(),
            tanggal: new Date().toLocaleDateString("id-ID"),
            waktu: new Date().toLocaleTimeString("id-ID", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }),
            resultImageUrl: result.result_image_url,
            originalImageUrl: result.original_image_url,
            needsSerialScan: true 
          };

          return scanData;
        });

        detectedItems.forEach((item) => updateCheckHistory(item));

        if (detectedItems.length > 0) {
          setScanResult(detectedItems[0]);
        }

        Swal.fire({
          title: "Device Detection Complete!",
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
              <p class="text-sm text-blue-600 mt-4">Do you want to scan serial numbers?</p>
            </div>
          `,
          icon: "success",
          showCancelButton: true,
          confirmButtonText: "Scan Serial Numbers",
          cancelButtonText: "Skip for Now",
          customClass: {
            popup: "font-poppins rounded-xl",
            confirmButton: "px-6 py-2 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700",
            cancelButton: "px-6 py-2 text-sm font-medium rounded-lg bg-gray-600 hover:bg-gray-700",
          },
        }).then((result) => {
          if (result.isConfirmed) {
            // Tampilkan pilihan device untuk scanning serial
            showDeviceSelectionForSerial(detectedItems);
          }
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

  // ============================================
  // FUNGSI SCANNING SERIAL NUMBER
  // ============================================
  const showDeviceSelectionForSerial = (devices) => {
    const deviceOptions = devices.map(device => 
      `<option value="${device.id}">${device.jenisAset} (${device.brand}) - ${device.id}</option>`
    ).join('');

    Swal.fire({
      title: "Select Device for Serial Scan",
      html: `
        <div class="text-left space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Select which device to scan serial number:
            </label>
            <select 
              id="deviceSelect" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              ${deviceOptions}
            </select>
          </div>
          <p class="text-sm text-gray-600">
            <Barcode class="w-4 h-4 inline mr-1" />
            Position the camera close to the serial number sticker/barcode
          </p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Start Serial Scan",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "font-poppins rounded-xl",
        confirmButton: "px-6 py-2 text-sm font-medium rounded-lg bg-green-600 hover:bg-green-700",
        cancelButton: "px-6 py-2 text-sm font-medium rounded-lg bg-gray-600 hover:bg-gray-700",
      },
      preConfirm: () => {
        const select = document.getElementById('deviceSelect');
        const deviceId = select.value;
        const selectedDevice = devices.find(d => d.id === deviceId);
        
        if (!deviceId) {
          Swal.showValidationMessage("Please select a device");
          return false;
        }
        return selectedDevice;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        startSerialScanning(result.value);
      }
    });
  };

  const startSerialScanning = (device) => {
    setSelectedDeviceForSerial(device);
    setIsScanningSerial(true);
    
    // Inisialisasi kamera untuk serial scan
    setTimeout(() => {
      initializeSerialCamera();
    }, 100);
  };

  const initializeSerialCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      if (serialVideoRef.current) {
        serialVideoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Failed to access serial camera:", err);
      Swal.fire({
        title: "Camera Error",
        text: "Unable to access the camera for serial scanning.",
        icon: "error",
        confirmButtonText: "OK",
      });
      setIsScanningSerial(false);
    }
  };

const handleSerialCapture = async () => {
  if (!serialVideoRef.current) return;

  setIsDetectingSerial(true);
  setSerialScanResult("loading");

  try {
    const canvas = document.createElement("canvas");
    canvas.width = serialVideoRef.current.videoWidth;
    canvas.height = serialVideoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(serialVideoRef.current, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/jpeg", 1.0); // Kualitas maksimal

    // 1. Coba gunakan advanced OCR terlebih dahulu
    const advancedResult = await extractSerialAdvanced(imageData);
    
    if (advancedResult && advancedResult.serialNumber) {
      // Advanced OCR berhasil
      const detection = {
        detected_text: advancedResult.serialNumber,
        confidence: advancedResult.confidence,
        brand_info: "",
        extracted_details: {
          method: advancedResult.method,
          original_text: advancedResult.originalText
        }
      };
      
      // Extract brand dari device yang sudah terdeteksi
      let extractedBrand = selectedDeviceForSerial.brand;
      
      // Update device dengan hasil yang lebih akurat
      const updatedDevice = {
        ...selectedDeviceForSerial,
        nomorSeri: advancedResult.serialNumber,
        brand: extractedBrand,
        brandDetails: "",
        status: "serial_scanned",
        message: `Serial number detected: ${advancedResult.serialNumber}`,
        confidencePercent: (advancedResult.confidence * 100).toFixed(1),
        serialConfidence: advancedResult.confidence,
        extractionMethod: advancedResult.method,
        extractedDetails: {
          method: advancedResult.method,
          original_text: advancedResult.originalText
        }
      };
      
      // Update history
      updateCheckHistory(updatedDevice);
      
      setSerialScanResult({
        status: "success",
        serialNumber: advancedResult.serialNumber,
        confidence: advancedResult.confidence,
        brand: extractedBrand,
        brandDetails: "",
        device: selectedDeviceForSerial.jenisAset,
        method: advancedResult.method
      });

      // Tampilkan modal dengan hasil advanced OCR
      Swal.fire({
        title: "Serial Number Detected!",
        html: `
          <div class="text-center">
            <Hash className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p class="text-lg font-semibold">✓ Advanced Serial Detection</p>
            <div class="bg-gray-50 p-4 rounded-lg mt-3 space-y-2">
              <div class="text-left">
                <p class="text-sm text-gray-600"><strong>Device:</strong> ${selectedDeviceForSerial.jenisAset}</p>
                <p class="text-sm text-gray-600"><strong>Brand:</strong> ${extractedBrand}</p>
                <p class="text-sm text-gray-600"><strong>Method:</strong> ${advancedResult.method}</p>
              </div>
              <div class="my-3">
                <p class="text-xs text-gray-500 mb-1">Extracted Serial Number:</p>
                <p class="text-2xl font-mono text-blue-600 bg-white p-3 rounded border-2 border-blue-300">
                  ${advancedResult.serialNumber}
                </p>
              </div>
              <div class="text-sm text-gray-500">
                <p>Confidence: ${(advancedResult.confidence * 100).toFixed(1)}%</p>
                ${advancedResult.originalText ? 
                  `<p class="mt-2 text-xs text-gray-600"><strong>Original Text:</strong> ${advancedResult.originalText}</p>` : ''}
              </div>
            </div>
          </div>
        `,
        icon: "success",
        showCancelButton: true,
        confirmButtonText: "Scan Another Device",
        cancelButtonText: "Done",
        customClass: {
          popup: "font-poppins rounded-xl",
          title: "text-lg font-semibold",
          confirmButton: "px-6 py-2 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700",
          cancelButton: "px-6 py-2 text-sm font-medium rounded-lg bg-green-600 hover:bg-green-700",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          // Reset untuk scanning serial lagi
          setSelectedDeviceForSerial(null);
          setSerialScanResult(null);
        } else {
          setIsScanningSerial(false);
        }
      });
      
    } else {
      // 2. Fallback ke metode lama jika advanced OCR gagal
      const response = await fetch(`${API_BASE_URL}/api/serial/detect/camera`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image_data: imageData }),
      });

      const result = await response.json();

      if (result.success && result.serial_detections && result.serial_detections.length > 0) {
        // Filter hanya serial yang valid
        const validSerials = result.serial_detections.filter(s => s.is_valid);
        
        if (validSerials.length > 0) {
          // Ambil deteksi dengan confidence tertinggi
          const detection = validSerials.sort((a, b) => b.confidence - a.confidence)[0];
          const detectedSerial = detection.detected_text;
          const brandInfo = detection.brand_info || "";
          
          // Extract brand dari brand_info jika ada
          let extractedBrand = selectedDeviceForSerial.brand;
          if (brandInfo) {
            // Cari brand dari brand_info
            const brands = ["ANVIZ", "DELL", "HP", "LENOVO", "ASUS", "ACER", "SAMSUNG"];
            for (const brand of brands) {
              if (brandInfo.toUpperCase().includes(brand)) {
                extractedBrand = brand;
                break;
              }
            }
          }
          
          // Update device dengan serial number dan brand yang diekstrak
          const updatedDevice = {
            ...selectedDeviceForSerial,
            nomorSeri: detectedSerial,
            brand: extractedBrand,
            brandDetails: brandInfo,
            status: "serial_scanned",
            message: `Serial number detected: ${detectedSerial}`,
            confidencePercent: (detection.confidence * 100).toFixed(1),
            serialConfidence: detection.confidence,
            extractedDetails: detection.extracted_details || {},
            method: "legacy"
          };
          
          // Update history
          updateCheckHistory(updatedDevice);
          
          setSerialScanResult({
            status: "success",
            serialNumber: detectedSerial,
            confidence: detection.confidence,
            brand: extractedBrand,
            brandDetails: brandInfo,
            device: selectedDeviceForSerial.jenisAset
          });

          // Tampilkan modal dengan detail yang diekstrak
          Swal.fire({
            title: "Serial Number Detected!",
            html: `
              <div class="text-center">
                <Hash className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <p class="text-lg font-semibold">Serial Number Found</p>
                <div class="bg-gray-50 p-4 rounded-lg mt-3 space-y-2">
                  <div class="text-left">
                    <p class="text-sm text-gray-600"><strong>Device:</strong> ${selectedDeviceForSerial.jenisAset}</p>
                    <p class="text-sm text-gray-600"><strong>Extracted Brand:</strong> ${extractedBrand}</p>
                    ${brandInfo ? `<p class="text-sm text-gray-600"><strong>Model Info:</strong> ${brandInfo}</p>` : ''}
                    <p class="text-xs text-yellow-600 mt-1"><i>Using legacy detection method</i></p>
                  </div>
                  <div class="my-3">
                    <p class="text-xs text-gray-500 mb-1">Serial Number:</p>
                    <p class="text-2xl font-mono text-blue-600 bg-white p-2 rounded border">${detectedSerial}</p>
                  </div>
                  <div class="text-sm text-gray-500">
                    <p>Confidence: ${(detection.confidence * 100).toFixed(1)}%</p>
                    ${detection.extracted_details?.brand_model ? 
                      `<p class="mt-1 text-xs">Additional Info: ${detection.extracted_details.brand_model}</p>` : ''}
                  </div>
                </div>
              </div>
            `,
            icon: "success",
            showCancelButton: true,
            confirmButtonText: "Scan Another Device",
            cancelButtonText: "Done",
            customClass: {
              popup: "font-poppins rounded-xl",
              title: "text-lg font-semibold",
              confirmButton: "px-6 py-2 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700",
              cancelButton: "px-6 py-2 text-sm font-medium rounded-lg bg-green-600 hover:bg-green-700",
            },
          }).then((result) => {
            if (result.isConfirmed) {
              // Reset untuk scanning serial lagi
              setSelectedDeviceForSerial(null);
              setSerialScanResult(null);
            } else {
              setIsScanningSerial(false);
            }
          });
        } else {
          // Tidak ada serial yang valid terdeteksi
          setSerialScanResult({
            status: "error",
            message: "No valid serial numbers detected. Please try again with clearer image."
          });

          Swal.fire({
            title: "No Serial Number Detected",
            html: `
              <div class="text-center">
                <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-3" />
                <p class="text-lg font-semibold">Try Advanced Method?</p>
                <p class="text-sm text-gray-600 mt-2">
                  The system couldn't detect a valid serial number. Would you like to try with enhanced image processing?
                </p>
              </div>
            `,
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Try Enhanced Processing",
            cancelButtonText: "Try Again",
            customClass: {
              popup: "font-poppins rounded-xl",
              confirmButton: "px-6 py-2 text-sm font-medium rounded-lg bg-purple-600 hover:bg-purple-700",
              cancelButton: "px-6 py-2 text-sm font-medium rounded-lg bg-gray-600 hover:bg-gray-700",
            },
          }).then((enhancedResult) => {
            if (enhancedResult.isConfirmed) {
              // Coba lagi dengan manual processing
              handleManualImageProcessing(imageData);
            }
          });
        }
      } else {
        setSerialScanResult({
          status: "error",
          message: result.message || "Failed to detect serial numbers."
        });

        Swal.fire({
          title: "Serial Scan Failed",
          text: result.message || "Please try again.",
          icon: "error",
          confirmButtonText: "Try Again",
        });
      }
    }
  } catch (error) {
    console.error("Serial detection error:", error);
    setSerialScanResult({
      status: "error",
      message: "Failed to process serial image."
    });

    Swal.fire({
      title: "Serial Scan Error",
      text: "Please check if the backend server is running.",
      icon: "error",
      confirmButtonText: "OK",
    });
  } finally {
    setIsDetectingSerial(false);
  }
};

// Fungsi untuk manual image processing
const handleManualImageProcessing = async (imageData) => {
  setIsDetectingSerial(true);
  
  try {
    // Kirim ke endpoint processing manual
    const response = await fetch(`${API_BASE_URL}/api/ocr/process-manual`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        image_data: imageData,
        device_type: selectedDeviceForSerial?.jenisAset || ""
      }),
    });

    const result = await response.json();
    
    if (result.success && result.serial_number) {
      // Update dengan hasil manual processing
      const updatedDevice = {
        ...selectedDeviceForSerial,
        nomorSeri: result.serial_number,
        status: "serial_scanned",
        message: `Serial number detected via manual processing: ${result.serial_number}`,
        confidencePercent: result.confidence ? (result.confidence * 100).toFixed(1) : "N/A",
        extractionMethod: "manual_processing",
        extractedDetails: {
          method: "manual",
          notes: result.notes || ""
        }
      };
      
      updateCheckHistory(updatedDevice);
      
      Swal.fire({
        title: "Manual Processing Successful!",
        html: `
          <div class="text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p class="text-lg font-semibold">Serial Number Found via Manual Processing</p>
            <div class="my-3">
              <p class="text-2xl font-mono text-blue-600">${result.serial_number}</p>
            </div>
            ${result.notes ? `<p class="text-sm text-gray-600">${result.notes}</p>` : ''}
          </div>
        `,
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        setIsScanningSerial(false);
      });
    } else {
      Swal.fire({
        title: "Processing Failed",
        text: "Could not extract serial number even with manual processing.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  } catch (error) {
    console.error("Manual processing error:", error);
    Swal.fire({
      title: "Error",
      text: "Manual processing failed. Please try capturing again.",
      icon: "error",
      confirmButtonText: "OK",
    });
  } finally {
    setIsDetectingSerial(false);
  }
};

// Fungsi extractSerialAdvanced
const extractSerialAdvanced = async (imageData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ocr/extract-serial`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image_data: imageData }),
    });

    const result = await response.json();
    
    if (result.success && result.extracted_serial) {
      // Validasi lebih lanjut
      const validationResponse = await fetch(`${API_BASE_URL}/api/ocr/validate-serial`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ serial_text: result.extracted_serial }),
      });
      
      const validationResult = await validationResponse.json();
      
      if (validationResult.success) {
        return {
          serialNumber: validationResult.validated_serial,
          confidence: result.confidence || 0.8,
          method: result.method || "advanced_ocr",
          originalText: validationResult.original_text || result.extracted_serial
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error("Advanced serial extraction error:", error);
    return null;
  }
};

  const cancelSerialScanning = () => {
    // Stop camera stream
    if (serialVideoRef.current && serialVideoRef.current.srcObject) {
      const tracks = serialVideoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    }
    
    setIsScanningSerial(false);
    setSelectedDeviceForSerial(null);
    setSerialScanResult(null);
  };

  const handleScanSerialFromHistory = (item) => {
    startSerialScanning(item);
  };

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
          message: "Format input tidak valid.",
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
              status: "Checked",
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
              status: "Checked",
            };
        const finalData = {
          status: "success",
          ...successData,
          message: `Valid! Manual input detected.`,
          inputType: isSerial ? "serial" : "barcode",
        };

        setScanResult(finalData);
        updateCheckHistory(finalData);
        setManualInput("");
      }
    }, 1500);
  };

  // ============================================
  // FUNGSI UNTUK MENGATUR LOKASI
  // ============================================

  const handleSetLocationForAll = async () => {
    if (validCheckHistory.length === 0) {
      Swal.fire({
        title: "No Data",
        text: "No items to set location for.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return;
    }

    const { value: locationValue } = await Swal.fire({
      title: "Set Location Scanning for All Items",
      html: `
        <div class="text-left">
          <div class="mb-3">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Select Location (Type to search):
            </label>
            <div class="relative">
              <input 
                id="locationSearchInput"
                type="text" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm mb-2"
                placeholder="Type to search locations..."
                value="${locationSearch}"
              />
              <div class="absolute right-2 top-2">
                <Search className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            <select 
              id="locationSelectAll"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm h-48 overflow-y-auto"
              size="8"
            >
            
              ${filteredLocations.map(loc => 
                `<option value="${loc.value}" ${selectedLocation === loc.value ? 'selected' : ''}>
                  ${loc.label}
                </option>`
              ).join('')}
              ${filteredLocations.length === 0 ? 
                '<option value="" disabled>No locations found</option>' : 
                ''}
            </select>
          </div>
          <p class="text-xs text-gray-500">
            This will set the same location for all ${validCheckHistory.length} items.
          </p>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: "Set Location",
      cancelButtonText: "Cancel",
      customClass: {
        title: "text-lg font-semibold", 
        popup: "font-poppins rounded-xl",
        confirmButton: "px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700",
        cancelButton: "px-4 py-2 text-sm font-medium rounded-lg bg-gray-600 hover:bg-gray-700",
      },
      didOpen: () => {
        const searchInput = document.getElementById('locationSearchInput');
        const select = document.getElementById('locationSelectAll');
        
        searchInput.focus();
        
        searchInput.addEventListener('input', (e) => {
          const searchTerm = e.target.value.toLowerCase();
          setLocationSearch(searchTerm);
          
          const filtered = locations.filter(loc => 
            loc.label.toLowerCase().includes(searchTerm) ||
            loc.fullData.area.toLowerCase().includes(searchTerm) ||
            loc.value.toLowerCase().includes(searchTerm)
          );
          
          setFilteredLocations(filtered);
          
          // Clear and update dropdown options
          select.innerHTML = `
            <option value="">-- Select Location --</option>
            ${filtered.map(loc => 
              `<option value="${loc.value}">${loc.label}</option>`
            ).join('')}
            ${filtered.length === 0 ? 
              '<option value="" disabled>No locations found</option>' : 
              ''}
          `;
        });
      },
      preConfirm: () => {
        const select = document.getElementById('locationSelectAll');
        const locationValue = select.value;
        
        if (!locationValue) {
          Swal.showValidationMessage("Please select a location");
          return false;
        }
        
        const selected = locations.find(loc => loc.value === locationValue);
        return { value: locationValue, label: selected.label };
      },
    });

    if (locationValue) {
      // Update semua item dengan lokasi yang dipilih
      setCheckHistory(prev => prev.map(item => {
        if (item.id.includes("NO-DETECTION") || item.id.includes("ERROR") || item.id.includes("INVALID")) {
          return item;
        }
        return {
          ...item,
          lokasi: locationValue.value,
          lokasiLabel: locationValue.label,
          status: "Checked"
        };
      }));

      Swal.fire({
        title: "Location Set!",
        text: `Location set for ${validCheckHistory.length} items.`,
        icon: "success",
        confirmButtonText: "OK",
      });
    }
  };

const handleSetLocationForItem = async (item) => {
  const { value: locationValue } = await Swal.fire({
    title: "<div class='text-lg'>Set Location for Item</div>",
    html: `
      <div class="text-left">
        <div class="mb-2">
          <p class="text-sm text-gray-600">Device: <strong>${item.jenisAset}</strong></p>
          <p class="text-sm text-gray-600">Asset ID: <strong>${item.id}</strong></p>
        </div>
        <div class="mb-3">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Select Location (Type to search):
          </label>
          <div class="relative">
            <input 
              id="locationSearchInputItem"
              type="text" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm mb-2"
              placeholder="Type to search locations..."
              value="${locationSearch}"
            />
            <div class="absolute right-2 top-2">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
          </div>
          <select 
            id="locationSelectItem"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm h-48 overflow-y-auto"
            size="8"
          >
            <option value="">-- Select Location --</option>
            ${filteredLocations.map(loc => 
              `<option value="${loc.value}" ${item.lokasi === loc.value ? 'selected' : ''}>
                ${loc.label}
              </option>`
            ).join('')}
            ${filteredLocations.length === 0 ? 
              '<option value="" disabled>No locations found</option>' : 
              ''}
          </select>
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Set Location",
    cancelButtonText: "Cancel",
    customClass: {
      popup: "font-poppins rounded-xl",
      title: "text-lg font-semibold mb-2",
      confirmButton: "px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 hover:bg-blue-700",
      cancelButton: "px-4 py-2 text-sm font-medium rounded-lg bg-gray-600 hover:bg-gray-700",
    },
    didOpen: () => {
      const searchInput = document.getElementById('locationSearchInputItem');
      const select = document.getElementById('locationSelectItem');
      
      searchInput.focus();
      
      searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setLocationSearch(searchTerm);
        
        const filtered = locations.filter(loc => 
          loc.label.toLowerCase().includes(searchTerm) ||
          loc.fullData.area.toLowerCase().includes(searchTerm) ||
          loc.value.toLowerCase().includes(searchTerm)
        );
        
        setFilteredLocations(filtered);
        
        // Clear and update dropdown options
        select.innerHTML = `
          <option value="">-- Select Location --</option>
          ${filtered.map(loc => 
            `<option value="${loc.value}">${loc.label}</option>`
          ).join('')}
          ${filtered.length === 0 ? 
            '<option value="" disabled>No locations found</option>' : 
            ''}
        `;
      });
    },
    preConfirm: () => {
      const select = document.getElementById('locationSelectItem');
      const locationValue = select.value;
      
      if (!locationValue) {
        Swal.showValidationMessage("Please select a location");
        return false;
      }
      
      const selected = locations.find(loc => loc.value === locationValue);
      return { value: locationValue, label: selected.label };
    },
  });

  if (locationValue) {
    // Update item dengan lokasi yang dipilih
    setCheckHistory(prev => prev.map(prevItem => 
      prevItem.id === item.id 
        ? {
            ...prevItem,
            lokasi: locationValue.value,
            lokasiLabel: locationValue.label,
            status: "Checked"
          }
        : prevItem
    ));

    Swal.fire({
      title: "Location Set!",
      text: `Location set for ${item.jenisAset} (${item.id}).`,
      icon: "success",
      confirmButtonText: "OK",
    });
  }
};

  const handleSubmitSingle = async (item) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/location/assign-multiple`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          asset_ids: [item.id],
          location_code: item.lokasi,
          scanned_by: "Scanner User",
          notes: `Scanned via scanning page - ${item.jenisAset} ${item.nomorSeri ? `SN: ${item.nomorSeri}` : ''}`
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        // Tandai item sebagai submitted
        setCheckHistory(prev => prev.map(prevItem => 
          prevItem.id === item.id 
            ? { ...prevItem, submitted: true, status: "Submitted" }
            : prevItem
        ));

        Swal.fire({
          title: "Success!",
          text: `Data for ${item.jenisAset} submitted successfully.`,
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Submission Failed",
          text: result.message || "Failed to submit data.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to connect to server.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitAll = async () => {
    const itemsToSubmit = checkHistory.filter(
      item => item.status === "Checked" && item.lokasi && !item.submitted
    );

    if (itemsToSubmit.length === 0) {
      Swal.fire({
        title: "No Items to Submit",
        text: "All items have been submitted or no items with location.",
        icon: "info",
        confirmButtonText: "OK",
      });
      return;
    }

    setIsSubmittingAll(true);

    const confirmed = await Swal.fire({
      title: "Submit All Items?",
      html: `
        <div class="text-center">
          <p class="mb-3">You are about to submit <strong>${itemsToSubmit.length}</strong> items.</p>
          <div class="text-left max-h-40 overflow-y-auto bg-gray-50 p-3 rounded-lg">
            ${itemsToSubmit.slice(0, 5).map(item => 
              `<p class="text-xs text-gray-600">• ${item.jenisAset} - ${item.id}</p>`
            ).join('')}
            ${itemsToSubmit.length > 5 ? `<p class="text-xs text-gray-500">... and ${itemsToSubmit.length - 5} more</p>` : ''}
          </div>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Submit All",
      cancelButtonText: "Cancel",
    });

    if (!confirmed.isConfirmed) {
      setIsSubmittingAll(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/location/assign-multiple`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          asset_ids: itemsToSubmit.map(item => item.id),
          location_code: itemsToSubmit[0].lokasi, 
          scanned_by: "Scanner User",
          notes: `Batch submission from scanning page - ${itemsToSubmit.length} items`
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        // Tandai semua item sebagai submitted
        setCheckHistory(prev => prev.map(prevItem => {
          if (itemsToSubmit.some(item => item.id === prevItem.id)) {
            return { ...prevItem, submitted: true, status: "Submitted" };
          }
          return prevItem;
        }));

        Swal.fire({
          title: "Success!",
          html: `
            <div class="text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p class="text-lg font-semibold">${result.success_count} items submitted successfully</p>
              ${result.failed_count > 0 ? 
                `<p class="text-sm text-red-600 mt-2">${result.failed_count} items failed</p>` : 
                ''
              }
            </div>
          `,
          icon: "success",
          confirmButtonText: "OK",
        });
      } else {
        Swal.fire({
          title: "Submission Failed",
          text: result.message || "Failed to submit data.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Batch submission error:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to connect to server.",
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsSubmittingAll(false);
    }
  };

  const handleDeleteData = (item) => {
    Swal.fire({
      title: "Delete Item?",
      text: `Are you sure you want to delete "${item.jenisAset} (${item.id})"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
    }).then((result) => {
      if (result.isConfirmed) {
        setCheckHistory(prev => prev.filter(prevItem => prevItem.id !== item.id));
        
        Swal.fire({
          title: "Deleted!",
          text: "Item has been deleted.",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    });
  };

  const handleDeleteAll = () => {
    if (validCheckHistory.length === 0) {
      return;
    }

    Swal.fire({
      title: "Delete All Items?",
      html: `
        <div class="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p class="text-lg font-semibold">This will delete all ${validCheckHistory.length} items!</p>
          <p class="text-sm text-gray-600 mt-2">This action cannot be undone.</p>
        </div>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete All",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#ef4444",
    }).then((result) => {
      if (result.isConfirmed) {
        setCheckHistory([]);
        localStorage.removeItem("scanCheckHistory");
        
        Swal.fire({
          title: "Deleted!",
          text: "All items have been deleted.",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    });
  };

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case "success":
      case "serial_scanned":
        return "bg-green-100 text-green-700 border-green-200";
      case "error":
        return "bg-red-100 text-red-700 border-red-200";
      case "device_detected":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Pending Validation":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "Checked":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "serial_scanned":
        return <Hash className="w-3 h-3 text-green-600" />;
      case "device_detected":
        return <Camera className="w-3 h-3 text-blue-600" />;
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "success":
        return "Success";
      case "error":
        return "Error";
      case "device_detected":
        return "Device Detected";
      case "serial_scanned":
        return "Serial Scanned";
      case "Pending Validation":
        return "Pending Validation";
      case "Checked":
        return "Checked";
      default:
        return status;
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
      {/* Modal untuk Scanning Serial Number */}
      {isScanningSerial && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                  Serial Number Scanning
                </h2>
                <button
                  onClick={cancelSerialScanning}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              {selectedDeviceForSerial && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <strong>Scanning Serial for:</strong> {selectedDeviceForSerial.jenisAset} ({selectedDeviceForSerial.brand})
                  </p>
                </div>
              )}
              
              <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center mb-4">
                <video
                  ref={serialVideoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover"
                ></video>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3/4 h-3/4 border-2 border-dashed border-yellow-400 rounded-lg"></div>
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-yellow-500/70 animate-pulse"></div>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4 text-center">
                <Barcode className="w-4 h-4 inline mr-1" />
                Position camera close to the serial number sticker/barcode
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={handleSerialCapture}
                  disabled={isDetectingSerial}
                  className="flex-1 flex items-center justify-center px-4 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition shadow-lg disabled:opacity-50"
                >
                  {isDetectingSerial ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Detecting Serial...
                    </>
                  ) : (
                    <>
                      <Camera className="w-5 h-5 mr-2" />
                      Capture Serial Number
                    </>
                  )}
                </button>
                
                <button
                  onClick={cancelSerialScanning}
                  className="px-4 py-3 bg-gray-600 text-white font-semibold rounded-xl hover:bg-gray-700 transition"
                >
                  Cancel
                </button>
              </div>
              
              {serialScanResult && serialScanResult !== "loading" && (
                <div className={`mt-4 p-3 rounded-lg ${serialScanResult.status === "success" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                  <p className={`font-medium ${serialScanResult.status === "success" ? "text-green-700" : "text-red-700"}`}>
                    {serialScanResult.status === "success" ? "✓ Serial detected successfully" : "✗ Serial detection failed"}
                  </p>
                  {serialScanResult.serialNumber && (
                    <p className="text-lg font-mono text-blue-600 mt-1">{serialScanResult.serialNumber}</p>
                  )}
                  {serialScanResult.message && (
                    <p className="text-sm text-gray-600 mt-1">{serialScanResult.message}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-2 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-600 rounded-xl shadow-lg p-4 sm:p-6 text-white">
          <h1 className="text-xl sm:text-2xl font-semibold flex items-center">
            <ScanLine className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" />
            SCAN IT DEVICES & MATERIALS
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm mt-1 sm:mt-2">
            Scan IT devices or materials, then scan serial numbers or barcodes, select locations, and submit for verification.
          </p>
        </div>

        {/* 1. Camera / Scanner Area */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-3 sm:p-4 md:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
            <ScanLine className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
            Camera Scanner – Detect IT Devices
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
                Capture & Detect Devices
              </>
            )}
          </button>
          
          {checkHistory.some(item => item.status === "device_detected" || item.needsSerialScan) && (
            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-700 flex items-center">
                <Info className="w-4 h-4 mr-2" />
                Some devices need serial number scanning. Click "Capture & Detect" to start serial scan.
              </p>
            </div>
          )}
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
                  scanResult.status === "success" || scanResult.status === "serial_scanned"
                    ? "bg-green-50 border-green-500"
                    : scanResult.status === "device_detected"
                    ? "bg-blue-50 border-blue-500"
                    : "bg-red-50 border-red-500"
                }`}
              >
                <div
                  className={`flex items-center mb-2 sm:mb-3 ${
                    scanResult.status === "success" || scanResult.status === "serial_scanned"
                      ? "text-green-700"
                      : scanResult.status === "device_detected"
                      ? "text-blue-700"
                      : "text-red-700"
                  }`}
                >
                  {scanResult.status === "success" || scanResult.status === "serial_scanned" ? (
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                  ) : scanResult.status === "device_detected" ? (
                    <Camera className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
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
                      <span className="ml-1 text-gray-800">{scanResult.kategori}</span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Brand:</span>
                    <span className="text-gray-800 font-medium">
                      {scanResult.brand || "N/A"}
                    </span>
                  </div>
                  {scanResult.nomorSeri && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">Serial Number:</span>
                      <span className="font-mono text-gray-800 font-medium">
                        {scanResult.nomorSeri}
                      </span>
                    </div>
                  )}
                  {scanResult.confidencePercent && scanResult.confidencePercent !== "N/A" && (
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-600">
                        Confidence:
                      </span>
                      <span className="font-bold text-gray-800">
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
                 <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-gray-500">
                  {validCheckHistory.length} items
                </span>
                {readyToSubmitCount > 0 && (
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                    {readyToSubmitCount} ready
                  </span>
                )}
              </div>
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
                    Delete All
                  </button>
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
                      <th className="py-2 font-medium">Serial Number</th>
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
                            <span className="ml-2 text-sm text-gray-500">{item.id}</span>
                          </div>
                        </td>
                        <td className="py-3 text-gray-500 text-sm">
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
                        <td className="py-3 text-gray-500 text-sm">
                          <span className="font-medium text-gray-500">
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
                        <td className="py-3 text-gray-500 text-sm">
                          {item.nomorSeri ? (
                            <div className="font-mono text-gray-500 text-xs">
                              {item.nomorSeri}
                            </div>
                          ) : (
                            <button
                              onClick={() => handleScanSerialFromHistory(item)}
                              className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center hover:underline cursor-pointer"
                              title="Click to scan serial number"
                            >
                              <ScanLine className="w-3 h-3 mr-1" />
                              <span>Not scanned</span>
                            </button>
                          )}
                        </td>
                        <td className="py-3 text-gray-500 text-sm">
                          {item.lokasiLabel || item.lokasi ? (
                            <div className="max-w-[120px] truncate" title={item.lokasiLabel || item.lokasi}>
                              {item.lokasiLabel || item.lokasi}
                            </div>
                          ) : (
                            <button
                              onClick={() => handleSetLocationForItem(item)}
                              className="text-xs text-orange-600 hover:text-orange-700 font-medium flex items-center hover:underline"
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
                        <td className="py-3 text-gray-500 text-sm">
                          {item.tanggal}
                        </td>
                        <td className="py-3 text-gray-500 text-sm">
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
                        <div className="font-bold text-sm text-gray-800 ml-2">
                          {item.id}
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span
                          className={`px-2 py-1 text-xs rounded-full font-semibold border ${getStatusColor(
                            item.status
                          )}`}
                        >
                          {getStatusText(item.status)}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-gray-600 space-y-1">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Type:</span>{" "}
                        <span className="text-gray-500">{item.jenisAset}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Category:</span>
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
                        <span className="font-medium text-gray-600">Brand:</span>
                        <span className="text-gray-500 font-medium">
                          {item.brand || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Confidence:</span>
                        <span className="font-bold text-gray-500">
                          {item.confidencePercent}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Serial:</span>
                        {item.nomorSeri ? (
                          <span className="font-mono text-gray-500 text-xs">
                            {item.nomorSeri}
                          </span>
                        ) : (
                          <button
                            onClick={() => handleScanSerialFromHistory(item)}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center hover:underline cursor-pointer"
                            title="Click to scan serial number"
                          >
                            <ScanLine className="w-3 h-3 mr-1" />
                            <span>Not scanned</span>
                          </button>
                        )}
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-600">Location:</span>
                        {item.lokasiLabel || item.lokasi ? (
                          <span className="text-gray-500 text-right max-w-[120px] truncate">
                            {item.lokasiLabel || item.lokasi}
                          </span>
                        ) : (
                          <button
                            onClick={() => handleSetLocationForItem(item)}
                            className="text-xs text-orange-600 hover:text-orange-700 font-medium flex items-center hover:underline"
                          >
                            <MapPin className="w-3 h-3 mr-1" />
                            Set Location
                          </button>
                        )}
                      </div>
                      <div className="flex justify-between text-gray-500">
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
                    className="w-full flex items-center justify-center px-3 sm:px-4 py-2 sm:py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-500 transition disabled:opacity-50 text-sm sm:text-base"
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