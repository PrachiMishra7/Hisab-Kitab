// src/KYCUpload.jsx
import React, { useState } from "react";
import axios from "axios";

export default function KYCUpload() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  function handleFileChange(e) {
    const f = e.target.files[0];
    setErrorMsg("");
    if (!f) return setFile(null);
    const allowed = ["image/jpeg","image/jpg","image/png","application/pdf"];
    if (!allowed.includes(f.type)) {
      setErrorMsg("Only JPG/PNG images and PDF allowed");
      e.target.value = null;
      setFile(null);
      setPreviewUrl("");
      return;
    }
    setFile(f);
    if (f.type.startsWith("image/")) {
      const url = URL.createObjectURL(f);
      setPreviewUrl(url);
    } else {
      setPreviewUrl("");
    }
  }

  async function handleUpload(e) {
    e.preventDefault();
    setErrorMsg("");
    if (!file) return setErrorMsg("Please choose a file first");

    const fd = new FormData();
    fd.append("file", file);

    try {
      setUploading(true);
      setProgress(0);

      const res = await axios.post(`${API_BASE}/kyc/upload`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (evt) => {
          const pct = Math.round((evt.loaded / evt.total) * 100);
          setProgress(pct);
        },
        timeout: 30000
      });

      // server response includes receiptUrl
      const { receiptUrl } = res.data || {};
      setSuccessMsg("KYC uploaded successfully!");

      // trigger download of receipt PDF if present
      if (receiptUrl) {
        // full URL (same origin)
        const fullUrl = `${window.location.origin}${receiptUrl}`;
        // create invisible link and click to download
        const a = document.createElement("a");
        a.href = fullUrl;
        // suggest filename
        a.download = `kyc-receipt.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }

      // auto-hide success message
      setTimeout(() => setSuccessMsg(""), 3500);

      // clear selection
      setFile(null);
      setPreviewUrl("");
      setProgress(0);
    } catch (err) {
      console.error("Upload failed:", err);
      const message = err?.response?.data?.error || err?.message || "Upload failed";
      setErrorMsg(message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div style={{ maxWidth: 820, margin: "0 auto", color: "#fff" }}>
      <h2>Step 1: Upload Your Aadhaar / ID</h2>

      <div style={{
        border: "2px dashed rgba(0,255,0,0.25)",
        padding: 30,
        borderRadius: 12,
        textAlign: "center",
        background: "rgba(255,255,255,0.02)"
      }}>
        <div style={{ marginBottom: 12 }}>
          <input
            id="kyc-file"
            type="file"
            accept="image/*,application/pdf"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
          <label htmlFor="kyc-file" style={{
            display: "inline-block",
            background: "#3cb371",
            padding: "10px 18px",
            borderRadius: 8,
            cursor: "pointer",
            fontWeight: 700,
            color: "#fff"
          }}>
            Choose File
          </label>
          <div style={{ marginTop: 10 }}>
            {file ? <span style={{ marginLeft: 10 }}>{file.name}</span> : <span>No file chosen</span>}
          </div>
        </div>

        {previewUrl ? (
          <div style={{ marginTop: 14 }}>
            <img src={previewUrl} alt="preview" style={{ maxWidth: "100%", maxHeight: 300, borderRadius: 8 }} />
          </div>
        ) : (
          file && <div style={{ marginTop: 14, opacity: 0.9 }}>{file.type === "application/pdf" ? "PDF chosen (preview not available)" : null}</div>
        )}

        {errorMsg && <div style={{ color: "#ffcccb", marginTop: 12 }}>{errorMsg}</div>}

        <div style={{ marginTop: 18 }}>
          <button
            onClick={handleUpload}
            disabled={uploading}
            style={{
              padding: "10px 18px",
              borderRadius: 8,
              background: uploading ? "#999" : "#4caf50",
              border: "none",
              color: "#fff",
              fontWeight: 700,
              cursor: uploading ? "not-allowed" : "pointer"
            }}
          >
            {uploading ? `Uploading... ${progress}%` : "Upload & Get Receipt"}
          </button>
        </div>

        {uploading && (
          <div style={{ marginTop: 12 }}>
            <div style={{ height: 8, width: "100%", background: "rgba(255,255,255,0.08)", borderRadius: 8 }}>
              <div style={{ height: 8, width: `${progress}%`, background: "#4caf50", borderRadius: 8 }} />
            </div>
          </div>
        )}
      </div>

      {/* success popup */}
      {successMsg && (
        <div style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          background: "#4caf50",
          color: "#fff",
          padding: "12px 20px",
          borderRadius: 8,
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
          zIndex: 9999,
          fontWeight: 700
        }}>
          {successMsg}
        </div>
      )}
    </div>
  );
}
