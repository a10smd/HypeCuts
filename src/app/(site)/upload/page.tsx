"use client"; // Required for client-side hooks

import { useSession } from "@/src/app/hooks/useSession";
import toast from "react-hot-toast";
import { useState } from "react";

export default function UploadPage() {
  const { sessionId } = useSession();
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (file: File) => {
    try {
      setIsUploading(true);
      console.log(
        "Starting upload for file:",
        file.name,
        "Size:",
        file.size + " bytes"
      );
      toast.success("Uploading video...");

      // Temporary API call (we'll implement this properly later)
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        console.log("✅ Upload successful!");
        toast.success("Upload completed!");
      } else {
        console.error("❌ Upload failed:", await response.text());
        toast.error("Upload failed!");
      }
    } catch (error) {
      console.error("❌ Upload error:", error);
      toast.error("Upload failed!");
    } finally {
      setIsUploading(false);
    }
  };
  const handleProcess = async () => {
    try {
      toast.loading("Processing video...", { id: "processing" });
      const res = await fetch("/api/process", { method: "POST" });
      if (!res.ok) throw new Error();
      toast.success("Processing complete!", { id: "processing" });

      // Auto-download clips
      const downloadRes = await fetch("/api/download");
      const blob = await downloadRes.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `hypecuts-${sessionId}.zip`;
      a.click();
    } catch (error) {
      toast.error("Processing failed", { id: "processing" });
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">Upload Video</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <input
          type="file"
          accept="video/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
          }}
          disabled={isUploading}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {isUploading && <p className="mt-4 text-gray-600">Uploading...</p>}
        <button
          onClick={handleProcess}
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
        >
          Generate Clips
        </button>
      </div>
    </div>
  );
}
