import { motion } from 'motion/react';
import { FileText, MessageSquare, Briefcase, Award, TrendingUp, TrendingDown } from 'lucide-react';
import { ApplicantStage } from '../types';

interface MetricCardsProps {
  totalApplicantsCount: number;
  interviewedCount: number;
  hiredCount: number;
  activeStageFilter: ApplicantStage | 'All';
  onMetricClick: (stage: ApplicantStage | 'All') => void;
}

export default function MetricCards({
  totalApplicantsCount,
  interviewedCount,
  hiredCount,
  activeStageFilter,
  onMetricClick
}: MetricCardsProps) {

  const metricsObj = [
    {
      id: 'all',
      stageTarget: 'All' as ApplicantStage | 'All',
      label: 'Total Applicants',
      value: totalApplicantsCount,
      percentage: '+8.2%',
      subtext: 'vs last month',
      isPositive: true,
      iconBg: 'bg-[#defff7]',
      iconColor: 'text-[#1bc1a1]',
      borderColor: 'border-[#1bc1a1]/20',
      shadowColor: 'shadow-[#1bc1a1]/5',
      icon: FileText
    },
    {
      id: 'interviewed',
      stageTarget: 'Interview Scheduled' as ApplicantStage | 'All',
      label: 'Interviewed',
      value: interviewedCount,
      percentage: '28.8%',
      subtext: 'of applicants',
      isPositive: true,
      iconBg: 'bg-[#e0f2fe]',
      iconColor: 'text-[#0284c7]',
      borderColor: 'border-sky-100',
      shadowColor: 'shadow-sky-100/30',
      icon: MessageSquare
    },
    {
      id: 'hired',
      stageTarget: 'Final Interview' as ApplicantStage | 'All', // We can map Hired to Final Interview stage for filtering
      label: 'Hired Candidates',
      value: hiredCount,
      percentage: '8.2%',
      subtext: 'of applicants',
      isPositive: true,
      iconBg: 'bg-emerald-50 text-emerald-600',
      iconColor: 'text-emerald-500',
      borderColor: 'border-emerald-100',
      shadowColor: 'shadow-emerald-100/30',
      icon: Award
    },
    {
      id: 'vacancies',
      stageTarget: 'Test Completed' as ApplicantStage | 'All',
      label: 'Completed Tests',
      value: 3, // From Lala Wijaya + others with test complete
      percentage: '12.5%',
      subtext: 'completion index',
      isPositive: true,
      iconBg: 'bg-[#f5f3ff]',
      iconColor: 'text-[#7c3aed]',
      borderColor: 'border-[#f5f3ff]/80',
      shadowColor: 'shadow-violet-200/20',
      icon: Briefcase
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 select-none">
      {metricsObj.map((metric) => {
        const Icon = metric.icon;
        const isSelected = activeStageFilter === metric.stageTarget;

        return (
          <motion.div
            key={metric.id}
            whileHover={{ y: -3, scale: 1.015 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            onClick={() => onMetricClick(metric.stageTarget)}
            className={`cursor-pointer p-4.5 rounded-2xl bg-white border-2 flex flex-col justify-between transition-all relative overflow-hidden ${
              isSelected
                ? 'border-[#1bc1a1] bg-[#defff7]/15 ring-2 ring-[#1bc1a1]/10 shadow-lg'
                : 'border-[#edf2f7] hover:border-slate-300 shadow-sm'
            } ${metric.shadowColor}`}
          >
            {/* Top row */}
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${metric.iconBg} ${metric.iconColor}`}>
                <Icon className="w-5 h-5" />
              </div>

              {/* Tag with percentage change */}
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                metric.isPositive
                  ? 'bg-emerald-50 text-emerald-600'
                  : 'bg-red-50 text-red-600'
              }`}>
                {metric.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                <span>{metric.percentage}</span>
              </div>
            </div>

            {/* Bottom metrics section */}
            <div>
              <div className="flex items-baseline gap-2 mb-0.5">
                <span className="text-3xl font-extrabold text-slate-800 tracking-tight leading-none">
                  {metric.value}
                </span>
                <span className="text-[11px] font-medium text-slate-400">
                  {metric.subtext}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-500 tracking-tight">
                {metric.label}
              </p>
            </div>

            {/* Small active dot inside card if selected */}
            {isSelected && (
              <span className="absolute bottom-2.5 right-2.5 w-2 h-2 rounded-full bg-[#1bc1a1]" />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
