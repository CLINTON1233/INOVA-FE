'use client';
import { useState } from 'react';

export default function DetectPage() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState([]);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch('http://localhost:5000/detect', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setResult(data.serial_numbers);
  };

  return (
    <div className="p-5 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Deteksi Serial Number</h1>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Upload & Deteksi
      </button>

      {result.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Hasil OCR:</h2>
          <ul className="list-disc ml-6">
            {result.map((serial, idx) => (
              <li key={idx}>{serial}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
