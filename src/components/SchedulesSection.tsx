import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
  X,
  CheckCircle,
  CalendarDays,
  User,
  Activity
} from 'lucide-react';
import { ScheduleEvent } from '../types';

interface SchedulesSectionProps {
  schedules: ScheduleEvent[];
  onAddSchedule: (schedule: Omit<ScheduleEvent, 'id'>) => void;
}

export default function SchedulesSection({
  schedules,
  onAddSchedule
}: SchedulesSectionProps) {
  // Calendar active state
  const [selectedDay, setSelectedDay] = useState<number>(20); // June 20 default
  const [showEventForm, setShowEventForm] = useState<boolean>(false);

  // Form states
  const [newName, setNewName] = useState('');
  const [newTitle, setNewTitle] = useState('First Interview');
  const [newRole, setNewRole] = useState('UI Designer');
  const [newTime, setNewTime] = useState('10:00 AM');

  const weekDays = [
    { name: 'S', date: 17 },
    { name: 'M', date: 18 },
    { name: 'T', date: 19 },
    { name: 'W', date: 20 },
    { name: 'T', date: 21 },
    { name: 'F', date: 22 },
    { name: 'S', date: 23 },
  ];

  // Helper date matching
  const dayKey = `2035-06-${selectedDay < 10 ? '0' + selectedDay : selectedDay}`;

  const currentDaySchedules = schedules.filter((s) => s.date === dayKey);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newTime.trim()) return;

    onAddSchedule({
      time: newTime,
      title: newTitle,
      date: dayKey,
      candidateName: newName.trim(),
      candidateRole: newRole
    });

    // Reset Form
    setNewName('');
    setShowEventForm(false);
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-105 shadow-xs relative select-none">
      {/* Block Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-slate-800 text-xs sm:text-sm tracking-tight flex items-center gap-1.5 font-sans">
            <CalendarDays className="w-4 h-4 text-[#1bc1a1]" />
            <span>Schedules Calendar</span>
          </h3>
          <p className="text-[10px] text-slate-400 font-medium">Interviews and candidate reviews</p>
        </div>

        {/* Schedule event fast addition toggle */}
        <button
          onClick={() => setShowEventForm(!showEventForm)}
          className="p-1 text-[#1bc1a1] hover:bg-[#defff7] border border-[#1bc1a1]/20 rounded-lg cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* June 2035 Header stripe */}
      <div className="flex items-center justify-between px-2 mb-3.5">
        <button className="p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-xs font-mono font-bold text-slate-700 tracking-wide">June 2035</span>
        <button className="p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Week Strip Layout matches the image exactly */}
      <div className="grid grid-cols-7 gap-2 text-center mb-5 font-mono">
        {weekDays.map((wd) => {
          const isActive = selectedDay === wd.date;
          return (
            <div
              key={wd.date}
              onClick={() => {
                setSelectedDay(wd.date);
                setShowEventForm(false);
              }}
              className="flex flex-col items-center gap-1.5 cursor-pointer group"
            >
              {/* Day acronym label */}
              <span className="text-[9.5px] font-bold text-slate-400 group-hover:text-slate-600">
                {wd.name}
              </span>

              {/* Day numeric stamp */}
              <div
                className={`w-7.5 h-7.5 rounded-lg text-xs font-extrabold flex items-center justify-center transition-all ${
                  isActive
                    ? 'bg-[#1bc1a1] text-white shadow-md shadow-[#1bc1a1]/25 border border-transparent'
                    : 'text-slate-600 hover:bg-[#defff7]/25 border border-slate-100 hover:text-[#1bc1a1]'
                }`}
              >
                {wd.date}
              </div>
            </div>
          );
        })}
      </div>

      {/* Daily schedule item list matching card blocks */}
      <div className="space-y-3 max-h-76 overflow-y-auto pr-1">
        {currentDaySchedules.map((schedule) => (
          <div
            key={schedule.id}
            className="p-3 bg-[#defff7]/20 hover:bg-[#defff7]/30 border border-[#1bc1a1]/10 rounded-2xl text-xs flex justify-between gap-2.5 transition-all"
          >
            <div className="space-y-1.5">
              {/* Event Time */}
              <div className="flex items-center gap-1 text-[9.5px] font-extrabold text-[#0f766e]">
                <Clock className="w-3 h-3 text-[#1bc1a1]/85 shrink-0" />
                <span>{schedule.time}</span>
              </div>

              {/* Event Title */}
              <strong className="font-extrabold text-slate-800 text-[12px] block leading-none">
                {schedule.title}
              </strong>

              {/* Candidate Info */}
              <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1 mt-1 font-mono">
                <User className="w-3 h-3" />
                <span>{schedule.candidateName} • {schedule.candidateRole}</span>
              </span>
            </div>
            <div className="my-auto">
              <Activity className="w-4 h-4 text-[#1bc1a1]/30" />
            </div>
          </div>
        ))}

        {currentDaySchedules.length === 0 && (
          <p className="text-[10.5px] text-zinc-400 text-center py-8 bg-zinc-50 border border-dashed rounded-2xl italic font-semibold">
            No interview schedules synced for June {selectedDay}.
          </p>
        )}
      </div>

      {/* Fast event schedule dialogue box */}
      <AnimatePresence>
        {showEventForm && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="absolute inset-x-2 bottom-2 z-30 p-4.5 bg-white border border-slate-100 rounded-2xl shadow-xl border-t border-[#1bc1a1]/20 font-sans"
          >
            <div className="flex items-center justify-between border-b border-slate-50 pb-2 mb-3">
              <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4 text-[#1bc1a1]" /> Book June {selectedDay} Sync
              </span>
              <button
                onClick={() => setShowEventForm(false)}
                className="text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 p-0.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                  Candidate Name Or ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. Fanny Rizal"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full text-xs font-semibold px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-[#1bc1a1]/50 bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                    Interview Type
                  </label>
                  <select
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full text-xs font-semibold px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-[#1bc1a1]/50 bg-white"
                  >
                    <option value="First Interview">First Interview</option>
                    <option value="HR Interview">HR Interview</option>
                    <option value="Online Test Review">Test Review</option>
                    <option value="Final Interview">Final Interview</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                    Target Time Frame
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 02:30 PM"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full text-xs font-semibold px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-[#1bc1a1]/50 bg-white"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-1 border-t border-slate-50">
                <button
                  type="button"
                  onClick={() => setShowEventForm(false)}
                  className="px-3.5 py-1 rounded-xl border border-slate-150 text-[10.5px] font-bold text-slate-500 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1 rounded-xl bg-[#1bc1a1] hover:bg-[#159d83] text-white text-[10.5px] font-bold shadow-xs inline-flex items-center gap-1 cursor-pointer"
                >
                  <Clock className="w-3 h-3" />
                  <span>Book Event</span>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
