import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  Award, 
  MapPin, 
  Plus, 
  Sparkles, 
  Star, 
  User, 
  CheckCircle,
  Sliders,
  Check
} from 'lucide-react';

interface Review {
  id: string;
  employeeName: string;
  reviewer: string;
  role: string;
  stars: number;
  date: string;
  comment: string;
  category: 'Tech' | 'Productivity' | 'Collab' | 'Leadership';
}

export default function PerformanceSection() {
  // Department focus index for our custom morphable SVG radar chart
  const [focalTeam, setFocalTeam] = useState<'Engineering' | 'Design' | 'Sales'>('Engineering');
  
  // Local Reviews Database synced in state
  const [reviews, setReviews] = useState<Review[]>([
    { id: 'rev-1', employeeName: 'Sophia Alexandra', reviewer: 'Davis Levin', role: 'Lead UX Architect', stars: 5, date: 'May 14, 2026', comment: 'Consistently provides stunning visual prototypes and guides junior designers. True design pioneer.', category: 'Tech' },
    { id: 'rev-2', employeeName: 'Marcus Sterling', reviewer: 'Sarah Connor', role: 'Enterprise Sales Manager', stars: 5, date: 'May 20, 2026', comment: 'Exceeded enterprise quotas by 40% during Q1 sales cycle. Exceptional client interaction.', category: 'Leadership' },
    { id: 'rev-3', employeeName: 'Rian Wijaya', reviewer: 'Davis Levin', role: 'Frontend Engineer', stars: 4, date: 'May 26, 2026', comment: 'Refactored core CSS modules reducing page latency ratios by 25%. Extremely strong execution.', category: 'Tech' }
  ]);

  // Peer feedback submission states
  const [evalName, setEvalName] = useState('Emma Watson');
  const [evalReviewerName, setEvalReviewerName] = useState('Davis Levin');
  const [evalComment, setEvalComment] = useState('');
  const [evalCategory, setEvalCategory] = useState<'Tech' | 'Productivity' | 'Collab' | 'Leadership'>('Collab');
  const [evalStars, setEvalStars] = useState<number>(5);

  const [sliderA, setSliderA] = useState<number>(85); // Tech Skill
  const [sliderB, setSliderB] = useState<number>(90); // Cooperation

  const [notification, setNotification] = useState<string | null>(null);

  // SVG Coordinates mapping depending on selected team focus (morphing effect)
  // Axis values order: 0: Technical, 1: Collaboration, 2: Productivity, 3: Communication, 4: Leadership
  const teamRadarPoints: Record<'Engineering' | 'Design' | 'Sales', string> = {
    Engineering: "120,60 160,110 145,160 85,150 70,110", // Strong tech, modest communication
    Design: "95,85 170,95 150,155 75,155 85,95",    // Extreme Creativity/productivity, modest leadership
    Sales: "70,115 155,80 170,140 100,165 65,115"     // Extreme leadership, high communication, modest technical
  };

  const handlePostPeerFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evalComment) return;

    const newAppraisal: Review = {
      id: `rev-dyn-${Date.now()}`,
      employeeName: evalName,
      reviewer: evalReviewerName,
      role: 'Staff Personnel',
      stars: evalStars,
      date: 'Just now',
      comment: evalComment,
      category: evalCategory
    };

    setReviews([newAppraisal, ...reviews]);
    setEvalComment('');
    setNotification(`Review published for ${evalName}! Continuous sync established.`);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const teamLeaderboard = [
    { name: 'Sophia Alexandra', score: '98', role: 'Product Design Lead', badge: 'Elite', color: 'bg-emerald-50 text-emerald-700' },
    { name: 'Marcus Sterling', score: '95', role: 'Sales & Expansion Lead', badge: 'Overachiever', color: 'bg-[#1bc1a1]/10 text-teal-800' },
    { name: 'Liam Neeson', score: '92', role: 'Senior Architect', badge: 'High-Value', color: 'bg-indigo-50 text-indigo-700' },
    { name: 'Emma Watson', score: '88', role: 'HR Operations Senior', badge: 'Consistent', color: 'bg-amber-50 text-amber-700' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 select-none">
      
      {/* Morphable SVG Competency Radar & Top Leaders List (Left 2/3) */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Custom Radar Graphic Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          <div className="md:col-span-5 space-y-4">
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm sm:text-base tracking-tight mb-1">Competency Mapping Index</h3>
              <p className="text-[11px] text-slate-400 font-bold">Dynamic radar overview detailing departmental proficiency indexes.</p>
            </div>

            {/* Team Toggles for morphing effect */}
            <div className="flex flex-col gap-2">
              {(['Engineering', 'Design', 'Sales'] as const).map((team) => (
                <button
                  key={team}
                  onClick={() => setFocalTeam(team)}
                  className={`px-4 py-2.5 rounded-xl text-left text-xs font-bold border transition-all cursor-pointer ${
                    focalTeam === team
                      ? 'bg-gradient-to-r from-[#1bc1a1] to-teal-555 text-white border-transparent shadow-xs'
                      : 'bg-slate-50 text-slate-650 border-slate-150 hover:bg-slate-100/70'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{team} Squad Profile</span>
                    {focalTeam === team && <Check className="w-4 h-4 shrink-0" />}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Actual SVG Polygon morphing representation */}
          <div className="md:col-span-7 flex justify-center items-center relative">
            <svg viewBox="0 0 240 240" className="w-[180px] h-[180px] sm:w-[210px] sm:h-[210px]">
              {/* Outer boundary lines */}
              <polygon points="120,30 200,90 170,180 70,180 40,90" fill="none" stroke="#edf2f7" strokeWidth="2" />
              <polygon points="120,50 180,100 160,160 80,160 60,100" fill="none" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3" />
              <polygon points="120,80 150,110 140,140 100,140 90,110" fill="none" stroke="#cbd5e1" strokeWidth="1" />

              {/* Central axes */}
              <line x1="120" y1="120" x2="120" y2="30" stroke="#cbd5e1" strokeWidth="1.5" />
              <line x1="120" y1="120" x2="200" y2="90" stroke="#cbd5e1" strokeWidth="1.5" />
              <line x1="120" y1="120" x2="170" y2="180" stroke="#cbd5e1" strokeWidth="1.5" />
              <line x1="120" y1="120" x2="70" y2="180" stroke="#cbd5e1" strokeWidth="1.5" />
              <line x1="120" y1="120" x2="40" y2="90" stroke="#cbd5e1" strokeWidth="1.5" />

              {/* Axis Labels */}
              <text x="120" y="24" textAnchor="middle" className="text-[9px] font-black fill-slate-400 uppercase font-mono">Tech</text>
              <text x="210" y="93" textAnchor="start" className="text-[9px] font-black fill-slate-400 uppercase font-mono">Collab</text>
              <text x="180" y="194" textAnchor="middle" className="text-[9px] font-black fill-slate-400 uppercase font-mono">Productive</text>
              <text x="60" y="194" textAnchor="middle" className="text-[9px] font-black fill-slate-400 uppercase font-mono">Comm</text>
              <text x="30" y="93" textAnchor="end" className="text-[9px] font-black fill-slate-400 uppercase font-mono">Lead</text>

              {/* Competency Fill Layer (Morphed State Points) */}
              <polygon
                points={teamRadarPoints[focalTeam]}
                fill="url(#tealGrad)"
                stroke="#1bc1a1"
                strokeWidth="2.5"
                className="transition-all duration-500 ease-in-out"
              />

              {/* Definitions mapping */}
              <defs>
                <linearGradient id="tealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#defff7" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#1bc1a1" stopOpacity="0.4" />
                </linearGradient>
              </defs>
            </svg>

            {/* Float visual card detail */}
            <span className="absolute bottom-1 right-2 bg-slate-50 border border-slate-150 rounded-lg px-2 py-1 text-[9px] font-black text-slate-500 font-mono">
              COMPETENCY SHIFT ENGINES ENABLED
            </span>
          </div>

        </div>

        {/* Top Stars leaderboard directory */}
        <div className="bg-white p-5 rounded-2xl border border-slate-105 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-55 mb-4">
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm tracking-tight">Appraisal Board & Leaderboard</h3>
              <p className="text-[10px] text-slate-400 font-bold">Top performance metrics across teams</p>
            </div>
            <span className="text-[11px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
              Q2 evaluation cycle active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {teamLeaderboard.map((lead, idx) => (
              <div 
                key={lead.name}
                className="p-3.5 bg-slate-50 rounded-xl border border-slate-150 flex items-center justify-between gap-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-md bg-gradient-to-br from-amber-400 to-yellow-500 font-extrabold text-white text-xs flex items-center justify-center font-mono">
                    #{idx + 1}
                  </span>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-750">{lead.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold leading-relaxed">{lead.role}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-black font-mono text-slate-800">{lead.score}%</span>
                  <span className={`block text-[9px] font-bold px-1.5 py-0.5 rounded border mt-1 shrink-0 ${lead.color}`}>
                    {lead.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Interactive Peer Review Submittal Desk (Right 1/3) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-5 flex flex-col justify-between h-full min-h-[480px]">
        <div>
          <div className="mb-4">
            <h3 className="font-extrabold text-[#1bc1a1] text-sm tracking-tight mb-0.5">Submit Peer Appraisal</h3>
            <p className="text-[10px] text-slate-400 font-bold">Log continuous evaluation records for review cycles</p>
          </div>

          <AnimatePresence>
            {notification && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl flex items-center gap-2 border border-emerald-100 font-bold"
              >
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{notification}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handlePostPeerFeedback} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Target Personnel</label>
              <select
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-205 text-slate-655 rounded-lg font-bold"
                value={evalName}
                onChange={(e) => setEvalName(e.target.value)}
              >
                <option value="Sophia Alexandra">Sophia Alexandra (Product Design)</option>
                <option value="Emma Watson">Emma Watson (Human Resources)</option>
                <option value="Marcus Sterling">Marcus Sterling (Operations)</option>
                <option value="Rian Wijaya">Rian Wijaya (R&D)</option>
                <option value="Clara Mentari">Clara Mentari (Customer Service)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Appraised Category</label>
                <select
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-205 text-slate-655 rounded-lg font-bold"
                  value={evalCategory}
                  onChange={(e) => setEvalCategory(e.target.value as any)}
                >
                  <option value="Tech">Technical execution</option>
                  <option value="Productivity">Workplace Productivity</option>
                  <option value="Collab">Cooperative Teamwork</option>
                  <option value="Leadership">Lead and Mentorship</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Appraisal Score</label>
                <div className="flex gap-1 bg-slate-50 border border-slate-205 rounded-lg p-1.5 h-9 items-center justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setEvalStars(star)}
                      className="cursor-pointer text-amber-400 focus:outline-none"
                    >
                      <Star className={`w-4 h-4 ${star <= evalStars ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Dual slider configuration metrics */}
            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-slate-600">
                  <span>Productivity Output:</span>
                  <span className="font-mono text-slate-800">{sliderA}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#1bc1a1]"
                  value={sliderA}
                  onChange={(e) => setSliderA(Number(e.target.value))}
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-bold text-slate-600">
                  <span>Interpersonal Sync:</span>
                  <span className="font-mono text-slate-800">{sliderB}%</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[#1bc1a1]"
                  value={sliderB}
                  onChange={(e) => setSliderB(Number(e.target.value))}
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Evaluation Details & Commentary</label>
              <textarea
                rows={3}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-205 rounded-lg focus:outline-none focus:border-[#1bc1a1] resize-none text-slate-705 font-medium leading-relaxed"
                placeholder="Give professional commentary regarding their workplace accomplishments..."
                value={evalComment}
                onChange={(e) => setEvalComment(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-[#1bc1a1] to-teal-555 text-white font-extrabold text-xs shadow-xs rounded-xl cursor-pointer hover:opacity-90 active:scale-98 transition-transform"
            >
              Authorize Review Allocation
            </button>
          </form>
        </div>

        {/* Real-time continuous feedback feed logs */}
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-3.5 max-h-[190px] overflow-y-auto pr-1">
          <h4 className="text-[10px] font-black text-slate-405 uppercase tracking-widest leading-none mb-2">Appraisal Log History</h4>
          
          {reviews.map((rev) => (
            <div key={rev.id} className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-700">{rev.employeeName}</span>
                <span className="font-mono text-[9px] text-slate-400 font-bold">{rev.date}</span>
              </div>
              <div className="flex gap-1 items-center">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className={`w-3 h-3 ${i < rev.stars ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                ))}
                <span className="text-[9px] font-bold text-[#1bc1a1] bg-[#defff7] px-1.5 py-0.5 rounded ml-2 uppercase font-mono">{rev.category}</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{rev.comment}</p>
              <p className="text-[9px] text-slate-400 font-bold text-right">Written by: {rev.reviewer}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
