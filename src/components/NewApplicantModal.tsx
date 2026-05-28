import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, UserPlus, Check, Star } from 'lucide-react';
import { Applicant, ApplicantStage } from '../types';

interface NewApplicantModalProps {
  isOpen: boolean;
  onClose: () => void;
  vacancies: Array<{ title: string }>;
  onAddApplicant: (candidate: Omit<Applicant, 'id' | 'stageProgress' | 'notes' | 'avatar'>) => void;
}

export default function NewApplicantModal({
  isOpen,
  onClose,
  vacancies,
  onAddApplicant
}: NewApplicantModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [jobTitle, setJobTitle] = useState(vacancies[0]?.title || 'UI Designer');
  const [location, setLocation] = useState<'Remote' | 'On-Site' | 'Hybrid'>('Remote');
  const [type, setType] = useState<'Full-Time' | 'Part-Time' | 'Internship'>('Full-Time');
  const [coverLetter, setCoverLetter] = useState('');
  const [rating, setRating] = useState<number>(4);
  const [phone, setPhone] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    onAddApplicant({
      name: name.trim(),
      email: email.trim(),
      jobTitle,
      location,
      type,
      appliedDate: new Date().toISOString().split('T')[0],
      stage: 'Application Received',
      rating,
      phone: phone.trim() || undefined,
      portfolioUrl: jobTitle.includes('Designer') ? 'https://behance.net/newapplicant' : 'https://linkedin.com/in/newapplicant',
      coverLetter: coverLetter.trim() || undefined
    });

    // Reset Form fields
    setName('');
    setEmail('');
    setCoverLetter('');
    setPhone('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden relative"
      >
        {/* Modal Close button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal content body */}
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#defff7] text-[#1bc1a1] flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-[#0f172a] text-lg">Register Candidate Profile</h3>
              <p className="text-xs text-slate-400">Add an offline candidate directly into the recruitment pipeline</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                  Candidate Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. William Hartono"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-[#1bc1a1]/50 bg-white"
                  required
                />
              </div>

              {/* Email Address */}
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="e.g. william@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-[#1bc1a1]/50 bg-white"
                  required
                />
              </div>

              {/* Position and Phone */}
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                  Position Applied
                </label>
                <select
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-[#1bc1a1]/50 bg-white"
                >
                  {vacancies.map((v) => (
                    <option key={v.title} value={v.title}>
                      {v.title}
                    </option>
                  ))}
                  <option value="Lead Developer">Lead UI Developer</option>
                  <option value="Customer Support">Customer Support</option>
                </select>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                  Contact Phone Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. +62 812-3456-7890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-[#1bc1a1]/50 bg-white"
                />
              </div>

              {/* Contract Style and location venue */}
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                  Employment Contract
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-[#1bc1a1]/50 bg-white"
                >
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                  Work Location Venue
                </label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value as any)}
                  className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-[#1bc1a1]/50 bg-white"
                >
                  <option value="Remote">Remote</option>
                  <option value="On-Site">On-Site</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              {/* Self Rating */}
              <div className="col-span-2">
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                  Screening Rating / Qualification
                </label>
                <div className="flex items-center gap-2 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="text-slate-300 hover:text-amber-400 transition-colors"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-[10px] font-mono text-slate-400 font-bold ml-2">({rating} / 5 stars)</span>
                </div>
              </div>

              {/* Cover Letter */}
              <div className="col-span-2">
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                  Self Cover Pitch (Optional)
                </label>
                <textarea
                  placeholder="Tell us about the candidate's motivation or highlight skillset brief summary..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:border-[#1bc1a1]/50 bg-white h-24 max-h-32"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-3 border-t border-slate-50">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#1bc1a1] hover:bg-[#159d83] text-white text-xs font-semibold transition-transform active:scale-98 flex items-center gap-1.5 shadow-md hover:shadow-lg shadow-[#1bc1a1]/20 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Register Candidate</span>
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
