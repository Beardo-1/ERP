import React, { useState } from 'react';
import { projects as mockProjects, customers } from '../data/mockData';
import { ProjectStatus, Project } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState(mockProjects);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState({ 
    name: '', 
    customerId: '', 
    status: ProjectStatus.PLANNED, 
    startDate: '', 
    endDate: '',
    description: '',
    budget: 0
  });

  const openAdd = () => { 
    setEditing(null); 
    setForm({ 
      name: '', 
      customerId: '', 
      status: ProjectStatus.PLANNED, 
      startDate: '', 
      endDate: '',
      description: '',
      budget: 0
    }); 
    setShowModal(true); 
  };
  
  const openEdit = (project: Project) => { 
    setEditing(project); 
    setForm({
      name: project.name,
      customerId: project.customerId || '',
      status: project.status,
      startDate: project.startDate ? project.startDate.toISOString().split('T')[0] : '',
      endDate: project.endDate ? project.endDate.toISOString().split('T')[0] : '',
      description: project.description || '',
      budget: project.budget || 0
    }); 
    setShowModal(true); 
  };
  
  const closeModal = () => setShowModal(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      setProjects(projects.map(p => p.id === editing.id ? { 
        ...editing, 
        ...form,
        startDate: form.startDate ? new Date(form.startDate) : editing.startDate,
        endDate: form.endDate ? new Date(form.endDate) : editing.endDate,
        updatedAt: new Date()
      } : p));
    } else {
      const newProject: Project = { 
        ...form, 
        id: Date.now().toString(),
        startDate: new Date(form.startDate),
        endDate: form.endDate ? new Date(form.endDate) : undefined,
        createdAt: new Date(), 
        updatedAt: new Date() 
      };
      setProjects([...projects, newProject]);
    }
    closeModal();
  };
  
  const deleteProject = (id: string) => setProjects(projects.filter(p => p.id !== id));

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.PLANNED: return 'bg-blue-100 text-blue-800 border-blue-200';
      case ProjectStatus.IN_PROGRESS: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case ProjectStatus.ON_HOLD: return 'bg-orange-100 text-orange-800 border-orange-200';
      case ProjectStatus.COMPLETED: return 'bg-green-100 text-green-800 border-green-200';
      case ProjectStatus.CANCELLED: return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: ProjectStatus) => {
    switch (status) {
      case ProjectStatus.PLANNED:
        return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>;
      case ProjectStatus.IN_PROGRESS:
        return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
      case ProjectStatus.ON_HOLD:
        return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
      case ProjectStatus.COMPLETED:
        return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
      case ProjectStatus.CANCELLED:
        return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
      default:
        return null;
    }
  };

  const completedProjects = projects.filter(p => p.status === ProjectStatus.COMPLETED).length;
  const inProgressProjects = projects.filter(p => p.status === ProjectStatus.IN_PROGRESS).length;
  const totalBudget = projects.reduce((sum, project) => sum + (project.budget || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Project Management
            </h1>
            <p className="text-gray-600 font-medium">Track and manage your projects from start to finish</p>
          </div>
          <Button 
            onClick={openAdd}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Project
            </span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Projects</p>
                  <p className="text-3xl font-bold">{projects.length}</p>
                </div>
                <div className="bg-blue-400 bg-opacity-30 p-3 rounded-xl">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Completed</p>
                  <p className="text-3xl font-bold">{completedProjects}</p>
                </div>
                <div className="bg-green-400 bg-opacity-30 p-3 rounded-xl">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-0 shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">In Progress</p>
                  <p className="text-3xl font-bold">{inProgressProjects}</p>
                </div>
                <div className="bg-yellow-400 bg-opacity-30 p-3 rounded-xl">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-xl">
            <div className="p-6">
              <div className="flex items-center justify-between">
    <div>
                  <p className="text-purple-100 text-sm font-medium">Total Budget</p>
                  <p className="text-3xl font-bold">${totalBudget.toLocaleString()}</p>
                </div>
                <div className="bg-purple-400 bg-opacity-30 p-3 rounded-xl">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {projects.map((project) => (
          <Card 
            key={project.id} 
            className="group hover:scale-105 transition-all duration-300 hover:shadow-2xl bg-white/80 backdrop-blur-sm border border-white/20 shadow-xl"
          >
            <div className="p-6">
              {/* Project Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {project.customerId ? customers.find(c => c.id === project.customerId)?.name || 'No Customer' : 'Internal Project'}
                  </p>
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={() => openEdit(project)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => deleteProject(project.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Project Budget */}
              {project.budget && (
                <div className="mb-4">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    ${project.budget.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    Project Budget
                  </div>
                </div>
              )}

              {/* Project Status */}
              <div className="mb-4">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
                  {getStatusIcon(project.status)}
                  {project.status.replace('_', ' ')}
                </span>
              </div>

              {/* Project Dates */}
              <div className="mb-4 space-y-1">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Start:</span> {project.startDate.toLocaleDateString()}
                </div>
                {project.endDate && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">End:</span> {project.endDate.toLocaleDateString()}
                  </div>
                )}
              </div>

              {/* Project Description */}
              {project.description && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {project.description}
                  </p>
                </div>
              )}

              {/* Project Actions */}
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <Button
                  onClick={() => openEdit(project)}
                  variant="outline"
                  size="small"
                  className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => deleteProject(project.id)}
                  variant="outline"
                  size="small"
                  className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 w-full max-w-md">
            <form onSubmit={handleSubmit} className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editing ? 'Edit Project' : 'Add New Project'}
                </h2>
                <button
                  type="button"
                  onClick={closeModal}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <Input
                  placeholder="Project Name"
                  value={form.name}
                  onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                />

                <div>
                  <select 
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium"
                    value={form.customerId} 
                    onChange={(e) => setForm(f => ({ ...f, customerId: e.target.value }))}
                  >
                    <option value="">Select Customer (Optional)</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
            </select>
                </div>

                <div>
                  <select 
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium"
                    value={form.status} 
                    onChange={(e) => setForm(f => ({ ...f, status: e.target.value as ProjectStatus }))}
                  >
                    {Object.values(ProjectStatus).map(status => (
                      <option key={status} value={status}>
                        {status.replace('_', ' ')}
                      </option>
                    ))}
            </select>
                </div>

                <Input
                  type="number"
                  placeholder="Budget (Optional)"
                  value={form.budget}
                  onChange={(e) => setForm(f => ({ ...f, budget: Number(e.target.value) }))}
                />

                <Input
                  type="date"
                  placeholder="Start Date"
                  value={form.startDate}
                  onChange={(e) => setForm(f => ({ ...f, startDate: e.target.value }))}
                  required
                />

                <Input
                  type="date"
                  placeholder="End Date (Optional)"
                  value={form.endDate}
                  onChange={(e) => setForm(f => ({ ...f, endDate: e.target.value }))}
                />

                <div>
                  <textarea
                    className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium resize-none"
                    placeholder="Project Description (optional)"
                    value={form.description}
                    onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                >
                  {editing ? 'Update Project' : 'Create Project'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeModal}
                  className="flex-1"
                >
                  Cancel
                </Button>
            </div>
          </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage; 