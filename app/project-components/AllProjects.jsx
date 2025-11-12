"use client";
import { useState } from "react";

export default function AllProjects() {
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = [
    { id: 1, name: "AI Chatbot", description: "Conversational AI assistant" },
    { id: 2, name: "E-Commerce App", description: "Online shopping platform" },
    { id: 3, name: "Portfolio Website", description: "Personal branding site" },
  ];

  return (
    <aside className="h-full bg-gradient-to-b mt-7 fixed from-[#0a0a1a] to-[#0a1a3a] border-r border-gray-800 p-4 overflow-y-auto shadow-lg">
      <h2 className="text-lg font-semibold mb-4 text-gray-200 tracking-wide">
        All Projects
      </h2>
      <div className="space-y-3">
        {projects.map((project) => {
          const initials = project.name[0]?.toUpperCase() || "P";
          const isSelected = selectedProject?.id === project.id;

          return (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
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
                <p className="text-sm font-medium text-gray-200">{project.name}</p>
                <p className="text-xs text-gray-400">{project.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
