import React, { useState, useRef, useEffect } from "react";
import { 
  Scale, FileText, Send, BookOpen, Clock, Users, ShieldAlert,
  HelpCircle, ChevronRight, Download, Copy, Check, RotateCcw, 
  Layers, Hammer, Sparkles, Building, Landmark, Compass, Shield,
  Mic, MicOff, History, Trash2, Archive, FolderOpen, X, Printer, Eye
} from "lucide-react";
import { SAMPLE_CASES, SampleCase } from "./utils/samples";
import { CaseAnalysisResponse, CaseHistoryItem } from "./types";
import StageExplorer from "./components/StageExplorer";
import { generatePDF } from "./utils/pdfGenerator";
import NeumLexLogo from "./components/NeumLexLogo";

export default function App() {
  const [factPattern, setFactPattern] = useState<string>("");
  const [focusDomain, setFocusDomain] = useState<string>("Auto-detect");
  const [selectedSample, setSelectedSample] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<number>(0);
  const [analysisResult, setAnalysisResult] = useState<CaseAnalysisResponse | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);

  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const [history, setHistory] = useState<CaseHistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("neumlex_case_history");
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to read case history from localStorage:", e);
    }
  }, []);

  const saveToHistory = (analysis: CaseAnalysisResponse, facts: string, domain: string) => {
    try {
      const newItem: CaseHistoryItem = {
        id: `case_${Date.now()}`,
        timestamp: Date.now(),
        title: analysis.stage2.primaryAct || "Civil Suit Analysis",
        primaryDomain: analysis.stage1.primaryDomain,
        courtLevel: analysis.stage5.pecuniary.courtLevel,
        isTimeBarred: analysis.stage3.isTimeBarred,
        factPattern: facts,
        focusDomain: domain,
        analysis: analysis
      };

      setHistory(prev => {
        // Remove same/similar fact patterns from history list to prevent duplication
        const filtered = prev.filter(item => item.factPattern.trim() !== facts.trim());
        const updated = [newItem, ...filtered].slice(0, 10);
        localStorage.setItem("neumlex_case_history", JSON.stringify(updated));
        return updated;
      });
    } catch (e) {
      console.error("Failed to save history to localStorage:", e);
    }
  };

  const handleLoadHistoryItem = (item: CaseHistoryItem) => {
    setAnalysisResult(item.analysis);
    setFactPattern(item.factPattern);
    setFocusDomain(item.focusDomain);
    setIsHistoryOpen(false);
  };

  const handleDeleteHistoryItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setHistory(prev => {
      const updated = prev.filter(item => item.id !== id);
      localStorage.setItem("neumlex_case_history", JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearHistory = () => {
    localStorage.removeItem("neumlex_case_history");
    setHistory([]);
    setIsHistoryOpen(false);
  };

  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSpeechError("Speech recognition not supported in this browser. Please try Chrome or Safari.");
      return;
    }

    setSpeechError(null);

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      try {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = false;
        rec.lang = "en-US";

        rec.onstart = () => {
          setIsListening(true);
        };

        rec.onresult = (event: any) => {
          const current = event.resultIndex;
          const transcript = event.results[current][0].transcript;
          if (transcript) {
            setFactPattern(prev => prev + (prev ? " " : "") + transcript);
          }
        };

        rec.onerror = (event: any) => {
          console.error("Speech Recognition error:", event.error);
          if (event.error === "not-allowed") {
            setSpeechError("Microphone permission denied. Enable microphone access in browser settings.");
          } else {
            setSpeechError(`Speech Recognition error: ${event.error}`);
          }
          setIsListening(false);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
        rec.start();
      } catch (e: any) {
        console.error("Failed to start Speech Recognition", e);
        setSpeechError("Failed to initiate microphone audio stream.");
        setIsListening(false);
      }
    }
  };

  // Cleanup speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Simulated progressive loader messages matching BCCAA stages
  const loadingSteps = [
    { title: "Stage 0: Structuring Fact Matrix Chronology...", desc: "Extracting chronological sequences, separating admitted vs. disputed facts." },
    { title: "Stage 1: Determining Civil Jurisdictional Domain...", desc: "Evaluating contracts, torts, partition, specific relief, and tenancy lines." },
    { title: "Stage 2: Cross-referencing Subsidiary Acts & Precedents...", desc: "Mapping relevant sections from CPC, TP Act, SRA, and Limitation Act." },
    { title: "Stage 3: Running Critical Limitation First Check...", desc: "Calculating accrual dates, prescribed schedule periods, and s.18 exceptions." },
    { title: "Stage 4: Auditing Legal Capacity & Locus Standi...", desc: "Pinpointing natural/juristic identities, necessary joinders under Order I CPC." },
    { title: "Stage 5: Determining Competent Suit Forums...", desc: "Assessing Territorial boundaries and Pecuniary levels (15L / 25L / 1C limits)." },
    { title: "Stage 6: Verifying Pleadings Defences & O.VII R.11 rules...", desc: "Auditing plaint rejections, specific written statement denials, and set-offs." },
    { title: "Stage 7 & 8: Formulating Judicial Issues & Evidence Maps...", desc: "Drafting issues of fact/law and mapping admissibility gates of the Evidence Act." },
    { title: "Stage 9: Structuring Two-Sided Trial Contest Arguments...", desc: "Evaluating plaintiff positions, defendant objections, and court weight matrix." },
    { title: "Stage 10: Applying Equitable Defences & Specific Relief Limits...", desc: "Testing clean hands, laches, and SRA discretionary barriers on the claim." },
    { title: "Stage 11 & 12: Charting Civil Lifecycles & Appellate Nodes...", desc: "Preparing CPC stages from institution to execution and future revision nodes." },
    { title: "Stage 13: Compiling Final Jurisprudential Synthesis...", desc: "Drafting decree terms, cost apportionments, and execution structures." }
  ];

  const handleSelectSample = (sampleId: string) => {
    setSelectedSample(sampleId);
    if (!sampleId) {
      setFactPattern("");
      setFocusDomain("Auto-detect");
      return;
    }
    const sample = SAMPLE_CASES.find(s => s.id === sampleId);
    if (sample) {
      setFactPattern(sample.factPattern);
      setFocusDomain(sample.category);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!factPattern.trim()) return;

    setLoading(true);
    setApiError(null);
    setAnalysisResult(null);
    setLoadingStep(0);

    // Simulate progressive stage analysis updates
    const interval = setInterval(() => {
      setLoadingStep(prev => {
        if (prev < loadingSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1500);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          factPattern,
          focusDomain
        }),
      });

      if (!response.ok) {
        let errorMessage = "Failed to analyze case.";
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          try {
            const errorText = await response.text();
            errorMessage = errorText || errorMessage;
          } catch {}
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setAnalysisResult(data);
      saveToHistory(data, factPattern, focusDomain);
    } catch (err: any) {
      console.error(err);
      setApiError(err.message || "An error occurred during suit analysis.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const handleCopyReport = () => {
    if (!analysisResult) return;
    const textToCopy = JSON.stringify(analysisResult, null, 2);
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    setIsPrintModalOpen(true);
  };

  const handleExportPDF = () => {
    if (analysisResult) {
      generatePDF(analysisResult, factPattern);
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setFactPattern("");
    setSelectedSample("");
    setFocusDomain("Auto-detect");
    setApiError(null);
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Editorial Top Bar / Navigation */}
      <header className="border-b border-[#E5E1D8] bg-[#1E252B] text-[#FDFBF7] py-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
            <div className="bg-white p-2.5 rounded-md border border-[#E5E1D8]/20 flex-shrink-0 shadow-md">
              <NeumLexLogo variant="icon" size="sm" className="w-[48px] h-[48px]" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 text-[#C5A059]">
                <Scale className="h-4.5 w-4.5 stroke-[1.5]" />
                <span className="text-xs font-mono font-bold tracking-widest uppercase">Jurisprudential Analytical Engine</span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight font-display text-white">
                Bangladesh Civil Case Analysis Architecture
              </h1>
              <p className="text-xs text-[#E5E1D8]/70 font-mono tracking-wide">
                BCCAA — STAGE 0 to STAGE 13 SEQUENTIAL DECISION CASCADE
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[11px] text-[#C5A059] font-mono">
                <span className="inline-flex items-center gap-1.5 bg-[#C5A059]/10 px-2 py-0.5 rounded border border-[#C5A059]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse"></span>
                  <strong>Engine Rights & IP Proprietor:</strong> Md. Nazmul Islam, Advocate, Supreme Court of Bangladesh
                </span>
                <span className="inline-flex items-center gap-1.5 bg-[#C5A059]/15 px-2 py-0.5 rounded text-white border border-[#C5A059]/30">
                  Head of Neum Lex Counsel
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 self-end md:self-center">
            <div className="text-right hidden sm:block">
              <div className="text-[10px] font-mono opacity-65 uppercase">Authorized Legal Portal</div>
              <div className="text-xs text-[#C5A059] font-semibold font-mono">CPC & Evidence Act Config</div>
            </div>
            <div className="h-8 w-px bg-neutral-700 hidden sm:block"></div>
            <button
              onClick={() => setIsHistoryOpen(true)}
              className="px-3.5 py-1.5 rounded bg-neutral-800 hover:bg-[#C5A059]/25 text-[#E5E1D8] hover:text-white border border-neutral-700 hover:border-[#C5A059]/50 text-xs font-mono font-bold tracking-wider uppercase transition flex items-center gap-2 cursor-pointer no-print"
              title="Show previously analyzed case history"
            >
              <History className="h-4 w-4 text-[#C5A059]" />
              <span>Archive ({history.length})</span>
            </button>
            <span className="px-2.5 py-1 rounded bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/30 text-[10px] font-mono tracking-wider font-semibold uppercase">
              Court-Grade v1.4
            </span>
          </div>
        </div>
      </header>

      {/* Main Workspace Stage */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 mt-8 space-y-8">
        
        {/* Input workspace if no result */}
        {!analysisResult && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Input Form Column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="legal-card p-6 rounded-md">
                <div className="border-b border-[#E5E1D8] pb-4 mb-4">
                  <h2 className="text-lg font-bold legal-hdr flex items-center gap-2 text-[#1E252B]">
                    <Building className="h-5 w-5 text-[#C5A059]" />
                    Assemble Litigation Fact Pattern
                  </h2>
                  <p className="text-xs text-[#4A5560] mt-1">
                    Describe the raw chronology, agreements, possession dates, or violations. Pleading details enable high-gravity specific evaluations.
                  </p>
                </div>

                <form onSubmit={handleAnalyze} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold font-mono text-[#1E252B] uppercase tracking-wider mb-2">
                      1. Choose Sample Case or Input Custom
                    </label>
                    <select
                      value={selectedSample}
                      onChange={(e) => handleSelectSample(e.target.value)}
                      className="w-full text-xs p-2.5 bg-[#FDFBF7] border border-[#E5E1D8] rounded focus:outline-none focus:border-[#C5A059] font-medium text-[#1E252B] hover:border-neutral-400 cursor-pointer"
                    >
                      <option value="">-- [ New Custom Pleading Fact Pattern ] --</option>
                      {SAMPLE_CASES.map(sc => (
                        <option key={sc.id} value={sc.id}>
                          {sc.title} ({sc.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-bold font-mono text-[#1E252B] uppercase tracking-wider">
                          2. Statement of Facts (Chronology & Dispute Merits)
                        </label>
                        <button
                          type="button"
                          onClick={toggleListening}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[10px] font-mono font-bold tracking-wider transition-all cursor-pointer border ${
                            isListening
                              ? "bg-red-50 text-red-600 border-red-300 animate-pulse"
                              : "bg-[#FDFBF7] hover:bg-[#C5A059]/15 text-[#4A5560] hover:text-[#1E252B] border-[#E5E1D8]"
                          }`}
                          title="Dictate Case Details (Speech to Text)"
                        >
                          {isListening ? (
                            <>
                              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
                              <MicOff className="h-3.5 w-3.5 text-red-600" />
                              <span>Stop Dictating</span>
                            </>
                          ) : (
                            <>
                              <Mic className="h-3.5 w-3.5 text-[#C5A059]" />
                              <span>Dictate / voice</span>
                            </>
                          )}
                        </button>
                      </div>
                      <span className="text-[10px] font-mono opacity-60">
                        {factPattern.length} chars
                      </span>
                    </div>

                    {speechError && (
                      <p className="text-[11px] text-red-600 font-mono mb-2 bg-red-50 p-2.5 rounded border border-red-100 animate-fadeIn">
                        ⚠️ {speechError}
                      </p>
                    )}

                    <textarea
                      value={factPattern}
                      onChange={(e) => {
                        setFactPattern(e.target.value);
                        setSelectedSample(""); // Clear selected if modified
                      }}
                      required
                      placeholder="Input chronological list, transaction dates, deed numbers, registry parameters, or dispute points..."
                      rows={12}
                      className="w-full text-xs font-mono p-4 bg-[#FDFBF7] border border-[#E5E1D8] rounded focus:outline-none focus:border-[#C5A059] text-[#1E252B] leading-relaxed resize-y max-h-[70vh] shadow-inner"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold font-mono text-[#1E252B] uppercase tracking-wider mb-1.5">
                        Civil Domain Scope
                      </label>
                      <select
                        value={focusDomain}
                        onChange={(e) => setFocusDomain(e.target.value)}
                        className="w-full text-xs p-2.5 bg-[#FDFBF7] border border-[#E5E1D8] rounded focus:outline-none focus:border-[#C5A059] font-mono text-[#1E252B]"
                      >
                        <option value="Auto-detect">Auto-detect (Recommended)</option>
                        <option value="Agreement / Specific Performance (SRA s.12)">Specific Performance (SRA 1877 s.12)</option>
                        <option value="Declaration of Title & Joint Partition">Declaration of Title & Partition</option>
                        <option value="Commercial or Residential Tenancy Eviction">Commercial Tenancy / Eviction</option>
                        <option value="Contract Damage Claims & Recovery of Money">Recovery of Money / Damages</option>
                        <option value="Injunction / Threatened Civil Injury">Injunction (SRA 1877 ss.52-57)</option>
                      </select>
                    </div>

                    <div className="flex items-end">
                      <button
                        type="submit"
                        disabled={loading || !factPattern.trim()}
                        className="w-full py-3 bg-[#1E252B] hover:bg-[#C5A059] text-white hover:text-[#1E252B] disabled:bg-neutral-300 disabled:text-neutral-500 font-bold uppercase text-xs tracking-wider font-mono rounded border border-[#1E252B] hover:border-[#C5A059] transition-all duration-200 flex items-center justify-center gap-2 shadow cursor-pointer"
                      >
                        {loading ? (
                          <>
                            <Hammer className="h-4 w-4 animate-spin text-[#C5A059]" />
                            Running Sequential Cascades...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4" />
                            Analyze Civil Case
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>

                {apiError && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-900 rounded-md text-xs leading-relaxed flex items-start gap-2.5">
                    <ShieldAlert className="h-4 w-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Analysis Terminated:</span> {apiError}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Instruction Column */}
            <div className="lg:col-span-1 space-y-6">
              {/* RESTORABLE RECENT CASES (CABINET) */}
              {history.length > 0 && (
                <div className="legal-card p-5 rounded-md bg-white border-t-4 border-[#C5A059] animate-fadeIn space-y-3 shadow-sm border border-[#E5E1D8]/60">
                  <div className="flex items-center justify-between border-b border-[#E5E1D8] pb-2">
                    <h3 className="text-xs font-mono font-bold text-[#1E252B] uppercase tracking-wider flex items-center gap-1.5">
                      <History className="h-4 w-4 text-[#C5A059]" />
                      Case History Archive
                    </h3>
                    <span className="text-[10px] bg-[#C5A059]/15 text-[#C5A059] px-2 py-0.5 rounded font-mono font-bold border border-[#C5A059]/25">
                      {history.length} Saved
                    </span>
                  </div>
                  <p className="text-[11px] text-[#4A5560] leading-relaxed">
                    Quick-load your recently evaluated pleadings and court analysis matrices from your browser's local cache.
                  </p>
                  
                  <div className="divide-y divide-[#E5E1D8]/60 max-h-72 overflow-y-auto pr-1 space-y-2 pt-1">
                    {history.map(item => (
                      <div 
                        key={item.id} 
                        onClick={() => handleLoadHistoryItem(item)}
                        className="group flex flex-col gap-1 p-2 rounded -mx-2 hover:bg-[#FDFBF7] border border-transparent hover:border-[#E5E1D8]/40 transition cursor-pointer text-left focus-within:ring-1 focus-within:ring-[#C5A059] focus-within:ring-opacity-45"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            handleLoadHistoryItem(item);
                          }
                        }}
                      >
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-xs font-bold text-[#1E252B] group-hover:text-[#C5A059] line-clamp-1 transition duration-150 font-serif">
                            {item.title}
                          </span>
                          <button 
                            onClick={(e) => handleDeleteHistoryItem(e, item.id)}
                            className="text-neutral-300 hover:text-red-500 hover:bg-red-50 p-1 rounded transition cursor-pointer flex-shrink-0"
                            title="Delete case from archive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] text-[#4A5560] line-clamp-2 italic pr-2 leading-relaxed">
                          "{item.factPattern}"
                        </p>
                        <div className="flex items-center justify-between mt-1 text-[9px] font-mono border-t border-dashed border-[#E5E1D8]/40 pt-1">
                          <span className="text-[#C5A059] uppercase font-bold tracking-wider">
                            {item.primaryDomain.split(" ")[0]}
                          </span>
                          <span className="text-neutral-400">
                            {new Date(item.timestamp).toLocaleDateString(undefined, {month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"})}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-[#E5E1D8]">
                    <button
                      onClick={handleClearHistory}
                      className="w-full py-1.5 text-center text-[10px] font-mono font-bold text-neutral-400 hover:text-red-600 bg-neutral-50 hover:bg-red-50 rounded border border-neutral-100 hover:border-red-100 transition cursor-pointer uppercase tracking-wider"
                    >
                      Clear Saved Cabinet ({history.length})
                    </button>
                  </div>
                </div>
              )}

              <div className="legal-card p-6 rounded-md bg-white">
                <h3 className="text-xs font-mono font-bold text-[#C5A059] uppercase tracking-widest mb-3">Architectural Protocol</h3>
                <h4 className="text-md font-bold legal-hdr text-[#1E252B]">The BCCAA 14-Stage Framework</h4>
                <p className="text-xs text-[#4A5560] mt-1.5 leading-relaxed">
                  BCCAA processes fact patterns sequentially based on statutory laws, civil codes, and rules of the Supreme Court of Bangladesh. It follows strict structural limits:
                </p>

                <div className="mt-4 space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded bg-[#FDFBF7] border border-[#E5E1D8] text-[9px] font-mono text-center font-bold text-[#1E252B] flex items-center justify-center flex-shrink-0 mt-0.5">
                      0
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] font-bold text-[#1E252B] block leading-none">Evidence Status Matrix (Stage 0)</span>
                      <span className="text-[10px] text-[#4A5560]">Triage chronological evidence vectors.</span>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded bg-[#FDFBF7] border border-[#E5E1D8] text-[9px] font-mono text-center font-bold text-[#1E252B] flex items-center justify-center flex-shrink-0 mt-0.5">
                      3
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] font-bold text-[#1E252B] block leading-none">Limitation Mandatory Audit (Stage 3)</span>
                      <span className="text-[10px] text-[#4A5560]">Check First. Evaluate statutory time limits.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded bg-[#FDFBF7] border border-[#E5E1D8] text-[9px] font-mono text-center font-bold text-[#1E252B] flex items-center justify-center flex-shrink-0 mt-0.5">
                      5
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] font-bold text-[#1E252B] block leading-none">Forum Pecuniary Scaling (Stage 5)</span>
                      <span className="text-[10px] text-[#4A5560]">Determines Joint District vs. Assistant levels.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 rounded bg-[#FDFBF7] border border-[#E5E1D8] text-[9px] font-mono text-center font-bold text-[#1E252B] flex items-center justify-center flex-shrink-0 mt-0.5">
                      9
                    </div>
                    <div className="min-w-0">
                      <span className="text-[11px] font-bold text-[#1E252B] block leading-none">Merits Adversary Analysis (Stage 9)</span>
                      <span className="text-[10px] text-[#4A5560]">Contest claims and weight evidence per issue.</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-[#E5E1D8] text-[11px] font-mono text-[#C5A059] space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Landmark className="h-4.5 w-4.5" />
                    <span>Governed under Supreme Court of Bangladesh directives</span>
                  </div>
                  <div className="text-[11px] text-[#1E252B] leading-normal font-sans pl-6 border-l border-[#C5A059]/30">
                    <span className="font-bold block">Md. Nazmul Islam</span>
                    <span className="text-[10px] text-neutral-500 block">Advocate, Supreme Court of Bangladesh</span>
                    <span className="text-[10px] text-[#C5A059] font-mono uppercase block mt-1">Head of Neum Lex Counsel</span>
                  </div>
                </div>
              </div>

              {/* Sample Quick Loader Card */}
              {selectedSample && (
                <div className="legal-card p-4 rounded-md bg-[#FDFBF7] border-l-4 border-[#C5A059] animate-fadeIn">
                  <span className="text-[9px] font-mono font-bold tracking-wider text-[#C5A059] uppercase block">Selected Suit Sample</span>
                  <span className="text-xs font-bold text-[#1E252B] block mt-1">
                    {SAMPLE_CASES.find(s => s.id === selectedSample)?.title}
                  </span>
                  <p className="text-[11px] text-[#4A5560] mt-1 leading-relaxed">
                    {SAMPLE_CASES.find(s => s.id === selectedSample)?.description}
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* LOADING ANIMATED PROGRESSIVE OVERLAY */}
        {loading && (
          <div className="legal-card p-8 rounded-md bg-white max-w-2xl mx-auto border-t-8 border-t-[#C5A059] text-center space-y-6 shadow-lg">
            
            {/* Elegant Logo with spinning ornamental pulse */}
            <div className="relative inline-block mx-auto">
              <div className="absolute inset-0 bg-[#C5A059]/10 rounded-full animate-ping scale-75"></div>
              <div className="bg-white p-4 rounded-full shadow-md border border-[#E5E1D8] flex items-center justify-center relative z-10">
                <NeumLexLogo variant="icon" size="sm" className="w-[52px] h-[52px] animate-pulse" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-bold legal-hdr text-[#1E252B]">Applying BCCAA Stage-by-Stage Processors</h3>
              <p className="text-xs text-[#C5A059] font-mono font-bold uppercase tracking-widest">
                Processing Node {loadingStep + 1} of {loadingSteps.length}
              </p>
              <p className="text-[11px] text-neutral-400 font-mono">
                Supreme Court of Bangladesh Civil Cascade Engine • Proprietary of Md. Nazmul Islam
              </p>
            </div>

            {/* Simulated stage card */}
            <div className="bg-[#FDFBF7] border border-[#E5E1D8] p-4 rounded text-left space-y-1.5 transition-all">
              <div className="text-xs font-bold text-[#1E252B] font-mono uppercase tracking-wider flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping"></span>
                {loadingSteps[loadingStep].title}
              </div>
              <p className="text-xs text-[#4A5560] leading-relaxed pl-5">
                {loadingSteps[loadingStep].desc}
              </p>
            </div>

            <div className="space-y-1.5">
              {/* Progress Bar */}
              <div className="w-full bg-[#E5E1D8] h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-[#1E252B] h-full transition-all duration-500" 
                  style={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
                ></div>
              </div>
              <div className="text-[10px] font-mono text-[#4A5560] flex justify-between">
                <span>STG 0: FACT MATRIX INITIALIZATION</span>
                <span>STG 13: COMPILATION COMPLETE</span>
              </div>
            </div>
          </div>
        )}

        {/* ANALYSIS READY WORKSPACE */}
        {analysisResult && !loading && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Command & Control Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-[#F9F7F2] border border-[#E5E1D8] rounded-md gap-4 no-print">
              <div className="space-y-0.5">
                <div className="text-[10px] font-mono text-[#C5A059] font-bold uppercase tracking-wider">Analysis complete</div>
                <h3 className="text-sm font-bold text-[#1E252B]">Sequential Cascade Complete for Case Suit</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleCopyReport}
                  className="px-3 py-1.5 text-xs font-mono font-medium rounded bg-white hover:bg-neutral-50 border border-[#E5E1D8] text-[#1E252B] flex items-center gap-1.5 transition cursor-pointer"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? "JSON Copied" : "Copy Raw JSON"}
                </button>
                <button
                  onClick={handleExportPDF}
                  className="px-3 py-1.5 text-xs font-mono font-bold rounded bg-[#C5A059] hover:bg-[#b08b47] text-white flex items-center gap-1.5 transition cursor-pointer shadow-sm"
                >
                  <FileText className="h-3.5 w-3.5" />
                  Export Professional PDF
                </button>
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 text-xs font-mono font-bold rounded bg-neutral-800 hover:bg-[#C5A059] hover:text-[#21272c] text-white border border-neutral-700 hover:border-[#C5A059] flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Printer className="h-3.5 w-3.5 text-[#C5A059]" />
                  Print Review
                </button>
                <button
                  onClick={handleReset}
                  className="px-3 py-1.5 text-xs font-mono font-bold rounded bg-[#4A5560] hover:bg-[#1E252B] text-white flex items-center gap-1.5 transition cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  New Analysis
                </button>
              </div>
            </div>

            {/* Case Preview Card / Summary Banner */}
            <div className="legal-card p-6 rounded-md bg-white relative overflow-hidden border-l-8 border-l-[#C5A059]">
              <div className="absolute right-4 top-4 hidden md:block opacity-10">
                <Scale className="w-24 h-24 stroke-[1]" />
              </div>
              <div className="flex flex-wrap justify-between items-start gap-4">
                <div>
                  <div className="text-xs font-mono font-semibold text-[#C5A059] uppercase tracking-wider">BCCAA Case Brief Summary</div>
                  <h2 className="text-xl sm:text-2xl font-bold legal-hdr text-[#1E252B] mt-1">
                    {analysisResult.stage2.primaryAct}
                  </h2>
                  <div className="flex flex-wrap gap-3 items-center mt-3 text-xs text-[#4A5560] font-medium">
                    <span className="px-2 py-0.5 rounded bg-neutral-100 border border-neutral-200">
                      Primary Domain: {analysisResult.stage1.primaryDomain}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-neutral-100 border border-neutral-200">
                      Court: {analysisResult.stage5.pecuniary.courtLevel}
                    </span>
                    <span className={`px-2 py-0.5 rounded border font-mono font-bold uppercase text-[10px] ${
                      analysisResult.stage3.isTimeBarred 
                        ? "bg-red-50 text-red-900 border-red-200" 
                        : "bg-emerald-50 text-emerald-900 border-emerald-200"
                    }`}>
                      Limitation: {analysisResult.stage3.isTimeBarred ? "TIME BARRED" : "MAINTAINABLE IN TIME"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick executive overview summary text */}
              <p className="text-xs leading-relaxed text-[#4A5560] mt-4 pt-4 border-t border-[#E5E1D8]/60 italic bg-[#FDFBF7] p-3 rounded">
                <span className="font-mono font-bold text-[10px] text-[#C5A059] uppercase block not-italic mb-1">Executive Summary:</span>
                {analysisResult.stage13.overview}
              </p>
            </div>

            {/* Interactive Stages Navigator Component */}
            <StageExplorer analysis={analysisResult} />

            {/* PRINT WRAPPER - Hidden on Screen */}
            <div className="hidden print:block p-8 space-y-12 bg-white text-black font-serif print-report">
              <div className="text-center space-y-2 border-b-2 border-black pb-4">
                <h1 className="text-2xl font-bold uppercase tracking-tight">BANGLADESH CIVIL CASE ANALYSIS SUMMARY</h1>
                <p className="text-sm font-mono text-zinc-600">Decision-Tree Support Analysis Briefing Paper</p>
                <div className="text-xs">Generated dynamically via BCCAA v1.4 Client Platform</div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-bold uppercase border-b pb-1 font-sans">0. STATEMENT OF THE LITIGATION</h3>
                  <p className="text-xs leading-relaxed mt-2 italic">{factPattern}</p>
                </div>

                <div>
                  <h3 className="text-md font-bold uppercase border-b pb-1 font-sans">1. CIVIL LAW JURISDICTION</h3>
                  <div className="mt-2 text-xs">
                    <span className="font-bold">Primary Domain:</span> {analysisResult.stage1.primaryDomain}<br />
                    <span className="font-bold">Subsidiary:</span> {analysisResult.stage1.subsidiaryDomains.join(", ") || "None"}
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-bold uppercase border-b pb-1 font-sans">2. LIMITATION MANDATORY PARAMETERS</h3>
                  <div className="mt-2 text-xs">
                    <span className="font-bold">Accrual Date:</span> {analysisResult.stage3.accrualDate}<br />
                    <span className="font-bold">Prescribed Limit:</span> {analysisResult.stage3.prescribedPeriod}<br />
                    <span className="font-bold">Schedule Article:</span> {analysisResult.stage3.limitationArticle}<br />
                    <span className="font-bold">Status:</span> {analysisResult.stage3.isTimeBarred ? "TIME-BARRED" : "MAINTAINABLE"}<br />
                    <span className="font-bold">Analysis:</span> {analysisResult.stage3.preliminaryAnalysis}
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-bold uppercase border-b pb-1 font-sans">3. JURISDICTION & COMPETENCY</h3>
                  <div className="mt-2 text-xs">
                    <span className="font-bold">Territorial Rule:</span> {analysisResult.stage5.territorial.rule} ({analysisResult.stage5.territorial.governingSection})<br />
                    <span className="font-bold">Pecuniary Valuation:</span> {analysisResult.stage5.pecuniary.valuation}<br />
                    <span className="font-bold">Determined Court Level:</span> {analysisResult.stage5.pecuniary.courtLevel}
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-bold uppercase border-b pb-1 font-sans">4. JUDICIALLY FRAMED ISSUES</h3>
                  <div className="space-y-2 mt-2">
                    {analysisResult.stage7.issues.map(iss => (
                      <div key={iss.issueNo} className="text-xs">
                        <span className="font-bold">Issue {iss.issueNo} ({iss.type}):</span> Whether {iss.title} (Burden: {iss.burden})
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-md font-bold uppercase border-b pb-1 font-sans">5. CONCLUDING SYNTHESIS</h3>
                  <p className="text-xs leading-relaxed mt-2">{analysisResult.stage13.overview}</p>
                  <p className="text-xs leading-relaxed mt-2"><span className="font-bold">Decree Form:</span> {analysisResult.stage13.reliefDecree}</p>
                  <p className="text-xs leading-relaxed mt-1"><span className="font-bold">Execution Plan:</span> {analysisResult.stage13.executionPathway}</p>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Branded Footer */}
      <footer className="mt-20 border-t border-[#E5E1D8] bg-[#FDFBF7] py-12 px-4 sm:px-8 no-print">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-white p-2 rounded border border-[#E5E1D8] shadow-sm">
              <NeumLexLogo variant="icon" size="sm" className="w-[36px] h-[36px]" />
            </div>
            <div>
              <p className="font-bold text-[#1E252B] tracking-wider text-xs uppercase">Neum Lex Counsel</p>
              <p className="text-[11px] text-[#4A5560] font-sans mt-0.5">Supreme Court of Bangladesh Chambers • Professional Civil Legal Systems</p>
            </div>
          </div>
          <div className="text-center md:text-right font-mono text-[10px] text-[#4A5560] space-y-1">
            <p>Engine Rights & IP Proprietor: <strong className="text-[#1E252B]">Md. Nazmul Islam</strong>, Advocate, Supreme Court of Bangladesh</p>
            <p className="text-[#C5A059] uppercase tracking-wider font-bold">Confidential Court-Grade Analytical Cascade Unit • BCCAA v1.4</p>
          </div>
        </div>
      </footer>

      {/* GLOBAL SLIDE-OUT CASE ARCHIVE CABINET */}
      {isHistoryOpen && (
        <div 
          className="fixed inset-0 bg-black/55 z-50 transition-opacity no-print" 
          onClick={() => setIsHistoryOpen(false)}
        />
      )}
      
      <div 
        className={`fixed inset-y-0 right-0 w-80 sm:w-96 bg-[#FDFBF7] border-l border-[#E5E1D8] shadow-2xl z-50 flex flex-col transition-transform duration-300 transform no-print ${
          isHistoryOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="p-4 border-b border-[#E5E1D8] flex items-center justify-between bg-[#1E252B] text-[#FDFBF7]">
          <div className="flex items-center gap-2">
            <History className="h-4.5 w-4.5 text-[#C5A059]" />
            <span className="font-serif font-bold tracking-wider text-sm">CASE ARCHIVE CABINET</span>
          </div>
          <button 
            onClick={() => setIsHistoryOpen(false)}
            className="text-[#E5E1D8] hover:text-[#C5A059] p-1 rounded-full hover:bg-neutral-800 transition cursor-pointer"
            title="Close drawer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Drawer Body List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <FolderOpen className="h-12 w-12 text-neutral-300 stroke-[1] mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-[#1E252B] font-serif">Cabinet Empty</p>
                <p className="text-xs text-neutral-400">
                  No analyzed lawsuits have been saved in localStorage yet.
                </p>
              </div>
              <p className="text-[10px] text-neutral-400 bg-neutral-100 p-2.5 rounded max-w-xs font-mono leading-relaxed mx-auto">
                Submit custom fact patterns in the engine to populate your active history.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400 uppercase tracking-widest px-1">
                <span>ARCHIVED FILE RECORDS</span>
                <span>{history.length}/10 slots</span>
              </div>
              
              <div className="divide-y divide-[#E5E1D8]/60">
                {history.map(item => (
                  <div
                    key={item.id}
                    onClick={() => handleLoadHistoryItem(item)}
                    className="py-3.5 group flex flex-col gap-1.5 cursor-pointer hover:bg-white -mx-4 px-4 transition text-left"
                  >
                    <div className="flex justify-between items-start gap-3">
                      <h4 className="text-xs font-bold text-[#1E252B] group-hover:text-[#C5A059] transition font-serif line-clamp-1">
                        {item.title}
                      </h4>
                      <button
                        onClick={(e) => handleDeleteHistoryItem(e, item.id)}
                        className="text-neutral-300 hover:text-red-500 hover:bg-red-50 p-1 rounded transition flex-shrink-0 cursor-pointer"
                        title="Delete from local storage"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    
                    <p className="text-xs text-[#4A5560] line-clamp-3 italic pr-2 font-sans pl-1 leading-relaxed">
                      "{item.factPattern}"
                    </p>
                    
                    <div className="flex flex-wrap gap-2 items-center justify-between text-[10px] font-mono mt-1 pt-1 border-t border-dashed border-neutral-100 pl-1">
                      <span className="text-[#C5A059] font-bold uppercase tracking-wider block">
                        {item.primaryDomain.replace(/[\/\(\)]/g, "").split(" ")[0]}
                      </span>
                      <span className="text-[9px] text-neutral-400">
                        {new Date(item.timestamp).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer controls */}
        {history.length > 0 && (
          <div className="p-4 border-t border-[#E5E1D8] bg-white space-y-2">
            <p className="text-[10px] text-[#4A5560] font-mono text-center leading-normal">
              Archived histories persist locally in this device's browser sandbox and do not transmit over network nodes.
            </p>
            <button
              onClick={handleClearHistory}
              className="w-full py-2 bg-[#1E252B] hover:bg-red-600 text-white hover:text-white font-bold uppercase text-xs tracking-wider font-mono rounded border border-[#1E252B] hover:border-red-600 transition duration-200 cursor-pointer flex items-center justify-center gap-1.5 shadow animate-fadeIn"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear Entire Archive ({history.length})
            </button>
          </div>
        )}
      </div>

      {/* DETAILED PROFESSIONAL A4 PRINT PREVIEW MODAL */}
      {isPrintModalOpen && analysisResult && (
        <div className="fixed inset-0 bg-stone-900/90 backdrop-blur-sm z-[100] overflow-y-auto no-print flex flex-col items-center py-8 px-4">
          
          {/* Floating Control Toolbar */}
          <div className="w-full max-w-[210mm] sticky top-0 bg-stone-900 border border-stone-800 p-4 rounded-t-md shadow-xl flex flex-col sm:flex-row justify-between items-center gap-4 z-[110] mb-3 border-b border-t-4 border-t-[#C5A059] float-control-panel animate-fadeIn">
            <div className="space-y-0.5 text-center sm:text-left">
              <span className="text-[10px] bg-[#C5A059]/15 text-[#C5A059] px-2.5 py-0.5 rounded font-mono font-bold tracking-wider border border-[#C5A059]/30">
                A4 PRINT PREVIEW
              </span>
              <h2 className="text-sm font-bold text-white font-serif mt-1 flex items-center justify-center sm:justify-start gap-1.5">
                <Scale className="h-4 w-4 text-[#C5A059]" />
                Brief Case Review Matrix Document
              </h2>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-[#C5A059] hover:bg-[#b08b47] text-white rounded text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer shadows-sm"
              >
                <Printer className="h-3.5 w-3.5" />
                Print Now
              </button>
              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
                Close Preview
              </button>
            </div>
          </div>

          <div className="w-full max-w-[210mm] text-[10px] text-stone-400 font-mono text-center mb-4 leading-normal bg-stone-950 p-2.5 rounded border border-stone-800">
            ⚠️ <strong>Printing Guide:</strong> In your browser's Print Dialog, enable <strong>"Background graphics"</strong> and set <strong>Margins</strong> to <strong>"None"</strong> or <strong>"Default"</strong> to ensure perfect margins framing of the Chambers brief.
          </div>

          {/* SCRIPTED A4 CANVAS UNIT */}
          <div 
            id="printable-opinion-document"
            className="w-full max-w-[210mm] min-h-[297mm] bg-white text-stone-900 border border-stone-300 p-8 sm:p-14 shadow-2xl rounded-sm flex flex-col font-serif relative"
          >
            
            {/* STAGE 0 HEADER */}
            <div className="flex justify-between items-center border-b pb-1.5 mb-6 border-stone-800 text-stone-500 text-[9px] uppercase font-mono tracking-widest leading-none self-stretch">
              <span>NEUM LEX COUNSEL • CIVIL JURISDICTION ADVISORY</span>
              <span>CONFIDENTIAL CHIEF ADVOCATE MATRIX BRIEFING</span>
            </div>

            {/* CHAMBERS LETTERHEAD HEADER */}
            <div className="text-center space-y-1 pb-4 mb-6 border-b-2 border-stone-800">
              <h1 className="text-2xl font-bold tracking-tight font-display text-stone-950 leading-tight">
                SUPREME COURT OF BANGLADESH
              </h1>
              <p className="text-xs font-bold text-stone-800 tracking-wider">
                OFFICE CHIEF CHAMBER COUNSEL — NEUM LEX
              </p>
              <p className="text-[10px] text-stone-500 font-sans italic max-w-lg mx-auto leading-normal">
                Elegance and Rigidity of Civil Court Pleadings Analysis • Established by Md. Nazmul Islam, Advocate
              </p>
              <div className="text-[9px] text-stone-500 font-mono pt-2 border-t border-stone-200/80 flex justify-between px-2">
                <span>REF ID: BCCAA-{analysisResult.stage3.limitationArticle || "AM-1"}-{(new Date()).getFullYear()}</span>
                <span>COUNSEL: MD. NAZMUL ISLAM, ADVOCATE</span>
                <span>DATED: {new Date().toLocaleDateString(undefined, {year: 'numeric', month: 'long', day: 'numeric'})}</span>
              </div>
            </div>

            <div className="space-y-6 flex-1 text-xs text-stone-800 leading-relaxed">
              
              {/* STAGE Overview Block */}
              <div className="space-y-2">
                <div className="bg-stone-900 text-white font-mono text-[10px] tracking-wider uppercase font-bold py-1 px-3 border-l-4 border-[#C5A059] flex justify-between">
                  <span>SUBJECT CASE BRIEF OVERVIEW</span>
                  <span>OPINION BRIEF</span>
                </div>
                <div className="grid grid-cols-2 gap-4 bg-stone-50 p-3 rounded border border-stone-200 font-mono text-[9px]">
                  <div>
                    <span className="font-bold text-stone-600 block">PRIMARY STATUTORY ACT:</span>
                    <span className="text-stone-900 uppercase font-serif text-xs font-bold block mt-0.5">{analysisResult.stage2.primaryAct}</span>
                  </div>
                  <div>
                    <span className="font-bold text-stone-600 block">JURISDICTIONAL AREA:</span>
                    <span className="text-stone-900 uppercase font-serif text-xs font-bold block mt-0.5">{analysisResult.stage1.primaryDomain}</span>
                  </div>
                  <div className="mt-2">
                    <span className="font-bold text-stone-600 block">LIMITATION SUMMARY Barred?</span>
                    <span className={`text-[10px] font-bold block mt-0.5 ${analysisResult.stage3.isTimeBarred ? "text-red-700" : "text-emerald-700"}`}>
                      {analysisResult.stage3.isTimeBarred ? "YES - STATUTORILY BARRED BY TIME" : "NO - LEGALLY MAINTAINABLE IN LIMITATION"}
                    </span>
                  </div>
                  <div className="mt-2 text-right">
                    <span className="font-bold text-stone-600 block">TRIAL FORUM LEVEL:</span>
                    <span className="text-stone-900 text-[10px] font-bold block mt-0.5 uppercase">{analysisResult.stage5.pecuniary.courtLevel}</span>
                  </div>
                </div>
              </div>

              {/* STAGE 0 */}
              <div className="space-y-2">
                <div className="border-b border-stone-800 pb-1 mt-2">
                  <h3 className="text-xs font-mono font-bold text-stone-900 uppercase tracking-widest">
                    STAGE 0: Raw Case Pleadings Facts, Chronology Grid & Evidentiary Divisions
                  </h3>
                </div>
                <div>
                  <span className="font-mono text-[9px] text-[#C5A059] font-bold uppercase block">Origination Fact Statement:</span>
                  <p className="italic text-stone-600 bg-stone-50/50 p-2.5 rounded border border-stone-200 mt-1 pl-4 border-l-2 border-stone-400">
                    "{factPattern}"
                  </p>
                </div>

                {analysisResult.stage0.chronology && analysisResult.stage0.chronology.length > 0 && (
                  <div className="mt-3">
                    <span className="font-mono text-[9px] text-stone-500 font-semibold uppercase block mb-1">Pleadings Chronological Sequence:</span>
                    <table className="w-full text-[9px] border-collapse font-sans bg-white border border-stone-200">
                      <thead>
                        <tr className="bg-stone-100 text-stone-800 font-bold border-b border-stone-200">
                          <th className="p-1 px-2 text-left border-r border-stone-200 w-1/4">Date / Period</th>
                          <th className="p-1 px-2 text-left border-r border-stone-200 w-1/2">Pleaded Fact Element</th>
                          <th className="p-1 px-2 text-left">Jurisprudential Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200">
                        {analysisResult.stage0.chronology.map((ch, idx) => (
                          <tr key={idx} className="hover:bg-stone-50">
                            <td className="p-1 px-2 border-r border-stone-200 font-mono text-stone-700">{ch.date}</td>
                            <td className="p-1 px-2 border-r border-stone-200 text-stone-800">{ch.fact}</td>
                            <td className="p-1 px-2 text-stone-600 italic">{ch.implication}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 mt-2 bg-stone-50/20 p-2.5 rounded border border-stone-100">
                  {analysisResult.stage0.admittedFacts && analysisResult.stage0.admittedFacts.length > 0 && (
                    <div>
                      <span className="font-mono text-[9px] text-stone-500 font-bold uppercase block mb-1">Admitted Pleaded Facts:</span>
                      <ul className="list-disc pl-4 space-y-0.5 text-[10px] text-stone-600">
                        {analysisResult.stage0.admittedFacts.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {analysisResult.stage0.disputedFacts && analysisResult.stage0.disputedFacts.length > 0 && (
                    <div>
                      <span className="font-mono text-[9px] text-stone-500 font-bold uppercase block mb-1">Disputed Core Fact Issues:</span>
                      <ul className="list-disc pl-4 space-y-0.5 text-[10px] text-stone-600">
                        {analysisResult.stage0.disputedFacts.map((f, i) => (
                          <li key={i}>{f}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* STAGE 1 & 2 */}
              <div className="space-y-3">
                <div className="border-b border-stone-800 pb-1 mt-2">
                  <h3 className="text-xs font-mono font-bold text-stone-900 uppercase tracking-widest">
                    STAGE 1 & 2: Legislative Mapping, Statutory Overlaps & Judicial Precedents
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-mono text-[9px] text-stone-500 font-semibold uppercase block">Governed Core Acts & Fields:</span>
                    <p className="text-stone-800 pl-2 border-l border-[#C5A059] font-bold text-xs mt-1">
                      {analysisResult.stage2.primaryAct}
                    </p>
                    <p className="text-[10px] text-stone-500 mt-1 pl-2">
                      Subsidiary codes: {analysisResult.stage1.subsidiaryDomains?.join(", ") || "CPC / Evidence / Rules Of Supreme Court"}
                    </p>
                  </div>
                  <div>
                    <span className="font-mono text-[9px] text-stone-500 font-semibold uppercase block">Dynamic Statutory S. Triggering:</span>
                    <div className="space-y-1 mt-1">
                      {analysisResult.stage1.triggerFacts?.map((tr, i) => (
                        <div key={i} className="text-[9px] bg-stone-50 p-1.5 rounded border border-stone-200">
                          <span className="font-mono font-semibold block uppercase">Rule Trigger "{tr.statutoryTrigger}":</span>
                          <span className="text-stone-600">Domain: {tr.domain} | Trigger event: "{tr.fact}"</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {analysisResult.stage2.relevantSections && analysisResult.stage2.relevantSections.length > 0 && (
                  <div className="mt-2.5">
                    <span className="font-mono text-[9px] text-stone-500 font-semibold uppercase block mb-1">Key Statutory Sections Invoked:</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {analysisResult.stage2.relevantSections.map((sec, i) => (
                        <div key={i} className="p-2 rounded border border-stone-200 bg-stone-50/55">
                          <span className="font-bold text-stone-900 block font-sans text-[10px]">{sec.section}</span>
                          <p className="text-[9px] text-stone-600 mt-0.5"><strong className="font-mono">Elements:</strong> {sec.keyElements}</p>
                          <p className="text-[9px] text-stone-700 font-bold mt-0.5"><strong className="font-mono text-[#C5A059]">BCCAA Impact:</strong> {sec.impact}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {analysisResult.stage2.precedents && analysisResult.stage2.precedents.length > 0 && (
                  <div className="mt-2.5">
                    <span className="font-mono text-[9px] text-stone-500 font-semibold uppercase block mb-1">Supreme Court Landmark Precedents:</span>
                    <div className="space-y-2">
                      {analysisResult.stage2.precedents.map((pr, i) => (
                        <div key={i} className="p-2 border-l-2 border-[#C5A059] bg-[#FDFBF7] rounded-e border border-y-stone-200 border-e-stone-200">
                          <span className="font-mono font-bold text-stone-900 uppercase text-[9px] block bg-stone-100 px-1.5 py-0.5 w-max rounded">{pr.citation}</span>
                          <p className="text-[9.5px] italic text-stone-800 mt-1">"{pr.coreHolding}"</p>
                          <p className="text-[9px] text-stone-600 mt-0.5"><strong>Application to this brief:</strong> {pr.applicationToCase}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* PAGE BREAK (FOR PRINT ONLY) */}
              <div className="print-page-break my-4 border-t border-dashed border-stone-200 print:border-none no-print" />

              <div className="flex justify-between items-center border-b pb-1.5 mb-6 border-stone-800 text-stone-500 text-[9px] uppercase font-mono tracking-widest leading-none self-stretch print:flex hidden">
                <span>NEUM LEX COUNSEL • CIVIL JURISDICTION ADVISORY</span>
                <span>CONFIDENTIAL CHIEF ADVOCATE MATRIX BRIEFING</span>
              </div>

              {/* STAGE 3 */}
              <div className="space-y-2">
                <div className="border-b border-stone-800 pb-1 mt-2">
                  <h3 className="text-xs font-mono font-bold text-stone-900 uppercase tracking-widest">
                    STAGE 3: Limitation Audit & Out of Time Threshold Barriers
                  </h3>
                </div>
                <div className="p-3 bg-stone-900 text-white rounded font-sans grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="border-r border-stone-800">
                    <span className="text-[8px] font-mono text-[#C5A059] block uppercase">Cause of Accrual</span>
                    <span className="text-xs font-bold block mt-1">{analysisResult.stage3.accrualDate}</span>
                  </div>
                  <div className="border-r border-stone-800">
                    <span className="text-[8px] font-mono text-[#C5A059] block uppercase">Limitation Act Schedule</span>
                    <span className="text-xs font-bold block mt-1">Article {analysisResult.stage3.limitationArticle}</span>
                  </div>
                  <div className="border-r border-stone-800">
                    <span className="text-[8px] font-mono text-[#C5A059] block uppercase">Prescribed Period</span>
                    <span className="text-xs font-bold block mt-1">{analysisResult.stage3.prescribedPeriod}</span>
                  </div>
                  <div>
                    <span className="text-[8px] font-mono text-[#C5A059] block uppercase">Statutory Bar Check</span>
                    <span className={`text-xs font-black block mt-1 ${analysisResult.stage3.isTimeBarred ? "text-rose-500 animate-pulse" : "text-emerald-400"}`}>
                      {analysisResult.stage3.isTimeBarred ? "TIME-BARRED" : "MAINTAINED"}
                    </span>
                  </div>
                </div>
                <div className="bg-stone-50 p-2.5 rounded border border-stone-200/80">
                  <p className="text-[10px] text-stone-700 leading-relaxed font-sans">
                    <strong>Chambers Preliminary Limitation Audit Verdict:</strong> {analysisResult.stage3.preliminaryAnalysis}
                  </p>
                  {analysisResult.stage3.exceptionsOrExtensions && (
                    <p className="text-[10px] text-stone-600 bg-white p-2 border border-stone-150 rounded mt-2 font-mono text-[9px]">
                      🤝 Approved exceptions (s.14 / s.18 Indulgences): {analysisResult.stage3.exceptionsOrExtensions}
                    </p>
                  )}
                </div>
              </div>

              {/* STAGE 4 */}
              <div className="space-y-3">
                <div className="border-b border-stone-800 pb-1 mt-2">
                  <h3 className="text-xs font-mono font-bold text-stone-900 uppercase tracking-widest">
                    STAGE 4: Legal Capacity, Locus Standi & Necessary Party Joinders (Order I CPC)
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="font-mono text-[9px] text-stone-500 font-bold uppercase block">PLAINTIFFS (Order I Rule 1, 8, 10 CPC Capacity):</span>
                    <div className="space-y-1.5">
                      {analysisResult.stage4.plaintiffs.map((pl, idx) => (
                        <div key={idx} className="bg-stone-50 p-2 rounded border border-stone-150 relative">
                          <span className="font-bold text-stone-900 block">{idx + 1}. {pl.name}</span>
                          <span className="text-[9px] text-stone-500 block border-b border-stone-200 pb-1 mb-1">
                            Identity Type: {pl.legalIdentity} • Legal Representation: {pl.capacity}
                          </span>
                          {pl.causeOfActionAccess && (
                            <p className="text-[9px] text-stone-700 italic pr-1">Locus justification: "{pl.causeOfActionAccess}"</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="font-mono text-[9px] text-stone-500 font-bold uppercase block">DEFENDANTS (Order I Rule 3 Necessary Parties):</span>
                    <div className="space-y-1.5">
                      {analysisResult.stage4.defendants.map((df, idx) => (
                        <div key={idx} className="bg-stone-50 p-2 rounded border border-stone-150">
                          <span className="font-bold text-stone-900 block">{idx + 1}. {df.name}</span>
                          <span className="text-[9px] text-stone-500 block border-b border-stone-200 pb-1 mb-1">
                            Identity Status: {df.legalIdentity} • Entity Status: {df.capacity}
                          </span>
                          {df.liabilityType && (
                            <p className="text-[9px] text-stone-700 italic">Anticipated Liability Assignment: "{df.liabilityType}"</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50/55 p-3 rounded border border-amber-200/80 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-mono text-[9px] text-stone-600 font-bold uppercase block">Joinder Risk / Mis-joinder Warnings:</span>
                    <p className="text-[10px] text-stone-800 font-sans mt-1">{analysisResult.stage4.joinderIssues || "No obvious mis-joinder/non-joinder identified under Order I"}</p>
                  </div>
                  <div>
                    <span className="font-mono text-[9px] text-stone-600 font-bold uppercase block">Overall Locus Assessment:</span>
                    <p className="text-[10px] text-stone-800 font-sans mt-1">{analysisResult.stage4.locusStandiSummary}</p>
                  </div>
                </div>
              </div>

              {/* STAGE 5 */}
              <div className="space-y-2">
                <div className="border-b border-stone-800 pb-1 mt-2">
                  <h3 className="text-xs font-mono font-bold text-stone-900 uppercase tracking-widest">
                    STAGE 5: Competent Suit Forum, Territorial Rules & Pecuniary Sizing
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-stone-800 leading-normal mb-2.5">
                  <div className="p-2 rounded border border-stone-200 bg-stone-50/40">
                    <span className="font-mono font-semibold text-[9px] text-stone-500 uppercase block">PECUNIARY (Suits Val. Act):</span>
                    <p className="font-bold font-sans text-[11px] mt-1 text-stone-900">{analysisResult.stage5.pecuniary.valuation}</p>
                    <p className="text-[10px] text-[#C5A059] font-bold mt-0.5 font-mono">{analysisResult.stage5.pecuniary.courtLevel}</p>
                    <p className="text-[9px] text-stone-500 mt-1 italic">{analysisResult.stage5.pecuniary.suitsValuationActNotes}</p>
                  </div>

                  <div className="p-2 rounded border border-stone-200 bg-stone-50/40">
                    <span className="font-mono font-semibold text-[9px] text-stone-500 uppercase block">TERRITORIAL (CPC s.16-20):</span>
                    <p className="font-bold text-[10px] mt-1 text-stone-900 font-sans">Section {analysisResult.stage5.territorial.governingSection} CPC</p>
                    <p className="text-[9.5px] text-stone-600 mt-1">Rule: {analysisResult.stage5.territorial.rule}</p>
                    <p className="text-[9px] text-stone-500 mt-1 italic">{analysisResult.stage5.territorial.jurisdictionalFacts}</p>
                  </div>

                  <div className="p-2 rounded border border-stone-200 bg-stone-50/40">
                    <span className="font-mono font-semibold text-[9px] text-stone-500 uppercase block">SUBJECT-MATTER EXCLUSION:</span>
                    <p className="font-bold text-[10px] mt-1 text-stone-900 font-sans">
                      {analysisResult.stage5.subjectMatter.isExcluded ? "Sp. Barred / Excluded" : "Full Jurisdictional Retainment"}
                    </p>
                    <p className="text-[9.5px] mt-1 text-stone-600">Statute: {analysisResult.stage5.subjectMatter.governingStatute}</p>
                    <p className="text-[9px] text-[#C5A059] font-bold mt-1 uppercase font-mono">Forum: {analysisResult.stage5.subjectMatter.forum}</p>
                  </div>
                </div>

                <div className="bg-stone-50 p-2.5 rounded border border-stone-200">
                  <p className="text-[10px] text-stone-700 leading-normal font-sans">
                    <strong>Defensive Challenge Rule / Reply Plan for Objection on Forum:</strong> {analysisResult.stage5.objectionStrategy}
                  </p>
                </div>
              </div>

              {/* PAGE BREAK (FOR PRINT ONLY) */}
              <div className="print-page-break my-4 border-t border-dashed border-stone-200 print:border-none no-print" />

              <div className="flex justify-between items-center border-b pb-1.5 mb-6 border-stone-800 text-stone-500 text-[9px] uppercase font-mono tracking-widest leading-none self-stretch print:flex hidden">
                <span>NEUM LEX COUNSEL • CIVIL JURISDICTION ADVISORY</span>
                <span>CONFIDENTIAL CHIEF ADVOCATE MATRIX BRIEFING</span>
              </div>

              {/* STAGE 6 */}
              <div className="space-y-3">
                <div className="border-b border-stone-800 pb-1 mt-2">
                  <h3 className="text-xs font-mono font-bold text-stone-900 uppercase tracking-widest">
                    STAGE 6: Plaint Verification Audits & Order VII Rule 11 CPC Defences
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-mono text-[9px] text-stone-500 font-bold uppercase block mb-1">PLAINT VERIFICATION (Order VII Rule 1 CPC Checklist):</span>
                    <div className="space-y-1">
                      {analysisResult.stage6.plaintChecklist.map((ch, idx) => (
                        <div key={idx} className="flex gap-1.5 items-start text-[9.5px] text-stone-800">
                          <span className="text-emerald-600 font-bold">✓</span>
                          <span>{ch}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="font-mono text-[9px] text-stone-500 font-bold uppercase block mb-1">REJECTION OF PLAINT DEFENCES (Order VII Rule 11 CPC Bars):</span>
                    <div className="space-y-1">
                      {analysisResult.stage6.groundsForRejection && analysisResult.stage6.groundsForRejection.length > 0 ? (
                        analysisResult.stage6.groundsForRejection.map((gr, idx) => (
                          <div key={idx} className="flex gap-1.5 items-start text-[9.5px] text-[#A13A3A] bg-red-50 p-1 rounded border border-red-100">
                            <span className="font-bold">⚠️</span>
                            <span>{gr}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-[9.5px] italic text-emerald-700 bg-emerald-50/55 p-1 rounded border border-emerald-100/50">
                          No obvious grounds for instant plaint rejection identified. Standard plaint format maintainable.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 p-2.5 rounded border border-stone-200 bg-stone-50/30 font-sans text-[10px]">
                  <div>
                    <span className="font-mono text-[9px] text-stone-500 font-bold uppercase block">Written Statement Specific Denial Risks (Order VIII Rules 3-5 CPC):</span>
                    <p className="text-stone-700 mt-1 leading-relaxed">{analysisResult.stage6.writtenStatementDeemedAdmissions}</p>
                  </div>
                  <div>
                    <span className="font-mono text-[9px] text-stone-500 font-bold uppercase block">Set-Off / Counterclaim Potentials (Order VIII Rule 6 CPC):</span>
                    <p className="text-stone-700 mt-1 leading-relaxed">{analysisResult.stage6.counterclaimsOrSetOff || "No explicit financial counterclaims or set-offs available."}</p>
                  </div>
                </div>
              </div>

              {/* STAGE 7 */}
              <div className="space-y-2">
                <div className="border-b border-stone-800 pb-1 mt-2">
                  <h3 className="text-xs font-mono font-bold text-stone-900 uppercase tracking-widest">
                    STAGE 7: Frame of Triable Issues & Burden Mappings (Order XIV CPC Guidelines)
                  </h3>
                </div>
                <div className="space-y-2.5">
                  {analysisResult.stage7.issues.map((iss) => (
                    <div key={iss.issueNo} className="p-2.5 rounded border border-stone-200 bg-stone-50/50 relative">
                      <div className="flex justify-between items-start border-b border-stone-200 pb-1 mb-1 bg-stone-100/10 px-1 -mx-1">
                        <span className="font-bold text-stone-900 text-[10.5px]">Issue {iss.issueNo}: {iss.title}</span>
                        <span className="font-mono text-[8.5px] bg-[#C5A059]/15 text-[#C5A059] px-2 py-0.5 rounded font-bold uppercase tracking-wider">{iss.type}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-[9.5px] mt-1.5 leading-relaxed font-sans text-stone-700">
                        <div>
                          <strong className="font-mono text-stone-500 text-[8px] uppercase block">Burden of Proof (s.101-104 Evidence):</strong>
                          <span>{iss.burden}</span>
                        </div>
                        <div>
                          <strong className="font-mono text-stone-500 text-[8px] uppercase block">Required Evidentiary Proof Materials:</strong>
                          <span>{iss.evidenceRequired}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* STAGE 8 */}
              <div className="space-y-3">
                <div className="border-b border-stone-800 pb-1 mt-2">
                  <h3 className="text-xs font-mono font-bold text-stone-900 uppercase tracking-widest">
                    STAGE 8: Evidence Admissibility, Presumed Veracity & Statutory Burden Shifters
                  </h3>
                </div>
                {analysisResult.stage8.evidenceList && analysisResult.stage8.evidenceList.length > 0 && (
                  <div>
                    <span className="font-mono text-[9px] text-stone-500 font-bold uppercase block mb-1">Documents Exhibit Status Matrix:</span>
                    <table className="w-full text-[9px] border-collapse font-sans bg-white border border-stone-200">
                      <thead>
                        <tr className="bg-stone-100 text-stone-800 border-b border-stone-200 font-bold">
                          <th className="p-1 px-2 text-left border-r border-stone-200">Document/Exhibit Name</th>
                          <th className="p-1 px-2 text-left border-r border-stone-200">Produced By</th>
                          <th className="p-1 px-2 text-left border-r border-stone-200 w-1/4">Evidence Act Section</th>
                          <th className="p-1 px-2 text-left">Admissibility Challenge Plan</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-200">
                        {analysisResult.stage8.evidenceList.map((ev, i) => (
                          <tr key={i} className="hover:bg-stone-50">
                            <td className="p-1 px-2 border-r border-stone-200 font-serif font-bold text-stone-800">{ev.item} ({ev.type})</td>
                            <td className="p-1 px-2 border-r border-stone-200 text-stone-700">{ev.source}</td>
                            <td className="p-1 px-2 border-r border-stone-200 font-mono text-[#C5A059] font-bold">s. {ev.governingSection}</td>
                            <td className="p-1 px-2 text-stone-600 italic leading-snug">{ev.admissibilityChallenge}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1 bg-stone-50/35 p-2.5 rounded border border-stone-200">
                  {analysisResult.stage8.burdenAssignments && analysisResult.stage8.burdenAssignments.length > 0 && (
                    <div>
                      <span className="font-mono text-[9px] text-stone-500 font-bold uppercase block mb-1">Assigned Chapters & Burden Shifts:</span>
                      <ul className="list-disc pl-4 space-y-0.5 text-[9.5px] text-stone-700 font-sans">
                        {analysisResult.stage8.burdenAssignments.map((ba, i) => (
                          <li key={i}>{ba}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {analysisResult.stage8.statutoryPresumptions && analysisResult.stage8.statutoryPresumptions.length > 0 && (
                    <div>
                      <span className="font-mono text-[9px] text-stone-500 font-bold uppercase block mb-1">Presumptions Invoked (e.g. s.90 Evidence Act):</span>
                      <div className="space-y-1.5 font-sans text-[9px]">
                        {analysisResult.stage8.statutoryPresumptions.map((pres, i) => (
                          <div key={i} className="bg-white p-1.5 rounded border border-stone-200">
                            <span className="font-mono font-bold text-stone-900 block">Section {pres.statuteSection} Evidence Act:</span>
                            <span className="text-stone-500 font-serif italic block mt-0.5">{pres.presumptionStyle}</span>
                            <span className="text-stone-700 font-bold block mt-0.5">Procedural Effect: {pres.effectOnCase}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* PAGE BREAK (FOR PRINT ONLY) */}
              <div className="print-page-break my-4 border-t border-dashed border-stone-200 print:border-none no-print" />

              <div className="flex justify-between items-center border-b pb-1.5 mb-6 border-stone-800 text-stone-500 text-[9px] uppercase font-mono tracking-widest leading-none self-stretch print:flex hidden">
                <span>NEUM LEX COUNSEL • CIVIL JURISDICTION ADVISORY</span>
                <span>CONFIDENTIAL CHIEF ADVOCATE MATRIX BRIEFING</span>
              </div>

              {/* STAGE 9 */}
              <div className="space-y-2">
                <div className="border-b border-stone-800 pb-1 mt-2">
                  <h3 className="text-xs font-mono font-bold text-stone-900 uppercase tracking-widest">
                    STAGE 9: Issue-wise Adversary Debate & Court Finding Presumptions
                  </h3>
                </div>
                <div className="space-y-3">
                  {analysisResult.stage9.issueDetails.map((det) => (
                    <div key={det.issueNo} className="p-3 bg-stone-50 rounded border border-stone-250 font-sans text-[9.5px] leading-relaxed">
                      <span className="font-mono font-bold text-stone-900 text-[10px] block border-b border-stone-200 pb-1 mb-2">
                        Audit on Issue {det.issueNo}: {det.issueTitle}
                      </span>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-stone-700">
                        <div>
                          <strong className="font-mono text-[8px] text-stone-500 uppercase block leading-none mb-1">Plaintiff Pleaded Assertions:</strong>
                          <p>{det.plaintiffPosition}</p>
                        </div>
                        <div>
                          <strong className="font-mono text-[8px] text-stone-500 uppercase block leading-none mb-1">Defendant Rebuttals & Objections:</strong>
                          <p>{det.defendantPosition}</p>
                        </div>
                      </div>
                      <div className="mt-2.5 pt-2 border-t border-stone-200/60 flex flex-col md:flex-row gap-3">
                        <div className="flex-1">
                          <strong className="font-mono text-[8px] text-[#C5A059] uppercase block leading-none mb-1">Evidentiary Weights:</strong>
                          <p className="text-stone-600 text-[9px]">{det.courtAnalysis}</p>
                        </div>
                        <div className="md:w-1/3 bg-[#FDFBF7] p-1.5 px-2.5 rounded border border-stone-200">
                          <strong className="font-mono text-[#1E252B] text-[8px] uppercase block leading-none mb-1">Target Finding:</strong>
                          <p className="font-bold text-stone-900">{det.projectedFinding}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* STAGE 10 */}
              <div className="space-y-2">
                <div className="border-b border-stone-800 pb-1 mt-2">
                  <h3 className="text-xs font-mono font-bold text-stone-900 uppercase tracking-widest">
                    STAGE 10: Specific Relief Act (SRA) Equity Barriers & Discretionary Limits
                  </h3>
                </div>
                {analysisResult.stage10.applicablePrinciples && analysisResult.stage10.applicablePrinciples.length > 0 && (
                  <div>
                    <span className="font-mono text-[9px] text-stone-500 font-bold uppercase block mb-1">Maxims \& Inherent Principles Invoked:</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {analysisResult.stage10.applicablePrinciples.map((ep, i) => (
                        <div key={i} className="p-2 border border-stone-200 bg-[#FDFBF7] rounded">
                          <span className="font-mono font-bold text-[#C5A059] text-[9.5px] block">{ep.principle}</span>
                          <p className="text-[9px] text-stone-700 italic mt-0.5"><strong>Application:</strong> "{ep.application}"</p>
                          <p className="text-[9px] font-bold text-stone-950 mt-0.5"><strong>Judicial Weight:</strong> {ep.weight}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="bg-stone-50 p-2.5 rounded border border-stone-200 leading-normal font-sans text-[10px]">
                  <strong>SRA s.22 / s.56 Discretionary Assessment Checklist:</strong>
                  <p className="text-stone-700 mt-1 italic pl-1">"{analysisResult.stage10.discretionaryReliefCheck}"</p>
                </div>
              </div>

              {/* STAGE 11 */}
              <div className="space-y-2">
                <div className="border-b border-stone-800 pb-1 mt-2">
                  <h3 className="text-xs font-mono font-bold text-stone-900 uppercase tracking-widest">
                    STAGE 11: Civil Suit Lifecycle & Key Trial Milestone Progression (CPC Code of Civil Procedure Rules)
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-1.5">
                  {analysisResult.stage11.timelineProgress.map((step, idx) => (
                    <div key={idx} className="flex gap-3 text-stone-800 border border-stone-200 bg-stone-50/30 p-2 rounded items-center">
                      <div className="w-5 h-5 rounded-full bg-stone-950 text-[#C5A059] text-[9px] font-mono flex items-center justify-center font-bold flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div className="flex-1 grid grid-cols-3 gap-2 font-sans text-[9px]">
                        <div>
                          <strong className="block text-stone-900 text-[10px]">{step.stageName}</strong>
                          <span className="font-mono text-stone-500 tracking-wider">Ref: {step.cpcReference}</span>
                        </div>
                        <div className="text-stone-600 pr-2">
                          <strong>Active Sub-Actions:</strong> {step.subActions}
                        </div>
                        <div className="text-stone-700 font-bold border-l border-dashed border-stone-200 pl-2">
                          <strong>Advisory Strategy:</strong> {step.strategicPlay}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* PAGE BREAK (FOR PRINT ONLY) */}
              <div className="print-page-break my-4 border-t border-dashed border-stone-200 print:border-none no-print" />

              <div className="flex justify-between items-center border-b pb-1.5 mb-6 border-stone-800 text-stone-500 text-[9px] uppercase font-mono tracking-widest leading-none self-stretch print:flex hidden">
                <span>NEUM LEX COUNSEL • CIVIL JURISDICTION ADVISORY</span>
                <span>CONFIDENTIAL CHIEF ADVOCATE MATRIX BRIEFING</span>
              </div>

              {/* STAGE 12 */}
              <div className="space-y-2">
                <div className="border-b border-stone-800 pb-1 mt-2">
                  <h3 className="text-xs font-mono font-bold text-stone-900 uppercase tracking-widest">
                    STAGE 12: appellate & Revisional Recourse Paths (Section 96, 115 CPC Limits)
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
                  {analysisResult.stage12.appealNodes.map((ap, i) => (
                    <div key={i} className="p-3.5 rounded border border-stone-200 bg-stone-50/40 font-sans text-[9.5px]">
                      <div className="flex justify-between border-b pb-1 mb-1 font-mono text-[8px] tracking-wider text-stone-500 font-bold uppercase bg-stone-100/10 px-0.5">
                        <span>OPTION {i + 1}</span>
                        <span>LIMITS: {ap.governingSection || "CPC Code"}</span>
                      </div>
                      <strong className="text-stone-950 font-serif text-[10.5px] block">{ap.level}</strong>
                      <p className="text-[#C5A059] font-bold mt-1">Competent Forum: {ap.authority}</p>
                      <p className="text-stone-600 mt-1"><strong>Action Scope & Grounding:</strong> {ap.scope}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* STAGE 13 */}
              <div className="space-y-3">
                <div className="border-b border-stone-800 pb-1 mt-2">
                  <h3 className="text-xs font-mono font-bold text-stone-900 uppercase tracking-widest">
                    STAGE 13: Final Synthesis, Apportioned Decree Form & CPC Order XXI Execution
                  </h3>
                </div>
                <div className="bg-stone-50 border border-stone-250 p-4 rounded text-stone-800 leading-normal font-sans text-[10px] space-y-3">
                  <div>
                    <strong>Chambers Concluding Diagnosis & Legal Synthesis:</strong>
                    <p className="text-stone-600 mt-1 pl-1 italic font-serif leading-relaxed">"{analysisResult.stage13.overview}"</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 pt-2.5 border-t border-stone-200 text-[9.5px]">
                    <div>
                      <strong className="font-mono text-[8.5px] tracking-wider uppercase text-[#C5A059] block mb-1">Decreetal Relief & Formal Declaration formulation:</strong>
                      <p className="text-stone-700 leading-relaxed font-bold">{analysisResult.stage13.reliefDecree}</p>
                    </div>
                    <div>
                      <strong className="font-mono text-[8.5px] tracking-wider uppercase text-[#C5A059] block mb-1">CPC Sections Costs Allocation Apportionment (CPC s.35):</strong>
                      <p className="text-stone-700 leading-relaxed">{analysisResult.stage13.costsApportionment}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 pt-2 border-t border-stone-200 text-[9.5px]">
                    <div>
                      <strong className="font-mono text-[8.5px] tracking-wider uppercase text-[#C5A059] block mb-1">Specific Relief Act Equitable Barriers Applied:</strong>
                      <p className="text-stone-700 leading-relaxed font-bold">{analysisResult.stage13.equitableBars}</p>
                    </div>
                    <div>
                      <strong className="font-mono text-[8.5px] tracking-wider uppercase text-[#C5A059] block mb-1">Execution Recourse & Recovery Pathway (Order XXI CPC):</strong>
                      <p className="text-stone-700 leading-relaxed">{analysisResult.stage13.executionPathway}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Chambers Signature Blocks & Seals */}
              <div className="mt-8 border-t border-dashed border-stone-300 pt-6 flex flex-col sm:flex-row justify-between items-end gap-6 text-[10px] font-sans text-stone-600 leading-normal signature-signoff-block">
                <div className="space-y-1 text-left">
                  <p><strong>FORMULATED SYSTEMATIC CODE:</strong> BCCAA-CORE-S13-V1.4</p>
                  <p><strong>SECURITY ID BINDING:</strong> {analysisResult.stage5.pecuniary.courtLevel?.replace(/[\s\/\(\)]/g, '') || "SUPREME"}-CIV-GRID-OPINION</p>
                  <p><strong>RECORDS CLASSIFIED:</strong> Highly Confidential Civil Chambers Matrix</p>
                  <div className="w-24 h-11 border border-stone-400 border-dashed rounded mt-2.5 flex items-center justify-center bg-stone-50 font-mono text-[8px] text-stone-400 text-center select-none uppercase">
                    CHAMBERS SEAL<br />
                    NEUM LEX COUNSEL
                  </div>
                </div>
                <div className="text-right space-y-1.5 min-w-56 mt-4 sm:mt-0 font-serif border-t border-stone-800 pt-2 flex flex-col items-end">
                  <span className="text-[11px] font-bold text-stone-950 block">Md. Nazmul Islam</span>
                  <span className="text-[9px] text-stone-600 block leading-tight">Advocate, Supreme Court of Bangladesh</span>
                  <span className="text-[8px] text-stone-500 block uppercase font-mono tracking-wider">Head of Neum Lex Counsel Chambers</span>
                  <span className="text-[8px] text-stone-400 block pb-1 border-b border-stone-200 w-full text-right italic font-sans">Counsel Reference Signature Code: #BD-8195-CIV</span>
                  <p className="text-[8px] text-stone-500 font-sans italic text-right mt-1 w-full max-w-xs leading-normal">
                    Assisting the District & Supreme Court nodes in Bangladesh with sequential pleadings assessment and statutory matrix solutions.
                  </p>
                </div>
              </div>

            </div>

            {/* PREPARATION FOOTER BITS */}
            <div className="border-t pt-2 mt-8 border-stone-200 text-center text-stone-400 text-[8px] uppercase font-mono tracking-widest flex justify-between self-stretch">
              <span>Md. Nazmul Islam, Advocate • Supreme Court chambers</span>
              <span>BCCAA Decision-Tree Support Analysis v1.4</span>
              <span>Page 1 of 1 (Consolidated Opinion)</span>
            </div>

          </div>

          {/* Bottom Floating Control Panel on Screen */}
          <div className="w-full max-w-[210mm] mt-4 bg-stone-900 border border-stone-800 p-4 rounded-b-md shadow-xl flex justify-center gap-3 z-[110] no-print mb-8">
            <button
              onClick={() => window.print()}
              className="px-6 py-2.5 bg-[#C5A059] hover:bg-[#b08b47] text-white rounded text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition cursor-pointer shadows-sm"
            >
              <Printer className="h-4 w-4" />
              Print Chambers Brief
            </button>
            <button
              onClick={() => setIsPrintModalOpen(false)}
              className="px-6 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded text-xs font-mono font-bold uppercase tracking-wider flex items-center gap-2 transition cursor-pointer"
            >
              <X className="h-4 w-4" />
              Exit Preview Mode
            </button>
          </div>

        </div>
      )}
    </div>
  );
}

