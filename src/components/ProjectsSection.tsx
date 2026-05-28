import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  X,
  Check,
  MoreVertical,
  FolderKanban,
  PlusCircle,
} from 'lucide-react';

interface TeamMember {
  initials: string;
  color: string;
}

interface Project {
  id: string;
  name: string;
  client: string;
  budgetUsed: number;
  budgetTotal: number;
  color: string;
  members: TeamMember[];
  status: 'Active' | 'On Hold' | 'Completed';
}

const initialProjects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    client: 'Acme Corp',
    budgetUsed: 18450,
    budgetTotal: 25000,
    color: '#6366f1',
    members: [
      { initials: 'JD', color: '#6366f1' },
      { initials: 'AS', color: '#ec4899' },
      { initials: 'MK', color: '#1bc1a1' },
    ],
    status: 'Active',
  },
  {
    id: '2',
    name: 'Mobile App',
    client: 'Stark Industries',
    budgetUsed: 52800,
    budgetTotal: 75000,
    color: '#ec4899',
    members: [
      { initials: 'TS', color: '#f59e0b' },
      { initials: 'PP', color: '#6366f1' },
      { initials: 'NR', color: '#ef4444' },
    ],
    status: 'Active',
  },
  {
    id: '3',
    name: 'Cloud Migration',
    client: 'Wayne Enterprises',
    budgetUsed: 48900,
    budgetTotal: 50000,
    color: '#1bc1a1',
    members: [
      { initials: 'BW', color: '#334155' },
      { initials: 'AG', color: '#1bc1a1' },
      { initials: 'LF', color: '#ec4899' },
    ],
    status: 'Active',
  },
  {
    id: '4',
    name: 'E-commerce Platform',
    client: 'Umbrella Corp',
    budgetUsed: 67500,
    budgetTotal: 120000,
    color: '#f59e0b',
    members: [
      { initials: 'CW', color: '#ef4444' },
      { initials: 'JV', color: '#6366f1' },
      { initials: 'LW', color: '#f59e0b' },
    ],
    status: 'Active',
  },
  {
    id: '5',
    name: 'CRM Integration',
    client: 'Oscorp',
    budgetUsed: 12300,
    budgetTotal: 35000,
    color: '#8b5cf6',
    members: [
      { initials: 'NO', color: '#8b5cf6' },
      { initials: 'HG', color: '#1bc1a1' },
      { initials: 'PB', color: '#ec4899' },
    ],
    status: 'Active',
  },
  {
    id: '6',
    name: 'Marketing Dashboard',
    client: 'LexCorp',
    budgetUsed: 19800,
    budgetTotal: 28000,
    color: '#ef4444',
    members: [
      { initials: 'LL', color: '#ef4444' },
      { initials: 'MG', color: '#f59e0b' },
      { initials: 'SR', color: '#6366f1' },
    ],
    status: 'Active',
  },
  {
    id: '7',
    name: 'API Development',
    client: 'SHIELD',
    budgetUsed: 31200,
    budgetTotal: 45000,
    color: '#0ea5e9',
    members: [
      { initials: 'NF', color: '#334155' },
      { initials: 'MC', color: '#0ea5e9' },
      { initials: 'PH', color: '#1bc1a1' },
    ],
    status: 'Active',
  },
];

function getProgressColor(percent: number): string {
  if (percent > 95) return '#ef4444';
  if (percent >= 80) return '#f59e0b';
  return '#1bc1a1';
}

function formatCurrency(amount: number): string {
  return '$' + amount.toLocaleString('en-US');
}

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [showAddModal, setShowAddModal] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Form states
  const [newName, setNewName] = useState('');
  const [newClient, setNewClient] = useState('');
  const [newBudget, setNewBudget] = useState('');

  const colorPalette = ['#6366f1', '#ec4899', '#1bc1a1', '#f59e0b', '#8b5cf6', '#ef4444', '#0ea5e9'];

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newClient.trim() || !newBudget.trim()) return;

    const budgetVal = parseFloat(newBudget);
    if (isNaN(budgetVal) || budgetVal <= 0) return;

    const newProject: Project = {
      id: Date.now().toString(),
      name: newName.trim(),
      client: newClient.trim(),
      budgetUsed: 0,
      budgetTotal: budgetVal,
      color: colorPalette[projects.length % colorPalette.length],
      members: [
        { initials: 'YO', color: '#1bc1a1' },
      ],
      status: 'Active',
    };

    setProjects([...projects, newProject]);
    setNewName('');
    setNewClient('');
    setNewBudget('');
    setShowAddModal(false);
  };

  return (
    <div className="relative p-6">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6 select-none">
        <div>
          <h2 className="text-2xl font-extrabold font-sans text-slate-800 tracking-tight flex items-center gap-2 leading-none">
            <FolderKanban className="w-6 h-6 text-[#1bc1a1]" />
            Projects
          </h2>
          <p className="text-sm text-slate-400 mt-1.5">
            Manage your active projects and clients.
          </p>
        </div>

        {/* New Project Button */}
        <button
          onClick={() => {
            setShowAddModal(true);
            setOpenMenuId(null);
          }}
          className="px-4 py-2 bg-[#1bc1a1] hover:bg-[#159d83] text-white rounded-xl text-sm font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {projects.map((project) => {
          const percent = (project.budgetUsed / project.budgetTotal) * 100;
          const progressColor = getProgressColor(percent);
          const initial = project.name.charAt(0).toUpperCase();

          return (
            <motion.div
              key={project.id}
              whileHover={{ y: -3 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="p-5 rounded-2xl border border-slate-100 bg-white shadow-xs hover:shadow-md transition-shadow cursor-pointer"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {/* Project Initial Circle */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                    style={{ backgroundColor: project.color }}
                  >
                    {initial}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm tracking-tight">
                      {project.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">
                      {project.client}
                    </p>
                  </div>
                </div>

                {/* Three-dot Menu */}
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === project.id ? null : project.id);
                    }}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {openMenuId === project.id && (
                    <div className="absolute right-0 mt-1 w-32 bg-white border border-slate-100 rounded-xl shadow-lg z-20 py-1 text-xs font-semibold text-slate-600">
                      <button className="w-full text-left px-3 py-1.5 hover:bg-slate-50 transition-colors cursor-pointer">
                        Edit
                      </button>
                      <button className="w-full text-left px-3 py-1.5 hover:bg-slate-50 transition-colors cursor-pointer">
                        Archive
                      </button>
                      <button className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-500 transition-colors cursor-pointer">
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Budget Section */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                    Budget
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    {formatCurrency(project.budgetUsed)}{' '}
                    <span className="text-slate-400 font-medium">/ {formatCurrency(project.budgetTotal)}</span>
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(percent, 100)}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: progressColor }}
                  />
                </div>

                <p className="text-[10px] font-semibold mt-1.5" style={{ color: progressColor }}>
                  {percent.toFixed(1)}% utilized
                </p>
              </div>

              {/* Bottom Row: Team Avatars + Status */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50">
                {/* Team Avatars Stack */}
                <div className="flex items-center -space-x-2">
                  {project.members.map((member, idx) => (
                    <div
                      key={idx}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[9px] font-bold border-2 border-white"
                      style={{ backgroundColor: member.color, zIndex: project.members.length - idx }}
                    >
                      {member.initials}
                    </div>
                  ))}
                </div>

                {/* Status Badge */}
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-lg ${
                    project.status === 'Active'
                      ? 'bg-[#defff7] text-[#1bc1a1]'
                      : project.status === 'On Hold'
                      ? 'bg-amber-50 text-amber-500'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {project.status}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add New Project Modal Overlay */}
      <AnimatePresence>
        {showAddModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg p-6 bg-white border border-slate-100 rounded-2xl shadow-xl"
            >
              <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-3">
                <span className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <PlusCircle className="w-4.5 h-4.5 text-[#1bc1a1]" />
                  New Project
                </span>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-full text-slate-400 hover:bg-slate-100 cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                    Project Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Website Redesign"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2.5 border border-slate-200 rounded-xl outline-hidden focus:border-[#1bc1a1]/50 bg-white transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                    Client Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Acme Corp"
                    value={newClient}
                    onChange={(e) => setNewClient(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2.5 border border-slate-200 rounded-xl outline-hidden focus:border-[#1bc1a1]/50 bg-white transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                    Total Budget ($)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 50000"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2.5 border border-slate-200 rounded-xl outline-hidden focus:border-[#1bc1a1]/50 bg-white transition-colors"
                    min="1"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-50">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-500 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-[#1bc1a1] hover:bg-[#159d83] text-white text-xs font-semibold shadow-xs flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Create Project</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
