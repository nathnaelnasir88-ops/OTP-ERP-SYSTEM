import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  DollarSign,
  ArrowRight,
  TrendingUp,
  ListTodo,
  FileText,
  SlidersHorizontal,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { Project, ProjectStatus, PriorityLevel, Task, TaskStatus } from '../../types';

export const ProjectsModule: React.FC = () => {
  const {
    projects,
    addProject,
    updateProject,
    tasks,
    addTask,
    updateTask,
    clients,
    employees,
    setCurrentModule
  } = useERP();

  const [viewMode, setViewMode] = useState<'kanban' | 'table' | 'detail'>('kanban');
  const [selectedProject, setSelectedProject] = useState<Project | null>(projects[0] || null);

  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  // New Project State
  const [newProject, setNewProject] = useState({
    projectId: `PRJ-24-${Math.floor(10 + Math.random() * 90)}`,
    name: '',
    clientId: clients[0]?.id || '',
    projectManagerId: 'emp-3',
    budget: 1200000,
    spent: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'High' as PriorityLevel,
    status: 'Active' as ProjectStatus,
    progressPercentage: 10,
    deliverables: 'Deliverables scoping, video production, graphic carousels, and ads distribution'
  });

  // New Task State
  const [newTask, setNewTask] = useState({
    taskId: `TSK-${Math.floor(100 + Math.random() * 900)}`,
    projectId: selectedProject?.id || projects[0]?.id || '',
    title: '',
    description: '',
    assigneeId: employees[3]?.id || 'emp-4',
    priority: 'Medium' as PriorityLevel,
    status: 'Todo' as TaskStatus,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    estimatedHours: 8,
    actualHours: 0
  });

  const statuses: ProjectStatus[] = [
    'Planning',
    'Active',
    'On Hold',
    'In Review',
    'Completed',
    'Cancelled'
  ];

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name.trim()) return;
    addProject(newProject);
    setShowAddProjectModal(false);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    addTask(newTask);
    setShowAddTaskModal(false);
    setNewTask({
      taskId: `TSK-${Math.floor(100 + Math.random() * 900)}`,
      projectId: selectedProject?.id || '',
      title: '',
      description: '',
      assigneeId: 'emp-4',
      priority: 'Medium',
      status: 'Todo',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      estimatedHours: 8,
      actualHours: 0
    });
  };

  const projectTasks = selectedProject
    ? tasks.filter((t) => t.projectId === selectedProject.id)
    : [];

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('kanban')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'kanban'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Kanban Board
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'table'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Table View ({projects.length})
          </button>
          <button
            onClick={() => setViewMode('detail')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'detail'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Operations Dossier & Tasks
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddTaskModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors"
          >
            <ListTodo className="w-3.5 h-3.5" />
            <span>Create Task</span>
          </button>

          <button
            onClick={() => setShowAddProjectModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs shadow-blue-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Agency Project</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: KANBAN BOARD */}
      {viewMode === 'kanban' && (
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-[1250px]">
            {statuses.map((status) => {
              const statusProjects = projects.filter((p) => p.status === status);
              return (
                <div
                  key={status}
                  className="flex-1 bg-slate-50/80 rounded-2xl p-3 border border-slate-200/80 min-w-[210px] flex flex-col"
                >
                  <div className="flex items-center justify-between px-1 mb-3">
                    <span className="text-xs font-bold text-slate-800">{status}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
                      {statusProjects.length}
                    </span>
                  </div>

                  <div className="space-y-3 flex-1 overflow-y-auto max-h-[580px]">
                    {statusProjects.map((proj) => {
                      const client = clients.find((c) => c.id === proj.clientId);
                      const projTasks = tasks.filter((t) => t.projectId === proj.id);
                      const completedTasks = projTasks.filter((t) => t.status === 'Done').length;

                      return (
                        <div
                          key={proj.id}
                          onClick={() => {
                            setSelectedProject(proj);
                            setViewMode('detail');
                          }}
                          className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group"
                        >
                          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-1">
                            <span>{proj.projectId}</span>
                            <span
                              className={`px-1.5 py-0.2 rounded font-semibold ${
                                proj.priority === 'Critical'
                                  ? 'bg-rose-100 text-rose-700'
                                  : proj.priority === 'High'
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {proj.priority}
                            </span>
                          </div>

                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {proj.name}
                          </h4>

                          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                            <span className="font-medium text-slate-700">
                              {client?.companyName || 'General Client'}
                            </span>
                          </div>

                          {/* Progress Bar */}
                          <div className="mt-3">
                            <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                              <span>Progress</span>
                              <span className="font-semibold text-slate-800">
                                {proj.progressPercentage}%
                              </span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className="h-full bg-blue-600 rounded-full transition-all"
                                style={{ width: `${proj.progressPercentage}%` }}
                              />
                            </div>
                          </div>

                          {/* Budget & Tasks footer */}
                          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                            <span className="font-bold text-slate-900">
                              {proj.budget.toLocaleString()} ETB
                            </span>
                            <span className="text-slate-500 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                              {completedTasks}/{projTasks.length} tasks
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Project ID</th>
                  <th className="py-3 px-4">Project Name</th>
                  <th className="py-3 px-4">Client</th>
                  <th className="py-3 px-4">Budget</th>
                  <th className="py-3 px-4">Spent</th>
                  <th className="py-3 px-4">Timeline</th>
                  <th className="py-3 px-4">Progress</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {projects.map((proj) => {
                  const client = clients.find((c) => c.id === proj.clientId);
                  return (
                    <tr key={proj.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-slate-500">{proj.projectId}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{proj.name}</td>
                      <td className="py-3 px-4 text-slate-700 font-medium">
                        {client?.companyName || 'Corporate Client'}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {proj.budget.toLocaleString()} ETB
                      </td>
                      <td className="py-3 px-4 text-slate-600">{proj.spent.toLocaleString()} ETB</td>
                      <td className="py-3 px-4 text-slate-500 text-[11px]">
                        {proj.startDate} → {proj.endDate}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full bg-blue-600 rounded-full"
                              style={{ width: `${proj.progressPercentage}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-bold text-slate-700">
                            {proj.progressPercentage}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={proj.status}
                          onChange={(e) =>
                            updateProject(proj.id, { status: e.target.value as ProjectStatus })
                          }
                          className="text-[11px] bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 font-semibold text-slate-800"
                        >
                          {statuses.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedProject(proj);
                            setViewMode('detail');
                          }}
                          className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                        >
                          Open Dossier
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: PROJECT OPERATIONS DOSSIER & TASKS */}
      {viewMode === 'detail' && selectedProject && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Project Overview & Tasks */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <div className="text-[11px] font-mono text-slate-400">{selectedProject.projectId}</div>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">{selectedProject.name}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      selectedProject.status === 'Active'
                        ? 'bg-blue-100 text-blue-800'
                        : selectedProject.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    {selectedProject.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">Client Organization</span>
                  <span className="font-semibold text-slate-800">
                    {clients.find((c) => c.id === selectedProject.clientId)?.companyName || 'Direct Client'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Project Budget</span>
                  <span className="font-bold text-slate-900">
                    {selectedProject.budget.toLocaleString()} ETB
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Actual Spent</span>
                  <span className="font-semibold text-slate-700">
                    {selectedProject.spent.toLocaleString()} ETB
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Progress</span>
                  <span className="font-bold text-blue-600">
                    {selectedProject.progressPercentage}%
                  </span>
                </div>
              </div>

              {selectedProject.deliverables && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                  <div className="font-semibold text-slate-700 mb-0.5">Core Deliverables & Scope</div>
                  <p className="text-slate-600 leading-relaxed">{selectedProject.deliverables}</p>
                </div>
              )}
            </div>

            {/* Tasks Section */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Deliverable Task Items</h3>
                  <p className="text-xs text-slate-500">Milestone assignments and hours logged</p>
                </div>
                <button
                  onClick={() => setShowAddTaskModal(true)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Task
                </button>
              </div>

              <div className="space-y-2.5">
                {projectTasks.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-400">
                    No tasks logged for this project yet. Click &quot;Add Task&quot; above to create one.
                  </div>
                ) : (
                  projectTasks.map((t) => {
                    const assignee = employees.find((e) => e.id === t.assigneeId);
                    return (
                      <div
                        key={t.id}
                        className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={t.status === 'Done'}
                            onChange={(e) =>
                              updateTask(t.id, { status: e.target.checked ? 'Done' : 'In Progress' })
                            }
                            className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                          />
                          <div>
                            <h4
                              className={`font-bold ${
                                t.status === 'Done'
                                  ? 'line-through text-slate-400'
                                  : 'text-slate-900'
                              }`}
                            >
                              {t.title}
                            </h4>
                            <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                              <span>Due {t.dueDate}</span>
                              <span>•</span>
                              <span>Assigned to {assignee?.fullName || 'Creative Team'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-[11px] font-mono text-slate-500">
                            {t.actualHours}/{t.estimatedHours} hrs
                          </span>
                          <select
                            value={t.status}
                            onChange={(e) =>
                              updateTask(t.id, { status: e.target.value as TaskStatus })
                            }
                            className="text-[11px] bg-white border border-slate-200 rounded-lg px-2 py-1 font-semibold text-slate-800"
                          >
                            <option value="Todo">Todo</option>
                            <option value="In Progress">In Progress</option>
                            <option value="In Review">In Review</option>
                            <option value="Done">Done</option>
                          </select>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Right Col: Quick Switching & Project Connected Modules */}
          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-3">All Active Projects</h3>
              <div className="space-y-2">
                {projects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProject(p)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      selectedProject.id === p.id
                        ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="truncate">{p.name}</span>
                    <span className="text-[10px] text-slate-400 shrink-0">{p.progressPercentage}%</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-5 rounded-2xl shadow-md">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-2">
                Connected Modules
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                This project automatically synchronizes with OTP SMM content calendars, live performance ad campaigns, and dual-stream invoicing.
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => setCurrentModule('smm')}
                  className="w-full py-2 px-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-semibold flex items-center justify-between"
                >
                  <span>Open Connected SMM Hub</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setCurrentModule('advertising')}
                  className="w-full py-2 px-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-semibold flex items-center justify-between"
                >
                  <span>Open Ad Campaign Tracker</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD PROJECT */}
      {showAddProjectModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Create New Agency Project</h3>
              <button
                onClick={() => setShowAddProjectModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="e.g. Telebirr Diaspora Q4 Activation"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Assign Client *</label>
                  <select
                    value={newProject.clientId}
                    onChange={(e) => setNewProject({ ...newProject, clientId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  >
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.companyName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Project Budget (ETB)</label>
                  <input
                    type="number"
                    value={newProject.budget}
                    onChange={(e) => setNewProject({ ...newProject, budget: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newProject.startDate}
                    onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">End Date</label>
                  <input
                    type="date"
                    value={newProject.endDate}
                    onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Priority</label>
                  <select
                    value={newProject.priority}
                    onChange={(e) => setNewProject({ ...newProject, priority: e.target.value as PriorityLevel })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Status</label>
                  <select
                    value={newProject.status}
                    onChange={(e) => setNewProject({ ...newProject, status: e.target.value as ProjectStatus })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Deliverables & Scope</label>
                <textarea
                  rows={2}
                  value={newProject.deliverables}
                  onChange={(e) => setNewProject({ ...newProject, deliverables: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddProjectModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD TASK */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 text-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-900">Add Project Task</h3>
              <button
                onClick={() => setShowAddTaskModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Project Assignment *</label>
                <select
                  value={newTask.projectId}
                  onChange={(e) => setNewTask({ ...newTask, projectId: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                >
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="e.g. 4K Drone footage shoot at Entoto"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Assignee</label>
                  <select
                    value={newTask.assigneeId}
                    onChange={(e) => setNewTask({ ...newTask, assigneeId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  >
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.fullName} ({emp.department})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Estimated Hours</label>
                  <input
                    type="number"
                    value={newTask.estimatedHours}
                    onChange={(e) => setNewTask({ ...newTask, estimatedHours: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as PriorityLevel })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
