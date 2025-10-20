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
  Cpu,
  Cable,
  Server,
  Box,
} from "lucide-react";
import LayoutDashboard from "../components/LayoutDashboard";

// Data dummy sesuai dengan jenis aset di proposal
const dummyScanHistory = [
  {
    id: "PC-IT-2025-001",
    jenisAset: "Komputer",
    kategori: "Perangkat",
    lokasi: "Infrastruktur & Jaringan",
    status: "Valid",
    tanggal: "2025-10-28",
    waktu: "14:30:15",
    nomorSeri: "NS-PC-887632",
  },
  {
    id: "MAT-KBL-045",
    jenisAset: "Kabel RJ45",
    kategori: "Material",
    lokasi: "Workshop 2",
    status: "Valid",
    tanggal: "2025-10-28",
    waktu: "14:25:40",
    barcode: "BC-RJ45-554321",
  },
  {
    id: "SRV-NET-012",
    jenisAset: "Server",
    kategori: "Perangkat",
    lokasi: "Ruang Server L3",
    status: "Error",
    tanggal: "2025-10-28",
    waktu: "14:18:22",
    nomorSeri: "NS-SRV-992345",
  },
];

export default function SerialScanningPage() {
  const [manualInput, setManualInput] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [inputType, setInputType] = useState(""); // "serial" atau "barcode"
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

  // Fungsi simulasi scan dengan data sesuai proposal
  const handleScan = () => {
    setScanResult("loading");
    setManualInput("");
    setIsSubmitting(false);
    setInputType("");

    setTimeout(() => {
      const isError = Math.random() < 0.2; // 20% kemungkinan error
      const isPerangkat = Math.random() < 0.6; // 60% perangkat, 40% material
      
      if (isError) {
        setScanResult({
          status: "error",
          id: "ERR-SCAN-001",
          jenisAset: "Tidak Dikenali",
          kategori: "Error",
          lokasi: "Scan Gagal",
          message: "Format nomor seri/barcode tidak valid. Silakan scan ulang.",
          inputType: "scan",
        });
      } else {
        const assets = isPerangkat ? 
          // Data Perangkat (Nomor Seri)
          [
            {
              id: "PC-IT-2025-001",
              jenisAset: "Komputer",
              kategori: "Perangkat",
              lokasi: "Infrastruktur & Jaringan",
              nomorSeri: "NS-PC-887632",
            },
            {
              id: "SRV-NET-012",
              jenisAset: "Server",
              kategori: "Perangkat", 
              lokasi: "Ruang Server L3",
              nomorSeri: "NS-SRV-992345",
            },
            {
              id: "CCTV-SEC-003", 
              jenisAset: "CCTV",
              kategori: "Perangkat",
              lokasi: "Pintu Gerbang",
              nomorSeri: "NS-CCTV-661234",
            }
          ] : 
          // Data Material (Barcode)
          [
            {
              id: "MAT-KBL-045",
              jenisAset: "Kabel RJ45", 
              kategori: "Material",
              lokasi: "Workshop 2",
              barcode: "BC-RJ45-554321",
            },
            {
              id: "MAT-TRK-987",
              jenisAset: "Trunking",
              kategori: "Material",
              lokasi: "Kantor Utama L1", 
              barcode: "BC-TRK-773216",
            },
            {
              id: "MAT-PIP-123",
              jenisAset: "Pipa PVC",
              kategori: "Material",
              lokasi: "Gudang Material",
              barcode: "BC-PIP-445533",
            }
          ];
        
        const randomAsset = assets[Math.floor(Math.random() * assets.length)];
        setScanResult({
          status: "success",
          ...randomAsset,
          message: `Berhasil! ${isPerangkat ? "Nomor Seri" : "Barcode"} terdeteksi. Data siap divalidasi.`,
          inputType: "scan",
        });
        setInputType(isPerangkat ? "serial" : "barcode");
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
        setScanResult({
          status: "error",
          id: "INVALID-INPUT",
          jenisAset: "Tidak Valid",
          kategori: "Error",
          lokasi: "Input Manual",
          message: "Format input tidak valid. Pastikan format nomor seri (NS-XXX) atau barcode (BC-XXX).",
          inputType: isSerial ? "serial" : "barcode",
        });
      } else {
        const isPerangkat = isSerial || Math.random() < 0.5;
        const assets = isPerangkat ?
          {
            id: "PC-MAN-001",
            jenisAset: "Komputer",
            kategori: "Perangkat", 
            lokasi: "Lokasi Manual Input",
            nomorSeri: manualInput,
          } :
          {
            id: "MAT-MAN-001", 
            jenisAset: "Material",
            kategori: "Material",
            lokasi: "Lokasi Manual Input",
            barcode: manualInput,
          };
        
        setScanResult({
          status: "success",
          ...assets,
          message: `Valid! Data input manual ${isPerangkat ? "nomor seri" : "barcode"} siap divalidasi.`,
          inputType: isSerial ? "serial" : "barcode",
        });
      }
    }, 1500);
  };

  const handleSubmitData = () => {
    if (!scanResult || scanResult.status !== "success" || isSubmitting) return;

    setIsSubmitting(true);

    console.log(`Submitting Data:`, scanResult);

    setTimeout(() => {
      setIsSubmitting(false);

      // Data yang akan diteruskan ke halaman Validasi & Verifikasi
      const submittedData = {
        ...scanResult,
        tanggal: new Date().toLocaleDateString("id-ID"),
        waktu: new Date().toLocaleTimeString("id-ID", { 
          hour: '2-digit', 
          minute: '2-digit',
          second: '2-digit'
        }),
        uniqueCode: `V-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      };

      alert(`Data ${submittedData.jenisAset} berhasil dikirim! Mengalihkan ke halaman verifikasi.`);

      localStorage.setItem('lastSubmittedScan', JSON.stringify(submittedData));

      router.push("/validation-verification");
    }, 2500);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Valid":
        return "bg-green-100 text-green-700 border-green-200";
      case "Error":
        return "bg-red-100 text-red-700 border-red-200";
      case "Tertunda":
        return "bg-blue-100 text-blue-700 border-blue-200";
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

  return (
    <LayoutDashboard activeMenu={2}> 
      <div className="max-w-6xl mx-auto px-3 md:px-4 py-4 md:py-2 space-y-2">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl shadow-lg p-6 text-white">
          <h1 className="text-2xl font-semibold flex items-center">
            <Scan className="w-6 h-6 mr-3" /> Scan Perangkat atau Material 
          </h1>
          <p className="text-blue-100 text-sm mt-2">
           Arahkan kamera ke perangkat IT atau material untuk memindai nomor seri atau barcode secara otomatis atau masukkan secara manual jika diperlukan.
          </p>
        </div>

        {/* 1. Kamera / Scanner Area */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 md:p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Camera className="w-5 h-5 mr-2 text-blue-600" /> 
            Scanner Kamera - Deteksi Perangkat & Material
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
              <div className="absolute top-1/2 w-4/5 h-1 bg-red-500 animate-pulse shadow-lg"></div>
            </div>

            {/* Error kamera */}
            {cameraError && (
              <div className="absolute inset-0 bg-black/70 text-white text-center flex items-center justify-center p-4">
                <div>
                  <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                  <p className="text-sm">{cameraError}</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Cpu className="w-4 h-4 mr-2 text-blue-600" />
              <span>Scan <strong>Nomor Seri</strong> untuk Perangkat IT</span>
            </div>
            <div className="flex items-center">
              <Cable className="w-4 h-4 mr-2 text-green-600" />
              <span>Scan <strong>Barcode</strong> untuk Material</span>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={handleScan}
              className="flex items-center justify-center px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition shadow-lg disabled:opacity-50 text-base"
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
                  Sedang Memindai...
                </>
              ) : (
                <>
                  <Camera className="w-5 h-5 mr-2" />
                  Mulai Pemindaian Kamera
                </>
              )}
            </button>
          </div>
        </div>

        {/* 2. Input Manual & Hasil Scan */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Manual */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Clipboard className="w-5 h-5 mr-2 text-gray-600" /> 
              Input Manual
            </h2>
            <form onSubmit={handleManualCheck} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Masukkan Nomor Seri atau Barcode
                </label>
                <input
                  type="text"
                  placeholder="Contoh: NS-PC-887632 atau BC-RJ45-554321"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full flex items-center justify-center px-4 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
                disabled={scanResult === "loading" || isSubmitting}
              >
                <Search className="w-5 h-5 mr-2" /> 
                Cek Validitas
              </button>
            </form>
          </div>

          {/* Hasil Scan */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-gray-400" /> 
              Hasil Pemeriksaan
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
                <p className="font-medium">Memproses pemeriksaan...</p>
                <p className="text-sm mt-1">Mendeteksi format dan validitas</p>
              </div>
            )}

            {scanResult && scanResult !== "loading" && (
              <div
                className={`p-4 rounded-lg border-l-4 ${
                  scanResult.status === "success"
                    ? "bg-green-50 border-green-500"
                    : "bg-red-50 border-red-500"
                }`}
              >
                <div
                  className={`flex items-center mb-3 ${
                    scanResult.status === "success"
                      ? "text-green-700"
                      : "text-red-700"
                  }`}
                >
                  {scanResult.status === "success" ? (
                    <CheckCircle className="w-6 h-6 mr-2" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 mr-2" />
                  )}
                  <span className="font-bold text-lg capitalize">
                    {scanResult.status === "success" ? "Valid" : "Error"}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">ID Aset:</span>
                    <span className="font-bold text-gray-800">{scanResult.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Jenis:</span>
                    <span className="text-gray-800">{scanResult.jenisAset}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Kategori:</span>
                    <span className="flex items-center">
                      {getCategoryIcon(scanResult.kategori)}
                      <span className="ml-1">{scanResult.kategori}</span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">Lokasi:</span>
                    <span className="text-gray-800">{scanResult.lokasi}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-gray-600">
                      {inputType === "serial" ? "Nomor Seri:" : "Barcode:"}
                    </span>
                    <span className="font-mono text-blue-600">
                      {scanResult.nomorSeri || scanResult.barcode}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mt-3 border-t pt-3">
                  {scanResult.message}
                </p>

                {/* TOMBOL SUBMIT */}
                {scanResult.status === "success" && (
                  <button
                    onClick={handleSubmitData}
                    className="mt-4 w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:opacity-50"
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
                        Mengirim Data...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Kirim & Verifikasi Data
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

            {!scanResult && scanResult !== "loading" && (
              <div className="text-center py-8 text-gray-500">
                <Box className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="font-medium">Belum ada hasil pemeriksaan</p>
                <p className="text-sm mt-1">Gunakan Scanner Kamera atau Input Manual</p>
              </div>
            )}
          </div>
        </div>

        {/* 3. Riwayat Scan */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-gray-600" /> 
            Riwayat Pemindaian Terbaru
          </h2>
          
          {/* Tampilan Desktop */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-gray-500 uppercase text-xs border-b border-gray-200">
                  <th className="py-2 font-medium">ID Aset</th>
                  <th className="py-2 font-medium">Jenis Aset</th>
                  <th className="py-2 font-medium">Kategori</th>
                  <th className="py-2 font-medium">Lokasi</th>
                  <th className="py-2 font-medium">Status</th>
                  <th className="py-2 font-medium">Tanggal</th>
                  <th className="py-2 font-medium">Waktu</th>
                </tr>
              </thead>
              <tbody>
                {dummyScanHistory.map((row, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50 text-gray-800"
                  >
                    <td className="py-3 font-medium">
                      <div className="flex items-center">
                        {getCategoryIcon(row.kategori)}
                        <span className="ml-2">{row.id}</span>
                      </div>
                    </td>
                    <td className="py-3 text-gray-600">{row.jenisAset}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-semibold ${
                          row.kategori === "Perangkat"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {row.kategori}
                      </span>
                    </td>
                    <td className="py-3 text-gray-600">{row.lokasi}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-semibold border ${getStatusColor(
                          row.status
                        )}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3 text-gray-600">{row.tanggal}</td>
                    <td className="py-3 text-gray-600">{row.waktu}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Tampilan Mobile */}
          <div className="md:hidden space-y-3">
            {dummyScanHistory.map((row, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-3 bg-white hover:bg-gray-50 transition"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    {getCategoryIcon(row.kategori)}
                    <div className="font-bold text-sm text-gray-700 ml-2">
                      {row.id}
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-semibold border ${getStatusColor(
                      row.status
                    )}`}
                  >
                    {row.status}
                  </span>
                </div>
                <div className="text-xs text-gray-600 space-y-1">
                  <div className="flex justify-between">
                    <span className="font-medium">Jenis:</span> {row.jenisAset}
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Kategori:</span>
                    <span
                      className={`px-1 rounded text-xs ${
                        row.kategori === "Perangkat"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {row.kategori}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Lokasi:</span> {row.lokasi}
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">ID Unik:</span>
                    {row.nomorSeri || row.barcode}
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>{row.tanggal}</span>
                    <span>{row.waktu}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => router.push("/history")}
            className="mt-4 w-full text-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition"
          >
            Lihat Riwayat Lengkap &rarr;
          </button>
        </div>
      </div>
    </LayoutDashboard>
  );
}