
import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Target, 
  Github, 
  CheckCircle2, 
  LayoutDashboard, 
  Calendar, 
  TrendingUp, 
  RotateCcw,
  Sparkles,
  Zap,
  Star,
  GitFork,
  FileText,
  AlertCircle,
  User,
  Menu,
  X,
  ChevronDown,
  ChevronUp,
  Circle,
  Loader2,
  Cpu,
  Heart,
  Lightbulb,
  ChevronRight,
  Briefcase,
  ExternalLink,
  Plus,
  Map,
  Users,
  BookOpen,
  MessageSquare
} from 'lucide-react';
import { AppStep, ChatMessage, Task, RoadmapData, InitialAnalysis, SkillItem, RoadmapPhase } from './types';
import { extractTextFromPdf } from './services/pdfService';
import { fetchGithubData } from './services/githubService';
import { analyzeProfile, generateRoadmap } from './services/geminiService';
import LoadingOverlay from './components/LoadingOverlay';
import FileUploader from './components/FileUploader';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.SETUP);
  const [loading, setLoading] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [syncingTaskId, setSyncingTaskId] = useState<string | null>(null);

  const [userName, setUserName] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [linkedinFile, setLinkedinFile] = useState<File | null>(null);
  const [githubUsername, setGithubUsername] = useState('');
  const [githubDetails, setGithubDetails] = useState('');
  const [targetPosition, setTargetPosition] = useState('');
  const [copilotMode, setCopilotMode] = useState<'networking' | 'upskill'>('upskill');

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [initialAnalysis, setInitialAnalysis] = useState<InitialAnalysis | null>(null);
  const [showSkills, setShowSkills] = useState(true);
  const [showProjects, setShowProjects] = useState(true);
  const [showPathways, setShowPathways] = useState(true);
  const [copilotAdvice, setCopilotAdvice] = useState<string | null>(null);
  
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const COPILOT_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby1Oz9IJ7lAIABO_DGoDetPhy2QhAjlCX6EgdUO_an4handXY8GgFZQuLekDboBPEH4uQ/exec";

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleInitialize = async () => {
    if (!userName || (!resumeFile && !linkedinFile && !githubUsername) || !targetPosition) {
      alert("Provide your name, profile sources, and target position.");
      return;
    }
    setLoading("Synthesizing professional identity...");
    try {
      let resText = resumeFile ? await extractTextFromPdf(resumeFile) : "";
      let liText = linkedinFile ? await extractTextFromPdf(linkedinFile) : "";
      const ghData = githubUsername ? await fetchGithubData(githubUsername) : "None provided";
      setGithubDetails(ghData);
      
      const analysis = await analyzeProfile(resText, liText, ghData, targetPosition);
      setInitialAnalysis(analysis);
      setQuestions(analysis.assessment_questions);
      setChatHistory([
        { role: 'assistant', content: `**Hello ${userName},** I've mapped your skills for the **${targetPosition}** role. ${analysis.skill_gap_summary}` },
        { role: 'assistant', content: `**Calibration Q1:** ${analysis.assessment_questions[0]}` }
      ]);
      setStep(AppStep.INTERVIEW);
    } catch (e) { alert("Initialization failed."); } finally { setLoading(null); }
  };

  const finalizeRoadmap = async (history: ChatMessage[]) => {
    setLoading("Constructing 30 day vibe-check plan");
    try {
      const transcript = history.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n');
      const plan = await generateRoadmap(transcript, targetPosition, JSON.stringify(initialAnalysis), githubDetails);
      setRoadmap(plan);
      setSidebarOpen(true);
      setStep(AppStep.ROADMAP);
      fetchCopilotAdvice("Generate a starting strategy for my 30-day offensive.");
    } catch (e) { alert("Roadmap generation failed."); } finally { setLoading(null); }
  };

  const fetchCopilotAdvice = async (query: string) => {
    const contextPrompt = `${query} My target is ${targetPosition}. I am currently in ${copilotMode} mode.`;
    try {
      const response = await fetch(`${COPILOT_SCRIPT_URL}?q=${encodeURIComponent(contextPrompt)}`);
      const advice = await response.text();
      setCopilotAdvice(advice);
    } catch (error) {
      console.error("Copilot advice fetch failed:", error);
    }
  };

  const handleSendResponse = async () => {
    if (!userInput.trim()) return;
    const newHistory: ChatMessage[] = [...chatHistory, { role: 'user', content: userInput.trim() }];
    setChatHistory(newHistory);
    setUserInput('');
    if (currentQIndex < 4) {
      const nextIdx = currentQIndex + 1;
      setCurrentQIndex(nextIdx);
      setChatHistory(prev => [...prev, { role: 'assistant', content: `**Calibration Q${nextIdx + 1}:** ${questions[nextIdx]}` }]);
    } else { await finalizeRoadmap(newHistory); }
  };

  const resetAll = () => {
    setStep(AppStep.SETUP);
    setUserName('');
    setResumeFile(null);
    setLinkedinFile(null);
    setGithubUsername('');
    setGithubDetails('');
    setTargetPosition('');
    setChatHistory([]);
    setQuestions([]);
    setCurrentQIndex(0);
    setRoadmap(null);
    setCompletedTasks({});
    setInitialAnalysis(null);
    setCopilotAdvice(null);
  };

  // --- Career Copilot Integration (Google Calendar) ---
  const syncToCopilotCalendar = async (title: string, details: string, id: string) => {
    setSyncingTaskId(id);
    const schedulingQuery = `Schedule following task to my Google Calendar: ${title}. Details: ${details}`;
    try {
      // We use a simple fetch to the user's GAS endpoint
      const response = await fetch(`${COPILOT_SCRIPT_URL}?q=${encodeURIComponent(schedulingQuery)}`);
      if (response.ok) {
        const result = await response.text();
        console.log("Calendar Sync Result:", result);
        // Fallback to opening template if script just returns advice instead of performing action
        const templateLink = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent(details)}`;
        window.open(templateLink, '_blank');
      }
    } catch (error) {
      console.error("Copilot scheduling failed:", error);
    } finally {
      setSyncingTaskId(null);
    }
  };

  const handleSyncPhase = (phase: RoadmapPhase, pIdx: number) => {
    const details = `Tasks: ${phase.tasks.join(', ')}`;
    syncToCopilotCalendar(`[Catalyst Phase] ${phase.focus}`, details, `phase-${pIdx}`);
  };

  const handleSyncTask = (taskText: string, phaseTitle: string, id: string) => {
    syncToCopilotCalendar(`[Catalyst Task] ${taskText}`, `Part of focus: ${phaseTitle}`, id);
  };

  // --- Dynamic Progress & Skill Profiling ---
  const totalTasksCount = roadmap?.thirty_day_plan.reduce((acc, p) => acc + p.tasks.length, 0) || 0;
  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const progressFactor = totalTasksCount > 0 ? (completedCount / totalTasksCount) : 0;
  const progressPercent = progressFactor * 100;
  
  const metSkills = initialAnalysis?.skills.filter(s => s.status === 'met').length || 0;
  const totalSkillsCount = initialAnalysis?.skills.length || 1;
  const matchPercent = Math.min(95, ((metSkills / totalSkillsCount) * 100) + (progressFactor * 30));

  return (
    <div className="min-h-screen flex flex-col bg-[#0E1117] text-[#E6EDF3]">
      {loading && <LoadingOverlay message={loading} />}

      {step !== AppStep.ROADMAP && (
        <header className="py-8 flex flex-col items-center">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-indigo-500 rounded-lg shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">Catalyst AI</h1>
          </div>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.5em] mt-2">Career Intelligence Layer</p>
        </header>
      )}

      <main className={`flex-1 flex flex-col lg:flex-row ${step === AppStep.ROADMAP ? 'h-screen' : ''}`}>
        
        {step === AppStep.ROADMAP && roadmap && (
          <aside className={`fixed lg:static inset-y-0 left-0 z-50 bg-[#161B22] border-r border-[#30363D] transition-all duration-500 ease-out shadow-2xl flex flex-col ${sidebarOpen ? 'w-80 translate-x-0' : 'w-0 lg:w-0 -translate-x-full lg:-translate-x-0 overflow-hidden'}`}>
            <div className="p-6 flex-1 overflow-y-auto space-y-6 scrollbar-hide">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 bg-indigo-500 rounded">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-lg font-black tracking-tighter italic uppercase text-white">Catalyst</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="p-1 lg:hidden hover:bg-[#30363D] rounded"><X className="w-5 h-5"/></button>
              </div>

              {/* Greeting & Metrics */}
              <div className="py-4 border-b border-[#30363D]/50 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-white leading-tight mb-1">{userName}</h2>
                  <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wide">{targetPosition}</p>
                </div>

                {/* Copilot Mode Selection */}
                <div className="grid grid-cols-2 gap-2 bg-[#0E1117] p-1 rounded-xl border border-[#30363D]">
                  <button 
                    onClick={() => setCopilotMode('upskill')}
                    className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-[10px] font-bold uppercase transition-all ${copilotMode === 'upskill' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                    <BookOpen className="w-3 h-3" />
                    <span>Upskill</span>
                  </button>
                  <button 
                    onClick={() => setCopilotMode('networking')}
                    className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-[10px] font-bold uppercase transition-all ${copilotMode === 'networking' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                  >
                    <Users className="w-3 h-3" />
                    <span>Network</span>
                  </button>
                </div>

                {/* Overall Task Progress */}
                <div className="bg-[#0E1117] p-5 rounded-2xl border border-[#30363D] shadow-inner relative overflow-hidden group">
                  <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  <div className="flex justify-between items-end mb-4">
                    <p className="text-4xl font-black text-white">{Math.round(progressPercent)}%</p>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">{completedCount}/{totalTasksCount}</p>
                      <p className="text-[10px] text-gray-500 uppercase">Tasks Completed</p>
                    </div>
                  </div>
                  <div className="w-full bg-[#30363D] h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-indigo-500 h-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(99,102,241,0.8)]" 
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Career Copilot Advice Section */}
              {copilotAdvice && (
                <div className="bg-indigo-600/10 border border-indigo-500/30 p-4 rounded-2xl relative group overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => fetchCopilotAdvice("Give me fresh advice.")}>
                    <RotateCcw className="w-3 h-3 text-indigo-400" />
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <MessageSquare className="w-3 h-3 text-indigo-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Copilot Insight</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-gray-300 italic">"{copilotAdvice}"</p>
                </div>
              )}

              {/* Skill Matrix */}
              <div className="space-y-3">
                <button onClick={() => setShowSkills(!showSkills)} className="w-full flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:text-white transition-colors">
                  <span className="flex items-center"><Cpu className="w-3.5 h-3.5 mr-2" /> Skill Matrix</span>
                  {showSkills ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>}
                </button>
                {showSkills && initialAnalysis && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                    <div>
                      <h5 className="text-[9px] text-gray-500 uppercase font-black mb-2 flex items-center"><Circle className="w-1.5 h-1.5 mr-1 text-blue-500 fill-blue-500" /> Technical Gaps</h5>
                      <div className="flex flex-wrap gap-2">
                        {initialAnalysis.skills.filter(s => s.type === 'technical').map((skill, i) => {
                          const isAcquired = skill.status === 'met' || progressFactor >= 0.85;
                          const isAcquiring = skill.status === 'missing' && progressFactor > 0 && progressFactor < 0.85;
                          const badgeClass = isAcquired ? 'bg-green-500/5 border-green-500/20 text-green-400' : isAcquiring ? 'bg-indigo-500/5 border-indigo-500/20 text-indigo-300' : 'bg-[#0E1117] border-[#30363D] text-gray-500';
                          return (
                            <span key={i} className={`text-[10px] px-2 py-1 rounded-md border flex items-center space-x-1 transition-all duration-700 ${badgeClass}`}>
                              { isAcquired ? <CheckCircle2 className="w-2.5 h-2.5"/> : isAcquiring ? <Loader2 className="w-2.5 h-2.5 animate-spin"/> : null }
                              <span>{skill.name}</span>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Career Pathways */}
              <div className="space-y-3">
                <button onClick={() => setShowPathways(!showPathways)} className="w-full flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:text-white transition-colors">
                  <span className="flex items-center"><Map className="w-3.5 h-3.5 mr-2" /> Career Pathways</span>
                  {showPathways ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>}
                </button>
                {showPathways && initialAnalysis && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    {initialAnalysis.job_pathways.map((path, i) => (
                      <div key={i} className="flex items-center space-x-3 p-3 bg-[#0E1117] border border-[#30363D] rounded-xl hover:border-indigo-500/40 transition-all group">
                        <TrendingUp className="w-3.5 h-3.5 text-indigo-500 group-hover:scale-110 transition-transform" />
                        <span className="text-[11px] font-semibold text-gray-300">{path}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Reset Action */}
              <div className="pt-4 border-t border-[#30363D]/50 mt-auto">
                <button onClick={resetAll} className="w-full py-3 text-[10px] font-black uppercase text-red-400/50 hover:text-red-400 flex justify-center items-center group transition-colors">
                  <RotateCcw className="w-3.5 h-3.5 mr-2 group-hover:rotate-180 transition-transform duration-500" /> Reset Session
                </button>
              </div>
            </div>
          </aside>
        )}

        <div className={`flex-1 relative ${step === AppStep.ROADMAP ? 'overflow-y-auto' : ''}`}>
          {step === AppStep.ROADMAP && !sidebarOpen && (
            <button onClick={() => setSidebarOpen(true)} className="fixed bottom-8 left-8 z-40 bg-indigo-600 p-4 rounded-2xl shadow-2xl hover:bg-indigo-500 animate-in fade-in zoom-in">
              <Menu className="w-6 h-6 text-white" />
            </button>
          )}

          <div className={`mx-auto ${step === AppStep.ROADMAP ? 'max-w-4xl p-8 lg:p-12' : 'max-w-3xl px-6'}`}>
            
            {/* SETUP */}
            {step === AppStep.SETUP && (
              <div className="max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Calibration Hub</h2>
                  <p className="text-gray-500 text-sm">Synchronize your professional data for real-time synthesis.</p>
                </div>
                <div className="bg-[#161B22] p-8 rounded-3xl border border-[#30363D] space-y-6 shadow-2xl relative">
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <label className="text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Candidate Name</label>
                      <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Full Name" className="bg-[#0E1117] border border-[#30363D] rounded-2xl px-5 py-4 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"/>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FileUploader label="Resume" onFileSelect={setResumeFile} selectedFile={resumeFile} />
                      <FileUploader label="LinkedIn PDF" onFileSelect={setLinkedinFile} selectedFile={linkedinFile} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input type="text" value={githubUsername} onChange={(e) => setGithubUsername(e.target.value)} placeholder="GitHub User" className="bg-[#0E1117] border border-[#30363D] rounded-2xl px-5 py-4 text-white focus:border-indigo-500 outline-none"/>
                      <input type="text" value={targetPosition} onChange={(e) => setTargetPosition(e.target.value)} placeholder="Target Role" className="bg-[#0E1117] border border-[#30363D] rounded-2xl px-5 py-4 text-white focus:border-indigo-500 outline-none"/>
                    </div>
                  </div>
                  <button onClick={handleInitialize} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-2xl flex items-center justify-center space-x-2 transition-all uppercase tracking-widest italic shadow-lg shadow-indigo-600/20 active:scale-[0.98]">
                    <span>Activate Catalyst</span>
                    <ChevronRight className="w-5 h-5"/>
                  </button>
                </div>
              </div>
            )}

            {/* INTERVIEW */}
            {step === AppStep.INTERVIEW && (
              <div className="flex flex-col h-[78vh] animate-in fade-in">
                <div className="flex items-center justify-between mb-6 bg-indigo-500/5 border border-indigo-500/20 p-5 rounded-3xl backdrop-blur-sm">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-lg font-black text-white italic tracking-tighter">
                      {currentQIndex + 1}
                    </div>
                    <div>
                      <p className="text-sm font-black text-white uppercase italic">Calibration</p>
                      <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">Question Segment</p>
                    </div>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto space-y-6 p-4 scrollbar-hide">
                  {chatHistory.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] px-6 py-4 rounded-3xl ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none shadow-xl' : 'bg-[#161B22] text-gray-200 rounded-tl-none border border-[#30363D]'}`}>
                        <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">{msg.content.replace(/\*\*(.*?)\*\*/g, '$1')}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
                <div className="mt-6 flex space-x-3 bg-[#161B22] p-2.5 rounded-3xl border border-[#30363D] shadow-2xl focus-within:border-indigo-500/50 transition-colors">
                  <input type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendResponse()} placeholder="Type response..." className="flex-1 bg-transparent px-5 py-4 text-white outline-none"/>
                  <button onClick={handleSendResponse} className="bg-indigo-600 p-4 rounded-2xl hover:bg-indigo-500 active:scale-95 transition-all shadow-lg shadow-indigo-600/20"><Send className="w-5 h-5 text-white"/></button>
                </div>
              </div>
            )}

            {/* ROADMAP */}
            {step === AppStep.ROADMAP && roadmap && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-700 pb-20">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#30363D]/50">
                  <div className="space-y-2">
                    <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter flex items-center">
                      <Calendar className="w-10 h-10 mr-4 text-indigo-500" /> Growth Offensive
                    </h3>
                    <p className="text-gray-400">A hyper-focused 30-day offensive roadmap for <span className="text-white font-bold">{userName}</span>.</p>
                  </div>
                  <div className="bg-[#161B22] px-5 py-3 rounded-2xl border border-[#30363D] flex items-center space-x-3">
                    <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Phase Active</span>
                  </div>
                </div>

                <div className="space-y-12">
                  {roadmap.thirty_day_plan.map((phase, idx) => {
                    const phaseTasks = phase.tasks;
                    const phaseCompleted = phaseTasks.filter((_, tidx) => completedTasks[`${idx}-${tidx}`]).length;
                    const phaseProgress = (phaseCompleted / phaseTasks.length) * 100;
                    const isSyncingPhase = syncingTaskId === `phase-${idx}`;

                    return (
                      <div key={idx} className="group">
                        <div className="flex items-center space-x-6 mb-6">
                          <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-500/20 rounded-3xl flex items-center justify-center text-xl font-black italic text-indigo-400 shrink-0">P{idx + 1}</div>
                          <div className="flex-1">
                            <div className="flex justify-between items-end mb-2">
                              <div className="flex items-center space-x-3">
                                <h4 className="text-2xl font-black text-white uppercase group-hover:text-indigo-400 transition-colors">{phase.focus}</h4>
                                <button 
                                  onClick={() => handleSyncPhase(phase, idx)}
                                  disabled={isSyncingPhase}
                                  title="Schedule phase to Career Calendar"
                                  className="p-2 bg-[#161B22] border border-[#30363D] rounded-xl hover:bg-indigo-500 hover:border-indigo-500 transition-all group/cal shadow-lg disabled:opacity-50"
                                >
                                  {isSyncingPhase ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Plus className="w-4 h-4 text-gray-400 group-hover/cal:text-white" />}
                                </button>
                              </div>
                              <span className="text-xs font-black text-indigo-500 tracking-widest">{Math.round(phaseProgress)}%</span>
                            </div>
                            <div className="w-full bg-[#161B22] h-2 rounded-full overflow-hidden">
                              <div className="bg-indigo-500/50 h-full transition-all duration-700 ease-in-out" style={{ width: `${phaseProgress}%` }} />
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-4 pl-8 border-l-2 border-indigo-500/10">
                          {phase.tasks.map((task, tidx) => {
                            const taskId = `${idx}-${tidx}`;
                            const isDone = completedTasks[taskId];
                            const isSyncingTask = syncingTaskId === taskId;

                            return (
                              <div key={tidx} className="relative group/task">
                                <div 
                                  onClick={() => setCompletedTasks(prev => ({ ...prev, [taskId]: !prev[taskId] }))} 
                                  className={`flex items-start space-x-4 p-5 rounded-3xl cursor-pointer border transition-all h-full ${isDone ? 'bg-indigo-500/5 border-indigo-500/30 opacity-70' : 'bg-[#161B22] border-[#30363D] hover:border-indigo-500/50 hover:bg-[#1C2128]'}`}
                                >
                                  <div className={`w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 border-2 transition-all ${isDone ? 'bg-indigo-500 border-indigo-500 scale-110' : 'border-[#30363D]'}`}>
                                    {isDone && <CheckCircle2 className="w-4 h-4 text-white"/>}
                                  </div>
                                  <span className={`text-sm font-semibold leading-relaxed flex-1 ${isDone ? 'text-gray-500 line-through decoration-indigo-500/30' : 'text-gray-200'}`}>{task}</span>
                                </div>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); handleSyncTask(task, phase.focus, taskId); }}
                                  disabled={isSyncingTask}
                                  className="absolute top-4 right-4 p-2 bg-[#0E1117]/80 rounded-xl border border-[#30363D] opacity-0 group-hover/task:opacity-100 transition-all hover:bg-indigo-600 hover:border-indigo-500 disabled:opacity-50"
                                  title="Schedule to Career Calendar"
                                >
                                  {isSyncingTask ? <Loader2 className="w-3.5 h-3.5 text-white animate-spin" /> : <Calendar className="w-3.5 h-3.5 text-indigo-400 group-hover/task:text-white" />}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {step !== AppStep.ROADMAP && (
        <footer className="py-8 border-t border-[#30363D]/50 text-center">
          <p className="text-gray-700 text-[10px] font-black uppercase tracking-[0.5em]">Catalyst AI Career Intelligence v5.0</p>
        </footer>
      )}
    </div>
  );
};

export default App;
