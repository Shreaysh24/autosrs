import React from "react";
import AllProjects from "../project-components/AllProjects";
import ProjectVersions from "../project-components/ProjectVersions";
import UpdateProject from "../project-components/Updation";

function ProjectsPage  ()  {
  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <div className="w-1/5 border-r border-gray-800">
        <AllProjects />
      </div>

      {/* Right Side */}
      <div className="w-4/5 flex flex-col p-6 bg-gradient-to-b from-[#0a0a1a] to-[#0a1a3a]">
        <ProjectVersions />
        <UpdateProject />
      </div>
    </div>
  );
};

export default ProjectsPage;
