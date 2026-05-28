import { useState, useEffect } from 'react';
import { INITIAL_TASKS } from './data';
import { EmployeeTask } from './types';

// Importing sub components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LoginPage from './components/LoginPage';

// Importing custom section pages
import DashboardSection from './components/DashboardSection';
import TimesheetSection from './components/TimesheetSection';
import ProjectsSection from './components/ProjectsSection';
import TaskManagerSection from './components/TaskManagerSection';
import ReportsSection from './components/ReportsSection';
import TeamSection from './components/TeamSection';

export default function App() {
  // Global Workspace State
  const [tasks, setTasks] = useState<EmployeeTask[]>(INITIAL_TASKS);

  // Authentication & Session state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [sessionTime, setSessionTime] = useState<number>(0);

  // Active state management
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Employee Metadata Lookup
  const employeesList = [
    { name: 'Sophia Alexandra', role: 'Lead UX Architect', department: 'Product Design', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face' },
    { name: 'Marcus Sterling', role: 'Enterprise Sales Manager', department: 'Operations', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face' },
    { name: 'Emma Watson', role: 'Junior HR Analyst', department: 'Human Resources', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face' },
    { name: 'Liam Neeson', role: 'Senior R&D Architect', department: 'R&D', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face' },
    { name: 'Rian Wijaya', role: 'Frontend Engineer', department: 'R&D', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' },
    { name: 'Clara Mentari', role: 'Support Representative', department: 'Customer Service', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face' },
    { name: 'David Beckham', role: 'Brand Outreach Lead', department: 'Marketing', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' }
  ];

  // User Profile configuration
  const [userProfile, setUserProfile] = useState({
    name: 'Alex Morgan',
    role: 'Employee',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  });

  // Track session timer
  useEffect(() => {
    let interval: any = null;
    if (isLoggedIn) {
      interval = setInterval(() => {
        setSessionTime((prev) => prev + 1);
      }, 1000);
    } else {
      setSessionTime(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoggedIn]);

  // Login handler
  const handleLogin = (employee: { name: string; role: string; avatar: string }) => {
    setUserProfile(employee);
    setIsLoggedIn(true);
    setSessionTime(0);
  };

  // Clock Out handler
  const handleClockOut = () => {
    setIsLoggedIn(false);
    setSessionTime(0);
  };

  // Task Actions
  const handleUpdateTaskStatus = (taskId: string, newStatus: EmployeeTask['status']) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  const handleUpdateTask = (taskId: string, updatedFields: Partial<EmployeeTask>) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updated = { ...t, ...updatedFields };
          if (updatedFields.status === 'Done' || updatedFields.status === 'Completed') {
            updated.progress = 100;
          }
          return updated;
        }
        return t;
      })
    );
  };

  const handleUpdateTaskProgress = (taskId: string, newProgress: number) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updated = { ...t, progress: newProgress };
          if (newProgress === 100) {
            updated.status = 'Done';
            updated.completedAt = new Date().toISOString().split('T')[0];
          } else if (newProgress > 0 && (t.status === 'Done' || t.status === 'Completed')) {
            updated.status = 'Working on it';
          }
          return updated;
        }
        return t;
      })
    );
  };

  const handleAddTask = (newTask: Omit<EmployeeTask, 'id'>) => {
    const fresh: EmployeeTask = {
      ...newTask,
      id: `task-${Date.now()}`
    };
    setTasks((prev) => [...prev, fresh]);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleUpdateUserProfile = (name: string, role: string) => {
    setUserProfile((prev) => ({ ...prev, name, role }));
  };

  // Render Login Page if not signed in / clocked in
  if (!isLoggedIn) {
    const defaultUser = { name: 'Alex Morgan', role: 'Employee', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face' };
    return (
      <LoginPage
        onLogin={handleLogin}
        employees={[defaultUser, ...employeesList]}
      />
    );
  }

  return (
    <div className="flex h-screen bg-[#edf2f7]/55 overflow-hidden font-sans text-slate-700 antialiased">
      {/* 1. Left Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
        }}
        currentUser={userProfile}
        sessionTime={sessionTime}
        onClockOut={handleClockOut}
      />

      {/* Main Page Layout Frame */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* 2. Top-bar Header */}
        <Header
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          currentUser={userProfile}
          onUpdateUser={handleUpdateUserProfile}
          activeTab={activeTab}
        />

        {/* Dynamic content render depending on sidebar */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {(() => {
            switch (activeTab) {
              case 'dashboard':
                return (
                  <DashboardSection
                    onTabChange={setActiveTab}
                  />
                );
              case 'timesheet':
                return <TimesheetSection />;
              case 'projects':
                return <ProjectsSection />;
              case 'tasks':
                return (
                  <TaskManagerSection
                    tasks={tasks}
                    onUpdateTaskStatus={handleUpdateTaskStatus}
                    onUpdateTaskProgress={handleUpdateTaskProgress}
                    onUpdateTask={handleUpdateTask}
                    onAddTask={handleAddTask}
                    onDeleteTask={handleDeleteTask}
                    employeesList={employeesList}
                  />
                );
              case 'reports':
                return <ReportsSection />;
              case 'team':
                return <TeamSection />;
              default:
                return null;
            }
          })()}
        </main>
      </div>
    </div>
  );
}
