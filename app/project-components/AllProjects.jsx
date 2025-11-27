"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function AllProjects({ onProjectSelect }) {
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      fetchProjects();
    }
  }, [session]);

  const fetchProjects = async () => {
    try {
      console.log('Fetching projects from API...');
      const response = await fetch('/api/projects/user');
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('API Response data:', data);
      
      if (response.ok && Array.isArray(data.projects)) {
        console.log('Setting projects:', data.projects.length);
        setProjects(data.projects);
      } else {
        console.log('No projects or error:', data);
        setProjects([]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    onProjectSelect?.(project);
  };

  // Safe helper functions
  const getProjectKey = (project) => {
    return project?.projectId?._id?.toString() || 
           project?._id?.toString() || 
           `project-${Math.random()}`;
  };

  const getProjectName = (project) => {
    return project?.projectName || 
           project?.projectId?.projectName || 
           'Unknown Project';
  };

  const getInitials = (projectName) => {
    if (!projectName || typeof projectName !== 'string') return 'P';
    return projectName.charAt(0).toUpperCase() || 'P';
  };

  const isProjectSelected = (project) => {
    if (!selectedProject || !project) return false;
    
    const selectedId = selectedProject?.projectId?._id?.toString() || 
                      selectedProject?._id?.toString();
    const currentId = project?.projectId?._id?.toString() || 
                     project?._id?.toString();
    
    return selectedId && currentId && selectedId === currentId;
  };

  const formatEnrollDate = (enrolledAt) => {
    try {
      return new Date(enrolledAt || Date.now()).toLocaleDateString();
    } catch {
      return 'Unknown';
    }
  };

  return (
    <div className="h-full bg-gradient-to-b from-[#0a0a1a] to-[#0a1a3a] p-4 overflow-y-auto">
      <h2 className="text-lg font-semibold mb-4 text-gray-200 tracking-wide">
        All Projects
      </h2>
      {loading ? (
        <div className="text-gray-400 text-sm">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="text-gray-400 text-sm">No projects found</div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => {
            const projectName = getProjectName(project);
            const initials = getInitials(projectName);
            const isSelected = isProjectSelected(project);
            const projectKey = getProjectKey(project);

            return (
              <div
                key={projectKey}
                onClick={() => handleProjectClick(project)}
                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all border ${
                  isSelected
                    ? "bg-blue-900/60 border-blue-500 shadow-md"
                    : "bg-[#111827]/70 border-transparent hover:bg-blue-800/40 hover:border-blue-400"
                }`}
              >
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center rounded-full font-bold">
                  {initials}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-200">{projectName}</p>
                  <p className="text-xs text-gray-400">
                    Enrolled: {formatEnrollDate(project.enrolledAt)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
