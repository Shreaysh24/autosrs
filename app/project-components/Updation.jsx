"use client";
import { useState } from "react";

export default function UpdateProject() {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    console.log("New version added:", input);
    setInput("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center space-x-2 mt-4 fixed bottom-2 w-[77%] bg-[#111827]/70 border border-gray-700 rounded-lg p-3 shadow-lg"
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Update version notes..."
        className="flex-1 bg-transparent outline-none text-gray-200 placeholder-gray-500"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold hover:opacity-90 transition"
      >
        Update
      </button>
    </form>
  );
}
