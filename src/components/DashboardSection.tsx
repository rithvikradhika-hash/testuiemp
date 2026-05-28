import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Clock,
  DollarSign,
  TrendingUp,
  Calendar,
  Users,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface DashboardSectionProps {
  onTabChange: (tab: string) => void;
}

export default function DashboardSection({ onTabChange }: DashboardSectionProps) {
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  // Weekly activity data
  const weeklyData = [
    { day: 'Fri', hours: 6.2 },
    { day: 'Sat', hours: 0 },
    { day: 'Sun', hours: 0 },
    { day: 'Mon', hours: 7.8 },
    { day: 'Tue', hours: 8.5 },
    { day: 'Wed', hours: 6.1 },
    { day: 'Thu', hours: 7.4 },
  ];

  // Project distribution data
  const projectData = [
    { name: 'Website Redesign', value: 14, color: '#818cf8' },
    { name: 'Mobile App', value: 16, color: '#f472b6' },
    { name: 'Cloud Migration', value: 13, color: '#34d399' },
    { name: 'E-commerce Platform', value: 14, color: '#fb923c' },
    { name: 'CRM Integration', value: 14, color: '#a78bfa' },
    { name: 'Marketing Dashboard', value: 16, color: '#38bdf8' },
    { name: 'API Development', value: 13, color: '#2dd4bf' },
  ];

  const statCards = [
    {
      label: 'Total Hours',
      value: '414.2',
      change: '+12%',
      icon: Clock,
      iconBg: 'bg-indigo-50',
      iconColor: 'text-indigo-500',
    },
    {
      label: 'Active Projects',
      value: '7',
      change: '',
      icon: DollarSign,
      iconBg: 'bg-pink-50',
      iconColor: 'text-pink-500',
    },
    {
      label: 'This Week',
      value: '0.0 / 40',
      change: '',
      icon: TrendingUp,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-500',
    },
    {
      label: 'Days Active',
      value: '15',
      change: '',
      icon: Calendar,
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-500',
    },
  ];

  return (
    <div className="space-y-6 select-none">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
        <p className="text-slate-500 text-sm mt-1">Welcome back! Here's your productivity overview.</p>
      </div>

      {/* Week in Review Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-500 via-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.15),_transparent_60%)]" />
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <span>📊</span> Week in Review
            </h3>
            <p className="text-indigo-100 text-sm mt-1">
              You've logged <strong className="text-white">0.0 hours</strong> this week across <strong className="text-white">7 projects</strong>
            </p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-5 py-3 text-center border border-white/20">
              <p className="text-xs text-indigo-100 uppercase tracking-wider">Active Tasks</p>
              <p className="text-2xl font-bold">1</p>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl px-5 py-3 text-center border border-white/20">
              <p className="text-xs text-indigo-100 uppercase tracking-wider">Team Online</p>
              <p className="text-2xl font-bold">5</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.iconBg} ${stat.iconColor} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
                {stat.change && (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    <ArrowUpRight className="w-3 h-3" />
                    {stat.change}
                  </span>
                )}
              </div>
              <h3 className="text-sm text-slate-500 font-medium">{stat.label}</h3>
              <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Weekly Activity Chart */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-xs p-5">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Weekly Activity</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    fontSize: '13px',
                  }}
                  formatter={(value: number) => [`${value}h`, 'Hours']}
                />
                <Area
                  type="monotone"
                  dataKey="hours"
                  stroke="#818cf8"
                  strokeWidth={2.5}
                  fill="url(#areaGrad)"
                  dot={{ r: 4, fill: '#818cf8', stroke: '#fff', strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Project Distribution */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-xs p-5">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Project Distribution</h3>
          <div className="h-[180px] flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                  onMouseEnter={(_, index) => setHoveredProject(projectData[index].name)}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  {projectData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      opacity={hoveredProject && hoveredProject !== entry.name ? 0.4 : 1}
                      style={{ transition: 'opacity 0.2s ease' }}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                  formatter={(value: number) => [`${value}%`, 'Share']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="mt-4 space-y-2">
            {projectData.map((proj) => (
              <div
                key={proj.name}
                className="flex items-center justify-between text-sm"
                onMouseEnter={() => setHoveredProject(proj.name)}
                onMouseLeave={() => setHoveredProject(null)}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: proj.color }}
                  />
                  <span className="text-slate-600">{proj.name}</span>
                </div>
                <span className="font-medium text-slate-800">{proj.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
