
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
  MessageSquare,
  Bookmark,
  Code2,
  FlaskConical,
  BarChart3,
  Clock,
  ShieldCheck,
  Download,
  Award,
  Trophy
} from 'lucide-react';
import { AppStep, ChatMessage, Task, RoadmapData, InitialAnalysis, SkillItem, RoadmapPhase, RoadmapTask, DocumentationLink, ProgressReportData } from './types';
import { extractTextFromPdf } from './services/pdfService';
import { fetchGithubData } from './services/githubService';
import { analyzeProfile, generateRoadmap, generateReportAnalysis } from './services/geminiService';
import LoadingOverlay from './components/LoadingOverlay';
import FileUploader from './components/FileUploader';

// Component for the printable report
const ReportTemplate: React.FC<{ data: ProgressReportData }> = ({ data }) => {
  return (
    <div id="progress-report-content" className="bg-white text-[#1a1a1a] p-12 max-w-[800px] mx-auto shadow-2xl">
      <div className="text-center mb-12 border-b-2 border-indigo-600 pb-6">
        <h1 className="text-3xl font-black uppercase tracking-tight text-indigo-700 mb-2">30-Day Skill Progress Report</h1>
        <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Growth Intelligence Layer</p>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-10 bg-indigo-50 p-6 rounded-2xl">
        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase text-indigo-500">Candidate Information</p>
          <h2 className="text-xl font-bold">{data.userName}</h2>
          <p className="text-sm text-gray-600">{data.targetRole}</p>
        </div>
        <div className="text-right space-y-2">
          <p className="text-[10px] font-black uppercase text-indigo-500">Report Metadata</p>
          <p className="text-sm font-bold">{data.date}</p>
          <p className="text-sm text-gray-500">Status: {data.readinessAssessment}</p>
        </div>
      </div>

      <section className="mb-10">
        <h3 className="text-lg font-black uppercase tracking-wider text-gray-900 border-l-4 border-indigo-600 pl-4 mb-6">Overall Performance Summary</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-gray-50 p-4 rounded-xl text-center">
            <p className="text-[9px] font-black uppercase text-gray-500 mb-1">Initial Score</p>
            <p className="text-2xl font-black text-gray-800">{data.initialScore}%</p>
          </div>
          <div className="bg-indigo-600 p-4 rounded-xl text-center text-white">
            <p className="text-[9px] font-black uppercase text-indigo-200 mb-1">Final Score</p>
            <p className="text-2xl font-black">{data.finalScore}%</p>
          </div>
          <div className="bg-green-50 p-4 rounded-xl text-center">
            <p className="text-[9px] font-black uppercase text-green-600 mb-1">Improvement</p>
            <p className="text-2xl font-black text-green-700">+{data.totalImprovement}%</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl text-center">
            <p className="text-[9px] font-black uppercase text-gray-500 mb-1">Consistency</p>
            <p className="text-lg font-black text-gray-800">{data.consistencyRate}</p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h3 className="text-lg font-black uppercase tracking-wider text-gray-900 border-l-4 border-indigo-600 pl-4 mb-4">AI-Generated Growth Analysis</h3>
        <p className="text-sm leading-relaxed text-gray-700 bg-gray-50 p-6 rounded-2xl italic">"{data.growthAnalysis}"</p>
      </section>

      <section className="mb-10">
        <h3 className="text-lg font-black uppercase tracking-wider text-gray-900 border-l-4 border-indigo-600 pl-4 mb-6">Skill Improvement Breakdown</h3>
        <div className="space-y-4">
          {data.skillBreakdown.map((skill, i) => (
            <div key={i} className="flex items-center space-x-6">
              <div className="w-1/3 text-xs font-bold text-gray-800">{skill.name}</div>
              <div className="flex-1">
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-600 h-full" style={{ width: `${skill.afterScore}%` }} />
                </div>
                <p className="text-[9px] text-gray-500 mt-1">{skill.insight}</p>
              </div>
              <div className="w-16 text-right text-[10px] font-black text-green-600">+{skill.improvement}%</div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-2 gap-8">
        <section>
          <h3 className="text-sm font-black uppercase tracking-wider text-gray-900 mb-4">Key Achievements</h3>
          <ul className="space-y-3">
            {data.keyAchievements.map((ach, i) => (
              <li key={i} className="flex items-start space-x-2 text-xs text-gray-600">
                <span className="text-indigo-600 mt-0.5">•</span>
                <span>{ach}</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="bg-indigo-900 text-white p-6 rounded-2xl">
          <h3 className="text-sm font-black uppercase tracking-wider mb-4">Final Recommendation</h3>
          <p className="text-xs leading-relaxed mb-4 text-indigo-100">{data.finalRecommendation}</p>
          <div className="text-center pt-4 border-t border-indigo-800">
            <p className="text-[8px] font-black uppercase tracking-widest text-indigo-300 mb-1">Status</p>
            <p className="text-sm font-black italic">{data.readinessAssessment}</p>
          </div>
        </section>
      </div>
    </div>
  );
};

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
  
  // Sidebar Toggles
  const [showSkills, setShowSkills] = useState(true);
  const [showSoftSkills, setShowSoftSkills] = useState(true);
  const [showProjects, setShowProjects] = useState(true);
  const [showPathways, setShowPathways] = useState(true);
  const [showStrategic, setShowStrategic] = useState(true);
  
  const [copilotAdvice, setCopilotAdvice] = useState<string | null>(null);
  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});
  
  // Report states
  const [reportData, setReportData] = useState<ProgressReportData | null>(null);
  const [showReportPreview, setShowReportPreview] = useState(false);

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
    setLoading("Creating 4 week vibe-check plan");
    try {
      const transcript = history.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n');
      const plan = await generateRoadmap(transcript, targetPosition, JSON.stringify(initialAnalysis), githubDetails);
      setRoadmap(plan);
      setSidebarOpen(true);
      setStep(AppStep.ROADMAP);
      fetchCopilotAdvice("Generate a starting strategy for my 4-week offensive.");
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
    setReportData(null);
    setShowReportPreview(false);
  };

  const syncToCopilotCalendar = async (title: string, details: string, id: string) => {
    setSyncingTaskId(id);
    const schedulingQuery = `Schedule following task to my Google Calendar: ${title}. Details: ${details}`;
    try {
      const response = await fetch(`${COPILOT_SCRIPT_URL}?q=${encodeURIComponent(schedulingQuery)}`);
      if (response.ok) {
        const result = await response.text();
        console.log("Calendar Sync Result:", result);
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
    const details = `Focus: ${phase.focus}. Tasks: ${phase.tasks.map(t => t.text).join(', ')}`;
    syncToCopilotCalendar(`[Catalyst Phase] ${phase.focus}`, details, `phase-${pIdx}`);
  };

  const handleSyncTask = (taskText: string, phaseTitle: string, id: string) => {
    syncToCopilotCalendar(`[Catalyst Task] ${taskText}`, `Part of focus: ${phaseTitle}`, id);
  };

  const totalTasksCount = roadmap?.thirty_day_plan.reduce((acc, p) => acc + p.tasks.length, 0) || 0;
  const completedCount = Object.values(completedTasks).filter(Boolean).length;
  const progressFactor = totalTasksCount > 0 ? (completedCount / totalTasksCount) : 0;
  const progressPercent = progressFactor * 100;

  const handleGenerateReport = async () => {
    if (!initialAnalysis || !roadmap) return;
    setLoading("Synthesizing Skill Progress Report...");
    try {
      const metSkills = initialAnalysis.skills.filter(s => s.status === 'met').length;
      const initialScore = Math.round((metSkills / initialAnalysis.skills.length) * 100);
      const finalScore = Math.min(100, Math.round(initialScore + (progressFactor * (100 - initialScore))));
      
      const aiResponse = await generateReportAnalysis(
        userName,
        targetPosition,
        initialAnalysis,
        completedCount,
        totalTasksCount,
        progressPercent
      );

      const skillBreakdown: any[] = initialAnalysis.skills.map(s => {
        const isMet = s.status === 'met';
        const start = isMet ? 80 : 20;
        const end = Math.min(100, Math.round(start + (progressFactor * 60)));
        const insight = aiResponse.skillBreakdown?.find((aiS: any) => aiS.name === s.name)?.insight || "Improvement through roadmap dedication.";
        return {
          name: s.name,
          beforeScore: start,
          afterScore: end,
          improvement: end - start,
          insight: insight
        };
      });

      const report: ProgressReportData = {
        userName,
        targetRole: targetPosition,
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        initialScore,
        finalScore,
        totalImprovement: finalScore - initialScore,
        tasksCompleted: completedCount,
        totalTasks: totalTasksCount,
        projectsBuilt: initialAnalysis.project_suggestions.slice(0, 2),
        consistencyRate: progressPercent >= 80 ? "High" : progressPercent >= 40 ? "Moderate" : "Developmental",
        growthAnalysis: aiResponse.growthAnalysis || "Consistent growth across core domains.",
        skillBreakdown,
        keyAchievements: aiResponse.keyAchievements || ["Completed roadmap tasks", "Strategic alignment achieved"],
        readinessAssessment: aiResponse.readinessAssessment || "Intermediate -> Ready",
        finalRecommendation: aiResponse.finalRecommendation || "Pursue industry certification."
      };

      setReportData(report);
      setShowReportPreview(true);
    } catch (e) {
      alert("Report generation failed.");
    } finally {
      setLoading(null);
    }
  };

  const downloadPDF = () => {
    const element = document.getElementById('progress-report-content');
    if (!element) return;
    const opt = {
      margin: 0,
      filename: `${userName}_Catalyst_Progress_Report.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    // @ts-ignore
    html2pdf().set(opt).from(element).save();
  };

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'documentation': return <Bookmark className="w-4 h-4" />;
      case 'practice': return <Code2 className="w-4 h-4" />;
      case 'project': return <FlaskConical className="w-4 h-4" />;
      default: return <Circle className="w-4 h-4" />;
    }
  };

  const getTaskColor = (type: string) => {
    switch (type) {
      case 'documentation': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'practice': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'project': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0E1117] text-[#E6EDF3]">
      {loading && <LoadingOverlay message={loading} />}

      {/* Progress Report Modal */}
      {showReportPreview && reportData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0E1117]/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#161B22] w-full max-w-4xl max-h-[90vh] rounded-3xl border border-[#30363D] shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b border-[#30363D] flex justify-between items-center bg-[#1C2128]">
              <div className="flex items-center space-x-3">
                <Trophy className="w-6 h-6 text-indigo-500" />
                <h2 className="text-xl font-black uppercase italic tracking-tighter">Report Preview</h2>
              </div>
              <div className="flex space-x-3">
                <button onClick={downloadPDF} className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-2xl flex items-center space-x-2 font-bold text-sm transition-all shadow-lg shadow-indigo-600/20">
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
                <button onClick={() => setShowReportPreview(false)} className="p-2.5 hover:bg-[#30363D] rounded-2xl transition-colors">
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-8 bg-[#0E1117]">
              <div className="mx-auto transform scale-90 sm:scale-100 origin-top">
                <ReportTemplate data={reportData} />
              </div>
            </div>
          </div>
        </div>
      )}

      {step !== AppStep.ROADMAP && (
        <header className="py-8 flex flex-col items-center">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-indigo-500 rounded-lg shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">Catalyst AI</h1>
          </div>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.5em] mt-2">Growth Intelligence Layer</p>
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

              <div className="py-4 border-b border-[#30363D]/50 space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-white leading-tight mb-1">{userName}</h2>
                  <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wide">{targetPosition}</p>
                </div>

                <div className="bg-[#0E1117] p-5 rounded-2xl border border-[#30363D] shadow-inner">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300 flex items-center">
                      <BarChart3 className="w-3 h-3 mr-2" /> Growth Index
                    </span>
                    <span className="text-xs font-bold text-white">{Math.round(progressPercent)}%</span>
                  </div>
                  <div className="w-full bg-[#1C2128] h-3 rounded-full overflow-hidden border border-[#30363D]">
                    <div 
                      className="bg-gradient-to-r from-indigo-600 to-indigo-400 h-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <p className="text-[9px] text-gray-500 mt-2 font-medium tracking-tight">Phase momentum tracking active.</p>
                </div>
              </div>

              {/* Progress Report Trigger */}
              <button 
                onClick={handleGenerateReport}
                className="w-full bg-gradient-to-br from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white p-4 rounded-2xl flex items-center justify-between group transition-all shadow-lg shadow-indigo-600/10"
              >
                <div className="flex items-center space-x-3">
                  <Award className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest text-indigo-100">Export Report</p>
                    <p className="text-[8px] text-indigo-200">Synthesize career metrics</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>

              {copilotAdvice && (
                <div className="bg-indigo-600/10 border border-indigo-500/30 p-4 rounded-2xl relative group overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity cursor-pointer" onClick={() => fetchCopilotAdvice("Give me fresh advice.")}>
                    <RotateCcw className="w-3 h-3 text-indigo-400" />
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <MessageSquare className="w-3 h-3 text-indigo-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Strategy Insight</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-gray-300 italic">"{copilotAdvice}"</p>
                </div>
              )}

              {/* Proficiency Matrix (Technical) */}
              <div className="space-y-3">
                <button onClick={() => setShowSkills(!showSkills)} className="w-full flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:text-white transition-colors">
                  <span className="flex items-center"><Cpu className="w-3.5 h-3.5 mr-2" /> Technical Matrix</span>
                  {showSkills ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>}
                </button>
                {showSkills && initialAnalysis && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                    {initialAnalysis.skills.filter(s => s.type === 'technical').map((skill, i) => {
                      const isMet = skill.status === 'met';
                      const baseProficiency = isMet ? 80 : 20;
                      const proficiency = Math.min(100, baseProficiency + (progressFactor * 60));
                      const isMastered = proficiency >= 90;

                      return (
                        <div key={i} className="space-y-1.5">
                          <div className="flex justify-between items-center px-1">
                            <span className="text-[10px] font-bold text-gray-300 uppercase flex items-center">
                              <Circle className={`w-1.5 h-1.5 mr-2 ${isMastered ? 'text-green-500 fill-green-500' : 'text-indigo-400'}`} />
                              {skill.name}
                            </span>
                            <span className="text-[9px] font-black text-gray-500 uppercase">{Math.round(proficiency)}%</span>
                          </div>
                          <div className="w-full bg-[#0E1117] h-1.5 rounded-full overflow-hidden border border-[#30363D]">
                            <div 
                              className={`h-full transition-all duration-1000 ${isMastered ? 'bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]' : 'bg-indigo-500'}`} 
                              style={{ width: `${proficiency}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Soft Skills Section */}
              <div className="space-y-3">
                <button onClick={() => setShowSoftSkills(!showSoftSkills)} className="w-full flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:text-white transition-colors">
                  <span className="flex items-center"><Heart className="w-3.5 h-3.5 mr-2" /> Soft Skills</span>
                  {showSoftSkills ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>}
                </button>
                {showSoftSkills && initialAnalysis && (
                  <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2">
                    {initialAnalysis.skills.filter(s => s.type === 'soft').map((skill, i) => (
                      <span key={i} className={`text-[10px] px-2 py-1 rounded-md border flex items-center space-x-1 ${skill.status === 'met' ? 'bg-pink-500/5 border-pink-500/20 text-pink-400' : 'bg-[#0E1117] border-[#30363D] text-gray-500'}`}>
                         {skill.status === 'met' ? <CheckCircle2 className="w-2.5 h-2.5"/> : <Circle className="w-2.5 h-2.5 opacity-20"/>}
                         <span>{skill.name}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Project Initiatives Section */}
              <div className="space-y-3">
                <button onClick={() => setShowProjects(!showProjects)} className="w-full flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:text-white transition-colors">
                  <span className="flex items-center"><Briefcase className="w-3.5 h-3.5 mr-2" /> Project Ideas</span>
                  {showProjects ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>}
                </button>
                {showProjects && initialAnalysis && (
                  <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
                    {initialAnalysis.project_suggestions.map((project, i) => (
                      <div key={i} className="bg-[#0E1117] p-3 rounded-xl border border-[#30363D] hover:border-indigo-500/50 transition-colors group">
                        <div className="flex items-start space-x-2">
                          <div className="mt-0.5 p-1 bg-indigo-500/10 rounded">
                            <Zap className="w-3 h-3 text-indigo-400" />
                          </div>
                          <p className="text-[10px] text-gray-300 leading-relaxed font-medium">{project}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Trajectory Mapping (Job Pathways) */}
              <div className="space-y-3">
                <button onClick={() => setShowPathways(!showPathways)} className="w-full flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:text-white transition-colors">
                  <span className="flex items-center"><Map className="w-3.5 h-3.5 mr-2" /> Trajectory Mapping</span>
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

              {/* Strategic Suggestions Section */}
              <div className="space-y-3 pb-6">
                <button onClick={() => setShowStrategic(!showStrategic)} className="w-full flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest hover:text-white transition-colors">
                  <span className="flex items-center"><Lightbulb className="w-3.5 h-3.5 mr-2" /> Recommendations</span>
                  {showStrategic ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>}
                </button>
                {showStrategic && initialAnalysis && (
                  <ul className="space-y-2 px-1 animate-in fade-in slide-in-from-top-2">
                    {initialAnalysis.other_suggestions.map((s, i) => (
                      <li key={i} className="text-[10px] text-gray-400 leading-tight flex items-start">
                        <span className="text-yellow-500 mr-2 shrink-0">•</span> {s}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

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
            
            {step === AppStep.SETUP && (
              <div className="max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Strategy Calibration Hub</h2>
                  <p className="text-gray-500 text-sm">Upload documentation to synchronize your professional trajectory.</p>
                </div>
                <div className="bg-[#161B22] p-8 rounded-3xl border border-[#30363D] space-y-6 shadow-2xl relative">
                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <label className="text-xs font-bold text-gray-500 uppercase mb-2 ml-1">Candidate Name</label>
                      <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Full Name" className="bg-[#0E1117] border border-[#30363D] rounded-2xl px-5 py-4 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all"/>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FileUploader label="Professional Resume" onFileSelect={setResumeFile} selectedFile={resumeFile} />
                      <FileUploader label="LinkedIn Data (PDF)" onFileSelect={setLinkedinFile} selectedFile={linkedinFile} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input type="text" value={githubUsername} onChange={(e) => setGithubUsername(e.target.value)} placeholder="GitHub Username" className="bg-[#0E1117] border border-[#30363D] rounded-2xl px-5 py-4 text-white focus:border-indigo-500 outline-none"/>
                      <input type="text" value={targetPosition} onChange={(e) => setTargetPosition(e.target.value)} placeholder="Target Role" className="bg-[#0E1117] border border-[#30363D] rounded-2xl px-5 py-4 text-white focus:border-indigo-500 outline-none"/>
                    </div>
                  </div>
                  <button onClick={handleInitialize} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-5 rounded-2xl flex items-center justify-center space-x-2 transition-all uppercase tracking-widest italic shadow-lg shadow-indigo-600/20 active:scale-[0.98]">
                    <span>Initiate Catalyst Sync</span>
                    <ChevronRight className="w-5 h-5"/>
                  </button>
                </div>
              </div>
            )}

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

            {step === AppStep.ROADMAP && roadmap && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-700 pb-20">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#30363D]/50">
                  <div className="space-y-2">
                    <h3 className="text-4xl font-black text-white uppercase italic tracking-tighter flex items-center">
                      <Calendar className="w-10 h-10 mr-4 text-indigo-500" /> 4-Week Growth Offensive
                    </h3>
                    <p className="text-gray-400">A structured weekly tactical roadmap for <span className="text-white font-bold">{userName}</span>.</p>
                  </div>
                  <div className="bg-[#161B22] px-5 py-3 rounded-2xl border border-[#30363D] flex items-center space-x-3">
                    <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Phase Active</span>
                  </div>
                </div>

                <div className="space-y-16">
                  {roadmap.thirty_day_plan.map((phase, idx) => {
                    const phaseTasks = phase.tasks;
                    const phaseCompleted = phaseTasks.filter((_, tidx) => completedTasks[`${idx}-${tidx}`]).length;
                    const phaseProgress = (phaseCompleted / phaseTasks.length) * 100;
                    const isSyncingPhase = syncingTaskId === `phase-${idx}`;

                    return (
                      <div key={idx} className="group">
                        <div className="flex items-center space-x-6 mb-6">
                          <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-500/20 rounded-3xl flex items-center justify-center text-xl font-black italic text-indigo-400 shrink-0">W{idx + 1}</div>
                          <div className="flex-1">
                            <div className="flex justify-between items-end mb-2">
                              <div className="flex items-center space-x-3">
                                <h4 className="text-2xl font-black text-white uppercase group-hover:text-indigo-400 transition-colors">{phase.focus}</h4>
                                <button 
                                  onClick={() => handleSyncPhase(phase, idx)}
                                  disabled={isSyncingPhase}
                                  title="Sync week to calendar"
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

                        {/* Phase Content: Documentation & Tasks */}
                        <div className="ml-4 pl-8 border-l-2 border-indigo-500/10 space-y-8">
                          
                          {/* Official Documentation Section */}
                          <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                              <ShieldCheck className="w-4 h-4 text-indigo-400" />
                              <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400/80">Verified Documentation & Resources</h5>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {phase.documentation.map((doc, docIdx) => (
                                <a 
                                  key={docIdx} 
                                  href={doc.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="bg-[#161B22] border border-[#30363D] rounded-2xl p-4 hover:border-indigo-500/50 hover:bg-[#1C2128] transition-all group/doc flex flex-col justify-between"
                                >
                                  <div>
                                    <div className="flex justify-between items-start mb-2">
                                      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded border border-indigo-500/20 text-indigo-300 uppercase`}>{doc.difficulty}</span>
                                      <ExternalLink className="w-3 h-3 text-gray-500 group-hover/doc:text-indigo-400 transition-colors" />
                                    </div>
                                    <h6 className="text-xs font-bold text-gray-100 mb-2 line-clamp-2">{doc.title}</h6>
                                    <p className="text-[9px] text-gray-500 font-medium mb-4">{doc.type}</p>
                                  </div>
                                  
                                  <div className="flex items-center justify-between pt-3 border-t border-[#30363D]">
                                    <div className="flex items-center space-x-2 text-[9px] text-gray-400">
                                      <Clock className="w-3 h-3" />
                                      <span>{doc.estimatedReadTime}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Zap className="w-3 h-3 text-amber-400" />
                                      <span className="text-[9px] font-bold text-amber-400">{doc.relevanceScore}/10</span>
                                    </div>
                                  </div>
                                </a>
                              ))}
                            </div>
                          </div>

                          {/* Actionable Tasks */}
                          <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                              <Zap className="w-4 h-4 text-indigo-400" />
                              <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400/80">Weekly Growth Objectives</h5>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 border-2 transition-all ${isDone ? 'bg-indigo-500 border-indigo-500 scale-110' : 'bg-[#0E1117] border-[#30363D]'}`}>
                                        {isDone ? <CheckCircle2 className="w-4 h-4 text-white"/> : <div className={getTaskColor(task.type)}>{getTaskIcon(task.type)}</div>}
                                      </div>
                                      <div className="flex-1 space-y-1">
                                        <div className="flex items-center space-x-2">
                                          <span className={`text-[9px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded border ${getTaskColor(task.type)}`}>{task.type}</span>
                                        </div>
                                        <span className={`text-sm font-semibold leading-relaxed flex-1 ${isDone ? 'text-gray-500 line-through decoration-indigo-500/30' : 'text-gray-200'}`}>{task.text}</span>
                                      </div>
                                    </div>
                                    <button 
                                      onClick={(e) => { e.stopPropagation(); handleSyncTask(task.text, phase.focus, taskId); }}
                                      disabled={isSyncingTask}
                                      className="absolute top-4 right-4 p-2 bg-[#0E1117]/80 rounded-xl border border-[#30363D] opacity-0 group-hover/task:opacity-100 transition-all hover:bg-indigo-600 hover:border-indigo-500 disabled:opacity-50"
                                      title="Schedule to calendar"
                                    >
                                      {isSyncingTask ? <Loader2 className="w-3.5 h-3.5 text-white animate-spin" /> : <Calendar className="w-3.5 h-3.5 text-indigo-400 group-hover/task:text-white" />}
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

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
          <p className="text-gray-700 text-[10px] font-black uppercase tracking-[0.5em]">Catalyst AI Growth Intelligence v6.2</p>
        </footer>
      )}
    </div>
  );
};

export default App;
