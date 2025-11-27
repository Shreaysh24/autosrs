"use client";
import { useState, useEffect } from "react";
import { Download, Save, ArrowLeft } from "lucide-react";

export default function VersionPage({ selectedVersion, onBack }) {
  const [versionFile, setVersionFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [codeSnippet, setCodeSnippet] = useState("");
  const [expectedOutput, setExpectedOutput] = useState("");
  const [testCase, setTestCase] = useState("");

  useEffect(() => {
    if (selectedVersion?._id) {
      fetchVersionFile();
    }
  }, [selectedVersion]);

  const fetchVersionFile = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/version-file/get?versionId=${selectedVersion._id}`);
      const data = await response.json();
      if (response.ok) {
        setVersionFile(data.versionFile);
        setCodeSnippet(data.versionFile.codeSnippet || "");
        setExpectedOutput(data.versionFile.expectedOutput || "");
        setTestCase(data.versionFile.testCase || "");
      }
    } catch (error) {
      console.error('Error fetching version file:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/version-file/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          versionId: selectedVersion._id,
          codeSnippet,
          expectedOutput,
          testCase
        })
      });

      if (response.ok) {
        alert('Changes saved successfully!');
      } else {
        alert('Failed to save changes');
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = () => {
    if (versionFile?.mainFile) {
      const link = document.createElement('a');
      link.href = `/api/download?file=${encodeURIComponent(versionFile.mainFile)}`;
      link.download = versionFile.mainFile.split('/').pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!selectedVersion) {
    return (
      <div className="h-full bg-[#0a0a1a]/90 rounded-xl shadow-lg p-6 border border-gray-800">
        <div className="text-gray-400 text-center py-8">
          Select a version to view details
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-[#0a0a1a]/90 rounded-xl shadow-lg p-6 border border-gray-800 overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div>
            <h2 className="text-xl font-semibold text-gray-200">{selectedVersion.versionName}</h2>
            <p className="text-sm text-gray-400">{selectedVersion.summary}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          {versionFile?.mainFile && (
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
            >
              <Download size={16} />
              Download
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
          >
            <Save size={16} />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-400 text-center py-8">
          Loading version details...
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main File Viewer */}
          {versionFile?.mainFile && (
            <div className="bg-[#111827]/70 border border-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-200 mb-3">Main File</h3>
              <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
                {versionFile.mainFile.endsWith('.pdf') ? (
                  <iframe
                    src={versionFile.mainFile}
                    className="w-full h-96 rounded"
                    title="PDF Viewer"
                  />
                ) : (
                  <div className="text-gray-300">
                    <p>File: {versionFile.mainFile.split('/').pop()}</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Click download to view this file
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Code Snippet */}
          <div className="bg-[#111827]/70 border border-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-200 mb-3">Code Snippet</h3>
            <textarea
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              placeholder="Enter code snippet..."
              rows={8}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-gray-200 placeholder-gray-500 font-mono"
            />
          </div>

          {/* Expected Output */}
          <div className="bg-[#111827]/70 border border-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-200 mb-3">Expected Output</h3>
            <textarea
              value={expectedOutput}
              onChange={(e) => setExpectedOutput(e.target.value)}
              placeholder="Enter expected output..."
              rows={4}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-gray-200 placeholder-gray-500 font-mono"
            />
          </div>

          {/* Test Case */}
          <div className="bg-[#111827]/70 border border-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-200 mb-3">Test Case</h3>
            <textarea
              value={testCase}
              onChange={(e) => setTestCase(e.target.value)}
              placeholder="Enter test case..."
              rows={4}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-gray-200 placeholder-gray-500 font-mono"
            />
          </div>
        </div>
      )}
    </div>
  );
}