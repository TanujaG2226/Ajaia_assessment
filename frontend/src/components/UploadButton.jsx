import { useState } from "react";
import { api } from "../api";

export default function UploadButton({ currentUser, onUploadComplete }) {
  const [message, setMessage] = useState("");

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("ownerId", currentUser.id);

    try {
      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("File uploaded and converted to document.");
      onUploadComplete(res.data);
    } catch (error) {
      setMessage(error.response?.data?.error || "Upload failed.");
    }
  };

  return (
    <div style={{ marginTop: "1rem" }}>
      <label>
        Upload .txt or .md:
        <input type="file" accept=".txt,.md" onChange={handleUpload} />
      </label>

      {message && <p>{message}</p>}
    </div>
  );
}