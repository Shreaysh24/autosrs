"use client";
import { useState } from "react";

export default function ProjectVersions() {
  const [versions] = useState([
    { id: 1, version: "v1.0", date: "2025-01-10", notes: "Initial Release" },
    { id: 2, version: "v1.1", date: "2025-02-14", notes: "Bug fixes and UI update" },
    { id: 3, version: "v2.0", date: "2025-03-20", notes: "Major feature release" },
  ]);

  return (
    <div className="h-[80%] overflow-y-auto  bg-[#0a0a1a]/90 rounded-xl shadow-lg p-6 border border-gray-800">
      <h2 className="text-xl font-semibold mb-4 text-gray-200 tracking-wide">
        Project Versions
      </h2>
      <div className="space-y-3">
        {versions.map((ver) => (
          <div
            key={ver.id}
            className="p-4 rounded-lg bg-[#111827]/70 border border-gray-700 hover:border-blue-400 transition"
          >
            <p className="text-sm font-medium text-gray-200">{ver.version}</p>
            <p className="text-xs text-gray-400">{ver.date}</p>
            <p className="text-xs text-gray-300 mt-1">{ver.notes}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
