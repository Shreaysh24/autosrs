"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import AllProjects from "../project-components/AllProjects";
import ProjectVersions from "../project-components/ProjectVersions";

import Collaboration from "../project-components/Collaboration";
import VersionPage from "../project-components/VersionPage";
import CreateProject from "../project-components/CreateProject";

function ProjectsPage() {
  const { data: session, status } = useSession();
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [currentView, setCurrentView] = useState("versions"); // "versions", "version-detail", "collaboration"
  const [refreshVersions, setRefreshVersions] = useState(0);
  const [refreshProjects, setRefreshProjects] = useState(0);

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-b from-[#0a0a1a] to-[#0a1a3a]">
        <div className="text-gray-200">Loading...</div>
      </div>
    );
  }

  if (!session) {
    redirect("/authentication/sign-in");
  }

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    setSelectedVersion(null);
    setCurrentView("versions");
  };

  const handleVersionSelect = (version) => {
    setSelectedVersion(version);
    setCurrentView("version-detail");
  };



  const handleVersionCreated = () => {
    setRefreshVersions(prev => prev + 1);
  };

  const handleProjectCreated = () => {
    setRefreshProjects(prev => prev + 1);
  };

  const handleBackToVersions = () => {
    setSelectedVersion(null);
    setCurrentView("versions");
  };

  const renderMainContent = () => {
    switch (currentView) {
      case "version-detail":
        return (
          <VersionPage
            selectedVersion={selectedVersion}
            onBack={handleBackToVersions}
          />
        );
      case "collaboration":
        return <Collaboration selectedProject={selectedProject} />;
      default:
        return (
          <ProjectVersions
            selectedProject={selectedProject}
            onVersionSelect={handleVersionSelect}
            key={refreshVersions}
          />
        );
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <div className="w-1/5 border-r border-gray-800 flex flex-col">
        <div className="p-4">
          <CreateProject onProjectCreated={handleProjectCreated} />
        </div>
        <div className="flex-1">
          <AllProjects onProjectSelect={handleProjectSelect} key={refreshProjects} />
        </div>
      </div>

      {/* Right Side */}
      <div className="w-4/5 flex flex-col bg-gradient-to-b from-[#0a0a1a] to-[#0a1a3a]">
        {/* Navigation Tabs */}
        {selectedProject && (
          <div className="flex border-b border-gray-800 bg-[#0a0a1a]/50">
            <button
              onClick={() => setCurrentView("versions")}
              className={`px-6 py-3 text-sm font-medium transition ${
                currentView === "versions"
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Versions
            </button>
            <button
              onClick={() => setCurrentView("collaboration")}
              className={`px-6 py-3 text-sm font-medium transition ${
                currentView === "collaboration"
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-gray-200"
              }`}
            >
              Collaborators
            </button>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 p-6 relative">
          {renderMainContent()}
        </div>
      </div>
    </div>
  );
}

export default ProjectsPage;