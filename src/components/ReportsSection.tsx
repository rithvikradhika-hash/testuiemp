import { useState } from 'react';
import { motion } from 'motion/react';
import { Clock, DollarSign, TrendingUp, Users, Download, BarChart3, UserCheck } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  Legend,
} from 'recharts';

// ── Weekly productivity data (8 weeks) ──────────────────────────────────────
const WEEKLY_DATA = [
  { date: 'Apr 09', totalHours: 48, billableHours: 38 },
  { date: 'Apr 16', totalHours: 52, billableHours: 42 },
  { date: 'Apr 23', totalHours: 55, billableHours: 45 },
  { date: 'Apr 30', totalHours: 50, billableHours: 40 },
  { date: 'May 07', totalHours: 58, billableHours: 47 },
  { date: 'May 14', totalHours: 54, billableHours: 44 },
  { date: 'May 21', totalHours: 56, billableHours: 43 },
  { date: 'May 28', totalHours: 54, billableHours: 43.6 },
];

// ── Monthly productivity data ───────────────────────────────────────────────
const MONTHLY_DATA = [
  { date: 'Jan', totalHours: 180, billableHours: 140 },
  { date: 'Feb', totalHours: 195, billableHours: 158 },
  { date: 'Mar', totalHours: 210, billableHours: 172 },
  { date: 'Apr', totalHours: 205, billableHours: 165 },
  { date: 'May', totalHours: 222, billableHours: 178 },
];

// ── Time by Project data ────────────────────────────────────────────────────
const PROJECT_DATA = [
  { name: 'Marketing Dashboard', hours: 64, color: '#6366f1' },
  { name: 'CRM Integration', hours: 58, color: '#1bc1a1' },
  { name: 'E-commerce Platform', hours: 52, color: '#f59e0b' },
  { name: 'Website Redesign', hours: 48, color: '#ec4899' },
  { name: 'Cloud Migration', hours: 42, color: '#8b5cf6' },
  { name: 'Mobile App', hours: 36, color: '#3b82f6' },
  { name: 'API Development', hours: 30, color: '#14b8a6' },
];

// ── Team Performance data ───────────────────────────────────────────────────
const TEAM_DATA = [
  { name: 'Sarah', totalHours: 58, billableHours: 48 },
  { name: 'James', totalHours: 55, billableHours: 44 },
  { name: 'Emily', totalHours: 52, billableHours: 43 },
  { name: 'David', totalHours: 50, billableHours: 40 },
  { name: 'Lisa', totalHours: 54, billableHours: 46 },
  { name: 'Ryan', totalHours: 48, billableHours: 38 },
  { name: 'Mia', totalHours: 56, billableHours: 45 },
  { name: 'Alex', totalHours: 54, billableHours: 38.6 },
];

// ── Stats card config ───────────────────────────────────────────────────────
const STAT_CARDS = [
  {
    label: 'Total Hours Logged',
    value: '427.1',
    change: '+12%',
    icon: Clock,
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
    sub: '',
  },
  {
    label: 'Billable Hours',
    value: '342.6',
    change: '+8%',
    icon: DollarSign,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    sub: '80% of total',
  },
  {
    label: 'Estimated Revenue',
    value: '$42,212',
    change: '+15%',
    icon: TrendingUp,
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-600',
    sub: 'Based on hourly rates',
  },
  {
    label: 'Active Team Members',
    value: '8',
    change: '',
    icon: Users,
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    sub: '7 active projects',
  },
];

// ── Custom tooltip ──────────────────────────────────────────────────────────
function ProductivityTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 text-white rounded-xl shadow-xl px-4 py-3 text-xs font-mono pointer-events-none">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.dataKey} className="flex items-center gap-2 mb-0.5">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-slate-300">{entry.name}:</span>
          <span className="font-extrabold">{entry.value}h</span>
        </p>
      ))}
    </div>
  );
}

function ProjectTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="bg-slate-900 text-white rounded-xl shadow-xl px-4 py-3 text-xs font-mono pointer-events-none">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{data.name}</p>
      <p className="font-extrabold text-sm">{data.hours}h logged</p>
    </div>
  );
}

function TeamTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 text-white rounded-xl shadow-xl px-4 py-3 text-xs font-mono pointer-events-none">
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">{label}</p>
      {payload.map((entry: any) => (
        <p key={entry.dataKey} className="flex items-center gap-2 mb-0.5">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.fill }} />
          <span className="text-slate-300">{entry.name}:</span>
          <span className="font-extrabold">{entry.value}h</span>
        </p>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Main component
// ═══════════════════════════════════════════════════════════════════════════
export default function ReportsSection() {
  const [trendView, setTrendView] = useState<'Weekly' | 'Monthly'>('Weekly');
  const trendData = trendView === 'Weekly' ? WEEKLY_DATA : MONTHLY_DATA;

  return (
    <div className="space-y-6 select-none animate-fadeIn leading-relaxed">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">
            Reports &amp; Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-0.5">
            Comprehensive insights into time tracking and productivity.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 text-xs font-bold hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer shadow-xs">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* ── Stat Cards ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {STAT_CARDS.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07, duration: 0.35 }}
              className="p-5 bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${card.iconColor}`} />
                </div>
                {card.change && (
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-mono">
                    {card.change}
                  </span>
                )}
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">{card.value}</p>
              <p className="text-xs font-bold text-slate-400 mt-0.5">{card.label}</p>
              {card.sub && (
                <p className="text-[10px] text-slate-400 font-medium mt-1">{card.sub}</p>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* ── 8-Week Productivity Trend (full width) ────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.35 }}
        className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm sm:text-base tracking-tight">
              Productivity Trend
            </h3>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
              {trendView === 'Weekly' ? '8-week hours overview' : 'Monthly hours overview'}
            </p>
          </div>

          {/* Toggle buttons */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
            {(['Weekly', 'Monthly'] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => setTrendView(opt)}
                className={`px-3.5 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  trendView === opt
                    ? 'bg-white text-slate-800 shadow-xs'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={trendData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="gradTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0.01} />
              </linearGradient>
              <linearGradient id="gradBillable" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1bc1a1" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#1bc1a1" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip content={<ProductivityTooltip />} />
            <Area
              type="monotone"
              dataKey="totalHours"
              name="Total Hours"
              stroke="#6366f1"
              strokeWidth={2.5}
              fill="url(#gradTotal)"
              dot={{ r: 4, fill: '#fff', stroke: '#6366f1', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="billableHours"
              name="Billable Hours"
              stroke="#1bc1a1"
              strokeWidth={2.5}
              fill="url(#gradBillable)"
              dot={{ r: 4, fill: '#fff', stroke: '#1bc1a1', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#1bc1a1', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="flex items-center gap-5 mt-3 pt-3 border-t border-slate-50">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
            <span className="w-3 h-3 rounded-full bg-indigo-500" />
            Total Hours
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
            <span className="w-3 h-3 rounded-full bg-[#1bc1a1]" />
            Billable Hours
          </div>
        </div>
      </motion.div>

      {/* ── Bottom Row: Project + Team ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Time by Project – horizontal bar chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.35 }}
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm sm:text-base tracking-tight flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-[#1bc1a1]" />
                Time by Project
              </h3>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Hours logged per project</p>
            </div>
            <span className="text-[10px] font-mono font-extrabold bg-[#defff7] text-[#0f766e] px-2 py-0.5 rounded-full">
              {PROJECT_DATA.length} Projects
            </span>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={PROJECT_DATA} layout="vertical" margin={{ top: 0, right: 20, left: 10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11, fontWeight: 600, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
                width={130}
              />
              <Tooltip content={<ProjectTooltip />} cursor={{ fill: '#f8fafc' }} />
              <Bar dataKey="hours" radius={[0, 6, 6, 0]} barSize={18}>
                {PROJECT_DATA.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Team Performance – grouped bar chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.35 }}
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm sm:text-base tracking-tight flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-[#1bc1a1]" />
                Team Performance
              </h3>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                Individual hours – total vs billable
              </p>
            </div>
            <span className="text-[10px] font-mono font-extrabold bg-[#defff7] text-[#0f766e] px-2 py-0.5 rounded-full">
              {TEAM_DATA.length} Members
            </span>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={TEAM_DATA} margin={{ top: 0, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fontWeight: 600, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
                width={35}
              />
              <Tooltip content={<TeamTooltip />} cursor={{ fill: '#f8fafc' }} />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 11, fontWeight: 700 }}
              />
              <Bar
                dataKey="totalHours"
                name="Total Hours"
                fill="#6366f1"
                radius={[4, 4, 0, 0]}
                barSize={14}
              />
              <Bar
                dataKey="billableHours"
                name="Billable Hours"
                fill="#1bc1a1"
                radius={[4, 4, 0, 0]}
                barSize={14}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </div>
  );
}
