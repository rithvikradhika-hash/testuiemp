import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Briefcase,
  MapPin,
  Clock,
  Filter,
  Plus,
  ChevronDown,
  Check,
  X,
  PlusCircle,
  Users
} from 'lucide-react';
import { Vacancy } from '../types';

interface VacanciesSectionProps {
  vacancies: Vacancy[];
  selectedVacancyId: string | null;
  onSelectVacancy: (id: string | null) => void;
  onAddVacancy: (vacancy: Omit<Vacancy, 'id' | 'applicantsCount'>) => void;
}

export default function VacanciesSection({
  vacancies,
  selectedVacancyId,
  onSelectVacancy,
  onAddVacancy
}: VacanciesSectionProps) {
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showAddJobModal, setShowAddJobModal] = useState(false);

  // Filter states
  const [locationFilter, setLocationFilter] = useState<'All' | 'Remote' | 'On-Site' | 'Hybrid'>('All');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Full-Time' | 'Part-Time' | 'Internship'>('All');

  // Form states
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'Full-Time' | 'Part-Time' | 'Internship'>('Full-Time');
  const [newLocation, setNewLocation] = useState<'Remote' | 'On-Site' | 'Hybrid'>('Remote');

  const filteredVacancies = vacancies.filter((vac) => {
    const matchesLoc = locationFilter === 'All' || vac.location === locationFilter;
    const matchesType = typeFilter === 'All' || vac.type === typeFilter;
    return matchesLoc && matchesType;
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddVacancy({
      title: newTitle.trim(),
      type: newType,
      location: newLocation
    });

    // Reset states
    setNewTitle('');
    setNewType('Full-Time');
    setNewLocation('Remote');
    setShowAddJobModal(false);
  };

  return (
    <div className="relative">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 select-none">
        <div>
          <h2 className="text-base font-bold font-sans text-slate-800 tracking-tight flex items-center gap-1.5 leading-none">
            Current Vacancies
            {selectedVacancyId && (
              <button
                onClick={() => onSelectVacancy(null)}
                className="text-[10px] font-bold text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-md flex items-center gap-1 font-mono transition-colors"
              >
                <span>Clear filter</span>
                <X className="w-2.5 h-2.5" />
              </button>
            )}
          </h2>
          <p className="text-[11px] text-slate-400 mt-1">Select a card to find applicants matched for a role</p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Vacancy Filter Toggle Button */}
          <div className="relative">
            <button
              onClick={() => {
                setShowFilterDropdown(!showFilterDropdown);
                setShowAddJobModal(false);
              }}
              className={`px-3.5 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-semibold cursor-pointer transition-all ${
                locationFilter !== 'All' || typeFilter !== 'All'
                  ? 'border-[#1bc1a1] bg-[#defff7]/30 text-[#0f766e]'
                  : 'border-[#e5e9f2] bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filter Job</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {/* Job Filters Dropdown */}
            {showFilterDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-100 rounded-2xl shadow-xl z-30 p-4 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between border-b border-slate-50 pb-2 mb-3">
                  <span className="font-bold text-slate-800 text-xs">Filter Positions</span>
                  {(locationFilter !== 'All' || typeFilter !== 'All') && (
                    <button
                      onClick={() => {
                        setLocationFilter('All');
                        setTypeFilter('All');
                      }}
                      className="text-[10px] text-[#1bc1a1] font-bold hover:underline"
                    >
                      Reset All
                    </button>
                  )}
                </div>

                <div className="space-y-3.5">
                  {/* Location Filter */}
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                      Location Venue
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {(['All', 'Remote', 'On-Site', 'Hybrid'] as const).map((loc) => (
                        <button
                          key={loc}
                          onClick={() => setLocationFilter(loc)}
                          className={`text-[10px] px-2.5 py-1 rounded-lg border font-semibold cursor-pointer transition-colors ${
                            locationFilter === loc
                              ? 'bg-[#1bc1a1] text-white border-transparent'
                              : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
                          }`}
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Employment Type Filter */}
                  <div>
                    <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                      Employment Schedule
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {(['All', 'Full-Time', 'Part-Time', 'Internship'] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => setTypeFilter(t)}
                          className={`text-[10px] px-2.5 py-1 rounded-lg border font-semibold cursor-pointer transition-colors ${
                            typeFilter === t
                              ? 'bg-[#1bc1a1] text-white border-transparent'
                              : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Create Job Opening Button */}
          <button
            onClick={() => {
              setShowAddJobModal(!showAddJobModal);
              setShowFilterDropdown(false);
            }}
            className="p-1.5 sm:px-3 sm:py-1.5 bg-[#defff7] text-[#1bc1a1] border border-[#1bc1a1]/20 hover:bg-[#1bc1a1] hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Job</span>
          </button>
        </div>
      </div>

      {/* Grid List of Positions */}
      <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 mb-3">
        {filteredVacancies.map((vacancy) => {
          const isSelected = selectedVacancyId === vacancy.id;
          return (
            <motion.div
              key={vacancy.id}
              whileHover={{ y: -2, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              onClick={() => onSelectVacancy(isSelected ? null : vacancy.id)}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                isSelected
                  ? 'border-[#1bc1a1] bg-[#defff7]/15 shadow-sm shadow-[#1bc1a1]/10'
                  : 'border-slate-100 bg-white hover:border-slate-300 shadow-xs'
              }`}
            >
              {/* Vacancy Title */}
              <div className="flex items-start justify-between mb-3.5">
                <h3 className="font-bold text-slate-800 text-xs sm:text-sm tracking-tight capitalize max-w-[85%] truncate">
                  {vacancy.title}
                </h3>
                <div className={`w-2.5 h-2.5 rounded-full ${isSelected ? 'bg-[#1bc1a1]' : 'bg-slate-200'}`} />
              </div>

              {/* Tag Badges */}
              <div className="flex items-center gap-2 mb-4">
                {/* Job type tag */}
                <div className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-100 bg-slate-50 text-slate-500">
                  <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{vacancy.type}</span>
                </div>

                {/* Location type tag */}
                <div className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-100 bg-slate-50 text-slate-500">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  <span>{vacancy.location}</span>
                </div>
              </div>

              {/* Candidates Count info row */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold border-t border-slate-50/50 pt-2.5">
                <span className="flex items-center gap-1 text-slate-400">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Candidates</span>
                </span>
                <span className="text-slate-800 font-extrabold">{vacancy.applicantsCount}</span>
              </div>
            </motion.div>
          );
        })}

        {filteredVacancies.length === 0 && (
          <div className="col-span-full py-8 text-center bg-white border border-dashed border-slate-200 rounded-3xl text-sm font-semibold text-slate-500">
            No vacancies exist matching current filter criteria.
          </div>
        )}
      </div>

      {/* Create New Job Opening Dialogue Dropdown Panel */}
      <AnimatePresence>
        {showAddJobModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute left-0 right-0 top-12 z-30 p-5 bg-white border border-slate-100 rounded-2xl shadow-xl w-full"
          >
            <div className="flex items-center justify-between mb-3 border-b border-slate-50 pb-2">
              <span className="font-bold text-slate-800 text-xs flex items-center gap-1.5 uppercase tracking-wider">
                <PlusCircle className="w-4 h-4 text-[#1bc1a1]" /> Add Vacancy
              </span>
              <button
                onClick={() => setShowAddJobModal(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                  Vacancy Title / Role
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lead Developer"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-[#1bc1a1]/50 bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                  Schedule Type
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-[#1bc1a1]/50 bg-white"
                >
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                  Office Location
                </label>
                <select
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value as any)}
                  className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-[#1bc1a1]/50 bg-white"
                >
                  <option value="Remote">Remote</option>
                  <option value="On-Site">On-Site</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div className="md:col-span-3 flex justify-end gap-2 pt-1 border-t border-slate-50">
                <button
                  type="button"
                  onClick={() => setShowAddJobModal(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-500 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-[#1bc1a1] hover:bg-[#159d83] text-white text-xs font-semibold shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Submit Position</span>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
