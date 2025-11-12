"use client";
import React from "react";

function FileUploadOptions({ isMobile, uploadedFiles, setUploadedFiles }) {
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  const removeFile = (index) => {
    const updatedFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(updatedFiles);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <h2 className="text-xl font-semibold text-gray-200">
        Upload Supporting Files
      </h2>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="p-2 rounded-lg bg-gray-800 text-gray-200 border border-gray-600"
      />

      {/* Show uploaded files */}
      <div className="flex flex-col gap-2">
        {uploadedFiles.length > 0 ? (
          uploadedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-700 text-gray-200 px-3 py-2 rounded-lg"
            >
              <span className="truncate w-[70%]">{file.name}</span>
              <button
                onClick={() => removeFile(index)}
                className="text-red-400 hover:text-red-600 transition"
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-sm">No files uploaded yet.</p>
        )}
      </div>
    </div>
  );
}

export default FileUploadOptions;
