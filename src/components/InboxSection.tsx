import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Sparkles, 
  CheckCheck, 
  MessageSquare, 
  User, 
  AlertCircle, 
  Layers, 
  FileText,
  UserCheck,
  ChevronRight
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'target';
  text: string;
  timestamp: string;
}

interface ChatThread {
  id: string;
  name: string;
  role: string;
  avatar: string;
  badge: 'Candidate' | 'Internal' | 'System';
  badgeColor: string;
  messages: Message[];
  isUnread: boolean;
  repliesTemplate: string[];
}

export default function InboxSection() {
  const [threads, setThreads] = useState<ChatThread[]>([
    {
      id: 'th-1',
      name: 'William Hartono',
      role: 'UI Designer Candidate',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      badge: 'Candidate',
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
      isUnread: true,
      repliesTemplate: [
        "Let's schedule a 30-min technical portfolio review this week.",
        "Your UI examples look fantastic, could you share the Figma file?",
        "Thank you for sharing your contact details, we will call you soon."
      ],
      messages: [
        { id: '1', sender: 'target', text: "Hello! Thank you for inviting me to interview. I am extremely excited about the UI Designer opportunity.", timestamp: "Yesterday, 04:12 PM" },
        { id: '2', sender: 'user', text: "Hello William! We reviewed your portfolio. The typography on your banking app project is stellar.", timestamp: "Yesterday, 04:30 PM" },
        { id: '3', sender: 'target', text: "Thank you, Davis! That project was a major design sprint. I wrote a quick breakdown of my UX logic in the PDF attached.", timestamp: "Today, 09:15 AM" }
      ]
    },
    {
      id: 'th-2',
      name: 'Fanny Rizal',
      role: 'Sales Manager Candidate',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      badge: 'Candidate',
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
      isUnread: false,
      repliesTemplate: [
        "Great pitch! Let's schedule the final executive panel review.",
        "Could you send over details of your team sales metrics from Q1?",
        "We are wrapping up other reviews and will have an update by Friday."
      ],
      messages: [
        { id: '1', sender: 'target', text: "Hi team, I have uploaded my sales pipeline analysis spreadsheet.", timestamp: "Yesterday, 11:20 AM" },
        { id: '2', sender: 'user', text: "Awesome, Fanny! Having that metric spreadsheet helps our evaluation immensely.", timestamp: "Yesterday, 12:00 PM" }
      ]
    },
    {
      id: 'th-3',
      name: 'Sarah Connor',
      role: 'HR Assistant Recruiter',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      badge: 'Internal',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      isUnread: true,
      repliesTemplate: [
        "Please flag Arifin as high-priority on the list.",
        "I will handle the screen scoring report in a few minutes.",
        "Can we move Sarah's slot to Wednesday afternoon instead?"
      ],
      messages: [
        { id: '1', sender: 'target', text: "Davis, have you reviewed Lala Wijaya's Python test submission yet?", timestamp: "Today, 08:30 AM" },
        { id: '2', sender: 'user', text: "Not yet, Sarah, I saw she scored a 98/100, though. Insanely good.", timestamp: "Today, 08:45 AM" },
        { id: '3', sender: 'target', text: "Yes! She is very smart. Let's make sure we schedule her with the lead engineer ASAP.", timestamp: "Today, 10:02 AM" }
      ]
    },
    {
      id: 'th-4',
      name: 'System Evaluation Agent',
      role: 'Automated Scoring Reports',
      avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150&h=150&fit=crop&crop=face',
      badge: 'System',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      isUnread: false,
      repliesTemplate: [
        "Acknowledge and lock score rating",
        "Trigger automated next-stage pre-screening email",
        "Flag report for external expert review"
      ],
      messages: [
        { id: '1', sender: 'target', text: "ALERT: Rian Kusuma has submitted his pre-interview screening questionnaire. Score evaluated at 84% compatibility ratio.", timestamp: "Today, 05:00 AM" }
      ]
    }
  ]);

  const [selectedThreadId, setSelectedThreadId] = useState<string>('th-1');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Candidate' | 'Internal' | 'System'>('All');
  const [typedMessage, setTypedMessage] = useState<string>('');
  const [isTypingTriggered, setIsTypingTriggered] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const selectedThread = threads.find((t) => t.id === selectedThreadId) || threads[0];

  useEffect(() => {
    // Automatically scroll chat to bottom when selected thread or message list changes
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selectedThreadId, threads]);

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const timestamp = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const userMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: `Today, ${timestamp}`
    };

    // Append to current thread messages list
    setThreads((prevThreads) =>
      prevThreads.map((t) => {
        if (t.id === selectedThreadId) {
          return {
            ...t,
            isUnread: false,
            messages: [...t.messages, userMsg]
          };
        }
        return t;
      })
    );

    setTypedMessage('');

    // If candidate or internal thread is active, trigger an automated responding simulation!
    if (selectedThread.badge !== 'System') {
      setIsTypingTriggered(true);
      setTimeout(() => {
        setIsTypingTriggered(false);
        const replyMsg: Message = {
          id: `msg-rep-${Date.now()}`,
          sender: 'target',
          text: getRandomReply(selectedThread.name),
          timestamp: `Today, ${timestamp}`
        };

        setThreads((prev) =>
          prev.map((t) => {
            if (t.id === selectedThreadId) {
              return {
                ...t,
                messages: [...t.messages, replyMsg]
              };
            }
            return t;
          })
        );
      }, 1500);
    }
  };

  const getRandomReply = (name: string) => {
    const list = [
      `Awesome! That sounds good, Davis. I will check my agenda.`,
      `Thank you for the quick heads up! I will let you know.`,
      `Perfectly clear. Let's touch base regarding this later this afternoon.`,
      `Got it. I appreciate the swift sync on this decision.`
    ];
    return list[Math.floor(Math.random() * list.length)];
  };

  const insertTemplate = (text: string) => {
    setTypedMessage(text);
  };

  const markAsRead = (id: string) => {
    setSelectedThreadId(id);
    setThreads((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isUnread: false } : t))
    );
  };

  const filteredThreads = threads.filter((t) => {
    if (activeFilter === 'All') return true;
    return t.badge === activeFilter;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)] select-none">
      
      {/* Search / Threads Column (Left 1/3) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xs flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b border-slate-50 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm tracking-tight">Direct Communications</h3>
            <p className="text-[10px] text-slate-400 font-bold">Unify communication pipelines</p>
          </div>
          <span className="text-[11px] font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
            {threads.filter((t) => t.isUnread).length} Unread
          </span>
        </div>

        {/* Categories Tab Toggles */}
        <div className="px-3 py-2 bg-slate-50/50 border-b border-slate-100 flex flex-wrap gap-1">
          {['All', 'Candidate', 'Internal', 'System'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter as any)}
              className={`px-3 py-1 text-[10px] font-extrabold rounded-lg transition-all border cursor-pointer ${
                activeFilter === filter
                  ? 'bg-gradient-to-r from-[#1bc1a1] to-teal-555 text-white border-transparent'
                  : 'bg-white text-slate-500 border-slate-200/60 hover:bg-slate-50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Thread Row Listing */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
          {filteredThreads.map((th) => {
            const isSelected = th.id === selectedThreadId;
            const lastMessage = th.messages[th.messages.length - 1];
            return (
              <div
                key={th.id}
                onClick={() => markAsRead(th.id)}
                className={`p-3.5 flex gap-3 cursor-pointer transition-all duration-150 select-none items-start relative ${
                  isSelected 
                    ? 'bg-[#1bc1a1]/5 hover:bg-[#1bc1a1]/5' 
                    : 'bg-white hover:bg-slate-50/75'
                }`}
              >
                {/* Unread dot cue */}
                {th.isUnread && (
                  <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-2 h-2 bg-[#1bc1a1] rounded-full" />
                )}

                <img
                  src={th.avatar}
                  alt={th.name}
                  className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-150 shadow-2xs"
                  referrerPolicy="no-referrer"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-extrabold text-xs text-slate-700 truncate">{th.name}</span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-md border font-mono ${th.badgeColor}`}>
                      {th.badge}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 truncate mb-1">{th.role}</p>
                  <p className={`text-xs font-medium truncate ${th.isUnread && isSelected ? 'text-[#1bc1a1]' : 'text-slate-500'}`}>
                    {lastMessage ? lastMessage.text : 'No messages'}
                  </p>
                </div>

                <div className="flex flex-col items-end justify-between self-stretch shrink-0">
                  <span className="text-[9px] text-slate-400 font-bold whitespace-nowrap">
                    {lastMessage ? lastMessage.timestamp.split(', ')[1] : ''}
                  </span>
                  <ChevronRight className={`w-3.5 h-3.5 transition-colors ${isSelected ? 'text-[#1bc1a1]' : 'text-slate-350'}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Chat Window (Right 2/3) */}
      <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-xs flex flex-col h-full overflow-hidden">
        
        {/* Active Thread Bar Header */}
        <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-white relative z-10">
          <div className="flex items-center gap-3">
            <img
              src={selectedThread.avatar}
              alt={selectedThread.name}
              className="w-11 h-11 rounded-xl object-cover border border-slate-150"
              referrerPolicy="no-referrer"
            />
            <div>
              <h4 className="font-extrabold text-xs sm:text-sm text-slate-800 tracking-tight">{selectedThread.name}</h4>
              <p className="text-[10px] text-slate-400 font-bold inline-flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${selectedThread.badge === 'System' ? 'bg-amber-400' : 'bg-emerald-500'} animate-pulse`} />
                <span>{selectedThread.role} &bull; Active Sync</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-slate-400 hidden sm:inline">Thread: #{selectedThread.id}</span>
            <span className="px-2.5 py-1 text-[10px] font-bold bg-slate-50 rounded-lg text-slate-500 border border-slate-100">
              {selectedThread.messages.length} Messages
            </span>
          </div>
        </div>

        {/* Chat Bubbles Scroll frame */}
        <div 
          ref={scrollRef}
          className="flex-1 bg-slate-50/50 p-4 md:p-5 overflow-y-auto space-y-4"
        >
          {selectedThread.messages.map((m) => {
            const isUser = m.sender === 'user';
            return (
              <div 
                key={m.id} 
                className={`flex gap-2.5 items-end max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {!isUser && (
                  <img
                    src={selectedThread.avatar}
                    alt={selectedThread.name}
                    className="w-7 h-7 rounded-lg object-cover border border-slate-100 shrink-0 mb-1"
                    referrerPolicy="no-referrer"
                  />
                )}
                <div>
                  <div className={`p-4 rounded-2xl text-xs md:text-xs leading-relaxed font-semibold shadow-2xs ${
                    isUser 
                      ? 'bg-gradient-to-br from-[#1bc1a1]/90 to-teal-700 text-white rounded-br-none' 
                      : 'bg-white text-slate-700 border border-slate-150 rounded-bl-none'
                  }`}>
                    {m.text}
                  </div>
                  <div className={`flex items-center gap-1.5 mt-1 text-[9px] text-slate-400 font-bold ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <span>{m.timestamp}</span>
                    {isUser && <CheckCheck className="w-3.5 h-3.5 text-[#1bc1a1]" />}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Typing Indicator simulator */}
          {isTypingTriggered && (
            <div className="flex gap-2.5 items-end max-w-[85%]">
              <img
                src={selectedThread.avatar}
                alt={selectedThread.name}
                className="w-7 h-7 rounded-lg object-cover border border-slate-100 shrink-0 mb-1"
                referrerPolicy="no-referrer"
              />
              <div className="p-3 bg-white border border-slate-150 rounded-2xl rounded-bl-none flex items-center justify-center gap-1 shrink-0">
                <span className="w-1.5 h-1.5 bg-[#1bc1a1] rounded-full animate-bounce" />
                <span className="w-1.5 h-1.5 bg-[#1bc1a1] rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 bg-[#1bc1a1] rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
        </div>

        {/* Quick Instant Response Templates panel */}
        {selectedThread.repliesTemplate && (
          <div className="p-3 bg-slate-50 border-t border-slate-100/75 select-none overflow-x-auto whitespace-nowrap flex gap-2">
            <span className="text-[9px] font-extrabold text-slate-400 uppercase self-center shrink-0 tracking-wider">
              Suggestions:
            </span>
            {selectedThread.repliesTemplate.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => insertTemplate(opt)}
                className="px-3 py-1.5 rounded-lg text-[10px] font-bold bg-white hover:bg-teal-50 hover:text-teal-700 text-slate-650 border border-slate-150 inline-block truncate max-w-[250px] cursor-pointer transition-colors"
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* Interactive Input Send Pad */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(typedMessage);
          }}
          className="p-3.5 bg-white border-t border-slate-50 flex gap-3.5 relative z-10"
        >
          <input
            type="text"
            className="flex-1 bg-slate-50 border border-slate-200/90 rounded-xl px-4 py-3 text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-[#1bc1a1] focus:bg-white transition-all shadow-inner"
            placeholder={selectedThread.badge === 'System' ? 'System channel read-only' : 'Type message to send...'}
            disabled={selectedThread.badge === 'System'}
            value={typedMessage}
            onChange={(e) => setTypedMessage(e.target.value)}
          />

          <button
            type="submit"
            disabled={!typedMessage.trim() || selectedThread.badge === 'System'}
            className="w-12 h-11 rounded-xl bg-gradient-to-r from-[#1bc1a1] to-teal-555 text-white flex items-center justify-center hover:opacity-90 disabled:opacity-40 shadow-xs cursor-pointer active:scale-95 transition-transform"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
