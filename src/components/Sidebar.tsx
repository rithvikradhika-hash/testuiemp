import React from 'react';
import {
  LayoutDashboard,
  Clock,
  FolderKanban,
  Layers,
  BarChart3,
  Users,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  currentUser: { name: string; role: string; avatar: string };
  sessionTime: number;
  onClockOut: () => void;
}

function formatSessionTime(totalSecs: number): string {
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function Sidebar({
  activeTab,
  onTabChange,
  currentUser,
  sessionTime,
  onClockOut
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

      {/* Footer Timer Widget & User profile */}
      <div className="p-4 mt-auto border-t border-slate-100 bg-slate-50/50">
        {/* Logged in User Profile Info */}
        <div className="flex items-center gap-2.5 px-1 py-1.5 mb-3">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover border border-slate-200"
          />
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold text-slate-800 truncate leading-tight">{currentUser.name}</p>
            <p className="text-[9px] text-[#1bc1a1] font-bold mt-0.5 leading-none">{currentUser.role}</p>
          </div>
        </div>

        {/* Live Timer Widget */}
        <div className="bg-white border border-slate-150 rounded-xl p-3 shadow-3xs flex flex-col items-center">
          <div className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1bc1a1] animate-pulse" />
            Active Session
          </div>
          <span className="font-mono text-base font-black text-slate-700 tracking-tight tabular-nums mb-2">
            {formatSessionTime(sessionTime)}
          </span>

          <button
            onClick={onClockOut}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-[10px] font-black tracking-wide cursor-pointer transition-colors shadow-2xs"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            <span>Clock Out</span>
          </button>
        </div>

        <div className="text-[10px] text-[#94a3b8] text-center mt-3 font-semibold">
          TimeSync • v1.0.0
        </div>
      </div>
    </div>
  );
}
