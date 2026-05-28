import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  FileCheck, 
  Sliders, 
  Sparkles, 
  CheckCircle, 
  Clock, 
  ArrowUpRight,
  TrendingUp,
  SlidersHorizontal
} from 'lucide-react';

interface PayrollSlip {
  id: string;
  name: string;
  role: string;
  department: string;
  baseSalary: number; // monthly
  overtimeHours: number;
  bonusPercentage: number; // 0 to 50%
  status: 'Pending Approval' | 'Released' | 'Processing';
  bankName: string;
}

export default function PayrollSection() {
  // Sync core slips in state
  const [slips, setSlips] = useState<PayrollSlip[]>([
    { id: 'pay-1', name: 'Sophia Alexandra', role: 'Lead UX Architect', department: 'Product Design', baseSalary: 12080, overtimeHours: 8, bonusPercentage: 15, status: 'Pending Approval', bankName: 'Chase Bank NY' },
    { id: 'pay-2', name: 'Marcus Sterling', role: 'Enterprise Sales Manager', department: 'Operations', baseSalary: 8160, overtimeHours: 12, bonusPercentage: 25, status: 'Pending Approval', bankName: 'Wells Fargo CT' },
    { id: 'pay-3', name: 'Emma Watson', role: 'Junior HR Analyst', department: 'Human Resources', baseSalary: 5160, overtimeHours: 0, bonusPercentage: 0, status: 'Released', bankName: 'CitiBank West' },
    { id: 'pay-4', name: 'Liam Neeson', role: 'Senior R&D Architect', department: 'R&D', baseSalary: 14000, overtimeHours: 15, bonusPercentage: 30, status: 'Released', bankName: 'Bank of America Cal' },
    { id: 'pay-5', name: 'Rian Wijaya', role: 'Frontend Engineer', department: 'R&D', baseSalary: 7080, overtimeHours: 4, bonusPercentage: 10, status: 'Pending Approval', bankName: 'HSBC Tokyo Branch' }
  ]);

  // Current focal employee selection for the calculator
  const [focusId, setFocusId] = useState<string>('pay-1');

  // Interactive dynamic math configurations
  const [overrideHours, setOverrideHours] = useState<number>(8);
  const [overrideBonus, setOverrideBonus] = useState<number>(15);

  const [releaseNotification, setReleaseNotification] = useState<string | null>(null);

  const focalSlip = slips.find((s) => s.id === focusId) || slips[0];

  // Recount totals dynamically for the metric cards!
  const calculateTotals = () => {
    let totalSpend = 0;
    slips.forEach((sl) => {
      const isSelected = sl.id === focusId;
      // If selected employee in sidebar, use currently adjusted interactive state overrides
      const hrs = isSelected ? overrideHours : sl.overtimeHours;
      const bPct = isSelected ? overrideBonus : sl.bonusPercentage;
      
      const overtimePay = hrs * 45;
      const bonusPay = sl.baseSalary * (bPct / 100);
      const gross = sl.baseSalary + overtimePay + bonusPay;
      const taxWithheld = gross * 0.20;
      const net = gross - taxWithheld;
      
      totalSpend += net;
    });
    return totalSpend;
  };

  const syncFocusEmployee = (id: string) => {
    setFocusId(id);
    const target = slips.find((s) => s.id === id);
    if (target) {
      setOverrideHours(target.overtimeHours);
      setOverrideBonus(target.bonusPercentage);
    }
  };

  // Math equations: Overtime rate = $45/hr. Tax bracket withholding = 20%
  const calcBase = focalSlip.baseSalary;
  const calcOvertimePay = overrideHours * 45;
  const calcBonusPay = calcBase * (overrideBonus / 100);
  const calcGross = calcBase + calcOvertimePay + calcBonusPay;
  const calcTaxWithheld = calcGross * 0.20;
  const calcNetOut = calcGross - calcTaxWithheld;

  const handleReleaseFunds = () => {
    setSlips((prev) =>
      prev.map((s) => {
        if (s.id === focusId) {
          return {
            ...s,
            overtimeHours: overrideHours,
            bonusPercentage: overrideBonus,
            status: 'Released'
          };
        }
        return s;
      })
    );

    setReleaseNotification(`Compliance Ledger Approved: $${calcNetOut.toLocaleString(undefined, { maximumFractionDigits: 2 })} released safely to ${focalSlip.name}.`);
    setTimeout(() => {
      setReleaseNotification(null);
    }, 4500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 select-none animate-fadeIn">
      
      {/* Ledger and Table Index (Left 2/3) */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Dynamic Spend Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-3xs flex justify-between items-center">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Projected Spend</span>
              <span className="text-xl font-extrabold text-slate-800 font-mono">
                ${calculateTotals().toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
              <p className="text-[9px] text-emerald-500 font-semibold mt-1">Live state recalculations</p>
            </div>
            <span className="w-9 h-9 rounded-xl bg-teal-50 text-[#1bc1a1] flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-3xs flex justify-between items-center">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Bonus Allocation</span>
              <span className="text-xl font-extrabold text-slate-800 font-mono">
                ${slips.reduce((acc, s) => acc + (s.baseSalary * (s.bonusPercentage / 100)), 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
              <p className="text-[9px] text-slate-400 font-bold mt-1">Discretionary appraisals</p>
            </div>
            <span className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-3xs flex justify-between items-center">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Payroll Locking Gate</span>
              <span className="text-xl font-extrabold text-slate-800 font-mono">In 6 Days</span>
              <p className="text-[9px] text-[#1bc1a1] font-bold mt-1">Cycle: Monthly compliance</p>
            </div>
            <span className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </span>
          </div>
        </div>

        {/* Major Ledger Sheet */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 min-h-[400px] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-50 mb-5">
              <div>
                <h3 className="font-extrabold text-[#1bc1a1] text-sm tracking-tight mb-0.5">Personnel Financial Registers</h3>
                <p className="text-[10px] text-slate-400 font-bold">Comprehensive staff pay ledgers, multipliers, and banking references.</p>
              </div>
              <span className="text-xs font-bold text-slate-400 font-mono">5 Active Ledgers</span>
            </div>

            {/* List Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                    <th className="p-3">Personnel Member</th>
                    <th className="p-3">Department</th>
                    <th className="p-3 font-mono">Base pay</th>
                    <th className="p-3 text-center">Overtime</th>
                    <th className="p-3 text-center">Bonus multiplier</th>
                    <th className="p-3">Direct Bank</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {slips.map((sl) => {
                    const isFocal = sl.id === focusId;
                    const hrs = isFocal ? overrideHours : sl.overtimeHours;
                    const bPct = isFocal ? overrideBonus : sl.bonusPercentage;
                    const gross = sl.baseSalary + (hrs * 45) + (sl.baseSalary * (bPct / 100));
                    const netVal = gross * 0.80;

                    return (
                      <tr
                        key={sl.id}
                        onClick={() => syncFocusEmployee(sl.id)}
                        className={`hover:bg-[#1bc1a1]/5 cursor-pointer select-none transition-colors ${
                          isFocal ? 'bg-[#1bc1a1]/5 border-l-2 border-l-[#1bc1a1]' : ''
                        }`}
                      >
                        <td className="p-3 font-extrabold text-slate-700">{sl.name}</td>
                        <td className="p-3 font-semibold text-slate-500">{sl.department}</td>
                        <td className="p-3 font-mono font-bold text-slate-600">${sl.baseSalary.toLocaleString()}/mo</td>
                        <td className="p-3 text-center font-bold font-mono text-slate-600">{hrs}h</td>
                        <td className="p-3 text-center font-bold font-mono text-[#1bc1a1]">{bPct}%</td>
                        <td className="p-3 text-slate-400 font-bold">{sl.bankName}</td>
                        <td className="p-3">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                            sl.status === 'Released'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-150'
                              : 'bg-amber-50 text-amber-700 border-amber-150'
                          }`}>
                            {sl.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 font-bold mt-4 pt-3 border-t border-slate-50">
            Note: Discretionary multipliers require secondary manager clearance, automated payouts will trigger on locked run.
          </p>
        </div>

      </div>

      {/* Interactive Pay Calculator (Right 1/3) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 flex flex-col justify-between min-h-[480px]">
        
        <div>
          <div className="mb-4">
            <h3 className="font-extrabold text-slate-800 text-sm tracking-tight mb-0.5">Staged Pay Calculation</h3>
            <p className="text-[10px] text-slate-400 font-bold">Dynamic formula calculator & compliance validation</p>
          </div>

          <AnimatePresence>
            {releaseNotification && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl flex items-center gap-1.5 border border-emerald-100 font-semibold leading-relaxed"
              >
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>{releaseNotification}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-200 pb-2">
              <div>
                <h4 className="font-black text-xs text-slate-850 truncate max-w-[150px]">{focalSlip.name}</h4>
                <p className="text-[10px] text-slate-400 font-bold">{focalSlip.role}</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-white border border-slate-200 text-slate-650 rounded-md">
                Base Match
              </span>
            </div>

            {/* Interactive sliders */}
            <div className="space-y-4 pt-1">
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold text-slate-600">
                  <span>Overtime Hours:</span>
                  <span className="font-mono text-slate-800 font-black">{overrideHours} hrs / month</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  className="w-full h-1.5 bg-slate-200/60 rounded-lg appearance-none cursor-pointer accent-[#1bc1a1]"
                  value={overrideHours}
                  onChange={(e) => setOverrideHours(Number(e.target.value))}
                />
                <p className="text-[9px] text-slate-400 font-bold">Standard rate: <span className="font-semibold text-[#1bc1a1]">$45.00/hr</span> compensation</p>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold text-slate-605">
                  <span>Discretionary Bonus Multiplier:</span>
                  <span className="font-mono text-slate-800 font-black">+{overrideBonus}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  className="w-full h-1.5 bg-slate-200/60 rounded-lg appearance-none cursor-pointer accent-[#1bc1a1]"
                  value={overrideBonus}
                  onChange={(e) => setOverrideBonus(Number(e.target.value))}
                />
                <p className="text-[9px] text-slate-400 font-bold">Performance premium added to active base check</p>
              </div>
            </div>

            {/* Math Formula Panel */}
            <div className="border-t border-slate-200 pt-3.5 space-y-2 text-xs font-bold text-slate-550">
              <div className="flex justify-between">
                <span className="text-slate-400">Monthly Base Salary:</span>
                <span className="font-mono text-slate-700">${calcBase.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Overtime Compensation:</span>
                <span className="font-mono text-slate-700">+${calcOvertimePay.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Discretionary Appraisals:</span>
                <span className="font-mono text-slate-700">+${calcBonusPay.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-slate-200 pb-2">
                <span className="text-slate-400">Withholding Tax (20% bracket):</span>
                <span className="font-mono text-rose-500">-${calcTaxWithheld.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
              </div>
              <div className="flex justify-between items-baseline pt-1">
                <span className="text-slate-800 font-black">Total Net Payout:</span>
                <span className="text-lg font-black text-emerald-600 font-mono">
                  ${calcNetOut.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3.5 pt-4">
          <button
            onClick={handleReleaseFunds}
            disabled={focalSlip.status === 'Released'}
            className="w-full py-3 bg-[#1bc1a1] hover:bg-[#159d83] disabled:opacity-40 text-white font-extrabold text-xs rounded-xl shadow-md cursor-pointer transition-colors active:scale-98 transition-transform"
          >
            {focalSlip.status === 'Released' ? 'Funds Distributed / Pay Approved' : 'Authorize & Disburse Net Payout'}
          </button>
          
          <p className="text-[10px] text-slate-400 text-center leading-relaxed font-bold">
            Banking verification routed securely via <span className="text-slate-455 font-black">{focalSlip.bankName}</span> processing ledger.
          </p>
        </div>

      </div>

    </div>
  );
}
