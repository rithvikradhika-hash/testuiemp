import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  MapPin, 
  User, 
  SlidersHorizontal,
  Tags,
  Check
} from 'lucide-react';
import { ScheduleEvent } from '../types';

interface CalendarSectionProps {
  initialEvents: ScheduleEvent[];
}

export default function CalendarSection({ initialEvents }: CalendarSectionProps) {
  // Local Event Database synced in state
  const [events, setEvents] = useState<ScheduleEvent[]>([
    ...initialEvents,
    { id: 'sch-c1', time: '11:00 AM', title: 'Marketing Quarterly Sync', date: '2035-06-05', candidateName: 'Internal Team', candidateRole: 'Marketing' },
    { id: 'sch-c2', time: '04:00 PM', title: 'Product Demo Review', date: '2035-06-12', candidateName: 'Design Leads', candidateRole: 'Product Design' },
    { id: 'sch-c3', time: '09:00 AM', title: 'Founder Onboarding Chat', date: '2035-06-25', candidateName: 'Sophia Lin', candidateRole: 'Director level' },
    { id: 'sch-c4', time: '10:00 AM', title: 'Global Tech Standup', date: '2035-06-20', candidateName: 'Engineering Co', candidateRole: 'R&D' }
  ]);

  // Current selected view/focus dates
  const [selectedDay, setSelectedDay] = useState<string>('2035-06-20');
  const [activeFilters, setActiveFilters] = useState<string[]>(['Interview', 'Sync', 'Review']);

  // Add event panel state
  const [showAddForm, setShowAddForm] = useState(false);
  const [evtTitle, setEvtTitle] = useState('');
  const [evtTime, setEvtTime] = useState('10:00 AM');
  const [evtDay, setEvtDay] = useState('2035-06-20');
  const [evtName, setEvtName] = useState('');
  const [evtRole, setEvtRole] = useState('UI Designer');

  // Days mapping for June 2035: 30 days, June 1st is Friday
  // Grid coordinates: we need placeholder days from prev month (May: Thursday, Wednesday, Tuesday, Monday starting from 28th)
  const daysInMonth = Array.from({ length: 30 }, (_, i) => String(i + 1).padStart(2, '0'));
  
  // Custom tagging based on title keywords
  const getEventCategory = (title: string): 'Interview' | 'Sync' | 'Review' | 'Holiday' => {
    const t = title.toLowerCase();
    if (t.includes('interview') || t.includes('pre-screening')) return 'Interview';
    if (t.includes('sync') || t.includes('standup')) return 'Sync';
    if (t.includes('review') || t.includes('test')) return 'Review';
    return 'Holiday';
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Interview': return 'bg-[#1bc1a1]/10 text-[#1bc1a1] border-[#1bc1a1]/25 border';
      case 'Sync': return 'bg-cyan-50 text-cyan-600 border-cyan-150 border';
      case 'Review': return 'bg-purple-50 text-purple-600 border-purple-150 border';
      default: return 'bg-rose-50 text-rose-600 border-rose-150 border';
    }
  };

  const getIndicatorColor = (cat: string) => {
    switch (cat) {
      case 'Interview': return 'bg-[#1bc1a1]';
      case 'Sync': return 'bg-cyan-500';
      case 'Review': return 'bg-purple-500';
      default: return 'bg-amber-500';
    }
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evtTitle || !evtName) return;

    const newEvt: ScheduleEvent = {
      id: `sch-dyn-${Date.now()}`,
      title: evtTitle,
      time: evtTime,
      date: evtDay,
      candidateName: evtName,
      candidateRole: evtRole
    };

    setEvents((prev) => [newEvt, ...prev]);
    // Reset form states
    setEvtTitle('');
    setEvtName('');
    setShowAddForm(false);
  };

  const toggleFilter = (filterType: string) => {
    setActiveFilters((prev) =>
      prev.includes(filterType) 
        ? prev.filter((f) => f !== filterType) 
        : [...prev, filterType]
    );
  };

  // Filtered actual event lists
  const displayEvents = events.filter((ev) => {
    const cat = getEventCategory(ev.title);
    return activeFilters.includes(cat);
  });

  const selectedDayEvents = displayEvents.filter((ev) => ev.date === selectedDay);

  // June 2035 calendar grid layout mapping (June 1 is Friday)
  // empty cells before Friday: Monday(0), Tuesday(1), Wednesday(2), Thursday(3) -> 4 blanks
  const gridCells = [
    ...Array(4).fill(null), // Empty spots mapping to prev month days
    ...daysInMonth.map((d) => `2035-06-${d}`)
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-[calc(100vh-140px)] select-none">
      
      {/* Monthly Interactive Grid (Left 2/3) */}
      <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-xs p-5 flex flex-col h-full justify-between">
        <div>
          {/* Header Month selectors */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-50 mb-4">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-[#defff7] text-[#1bc1a1] flex items-center justify-center shrink-0">
                <CalendarIcon className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm sm:text-base tracking-tight">Enterprise Talent Planner</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">June 2035 &bull; Active Month</p>
              </div>
            </div>

            {/* Steppers */}
            <div className="flex items-center gap-2">
              <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer text-slate-400">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-black text-slate-700 px-2 font-mono">June 2035</span>
              <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer text-slate-400">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Filter checkbox strip */}
          <div className="flex flex-wrap gap-2.5 items-center mb-5 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs">
            <span className="text-slate-400 font-bold flex items-center gap-1 shrink-0 px-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-450" />
              Active Filters:
            </span>
            {[
              { type: 'Interview', label: 'Candidate Interviews', col: 'bg-[#1bc1a1]' },
              { type: 'Sync', label: 'Internal Syncs', col: 'bg-cyan-500' },
              { type: 'Review', label: 'Technical Evaluations', col: 'bg-purple-500' }
            ].map((f) => {
              const checked = activeFilters.includes(f.type);
              return (
                <button
                  key={f.type}
                  onClick={() => toggleFilter(f.type)}
                  className={`px-3 py-1.5 rounded-lg font-bold border flex items-center gap-1.5 text-[10px] transition-colors cursor-pointer ${
                    checked
                      ? 'bg-white text-slate-700 border-slate-200 shadow-3xs'
                      : 'bg-transparent text-slate-350 border-dashed border-slate-200/80 hover:bg-white/50'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${f.col}`} />
                  <span>{f.label}</span>
                  {checked && <Check className="w-3 h-3 text-[#1bc1a1]" />}
                </button>
              );
            })}
          </div>

          {/* Days of the week header */}
          <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>

          {/* Day Cell blocks */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5">
            {gridCells.map((dateVal, index) => {
              if (!dateVal) {
                return (
                  <div key={`blank-${index}`} className="aspect-square bg-slate-50/50 rounded-xl border border-dotted border-slate-100 flex items-center justify-center">
                    <span className="text-[10px] text-slate-300 font-bold font-mono">--</span>
                  </div>
                );
              }

              const dayNum = dateVal.split('-')[2];
              const isSelected = dateVal === selectedDay;
              
              // Find events belonging to this specific block date
              const cellEvents = displayEvents.filter((ev) => ev.date === dateVal);

              return (
                <div
                  key={dateVal}
                  onClick={() => setSelectedDay(dateVal)}
                  className={`aspect-square p-2 rounded-xl border flex flex-col justify-between cursor-pointer transition-all duration-150 select-none relative ${
                    isSelected 
                      ? 'bg-[#1bc1a1]/5 border-[#1bc1a1] shadow-2xs' 
                      : 'bg-white border-slate-200/60 hover:bg-slate-50/80'
                  }`}
                >
                  <span className={`text-[11px] font-extrabold font-mono ${isSelected ? 'text-[#1bc1a1]' : 'text-slate-650'}`}>
                    {dayNum}
                  </span>

                  {/* Micro indicators dots list */}
                  <div className="flex gap-1 overflow-hidden h-2 items-center">
                    {cellEvents.map((ev, i) => {
                      const cat = getEventCategory(ev.title);
                      return (
                        <span
                          key={ev.id || i}
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${getIndicatorColor(cat)}`}
                          title={ev.title}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-[11px] text-slate-400 font-bold mt-4">
          <span>Active schedule timeline: GMT+07:00</span>
          <span className="text-[#1bc1a1] hover:underline cursor-pointer font-extrabold">June Calendar Agenda Full Print &rarr;</span>
        </div>
      </div>

      {/* Interactive Sliders Form & Selected Activity feed (Right 1/3) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 flex flex-col h-full justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm tracking-tight">Timeline Logistics</h3>
              <p className="text-[10px] font-bold text-slate-400">
                Selected Day: <span className="text-slate-605 font-extrabold font-mono">{selectedDay}</span>
              </p>
            </div>
            
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className={`px-3 py-1.5 text-[10px] font-extrabold rounded-lg flex items-center gap-1 border transition-colors cursor-pointer ${
                showAddForm
                  ? 'bg-rose-50 text-rose-500 border-rose-250 hover:bg-rose-100'
                  : 'bg-[#1bc1a1]/5 text-[#1bc1a1] border-[#1bc1a1]/20 hover:bg-[#1bc1a1]/15'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddForm ? 'Close panel' : 'Schedule Event'}</span>
            </button>
          </div>

          <AnimatePresence mode="wait">
            {showAddForm ? (
              <motion.form
                key="form"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onSubmit={handleCreateEvent}
                className="p-4 bg-slate-50 border border-slate-150 rounded-2xl space-y-3.5 mb-5"
              >
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Event Title</label>
                  <input
                    type="text"
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#1bc1a1] font-semibold text-slate-700 placeholder-slate-400"
                    placeholder="e.g. Portfolio Pre-screening Chat"
                    value={evtTitle}
                    onChange={(e) => setEvtTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Time Slot</label>
                    <input
                      type="text"
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-200 text-slate-650 rounded-lg font-bold"
                      value={evtTime}
                      onChange={(e) => setEvtTime(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5 font-mono">Event Date</label>
                    <input
                      type="text"
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-200 text-slate-650 rounded-lg font-bold font-mono"
                      value={evtDay}
                      onChange={(e) => setEvtDay(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Contact/Subject</label>
                    <input
                      type="text"
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg font-semibold"
                      placeholder="e.g. William H."
                      value={evtName}
                      onChange={(e) => setEvtName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-0.5">Role Domain</label>
                    <select
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg font-bold"
                      value={evtRole}
                      onChange={(e) => setEvtRole(e.target.value)}
                    >
                      <option value="UI Designer">UI Designer</option>
                      <option value="Sales Manager">Sales Manager</option>
                      <option value="Data Analyst">Data Analyst</option>
                      <option value="HR Assistant">HR Assistant</option>
                      <option value="Marketing Team">Marketing Team</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-[#1bc1a1] hover:bg-[#12a185] active:scale-98 transition-all text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  Confirm Event Appointment
                </button>
              </motion.form>
            ) : null}
          </AnimatePresence>

          {/* List of day-specific items */}
          <div className="space-y-3 overflow-y-auto max-h-[340px] pr-1">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-1 mb-2">
              Agenda For Select Day ({selectedDayEvents.length} items)
            </h4>

            {selectedDayEvents.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-100 flex flex-col items-center justify-center">
                <p className="text-xs text-slate-450 font-bold">No active meetings scheduled.</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Click the "Schedule Event" button to add some.</p>
              </div>
            ) : (
              selectedDayEvents.map((ev) => {
                const cat = getEventCategory(ev.title);
                return (
                  <div
                    key={ev.id}
                    className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 flex items-start gap-3 relative overflow-hidden"
                  >
                    {/* Left category highlight tag */}
                    <span className={`absolute top-0 bottom-0 left-0 w-1 ${getIndicatorColor(cat)}`} />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-xs text-slate-750 truncate max-w-[170px]">
                          {ev.title}
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${getCategoryColor(cat)}`}>
                          {cat}
                        </span>
                      </div>

                      <div className="space-y-1 mt-2">
                        <p className="text-[11px] text-slate-500 font-bold inline-flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-350" />
                          <span className="font-mono">{ev.time}</span>
                        </p>
                        <p className="text-[11px] text-slate-500 font-medium inline-flex items-center gap-1.5 w-full">
                          <User className="w-3.5 h-3.5 text-slate-350" />
                          <span className="truncate">Atttendees: <span className="font-bold text-slate-700">{ev.candidateName}</span> <span className="text-slate-400">({ev.candidateRole})</span></span>
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400 font-bold mt-4">
          <span>Synced with Workspace Calendar</span>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
        </div>
      </div>
    </div>
  );
}
