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
} from "lucide-react";
import LayoutDashboard from "../components/LayoutDashboard";

const dummyScanHistory = [
  {
    serial: "PC-00123-SN",
    status: "Valid",
    location: "IT Room 2F",
    date: "2025-09-28",
    time: "10:21",
  },
  {
    serial: "LPT-9988-SN",
    status: "Error",
    location: "Finance L3",
    date: "2025-09-28",
    time: "10:15",
  },
  {
    serial: "MOU-555-SN",
    status: "Valid",
    location: "HR L2",
    date: "2025-09-27",
    time: "10:05",
  },
];

export default function SerialScanningPage() {
  const [manualSerial, setManualSerial] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const videoRef = useRef(null);

  const router = useRouter();

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
        console.error("Gagal akses kamera:", err);
        setCameraError(
          "Tidak dapat mengakses kamera. Pastikan izin kamera sudah diberikan."
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

  // Fungsi simulasi scan
  const handleScan = () => {
    setScanResult("loading");
    setManualSerial("");
    setIsSubmitting(false);

    setTimeout(() => {
      const isError = Math.random() < 0.3;
      if (isError) {
        setScanResult({
          status: "error",
          serial: "ERR-INVALID-SN-998",
          message: "Serial number not found or invalid format.",
        });
      } else {
        setScanResult({
          status: "success",
          serial: "PC-00456-SN",
          message: "Valid! Data OCR siap untuk dikirim.",
        });
      }
    }, 2000);
  };

  // Fungsi untuk manual check
  const handleManualCheck = (e) => {
    e.preventDefault();
    if (!manualSerial) return;
    setScanResult("loading");
    setIsSubmitting(false);
    setTimeout(() => {
      if (manualSerial.toUpperCase().includes("ERROR")) {
        setScanResult({
          status: "error",
          serial: manualSerial,
          message: "Asset data mismatch. Please check inventory system.",
        });
      } else {
        setScanResult({
          status: "success",
          serial: manualSerial,
          message: `Valid! Data input manual siap untuk dikirim.`,
        });
      }
    }, 1500);
  };

  const handleSubmitData = () => {
    if (!scanResult || scanResult.status !== "success" || isSubmitting) return;

    setIsSubmitting(true);

    console.log(`Submitting Serial: ${scanResult.serial} to API...`);

    setTimeout(() => {
      setIsSubmitting(false);

      // Data yang akan diteruskan ke halaman Validasi & Verifikasi
      const submittedData = {
        serial: scanResult.serial,
        uniqueCode: "V-901-XYZ-A",
        location: "IT Room 2F",
        date: new Date().toLocaleDateString("en-US"),
        time: new Date().toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' }),
      };

      alert(`Data Serial: ${submittedData.serial} berhasil dikirim! Mengalihkan ke halaman verifikasi.`);

      localStorage.setItem('lastSubmittedScan', JSON.stringify(submittedData));

      router.push("/validation-verification");
    }, 2500);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Valid":
        return "bg-green-100 text-green-700";
      case "Error":
        return "bg-red-100 text-red-700";
      case "Pending":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <LayoutDashboard activeMenu={2}> 
      <div className="max-w-4xl mx-auto px-3 md:px-4 py-4 md:py-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
          <Scan className="w-6 h-6 mr-3 text-blue-600" /> Serial Number Scanning
        </h1>

        {/* Kamera / Scanner Area */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Camera className="w-5 h-5 mr-2 text-blue-600" /> Scan Asset Serial Number
          </h2>

          <div className="relative w-full aspect-video bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center mb-6">
            {/* Kamera Video */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            ></video>

            {/* Scanner Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4/5 h-4/5 border-4 border-dashed border-white/50 rounded-lg"></div>
              <div className="absolute top-1/2 w-4/5 h-px bg-red-500 animate-pulse"></div>
            </div>

            {/* Error kamera */}
            {cameraError && (
              <div className="absolute inset-0 bg-black/70 text-white text-center flex items-center justify-center text-sm p-4">
                {cameraError}
              </div>
            )}
          </div>

          <p className="text-sm text-center text-gray-500 mb-4">
            *Pastikan perangkat Anda mengizinkan akses kamera. Untuk perangkat
            seluler, ini akan membuka aplikasi kamera.
          </p>

          <div className="flex justify-center">
            <button
              onClick={handleScan}
              className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition shadow-lg disabled:opacity-50"
              disabled={scanResult === "loading" || isSubmitting}>
              {scanResult === "loading" ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
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
                  Scanning...
                </>
              ) : (
                <>
                  <Camera className="w-5 h-5 mr-2" />
                  Start Camera Scan
                </>
              )}
            </button>
          </div>
        </div>

        {/* 2. Scan Result & Manual Input */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Manual Input */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Clipboard className="w-5 h-5 mr-2 text-gray-600" /> Manual Input
            </h2>
            <form onSubmit={handleManualCheck} className="space-y-4">
              <input
                type="text"
                placeholder="Enter Serial Number Manually"
                value={manualSerial}
                onChange={(e) => setManualSerial(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                required
              />
              <button
                type="submit"
                className="w-full flex items-center justify-center px-4 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
                disabled={scanResult === "loading" || isSubmitting}
              >
                <Search className="w-5 h-5 mr-2" /> Check Serial
              </button>
            </form>
          </div>

          {/* Scan Result Status */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-gray-400" /> Last Result
            </h2>

            {scanResult === "loading" && (
              <div className="text-center py-8 text-gray-500">
                <svg
                  className="animate-spin mx-auto h-8 w-8 text-blue-500 mb-3"
                  xmlns="http://www.w3.org/2000/svg"
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
                <p className="font-medium">Processing check...</p>
              </div>
            )}

            {scanResult && scanResult !== "loading" && (
              <div
                className={`p-4 rounded-lg ${
                  scanResult.status === "success"
                    ? "bg-green-50 border-green-500"
                    : "bg-red-50 border-red-500"
                } border-l-4`}
              >
                <div
                  className={`flex items-center mb-2 ${
                    scanResult.status === "success"
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  {scanResult.status === "success" ? (
                    <CheckCircle className="w-5 h-5 mr-2" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 mr-2" />
                  )}
                  <span className="font-bold text-lg capitalize">
                    {scanResult.status}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-800 mb-1">
                  Serial: {scanResult.serial}
                </p>
                <p className="text-sm text-gray-600">{scanResult.message}</p>

                {/* TOMBOL SUBMIT */}
                {scanResult.status === "success" && (
                  <button
                    onClick={handleSubmitData}
                    className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
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
                        Sending Data...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit & Verify Data
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {!scanResult && scanResult !== "loading" && (
              <p className="text-center py-6 text-gray-500 italic">
                No recent check results.
              </p>
            )}
          </div>
        </div>

        {/* 3. Scan History */}
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-gray-600" /> Recent Scan History
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-gray-500 uppercase text-xs border-b border-gray-200">
                  <th className="py-2 font-medium">Serial Number</th>
                  <th className="py-2 font-medium">Location</th>
                  <th className="py-2 font-medium">Check Status</th>
                  <th className="py-2 font-medium">Date</th>
                  <th className="py-2 font-medium">Time</th>
                </tr>
              </thead>

              <tbody>
                {dummyScanHistory.map((row, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50 text-gray-800"
                  >
                    <td className="py-3 font-medium text-blue-700">
                      {row.serial}
                    </td>
                    <td className="py-3 text-gray-600">{row.location}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-semibold ${getStatusColor(
                          row.status
                        )}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-600">{row.date}</td>
                    <td className="py-3 text-gray-600">{row.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-800 transition">
            View All History &rarr;
          </button>
        </div>
      </div>
    </LayoutDashboard>
  );
}