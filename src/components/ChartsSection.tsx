import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { ChevronDown, Calendar, Award, Building, BarChart2 } from 'lucide-react';
import { DEPARTMENTS } from '../data';

// Data shapes for line Chart
const TIMEFRAME_DATA = {
  'Last 3 Months': [
    { label: 'Apr', value: 162 },
    { label: 'May', value: 148 },
    { label: 'Jun', value: 154 }
  ],
  'Last 6 Months': [
    { label: 'Jan', value: 85 },
    { label: 'Feb', value: 72 },
    { label: 'Mar', value: 122 },
    { label: 'Apr', value: 162 },
    { label: 'May', value: 148 },
    { label: 'Jun', value: 154 }
  ],
  'Last Year': [
    { label: 'Q1', value: 280 },
    { label: 'Q2', value: 434 },
    { label: 'Q3', value: 390 },
    { label: 'Q4', value: 512 }
  ]
};

export default function ChartsSection() {
  const [lineTimeframe, setLineTimeframe] = useState<'Last 3 Months' | 'Last 6 Months' | 'Last Year'>('Last 6 Months');
  const [hoveredLineIndex, setHoveredLineIndex] = useState<number | null>(null);
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);
  const [showTimeframeMenu, setShowTimeframeMenu] = useState(false);

  const activeLineData = useMemo(() => {
    return TIMEFRAME_DATA[lineTimeframe];
  }, [lineTimeframe]);

  // SVG parameters for Line Graph
  const lineChartWidth = 500;
  const lineChartHeight = 160;
  const paddingX = 40;
  const paddingY = 25;

  const maxLineVal = 200; // Let's set 200 as maximum height limit inside data bounds

  const points = useMemo(() => {
    const dataLen = activeLineData.length;
    return activeLineData.map((d, index) => {
      const x = paddingX + ((lineChartWidth - 2 * paddingX) / (dataLen - 1 || 1)) * index;
      const y = lineChartHeight - paddingY - (d.value / maxLineVal) * (lineChartHeight - 2 * paddingY);
      return { x, y, label: d.label, val: d.value };
    });
  }, [activeLineData, lineChartHeight, lineChartWidth]);

  // Construct Cubic Bezier path string for curved smooth connections
  const pathString = useMemo(() => {
    if (points.length === 0) return '';
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 3;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (2 * (p1.x - p0.x)) / 3;
      const cpY2 = p1.y;
      d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
    return d;
  }, [points]);

  // Construct area gradient path string
  const areaPathString = useMemo(() => {
    if (points.length === 0) return '';
    const bottomY = lineChartHeight - paddingY + 5;
    return `${pathString} L ${points[points.length - 1].x} ${bottomY} L ${points[0].x} ${bottomY} Z`;
  }, [points, pathString, lineChartHeight]);

  // SVG parameters for Bar Graph
  const barChartHeight = 150;
  const maxBarVal = Math.max(...DEPARTMENTS.map((d) => d.count)) + 5; // dynamic bounds

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 select-none">
      {/* 1. Curve Trend Analytics Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs relative">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-800 text-xs sm:text-sm tracking-tight flex items-center gap-1.5 font-sans">
              <Calendar className="w-4 h-4 text-[#1bc1a1]" />
              <span>Application Trends</span>
            </h3>
            <p className="text-[10px] text-slate-400 font-medium">Candidate submission volumes</p>
          </div>

          {/* Selector dropdown menu */}
          <div className="relative">
            <button
              onClick={() => setShowTimeframeMenu(!showTimeframeMenu)}
              className="px-3 py-1.5 text-[10px] font-bold border border-slate-200 hover:border-slate-300 rounded-xl bg-white text-slate-600 flex items-center gap-1 cursor-pointer transition-all focus:ring-1 focus:ring-[#1bc1a1]/30"
            >
              <span>{lineTimeframe}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showTimeframeMenu && (
              <div className="absolute right-0 mt-1.5 w-36 bg-white border border-slate-100 rounded-xl shadow-lg z-30 py-1 text-xs">
                {(Object.keys(TIMEFRAME_DATA) as Array<keyof typeof TIMEFRAME_DATA>).map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      setLineTimeframe(opt);
                      setShowTimeframeMenu(false);
                      setHoveredLineIndex(null);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-slate-50 transition-colors font-semibold text-[11px] block cursor-pointer ${
                      lineTimeframe === opt ? 'text-[#1bc1a1] font-bold bg-[#defff7]/10' : 'text-slate-600'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Interactive SVG Canvas */}
        <div className="relative w-full overflow-hidden">
          <svg viewBox={`0 0 ${lineChartWidth} ${lineChartHeight}`} className="w-full h-auto overflow-visible">
            {/* Grid Lines Horizontal */}
            {[0, 50, 100, 150, 200].map((gl, i) => {
              const y = lineChartHeight - paddingY - (gl / maxLineVal) * (lineChartHeight - 2 * paddingY);
              return (
                <g key={gl}>
                  <line
                    x1={paddingX - 10}
                    y1={y}
                    x2={lineChartWidth - paddingX + 10}
                    y2={y}
                    stroke="#f1f5f9"
                    strokeWidth="1.5"
                    strokeDasharray={i === 0 ? '0' : '3 3'}
                  />
                  {/* Grid Value Label */}
                  <text
                    x={paddingX - 15}
                    y={y + 3}
                    textAnchor="end"
                    className="text-[9px] font-mono font-bold text-slate-300 fill-current"
                  >
                    {gl}
                  </text>
                </g>
              );
            })}

            {/* Gradient Fill Setup */}
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1bc1a1" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#1bc1a1" stopOpacity="0.01" />
              </linearGradient>
            </defs>

            {/* Area Path Fill Underneath */}
            <path d={areaPathString} fill="url(#lineGrad)" className="transition-all duration-300" />

            {/* Smooth Curve Stroke */}
            <path
              d={pathString}
              fill="none"
              stroke="#1bc1a1"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="transition-all duration-300"
            />

            {/* Vertical guidelines cursor trackers on hover */}
            {hoveredLineIndex !== null && points[hoveredLineIndex] && (
              <line
                x1={points[hoveredLineIndex].x}
                y1={paddingY}
                x2={points[hoveredLineIndex].x}
                y2={lineChartHeight - paddingY + 5}
                stroke="#1bc1a1"
                strokeWidth="1.5"
                strokeDasharray="2 2"
              />
            )}

            {/* Coordinate circles and overlay hover blocks */}
            {points.map((pt, idx) => (
              <g
                key={idx}
                onMouseEnter={() => setHoveredLineIndex(idx)}
                onMouseLeave={() => setHoveredLineIndex(null)}
                className="cursor-pointer"
              >
                {/* Visual Circle dot */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={hoveredLineIndex === idx ? 6 : 4}
                  fill={hoveredLineIndex === idx ? '#1bc1a1' : '#ffffff'}
                  stroke="#1bc1a1"
                  strokeWidth="2.5"
                  className="transition-all duration-150"
                />

                {/* Vertical bottom X label */}
                <text
                  x={pt.x}
                  y={lineChartHeight - 5}
                  textAnchor="middle"
                  className="text-[9.5px] font-mono font-semibold text-slate-400 fill-current"
                >
                  {pt.label}
                </text>

                {/* Wide invisible rectangle box to ease precise mouse-over */}
                <rect
                  x={pt.x - 25}
                  y={paddingY}
                  width="50"
                  height={lineChartHeight - 2 * paddingY}
                  fill="transparent"
                />
              </g>
            ))}
          </svg>

          {/* Floating Line Tooltip popup */}
          {hoveredLineIndex !== null && points[hoveredLineIndex] && (
            <div
              className="absolute bg-slate-900 text-white rounded-xl shadow-xl p-3 text-xs z-25 pointer-events-none flex flex-col font-mono"
              style={{
                left: `${(points[hoveredLineIndex].x / lineChartWidth) * 100}%`,
                top: `${(points[hoveredLineIndex].y / lineChartHeight) * 100 - 45}%`,
                transform: 'translateX(-50%)'
              }}
            >
              <span className="text-[9px] font-bold text-[#defff7] uppercase tracking-wider mb-0.5">
                {points[hoveredLineIndex].label} Applicants
              </span>
              <span className="font-extrabold text-base leading-none">
                {points[hoveredLineIndex].val}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Department Histogram Bar Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs relative">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-800 text-xs sm:text-sm tracking-tight flex items-center gap-1.5 font-sans">
              <BarChart2 className="w-4 h-4 text-[#1bc1a1]" />
              <span>Application by Department</span>
            </h3>
            <p className="text-[10px] text-slate-400 font-medium">Distribution across team departments</p>
          </div>
          <span className="text-[10px] font-mono font-extrabold bg-[#defff7] text-[#0f766e] px-2 py-0.5 rounded-full">
            6 Departments
          </span>
        </div>

        {/* Visual Bar Graph elements built with responsive flex elements */}
        <div className="flex items-end justify-between gap-2.5 pt-7 pb-1 min-h-[160px] relative">
          {DEPARTMENTS.map((dept, idx) => {
            const barHeightPct = (dept.count / maxBarVal) * 100;
            const isHovered = hoveredBarIndex === idx;

            // Simplified acronym shorthand for mobile view representation
            const shortName = dept.name
              .split(' ')
              .map((w) => w[0])
              .join('');

            return (
              <div
                key={dept.name}
                className="flex-1 flex flex-col items-center group relative cursor-pointer"
                onMouseEnter={() => setHoveredBarIndex(idx)}
                onMouseLeave={() => setHoveredBarIndex(null)}
              >
                {/* The vertical active bar pill */}
                <div className="w-full relative bg-slate-50 rounded-lg overflow-hidden h-32 flex items-end">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${barHeightPct}%` }}
                    transition={{ type: 'spring', delay: idx * 0.05, damping: 20, stiffness: 300 }}
                    className={`w-full rounded-b-md transition-all duration-200 ${
                      isHovered
                        ? 'bg-[#159d83] shadow-inner shadow-black/10 shadow-sm'
                        : 'bg-[#1bc1a1]'
                    }`}
                  />
                </div>

                {/* Department acronym/label text at the bottom */}
                <span className="text-[10px] font-bold text-slate-500 mt-2 text-center group-hover:text-[#1bc1a1] w-full truncate">
                  <span className="hidden sm:inline-block max-w-full truncate">{dept.name}</span>
                  <span className="inline-block sm:hidden">{shortName}</span>
                </span>

                {/* Floating Tooltip positioned exactly above the hovered bar column */}
                {isHovered && (
                  <div className="absolute bottom-36 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700/80 text-white rounded-xl shadow-xl px-3 py-2 z-25 min-w-[130px] font-mono pointer-events-none text-center">
                    <p className="text-[9px] font-bold text-[#defff7] uppercase tracking-wide leading-tight mb-1 truncate">
                      {dept.name}
                    </p>
                    <p className="font-extrabold text-sm leading-none">
                      {dept.count} <span className="text-[10px] text-slate-400 font-normal">candidates</span>
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
