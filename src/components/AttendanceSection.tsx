import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Fingerprint, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  CheckCircle, 
  CircleDot, 
  Plus, 
  Sliders,
  Sparkles,
  ArrowRightLeft
} from 'lucide-react';

interface ClockLog {
  id: string;
  name: string;
  role: string;
  type: 'In' | 'Out';
  time: string;
  date: string;
  location: string;
  method: 'Biometric' | 'Virtual Portal' | 'Manual Override';
  status: 'Verified' | 'Late' | 'Pending Approval';
}

export default function AttendanceSection() {
  // Sync core logs in state
  const [logs, setLogs] = useState<ClockLog[]>([
    { id: 'log-1', name: 'Sophia Alexandra', role: 'Lead UX Architect', type: 'In', time: '08:15 AM', date: '2026-05-28', location: 'Remote (Tokyo IP)', method: 'Virtual Portal', status: 'Verified' },
    { id: 'log-2', name: 'Emma Watson', role: 'Junior HR Analyst', type: 'In', time: '08:48 AM', date: '2026-05-28', location: 'HQ South Gate', method: 'Biometric', status: 'Verified' },
    { id: 'log-3', name: 'Marcus Sterling', role: 'Enterprise Sales Manager', type: 'In', time: '09:12 AM', date: '2026-05-28', location: 'HQ Reception', method: 'Biometric', status: 'Late' },
    { id: 'log-4', name: 'Rian Wijaya', role: 'Frontend Engineer', type: 'In', time: '08:30 AM', date: '2026-05-28', location: 'Remote (Home IP)', method: 'Virtual Portal', status: 'Verified' },
    { id: 'log-5', name: 'Clara Mentari', role: 'Support Representative', type: 'In', time: '08:58 AM', date: '2026-05-28', location: 'HQ East gate', method: 'Biometric', status: 'Verified' }
  ]);

  // Clock simulator state management
  const [isClockedIn, setIsClockedIn] = useState<boolean>(false);
  const [elapsedHrs, setElapsedHrs] = useState<number>(0);
  const [elapsedMins, setElapsedMins] = useState<number>(0);
  const [elapsedSecs, setElapsedSecs] = useState<number>(0);
  
  // Correction form details
  const [correctionReason, setCorrectionReason] = useState('');
  const [correctionTime, setCorrectionTime] = useState('09:00 AM');
  const [correctionDate, setCorrectionDate] = useState('2026-05-27');
  const [showCorrectionNotice, setShowCorrectionNotice] = useState(false);

  // Filter logs tabs
  const [activeTabFilter, setActiveTabFilter] = useState<'All' | 'My Records' | 'Exceptions'>('All');

  // Simulated live counter effect when Clocked In
  useEffect(() => {
    let interval: any = null;
    if (isClockedIn) {
      interval = setInterval(() => {
        setElapsedSecs((prev) => {
          if (prev >= 59) {
            setElapsedMins((m) => {
              if (m >= 59) {
                setElapsedHrs((h) => h + 1);
                return 0;
              }
              return m + 1;
            });
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setElapsedHrs(0);
      setElapsedMins(0);
      setElapsedSecs(0);
    }
    return () => clearInterval(interval);
  }, [isClockedIn]);

  // Core action punch clock trigger
  const handleTogglePunchClock = () => {
    const timestamp = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    const dateStamp = new Date().toISOString().split('T')[0];

    const currentType = isClockedIn ? 'Out' : 'In';
    const cleanTime = timestamp.replace(/:\d+\s/, ' '); // Convert hh:mm:ss AM to hh:mm AM format

    const cleanLog: ClockLog = {
      id: `log-dyn-${Date.now()}`,
      name: 'Davis Levin (You)',
      role: 'System Administrator',
      type: currentType,
      time: cleanTime,
      date: dateStamp,
      location: 'Virtual Portal (192.168.1.18)',
      method: 'Virtual Portal',
      status: 'Verified'
    };

    setLogs([cleanLog, ...logs]);
    setIsClockedIn(!isClockedIn);
  };

  const handleSendCorrectionRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionReason) return;

    const overrideLog: ClockLog = {
      id: `log-dyn-${Date.now()}`,
      name: 'Davis Levin (You)',
      role: 'System Administrator',
      type: 'In',
      time: correctionTime,
      date: correctionDate,
      location: 'Manual Override Sync',
      method: 'Manual Override',
      status: 'Pending Approval'
    };

    setLogs([overrideLog, ...logs]);
    setCorrectionReason('');
    setShowCorrectionNotice(true);
    setTimeout(() => {
      setShowCorrectionNotice(false);
    }, 4000);
  };

  const myRecords = logs.filter(l => l.name.includes('(You)'));
  const exceptions = logs.filter(l => l.status === 'Late' || l.status === 'Pending Approval');

  const filteredLogs = () => {
    if (activeTabFilter === 'My Records') return myRecords;
    if (activeTabFilter === 'Exceptions') return exceptions;
    return logs;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 select-none">
      
      {/* Attendance Metrics + Punch device panel (Left 1/3) */}
      <div className="lg:col-span-1 space-y-6">
        
        {/* Device Punch virtual simulator card */}
        <div className="bg-gradient-to-b from-[#1bc1a1]/95 to-teal-800 text-white p-5 rounded-3xl shadow-md border border-[#1bc1a1]/30 flex flex-col justify-between relative overflow-hidden h-[360px]">
          {/* Ambient graphic background circles */}
          <span className="absolute -right-10 -top-10 w-44 h-44 bg-white/5 rounded-full" />
          <span className="absolute -left-10 -bottom-10 w-44 h-44 bg-white/5 rounded-full" />

          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full animate-ping" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#defff7]">Portal Active</span>
              </div>
              <span className="font-mono text-[9px] text-[#defff7]/60 font-medium">Terminal ID: #D882-PUN</span>
            </div>

            <div className="mt-8 text-center space-y-1">
              <p className="text-[11px] font-bold text-teal-150 uppercase tracking-wider">Shift Duration Active</p>
              <div className="flex items-baseline justify-center gap-1.5 font-mono">
                <span className="text-4xl md:text-5xl font-black tracking-tight">{String(elapsedHrs).padStart(2, '0')}</span>
                <span className="text-xl font-bold opacity-45">:</span>
                <span className="text-4xl md:text-5xl font-black tracking-tight">{String(elapsedMins).padStart(2, '0')}</span>
                <span className="text-xl font-bold opacity-45">:</span>
                <span className="text-xl font-bold text-teal-200 tracking-tight">{String(elapsedSecs).padStart(2, '0')}</span>
              </div>
              <p className="text-[10px] text-teal-150 font-bold">
                {isClockedIn ? "Live Recording Duty Shift" : "Shift Offline - Awaiting Clock-In"}
              </p>
            </div>
          </div>

          <div className="space-y-4 relative z-10">
            <button
              onClick={handleTogglePunchClock}
              className={`w-full py-3.5 rounded-2xl font-extrabold text-xs tracking-wide transition-all shadow-md cursor-pointer flex items-center justify-center gap-2 ${
                isClockedIn 
                  ? 'bg-rose-500 hover:bg-rose-600 text-white' 
                  : 'bg-white hover:bg-teal-50 text-teal-800'
              }`}
            >
              <Fingerprint className="w-5 h-5 shrink-0" />
              <span>{isClockedIn ? "CLOCK OUT / END SHIFT" : "CLOCK IN / START SHIFT"}</span>
            </button>

            <div className="flex justify-between items-center text-[10px] text-teal-150/90 font-bold border-t border-white/10 pt-2.5">
              <span>Method: Virtual Compliance</span>
              <span>192.168.1.18 &bull; SSL Secured</span>
            </div>
          </div>
        </div>

        {/* Dynamic tracker status cards */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
          <h3 className="font-extrabold text-slate-800 text-sm tracking-tight border-b border-slate-50 pb-1.5">My Current Metrics</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">FTE Working Hours</span>
              <span className="text-lg font-black text-slate-800 font-mono">158.5h</span>
              <p className="text-[9px] text-[#1bc1a1] font-bold mt-1">+4h overtime cycle</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Average Check-In</span>
              <span className="text-lg font-black text-slate-800 font-mono">08:52 AM</span>
              <p className="text-[9px] text-[#1bc1a1] font-bold mt-1">Excellent compliance</p>
            </div>
          </div>

          <div className="p-3 bg-amber-50/50 border border-amber-200/50 rounded-xl flex items-center gap-2 text-amber-800 text-xs font-semibold">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            <p className="leading-relaxed text-[11px]">Late penalty or missing attendance triggers are automatically flagged for manager override.</p>
          </div>
        </div>

      </div>

      {/* Corporate Ledger attendance log feed (Right 2/3) */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Sync table sheet */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 flex flex-col justify-between min-h-[440px]">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-50 gap-3">
              <div>
                <h3 className="font-extrabold text-[#1bc1a1] text-sm tracking-tight mb-0.5">Firm-wide Operations Journal</h3>
                <p className="text-[10px] text-slate-400 font-bold">Chronological biometrics journal & override ledgers</p>
              </div>

              {/* Filtering tab indicators */}
              <div className="flex items-center gap-1.5 border border-slate-150 p-1 rounded-xl bg-slate-50">
                {['All', 'My Records', 'Exceptions'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTabFilter(tab as any)}
                    className={`px-3 py-1.5 text-[10px] font-extrabold rounded-lg transition-colors cursor-pointer ${
                      activeTabFilter === tab
                        ? 'bg-white shadow-3xs text-slate-800 border border-slate-200/80 font-black'
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* List log views */}
            <div className="space-y-3.5 mt-5 max-h-[300px] overflow-y-auto pr-1">
              {filteredLogs().map((log) => (
                <div
                  key={log.id}
                  className="p-3 bg-slate-50 border border-slate-150 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-extrabold text-xs uppercase ${
                      log.type === 'In' 
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-150' 
                        : 'bg-rose-50 text-rose-600 border border-rose-150'
                    }`}>
                      {log.type}
                    </span>
                    <div>
                      <p className="font-bold text-slate-700">{log.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold leading-none">{log.role} &bull; <span className="font-mono">{log.date}</span></p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 font-semibold text-slate-500">
                    <div className="text-[11px] space-y-0.5">
                      <p className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-350 shrink-0" />
                        <span className="font-mono font-bold text-slate-700">{log.time}</span>
                      </p>
                      <p className="text-slate-400 leading-none text-[9px] font-bold inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-300" />
                        <span>{log.location}</span>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full border font-bold ${
                        log.status === 'Verified' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-150' 
                          : log.status === 'Late' 
                            ? 'bg-amber-50 text-amber-700 border-amber-150 font-bold' 
                            : 'bg-blue-50 text-blue-700 border-blue-150'
                      }`}>
                        {log.status}
                      </span>
                      <p className="text-[9px] text-slate-400 font-bold mt-1">{log.method}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Automated backup: synced to global cloud run operations</span>
            <div className="flex items-center gap-1 font-mono text-[9px] text-emerald-600 font-bold">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              <span>STABLE</span>
            </div>
          </div>
        </div>

        {/* Correction overriding submittal desk */}
        <div className="bg-white p-5 rounded-2xl border border-slate-105 shadow-xs">
          <div className="mb-4">
            <h3 className="font-extrabold text-slate-800 text-sm tracking-tight mb-0.5">Missed Punch? Request Manual Sync</h3>
            <p className="text-[10px] text-slate-400 font-bold">Override clock settings with administrative approvals</p>
          </div>

          <AnimatePresence>
            {showCorrectionNotice && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3.5 bg-emerald-50 text-emerald-700 text-xs rounded-xl flex items-center gap-2 border border-emerald-100 font-semibold"
              >
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Override request submitted successfully! Pending supervisor verification inside the ledger stack.</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSendCorrectionRequest} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Correction Sync Reason</label>
              <input
                type="text"
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1bc1a1]/50 focus:bg-white text-slate-700 font-semibold"
                placeholder="e.g. On-Site Client Meeting, HQ Scanner offline"
                value={correctionReason}
                onChange={(e) => setCorrectionReason(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Target Time</label>
              <input
                type="text"
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-750 font-bold font-mono"
                value={correctionTime}
                onChange={(e) => setCorrectionTime(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-[#1bc1a1] hover:bg-[#159d83] text-white text-xs font-bold rounded-lg cursor-pointer transition-all"
            >
              Submit Override
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
