import React from 'react';
import {
  LayoutDashboard,
  Clock,
  FolderKanban,
  Layers,
  BarChart3,
  Users
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Sidebar({
  activeTab,
  onTabChange
}: SidebarProps) {
  const navItems: Array<{ id: string; name: string; icon: any }> = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'timesheet', name: 'Timesheet', icon: Clock },
    { id: 'projects', name: 'Projects', icon: FolderKanban },
    { id: 'tasks', name: 'Task Board', icon: Layers },
    { id: 'reports', name: 'Reports', icon: BarChart3 },
    { id: 'team', name: 'Team', icon: Users },
  ];

  return (
    <div className="flex flex-col w-64 bg-white border-r border-[#e5e9f2] h-screen shrink-0 overflow-y-auto">
      {/* Brand Logo & Title */}
      <div className="flex items-center gap-2.5 px-6 pt-7 pb-6 select-none">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500">
          <Clock className="w-5 h-5" />
        </div>
        <span className="font-semibold text-lg text-[#1e293b] tracking-tight">TimeSync</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 group text-left ${
                isActive
                  ? 'bg-[#1bc1a1] text-white font-medium shadow-lg shadow-[#1bc1a1]/25'
                  : 'text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#1e293b]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 group-hover:scale-105 ${
                    isActive ? 'text-white' : 'text-[#94a3b8] group-hover:text-[#64748b]'
                  }`}
                />
                <span className="text-[14px] font-medium">{item.name}</span>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Footer User Profile */}
      <div className="p-4 mt-auto border-t border-slate-100">
        <div className="flex items-center gap-3 px-2 py-2">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
            alt="Alex Morgan"
            className="w-9 h-9 rounded-full object-cover border-2 border-slate-100"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-800 truncate">Alex Morgan</p>
            <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
              Admin
            </p>
          </div>
        </div>
        <div className="text-[11px] text-[#94a3b8] text-center mt-3 font-mono">
          TimeSync • v1.0.0
        </div>
      </div>
    </div>
  );
}
