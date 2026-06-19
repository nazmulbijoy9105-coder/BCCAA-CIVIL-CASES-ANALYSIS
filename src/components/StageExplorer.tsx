import React, { useState } from "react";
import { 
  Scale, Calendar, AlertTriangle, UserCheck, ShieldAlert, FileText, 
  Layers, HelpCircle, BookOpen, Clock, GitMerge, FileCheck, 
  TrendingUp, DollarSign, ChevronRight, CheckCircle2, AlertCircle,
  HelpCircle as QuestionIcon, PlusCircle, ArrowRightLeft, ShieldCheck,
  Award
} from "lucide-react";
import { CaseAnalysisResponse, FramedIssue, LegalParty, RelevantSection, Precedent } from "../types";

interface StageExplorerProps {
  analysis: CaseAnalysisResponse;
}

export default function StageExplorer({ analysis }: StageExplorerProps) {
  const [activeStage, setActiveStage] = useState<number>(0);

  const stages = [
    { num: 0, name: "Fact Matrix", desc: "Raw, Structured, & Material Facts", icon: Layers },
    { num: 1, name: "Civil Domain", desc: "Primary & Subsidiary Law Areas", icon: Scale },
    { num: 2, name: "Legislation Map", desc: "Statute, Rules & Precedents Cascade", icon: BookOpen },
    { num: 3, name: "Limitation Check", desc: "Mandatory Time Bar Appraisal", icon: Clock },
    { num: 4, name: "Party Analysis", desc: "Locus Standi, Capacity & Joinder", icon: UserCheck },
    { num: 5, name: "Jurisdiction", desc: "Territorial, Pecuniary & Subject Matter", icon: CompassIcon },
    { num: 6, name: "Pleadings Draft", desc: "O.VII R.11 Rejection & WS Defences", icon: FileText },
    { num: 7, name: "Issue Framing", desc: "Framed Questions & Burden Matrices", icon: QuestionIcon },
    { num: 8, name: "Evidence Gate", desc: "Relevancy, Presumptions & Map", icon: FileCheck },
    { num: 9, name: "Arguments & Merits", desc: "Two-Sided Claims & Court Findings", icon: ArrowRightLeft },
    { num: 10, name: "Equity & Discretion", desc: "Clean Hands, Laches & SRA Triggers", icon: Scale },
    { num: 11, name: "CPC Court Timeline", desc: "Conventional Litigation Lifecycle", icon: GitMerge },
    { num: 12, name: "Appeal Pathway", desc: "HCD & Appellate Division Recourses", icon: TrendingUp },
    { num: 13, name: "Final Synthesis", desc: "Decree Framework & Enforcement", icon: Award },
  ];

  // Helper Custom Compass Icon using lucide elements
  function CompassIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <circle cx="12" cy="12" r="10" />
        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </svg>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar Navigation */}
      <div className="lg:col-span-1 space-y-2">
        <div className="p-4 border border-[#E5E1D8] bg-[#F9F7F2] rounded-md mb-4">
          <h3 className="text-sm font-semibold text-amber-900 tracking-wide uppercase font-mono">BCCAA Workflow</h3>
          <p className="text-xs text-[#4A5560] mt-1">Select a stage to review the civil analysis cascade.</p>
        </div>
        <div className="space-y-1 max-h-[70vh] overflow-y-auto pr-1">
          {stages.map((stg) => {
            const IconComponent = stg.icon;
            const isActive = activeStage === stg.num;
            return (
              <button
                key={stg.num}
                onClick={() => setActiveStage(stg.num)}
                className={`w-full text-left p-3 rounded transition-all duration-150 flex items-start gap-4 border ${
                  isActive 
                    ? "bg-[#1E252B] border-[#1E252B] text-[#FDFBF7] shadow-sm transform translate-x-1" 
                    : "bg-[#ffffff] border-[#E5E1D8] hover:border-[#C5A059] text-[#1E252B]"
                }`}
              >
                <div className={`p-1.5 rounded ${isActive ? "bg-amber-500/20 text-[#C5A059]" : "bg-[#F9F7F2] text-[#4A5560]"}`}>
                  <IconComponent className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono opacity-60">STG {stg.num}</span>
                    {stg.num === 3 && analysis.stage3.isTimeBarred && (
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block animate-pulse"></span>
                    )}
                  </div>
                  <div className="text-xs font-semibold leading-tight truncate">{stg.name}</div>
                  <div className="text-[10px] opacity-75 truncate leading-normal mt-0.5">{stg.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Structured Content Area */}
      <div className="lg:col-span-3 space-y-6">
        {/* Stage Content */}
        <div className="legal-card p-6 rounded-md border-t-4 border-t-[#C5A059]">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E5E1D8] pb-4 mb-6 gap-3">
            <div>
              <div className="text-xs font-mono text-[#C5A059] uppercase tracking-widest font-semibold flex items-center gap-2">
                <span>Stage {activeStage} Analysis</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200 text-[10px]">Active Node</span>
              </div>
              <h2 className="text-2xl font-bold legal-hdr text-[#1E252B] mt-1">{stages[activeStage].name}</h2>
            </div>
            <div className="text-[11px] font-mono text-right text-[#4A5560]">
              BANGLADESH CIVIL COURT PROCEDURE COGNIZANCE
            </div>
          </div>

          {/* Renders Based on Selected Stage */}
          
          {/* STAGE 0: FACT MATRIX */}
          {activeStage === 0 && (
            <div className="space-y-6 animate-fadeIn">
              <p className="text-sm text-[#4A5560] leading-relaxed italic">
                Organizes raw facts sequentially and establishes evidentiary status, categorizing them based on legal materiality, liability metrics, and claims of relief.
              </p>

              {/* Event Timeline */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-[#1E252B] mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#C5A059]" />
                  1. Chronological Event Sequence
                </h3>
                <div className="relative border-l-2 border-[#E5E1D8] pl-4 ml-2 space-y-5 my-4">
                  {analysis.stage0.chronology.map((event, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[25px] mt-1.5 w-3 h-3 rounded-full bg-[#C5A059] border border-white"></div>
                      <div className="bg-[#FDFBF7] border border-[#E5E1D8] p-3 rounded-md space-y-1 hover:border-[#1E252B] transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <span className="text-[#C5A059] text-xs font-mono font-semibold">{event.date}</span>
                          <span className="text-[10px] font-semibold text-[#1E252B]/80 font-mono bg-[#E5E1D8]/40 px-2 py-0.5 rounded">
                            Parties: {event.partiesInvolved}
                          </span>
                        </div>
                        <h4 className="text-xs font-semibold text-[#1E252B]">{event.event}</h4>
                        <p className="text-xs text-[#4A5560] leading-snug pt-1 border-t border-[#E5E1D8]/50 mt-1">
                          <span className="font-semibold text-[10px] uppercase font-mono tracking-wider text-[#C5A059]">Statutory Weight:</span> {event.statutorySignificance}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Admitted vs Disputed vs Inferred Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-[#E5E1D8] pt-6">
                <div>
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase font-mono pb-2 border-b border-emerald-100">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Admitted Facts
                  </div>
                  <ul className="mt-3 space-y-2">
                    {analysis.stage0.admittedFacts.map((fact, idx) => (
                      <li key={idx} className="text-xs text-[#4A5560] leading-relaxed bg-emerald-50/50 p-2 rounded border border-emerald-100/60 pl-3 relative before:content-[''] before:absolute before:left-1 before:top-3.5 before:w-1 before:h-1 before:rounded-full before:bg-emerald-600">
                        {fact}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-red-800 font-bold text-xs uppercase font-mono pb-2 border-b border-red-100">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    Disputed Facts
                  </div>
                  <ul className="mt-3 space-y-2">
                    {analysis.stage0.disputedFacts.map((fact, idx) => (
                      <li key={idx} className="text-xs text-[#4A5560] leading-relaxed bg-red-50/50 p-2 rounded border border-red-100/60 pl-3 relative before:content-[''] before:absolute before:left-1 before:top-3.5 before:w-1 before:h-1 before:rounded-full before:bg-red-500">
                        {fact}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase font-mono pb-2 border-b border-amber-100">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    Inferred / Implied
                  </div>
                  <ul className="mt-3 space-y-2">
                    {analysis.stage0.inferredFacts.map((fact, idx) => (
                      <li key={idx} className="text-xs text-[#4A5560] leading-relaxed bg-amber-50/50 p-2 rounded border border-amber-100/60 pl-3 relative before:content-[''] before:absolute before:left-1 before:top-3.5 before:w-1 before:h-1 before:rounded-full before:bg-amber-600">
                        {fact}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Liability vs Quantum of Relief */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-[#E5E1D8] pt-6 bg-[#FDFBF7] p-4 rounded-md border border-[#E5E1D8]">
                <div>
                  <h4 className="text-xs font-bold font-mono uppercase text-[#1E252B] mb-2">Facts going to Liability</h4>
                  <ul className="space-y-1.5">
                    {analysis.stage0.liabilityFacts.map((f, i) => (
                      <li key={i} className="text-xs text-[#4A5560] pl-4 relative before:content-['▷'] before:absolute before:left-0 before:text-[#C5A059]">{f}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-bold font-mono uppercase text-[#1E252B] mb-2">Facts going to Quantum of Relief</h4>
                  <ul className="space-y-1.5">
                    {analysis.stage0.quantumFacts.map((f, i) => (
                      <li key={i} className="text-xs text-[#4A5560] pl-4 relative before:content-['▷'] before:absolute before:left-0 before:text-[#C5A059]">{f}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 1: CIVIL LAW AREA DETERMINATION */}
          {activeStage === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <p className="text-sm text-[#4A5560] leading-relaxed italic">
                Identifies the primary and subsidiary civil domains applicable. Civil litigation in Bangladesh often intersects multiple regulatory framework codes.
              </p>

              <div className="flex flex-wrap gap-4 items-center mb-4">
                <div className="p-4 bg-[#1E252B] text-[#FDFBF7] rounded border border-[#1E252B] hover:shadow-md transition duration-150">
                  <div className="text-[10px] font-mono text-[#C5A059] font-bold uppercase tracking-wider">Primary Civil Domain</div>
                  <div className="text-lg font-bold legal-hdr">{analysis.stage1.primaryDomain}</div>
                </div>
                {analysis.stage1.subsidiaryDomains.map((dom, i) => (
                  <div key={i} className="p-3 bg-white border border-[#E5E1D8] rounded">
                    <div className="text-[9px] font-mono uppercase tracking-wider text-[#4A5560]">Subsidiary Domain</div>
                    <div className="text-xs font-semibold text-[#1E252B]">{dom}</div>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider font-mono text-[#1E252B] mb-3">Statutory Triggers & Concrete Facts</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-[#1E252B] text-[#FDFBF7] font-mono">
                        <th className="p-2.5 border border-[#E5E1D8]">Target Domain</th>
                        <th className="p-2.5 border border-[#E5E1D8]">Specific Fact Element</th>
                        <th className="p-2.5 border border-[#E5E1D8]">Constituent Legal Trigger</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E1D8]">
                      {analysis.stage1.triggerFacts.map((item, idx) => (
                        <tr key={idx} className="hover:bg-neutral-50/50">
                          <td className="p-2.5 border border-[#E5E1D8] font-bold text-[#1E252B]">{item.domain}</td>
                          <td className="p-2.5 border border-[#E5E1D8] text-[#4A5560] leading-relaxed">{item.fact}</td>
                          <td className="p-2.5 border border-[#E5E1D8] font-mono text-[#C5A059]">{item.statutoryTrigger}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 2: APPLICABLE LEGISLATION MAP */}
          {activeStage === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <p className="text-sm text-[#4A5560] leading-relaxed italic">
                A complete map showing the cascading layout of acts, rules, and precedents of Bangladesh courts.
              </p>

              <div className="p-4 bg-[#FDFBF7] border-l-4 border-[#C5A059] border border-[#E5E1D8] rounded-md">
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#C5A059] uppercase block">Primary Governing Statute</span>
                <span className="text-md font-bold text-[#1E252B]">{analysis.stage2.primaryAct}</span>
              </div>

              <div>
                <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-[#1E252B] mb-2 flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-[#C5A059]" />
                  Section/Rule Allocations
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysis.stage2.relevantSections.map((sec, i) => (
                    <div key={i} className="bg-white p-3 border border-[#E5E1D8] rounded hover:border-[#1E252B] transition-colors">
                      <div className="flex justify-between items-start gap-1 font-mono">
                        <span className="text-[10px] leading-none bg-[#E5E1D8] font-semibold text-[#1E252B] uppercase px-1.5 py-0.5 rounded">{sec.actName}</span>
                        <span className="text-xs font-semibold text-[#C5A059]">{sec.sectionOrRule}</span>
                      </div>
                      <p className="text-xs text-[#4A5560] mt-2 leading-relaxed">{sec.purpose}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Precedents Card Table */}
              <div className="border-t border-[#E5E1D8] pt-6">
                <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-[#1E252B] mb-3 flex items-center gap-1.5">
                  <Scale className="h-4 w-4 text-[#C5A059]" />
                  Relevant / Binding Judicial Precedents (AD / HCD)
                </h4>
                <div className="space-y-4">
                  {analysis.stage2.precedents.map((prec, i) => (
                    <div key={i} className="border border-[#E5E1D8] rounded bg-[#FDFBF7] p-4 relative overflow-hidden">
                      <div className="absolute right-3 top-3 px-2 py-0.5 rounded bg-amber-50 text-[10px] font-mono font-semibold text-[#C5A059] border border-amber-200">
                        {prec.court}
                      </div>
                      <div className="text-xs font-bold font-mono text-[#1E252B]">{prec.citation}</div>
                      <div className="text-xs italic text-[#4A5560] mt-1 leading-snug">" {prec.holding} "</div>
                      <div className="text-xs mt-3 pt-2 border-t border-[#E5E1D8] text-[#4A5560]">
                        <span className="font-semibold text-[10px] uppercase font-mono tracking-wider text-[#C5A059]">Application:</span> {prec.relevance}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Equity Principles */}
              <div className="border-t border-[#E5E1D8] pt-6">
                <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-[#1E252B] mb-2">Equity Principles invoked (where statutes are silent/ambiguous)</h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.stage2.equityPrinciples.map((ep, i) => (
                    <span key={i} className="text-xs bg-[#F9F7F2] border border-[#E5E1D8] text-[#4A5560] px-2.5 py-1 rounded">
                      {ep}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STAGE 3: LIMITATION */}
          {activeStage === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <p className="text-sm text-[#4A5560] leading-relaxed italic">
                A non-negotiable preliminary check under the Limitation Act 1908. A suit filed beyond the prescribed period has no maintainability, requiring absolute dismissal at the outset.
              </p>

              {/* Limitation Shield */}
              <div className={`p-5 rounded-md border flex items-start gap-4 ${
                analysis.stage3.isTimeBarred 
                  ? "bg-red-50 border-red-200 text-red-900" 
                  : "bg-emerald-50 border-emerald-200 text-emerald-900"
              }`}>
                {analysis.stage3.isTimeBarred ? (
                  <ShieldAlert className="h-8 w-8 text-red-600 flex-shrink-0 mt-1" />
                ) : (
                  <ShieldCheck className="h-8 w-8 text-emerald-600 flex-shrink-0 mt-1" />
                )}
                <div>
                  <h3 className="text-md font-bold uppercase font-mono tracking-wider">
                    {analysis.stage3.isTimeBarred ? "POTENTIALLY LIMITATION BARRED" : "SUIT MAINTAINABLE IN TIME"}
                  </h3>
                  <p className="text-xs mt-1 leading-relaxed opacity-90">
                    The suit's limitation check indicates that actions are taken within the boundaries set out by the First Schedule of the Limitation Act, 1908.
                  </p>
                </div>
              </div>

              {/* Limitation Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 border border-[#E5E1D8] rounded text-center">
                  <div className="text-[10px] font-mono text-[#C5A059] uppercase tracking-wider">Cause of Action Accrual</div>
                  <div className="text-md font-bold text-[#1E252B] mt-1">{analysis.stage3.accrualDate}</div>
                </div>
                <div className="bg-white p-4 border border-[#E5E1D8] rounded text-center">
                  <div className="text-[10px] font-mono text-[#C5A059] uppercase tracking-wider">Prescribed Statutory Period</div>
                  <div className="text-md font-bold text-[#1E252B] mt-1">{analysis.stage3.prescribedPeriod}</div>
                </div>
                <div className="bg-white p-4 border border-[#E5E1D8] rounded text-center">
                  <div className="text-[10px] font-mono text-[#C5A059] uppercase tracking-wider">Limitation Schedule Article</div>
                  <div className="text-md font-bold text-amber-900 font-mono mt-1">{analysis.stage3.limitationArticle}</div>
                </div>
              </div>

              <div className="border-t border-[#E5E1D8] pt-6">
                <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-[#1E252B] mb-2">Extension or Condonation Factors (Limitation Act Sections 18, 19, etc.)</h4>
                <div className="bg-[#FDFBF7] p-3 border border-[#E5E1D8] rounded text-xs text-[#4A5560] leading-relaxed">
                  {analysis.stage3.exceptionsOrExtensions}
                </div>
              </div>

              <div className="border-t border-[#E5E1D8] pt-6">
                <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-[#1E252B] mb-2">Detailed Preliminary Chronological Analysis</h4>
                <div className="bg-white p-4 border border-[#E5E1D8] rounded text-xs text-[#4A5560] leading-relaxed border-l-4 border-l-[#C5A059]">
                  {analysis.stage3.preliminaryAnalysis}
                </div>
              </div>
            </div>
          )}

          {/* STAGE 4: PARTY ANALYSIS */}
          {activeStage === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <p className="text-sm text-[#4A5560] leading-relaxed italic">
                Evaluates legal identity, capacity parameters, and possible joinder defects under Order I CPC (necessary vs. proper parties) to check for suit failing.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Plaintiff Card */}
                <div className="border border-[#E5E1D8] rounded bg-white overflow-hidden">
                  <div className="p-3 bg-[#1E252B] text-[#FDFBF7] font-mono text-xs uppercase font-bold tracking-wide flex items-center justify-between">
                    <span>Plaintiff Side</span>
                    <span className="bg-[#C5A059] text-[#1E252B] text-[9px] px-1.5 py-0.5 rounded font-bold">Locus Standi</span>
                  </div>
                  <div className="p-4 space-y-4">
                    {analysis.stage4.plaintiffs.map((p, idx) => (
                      <div key={idx} className="pb-3 border-b border-[#E5E1D8] last:pb-0 last:border-b-0 space-y-1">
                        <div className="text-xs font-bold text-[#1E252B] flex items-center gap-1.5">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          {p.name}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[10px] text-[#4A5560] uppercase tracking-wider mt-1.5 font-mono">
                          <div><span className="font-bold opacity-60">Identity:</span> {p.legalIdentity}</div>
                          <div><span className="font-bold opacity-60">Capacity:</span> {p.capacity}</div>
                        </div>
                        <div className="text-xs text-[#4A5560] bg-[#FDFBF7] p-2 rounded border border-[#E5E1D8]/50 mt-1 font-sans">
                          <span className="font-mono font-bold text-[10px] text-[#C5A059]">Cause of Action Link:</span> {p.causeOfActionAccess}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Defendant Card */}
                <div className="border border-[#E5E1D8] rounded bg-white overflow-hidden">
                  <div className="p-3 bg-[#4A5560] text-white font-mono text-xs uppercase font-bold tracking-wide flex items-center justify-between">
                    <span>Defendant Side</span>
                    <span className="bg-[#E5E1D8] text-[#1E252B] text-[9px] px-1.5 py-0.5 rounded font-bold">Liability Target</span>
                  </div>
                  <div className="p-4 space-y-4">
                    {analysis.stage4.defendants.map((d, idx) => (
                      <div key={idx} className="pb-3 border-b border-[#E5E1D8] last:pb-0 last:border-b-0 space-y-1">
                        <div className="text-xs font-bold text-[#1E252B] flex items-center gap-1.5">
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                          {d.name}
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-[10px] text-[#4A5560] uppercase tracking-wider mt-1.5 font-mono">
                          <div><span className="font-bold opacity-60">Identity:</span> {d.legalIdentity}</div>
                          <div><span className="font-bold opacity-60">Capacity:</span> {d.capacity}</div>
                        </div>
                        <div className="text-xs text-[#4A5560] bg-[#FDFBF7] p-2 rounded border border-[#E5E1D8]/50 mt-1 font-sans">
                          <span className="font-mono font-bold text-[10px] text-[#C5A059]">Liability Allocation:</span> {d.liabilityType}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Joinder / Locus summary */}
              <div className="bg-[#FDFBF7] border border-[#E5E1D8] p-4 rounded text-xs space-y-3">
                <div>
                  <h4 className="font-bold uppercase font-mono text-xs text-[#1E252B]">Necessary and Proper Parties Check (O.I CPC)</h4>
                  <p className="text-[#4A5560] mt-1 leading-relaxed">{analysis.stage4.joinderIssues}</p>
                </div>
                <div className="border-t border-[#E5E1D8] pt-3">
                  <h4 className="font-bold uppercase font-mono text-xs text-[#1E252B]">Locus Standi Summary (s.9 CPC Right of Suit)</h4>
                  <p className="text-[#4A5560] mt-1 leading-relaxed">{analysis.stage4.locusStandiSummary}</p>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 5: JURISDICTION DETERMINATION */}
          {activeStage === 5 && (
            <div className="space-y-6 animate-fadeIn">
              <p className="text-sm text-[#4A5560] leading-relaxed italic">
                A detailed structural dissection of court jurisdiction limits across territorial boundaries, pecuniary valuation scales, and subject matter exemptions.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 5A: Territorial */}
                <div className="bg-white p-4 border border-[#E5E1D8] rounded space-y-3">
                  <div className="flex items-center gap-2 text-[#1E252B] font-bold font-mono text-xs uppercase border-b border-[#E5E1D8] pb-1.5">
                    <Scale className="h-4 w-4 text-[#C5A059]" />
                    5A. Territorial Limits
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block font-semibold">Jurisdiction Clause</span>
                    <span className="text-xs font-bold text-[#1E252B]">{analysis.stage5.territorial.rule}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block font-semibold">CPC Section Code</span>
                    <span className="text-xs font-mono font-semibold text-[#C5A059]">{analysis.stage5.territorial.governingSection}</span>
                  </div>
                  <p className="text-xs text-[#4A5560] leading-relaxed bg-[#FDFBF7] p-2 rounded">{analysis.stage5.territorial.jurisdictionalFacts}</p>
                </div>

                {/* 5B: Pecuniary */}
                <div className="bg-white p-4 border border-[#E5E1D8] rounded space-y-3">
                  <div className="flex items-center gap-2 text-[#1E252B] font-bold font-mono text-xs uppercase border-b border-[#E5E1D8] pb-1.5">
                    <DollarSign className="h-4 w-4 text-[#C5A059]" />
                    5B. Pecuniary Limits
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block font-semibold">Ad-Valorem Valuation</span>
                    <span className="text-xs font-bold text-[#1E252B]">{analysis.stage5.pecuniary.valuation}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block font-semibold">Competent Trial Court</span>
                    <span className="text-xs font-bold text-amber-900">{analysis.stage5.pecuniary.courtLevel}</span>
                  </div>
                  <p className="text-xs text-[#4A5560] leading-relaxed bg-[#FDFBF7] p-2 rounded">
                    <span className="font-semibold">{analysis.stage5.pecuniary.pecuniaryLimits}</span>. {analysis.stage5.pecuniary.suitsValuationActNotes}
                  </p>
                </div>

                {/* 5C: Subject Matter */}
                <div className="bg-white p-4 border border-[#E5E1D8] rounded space-y-3">
                  <div className="flex items-center gap-2 text-[#1E252B] font-bold font-mono text-xs uppercase border-b border-[#E5E1D8] pb-1.5">
                    <AlertTriangle className="h-4 w-4 text-[#C5A059]" />
                    5C. Subject Matter
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block font-semibold">Excluded to Special Courts?</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase font-mono ${
                      analysis.stage5.subjectMatter.isExcluded 
                        ? "bg-red-100 text-red-900 border border-red-200" 
                        : "bg-emerald-100 text-emerald-900 border border-emerald-200"
                    }`}>
                      {analysis.stage5.subjectMatter.isExcluded ? "EXCLUDED (BARRED)" : "GENERAL CIVIL COGNIZANCE"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block font-semibold">Triable Forum / Statute</span>
                    <span className="text-xs font-bold text-[#1E252B]">{analysis.stage5.subjectMatter.forum}</span>
                  </div>
                  <p className="text-xs text-[#4A5560] leading-relaxed bg-[#FDFBF7] p-2 rounded">
                    Governed by: <span className="font-mono text-[10px] text-[#C5A059]">{analysis.stage5.subjectMatter.governingStatute}</span>
                  </p>
                </div>
              </div>

              {/* Objection Strategy */}
              <div className="border-t border-[#E5E1D8] pt-6 bg-[#FDFBF7] p-4 rounded border">
                <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-[#1E252B] mb-1">5D. Jurisdiction Objection Strategy (Timing - Section 21 CPC)</h4>
                <p className="text-xs text-[#4A5560] leading-relaxed">{analysis.stage5.objectionStrategy}</p>
              </div>
            </div>
          )}

          {/* STAGE 6: PLEADINGS ANALYSIS */}
          {activeStage === 6 && (
            <div className="space-y-6 animate-fadeIn">
              <p className="text-sm text-[#4A5560] leading-relaxed italic">
                Statutory analysis of basic pleadings parameters (Order VII Plaint vs. Order VIII Written Statement CPC). Triggers for O.VII R.11 Plaint Rejection are evaluated.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Plaint checklist */}
                <div className="bg-white p-4 border border-[#E5E1D8] rounded space-y-3">
                  <h4 className="text-xs font-bold font-mono uppercase text-[#1E252B] border-b pb-1.5 border-[#E5E1D8] flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-[#C5A059]" />
                    Order VII Plaint Validation Checklist
                  </h4>
                  <ul className="space-y-2">
                    {analysis.stage6.plaintChecklist.map((item, idx) => (
                      <li key={idx} className="flex gap-2 items-start text-xs text-[#4A5560]">
                        <span className="w-4 h-4 rounded-full bg-[#E5E1D8]/40 text-[#1E252B] font-semibold flex items-center justify-center font-mono text-[9px] flex-shrink-0 mt-0.5">{idx+1}</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Plaint Rejection Ground */}
                <div className="bg-white p-4 border border-[#E5E1D8] rounded space-y-3">
                  <h4 className="text-xs font-bold font-mono uppercase text-red-900 border-b pb-1.5 border-red-100 flex items-center gap-1.5 bg-red-50/20 p-2 rounded-t">
                    <AlertTriangle className="h-4 w-4 text-red-600 animate-pulse" />
                    O.VII R.11 CPC Ground Checklist (Risk Assessment)
                  </h4>
                  <ul className="space-y-2">
                    {analysis.stage6.groundsForRejection.map((item, idx) => (
                      <li key={idx} className="flex gap-2 items-start text-xs text-[#4A5560] bg-red-50/30 p-2 rounded border border-red-100/30">
                        <span className="text-red-500 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Written Statement Assessments */}
              <div className="border-t border-[#E5E1D8] pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#FDFBF7] p-4 border border-[#E5E1D8] rounded">
                  <h4 className="text-xs font-bold font-mono uppercase text-[#1E252B] mb-1">WS Specific Denials vs Deemed Admissions (O.VIII R.5)</h4>
                  <p className="text-xs text-[#4A5560] leading-relaxed mt-1">{analysis.stage6.writtenStatementDeemedAdmissions}</p>
                </div>
                <div className="bg-[#FDFBF7] p-4 border border-[#E5E1D8] rounded">
                  <h4 className="text-xs font-bold font-mono uppercase text-[#1E252B] mb-1">Set-off / Counterclaim Potential (O.VIII RR. 6, 6A)</h4>
                  <p className="text-xs text-[#4A5560] leading-relaxed mt-1">{analysis.stage6.counterclaimsOrSetOff}</p>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 7: ISSUE FRAMING */}
          {activeStage === 7 && (
            <div className="space-y-6 animate-fadeIn">
              <p className="text-sm text-[#4A5560] leading-relaxed italic">
                Formulating the key battlegrounds (issues) under Order XIV CPC. When material declarations of fact/law are affirmed by one side and refuted by the other.
              </p>

              <div className="space-y-4">
                {analysis.stage7.issues.map((issue) => (
                  <div key={issue.issueNo} className="border border-[#E5E1D8] rounded overflow-hidden shadow-sm hover:border-[#1E252B] transition-colors bg-white">
                    <div className="p-3 bg-[#F9F7F2] border-b border-[#E5E1D8] flex flex-wrap justify-between items-center gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold bg-[#1E252B] text-white px-2 py-0.5 rounded leading-none">ISSUE {issue.issueNo}</span>
                        <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-amber-900 border border-amber-200 bg-amber-50 px-1.5 py-0.5 rounded leading-none">
                          {issue.type}
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-[#4A5560]">
                        Burden of proof: <span className="font-bold text-[#1E252B]">{issue.burden}</span>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <h4 className="text-md font-bold legal-hdr text-[#1E252B]">
                        Whether {issue.title}
                      </h4>
                      <p className="text-xs leading-relaxed text-[#4A5560] border-t border-[#E5E1D8]/50 pt-3">
                        <span className="font-mono font-bold text-[10px] uppercase text-[#C5A059] block mb-1">Required Evidentiary Materials:</span>
                        {issue.evidenceRequired}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STAGE 8: EVIDENCE ANALYSTS */}
          {activeStage === 8 && (
            <div className="space-y-6 animate-fadeIn">
              <p className="text-sm text-[#4A5560] leading-relaxed italic">
                The Admissibility Gate under the Evidence Act 1872. Classifies tender, maps burden, and verifies available statutory presumptions supporting the case assets.
              </p>

              <div>
                <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-[#1E252B] mb-2">1. Admissibility and Challenge Grid</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs text-left border-collapse border border-[#E5E1D8]">
                    <thead>
                      <tr className="bg-[#1E252B] text-[#FDFBF7] font-mono">
                        <th className="p-2 border border-[#E5E1D8]">Exhibited Evidence / Doc</th>
                        <th className="p-2 border border-[#E5E1D8]">Source Party</th>
                        <th className="p-2 border border-[#E5E1D8]">Classification</th>
                        <th className="p-2 border border-[#E5E1D8]">Evidence Act Section</th>
                        <th className="p-2 border border-[#E5E1D8]">Admissibility / Challenges</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E1D8]">
                      {analysis.stage8.evidenceList.map((ev, i) => (
                        <tr key={i} className="hover:bg-neutral-50/50">
                          <td className="p-2.5 border border-[#E5E1D8] font-semibold text-[#1E252B]">{ev.item}</td>
                          <td className="p-2.5 border border-[#E5E1D8]">{ev.source}</td>
                          <td className="p-2.5 border border-[#E5E1D8] font-mono text-[10px] uppercase text-[#4A5560]">{ev.type}</td>
                          <td className="p-2.5 border border-[#E5E1D8] font-mono text-[#C5A059] font-bold">{ev.governingSection}</td>
                          <td className="p-2.5 border border-[#E5E1D8] text-[#4A5560] leading-relaxed">{ev.admissibilityChallenge}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Burden assignment and Presumptions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-[#E5E1D8] pt-6">
                <div>
                  <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-[#1E252B] mb-3">Burden Shifting Dynamic Patterns</h4>
                  <ul className="space-y-2">
                    {analysis.stage8.burdenAssignments.map((b, idx) => (
                      <li key={idx} className="text-xs text-[#4A5560] bg-[#FDFBF7] p-2.5 rounded border border-[#E5E1D8]/70 leading-relaxed">
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-[#1E252B] mb-3">Available Statutory Presumptions (Evidence Act)</h4>
                  <div className="space-y-3">
                    {analysis.stage8.statutoryPresumptions.map((p, i) => (
                      <div key={i} className="p-2.5 bg-amber-50/20 border border-amber-900/10 rounded-md">
                        <div className="flex justify-between items-center bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          <span className="font-mono text-[10px] font-bold text-amber-900">{p.statuteSection}</span>
                          <span className="text-[9px] uppercase tracking-wider font-mono font-bold text-[#4A5560]">{p.presumptionStyle}</span>
                        </div>
                        <p className="text-xs text-[#4A5560] mt-2 leading-relaxed">{p.effectOnCase}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 9: ISSUE-WISE ANALYSIS */}
          {activeStage === 9 && (
            <div className="space-y-6 animate-fadeIn">
              <p className="text-sm text-[#4A5560] leading-relaxed italic">
                A massive analytical structure detailing the arguments, evidence weight, and probable court findings on each structured suit issue based on the Evidence Act standards.
              </p>

              <div className="space-y-6">
                {analysis.stage9.issueDetails.map((item) => (
                  <div key={item.issueNo} className="border border-[#E5E1D8] rounded-md overflow-hidden shadow-sm bg-white hover:border-[#1E252B] transition duration-150">
                    <div className="p-3 bg-[#1E252B] text-white font-mono text-xs uppercase font-bold tracking-wide flex justify-between items-center">
                      <span>ISSUE No. {item.issueNo}</span>
                      <span className="text-[10px] bg-[#C5A059] text-[#1E252B] px-1.5 py-0.5 rounded font-bold">MERITS CONTEST</span>
                    </div>
                    
                    <div className="p-4 bg-[#FDFBF7] border-b border-[#E5E1D8]">
                      <h4 className="text-md font-bold text-[#1E252B]">Whether {item.issueTitle}</h4>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                      <div className="bg-emerald-50/20 border border-emerald-100 p-3 rounded-md">
                        <h5 className="font-mono font-bold text-[10px] text-emerald-800 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          Plaintiff Position
                        </h5>
                        <p className="text-xs text-[#4A5560] leading-relaxed">{item.plaintiffPosition}</p>
                      </div>

                      <div className="bg-red-50/20 border border-red-100 p-3 rounded-md">
                        <h5 className="font-mono font-bold text-[10px] text-red-800 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                          <AlertTriangle className="h-3.5 w-3.5 text-red-600" />
                          Defendant Position
                        </h5>
                        <p className="text-xs text-[#4A5560] leading-relaxed">{item.defendantPosition}</p>
                      </div>
                    </div>

                    <div className="p-4 border-t border-[#E5E1D8] bg-[#FDFBF7] space-y-3">
                      <div className="space-y-1">
                        <h5 className="font-mono font-bold text-[10px] text-amber-900 uppercase tracking-widest">Court Analysis & Weight of Evidence</h5>
                        <p className="text-xs text-[#4A5560] leading-relaxed bg-white p-3 border border-[#E5E1D8] rounded">
                          {item.courtAnalysis}
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t border-[#E5E1D8]/60 pt-3 gap-2">
                        <span className="text-[10px] uppercase font-mono tracking-widest font-bold text-[#C5A059]">PROJECTED TRIAL FINDING:</span>
                        <span className="font-mono font-bold text-xs bg-[#1E252B] text-white px-2 py-1 rounded">
                          {item.projectedFinding}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STAGE 10: EQUITY PRINCIPLES */}
          {activeStage === 10 && (
            <div className="space-y-6 animate-fadeIn">
              <p className="text-sm text-[#4A5560] leading-relaxed italic">
                Evaluates key equitable principles under the Specific Relief Act (SRA) 1877 context—discretionary limits on declarations, injunctions, and specific performance.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {analysis.stage10.applicablePrinciples.map((ep, i) => (
                  <div key={i} className="bg-white p-4 border border-[#E5E1D8] rounded-md shadow-sm space-y-2 hover:border-[#C5A059] transition duration-150">
                    <span className="text-xs font-bold font-mono text-[#C5A059] uppercase block">{ep.principle}</span>
                    <p className="text-xs text-[#4A5560] leading-relaxed">{ep.application}</p>
                    <div className="text-[10px] text-[#4A5560] pt-2 border-t border-[#E5E1D8]/60 mt-1">
                      <span className="font-mono font-semibold uppercase">Effect on Judgment:</span> <span className="font-semibold text-[#1E252B]">{ep.weight}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#E5E1D8] pt-6 bg-[#FDFBF7] p-4 rounded border-l-4 border-l-[#C5A059] border">
                <h4 className="text-xs font-bold font-mono uppercase text-[#1E252B] mb-2">Discretionary Relief Conditions (SRA 1877 Sections 12, 42, 52-57 Limits)</h4>
                <p className="text-xs text-[#4A5560] leading-relaxed">{analysis.stage10.discretionaryReliefCheck}</p>
              </div>
            </div>
          )}

          {/* STAGE 11: CONVENTIONAL CIVIL COURT STAGES */}
          {activeStage === 11 && (
            <div className="space-y-6 animate-fadeIn">
              <p className="text-sm text-[#4A5560] leading-relaxed italic">
                A visual mapping of the actual stage litigation pathway in Bangladesh, tracing through CPC O.VII and Order XVIII actions.
              </p>

              <div className="space-y-3">
                {analysis.stage11.timelineProgress.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start bg-white p-4 border border-[#E5E1D8] rounded hover:border-[#1E252B] transition duration-150">
                    <div className="bg-[#1E252B] text-white border border-[#1E252B] rounded font-mono text-xs font-bold w-12 h-12 flex-shrink-0 flex items-center justify-center">
                      #{idx+1}
                    </div>
                    
                    <div className="min-w-0 flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <div className="text-[9px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Litigation Phase</div>
                        <h4 className="text-xs font-bold text-[#1E252B] leading-snug">{item.stageName}</h4>
                        <span className="text-[10px] font-mono text-[#C5A059] block mt-0.5">{item.cpcReference}</span>
                      </div>

                      <div>
                        <div className="text-[9px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Statutory Steps</div>
                        <p className="text-xs text-[#4A5560] mt-0.5 leading-normal">{item.subActions}</p>
                      </div>

                      <div>
                        <div className="text-[9px] font-mono uppercase tracking-wider text-neutral-400 font-semibold">Tactical Action & Pitfalls</div>
                        <p className="text-xs text-amber-900 mt-0.5 leading-normal italic font-medium">{item.strategicPlay}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STAGE 12: APPEAL PATHWAY */}
          {activeStage === 12 && (
            <div className="space-y-6 animate-fadeIn">
              <p className="text-sm text-[#4A5560] leading-relaxed italic">
                Cascading appellate nodes available following trial court decree based on question parameters under s.96, s.100, s.115 CPC.
              </p>

              <div className="space-y-4 max-w-xl mx-auto">
                {analysis.stage12.appealNodes.map((node, i) => (
                  <div key={i} className="relative">
                    {i > 0 && <div className="absolute left-[24px] -top-5 w-0.5 h-5 bg-[#E5E1D8]"></div>}
                    <div className="flex gap-3 items-center bg-white border border-[#E5E1D8] p-3 rounded shadow-sm hover:border-[#C5A059] transition duration-150">
                      <div className="w-10 h-10 rounded-full bg-[#1E252B] text-white flex items-center justify-center font-bold text-xs uppercase font-mono">
                        N{i+1}
                      </div>
                      
                      <div className="min-w-0 flex-1">
                        <div className="flex justify-between items-start gap-1">
                          <h4 className="text-xs font-bold text-[#1E252B]">{node.level}</h4>
                          <span className="text-[10px] font-mono bg-neutral-100 text-neutral-800 px-1.5 py-0.5 rounded uppercase font-semibold">{node.governingSection}</span>
                        </div>
                        <div className="text-[10px] font-semibold text-[#C5A059] uppercase tracking-wide font-mono mt-0.5">Court: {node.authority}</div>
                        <p className="text-xs text-[#4A5560] mt-1.5 leading-relaxed bg-[#FDFBF7] p-2 rounded border border-[#E1DDD4]/40">{node.scope}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STAGE 13: FINAL SYNTHESIS */}
          {activeStage === 13 && (
            <div className="space-y-6 animate-fadeIn">
              <p className="text-sm text-[#4A5560] leading-relaxed italic">
                Final analytical summary of the suit outcomes, decreed elements, costs, and eventual execution challenges under Order XXI CPC.
              </p>

              <div className="p-4 bg-[#1E252B] text-white rounded-md border border-[#1E252B]">
                <h3 className="text-xs font-mono font-bold text-[#C5A059] uppercase tracking-widest">Analytical Overview Summary</h3>
                <p className="text-xs leading-relaxed mt-1.5 text-[#FDFBF7]">{analysis.stage13.overview}</p>
              </div>

              {/* Grid synthesis details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 border border-[#E5E1D8] rounded">
                  <h4 className="text-xs font-bold font-mono uppercase text-[#1E252B] border-b pb-1.5 border-[#E5E1D8] flex items-center gap-1">
                    <Scale className="h-4 w-4 text-[#C5A059]" />
                    Decreed Relief / Recovery quantum (s.34 CPC)
                  </h4>
                  <p className="text-xs text-[#4A5560] leading-relaxed mt-2">{analysis.stage13.reliefDecree}</p>
                </div>

                <div className="bg-white p-4 border border-[#E5E1D8] rounded">
                  <h4 className="text-xs font-bold font-mono uppercase text-[#1E252B] border-b pb-1.5 border-[#E5E1D8] flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-[#C5A059]" />
                    Suit Cost Apportionment (Section 35 CPC)
                  </h4>
                  <p className="text-xs text-[#4A5560] leading-relaxed mt-2">{analysis.stage13.costsApportionment}</p>
                </div>

                <div className="bg-white p-4 border border-[#E5E1D8] rounded">
                  <h4 className="text-xs font-bold font-mono uppercase text-[#1E252B] border-b pb-1.5 border-[#E5E1D8] flex items-center gap-1">
                    <Scale className="h-4 w-4 text-[#C5A059]" />
                    Equitable Bars Impacting Decreed Reliefs
                  </h4>
                  <p className="text-xs text-[#4A5560] leading-relaxed mt-2">{analysis.stage13.equitableBars}</p>
                </div>

                <div className="bg-white p-4 border border-[#E5E1D8] rounded">
                  <h4 className="text-xs font-bold font-mono uppercase text-[#1E252B] border-b pb-1.5 border-[#E5E1D8] flex items-center gap-1">
                    <GitMerge className="h-4 w-4 text-[#C5A059]" />
                    Execution Pathway (O.XXI CPC & Art 182 Limitation)
                  </h4>
                  <p className="text-xs text-[#4A5560] leading-relaxed mt-2">{analysis.stage13.executionPathway}</p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
