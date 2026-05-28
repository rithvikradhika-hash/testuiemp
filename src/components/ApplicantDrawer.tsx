import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Phone,
  Link,
  Calendar,
  MapPin,
  Clock,
  Sparkles,
  MessageSquare,
  Plus,
  Send,
  Trash2,
  CheckCircle2,
  XCircle,
  FileText,
  Star
} from 'lucide-react';
import { Applicant, ApplicantStage } from '../types';

interface ApplicantDrawerProps {
  applicant: Applicant | null;
  onClose: () => void;
  onUpdateStage: (id: string, stage: ApplicantStage) => void;
  onAddNote: (id: string, noteText: string) => void;
  onDeleteApplicant: (id: string) => void;
  currentUser: { name: string };
}

export default function ApplicantDrawer({
  applicant,
  onClose,
  onUpdateStage,
  onAddNote,
  onDeleteApplicant,
  currentUser
}: ApplicantDrawerProps) {
  const [newNote, setNewNote] = useState('');
  const [isHired, setIsHired] = useState(false);
  const [isRejected, setIsRejected] = useState(false);

  if (!applicant) return null;

  const handleStageChange = (newStage: ApplicantStage) => {
    onUpdateStage(applicant.id, newStage);
  };

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onAddNote(applicant.id, newNote.trim());
    setNewNote('');
  };

  const handleHireClick = () => {
    setIsHired(true);
    setIsRejected(false);
    onUpdateStage(applicant.id, 'Test Completed'); // Maximum stage progression
    setTimeout(() => {
      setIsHired(false);
      onClose();
    }, 1500);
  };

  const handleRejectClick = () => {
    setIsRejected(true);
    setIsHired(false);
    setTimeout(() => {
      setIsRejected(false);
      onDeleteApplicant(applicant.id);
      onClose();
    }, 1500);
  };

  const stagesList: ApplicantStage[] = [
    'Application Received',
    'Interview Scheduled',
    'Final Interview',
    'Test Completed'
  ];

  return (
    <div className="fixed inset-y-0 right-0 z-50 flex select-none max-w-full">
      {/* Backdrop shade */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/30 backdrop-blur-xs"
      />

      {/* Slide drawer container */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 20, stiffness: 220 }}
        className="relative w-screen max-w-md bg-white shadow-2xl h-full flex flex-col z-10 border-l border-slate-100"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase tracking-wider">
            <FileText className="w-4 h-4 text-[#1bc1a1]" />
            <span>Applicant Profile Sheet</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Details Area - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main ID Block */}
          <div className="flex items-start gap-4">
            <img
              src={applicant.avatar}
              alt={applicant.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-[#1bc1a1]/20 shadow-sm ring-4 ring-[#1bc1a1]/5"
              referrerPolicy="no-referrer"
            />
            <div className="space-y-1 my-auto">
              <h3 className="font-extrabold text-slate-800 text-base tracking-tight leading-tight">
                {applicant.name}
              </h3>
              <p className="text-xs text-slate-400 font-medium">{applicant.email}</p>
              <div className="flex items-center gap-0.5 pt-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${
                      star <= applicant.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Quick contact / coordinates layout */}
          <div className="grid grid-cols-2 gap-3 p-4.5 bg-slate-50/70 border border-slate-100 rounded-2xl text-xs">
            {applicant.phone && (
              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-mono font-semibold truncate leading-tight">{applicant.phone}</span>
              </div>
            )}
            {applicant.portfolioUrl && (
              <div className="flex items-center gap-2 text-slate-600">
                <Link className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <a
                  href={applicant.portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-[#1bc1a1] hover:underline truncate leading-tight"
                >
                  Portfolio Website
                </a>
              </div>
            )}
            <div className="flex items-center gap-2 text-slate-600 col-span-2 mt-1.5 border-t border-slate-150/40 pt-2 pb-0.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>
                Applying for <strong className="font-bold text-slate-700">{applicant.jobTitle}</strong>
              </span>
            </div>
          </div>

          {/* Pipeline stages switcher */}
          <div className="space-y-2">
            <label className="block text-[11px] text-slate-400 font-bold uppercase tracking-wider">
              Recruitment Stage Pipeline
            </label>
            <div className="grid grid-cols-2 gap-2 text-center">
              {stagesList.map((st) => {
                const isCurrent = applicant.stage === st;
                return (
                  <button
                    key={st}
                    onClick={() => handleStageChange(st)}
                    className={`px-3 py-2 text-[10px] font-bold rounded-xl border cursor-pointer transition-all ${
                      isCurrent
                        ? 'bg-[#1bc1a1] text-white border-transparent shadow-sm'
                        : 'border-slate-150 text-slate-500 bg-white hover:bg-slate-50'
                    }`}
                  >
                    {st}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cover Letter */}
          {applicant.coverLetter && (
            <div className="space-y-2">
              <label className="block text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                Personal Pitch / Cover Summary
              </label>
              <div className="p-3.5 bg-[#defff7]/15 rounded-2xl border border-[#1bc1a1]/10 text-[11.5px] text-slate-600 leading-relaxed max-h-36 overflow-y-auto italic">
                "{applicant.coverLetter}"
              </div>
            </div>
          )}

          {/* Inside Team Comments section */}
          <div className="space-y-3.5 pt-2 border-t border-slate-100">
            <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 uppercase tracking-wider">
              <MessageSquare className="w-4 h-4 text-[#1bc1a1]" />
              <span>Feedback & Notes Feed ({applicant.notes.length})</span>
            </h4>

            {/* Note form submission */}
            <form onSubmit={handleNoteSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Type team commentary..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="flex-1 text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-hidden focus:ring-1 focus:ring-[#1bc1a1]/50 focus:border-[#1bc1a1] transition-all bg-white"
              />
              <button
                type="submit"
                className="bg-[#defff7] border border-[#1bc1a1]/25 hover:bg-[#1bc1a1] hover:text-white text-[#1bc1a1] px-3 rounded-xl transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>

            {/* Feedback items list */}
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {applicant.notes.map((note) => (
                <div key={note.id} className="p-3 bg-[#f8fafc] border border-slate-100 rounded-2xl text-[11px]">
                  <div className="flex items-center justify-between font-bold text-slate-700 mb-1">
                    <span>{note.author}</span>
                    <span className="text-[9px] font-medium text-slate-400">{note.date}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed font-medium">{note.text}</p>
                </div>
              ))}
              {applicant.notes.length === 0 && (
                <p className="text-[10px] text-slate-400 text-center py-4 italic font-medium">
                  No internal pipeline feedback notes added yet.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action Panel Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-3 shrink-0">
          <button
            onClick={handleRejectClick}
            disabled={isRejected || isHired}
            className="w-full py-2.5 border border-red-200 hover:bg-red-50 text-red-650 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <XCircle className="w-4 h-4 text-red-500" />
            <span>Pass Candidate</span>
          </button>
          <button
            onClick={handleHireClick}
            disabled={isRejected || isHired}
            className="w-full py-2.5 bg-[#1bc1a1] hover:bg-[#159d83] text-white rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 shadow-sm hover:shadow shadow-[#1bc1a1]/20"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Hire Candidate</span>
          </button>
        </div>

        {/* Dynamic hired success overlay feedback */}
        {isHired && (
          <div className="absolute inset-0 bg-[#defff7] z-30 flex flex-col items-center justify-center text-center p-6 space-y-3">
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: [1, 1.25, 1], opacity: 1 }}
              className="w-14 h-14 bg-white text-[#1bc1a1] rounded-full flex items-center justify-center shadow-lg"
            >
              <CheckCircle2 className="w-10 h-10 fill-current text-[#defff7] bg-[#1bc1a1] rounded-full" />
            </motion.div>
            <p className="font-extrabold text-[#0f766e] text-lg">Candidate Approved!</p>
            <p className="text-xs text-[#0f766e]/80 max-w-xs font-medium">
              Congratulations! {applicant.name} has been moved to the onboarding stage. Let's send them the welcome document.
            </p>
          </div>
        )}

        {/* Dynamic reject overlay feedback */}
        {isRejected && (
          <div className="absolute inset-0 bg-red-50 z-30 flex flex-col items-center justify-center text-center p-6 space-y-3 animate-fade-in">
            <div className="w-14 h-14 bg-white text-red-600 rounded-full flex items-center justify-center shadow-lg">
              <Trash2 className="w-8 h-8" />
            </div>
            <p className="font-extrabold text-red-800 text-lg">Applicant Removed</p>
            <p className="text-xs text-red-700/80 max-w-xs font-medium">
              Candidate package file archived. Dynamic filters updated immediately.
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
}
