"use client";
import { useState, useEffect } from "react";
import UpdateProject from "./UpdateProject";

export default function ProjectVersions({ selectedProject, onVersionSelect }) {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedProject?.projectId?._id) {
      fetchVersions();
    }
  }, [selectedProject]);

  const fetchVersions = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/version/project?projectId=${selectedProject.projectId._id}`);
      const data = await response.json();
      if (response.ok) {
        setVersions(data.versions);
      }
    } catch (error) {
      console.error('Error fetching versions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a1a]/90 rounded-xl shadow-lg border border-gray-800 relative">
      <div className="p-6 pb-4">
        <h2 className="text-xl font-semibold text-gray-200 tracking-wide">
          {selectedProject ? `${selectedProject.projectName} - Versions` : 'Select a Project'}
        </h2>
      </div>
      
      <div className="flex-1 overflow-y-auto px-6 pb-32">
        {!selectedProject ? (
          <div className="text-gray-400 text-center py-8">
            Select a project from the sidebar to view versions
          </div>
        ) : loading ? (
          <div className="text-gray-400 text-center py-8">
            Loading versions...
          </div>
        ) : (
          <div className="space-y-3">
            {versions.length === 0 ? (
              <div className="text-gray-400 text-center py-8">
                No versions found. Create your first version below!
              </div>
            ) : (
              versions.map((ver) => (
                <div
                  key={ver._id}
                  onClick={() => onVersionSelect?.(ver)}
                  className="p-4 rounded-lg bg-[#111827]/70 border border-gray-700 hover:border-blue-400 transition cursor-pointer"
                >
                  <p className="text-sm font-medium text-gray-200">{ver.versionName}</p>
                  <p className="text-xs text-gray-400">{new Date(ver.createdAt).toLocaleDateString()}</p>
                  <p className="text-xs text-gray-300 mt-1">{ver.summary}</p>
                  <p className="text-xs text-gray-500">By: {ver.createdBy?.email}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
      
      {selectedProject && (
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <UpdateProject selectedProject={selectedProject} onVersionCreated={fetchVersions} />
        </div>
      )}
    </div>
  );
}
