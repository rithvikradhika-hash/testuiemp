import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Calendar,
  Layers,
  Check,
  Search,
  ChevronDown,
  ChevronRight,
  Paperclip,
  MessageSquare,
  MoreHorizontal,
  SlidersHorizontal,
  User,
  Users,
  Eye,
  ArrowUpDown,
  Sparkles,
  Briefcase,
  FileText,
  HelpCircle
} from 'lucide-react';
import { EmployeeTask } from '../types';

interface TaskManagerSectionProps {
  tasks: EmployeeTask[];
  onUpdateTaskStatus: (taskId: string, newStatus: EmployeeTask['status']) => void;
  onUpdateTaskProgress: (taskId: string, newProgress: number) => void;
  onUpdateTask: (taskId: string, updatedFields: Partial<EmployeeTask>) => void;
  onAddTask: (newTask: Omit<EmployeeTask, 'id'>) => void;
  onDeleteTask: (taskId: string) => void;
  employeesList: { name: string; role: string; avatar: string; department: string }[];
}

export default function TaskManagerSection({
  tasks,
  onUpdateTaskStatus,
  onUpdateTaskProgress,
  onUpdateTask,
  onAddTask,
  onDeleteTask,
  employeesList
}: TaskManagerSectionProps) {
  // Local interface controllers
  const [searchKey, setSearchKey] = useState<string>('');
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  const [activeDropdown, setActiveDropdown] = useState<{ taskId: string; type: 'owner' | 'status' | 'priority' } | null>(null);

  
  // Custom groupings State
  const [customGroups, setCustomGroups] = useState<Array<{ name: string; color: string }>>([
    { name: 'To-Do', color: '#0086c0' }, // monday.com classic blue
    { name: 'Completed', color: '#00c875' } // monday.com classic green
  ]);
  const [showAddGroup, setShowAddGroup] = useState(false);
  const [newGroupTitle, setNewGroupTitle] = useState('');
  const [newGroupColor, setNewGroupColor] = useState('#a25ddc'); // default purple

  // Inline inputs tracker
  const [editingCell, setEditingCell] = useState<{ taskId: string; field: 'title' | 'notesText' | 'timeline' | 'dueDate' } | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');
  
  // Task detail description modal
  const [activeDetailTask, setActiveDetailTask] = useState<EmployeeTask | null>(null);
  const [isAddingTaskInlineName, setIsAddingTaskInlineName] = useState<string>('');
  const [isAddingTaskGroup, setIsAddingTaskGroup] = useState<string | null>(null);

  // Filter controllers for top rail
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [deptFilter, setDeptFilter] = useState<string>('All');
  const [personFilter, setPersonFilter] = useState<string>('All');

  // Notifications banner helper
  const [notifyMessage, setNotifyMessage] = useState<string | null>(
    "Welcome to the high-fidelity TeamHub monday.com workspace! Try inline-editing any cell below."
  );

  useEffect(() => {
    if (notifyMessage) {
      const timer = setTimeout(() => setNotifyMessage(null), 8500);
      return () => clearTimeout(timer);
    }
  }, [notifyMessage]);

  // Click outside listener to safely close picker drop downs
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync state helpers
  const handleToggleSelectAll = (groupTasks: EmployeeTask[]) => {
    const groupIds = groupTasks.map(t => t.id);
    const allSelected = groupIds.every(id => selectedTasks.has(id));
    
    setSelectedTasks(prev => {
      const next = new Set(prev);
      if (allSelected) {
        groupIds.forEach(id => next.delete(id));
      } else {
        groupIds.forEach(id => next.add(id));
      }
      return next;
    });
  };

  const handleToggleSelectTask = (taskId: string) => {
    setSelectedTasks(prev => {
      const next = new Set(prev);
      if (next.has(taskId)) {
        next.delete(taskId);
      } else {
        next.add(taskId);
      }
      return next;
    });
  };

  const handleDeleteSelected = () => {
    if (selectedTasks.size === 0) return;
    if (window.confirm(`Are you sure you want to delete the ${selectedTasks.size} selected tasks?`)) {
      selectedTasks.forEach(id => onDeleteTask(id));
      setSelectedTasks(new Set());
      setNotifyMessage("Selected tasks successfully excised from the sprint.");
    }
  };

  const handleBulkStatusUpdate = (status: EmployeeTask['status']) => {
    if (selectedTasks.size === 0) return;
    selectedTasks.forEach(id => {
      onUpdateTask(id, { status, groupName: status === 'Done' || status === 'Completed' ? 'Completed' : 'To-Do' });
    });
    setSelectedTasks(new Set());
    setNotifyMessage(`Updated status for ${selectedTasks.size} tasks.`);
  };

  const handleBulkPriorityUpdate = (priority: EmployeeTask['priority']) => {
    if (selectedTasks.size === 0) return;
    selectedTasks.forEach(id => {
      onUpdateTask(id, { priority });
    });
    setSelectedTasks(new Set());
    setNotifyMessage(`Updated priority for ${selectedTasks.size} tasks.`);
  };

  const handleToggleGroupCollapse = (groupName: string) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupName)) {
        next.delete(groupName);
      } else {
        next.add(groupName);
      }
      return next;
    });
  };

  // Maps legacy app status format to monday-style
  const getMondayStatus = (status: string): 'Working on it' | 'Done' | 'Stuck' | 'Not Started' => {
    if (status === 'Completed' || status === 'Done') return 'Done';
    if (status === 'In Progress' || status === 'Working on it') return 'Working on it';
    if (status === 'Under Review' || status === 'Stuck') return 'Stuck';
    return 'Not Started';
  };

  const getStatusBgColor = (status: string) => {
    const mapped = getMondayStatus(status);
    switch (mapped) {
      case 'Done': return 'bg-[#00c875] text-white hover:bg-[#00b569]';
      case 'Working on it': return 'bg-[#fdab3d] text-white hover:bg-[#e4962c]';
      case 'Stuck': return 'bg-[#df2f4a] text-white hover:bg-[#c91f3a]';
      default: return 'bg-[#c4c4c4] text-white hover:bg-[#b0b0b0]';
    }
  };

  const getPriorityBgColor = (pri: string) => {
    switch (pri) {
      case 'Critical': return 'bg-[#e44b61] text-white hover:bg-[#d03d52]';
      case 'High': return 'bg-[#401b9c] text-white hover:bg-[#341484]';
      case 'Medium': return 'bg-[#5559df] text-white hover:bg-[#4347c6]';
      default: return 'bg-[#579bfc] text-white hover:bg-[#4387e6]'; // Low
    }
  };

  const handleStartEditingCell = (taskId: string, field: 'title' | 'notesText' | 'timeline' | 'dueDate', value: string) => {
    setEditingCell({ taskId, field });
    setEditingValue(value);
  };

  const handleCommitEditingCell = () => {
    if (!editingCell) return;
    const { taskId, field } = editingCell;
    onUpdateTask(taskId, { [field]: editingValue, lastUpdated: 'Just now' });
    setEditingCell(null);
  };

  const handleKeyDownEditingCell = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommitEditingCell();
    } else if (e.key === 'Escape') {
      setEditingCell(null);
    }
  };

  const handleAddGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupTitle.trim()) return;
    
    // Check if group already exists
    if (customGroups.some(g => g.name.toLowerCase() === newGroupTitle.trim().toLowerCase())) {
      alert("Group category already exists.");
      return;
    }

    setCustomGroups([...customGroups, { name: newGroupTitle.trim(), color: newGroupColor }]);
    setNewGroupTitle('');
    setShowAddGroup(false);
    setNotifyMessage(`Created new workflow group: "${newGroupTitle.trim()}"`);
  };

  const handleDeleteGroup = (groupName: string) => {
    if (groupName === 'To-Do' || groupName === 'Completed') {
      alert("Core groups cannot be deleted.");
      return;
    }
    if (window.confirm(`Are you sure you want to delete the group "${groupName}"? Associated tasks will revert to standard 'To-Do'.`)) {
      setCustomGroups(customGroups.filter(g => g.name !== groupName));
      tasks.forEach(t => {
        if (t.groupName === groupName) {
          onUpdateTask(t.id, { groupName: 'To-Do' });
        }
      });
      setNotifyMessage(`Deleted group "${groupName}".`);
    }
  };

  // Filter tasks based on all active configurations
  const filteredTasks = tasks.filter(t => {
    // String search mismatch
    const matchesSearch = 
      t.title.toLowerCase().includes(searchKey.toLowerCase()) ||
      (t.notesText || '').toLowerCase().includes(searchKey.toLowerCase()) ||
      t.assignedTo.toLowerCase().includes(searchKey.toLowerCase());
    if (!matchesSearch) return false;

    // Side rail strict role constraint
    // No restrictive constraint, staff sees all exactly like admin
    if (false) {
      return t.assignedTo === 'Sophia Alexandra';
    }

    // Interactive multi-filters
    if (priorityFilter !== 'All' && t.priority !== priorityFilter) return false;
    if (deptFilter !== 'All' && t.department !== deptFilter) return false;
    if (personFilter !== 'All' && t.assignedTo !== personFilter) return false;

    return true;
  });

  // Main task creation launcher
  const handleAddNewTaskToGroup = (groupName: string, customTitle?: string) => {
    const titleVal = customTitle || isAddingTaskInlineName.trim() || 'New task';
    const firstEmployee = employeesList[0] || { name: 'Sophia Alexandra', avatar: '', department: 'Product Design' };
    
    onAddTask({
      title: titleVal,
      description: 'Staged from workspace inline insertion.',
      assignedTo: firstEmployee.name,
      assignedToAvatar: firstEmployee.avatar,
      department: firstEmployee.department,
      priority: 'Low',
      status: groupName === 'Completed' ? 'Done' : 'Not Started',
      dueDate: new Date().toISOString().split('T')[0],
      progress: groupName === 'Completed' ? 100 : 0,
      timeline: `${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(Date.now() + 86400000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      files: '',
      notesText: 'Added via board shortcuts',
      groupName: groupName,
      lastUpdated: 'Just now'
    });

    setIsAddingTaskInlineName('');
    setIsAddingTaskGroup(null);
    setNotifyMessage("Task appended successfully with standard editable metadata.");
  };

  return (
    <div className="space-y-6 select-none animate-fadeIn leading-relaxed tracking-normal text-slate-800" ref={containerRef}>
      
      {/* Top Banner Notice */}
      <AnimatePresence>
        {notifyMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3.5 bg-[#defff7] border border-[#1bc1a1]/30 rounded-xl flex items-center justify-between shadow-xs text-xs text-[#0f766e]"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#1bc1a1] shrink-0 animate-spin" />
              <span className="font-semibold">{notifyMessage}</span>
            </div>
            <button onClick={() => setNotifyMessage(null)} className="font-mono text-slate-400 hover:text-slate-600 font-bold px-1.5 py-0.5">✕</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Corporate Workspace header & filters in the row */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-4">
        
        {/* Row 1: Left - descriptive banner, Right - actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping" />
              <h3 className="font-extrabold text-slate-800 text-sm sm:text-base tracking-tight">Main Table Workspace</h3>
            </div>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
              Refined spreadsheet controls with spreadsheet cell navigation, customizable groupings, and dual-timeline dates.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleAddNewTaskToGroup('To-Do', 'New task draft')}
              className="px-3.5 py-1.5 bg-[#0086c0] hover:bg-[#0073a5] text-white font-extrabold text-xs shadow-xs rounded-lg cursor-pointer flex items-center gap-1 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New task</span>
            </button>

            <button
              onClick={() => setShowAddGroup(!showAddGroup)}
              className="px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 border border-slate-200 font-bold text-xs rounded-lg cursor-pointer flex items-center gap-1 transition-all"
            >
              <Layers className="w-3.5 h-3.5 text-purple-650" />
              <span>Add new group</span>
            </button>
          </div>
        </div>

        {/* Dynamic add new group inline form */}
        <AnimatePresence>
          {showAddGroup && (
            <motion.form 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleAddGroupSubmit}
              className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end"
            >
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Group Name</label>
                <input 
                  type="text" 
                  value={newGroupTitle}
                  onChange={(e) => setNewGroupTitle(e.target.value)}
                  placeholder="e.g. Q3 Milestones, Launchpad"
                  className="w-full text-xs font-semibold px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 text-slate-700"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Theme Color Indicator</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="color" 
                    value={newGroupColor}
                    onChange={(e) => setNewGroupColor(e.target.value)}
                    className="w-8 h-8 rounded border p-0 cursor-pointer"
                  />
                  <span className="text-xs font-mono text-slate-500 font-semibold">{newGroupColor.toUpperCase()}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  type="submit"
                  className="flex-1 text-xs py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg"
                >
                  Approve Category
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowAddGroup(false)}
                  className="text-xs py-2 px-3 bg-white border border-slate-205 text-slate-600 font-bold rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Row 2: Search, Filter, Sort, Hide controls mimicking monday.com perfectly */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pt-1">
          {/* Quick search input */}
          <div className="relative flex-1 max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Search className="w-3.5 h-3.5" />
            </span>
            <input
              type="text"
              placeholder="Search in board..."
              value={searchKey}
              onChange={(e) => setSearchKey(e.target.value)}
              className="w-full text-xs font-semibold pl-9 pr-8 py-2 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 rounded-lg text-slate-705 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
            {searchKey && (
              <button 
                onClick={() => setSearchKey('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-[10px] font-bold"
              >
                Clear
              </button>
            )}
          </div>

          {/* Interactive filter capsules */}
          <div className="flex items-center gap-2.5 flex-wrap text-xs select-none">
            
            {/* Person Selector */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-all cursor-pointer">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <select 
                value={personFilter} 
                onChange={(e) => setPersonFilter(e.target.value)}
                className="bg-transparent border-none text-[11px] font-bold outline-none cursor-pointer text-slate-700"
              >
                <option value="All">Person: All</option>
                {employeesList.map(emp => (
                  <option key={emp.name} value={emp.name}>{emp.name}</option>
                ))}
              </select>
            </div>

            {/* Department Selector */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-all cursor-pointer">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <select 
                value={deptFilter} 
                onChange={(e) => setDeptFilter(e.target.value)}
                className="bg-transparent border-none text-[11px] font-bold outline-none cursor-pointer text-slate-700"
              >
                <option value="All font-bold">Dept: All</option>
                <option value="Product Design">Product Design</option>
                <option value="R&D">R&D</option>
                <option value="Operations">Operations</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Marketing">Marketing</option>
              </select>
            </div>

            {/* Priority Selector */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-all cursor-pointer">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <select 
                value={priorityFilter} 
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-transparent border-none text-[11px] font-bold outline-none cursor-pointer text-slate-700"
              >
                <option value="All">Priority: All</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Clear Filters helper */}
            {(priorityFilter !== 'All' || deptFilter !== 'All' || personFilter !== 'All') && (
              <button 
                onClick={() => {
                  setPriorityFilter('All');
                  setDeptFilter('All');
                  setPersonFilter('All');
                }}
                className="text-[10px] text-blue-650 font-bold underline hover:text-blue-800"
              >
                Clear Filters
              </button>
            )}

          </div>
        </div>

        {/* Bulk Action Controls if Selected Tasks exists */}
        {selectedTasks.size > 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-wrap items-center justify-between gap-3 p-3 bg-blue-50 border border-blue-200/50 rounded-xl"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-blue-750 font-mono">
                {selectedTasks.size} tasks selected
              </span>
              <span className="text-slate-350">|</span>
              <button 
                onClick={() => setSelectedTasks(new Set())}
                className="text-[11px] text-blue-700 hover:underline font-semibold"
              >
                Deselect all
              </button>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Change status of selected */}
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleBulkStatusUpdate(e.target.value as any);
                    e.target.value = '';
                  }
                }}
                className="text-[11px] bg-white border border-slate-250 py-1 px-2.5 rounded font-bold text-slate-650"
              >
                <option value="">Set Status...</option>
                <option value="Done">Done</option>
                <option value="Working on it">Working on it</option>
                <option value="Stuck">Stuck</option>
                <option value="Not Started">Not Started</option>
              </select>

              {/* Change priority of selected */}
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    handleBulkPriorityUpdate(e.target.value as any);
                    e.target.value = '';
                  }
                }}
                className="text-[11px] bg-white border border-slate-250 py-1 px-2.5 rounded font-bold text-slate-650"
              >
                <option value="">Set Priority...</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium font-bold">Medium</option>
                <option value="Low">Low</option>
              </select>

              {/* Delete selected */}
              <button
                onClick={handleDeleteSelected}
                className="text-[11px] font-bold text-white bg-rose-600 hover:bg-rose-700 px-3 py-1 rounded transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Delete Batch</span>
              </button>
            </div>
          </motion.div>
        )}

      </div>


      {/* RENDER DYNAMIC COLLAPSIBLE GROUPS (To-Do, Completed, and Custom Groups) */}
      <div className="space-y-8">
        {customGroups.map((group) => {
          // Filter tasks belonging to current workflow group category key
          const groupTasks = filteredTasks.filter(t => {
            // Default mappings if groupName not set
            if (!t.groupName) {
              const mappedSt = getMondayStatus(t.status);
              if (group.name === 'Completed') return mappedSt === 'Done';
              return mappedSt !== 'Done';
            }
            return t.groupName === group.name;
          });

          const isCollapsed = collapsedGroups.has(group.name);
          const hasTasks = groupTasks.length > 0;

          return (
            <div key={group.name} className="relative select-none">
              
              {/* Group Category Header Ribbon */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {/* Expand/Collapse Toggle */}
                  <button 
                    onClick={() => handleToggleGroupCollapse(group.name)}
                    className="p-1 hover:bg-slate-100 rounded text-slate-500 cursor-pointer"
                  >
                    {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  <h4 
                    className="text-base font-black tracking-tight" 
                    style={{ color: group.color }}
                  >
                    {group.name}
                  </h4>

                  <span className="text-[11px] text-slate-400 font-mono font-bold bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">
                    {groupTasks.length} {groupTasks.length === 1 ? 'task' : 'tasks'}
                  </span>

                  {/* Option to delete group if custom */}
                  {group.name !== 'To-Do' && group.name !== 'Completed' && (
                    <button 
                      onClick={() => handleDeleteGroup(group.name)}
                      className="text-[10px] text-rose-500 hover:text-rose-700 font-black ml-2"
                      title="Delete category"
                    >
                      (Delete Group)
                    </button>
                  )}
                </div>

                <div className="text-xs text-slate-400 font-medium">
                  {group.name === 'To-Do' && <span className="text-blue-500 font-semibold font-mono">Operations Pipeline</span>}
                  {group.name === 'Completed' && <span className="text-green-500 font-semibold font-mono">Archived Achievements</span>}
                </div>
              </div>

              {/* COLLAPSIBLE SPREADSHEET CARD */}
              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-x-auto border border-slate-150 rounded-xl bg-white shadow-3xs overflow-hidden"
                  >
                    <table className="w-full text-left border-collapse table-fixed min-w-[1000px]">
                      
                      {/* TABLE COL HEADERS */}
                      <thead>
                        <tr className="bg-slate-50 text-[11px] font-extrabold uppercase text-slate-400 tracking-wider border-b border-slate-100 select-none">
                          <th className="w-[45px] px-3 py-2.5 text-center">
                            <input 
                              type="checkbox" 
                              checked={hasTasks && groupTasks.every(t => selectedTasks.has(t.id))}
                              onChange={() => handleToggleSelectAll(groupTasks)}
                              className="rounded border-slate-250 text-blue-600 focus:ring-0 focus:ring-offset-0 cursor-pointer w-3.5 h-3.5"
                            />
                          </th>
                          <th className="w-[30%] px-4 py-2.5">Task Title</th>
                          <th className="w-[12%] px-3 py-2.5 text-center">Owner</th>
                          <th className="w-[14%] px-3 py-2.5 text-center">Status</th>
                          <th className="w-[11%] px-3 py-2.5 text-center">Due date</th>
                          <th className="w-[14%] px-3 py-2.5 text-center">Timeline</th>
                          <th className="w-[10%] px-3 py-2.5 text-center">Files</th>
                          <th className="w-[15%] px-3 py-2.5 text-center">Notes</th>
                          <th className="w-[12%] px-3 py-2.5 text-center">Priority</th>
                          <th className="w-[60px] px-2 py-2.5 text-center"></th>
                        </tr>
                      </thead>

                      {/* TABLE ROWS */}
                      <tbody className="divide-y divide-slate-100 text-xs font-semibold select-none">
                        
                        {groupTasks.map((task) => {
                          const isTaskSelected = selectedTasks.has(task.id);
                          const activeDropdownForThisTask = activeDropdown?.taskId === task.id ? activeDropdown.type : null;

                          return (
                            <tr 
                              key={task.id}
                              className={`hover:bg-slate-50/50 transition-colors ${isTaskSelected ? 'bg-blue-50/20' : ''}`}
                            >
                              
                              {/* Cell: Checkbox Selector & Left Group Color bar */}
                              <td className="px-3 py-2 text-center relative">
                                <div 
                                  className="absolute left-0 top-0 bottom-0 w-[5px]" 
                                  style={{ backgroundColor: group.color }}
                                />
                                <input 
                                  type="checkbox" 
                                  checked={isTaskSelected}
                                  onChange={() => handleToggleSelectTask(task.id)}
                                  className="rounded border-slate-250 text-blue-600 focus:ring-0 focus:ring-offset-0 cursor-pointer w-3.5 h-3.5"
                                />
                              </td>

                              {/* Cell: Task Title with description balloon */}
                              <td className="px-4 py-2 text-slate-750 font-bold select-text relative group">
                                <div className="flex items-center gap-2">
                                  {editingCell?.taskId === task.id && editingCell?.field === 'title' ? (
                                    <input 
                                      type="text"
                                      value={editingValue}
                                      onChange={(e) => setEditingValue(e.target.value)}
                                      onBlur={handleCommitEditingCell}
                                      onKeyDown={handleKeyDownEditingCell}
                                      className="w-full bg-white border border-blue-500 rounded px-1.5 py-0.5 text-xs font-bold text-slate-800"
                                      autoFocus
                                    />
                                  ) : (
                                    <>
                                      <span 
                                        onClick={() => handleStartEditingCell(task.id, 'title', task.title)}
                                        className="hover:underline cursor-pointer break-words max-w-[90%]"
                                        title="Click to rename task"
                                      >
                                        {task.title}
                                      </span>
                                      
                                      {/* Message description bubble icon */}
                                      <button 
                                        onClick={() => setActiveDetailTask(task)}
                                        className="p-1 text-slate-350 hover:text-slate-600 rounded hover:bg-slate-100 block opacity-0 group-hover:opacity-100 transition-opacity"
                                        title="Open Description & Details"
                                      >
                                        <MessageSquare className="w-3.5 h-3.5" />
                                      </button>
                                    </>
                                  )}
                                </div>
                              </td>

                              {/* Cell: Owner (Assignee) list dialog */}
                              <td className="px-3 py-2 text-center relative">
                                <div className="flex justify-center">
                                  <button
                                    onClick={() => setActiveDropdown(
                                      activeDropdown?.taskId === task.id && activeDropdown.type === 'owner' 
                                        ? null 
                                        : { taskId: task.id, type: 'owner' }
                                    )}
                                    className="flex items-center gap-1.5 p-1 rounded-full hover:bg-slate-100 transition-all cursor-pointer"
                                    title="Click to assign staff"
                                  >
                                    <img 
                                      src={task.assignedToAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face'} 
                                      alt={task.assignedTo} 
                                      className="w-6.5 h-6.5 rounded-full object-cover ring-1 ring-slate-200"
                                    />
                                  </button>
                                </div>

                                {activeDropdownForThisTask === 'owner' && (
                                  <div className="absolute z-30 left-1/2 -translate-x-1/2 mt-1.5 w-48 bg-white border border-slate-200 rounded-xl shadow-lg p-1 text-left max-h-56 overflow-y-auto">
                                    <p className="px-2.5 py-1 text-[9px] font-bold text-slate-400 uppercase select-none">Assign Team Member</p>
                                    {employeesList.map(emp => (
                                      <button
                                        key={emp.name}
                                        onClick={() => {
                                          onUpdateTask(task.id, { 
                                            assignedTo: emp.name, 
                                            assignedToAvatar: emp.avatar,
                                            department: emp.department 
                                          });
                                          setActiveDropdown(null);
                                        }}
                                        className="w-full flex items-center gap-2.5 px-3 py-1.5 text-left text-xs font-semibold hover:bg-slate-50 text-slate-705 rounded-lg"
                                      >
                                        <img src={emp.avatar} alt={emp.name} className="w-5 h-5 rounded-full object-cover" />
                                        <div className="truncate">
                                          <p className="truncate font-bold text-[11px]">{emp.name}</p>
                                          <p className="text-[9px] text-slate-400 font-medium truncate">{emp.department}</p>
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </td>

                              {/* Cell: Status Colored clickable block rendering */}
                              <td className="px-2 py-2 text-center relative font-bold text-xs select-none">
                                <button
                                  onClick={() => setActiveDropdown(
                                    activeDropdown?.taskId === task.id && activeDropdown.type === 'status' 
                                      ? null 
                                      : { taskId: task.id, type: 'status' }
                                  )}
                                  className={`w-full py-2 rounded font-extrabold text-[11px] block transition-all capitalize shadow-4xs ${getStatusBgColor(task.status)} outline-none cursor-pointer`}
                                >
                                  {getMondayStatus(task.status)}
                                </button>

                                {activeDropdownForThisTask === 'status' && (
                                  <div className="absolute z-30 left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 grid grid-cols-1 gap-1">
                                    {/* Mapped choice colors directly mimicking monday.com */}
                                    <button
                                      onClick={() => {
                                        onUpdateTask(task.id, { status: 'Done', progress: 100, groupName: 'Completed' });
                                        setActiveDropdown(null);
                                      }}
                                      className="py-1.5 rounded text-center text-[10px] font-black tracking-wider text-white bg-[#00c875] hover:opacity-90"
                                    >
                                      Done
                                    </button>
                                    <button
                                      onClick={() => {
                                        onUpdateTask(task.id, { status: 'Working on it', progress: 50, groupName: 'To-Do' });
                                        setActiveDropdown(null);
                                      }}
                                      className="py-1.5 rounded text-center text-[10px] font-black tracking-wider text-white bg-[#fdab3d] hover:opacity-90"
                                    >
                                      Working on it
                                    </button>
                                    <button
                                      onClick={() => {
                                        onUpdateTask(task.id, { status: 'Stuck', groupName: 'To-Do' });
                                        setActiveDropdown(null);
                                      }}
                                      className="py-1.5 rounded text-center text-[10px] font-black tracking-wider text-white bg-[#df2f4a] hover:opacity-90"
                                    >
                                      Stuck
                                    </button>
                                    <button
                                      onClick={() => {
                                        onUpdateTask(task.id, { status: 'Not Started', progress: 0, groupName: 'To-Do' });
                                        setActiveDropdown(null);
                                      }}
                                      className="py-1.5 rounded text-center text-[10px] font-black tracking-wider text-white bg-[#c4c4c4] hover:opacity-90"
                                    >
                                      Not Started
                                    </button>
                                  </div>
                                )}
                              </td>

                              {/* Cell: Due Date (clickable formatted string or datepicker) */}
                              <td className="px-3 py-2 text-center relative text-slate-550 font-bold select-none">
                                {editingCell?.taskId === task.id && editingCell?.field === 'dueDate' ? (
                                  <input 
                                    type="date"
                                    value={editingValue}
                                    onChange={(e) => setEditingValue(e.target.value)}
                                    onBlur={handleCommitEditingCell}
                                    onKeyDown={handleKeyDownEditingCell}
                                    className="bg-white border rounded font-mono p-0.5 text-[10px] text-slate-700 w-full"
                                    autoFocus
                                  />
                                ) : (
                                  <span 
                                    onClick={() => handleStartEditingCell(task.id, 'dueDate', task.dueDate)}
                                    className="cursor-pointer hover:bg-slate-100 rounded px-1.5 py-0.5 inline-block text-[11px]"
                                    title="Click to edit date"
                                  >
                                    {new Date(task.dueDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                  </span>
                                )}
                              </td>

                              {/* Cell: Timeline visual block */}
                              <td className="px-3 py-2 text-center relative select-none">
                                {editingCell?.taskId === task.id && editingCell?.field === 'timeline' ? (
                                  <input 
                                    type="text"
                                    value={editingValue}
                                    onChange={(e) => setEditingValue(e.target.value)}
                                    onBlur={handleCommitEditingCell}
                                    onKeyDown={handleKeyDownEditingCell}
                                    placeholder="e.g. May 27 - 28"
                                    className="w-full bg-white border rounded px-1.5 py-0.5 text-[10px] text-center"
                                    autoFocus
                                  />
                                ) : (
                                  <div 
                                    onClick={() => handleStartEditingCell(task.id, 'timeline', task.timeline || 'May 27 - 28')}
                                    className="mx-auto max-w-[120px] rounded-full text-[10px] font-black text-white px-2 py-0.5 shadow-4xs cursor-pointer select-none text-center transition-all bg-[#2f80ed] hover:bg-[#1a6ed2]"
                                  >
                                    {task.timeline || 'Configure'}
                                  </div>
                                )}
                              </td>

                              {/* Cell: Files with upload indicators */}
                              <td className="px-3 py-2 text-center text-slate-400 relative select-none">
                                {task.files ? (
                                  <div className="inline-flex items-center gap-1.5 justify-center bg-blue-50 text-[#0086c0] px-2 py-1 rounded border border-blue-100/50">
                                    <FileText className="w-3.5 h-3.5 shrink-0" />
                                    <span 
                                      className="text-[9px] font-extrabold truncate max-w-[65px] hover:underline cursor-pointer"
                                      onClick={() => alert(`Reviewing file deliverable: ${task.files}`)}
                                      title={task.files}
                                    >
                                      {task.files}
                                    </span>
                                    <button 
                                      onClick={() => onUpdateTask(task.id, { files: '' })} 
                                      className="text-red-500 hover:text-red-700 text-[8px] font-bold"
                                      title="Remove attachment"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => {
                                      const filename = window.prompt("Upload a simulation document name:", "DeliverableSpecs.pdf");
                                      if (filename) {
                                        onUpdateTask(task.id, { files: filename });
                                      }
                                    }}
                                    className="p-1 hover:bg-slate-100 rounded inline-flex text-slate-350 hover:text-blue-500 cursor-pointer"
                                    title="Attach File deliverable"
                                  >
                                    <Paperclip className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </td>

                              {/* Cell: Notes text inline editable */}
                              <td className="px-3 py-2 text-slate-500 select-text font-medium text-[11px] relative">
                                {editingCell?.taskId === task.id && editingCell?.field === 'notesText' ? (
                                  <input 
                                    type="text"
                                    value={editingValue}
                                    onChange={(e) => setEditingValue(e.target.value)}
                                    onBlur={handleCommitEditingCell}
                                    onKeyDown={handleKeyDownEditingCell}
                                    className="w-full bg-white border border-blue-500 rounded px-1.5 py-0.5 text-xs text-slate-800"
                                    autoFocus
                                  />
                                ) : (
                                  <p 
                                    onClick={() => handleStartEditingCell(task.id, 'notesText', task.notesText || '')}
                                    className="hover:bg-slate-50 rounded px-1 py-0.5 cursor-pointer italic truncate max-w-[130px]"
                                    title="Click to write inline notes"
                                  >
                                    {task.notesText || <span className="text-slate-300">Click to write notes...</span>}
                                  </p>
                                )}
                              </td>

                              {/* Cell: Priority clickable colors */}
                              <td className="px-2 py-2 text-center relative">
                                <button
                                  onClick={() => setActiveDropdown(
                                    activeDropdown?.taskId === task.id && activeDropdown.type === 'priority' 
                                      ? null 
                                      : { taskId: task.id, type: 'priority' }
                                  )}
                                  className={`w-full py-2 rounded font-extrabold text-[10px] tracking-wider uppercase block shadow-4xs outline-none cursor-pointer ${getPriorityBgColor(task.priority)}`}
                                >
                                  {task.priority || 'Low'}
                                </button>

                                {activeDropdownForThisTask === 'priority' && (
                                  <div className="absolute z-30 left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl p-1.5 grid grid-cols-1 gap-1 text-left select-none">
                                    <button
                                      onClick={() => {
                                        onUpdateTask(task.id, { priority: 'Critical' });
                                        setActiveDropdown(null);
                                      }}
                                      className="py-1 rounded text-center text-[9px] font-black uppercase text-white bg-[#e44b61] hover:opacity-95"
                                    >
                                      Critical
                                    </button>
                                    <button
                                      onClick={() => {
                                        onUpdateTask(task.id, { priority: 'High' });
                                        setActiveDropdown(null);
                                      }}
                                      className="py-1 rounded text-center text-[9px] font-black uppercase text-white bg-[#401b9c] hover:opacity-95"
                                    >
                                      High
                                    </button>
                                    <button
                                      onClick={() => {
                                        onUpdateTask(task.id, { priority: 'Medium' });
                                        setActiveDropdown(null);
                                      }}
                                      className="py-1 rounded text-center text-[9px] font-black uppercase text-white bg-[#5559df] hover:opacity-95"
                                    >
                                      Medium
                                    </button>
                                    <button
                                      onClick={() => {
                                        onUpdateTask(task.id, { priority: 'Low' });
                                        setActiveDropdown(null);
                                      }}
                                      className="py-1 rounded text-center text-[9px] font-black uppercase text-white bg-[#579bfc] hover:opacity-95"
                                    >
                                      Low
                                    </button>
                                  </div>
                                )}
                              </td>

                              {/* Row action delete */}
                              <td className="px-1 py-2 text-center">
                                <button
                                  onClick={() => {
                                    if (window.confirm("Delete this individual task record?")) {
                                      onDeleteTask(task.id);
                                      setNotifyMessage("Task deleted.");
                                    }
                                  }}
                                  className="p-1 text-slate-350 hover:text-red-500 rounded hover:bg-rose-50 cursor-pointer"
                                  title="Delete individual Task"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>

                            </tr>
                          );
                        })}

                        {/* ROW: CONVENIENT INLINE ADD TASK FOR THIS GROUP */}
                        {true && (
                          <tr>
                            <td className="px-3 py-2.5 text-center relative">
                              <div 
                                className="absolute left-0 top-0 bottom-0 w-[5px]" 
                                style={{ backgroundColor: group.color }}
                              />
                              <div className="w-3.5 h-3.5 rounded border border-dashed border-slate-300 mx-auto" />
                            </td>
                            
                            <td className="px-4 py-2 gap-2 text-left" colSpan={8}>
                              {isAddingTaskGroup === group.name ? (
                                <div className="flex items-center gap-2">
                                  <input 
                                    type="text"
                                    placeholder="Enter task name... Press Enter or click check"
                                    value={isAddingTaskInlineName}
                                    onChange={(e) => setIsAddingTaskInlineName(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') handleAddNewTaskToGroup(group.name);
                                      else if (e.key === 'Escape') setIsAddingTaskGroup(null);
                                    }}
                                    className="flex-1 bg-white border border-blue-500 rounded-lg px-3 py-1.5 text-xs text-slate-850 focus:outline-none"
                                    autoFocus
                                  />
                                  <button 
                                    onClick={() => handleAddNewTaskToGroup(group.name)}
                                    className="px-2.5 py-1.5 bg-[#0086c0] hover:bg-[#0073a5] text-white rounded-lg text-xs font-black inline-flex items-center gap-0.5 cursor-pointer"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Add</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      setIsAddingTaskGroup(null);
                                      setIsAddingTaskInlineName('');
                                    }}
                                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setIsAddingTaskGroup(group.name)}
                                  className="text-slate-400 hover:text-[#0086c0] font-bold text-xs inline-flex items-center gap-1.5 w-full text-left py-1"
                                >
                                  <Plus className="w-3.5 h-3.5 text-[#0086c0]" />
                                  <span>+ Add task inside {group.name}...</span>
                                </button>
                              )}
                            </td>
                            <td></td>
                          </tr>
                        )}

                        {/* EMPTY PLACEHOLDER ROW IF NO TASKS IN FILTER */}
                        {groupTasks.length === 0 && (
                          <tr>
                            <td colSpan={10} className="px-4 py-8 text-center text-slate-400 font-bold select-none italic text-xs bg-slate-50/20">
                              No tasks matched current filters in this category.
                            </td>
                          </tr>
                        )}

                      </tbody>
                    </table>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          );
        })}
      </div>

      {/* MODAL: TASK DESCRIPTION / SYSTEM DETAIL PANEL */}
      <AnimatePresence>
        {activeDetailTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-lg p-6 md:p-8 relative max-h-[90vh] overflow-y-auto"
            >
              <div className="absolute right-4 top-4">
                <button 
                  onClick={() => setActiveDetailTask(null)}
                  className="p-1 px-2.5 bg-slate-50 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 text-xs font-extrabold"
                >
                  ✕
                </button>
              </div>

              <div className="mb-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-650 flex items-center justify-center shrink-0">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-blue-600 text-base">{activeDetailTask.title}</h3>
                  <p className="text-[10px] text-slate-400 font-bold">Metadata Profile Overview & Analytics</p>
                </div>
              </div>

              <div className="space-y-4 text-xs font-semibold">
                
                {/* Description info */}
                <div className="p-4 bg-slate-50/50 rounded-xl border border-slate-100 border-dashed">
                  <span className="block text-[10px] font-black text-slate-400 uppercase mb-1">Detailed Description</span>
                  <p className="text-slate-600 leading-relaxed font-semibold font-sans italic">
                    "{activeDetailTask.description || 'No detailed objectives declared yet. Utilize the workspace inline editing grid to make updates.'}"
                  </p>
                </div>

                {/* Grid details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-[10px] font-black text-slate-400 uppercase mb-1">Status Category</span>
                    <span className={`inline-block px-3 py-1 rounded-full font-extrabold ${getStatusBgColor(activeDetailTask.status)}`}>
                      {getMondayStatus(activeDetailTask.status)}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-black text-slate-400 uppercase mb-1">Task Priority</span>
                    <span className={`inline-block px-3 py-1 rounded-full font-extrabold ${getPriorityBgColor(activeDetailTask.priority)}`}>
                      {activeDetailTask.priority}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-[10px] font-black text-slate-400 uppercase mb-1">Process Department</span>
                    <span className="text-slate-700 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded font-bold inline-block">
                      {activeDetailTask.department || 'R&D'}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] font-black text-slate-400 uppercase mb-1">Staged Progression ({activeDetailTask.progress}%)</span>
                    <div className="w-full h-2 bg-slate-50 border rounded-full overflow-hidden mt-1 md:mt-2">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${activeDetailTask.progress}%` }} />
                    </div>
                  </div>
                </div>

                {/* Team member row */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img 
                      src={activeDetailTask.assignedToAvatar} 
                      alt={activeDetailTask.assignedTo} 
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-white"
                    />
                    <div>
                      <span className="block text-[9px] font-black text-slate-400 uppercase">Assigned Executive</span>
                      <p className="text-xs font-black text-slate-800">{activeDetailTask.assignedTo}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="block text-[9px] font-black text-slate-400 uppercase">Target Due date</span>
                    <span className="text-xs font-mono font-bold text-slate-700">{activeDetailTask.dueDate}</span>
                  </div>
                </div>

                {/* File attachments */}
                {activeDetailTask.files ? (
                  <div className="p-3 bg-blue-50 text-blue-800 rounded-xl border border-blue-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Paperclip className="w-4 h-4" />
                      <span>{activeDetailTask.files}</span>
                    </div>
                    <span className="text-[10px] font-mono text-blue-500 font-bold uppercase">Linked document</span>
                  </div>
                ) : null}

              </div>

              <div className="pt-6 border-t border-slate-100 mt-6 flex justify-end gap-3.5">
                {true && (
                  <button
                    onClick={() => {
                      if (window.confirm("Fully delete this task record?")) {
                        onDeleteTask(activeDetailTask.id);
                        setActiveDetailTask(null);
                        setNotifyMessage("Task deleted.");
                      }
                    }}
                    className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Record</span>
                  </button>
                )}
                <button
                  onClick={() => setActiveDetailTask(null)}
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 font-bold text-white text-xs cursor-pointer shadow"
                >
                  Confirm review
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
