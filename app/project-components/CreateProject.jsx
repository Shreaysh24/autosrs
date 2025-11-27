"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Plus, Upload, X } from "lucide-react";

export default function CreateProject({ onProjectCreated }) {
  const [showForm, setShowForm] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!projectName.trim() || !session) return;

    setLoading(true);
    try {
      // Create project
      const projectResponse = await fetch('/api/projects/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectName })
      });

      if (!projectResponse.ok) throw new Error('Failed to create project');
      const { project } = await projectResponse.json();

      // Create initial version
      const versionResponse = await fetch('/api/version/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project._id,
          versionName: 'v1.0',
          summary: description || 'Initial version'
        })
      });

      if (!versionResponse.ok) throw new Error('Failed to create version');
      const { version } = await versionResponse.json();

      // Upload version file if provided
      if (file || description) {
        const formData = new FormData();
        formData.append('projectId', project._id);
        formData.append('versionId', version._id);
        formData.append('codeSnippet', description || '');
        formData.append('expectedOutput', 'Initial project setup');
        formData.append('testCase', 'Project creation validation');
        
        if (file) {
          formData.append('mainFile', file);
        }

        const fileResponse = await fetch('/api/version-file/upload', {
          method: 'POST',
          body: formData
        });

        if (!fileResponse.ok) throw new Error('Failed to upload version file');
      }

      // Reset form
      setProjectName("");
      setDescription("");
      setFile(null);
      setShowForm(false);
      
      onProjectCreated?.();
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  return (
    <div className="mb-6">
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          <Plus size={16} />
          New Project
        </button>
      ) : (
        <div className="bg-[#111827]/90 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Create New Project</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Project Name *
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter project name"
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-gray-200 placeholder-gray-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Project description or requirements"
                rows={3}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-gray-200 placeholder-gray-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Reference Document (Optional)
              </label>
              <div className="flex items-center gap-4">
                <label className="cursor-pointer flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition">
                  <Upload size={16} />
                  Choose File
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.docx,.txt,.md"
                  />
                </label>
                
                {file && (
                  <div className="flex items-center gap-2 bg-gray-800 border border-gray-600 text-gray-200 px-3 py-2 rounded-lg">
                    <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="text-red-400 hover:text-red-300"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading || !projectName.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Project'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}