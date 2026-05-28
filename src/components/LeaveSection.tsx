import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileCheck, 
  Clock, 
  Calendar, 
  User, 
  Check, 
  X, 
  Sparkles, 
  AlertTriangle,
  Plane,
  HeartPulse,
  Briefcase
} from 'lucide-react';

interface LeaveRequest {
  id: string;
  name: string;
  role: string;
  type: 'Annual Leave' | 'Sick Leave' | 'Casual' | 'Unpaid';
  range: string;
  duration: number; // days
  reason: string;
  status: 'Pending' | 'Approved' | 'Declined';
  comment?: string;
}

export default function LeaveSection() {
  // Sync requests state
  const [requests, setRequests] = useState<LeaveRequest[]>([
    { id: 'leave-1', name: 'Emma Watson', role: 'Junior HR Analyst', type: 'Sick Leave', range: 'Jun 05 - Jun 07', duration: 3, reason: 'Outpatient treatment follow-up recommendations.', status: 'Pending' },
    { id: 'leave-2', name: 'Marcus Sterling', role: 'Enterprise Sales Manager', type: 'Annual Leave', range: 'Jun 12 - Jun 19', duration: 7, reason: 'Family summer vacation travel plans.', status: 'Pending' },
    { id: 'leave-3', name: 'Rian Wijaya', role: 'Frontend Engineer', type: 'Casual', range: 'Jun 22 - Jun 23', duration: 1, reason: 'Personal domestic relocation details.', status: 'Approved' },
    { id: 'leave-4', name: 'Sophia Alexandra', role: 'Lead UX Architect', type: 'Annual Leave', range: 'Jun 28 - Jul 05', duration: 8, reason: 'Annual wellness rest sabbatical.', status: 'Declined', comment: 'Department overlapping launches - please schedule after Jul 10.' }
  ]);

  // Sabbatical self-registration states
  const [selfType, setSelfType] = useState<'Annual Leave' | 'Sick Leave' | 'Casual' | 'Unpaid'>('Annual Leave');
  const [selfStart, setSelfStart] = useState('Jun 20');
  const [selfEnd, setSelfEnd] = useState('Jun 24');
  const [selfReason, setSelfReason] = useState('');
  const [selfDays, setSelfDays] = useState(4);

  const [notification, setNotification] = useState<string | null>(null);

  // Leave approval controllers of the board
  const handleApprovalAction = (id: string, action: 'Approved' | 'Declined', refText?: string) => {
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          return {
            ...r,
            status: action,
            comment: refText || (action === 'Declined' ? 'Declined due to operational overhead.' : 'Approved & logged.')
          };
        }
        return r;
      })
    );
  };

  const handleSelfSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selfReason) return;

    const newReq: LeaveRequest = {
      id: `leave-dyn-${Date.now()}`,
      name: 'Davis Levin (You)',
      role: 'System Administrator',
      type: selfType,
      range: `${selfStart} - ${selfEnd}`,
      duration: selfDays,
      reason: selfReason,
      status: 'Pending'
    };

    setRequests([newReq, ...requests]);
    setSelfReason('');
    setNotification('Dynamic Sabbatical request dispatched to corporate review queue!');
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const getLeaveIcon = (type: string) => {
    switch (type) {
      case 'Sick Leave': return <HeartPulse className="w-4 h-4 text-rose-500" />;
      case 'Annual Leave': return <Plane className="w-4 h-4 text-emerald-500" />;
      default: return <Briefcase className="w-4 h-4 text-amber-500" />;
    }
  };

  const pendingRequests = requests.filter(r => r.status === 'Pending');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 select-none leading-relaxed">
      
      {/* Approvals and History index list (Left 2/3) */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Allowance Balance indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-3xs flex justify-between items-center">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Annual Leave Balance</span>
              <span className="text-xl font-extrabold text-slate-800 font-mono">14 of 24 days</span>
              <p className="text-[9px] text-[#1bc1a1] font-semibold mt-1">10 days consumed</p>
            </div>
            <span className="w-9 h-9 rounded-xl bg-emerald-50 text-[#1bc1a1] flex items-center justify-center shrink-0">
              <Plane className="w-5 h-5" />
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-3xs flex justify-between items-center">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Medical Leave Balance</span>
              <span className="text-xl font-extrabold text-slate-800 font-mono">8 of 10 days</span>
              <p className="text-[9px] text-slate-405 font-bold mt-1">Emergency allocation sync</p>
            </div>
            <span className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
              <HeartPulse className="w-5 h-5" />
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-3xs flex justify-between items-center">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Maternal/Sabbatical</span>
              <span className="text-xl font-extrabold text-slate-800 font-mono">5 of 5 days</span>
              <p className="text-[9px] text-slate-405 font-bold mt-1">Full allowance intact</p>
            </div>
            <span className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
              <Briefcase className="w-5 h-5" />
            </span>
          </div>
        </div>

        {/* Real-time Approvals board */}
        <div className="bg-white rounded-2xl border border-slate-105 shadow-xs p-5 min-h-[440px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-50 mb-4">
              <div>
                <h3 className="font-extrabold text-[#1bc1a1] text-sm tracking-tight mb-0.5">Sabbatical Approvals Control Board</h3>
                <p className="text-[10px] text-slate-400 font-bold">Manage, review and approve team leave allocations</p>
              </div>
              <span className="text-xs font-bold text-slate-400 font-mono">
                {pendingRequests.length} Pending Actions
              </span>
            </div>

            {/* List request cards */}
            {pendingRequests.length === 0 ? (
              <div className="p-12 text-center bg-slate-50/70 border border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center mt-4">
                <FileCheck className="w-10 h-10 text-slate-300 mb-2 animate-pulse" />
                <h4 className="text-sm font-bold text-slate-700">Clear approvals queue</h4>
                <p className="text-xs text-slate-450 mt-1">All employee leave requests are fully accounted for.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {pendingRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-extrabold text-xs text-slate-800">{req.name}</h4>
                          <p className="text-[10px] text-slate-400 font-bold">{req.role}</p>
                        </div>
                        <span className="text-[9px] font-black font-mono text-[#1bc1a1] bg-[#defff7] px-2 py-0.5 rounded-md border border-[#1bc1a1]/20">
                          {req.duration} Days
                        </span>
                      </div>

                      <div className="flex gap-2.5 items-center mt-3 text-[11px] font-bold text-slate-655 bg-white border border-slate-100 p-2 rounded-xl">
                        {getLeaveIcon(req.type)}
                        <span>{req.type} &bull; <span className="font-mono text-slate-505 font-bold">{req.range}</span></span>
                      </div>

                      <p className="text-[11px] text-slate-500 font-semibold mt-3 bg-white/40 p-2 rounded border border-slate-100 border-dashed leading-relaxed">
                        Reason: "{req.reason}"
                      </p>
                    </div>

                    <div className="flex gap-2.5 pt-2 border-t border-slate-100">
                      <button
                        onClick={() => handleApprovalAction(req.id, 'Declined')}
                        className="flex-1 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-600 text-[11px] font-extrabold cursor-pointer transition-colors"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleApprovalAction(req.id, 'Approved')}
                        className="flex-1 py-1.5 rounded-lg bg-[#1bc1a1] hover:bg-[#12947c] text-white text-[11px] font-extrabold cursor-pointer transition-colors"
                      >
                        Approve Request
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Corporate attendance ledger fully online</span>
            <div className="flex items-center gap-1 font-mono text-[9px] text-emerald-600 font-bold">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              <span>SYNCED</span>
            </div>
          </div>
        </div>

      </div>

      {/* Interactive Self-Submission request Form (Right 1/3) */}
      <div className="bg-white rounded-2xl border border-slate-150 shadow-xs p-5 flex flex-col justify-between h-full min-h-[460px]">
        <div>
          <div className="mb-4">
            <h3 className="font-extrabold text-slate-800 text-sm tracking-tight mb-0.5">Apply For Personal Sabbatical</h3>
            <p className="text-[10px] text-slate-400 font-bold">Register leave requests and test matching approvals flows</p>
          </div>

          <AnimatePresence>
            {notification && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl flex items-center gap-2 border border-emerald-100 font-bold"
              >
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{notification}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSelfSubmitRequest} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Leave Classification</label>
              <select
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-205 text-slate-655 rounded-lg font-bold"
                value={selfType}
                onChange={(e) => setSelfType(e.target.value as any)}
              >
                <option value="Annual Leave">Annual Vacation / Rest Leave</option>
                <option value="Sick Leave">Emergency Sick / Medical Leave</option>
                <option value="Casual">Casual / Family relocation</option>
                <option value="Unpaid">Unpaid Personal Sabbatical</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 font-mono">Date Range Start</label>
                <input
                  type="text"
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-205 text-slate-655 rounded-lg font-bold font-mono"
                  value={selfStart}
                  onChange={(e) => setSelfStart(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 font-mono">Date Range End</label>
                <input
                  type="text"
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-205 text-slate-655 rounded-lg font-bold font-mono"
                  value={selfEnd}
                  onChange={(e) => setSelfEnd(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Requested Days</label>
              <input
                type="number"
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-205 text-slate-655 rounded-lg font-bold font-mono"
                value={selfDays}
                onChange={(e) => setSelfDays(Number(e.target.value))}
                min="1"
                max="30"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 font-sans">Statement Reasons</label>
              <textarea
                rows={3}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-205 rounded-lg focus:outline-none focus:border-[#1bc1a1] resize-none text-slate-705 font-medium leading-relaxed"
                placeholder="Declare reason for requested timecard leave..."
                value={selfReason}
                onChange={(e) => setSelfReason(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-[#1bc1a1] to-teal-555 text-white font-extrabold text-xs shadow-xs rounded-xl cursor-pointer hover:opacity-90 active:scale-98 transition-transform"
            >
              Dispatch Sabbatical Request
            </button>
          </form>
        </div>

        {/* Live requests logs feed status */}
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 max-h-[170px] overflow-y-auto pr-1">
          <h4 className="text-[10px] font-black text-slate-405 uppercase tracking-widest leading-none mb-2">My Historic Requests</h4>

          {requests.map((r) => (
            <div key={r.id} className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 flex flex-col gap-1.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-extrabold text-slate-705">{r.name}</span>
                <span className={`text-[9px] text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                  r.status === 'Approved' 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-150' 
                    : r.status === 'Declined' 
                      ? 'bg-rose-50 text-rose-700 border-rose-150' 
                      : 'bg-amber-50 text-amber-700 border-amber-150'
                }`}>
                  {r.status}
                </span>
              </div>
              <p className="text-[10px] font-bold text-slate-400 font-mono leading-none">{r.type} &bull; {r.range} ({r.duration} days)</p>
              <p className="text-[11px] text-slate-500 font-medium leading-tight">Reason: "{r.reason}"</p>
              {r.comment && (
                <p className="text-[10px] text-slate-400 font-semibold bg-white p-1.5 rounded border border-slate-100 italic">
                  Note: "{r.comment}"
                </p>
              )}
            </div>
          ))}

        </div>

      </div>

    </div>
  );
}
