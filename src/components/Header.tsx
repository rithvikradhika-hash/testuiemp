import React, { useState, useRef, useEffect } from 'react';
import { Search, Settings, Bell, CircleDot, User, ArrowRight, ShieldCheck, Moon, Volume2, Globe } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentUser: { name: string; role: string; avatar: string };
  onUpdateUser: (name: string, role: string) => void;
  activeTab: string;
}

export default function Header({
  searchQuery,
  onSearchChange,
  currentUser,
  onUpdateUser,
  activeTab
}: HeaderProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const [notifications, setNotifications] = useState([
    { id: '1', title: 'Task assignment finished', message: 'Rian completed SQL latency indexing tasks.', time: '5m ago', unread: true },
    { id: '2', title: 'Leave Acknowledged', message: 'Sarah Connor approved Clara Mentari vacation request.', time: '1h ago', unread: true },
    { id: '3', title: 'Performance Updated', message: 'Marcus Sterling self-assessment uploaded.', time: '2h ago', unread: false },
  ]);

  const [sysSettings, setSysSettings] = useState({
    theme: 'Light',
    sounds: true,
    autoApprove: false,
    language: 'English (US)'
  });

  const [editName, setEditName] = useState(currentUser.name);
  const [editRole, setEditRole] = useState(currentUser.role);

  const settingsRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfile(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser(editName, editRole);
    setShowProfile(false);
  };

  const getDynamicTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard': return 'Operations Dashboard';
      case 'timesheet': return 'Employee Timesheet';
      case 'projects': return 'Projects Overview';
      case 'tasks': return 'Corporate Task Board';
      case 'reports': return 'Reports & Analytics';
      case 'team': return 'Team Overview';
      default: return 'TimeSync Workspace';
    }
  };

  return (
    <header className="flex items-center justify-between px-8 py-5 bg-[#f8fafc]/30 border-b border-slate-100 select-none">
      {/* Page Title & Breadcrumb */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold font-sans text-slate-800 tracking-tight leading-none mb-1 capitalize">
          {getDynamicTitle(activeTab)}
        </h1>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <span className="hover:text-slate-600 cursor-pointer">TimeSync</span>
          <span className="text-slate-300">/</span>
          <span className="text-slate-500 font-semibold text-[#1bc1a1] capitalize">{activeTab}</span>
        </div>
      </div>


      {/* Global Interactive Search Input */}
      <div className="flex-1 max-w-md mx-6 hidden md:block">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-[#e5e9f2] rounded-xl text-xs font-semibold text-slate-700 placeholder-slate-400 outline-hidden focus:ring-1 focus:ring-[#1bc1a1]/50 focus:border-[#1bc1a1] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Utility Actions & User Menu */}
      <div className="flex items-center gap-4">
        {/* Search toggle for responsive layout */}
        <div className="relative md:hidden">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-28 pl-7 pr-2 py-1.5 bg-white border border-[#e5e9f2] rounded-xl text-xs font-medium text-slate-700 outline-hidden focus:ring-1 focus:ring-[#1bc1a1]/30 focus:border-[#1bc1a1]"
          />
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
        </div>

        {/* Global Settings Trigger */}
        <div className="relative" ref={settingsRef}>
          <button
            onClick={() => {
              setShowSettings(!showSettings);
              setShowNotifications(false);
              setShowProfile(false);
            }}
            className={`p-2 rounded-xl border border-slate-100 bg-white shadow-xs transition-all relative ${
              showSettings ? 'text-[#1bc1a1] border-[#1bc1a1]/20' : 'text-[#64748b] hover:text-[#1bc1a1] hover:bg-slate-50'
            }`}
          >
            <Settings className="w-5 h-5" />
          </button>

          {/* Settings Panel Popover */}
          {showSettings && (
            <div className="absolute right-0 mt-2.5 w-64 bg-white border border-slate-100 rounded-2xl shadow-xl z-40 p-4 animate-in fade-in slide-in-from-top-3 duration-200">
              <h3 className="font-bold text-slate-800 text-xs mb-3 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <Settings className="w-4 h-4 text-[#1bc1a1]" />
                <span>System Preferences</span>
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Moon className="w-4 h-4 text-slate-400" />
                    <span>Dark Theme</span>
                  </div>
                  <button
                    onClick={() => setSysSettings({ ...sysSettings, theme: sysSettings.theme === 'Light' ? 'Dark' : 'Light' })}
                    className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                      sysSettings.theme === 'Dark' ? 'bg-[#1bc1a1]' : 'bg-slate-200'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-xs transition-transform transform ${
                      sysSettings.theme === 'Dark' ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-slate-400" />
                    <span>Audio Indicators</span>
                  </div>
                  <button
                    onClick={() => setSysSettings({ ...sysSettings, sounds: !sysSettings.sounds })}
                    className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer ${
                      sysSettings.sounds ? 'bg-[#1bc1a1]' : 'bg-slate-200'
                    }`}
                  >
                    <div className={`w-4 h-4 bg-white rounded-full shadow-xs transition-transform transform ${
                      sysSettings.sounds ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-slate-400" />
                    <span>Language</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100 font-bold">
                    {sysSettings.language}
                  </span>
                </div>
              </div>
              <div className="mt-4 pt-2 border-t border-slate-50 text-[10px] text-slate-400 text-center">
                Autosaving to browser memory
              </div>
            </div>
          )}
        </div>

        {/* Live Notification Indicator */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowSettings(false);
              setShowProfile(false);
            }}
            className={`p-2 rounded-xl border border-slate-100 bg-white shadow-xs transition-all relative ${
              showNotifications ? 'text-[#1bc1a1] border-[#1bc1a1]/20' : 'text-[#64748b] hover:text-[#1bc1a1] hover:bg-slate-50'
            }`}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* Notifications Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2.5 w-72 bg-white border border-slate-100 rounded-2xl shadow-xl z-40 p-4 animate-in fade-in slide-in-from-top-3 duration-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                <span className="font-bold text-slate-800 text-xs">Dynamic Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[10px] font-bold text-[#1bc1a1] hover:text-[#159d83] cursor-pointer"
                  >
                    Clear markers
                  </button>
                )}
              </div>
              <div className="space-y-2.5 max-h-60 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-2.5 rounded-xl border text-xs transition-colors ${
                      notif.unread
                        ? 'bg-[#defff7]/30 border-[#1bc1a1]/10 text-slate-700'
                        : 'bg-white border-slate-100 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-[11px] text-slate-800 g-1 mb-0.5">
                      <span className="flex items-center gap-1.5">
                        {notif.unread && <CircleDot className="w-2 h-2 text-[#1bc1a1] fill-current" />}
                        {notif.title}
                      </span>
                      <span className="text-[9px] font-normal text-slate-400">{notif.time}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-slate-500">{notif.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-slate-200/60" />

        {/* User Profile Avatar block */}
        <div className="relative" ref={profileRef}>
          <div
            onClick={() => {
              setShowProfile(!showProfile);
              setShowSettings(false);
              setShowNotifications(false);
            }}
            className="flex items-center gap-3 cursor-pointer group hover:bg-slate-50 p-1.5 pl-2 rounded-2xl transition-all border border-transparent hover:border-slate-100"
          >
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-800 tracking-tight leading-none mb-1 group-hover:text-[#1bc1a1]">
                {currentUser.name}
              </p>
              <p className="text-[10px] font-medium text-slate-400 leading-none">{currentUser.role}</p>
            </div>
            <img
              src={currentUser.avatar}
              alt="User face"
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-xl border-1.5 border-white ring-2 ring-[#1bc1a1]/10 object-cover"
            />
          </div>

          {/* Profile Quick Edit Modal Popup */}
          {showProfile && (
            <div className="absolute right-0 mt-2.5 w-64 bg-white border border-slate-100 rounded-2xl shadow-xl z-40 p-4 animate-in fade-in slide-in-from-top-3 duration-200">
              <div className="flex flex-col items-center text-center gap-1.5 pb-3 border-b border-slate-100 mb-3">
                <img
                  src={currentUser.avatar}
                  alt="Current Avatar"
                  className="w-12 h-12 rounded-full border-2 border-[#1bc1a1] object-cover"
                />
                <h4 className="font-bold text-slate-800 text-xs">{currentUser.name}</h4>
                <p className="text-[10px] font-mono text-slate-400">{currentUser.role} Control Panel</p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full text-xs font-semibold px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-[#1bc1a1] bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Department Role
                  </label>
                  <input
                    type="text"
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full text-xs font-semibold px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg outline-hidden focus:border-[#1bc1a1] bg-white transition-colors"
                  />
                </div>
                <div className="flex gap-2 pt-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setEditName(currentUser.name);
                      setEditRole(currentUser.role);
                      setShowProfile(false);
                    }}
                    className="flex-1 text-center py-1.5 rounded-lg text-[10px] font-bold text-slate-500 hover:bg-slate-50 border border-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 text-center py-1.5 rounded-lg text-[10px] bg-[#1bc1a1] hover:bg-[#159d83] text-white font-bold inline-flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>Save Changes</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
