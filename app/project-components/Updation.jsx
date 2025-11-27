"use client";
import { useState } from "react";
import { Paperclip, X } from "lucide-react";

export default function UpdateProject() {
  const [input, setInput] = useState("");
  const [files, setFiles] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() && files.length === 0) return;

    const formData = new FormData();
    formData.append("message", input);

    files.forEach((file) => {
      formData.append("files", file);
    });

    console.log("Sending message:", input);
    console.log("Sending files:", files);

    // TODO: send to API below

    // Reset
    setInput("");
    setFiles([]);
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed bottom-2 w-[77%]">
      {/* FILE PREVIEW LIKE WHATSAPP */}
      {files.length > 0 && (
        <div className="flex gap-3 mb-3 flex-wrap bg-[#111827]/80 p-3 rounded-lg border border-gray-700 shadow-xl">
          {files.map((file, index) => (
            <div
              key={index}
              className="relative bg-gray-800 border border-gray-600 text-gray-200 p-2 rounded-lg"
            >
              <p className="text-sm max-w-[150px] truncate">{file.name}</p>

              <button
                onClick={() => removeFile(index)}
                className="absolute -top-2 -right-2 bg-red-600 rounded-full p-[2px]"
              >
                <X size={14} color="white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* INPUT + ATTACH + SEND BAR */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center space-x-3 bg-[#111827]/70 border border-gray-700 rounded-lg p-3 shadow-lg"
      >
        {/* File Upload */}
        <label className="cursor-pointer">
          <Paperclip className="text-gray-300 hover:text-white" size={22} />
          <input
            type="file"
            className="hidden"
            multiple   // <<<< ENABLE MULTIPLE FILES
            onChange={handleFileChange}
          />
        </label>

        {/* Text Input */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Update version notes..."
          className="flex-1 bg-transparent outline-none text-gray-200 placeholder-gray-500"
        />

        {/* Send Button */}
        <button
          type="submit"
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold hover:opacity-90 transition"
        >
          Update
        </button>
      </form>
    </div>
  );
}
