import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Mail,
  Phone,
  CalendarDays,
  MoreVertical,
  Users,
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: 'Admin' | 'Manager' | 'Employee';
  status: 'online' | 'busy' | 'offline';
  isYou?: boolean;
  currentTask: string | null;
  avatarGradient: string;
}

const teamMembers: TeamMember[] = [
  {
    id: 'tm-1',
    name: 'Alex Morgan',
    role: 'Admin',
    status: 'online',
    isYou: true,
    currentTask: null,
    avatarGradient: 'from-[#1bc1a1] to-cyan-400',
  },
  {
    id: 'tm-2',
    name: 'Alex Morgan',
    role: 'Admin',
    status: 'online',
    currentTask: 'Reviewing Q1 Analytics',
    avatarGradient: 'from-[#1bc1a1] to-emerald-400',
  },
  {
    id: 'tm-3',
    name: 'Sarah Connor',
    role: 'Manager',
    status: 'busy',
    currentTask: 'Client Meeting - Acme Corp',
    avatarGradient: 'from-orange-400 to-amber-400',
  },
  {
    id: 'tm-4',
    name: 'John Doe',
    role: 'Employee',
    status: 'online',
    currentTask: 'Fixing navigation bug - Mobile App',
    avatarGradient: 'from-blue-400 to-indigo-400',
  },
  {
    id: 'tm-5',
    name: 'Emily Chen',
    role: 'Employee',
    status: 'online',
    currentTask: 'API endpoint testing',
    avatarGradient: 'from-pink-400 to-rose-400',
  },
  {
    id: 'tm-6',
    name: 'Marcus Johnson',
    role: 'Employee',
    status: 'busy',
    currentTask: 'Database optimization',
    avatarGradient: 'from-violet-400 to-purple-400',
  },
  {
    id: 'tm-7',
    name: 'Lisa Anderson',
    role: 'Manager',
    status: 'online',
    currentTask: 'Sprint Planning',
    avatarGradient: 'from-teal-400 to-cyan-400',
  },
  {
    id: 'tm-8',
    name: 'David Kim',
    role: 'Employee',
    status: 'offline',
    currentTask: null,
    avatarGradient: 'from-slate-400 to-gray-400',
  },
  {
    id: 'tm-9',
    name: 'Rachel Green',
    role: 'Employee',
    status: 'busy',
    currentTask: 'UI/UX Design Review',
    avatarGradient: 'from-fuchsia-400 to-pink-400',
  },
];

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('');

const getStatusDotColor = (status: TeamMember['status']) => {
  switch (status) {
    case 'online':
      return 'bg-emerald-500';
    case 'busy':
      return 'bg-amber-500';
    case 'offline':
      return 'bg-slate-300';
  }
};

const getRoleBadgeStyle = (role: TeamMember['role']) => {
  switch (role) {
    case 'Admin':
      return 'bg-violet-50 text-violet-600 border-violet-100';
    case 'Manager':
      return 'bg-blue-50 text-blue-600 border-blue-100';
    case 'Employee':
      return 'bg-slate-50 text-slate-500 border-slate-100';
  }
};

export default function TeamSection() {
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const onlineCount = teamMembers.filter((m) => m.status === 'online').length;
  const busyCount = teamMembers.filter((m) => m.status === 'busy').length;

  return (
    <div className="space-y-6 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-[#defff7] text-[#1bc1a1] flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </span>
          <div>
            <h2 className="text-lg font-extrabold text-slate-800">
              Team Overview
            </h2>
            <p className="text-xs font-medium text-slate-400">
              Real-time status of your team members.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-xs font-bold text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Online: {onlineCount}
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-100 text-xs font-bold text-amber-700">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Busy: {busyCount}
          </span>
        </div>
      </div>

      {/* Team Grid */}
      <AnimatePresence mode="popLayout">
        <motion.div
          layout
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.35 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden group"
            >
              {/* Card Body */}
              <div className="p-5">
                <div className="flex items-start justify-between">
                  {/* Left: Avatar + Info */}
                  <div className="flex items-center gap-3.5">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div
                        className={`w-11 h-11 rounded-full bg-gradient-to-tr ${member.avatarGradient} flex items-center justify-center text-white font-extrabold text-sm shadow-sm`}
                      >
                        {getInitials(member.name)}
                      </div>
                      {/* Status dot */}
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${getStatusDotColor(member.status)} ${member.status === 'online' ? 'animate-pulse' : ''}`}
                      />
                    </div>

                    {/* Name + Role */}
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-xs text-slate-800">
                          {member.name}
                        </h4>
                        {member.isYou && (
                          <span className="text-[10px] font-bold text-[#1bc1a1]">
                            (You)
                          </span>
                        )}
                        {member.role === 'Admin' && !member.isYou && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-violet-100 text-violet-600">
                            ADMIN
                          </span>
                        )}
                      </div>
                      <span
                        className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${getRoleBadgeStyle(member.role)}`}
                      >
                        {member.role}
                      </span>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-1.5">
                    {/* Contact icons */}
                    <div className="hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-7 h-7 rounded-lg hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer transition-colors">
                        <Mail className="w-3.5 h-3.5" />
                      </button>
                      <button className="w-7 h-7 rounded-lg hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer transition-colors">
                        <Phone className="w-3.5 h-3.5" />
                      </button>
                      <button className="w-7 h-7 rounded-lg hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer transition-colors">
                        <CalendarDays className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Three-dot menu */}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpenId(
                            menuOpenId === member.id ? null : member.id
                          );
                        }}
                        className="w-7 h-7 rounded-lg hover:bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      <AnimatePresence>
                        {menuOpenId === member.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -4 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -4 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 top-8 z-20 w-40 bg-white rounded-xl border border-slate-100 shadow-lg py-1.5"
                          >
                            <button
                              onClick={() => setMenuOpenId(null)}
                              className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                            >
                              View Profile
                            </button>
                            <button
                              onClick={() => setMenuOpenId(null)}
                              className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                            >
                              Send Message
                            </button>
                            <button
                              onClick={() => setMenuOpenId(null)}
                              className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                            >
                              View Timesheet
                            </button>
                            <div className="border-t border-slate-50 my-1" />
                            <button
                              onClick={() => setMenuOpenId(null)}
                              className="w-full text-left px-3 py-2 text-xs font-semibold text-rose-500 hover:bg-rose-50 cursor-pointer"
                            >
                              Remove from Team
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>

              {/* Task Banner */}
              {member.status === 'offline' ? (
                <div className="px-5 py-3 bg-slate-50 border-t border-slate-100">
                  <p className="text-[11px] font-bold text-slate-400">
                    Currently Offline
                  </p>
                </div>
              ) : member.currentTask ? (
                <div
                  className={`px-5 py-3 border-t ${
                    member.status === 'online'
                      ? 'bg-emerald-50/70 border-emerald-100'
                      : 'bg-amber-50/70 border-amber-100'
                  }`}
                >
                  <span
                    className={`text-[9px] font-black uppercase tracking-wider ${
                      member.status === 'online'
                        ? 'text-emerald-500'
                        : 'text-amber-500'
                    }`}
                  >
                    Working on
                  </span>
                  <p
                    className={`text-[11px] font-bold mt-0.5 ${
                      member.status === 'online'
                        ? 'text-emerald-700'
                        : 'text-amber-700'
                    }`}
                  >
                    {member.currentTask}
                  </p>
                </div>
              ) : (
                <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-100">
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                    Status
                  </span>
                  <p className="text-[11px] font-bold text-slate-400 mt-0.5">
                    Idle / Not Tracking
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Click-away overlay for menu */}
      {menuOpenId && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setMenuOpenId(null)}
        />
      )}
    </div>
  );
}
