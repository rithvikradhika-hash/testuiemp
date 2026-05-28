import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Clock, Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface Employee {
  name: string;
  role: string;
  avatar: string;
}

interface LoginPageProps {
  onLogin: (employee: Employee) => void;
  employees: Employee[];
}

export default function LoginPage({ onLogin, employees }: LoginPageProps) {
  const [selectedEmp, setSelectedEmp] = useState<Employee>(employees[0]);
  const [email, setEmail] = useState('alex@timesync.com');
  const [password, setPassword] = useState('password123');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmpSelect = (emp: Employee) => {
    setSelectedEmp(emp);
    const firstName = emp.name.split(' ')[0].toLowerCase();
    setEmail(`${firstName}@timesync.com`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API delay
    setTimeout(() => {
      onLogin(selectedEmp);
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="min-h-screen w-full bg-[#0f172a] text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans select-none">
      {/* Decorative Background Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-teal-500/10 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl relative z-10"
      >
        {/* Brand Logo & Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#1bc1a1] to-emerald-400 flex items-center justify-center shadow-lg shadow-[#1bc1a1]/25 mb-4">
            <Clock className="w-6 h-6 text-slate-900 fill-current" />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
            TimeSync
            <Sparkles className="w-4 h-4 text-[#1bc1a1]" />
          </h2>
          <p className="text-slate-400 text-xs mt-1.5 font-medium">Clock in to start your work session</p>
        </div>

        {/* Profile Selector Row */}
        <div className="mb-6">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2.5">
            Select Employee Profile
          </label>
          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
            {employees.slice(0, 3).map((emp) => {
              const isSelected = selectedEmp.name === emp.name;
              return (
                <button
                  key={emp.name}
                  type="button"
                  onClick={() => handleEmpSelect(emp)}
                  className={`flex flex-col items-center p-3 rounded-2xl border transition-all duration-200 cursor-pointer min-w-[100px] flex-1 ${
                    isSelected
                      ? 'bg-[#1bc1a1]/10 border-[#1bc1a1] scale-[1.02]'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <img
                    src={emp.avatar}
                    alt={emp.name}
                    className="w-10 h-10 rounded-full object-cover mb-2 border border-slate-700"
                  />
                  <span className="text-[10px] font-bold text-white text-center truncate w-full">
                    {emp.name}
                  </span>
                  <span className="text-[8px] text-slate-400 truncate w-full text-center">
                    {emp.role}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-[#1bc1a1]/50 focus:bg-slate-950 transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5">
              Security Key
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:border-[#1bc1a1]/50 focus:bg-slate-950 transition-colors"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 bg-[#1bc1a1] hover:bg-[#159d83] disabled:bg-[#1bc1a1]/50 text-slate-950 text-xs font-black tracking-wide rounded-xl shadow-lg shadow-[#1bc1a1]/10 flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:scale-[1.01]"
          >
            {isSubmitting ? (
              <span>Clocking In...</span>
            ) : (
              <>
                <span>Clock In &amp; Enter</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security badge info */}
        <div className="flex items-center justify-center gap-1.5 mt-6 text-[10px] text-slate-500 font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
          <span>Secured with TimeSync Session Tracker</span>
        </div>
      </motion.div>
    </div>
  );
}
