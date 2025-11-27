"use client";
import { useState, useEffect } from "react";
import { Users, Plus, X } from "lucide-react";

export default function Collaboration({ selectedProject }) {
  const [collaborators, setCollaborators] = useState([]);
  const [owner, setOwner] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("editor");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedProject?.projectId?._id) {
      fetchCollaborators();
    }
  }, [selectedProject]);

  const fetchCollaborators = async () => {
    try {
      const response = await fetch(`/api/projects/collaborators?projectId=${selectedProject.projectId._id}`);
      const data = await response.json();
      if (response.ok) {
        setCollaborators(data.collaborators);
        setOwner(data.owner);
      }
    } catch (error) {
      console.error('Error fetching collaborators:', error);
    }
  };

  const handleAddCollaborator = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/projects/collaborators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: selectedProject.projectId._id,
          email,
          role
        })
      });

      if (response.ok) {
        setEmail("");
        setShowAddForm(false);
        fetchCollaborators();
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to add collaborator');
      }
    } catch (error) {
      console.error('Error adding collaborator:', error);
      alert('Failed to add collaborator');
    } finally {
      setLoading(false);
    }
  };

  if (!selectedProject) {
    return (
      <div className="bg-[#0a0a1a]/90 rounded-xl shadow-lg p-6 border border-gray-800">
        <div className="text-gray-400 text-center py-8">
          Select a project to view collaborators
        </div>
      </div>
    );
  }

  const isOwner = owner && selectedProject.projectId.ownerId === owner._id;

  return (
    <div className="bg-[#0a0a1a]/90 rounded-xl shadow-lg p-6 border border-gray-800">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
          <Users size={20} />
          Collaborators
        </h3>
        {isOwner && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
          >
            <Plus size={16} />
            Add
          </button>
        )}
      </div>

      {showAddForm && (
        <div className="mb-4 p-4 bg-[#111827]/70 border border-gray-700 rounded-lg">
          <form onSubmit={handleAddCollaborator} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter user email"
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-gray-200 placeholder-gray-500"
              required
            />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-gray-200"
            >
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Collaborator'}
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {/* Owner */}
        {owner && (
          <div className="p-3 rounded-lg bg-[#111827]/70 border border-yellow-500/30">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-200">{owner.email}</p>
                <p className="text-xs text-yellow-400">Owner</p>
              </div>
              <div className="w-8 h-8 bg-yellow-500 text-white flex items-center justify-center rounded-full font-bold">
                {owner.email[0]?.toUpperCase()}
              </div>
            </div>
          </div>
        )}

        {/* Collaborators */}
        {collaborators.filter(c => c.role !== 'owner').map((collaborator) => (
          <div key={collaborator._id} className="p-3 rounded-lg bg-[#111827]/70 border border-gray-700">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-200">{collaborator.userId?.email}</p>
                <p className="text-xs text-gray-400 capitalize">{collaborator.role}</p>
                <p className="text-xs text-gray-500">Added: {new Date(collaborator.addedAt).toLocaleDateString()}</p>
              </div>
              <div className="w-8 h-8 bg-blue-500 text-white flex items-center justify-center rounded-full font-bold">
                {collaborator.userId?.email[0]?.toUpperCase()}
              </div>
            </div>
          </div>
        ))}

        {collaborators.filter(c => c.role !== 'owner').length === 0 && (
          <div className="text-gray-400 text-center py-4">
            No collaborators added yet
          </div>
        )}
      </div>
    </div>
  );
}