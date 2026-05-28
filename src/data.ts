import { Applicant, Vacancy, ScheduleEvent, EmployeeTask } from './types';

export const INITIAL_VACANCIES: Vacancy[] = [
  {
    id: 'vac-1',
    title: 'UI Designer',
    type: 'Full-Time',
    location: 'Remote',
    applicantsCount: 18,
  },
  {
    id: 'vac-2',
    title: 'Sales Manager',
    type: 'Full-Time',
    location: 'On-Site',
    applicantsCount: 15,
  },
  {
    id: 'vac-3',
    title: 'HR Assistant',
    type: 'Internship',
    location: 'On-Site',
    applicantsCount: 10,
  },
  {
    id: 'vac-4',
    title: 'Data Analyst',
    type: 'Full-Time',
    location: 'Hybrid',
    applicantsCount: 22,
  },
];

export const INITIAL_APPLICANTS: Applicant[] = [
  {
    id: 'app-1',
    name: 'William Hartono',
    email: 'william.hartono@email.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    jobTitle: 'UI Designer',
    appliedDate: '2035-06-15',
    type: 'Full-Time',
    location: 'Remote',
    stage: 'Interview Scheduled',
    stageProgress: 3,
    rating: 4,
    phone: '+62 812-3456-7890',
    portfolioUrl: 'https://behance.net/willhartono',
    coverLetter: 'I am an interaction designer with over 4 years of experience crafting interfaces that solve complex user experience challenges.',
    notes: [
      { id: 'n-1', author: 'Davis Levin', text: 'Portfolio looks extremely strong, clean typograhy and attention to grid details.', date: '2035-06-16 09:30' },
      { id: 'n-2', author: 'Sarah Connor', text: 'Spoke with him during pre-screening. Fits culture perfectly.', date: '2035-06-17 11:15' }
    ]
  },
  {
    id: 'app-2',
    name: 'Fanny Rizal',
    email: 'fanny.rizal@email.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
    jobTitle: 'Sales Manager',
    appliedDate: '2035-06-12',
    type: 'Full-Time',
    location: 'On-Site',
    stage: 'Final Interview',
    stageProgress: 4,
    rating: 5,
    phone: '+62 821-9876-5432',
    portfolioUrl: 'https://linkedin.com/in/fannyrizal',
    coverLetter: 'Results-driven Sales Manager with a 7-year track record of driving multi-million dollar ARR expansions in the high-growth SaaS ecosystem.',
    notes: [
      { id: 'n-3', author: 'Davis Levin', text: 'Proven records of closing Enterprise-grade contracts. Expresses fantastic leadership potential.', date: '2035-06-14 14:00' }
    ]
  },
  {
    id: 'app-3',
    name: 'Lala Wijaya',
    email: 'lala.wijaya@email.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
    jobTitle: 'Data Analyst',
    appliedDate: '2035-06-14',
    type: 'Full-Time',
    location: 'Hybrid',
    stage: 'Test Completed',
    stageProgress: 5,
    rating: 4,
    phone: '+62 819-1111-2222',
    portfolioUrl: 'https://github.com/lalawijaya',
    coverLetter: 'Experienced data wrangler interested in extracting actionable intelligence from massive, unstructured user datasets to support recruitment optimization.',
    notes: [
      { id: 'n-4', author: 'Sarah Connor', text: 'Scored 98/100 on our technical evaluation. Strong SQL and Python proficiency.', date: '2035-06-15 10:00' }
    ]
  },
  {
    id: 'app-4',
    name: 'Arifin Maulana',
    email: 'arifin.maulana@email.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    jobTitle: 'Customer Support',
    appliedDate: '2035-06-13',
    type: 'Full-Time',
    location: 'On-Site',
    stage: 'Interview Scheduled',
    stageProgress: 3,
    rating: 3,
    phone: '+62 857-4444-5555',
    portfolioUrl: '',
    coverLetter: 'Empathic customer care specialist with 2 years of experience handling chat and phone communication channels under high-intensity environments.',
    notes: [
      { id: 'n-5', author: 'Davis Levin', text: 'A bit junior, but has extremely positive attitude and clear vocal communication skills.', date: '2035-06-14 16:30' }
    ]
  },
  {
    id: 'app-5',
    name: 'Clara Mentari',
    email: 'clara.mentari@email.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    jobTitle: 'HR Assistant',
    appliedDate: '2035-06-10',
    type: 'Internship',
    location: 'On-Site',
    stage: 'Application Received',
    stageProgress: 1,
    rating: 3,
    phone: '+62 813-8888-9999',
    portfolioUrl: '',
    coverLetter: 'Psychology senior seeking to apply academic research, active listening skills, and HR operational principles in a full-time internship scenario.',
    notes: []
  },
  {
    id: 'app-6',
    name: 'Rian Kusuma',
    email: 'rian.kusuma@email.com',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face',
    jobTitle: 'UI Designer',
    appliedDate: '2035-06-16',
    type: 'Full-Time',
    location: 'Remote',
    stage: 'Application Received',
    stageProgress: 1,
    rating: 4,
    phone: '+62 812-7890-1234',
    portfolioUrl: 'https://behance.net/riankusuma',
    coverLetter: 'Passionate UI Designer interested in creating dark-mode layouts, accessible components, and micro-interactions for modern web platforms.',
    notes: []
  },
  {
    id: 'app-7',
    name: 'Sarah Amalia',
    email: 'sarah.amalia@email.com',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&h=150&fit=crop&crop=face',
    jobTitle: 'Data Analyst',
    appliedDate: '2035-06-18',
    type: 'Full-Time',
    location: 'Hybrid',
    stage: 'Interview Scheduled',
    stageProgress: 3,
    rating: 5,
    phone: '+62 811-2222-3333',
    portfolioUrl: '',
    coverLetter: 'Statistical modeling wizard focusing on conversion rate optimization, lead attribution, and predictive modeling for business intelligence.',
    notes: [
      { id: 'n-6', author: 'Sarah Connor', text: 'Impressive mathematical background, holding an MSc in Statistics.', date: '2035-06-19 15:40' }
    ]
  },
];

export const INITIAL_SCHEDULES: ScheduleEvent[] = [
  {
    id: 'sch-1',
    time: '09:45 AM',
    title: 'Online Test Review',
    date: '2035-06-20',
    candidateName: 'Lala Wijaya',
    candidateRole: 'Data Analyst',
  },
  {
    id: 'sch-2',
    time: '01:00 PM',
    title: 'First Interview',
    date: '2035-06-20',
    candidateName: 'William Hartono',
    candidateRole: 'UI Designer',
  },
  {
    id: 'sch-3',
    time: '02:30 PM',
    title: 'HR Interview',
    date: '2035-06-20',
    candidateName: 'Arifin Maulana',
    candidateRole: 'Customer Support',
  },
  {
    id: 'sch-4',
    time: '03:10 PM',
    title: 'Final Interview',
    date: '2035-06-20',
    candidateName: 'Fanny Rizal',
    candidateRole: 'Sales Manager',
  },
  {
    id: 'sch-5',
    time: '11:00 AM',
    title: 'Pre-screening Chat',
    date: '2035-06-21',
    candidateName: 'Rian Kusuma',
    candidateRole: 'UI Designer',
  },
  {
    id: 'sch-6',
    time: '02:00 PM',
    title: 'Technical Interview',
    date: '2035-06-21',
    candidateName: 'Sarah Amalia',
    candidateRole: 'Data Analyst',
  },
  {
    id: 'sch-7',
    time: '10:30 AM',
    title: 'Introductory Sync',
    date: '2035-06-18',
    candidateName: 'Clara Mentari',
    candidateRole: 'HR Assistant',
  }
];

export const DEPARTMENTS = [
  { name: 'Human Resources', count: 19 },
  { name: 'Marketing', count: 27 },
  { name: 'Product Design', count: 31 },
  { name: 'R&D', count: 22 },
  { name: 'Operations', count: 28 },
  { name: 'Customer Service', count: 19 },
];

export const INITIAL_TASKS: EmployeeTask[] = [
  {
    id: 'task-1',
    title: 'Polish Core Prototypes and Mobile Sizing',
    description: 'Ensure layout fidelity across iOS and Android aspect ratios, verifying that touch targets are at least 44px.',
    assignedTo: 'Sophia Alexandra',
    assignedToAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=155&h=155&fit=crop&crop=face',
    department: 'Product Design',
    priority: 'Low',
    status: 'Working on it',
    dueDate: '2026-05-27',
    progress: 40,
    timeline: 'May 27 - 28',
    files: 'Specs.docx',
    notesText: 'Action items',
    groupName: 'To-Do',
    lastUpdated: 'Just now'
  },
  {
    id: 'task-2',
    title: 'Refactor Core CSS Modules to Tailwind Utility Standards',
    description: 'Bypass legacy styled-components overhead; refactor standard page templates to 100% utility selectors.',
    assignedTo: 'Rian Wijaya',
    assignedToAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=155&h=155&fit=crop&crop=face',
    department: 'R&D',
    priority: 'High',
    status: 'Done',
    dueDate: '2026-05-28',
    progress: 100,
    timeline: 'May 29 - 30',
    files: 'RefactorGuide.pdf',
    notesText: 'Meeting notes',
    groupName: 'To-Do',
    lastUpdated: 'Just now',
    completedAt: '2026-05-19'
  },
  {
    id: 'task-3',
    title: 'Audit Enterprise Closing Forecast Quotas',
    description: 'Formulate structural spreadsheet reports evaluating top SaaS subscription conversion ratios in the eastern region.',
    assignedTo: 'Marcus Sterling',
    assignedToAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=155&h=155&fit=crop&crop=face',
    department: 'Operations',
    priority: 'Medium',
    status: 'Stuck',
    dueDate: '2026-05-29',
    progress: 25,
    timeline: 'May 31 - Jun 1',
    files: '',
    notesText: 'Other',
    groupName: 'To-Do',
    lastUpdated: 'Just now'
  },
  {
    id: 'task-4',
    title: 'Onboarding Kit Manual Revisions',
    description: 'Review corporate policy templates regarding hybrid/remote working standards and submit draft for leadership review.',
    assignedTo: 'Emma Watson',
    assignedToAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=155&h=155&fit=crop&crop=face',
    department: 'Human Resources',
    priority: 'Low',
    status: 'Done',
    dueDate: '2026-06-02',
    progress: 100,
    timeline: 'Jun 2 - 3',
    files: 'OnboardingKit.pdf',
    notesText: 'Awaiting signature',
    groupName: 'Completed',
    lastUpdated: 'Just now',
    completedAt: '2026-05-24'
  },
  {
    id: 'task-5',
    title: 'Optimize Database Indirection & Latency Indexes',
    description: 'Diagnose server-side API bottleneck triggers, identifying slow read pools within legacy ORMs.',
    assignedTo: 'Liam Neeson',
    assignedToAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=155&h=155&fit=crop&crop=face',
    department: 'R&D',
    priority: 'Critical',
    status: 'Not Started',
    dueDate: '2026-06-12',
    progress: 0,
    timeline: 'Jun 12 - 15',
    files: '',
    notesText: 'Tech review pending',
    groupName: 'To-Do',
    lastUpdated: '2 days ago'
  }
];

