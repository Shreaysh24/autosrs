"use client";
import { useState } from "react";
import { Paperclip, X } from "lucide-react";
import { useSession } from "next-auth/react";

export default function UpdateProject({ selectedProject, onVersionCreated }) {
  const [input, setInput] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() && files.length === 0) return;
    if (!selectedProject?.projectId?._id) return;

    setLoading(true);
    try {
      // Get latest version info first
      const versionResponse = await fetch(`/api/version/project?projectId=${selectedProject.projectId._id}`);
      const versionData = await versionResponse.json();
      const latestVersion = versionData.versions?.[0] || null;

      // Create new version
      const newVersionNumber = latestVersion 
        ? `v${parseFloat(latestVersion.versionName.replace('v', '')) + 0.1}` 
        : 'v1.0';

      const versionCreateResponse = await fetch('/api/version/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: selectedProject.projectId._id,
          versionName: newVersionNumber,
          summary: input || 'Version update with attachments'
        })
      });

      if (!versionCreateResponse.ok) throw new Error('Failed to create version');
      const { version } = await versionCreateResponse.json();

      // Upload version file with attachments
      const formData = new FormData();
      formData.append('projectId', selectedProject.projectId._id);
      formData.append('versionId', version._id);
      formData.append('codeSnippet', `// Updated version ${newVersionNumber}\n// ${input}\n// Previous version: ${latestVersion?.versionName || 'None'}`);
      formData.append('expectedOutput', `Updated functionality for ${selectedProject.projectName}`);
      formData.append('testCase', `Test updated features in ${newVersionNumber}`);

      if (files.length > 0) {
        formData.append('mainFile', files[0]);
      }

      const fileResponse = await fetch('/api/version-file/upload', {
        method: 'POST',
        body: formData
      });

      if (!fileResponse.ok) throw new Error('Failed to upload files');

      // Reset form
      setInput("");
      setFiles([]);
      
      // Refresh versions list
      onVersionCreated?.();
      
      console.log('Version updated successfully!');
    } catch (error) {
      console.error('Error updating version:', error);
      alert('Failed to update version. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  if (!selectedProject) return null;

  return (
    <div className="w-full">
      {/* FILE PREVIEW */}
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

      {/* INPUT BAR */}
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
            multiple
            onChange={handleFileChange}
          />
        </label>

        {/* Text Input */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add attachment and update version notes..."
          className="flex-1 bg-transparent outline-none text-gray-200 placeholder-gray-500"
          disabled={loading}
        />

        {/* Update Button */}
        <button
          type="submit"
          disabled={loading || (!input.trim() && files.length === 0)}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Updating...' : 'Update'}
        </button>
      </form>
    </div>
  );
}