export interface Vacancy {
  id: string;
  title: string;
  type: 'Full-Time' | 'Part-Time' | 'Internship';
  location: 'Remote' | 'On-Site' | 'Hybrid';
  applicantsCount: number;
}

export type ApplicantStage = 'Application Received' | 'Interview Scheduled' | 'Final Interview' | 'Test Completed';

export interface Applicant {
  id: string;
  name: string;
  email: string;
  avatar: string;
  jobTitle: string;
  appliedDate: string;
  type: 'Full-Time' | 'Part-Time' | 'Internship';
  location: 'Remote' | 'On-Site' | 'Hybrid';
  stage: ApplicantStage;
  stageProgress: number; // 1 to 5 index for the standard progress bar in the mockup
  notes: Array<{ id: string; author: string; text: string; date: string }>;
  rating: number; // 1 to 5 stars
  phone?: string;
  portfolioUrl?: string;
  coverLetter?: string;
}

export interface ScheduleEvent {
  id: string;
  time: string;
  title: string;
  date: string; // e.g., '2035-06-20'
  candidateName: string;
  candidateRole: string;
}

export interface MetricItem {
  id: string;
  label: string;
  value: number;
  percentageChange: string;
  isPositive: boolean;
  subtext: string;
}

export interface EmployeeTask {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedToAvatar: string;
  department: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Backlog' | 'In Progress' | 'Under Review' | 'Completed' | 'Working on it' | 'Done' | 'Stuck' | 'Not Started';
  dueDate: string;
  progress: number; // 0 to 100
  completedAt?: string;
  timeline?: string;
  files?: string;
  notesText?: string; // Rename to notesText to avoid conflict with existing things
  groupName?: string;
  lastUpdated?: string;
}
