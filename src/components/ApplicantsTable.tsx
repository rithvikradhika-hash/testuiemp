import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  MoreVertical,
  ChevronRight,
  ArrowUpDown,
  Search,
  Filter,
  SlidersHorizontal,
  Plus,
  UserCheck,
  UserX,
  Star
} from 'lucide-react';
import { Applicant, ApplicantStage } from '../types';

interface ApplicantsTableProps {
  applicants: Applicant[];
  searchQuery: string;
  selectedVacancyId: string | null;
  vacancies: Array<{ id: string; title: string }>;
  onSelectApplicant: (applicant: Applicant) => void;
  onOpenAddApplicant: () => void;
}

export default function ApplicantsTable({
  applicants,
  searchQuery,
  selectedVacancyId,
  vacancies,
  onSelectApplicant,
  onOpenAddApplicant
}: ApplicantsTableProps) {
  const [activeTab, setActiveTab] = useState<ApplicantStage | 'All'>('All');
  const [sortField, setSortField] = useState<'name' | 'jobTitle' | 'appliedDate'>('appliedDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Filter tabs list matches mockup exactly
  const tabs: Array<ApplicantStage | 'All'> = [
    'All',
    'Application Received',
    'Interview Scheduled',
    'Final Interview',
    'Test Completed',
  ];

  // Map vacancy ID to its title string
  const selectedVacancyTitle = useMemo(() => {
    if (!selectedVacancyId) return null;
    return vacancies.find((v) => v.id === selectedVacancyId)?.title || null;
  }, [selectedVacancyId, vacancies]);

  // Combined Filters Logic
  const processedApplicants = useMemo(() => {
    return applicants
      .filter((candidate) => {
        // 1. Stage Tab Filter
        const matchesTab = activeTab === 'All' || candidate.stage === activeTab;

        // 2. Vacancy Card Selection Filter
        const matchesVacancy = !selectedVacancyTitle || candidate.jobTitle === selectedVacancyTitle;

        // 3. Search query matches
        const matchesQuery =
          !searchQuery.trim() ||
          candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          candidate.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          candidate.email.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesTab && matchesVacancy && matchesQuery;
      })
      .sort((a, b) => {
        // 4. Sort logic
        let compareA = a[sortField] || '';
        let compareB = b[sortField] || '';

        if (sortField === 'name') {
          compareA = a.name.toLowerCase();
          compareB = b.name.toLowerCase();
        } else if (sortField === 'jobTitle') {
          compareA = a.jobTitle.toLowerCase();
          compareB = b.jobTitle.toLowerCase();
        }

        if (compareA < compareB) return sortDirection === 'asc' ? -1 : 1;
        if (compareA > compareB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [applicants, activeTab, selectedVacancyTitle, searchQuery, sortField, sortDirection]);

  const handleSort = (field: 'name' | 'jobTitle' | 'appliedDate') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Status Colors Mapper
  const getStageStyle = (stage: ApplicantStage) => {
    switch (stage) {
      case 'Application Received':
        return 'text-slate-600 bg-slate-100 border-slate-205';
      case 'Interview Scheduled':
        return 'text-cyan-600 bg-cyan-50 border-cyan-100';
      case 'Final Interview':
        return 'text-[#1bc1a1] bg-[#defff7] border-[#1bc1a1]/20';
      case 'Test Completed':
        return 'text-violet-600 bg-violet-50 border-violet-100';
      default:
        return 'text-slate-500 bg-slate-50 border-slate-100';
    }
  };

  // Get color for Location Type
  const getLocationStyle = (location: 'Remote' | 'On-Site' | 'Hybrid') => {
    switch (location) {
      case 'Remote':
        return 'text-emerald-700 bg-emerald-50 border-emerald-100';
      case 'On-Site':
        return 'text-indigo-700 bg-indigo-50 border-indigo-100';
      case 'Hybrid':
        return 'text-amber-700 bg-amber-50 border-amber-100';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 select-none">
      {/* Table Title Bar & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
        {/* Tab Selection Row */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${
                activeTab === tab
                  ? 'bg-[#1bc1a1] text-white shadow-sm shadow-[#1bc1a1]/10'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              {tab === 'All' ? 'All Applicants' : tab}
            </button>
          ))}
        </div>

        {/* Action button trigger for adding dynamic candidate */}
        <button
          onClick={onOpenAddApplicant}
          className="self-end md:self-auto px-4 py-1.5 bg-[#1bc1a1] hover:bg-[#159d83] text-white text-xs font-bold rounded-xl transition-all shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Candidate</span>
        </button>
      </div>

      {/* Grid Filtering breadcrumb if vacancy card filters table */}
      {selectedVacancyTitle && (
        <div className="mb-3.5 p-2 bg-[#defff7]/30 border border-[#1bc1a1]/20 rounded-xl flex items-center justify-between text-xs text-[#0f766e]">
          <span>
            Filtering applicants matching <strong>{selectedVacancyTitle}</strong>
          </span>
          <button
            onClick={() => handleSort('appliedDate')}
            className="text-[10px] uppercase font-bold tracking-wider hover:underline"
          >
            Reset vacancy card filter
          </button>
        </div>
      )}

      {/* Responsive Table Wrapper */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50/50">
              {/* Header: Name Column */}
              <th className="py-3 px-4 font-bold">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center gap-1 hover:text-slate-700 cursor-pointer text-[10.5px]"
                >
                  <span>Candidate</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-350" />
                </button>
              </th>

              {/* Header: Job Title Column */}
              <th className="py-3 px-3 font-bold">
                <button
                  onClick={() => handleSort('jobTitle')}
                  className="flex items-center gap-1 hover:text-slate-700 cursor-pointer text-[10.5px]"
                >
                  <span>Position</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-350" />
                </button>
              </th>

              {/* Header: Date Column */}
              <th className="py-3 px-3 font-bold">
                <button
                  onClick={() => handleSort('appliedDate')}
                  className="flex items-center gap-1 hover:text-slate-700 cursor-pointer text-[10.5px]"
                >
                  <span>Applied</span>
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-350" />
                </button>
              </th>

              {/* Header: Contract/Venue Tags */}
              <th className="py-3 px-3 font-bold text-[10.5px]">Contract Venue</th>

              {/* Header: Segment Stepper Progress Index */}
              <th className="py-3 px-3 font-bold text-[10.5px]">Recruitment Stage</th>

              {/* Action */}
              <th className="py-3 px-4 w-12 text-center" />
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100/50">
            {processedApplicants.map((candidate) => (
              <tr
                key={candidate.id}
                onClick={() => onSelectApplicant(candidate)}
                className="group border-b border-slate-50 hover:bg-[#defff7]/10 transition-all cursor-pointer text-xs"
              >
                {/* 1. Candidate Info */}
                <td className="py-3.5 px-4 flex items-center gap-3">
                  <img
                    src={candidate.avatar}
                    alt={candidate.name}
                    className="w-10 h-10 rounded-xl border border-slate-100 shadow-xs object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="font-bold text-slate-800 text-[13px] group-hover:text-[#1bc1a1] transition-colors leading-tight mb-1">
                      {candidate.name}
                    </h4>
                    <span className="text-[10px] font-medium text-slate-400 block truncate max-w-[150px]">
                      {candidate.email}
                    </span>
                  </div>
                </td>

                {/* 2. Position Title */}
                <td className="py-3.5 px-3">
                  <strong className="font-bold text-slate-700 block text-[12.5px] leading-tight mb-0.5">
                    {candidate.jobTitle}
                  </strong>
                  <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-widest">
                    {candidate.jobTitle === 'UI Designer' || candidate.jobTitle === 'Lead Designer' ? 'Product Design' : 'Operations'}
                  </span>
                </td>

                {/* 3. Applied Date */}
                <td className="py-3.5 px-3 font-mono font-semibold text-slate-500 whitespace-nowrap">
                  {new Date(candidate.appliedDate).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </td>

                {/* 4. Contract tags */}
                <td className="py-3.5 px-3 whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9.5px] font-extrabold px-2 py-0.5 rounded-md border border-slate-100 bg-[#f8fafc] text-slate-500">
                      {candidate.type}
                    </span>
                    <span className={`text-[9.5px] font-extrabold px-2 py-0.5 rounded-md border ${getLocationStyle(candidate.location)}`}>
                      {candidate.location}
                    </span>
                  </div>
                </td>

                {/* 5. Visual Stepper Progress Bar */}
                <td className="py-3.5 px-3">
                  <div className="flex flex-col gap-1.5">
                    {/* Stage Title */}
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border text-center w-max ${getStageStyle(candidate.stage)}`}>
                      {candidate.stage}
                    </span>

                    {/* mockup's segmented stepper (blocks 1 to 5) */}
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((step) => {
                        let stepActive = false;
                        if (candidate.stage === 'Application Received' && step === 1) stepActive = true;
                        if (candidate.stage === 'Interview Scheduled' && step <= 3) stepActive = true;
                        if (candidate.stage === 'Final Interview' && step <= 4) stepActive = true;
                        if (candidate.stage === 'Test Completed' && step <= 5) stepActive = true;

                        return (
                          <div
                            key={step}
                            className={`h-1.5 flex-1 rounded-sm min-w-4 transition-all duration-300 ${
                              stepActive ? 'bg-[#1bc1a1]' : 'bg-slate-100'
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>
                </td>

                {/* 6. Arrow indicator */}
                <td className="py-3.5 px-4 text-center">
                  <div className="flex items-center justify-center p-1 rounded-lg text-slate-350 hover:text-[#1bc1a1] hover:bg-[#defff7]/30 transition-all">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </td>
              </tr>
            ))}

            {processedApplicants.length === 0 && (
              <tr>
                <td colSpan={6} className="py-12 text-center text-sm font-semibold text-slate-400">
                  <div className="max-w-xs mx-auto space-y-2">
                    <SlidersHorizontal className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="text-slate-550 font-bold">No candidate results found</p>
                    <p className="text-xs text-slate-400 font-medium">Try broadening your active search terms or toggling a different stage tab pipeline.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
