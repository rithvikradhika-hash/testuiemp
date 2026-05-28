import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  Square,
  DollarSign,
  Hash,
  Tag,
  ChevronDown,
  List,
  CalendarDays,
  Circle,
  SendHorizonal,
  Clock,
  Layers,
  FolderOpen,
  MoreHorizontal,
  Trash2,
  Copy,
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────────

interface Project {
  name: string;
  client: string;
  color: string;
}

interface TimesheetEntry {
  id: string;
  task: string;
  project: Project;
  tag: 'Regular' | 'Overtime' | 'Meeting';
  billable: boolean;
  startTime: string;   // HH:MM
  endTime: string;      // HH:MM
  durationSecs: number; // total seconds
  date: string;         // YYYY-MM-DD
}

// ─── Static Data ────────────────────────────────────────────────────────────────

const PROJECTS: Project[] = [
  { name: 'Website Redesign', client: 'Acme Corp', color: '#6366f1' },
  { name: 'Mobile App', client: 'Nova Labs', color: '#f59e0b' },
  { name: 'Cloud Migration', client: 'Helix Systems', color: '#3b82f6' },
  { name: 'E-commerce Platform', client: 'Umbrella Corp', color: '#ef4444' },
  { name: 'CRM Integration', client: 'Vanguard LLC', color: '#8b5cf6' },
  { name: 'Marketing Dashboard', client: 'BrightEdge', color: '#ec4899' },
  { name: 'API Development', client: 'Nexus AI', color: '#14b8a6' },
];

const TAG_OPTIONS: Array<'Regular' | 'Overtime' | 'Meeting'> = ['Regular', 'Overtime', 'Meeting'];

const INITIAL_ENTRIES: TimesheetEntry[] = [
  { id: 'ts-1', task: 'Implement checkout flow', project: PROJECTS[3], tag: 'Regular', billable: true, startTime: '15:09', endTime: '16:20', durationSecs: 4312, date: '2026-03-27' },
  { id: 'ts-2', task: 'Sprint planning session', project: PROJECTS[0], tag: 'Meeting', billable: false, startTime: '14:00', endTime: '15:05', durationSecs: 3900, date: '2026-03-27' },
  { id: 'ts-3', task: 'Fix Login API Bug', project: PROJECTS[6], tag: 'Regular', billable: true, startTime: '11:30', endTime: '13:45', durationSecs: 8100, date: '2026-03-27' },
  { id: 'ts-4', task: 'Database schema migration', project: PROJECTS[2], tag: 'Overtime', billable: true, startTime: '09:00', endTime: '11:15', durationSecs: 8100, date: '2026-03-27' },
  { id: 'ts-5', task: 'Code review - auth module', project: PROJECTS[4], tag: 'Regular', billable: false, startTime: '08:15', endTime: '09:00', durationSecs: 2700, date: '2026-03-27' },
  { id: 'ts-6', task: 'UI polish & responsive fixes', project: PROJECTS[0], tag: 'Regular', billable: true, startTime: '15:30', endTime: '17:45', durationSecs: 8100, date: '2026-03-26' },
  { id: 'ts-7', task: 'Customer demo preparation', project: PROJECTS[5], tag: 'Meeting', billable: false, startTime: '14:00', endTime: '15:15', durationSecs: 4500, date: '2026-03-26' },
  { id: 'ts-8', task: 'Write integration tests', project: PROJECTS[6], tag: 'Regular', billable: true, startTime: '10:30', endTime: '13:00', durationSecs: 9000, date: '2026-03-26' },
  { id: 'ts-9', task: 'Deploy staging environment', project: PROJECTS[2], tag: 'Regular', billable: true, startTime: '09:00', endTime: '10:15', durationSecs: 4500, date: '2026-03-26' },
  { id: 'ts-10', task: 'Refactor notification service', project: PROJECTS[1], tag: 'Overtime', billable: true, startTime: '17:00', endTime: '19:30', durationSecs: 9000, date: '2026-03-25' },
];

// ─── Helpers ────────────────────────────────────────────────────────────────────

function formatDuration(totalSecs: number): string {
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function formatDateHeading(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
  const day = d.getDate();
  const suffix = day === 1 || day === 21 || day === 31 ? 'ST' : day === 2 || day === 22 ? 'ND' : day === 3 || day === 23 ? 'RD' : 'TH';
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${day}${suffix}`;
}

function currentTimeStr(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
}

function currentDateStr(): string {
  return new Date().toISOString().split('T')[0];
}

// ─── Component ──────────────────────────────────────────────────────────────────

export default function TimesheetSection() {
  // Timer state
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSecs, setElapsedSecs] = useState(0);
  const startTimeRef = useRef<string>('');

  // Input state
  const [taskInput, setTaskInput] = useState('');
  const [billable, setBillable] = useState(false);
  const [taskId, setTaskId] = useState('');
  const [selectedTag, setSelectedTag] = useState<'Regular' | 'Overtime' | 'Meeting'>('Regular');
  const [selectedProject, setSelectedProject] = useState<Project>(PROJECTS[0]);

  // Dropdown visibility
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);
  const [showTagDropdown, setShowTagDropdown] = useState(false);

  // Timesheet log
  const [entries, setEntries] = useState<TimesheetEntry[]>(INITIAL_ENTRIES);

  // View mode
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  // Active task display
  const [activeTask] = useState('Fix Login API Bug');

  // Live timer
  useEffect(() => {
    let interval: any = null;
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedSecs((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = () => {
      setShowProjectDropdown(false);
      setShowTagDropdown(false);
    };
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, []);

  const handleStart = () => {
    startTimeRef.current = currentTimeStr();
    setElapsedSecs(0);
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
    const endTime = currentTimeStr();
    const newEntry: TimesheetEntry = {
      id: `ts-dyn-${Date.now()}`,
      task: taskInput || 'Untitled Task',
      project: selectedProject,
      tag: selectedTag,
      billable,
      startTime: startTimeRef.current,
      endTime,
      durationSecs: elapsedSecs,
      date: currentDateStr(),
    };
    setEntries([newEntry, ...entries]);
    setTaskInput('');
    setTaskId('');
    setElapsedSecs(0);
  };

  // Group entries by date
  const groupedEntries = entries.reduce<Record<string, TimesheetEntry[]>>((acc, entry) => {
    if (!acc[entry.date]) acc[entry.date] = [];
    acc[entry.date].push(entry);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedEntries).sort((a, b) => b.localeCompare(a));

  // Compute daily totals
  const dailyTotal = (dateEntries: TimesheetEntry[]) =>
    formatDuration(dateEntries.reduce((sum, e) => sum + e.durationSecs, 0));

  const tagColor = (tag: string) => {
    switch (tag) {
      case 'Overtime': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Meeting': return 'bg-violet-50 text-violet-700 border-violet-200';
      default: return 'bg-teal-50 text-teal-700 border-teal-200';
    }
  };

  return (
    <div className="space-y-6 select-none">

      {/* ═══ TOP BAR — Timer & Task Input ═══ */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-4">
        {/* Current task badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Your Tasks:</span>
          <span className="text-[10px] font-bold text-[#1bc1a1] bg-[#defff7] px-2.5 py-0.5 rounded-full border border-[#1bc1a1]/20">
            {activeTask}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          {/* Task description input */}
          <div className="flex-1 min-w-0">
            <input
              type="text"
              placeholder="What are you working on?"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              className="w-full text-sm px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#1bc1a1]/50 focus:bg-white text-slate-700 font-semibold placeholder:text-slate-350"
            />
          </div>

          {/* Control toggles row */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Billable toggle */}
            <button
              onClick={() => setBillable(!billable)}
              className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-extrabold border transition-colors cursor-pointer ${
                billable
                  ? 'bg-[#1bc1a1] text-white border-[#1bc1a1]'
                  : 'bg-slate-50 text-slate-400 border-slate-200 hover:border-slate-300'
              }`}
              title="Toggle billable"
            >
              <DollarSign className="w-4 h-4" />
            </button>

            {/* Task ID input */}
            <div className="relative">
              <Hash className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-350" />
              <input
                type="text"
                placeholder="ID (opt)"
                value={taskId}
                onChange={(e) => setTaskId(e.target.value)}
                className="w-24 text-[11px] pl-7 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1bc1a1]/50 text-slate-600 font-bold placeholder:text-slate-350"
              />
            </div>

            {/* Tag dropdown */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => { setShowTagDropdown(!showTagDropdown); setShowProjectDropdown(false); }}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 hover:border-slate-300 cursor-pointer transition-colors"
              >
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedTag}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              <AnimatePresence>
                {showTagDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full mt-1 left-0 z-50 bg-white border border-slate-150 rounded-xl shadow-md py-1 min-w-[130px]"
                  >
                    {TAG_OPTIONS.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => { setSelectedTag(tag); setShowTagDropdown(false); }}
                        className={`w-full text-left px-3 py-1.5 text-[11px] font-bold hover:bg-slate-50 cursor-pointer transition-colors ${
                          selectedTag === tag ? 'text-[#1bc1a1]' : 'text-slate-600'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Project selector dropdown */}
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => { setShowProjectDropdown(!showProjectDropdown); setShowTagDropdown(false); }}
                className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 hover:border-slate-300 cursor-pointer transition-colors max-w-[200px]"
              >
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: selectedProject.color }} />
                <span className="truncate">{selectedProject.name}</span>
                <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
              </button>
              <AnimatePresence>
                {showProjectDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full mt-1 right-0 z-50 bg-white border border-slate-150 rounded-xl shadow-md py-1 min-w-[220px]"
                  >
                    {PROJECTS.map((proj) => (
                      <button
                        key={proj.name}
                        onClick={() => { setSelectedProject(proj); setShowProjectDropdown(false); }}
                        className={`w-full text-left px-3 py-2 text-[11px] font-bold hover:bg-slate-50 cursor-pointer transition-colors flex items-center gap-2.5 ${
                          selectedProject.name === proj.name ? 'text-[#1bc1a1]' : 'text-slate-600'
                        }`}
                      >
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: proj.color }} />
                        <div>
                          <span className="block">{proj.name}</span>
                          <span className="text-[9px] text-slate-400 font-medium">{proj.client}</span>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Timer display + Start/Stop button */}
            <div className="flex items-center gap-2 ml-auto">
              {isRunning && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="font-mono text-lg font-black text-slate-700 tracking-tight tabular-nums"
                >
                  {formatDuration(elapsedSecs)}
                </motion.span>
              )}

              <button
                onClick={isRunning ? handleStop : handleStart}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-extrabold text-xs tracking-wide transition-all cursor-pointer shadow-sm ${
                  isRunning
                    ? 'bg-rose-500 hover:bg-rose-600 text-white'
                    : 'bg-[#1bc1a1] hover:bg-[#159d83] text-white'
                }`}
              >
                {isRunning ? (
                  <>
                    <Square className="w-4 h-4 fill-current" />
                    <span>Stop</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Start</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ TIMESHEET LOG ═══ */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-50 gap-3">
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm tracking-tight mb-0.5 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#1bc1a1]" />
              My Timesheet
            </h3>
            <p className="text-[10px] text-slate-400 font-bold">Track and review your logged work hours</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Submit week link */}
            <button className="text-[11px] font-bold text-[#1bc1a1] hover:text-[#159d83] cursor-pointer transition-colors flex items-center gap-1">
              <SendHorizonal className="w-3.5 h-3.5" />
              Submit Week for Approval
            </button>

            {/* View mode toggle */}
            <div className="flex items-center gap-1 border border-slate-150 p-1 rounded-xl bg-slate-50">
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'list'
                    ? 'bg-white shadow-3xs border border-slate-200/80'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title="List view"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('calendar')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'calendar'
                    ? 'bg-white shadow-3xs border border-slate-200/80'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Calendar view"
              >
                <CalendarDays className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Timesheet entries — List View */}
        {viewMode === 'list' && (
          <div className="space-y-6 mt-5 max-h-[520px] overflow-y-auto pr-1">
            {sortedDates.map((date) => (
              <div key={date}>
                {/* Date header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    {formatDateHeading(date)}
                  </span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider font-mono">
                    Total: {dailyTotal(groupedEntries[date])}
                  </span>
                </div>

                {/* Entries list */}
                <div className="space-y-2.5">
                  <AnimatePresence>
                    {groupedEntries[date].map((entry) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="p-3.5 bg-slate-50 border border-slate-150 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 group"
                      >
                        {/* Left: task info */}
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="w-1 h-10 rounded-full shrink-0 mt-0.5" style={{ backgroundColor: entry.project.color }} />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <p className="text-xs font-bold text-slate-700 truncate">{entry.task}</p>
                              {entry.billable && (
                                <span className="shrink-0 w-4 h-4 rounded flex items-center justify-center bg-[#1bc1a1]/10 text-[#1bc1a1]">
                                  <DollarSign className="w-3 h-3" />
                                </span>
                              )}
                              <span className={`shrink-0 text-[8px] font-black uppercase px-1.5 py-0.5 rounded border ${tagColor(entry.tag)}`}>
                                {entry.tag}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: entry.project.color }} />
                              <span className="text-[10px] text-slate-400 font-bold truncate">
                                {entry.project.name} – {entry.project.client}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right: duration / times */}
                        <div className="flex items-center gap-4 sm:gap-6">
                          <div className="text-right">
                            <p className="font-mono text-sm font-black text-slate-700 tracking-tight tabular-nums">
                              {formatDuration(entry.durationSecs)}
                            </p>
                            <p className="text-[10px] text-slate-400 font-bold font-mono flex items-center gap-1 justify-end">
                              <Clock className="w-3 h-3 text-slate-300" />
                              {entry.startTime} – {entry.endTime}
                            </p>
                          </div>

                          {/* Actions (visible on hover) */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1 rounded hover:bg-slate-200/60 cursor-pointer text-slate-400 hover:text-slate-600 transition-colors" title="Duplicate">
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button className="p-1 rounded hover:bg-rose-50 cursor-pointer text-slate-400 hover:text-rose-500 transition-colors" title="Delete">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Timesheet entries — Calendar View */}
        {viewMode === 'calendar' && (
          <div className="mt-5">
            {/* Simple weekly grid view */}
            <div className="grid grid-cols-7 gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="text-center text-[10px] font-black text-slate-400 uppercase tracking-wider pb-2">
                  {day}
                </div>
              ))}
              {/* Week cells — representative data */}
              {(() => {
                const weekDays = ['2026-03-23', '2026-03-24', '2026-03-25', '2026-03-26', '2026-03-27', '2026-03-28', '2026-03-29'];
                return weekDays.map((d) => {
                  const dayEntries = groupedEntries[d] || [];
                  const totalSecs = dayEntries.reduce((sum, e) => sum + e.durationSecs, 0);
                  const dayNum = new Date(d + 'T12:00:00').getDate();
                  const isToday = d === currentDateStr();
                  return (
                    <div
                      key={d}
                      className={`p-2.5 rounded-xl border min-h-[100px] flex flex-col ${
                        isToday
                          ? 'border-[#1bc1a1]/40 bg-[#defff7]/30'
                          : dayEntries.length > 0
                            ? 'border-slate-150 bg-slate-50'
                            : 'border-slate-100 bg-white'
                      }`}
                    >
                      <span className={`text-xs font-black mb-1.5 ${isToday ? 'text-[#1bc1a1]' : 'text-slate-500'}`}>
                        {dayNum}
                      </span>
                      {dayEntries.length > 0 ? (
                        <>
                          <div className="space-y-1 flex-1">
                            {dayEntries.slice(0, 2).map((entry) => (
                              <div key={entry.id} className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: entry.project.color }} />
                                <span className="text-[8px] font-bold text-slate-500 truncate">{entry.task}</span>
                              </div>
                            ))}
                            {dayEntries.length > 2 && (
                              <span className="text-[8px] font-bold text-slate-400">+{dayEntries.length - 2} more</span>
                            )}
                          </div>
                          <span className="text-[9px] font-black text-slate-500 font-mono mt-1.5">{formatDuration(totalSecs)}</span>
                        </>
                      ) : (
                        <span className="text-[8px] text-slate-300 font-medium mt-auto">No entries</span>
                      )}
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 mt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400 font-medium">
          <span className="flex items-center gap-1.5">
            <FolderOpen className="w-3.5 h-3.5 text-slate-300" />
            {entries.length} total entries logged
          </span>
          <div className="flex items-center gap-1 font-mono text-[9px] text-emerald-600 font-bold">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            <span>SYNCED</span>
          </div>
        </div>
      </div>
    </div>
  );
}
