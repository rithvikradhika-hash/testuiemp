import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Search, 
  UserPlus, 
  Grid, 
  List, 
  X, 
  MapPin, 
  Mail, 
  Calendar, 
  Filter,
  CheckCircle,
  Clock,
  Sparkles,
  Award,
  MoreVertical,
  MinusCircle
} from 'lucide-react';

interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  joinDate: string;
  email: string;
  location: 'Remote' | 'On-Site' | 'Hybrid';
  status: 'Active' | 'On Leave' | 'Suspended';
  rating: number; // 1-5 Performance metrics
  salary: number;
}

export default function EmployeesSection() {
  // Sync core employees in state
  const [employees, setEmployees] = useState<Employee[]>([
    { id: 'emp-1', name: 'Sophia Alexandra', role: 'Lead UX Architect', department: 'Product Design', joinDate: '2030-04-12', email: 'sophia.a@company.com', location: 'Remote', status: 'Active', rating: 5, salary: 145000 },
    { id: 'emp-2', name: 'Marcus Sterling', role: 'Enterprise Sales Manager', department: 'Operations', joinDate: '2031-11-01', email: 'm.sterling@company.com', location: 'On-Site', status: 'Active', rating: 4, salary: 98000 },
    { id: 'emp-3', name: 'Emma Watson', role: 'Junior HR Analyst', department: 'Human Resources', joinDate: '2034-02-15', email: 'e.watson@company.com', location: 'On-Site', status: 'Active', rating: 4, salary: 62000 },
    { id: 'emp-4', name: 'Liam Neeson', role: 'Senior R&D Architect', department: 'R&D', joinDate: '2028-09-20', email: 'liam.n@company.com', location: 'Hybrid', status: 'On Leave', rating: 5, salary: 168000 },
    { id: 'emp-5', name: 'Rian Wijaya', role: 'Frontend Engineer', department: 'R&D', joinDate: '2033-07-01', email: 'r.wijaya@company.com', location: 'Remote', status: 'Active', rating: 3, salary: 85000 },
    { id: 'emp-6', name: 'Clara Mentari', role: 'Support Representative', department: 'Customer Service', joinDate: '2035-02-10', email: 'c.mentari@company.com', location: 'On-Site', status: 'Active', rating: 3, salary: 54000 },
    { id: 'emp-7', name: 'David Beckham', role: 'Brand Outreach Lead', department: 'Marketing', joinDate: '2032-06-18', email: 'beckham@company.com', location: 'Hybrid', status: 'Suspended', rating: 2, salary: 74000 }
  ]);

  // Layout and filter settings
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Detail sidebar and registration modal state toggles
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Employee registration records
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpRole, setNewEmpRole] = useState('');
  const [newEmpDept, setNewEmpDept] = useState('Product Design');
  const [newEmpEmail, setNewEmpEmail] = useState('');
  const [newEmpLocation, setNewEmpLocation] = useState<'Remote' | 'On-Site' | 'Hybrid'>('Remote');
  const [newEmpStatus, setNewEmpStatus] = useState<'Active' | 'On Leave'>('Active');
  const [newEmpSalary, setNewEmpSalary] = useState(70000);

  const departments = ['All', 'Product Design', 'Operations', 'Human Resources', 'R&D', 'Customer Service', 'Marketing'];

  // 1. Filtered employee datasets
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          emp.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === 'All' || emp.department === deptFilter;
    const matchesStatus = statusFilter === 'All' || emp.status === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  // 2. Active stats calculator
  const activeCount = employees.filter(e => e.status === 'Active').length;
  const leaveCount = employees.filter(e => e.status === 'On Leave').length;
  const alertCount = employees.filter(e => e.status === 'Suspended').length;

  const getStatusStyle = (st: string) => {
    switch (st) {
      case 'Active': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'On Leave': return 'bg-amber-50 text-amber-700 border-amber-100';
      default: return 'bg-rose-50 text-rose-700 border-rose-100';
    }
  };

  const handleRegisterEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpName || !newEmpRole || !newEmpEmail) return;

    const newStaff: Employee = {
      id: `emp-dyn-${Date.now()}`,
      name: newEmpName,
      role: newEmpRole,
      department: newEmpDept,
      joinDate: new Date().toISOString().split('T')[0],
      email: newEmpEmail,
      location: newEmpLocation,
      status: newEmpStatus,
      rating: 4, // Default competency multiplier
      salary: Number(newEmpSalary)
    };

    setEmployees([newStaff, ...employees]);
    // Reset Form fields
    setNewEmpName('');
    setNewEmpRole('');
    setNewEmpEmail('');
    setNewEmpLocation('Remote');
    setNewEmpStatus('Active');
    setNewEmpSalary(70000);
    setShowAddModal(false);
  };

  // State mutators (Promotions, leave toggle and compliance resets)
  const handlePromoteStaff = (id: string) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === id) {
          const updated: Employee = {
            ...emp,
            role: `Senior ${emp.role.replace('Senior ', '')}`,
            salary: Math.floor(emp.salary * 1.15),
            rating: Math.min(5, emp.rating + 1)
          };
          if (selectedEmp && selectedEmp.id === id) setSelectedEmp(updated);
          return updated;
        }
        return emp;
      })
    );
  };

  const handleSetStatus = (id: string, newStatus: 'Active' | 'On Leave' | 'Suspended') => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id === id) {
          const updated = { ...emp, status: newStatus };
          if (selectedEmp && selectedEmp.id === id) setSelectedEmp(updated);
          return updated;
        }
        return emp;
      })
    );
  };

  const handleTerminateStaff = (id: string) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    setSelectedEmp(null);
  };

  return (
    <div className="space-y-6 select-none">
      
      {/* Top Banner metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-3xs">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-[#defff7] text-[#1bc1a1] flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </span>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Staff Registered</span>
            <p className="text-xl font-extrabold text-slate-800 font-mono">{employees.length} FTEs</p>
          </div>
        </div>
        <div className="border-l border-slate-100 pl-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active duty</span>
            <p className="text-base font-extrabold text-emerald-600 font-mono">{activeCount} Personnel</p>
          </div>
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
        </div>
        <div className="border-l border-slate-100 pl-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Sabbatical/Leave</span>
            <p className="text-base font-extrabold text-amber-500 font-mono">{leaveCount} Staff</p>
          </div>
          <span className="w-2.5 h-2.5 bg-amber-500 rounded-full" />
        </div>
        <div className="border-l border-slate-100 pl-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Suspensions</span>
            <p className="text-base font-extrabold text-rose-500 font-mono">{alertCount} flagged</p>
          </div>
          <span className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Main control filter bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-100">
        
        {/* Left Filters input pack */}
        <div className="flex flex-1 flex-wrap gap-3 items-center w-full">
          
          {/* Text lookup input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              className="w-full pl-9 pr-4 py-2 text-xs font-semibold text-slate-650 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1bc1a1]/50 focus:bg-white transition-all shadow-3xs"
              placeholder="Search personnel database..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Department selecting bar */}
          <div className="relative">
            <select
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-bold text-slate-600 focus:outline-none focus:border-[#1bc1a1] cursor-pointer"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d === 'All' ? 'All Departments' : d}
                </option>
              ))}
            </select>
          </div>

          {/* Status Select dropdown */}
          <div className="relative">
            <select
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-bold text-slate-600 focus:outline-none focus:border-[#1bc1a1] cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Right Buttons config */}
        <div className="flex gap-2 shrink-0 w-full sm:w-auto justify-end">
          {/* Swappers Layout buttons */}
          <div className="flex items-center border border-slate-200 rounded-lg p-1 bg-slate-50">
            <button
              onClick={() => setLayoutMode('grid')}
              className={`p-1.5 rounded ${layoutMode === 'grid' ? 'bg-white shadow-3xs text-[#1bc1a1]' : 'text-slate-400 hover:text-slate-600'} cursor-pointer`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayoutMode('list')}
              className={`p-1.5 rounded ${layoutMode === 'list' ? 'bg-white shadow-3xs text-[#1bc1a1]' : 'text-slate-400 hover:text-slate-600'} cursor-pointer`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Hire actions */}
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-lg bg-[#1bc1a1] hover:bg-[#159d83] text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-xs cursor-pointer active:scale-98 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            <span>Process New Hire</span>
          </button>
        </div>
      </div>

      {filteredEmployees.length === 0 ? (
        <div className="p-16 border-2 border-dashed border-slate-205 rounded-2xl bg-white text-center">
          <Clock className="w-10 h-10 text-slate-350 mx-auto mb-2 animate-bounce" />
          <h4 className="text-sm font-bold text-slate-800">No personnel records found</h4>
          <p className="text-xs text-slate-400 mt-1">Refine your search criteria or register a new hire on-board.</p>
        </div>
      ) : (
        /* Dynamic Grid Layout Switch */
        <AnimatePresence mode="popLayout">
          {layoutMode === 'grid' ? (
            <motion.div
              layout
              key="gridview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredEmployees.map((emp) => (
                <div
                  key={emp.id}
                  onClick={() => setSelectedEmp(emp)}
                  className="bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-md cursor-pointer transition-all duration-200 p-5 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusStyle(emp.status)}`}>
                        {emp.status}
                      </span>
                      <span className="font-mono text-[9px] text-slate-355 font-bold">#{emp.id}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-[#defff7] text-[#1bc1a1] flex items-center justify-center font-extrabold text-sm shrink-0 border border-[#1bc1a1]/20">
                        {emp.name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xs text-slate-800">{emp.name}</h4>
                        <p className="text-[10px] font-bold text-slate-400">{emp.role}</p>
                      </div>
                    </div>

                    {/* Department Tag info */}
                    <div className="pt-2 border-t border-slate-50 space-y-1.5 text-xs text-slate-500 font-semibold">
                      <p className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 font-bold">Dept:</span>
                        <span className="text-slate-700">{emp.department}</span>
                      </p>
                      <p className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 font-bold">Salary Bracket:</span>
                        <span className="font-mono text-slate-700">${emp.salary.toLocaleString()}/yr</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-[10px] font-bold text-[#1bc1a1]">
                    <span>Performance: {emp.rating} / 5 ⭐</span>
                    <span className="hover:underline">Open Profile &rarr;</span>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              layout
              key="listview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] font-black uppercase tracking-wider text-slate-400">
                      <th className="p-4">Personnel</th>
                      <th className="p-4">Department</th>
                      <th className="p-4">Join Date</th>
                      <th className="p-4">Type Location</th>
                      <th className="p-4">Salary Bracket</th>
                      <th className="p-4 text-center">Competency</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredEmployees.map((emp) => (
                      <tr
                        key={emp.id}
                        onClick={() => setSelectedEmp(emp)}
                        className="hover:bg-[#1bc1a1]/5 transition-colors cursor-pointer select-none"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-teal-50 text-[#1bc1a1] flex items-center justify-center font-bold text-xs">
                              {emp.name[0]}
                            </div>
                            <div>
                              <p className="font-extrabold text-slate-700 text-xs">{emp.name}</p>
                              <p className="text-[10px] text-slate-400 font-bold">{emp.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-bold text-slate-600">{emp.department}</td>
                        <td className="p-4 font-mono text-slate-450 font-bold">{emp.joinDate}</td>
                        <td className="p-4">
                          <span className="bg-slate-100 text-slate-600 font-bold px-2 py-0.5 rounded-md text-[10px]">
                            {emp.location}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-slate-650 font-bold">${emp.salary.toLocaleString()}</td>
                        <td className="p-4 text-center font-black text-[#1bc1a1]">{emp.rating} / 5 ⭐</td>
                        <td className="p-4">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusStyle(emp.status)}`}>
                            {emp.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button className="text-[#1bc1a1] font-bold text-[11px] hover:underline">
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* Slide Drawer Profile Detail Panel */}
      <AnimatePresence>
        {selectedEmp && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.35 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEmp(null)}
              className="fixed inset-0 bg-black z-40"
            />

            {/* Cabinet Slide Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:max-w-md bg-white border-l border-slate-150 z-50 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-[10px] text-slate-405 font-bold uppercase tracking-wider font-mono">Profile Details: {selectedEmp.id}</span>
                  <button
                    onClick={() => setSelectedEmp(null)}
                    className="w-7 h-7 rounded-lg hover:bg-slate-50 border border-slate-200 flex items-center justify-center cursor-pointer text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="text-center space-y-3 pt-2">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#1bc1a1] to-cyan-500 font-extrabold text-white text-xl flex items-center justify-center mx-auto shadow-sm">
                    {selectedEmp.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-800">{selectedEmp.name}</h3>
                    <p className="text-[11px] font-bold text-slate-400 mt-0.5">{selectedEmp.role} &bull; {selectedEmp.location}</p>
                  </div>
                  <div className="flex justify-center gap-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusStyle(selectedEmp.status)}`}>
                      {selectedEmp.status}
                    </span>
                  </div>
                </div>

                {/* Substantive metrics */}
                <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl relative">
                  <div className="absolute top-2.5 right-3 flex items-center gap-1">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span className="text-[10px] font-extrabold text-amber-700">{selectedEmp.rating} / 5 Standard</span>
                  </div>

                  <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Work Contract Specs</h4>
                  <div className="space-y-2 text-xs font-bold text-slate-600">
                    <p className="flex justify-between">
                      <span className="text-slate-400">Department:</span>
                      <span>{selectedEmp.department}</span>
                    </p>
                    <p className="flex justify-between font-mono">
                      <span className="text-slate-400 font-sans">Active Salary Bracket:</span>
                      <span>${selectedEmp.salary.toLocaleString()}/yr</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-400">Join Date Stamp:</span>
                      <span className="font-mono text-slate-500">{selectedEmp.joinDate}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-400">Work Location Category:</span>
                      <span>{selectedEmp.location}</span>
                    </p>
                  </div>
                </div>

                {/* Action panel triggers */}
                <div className="space-y-3.5">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Admin Actions Management</h4>
                  
                  <button
                    onClick={() => handlePromoteStaff(selectedEmp.id)}
                    className="w-full py-2.5 rounded-xl border border-[#1bc1a1]/30 bg-[#1bc1a1]/5 hover:bg-[#1bc1a1]/10 text-[#1bc1a1] text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Award className="w-4 h-4" />
                    <span>Promote Staff (15% Raise + Rating Uplift)</span>
                  </button>

                  <div className="grid grid-cols-2 gap-2.5">
                    {selectedEmp.status !== 'Active' ? (
                      <button
                        onClick={() => handleSetStatus(selectedEmp.id, 'Active')}
                        className="py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-650 text-xs font-bold cursor-pointer"
                      >
                        Reinstate Active Duty
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => handleSetStatus(selectedEmp.id, 'On Leave')}
                          className="py-2.5 rounded-xl border border-[#1bc1a1]/20 hover:bg-slate-50 text-slate-600 text-xs font-bold cursor-pointer"
                        >
                          Mark On Leave
                        </button>
                        <button
                          onClick={() => handleSetStatus(selectedEmp.id, 'Suspended')}
                          className="py-2.5 rounded-xl border border-rose-200 hover:bg-rose-50/50 text-rose-650 text-xs font-bold cursor-pointer"
                        >
                          Suspend Accounts
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Termination block zone */}
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
                <button
                  onClick={() => handleTerminateStaff(selectedEmp.id)}
                  className="w-full py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-extrabold flex items-center justify-center gap-1.5 border border-rose-200 transition-colors cursor-pointer"
                >
                  <MinusCircle className="w-4 h-4 border-transparent" />
                  <span>Terminate & Purge Compliance Record</span>
                </button>
                <p className="text-[10px] text-center text-slate-400 leading-relaxed font-semibold">
                  Sabbatical toggling as well as raises apply immediate side-effect alterations into matching leave allocations and general ledger tabs!
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hire Modal Form */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-slate-900"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-slate-150 p-6 w-full max-w-lg shadow-2xl relative z-10 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-50 mb-5">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-[#1bc1a1]" />
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-800">New Personnel Onboarding Form</h3>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-7 h-7 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleRegisterEmployee} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Full Name</label>
                    <input
                      type="text"
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1bc1a1]"
                      placeholder="e.g. Richard Hendricks"
                      value={newEmpName}
                      onChange={(e) => setNewEmpName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Personal Mail ID</label>
                    <input
                      type="email"
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1bc1a1]"
                      placeholder="e.g. r.hendricks@piedpiper.com"
                      value={newEmpEmail}
                      onChange={(e) => setNewEmpEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Functional Domain</label>
                    <input
                      type="text"
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1bc1a1]"
                      placeholder="e.g. Senior Backend Architect"
                      value={newEmpRole}
                      onChange={(e) => setNewEmpRole(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Corporate Department</label>
                    <select
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 text-slate-650 rounded-lg font-bold"
                      value={newEmpDept}
                      onChange={(e) => setNewEmpDept(e.target.value)}
                    >
                      <option value="Product Design">Product Design</option>
                      <option value="Operations">Operations</option>
                      <option value="Human Resources">Human Resources</option>
                      <option value="R&D">R&D</option>
                      <option value="Customer Service">Customer Service</option>
                      <option value="Marketing">Marketing</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Work Desk Allocation</label>
                    <select
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 text-slate-650 rounded-lg font-bold"
                      value={newEmpLocation}
                      onChange={(e) => setNewEmpLocation(e.target.value as any)}
                    >
                      <option value="Remote">Remote</option>
                      <option value="On-Site">On-Site</option>
                      <option value="Hybrid">Hybrid</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Contract Status</label>
                    <select
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 text-slate-650 rounded-lg font-bold"
                      value={newEmpStatus}
                      onChange={(e) => setNewEmpStatus(e.target.value as any)}
                    >
                      <option value="Active">Active</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-1 font-mono">Starting Salary</label>
                    <input
                      type="number"
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-600 focus:outline-none"
                      value={newEmpSalary}
                      onChange={(e) => setNewEmpSalary(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#1bc1a1] hover:bg-[#129a7f] rounded-lg text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Establish Compliance Register
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
