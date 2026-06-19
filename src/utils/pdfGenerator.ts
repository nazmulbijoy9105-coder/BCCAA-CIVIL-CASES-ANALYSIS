import { jsPDF } from "jspdf";
import { CaseAnalysisResponse } from "../types";

export function generatePDF(analysis: CaseAnalysisResponse, originalFactPattern: string) {
  const doc = new jsPDF("p", "mm", "a4");
  
  // Embed mandatory document properties/metadata
  doc.setProperties({
    title: `BCCAA Legal Briefing - ${analysis.stage1.primaryDomain}`,
    subject: "BCCAA Case Analysis Report",
    author: "Md. Nazmul Islam, Advocate",
    creator: "Neum Lex Counsel Jurisprudential Engine",
    keywords: "Bangladesh Civil Law, CPC, Land Dispute, Contract Act, Family Law"
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 20;
  const marginY = 20;
  const contentWidth = pageWidth - (marginX * 2); // 170mm
  const maxY = pageHeight - marginY;
  
  let pageNumber = 1;

  // Track vertical cursor position
  let y = marginY;

  // Helper functions
  const addPageHeaderAndFooter = (pageNum: number) => {
    // Header
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text("BANGLADESH CIVIL CASE ANALYSIS ARCHITECTURE (BCCAA)", marginX, 10);
    doc.text("COURT-GRADE BRIEFING PAPER", pageWidth - marginX - doc.getTextWidth("COURT-GRADE BRIEFING PAPER"), 10);
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.2);
    doc.line(marginX, 12, pageWidth - marginX, 12);

    // Footer
    doc.line(marginX, pageHeight - 15, pageWidth - marginX, pageHeight - 15);
    doc.text(`Page ${pageNum}`, pageWidth / 2, pageHeight - 10, { align: "center" });
    const localTime = new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
    doc.text(`Generated: ${localTime}`, marginX, pageHeight - 10);
    doc.text("BCCAA Support System v1.4", pageWidth - marginX - doc.getTextWidth("BCCAA Support System v1.4"), pageHeight - 10);
  };

  const checkPageSpace = (neededHeight: number) => {
    if (y + neededHeight > maxY) {
      doc.addPage();
      pageNumber++;
      y = marginY + 5; // offset slightly from top line
      addPageHeaderAndFooter(pageNumber);
    }
  };

  // Pre-initialize first page header/footer
  addPageHeaderAndFooter(pageNumber);

  // Styling helper for section headings
  const printMainSectionHeader = (title: string) => {
    checkPageSpace(15);
    y += 5;
    doc.setFillColor(30, 37, 43); // Dark Slate background
    doc.rect(marginX, y, contentWidth, 7, "F");
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(title.toUpperCase(), marginX + 3, y + 4.8);
    
    y += 11;
  };

  const printSubsectionHeader = (title: string) => {
    checkPageSpace(10);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(197, 160, 89); // Gold
    doc.text(title, marginX, y);
    y += 4.5;
  };

  const printBodyText = (text: string, isItalic = false) => {
    if (!text) return;
    doc.setFont("helvetica", isItalic ? "italic" : "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(60, 60, 60);

    const splitText = doc.splitTextToSize(text, contentWidth);
    for (const paragraph of splitText) {
      checkPageSpace(5);
      doc.text(paragraph, marginX, y);
      y += 4;
    }
    y += 1.5; // post-spacing
  };

  const printLabelValue = (label: string, value: string) => {
    checkPageSpace(5);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(30, 37, 43);
    const fullLabel = label + ": ";
    doc.text(fullLabel, marginX, y);
    
    const labelWidth = doc.getTextWidth(fullLabel);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(60, 60, 60);
    
    const maxValWidth = contentWidth - labelWidth;
    const splitVal = doc.splitTextToSize(value || "-", maxValWidth);
    
    let isFirst = true;
    for (const line of splitVal) {
      if (!isFirst) {
        checkPageSpace(5);
        doc.text(line, marginX + labelWidth, y);
      } else {
        doc.text(line, marginX + labelWidth, y);
        isFirst = false;
      }
      y += 4;
    }
    y += 1;
  };

  // Now, let's write out the Document Content
  // 1. Cover Info / Headline
  y = marginY + 10;
  
  // Double court border style
  doc.setDrawColor(30, 37, 43);
  doc.setLineWidth(0.8);
  doc.rect(marginX - 2, marginY + 5, contentWidth + 4, 30);
  doc.setLineWidth(0.2);
  doc.rect(marginX - 1, marginY + 6, contentWidth + 2, 28);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(30, 37, 43);
  doc.text("BANGLADESH CIVIL COURT ANALYSIS BRIEFING", pageWidth / 2, marginY + 14, { align: "center" });
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(197, 160, 89);
  doc.text("BCCAA SEQUENTIAL DECISION CASCADE REPORT", pageWidth / 2, marginY + 20, { align: "center" });

  doc.setFont("helvetica", "italic");
  doc.setFontSize(8.5);
  doc.setTextColor(90, 90, 90);
  doc.text("A comprehensive clinical audit covering legal merits, limitation constraints, issues and CPC lifecycle.", pageWidth / 2, marginY + 25, { align: "center" });

  y = marginY + 39;

  // Case Overview Details Table
  printSubsectionHeader("Analytical Dossier Metadata & Proprietary Ownership");
  printLabelValue("Engine Rights & IP Proprietor", "Md. Nazmul Islam, Advocate, Supreme Court of Bangladesh");
  printLabelValue("Chamber Affiliation", "Head of Neum Lex Counsel");
  printLabelValue("Chief Legal Auditor", "Md. Nazmul Islam, Advocate");
  printLabelValue("Primary Statute", analysis.stage2.primaryAct);
  printLabelValue("Civil Law Domain", analysis.stage1.primaryDomain);
  const maintainabilityColor = analysis.stage3.isTimeBarred ? "TIME-BARRED (CRITICAL BLOCKED)" : "MAINTAINABLE IN LIMITATION";
  printLabelValue("Limitation Status", maintainabilityColor);
  printLabelValue("Target Competent Court", analysis.stage5.pecuniary.courtLevel);
  printLabelValue("Pecuniary Suit Value", analysis.stage5.pecuniary.valuation);

  y += 3;

  // Executive summary
  printSubsectionHeader("Executive Summary & Concluding Diagnosis");
  printBodyText(analysis.stage13.overview, true);

  // STAGE 0
  printMainSectionHeader("STAGE 0: Patient Case Facts, Chronology Grid & Evidentiary Divisions");
  
  printSubsectionHeader("Origination Statement of Pleadings Facts");
  printBodyText(originalFactPattern);

  if (analysis.stage0.chronology && analysis.stage0.chronology.length > 0) {
    printSubsectionHeader("Chronological Fact Grid");
    for (const item of analysis.stage0.chronology) {
      checkPageSpace(18);
      
      // Draw background bar
      doc.setFillColor(249, 247, 242);
      doc.rect(marginX, y, contentWidth, 14, "F");
      doc.setDrawColor(229, 225, 216);
      doc.rect(marginX, y, contentWidth, 14, "S");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(197, 160, 89);
      doc.text(`DATE: ${item.date || "N/A"}`, marginX + 3, y + 4);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(30, 37, 43);
      doc.text(`ROLES: ${item.partiesInvolved || "All Parties"}`, marginX + 80, y + 4);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(60, 60, 60);
      const splitEvent = doc.splitTextToSize(`EVENT: ${item.event || "-"}`, contentWidth - 6);
      doc.text(splitEvent[0], marginX + 3, y + 8);
      
      const splitSig = doc.splitTextToSize(`STATUTORY WEIGHT: ${item.statutorySignificance || "Background fact"}`, contentWidth - 6);
      doc.text(splitSig[0], marginX + 3, y + 12);
      
      y += 16;
    }
  }

  if (analysis.stage0.admittedFacts && analysis.stage0.admittedFacts.length > 0) {
    printSubsectionHeader("Admitted Facts (No Proof Required - Section 58 of the Evidence Act)");
    for (const fact of analysis.stage0.admittedFacts) {
      printBodyText(`• ${fact}`);
    }
  }

  if (analysis.stage0.disputedFacts && analysis.stage0.disputedFacts.length > 0) {
    printSubsectionHeader("Disputed Facts (Direct Triable Issues of Fact/Law)");
    for (const fact of analysis.stage0.disputedFacts) {
      printBodyText(`• ${fact}`);
    }
  }

  if (analysis.stage0.inferredFacts && analysis.stage0.inferredFacts.length > 0) {
    printSubsectionHeader("Inferred / Presumptive Facts (Reasoning Bridges)");
    for (const fact of analysis.stage0.inferredFacts) {
      printBodyText(`• ${fact}`);
    }
  }

  if (analysis.stage0.liabilityFacts && analysis.stage0.liabilityFacts.length > 0) {
    printSubsectionHeader("Liability-related Facts (Cause of Action Triggers)");
    for (const fact of analysis.stage0.liabilityFacts) {
      printBodyText(`• ${fact}`);
    }
  }

  if (analysis.stage0.quantumFacts && analysis.stage0.quantumFacts.length > 0) {
    printSubsectionHeader("Quantum / Damage Allocation / Relief Valuation Facts");
    for (const fact of analysis.stage0.quantumFacts) {
      printBodyText(`• ${fact}`);
    }
  }

  // STAGE 1
  printMainSectionHeader("STAGE 1: Civil Jurisdictional Domain & Statutory Vector Classification");
  printLabelValue("Primary Legal Domain", analysis.stage1.primaryDomain);
  if (analysis.stage1.subsidiaryDomains && analysis.stage1.subsidiaryDomains.length > 0) {
    printLabelValue("Subsidiary Domain Fields", analysis.stage1.subsidiaryDomains.join(", "));
  }

  if (analysis.stage1.triggerFacts && analysis.stage1.triggerFacts.length > 0) {
    printSubsectionHeader("Statutory Trigger Bindings & Conceptual Mappings");
    for (const trigger of analysis.stage1.triggerFacts) {
      printLabelValue(`Fact: "${trigger.fact}"`, `Triggers: ${trigger.domain} (${trigger.statutoryTrigger})`);
    }
  }

  // STAGE 2
  printMainSectionHeader("STAGE 2: Legislative Provisions Map & Judicial Precedent Index");
  printLabelValue("Primary Governing Enactment", analysis.stage2.primaryAct);

  if (analysis.stage2.relevantSections && analysis.stage2.relevantSections.length > 0) {
    printSubsectionHeader("Express Statutory Provisions Invoked");
    for (const sec of analysis.stage2.relevantSections) {
      printLabelValue(`${sec.actName} - Section ${sec.sectionOrRule}`, sec.purpose);
    }
  }

  if (analysis.stage2.precedents && analysis.stage2.precedents.length > 0) {
    printSubsectionHeader("Governing Judicial Precedents (DLR / ALR / AD / HCD)");
    for (const prec of analysis.stage2.precedents) {
      checkPageSpace(20);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(30, 37, 43);
      doc.text(`Citation: ${prec.citation} (${prec.court || "Supreme Court"})`, marginX, y);
      y += 4;
      
      printLabelValue("Holding", prec.holding);
      printLabelValue("Application", prec.relevance);
      y += 2;
    }
  }

  if (analysis.stage2.equityPrinciples && analysis.stage2.equityPrinciples.length > 0) {
    printSubsectionHeader("Inherent Equity Principles & Maxims Applied");
    for (const principle of analysis.stage2.equityPrinciples) {
      printBodyText(`• ${principle}`);
    }
  }

  // STAGE 3
  printMainSectionHeader("STAGE 3: Mandatory Limitation Audit Check (Section 3 Limitation Act)");
  printSubsectionHeader("Limitation Act 1908 Standard Constraints");
  printLabelValue("Trigger / Cause of Action Accrual Date", analysis.stage3.accrualDate);
  printLabelValue("Limitation Schedule Article Applicable", analysis.stage3.limitationArticle);
  printLabelValue("Standard Statutory Prescribed Period", analysis.stage3.prescribedPeriod);
  printLabelValue("Barred by Limitation Status?", analysis.stage3.isTimeBarred ? "YES - TIME BARRED (Statutory Defect)" : "NO - WITHIN PRESCRIBED TIMEFRAME");
  printLabelValue("Exceptions / S.14 / S.18 / Indulgences Applied", analysis.stage3.exceptionsOrExtensions || "No explicit exceptions identified");
  
  printSubsectionHeader("Limitation Preliminary Analysis Verdict");
  printBodyText(analysis.stage3.preliminaryAnalysis);

  // STAGE 4
  printMainSectionHeader("STAGE 4: Legal Capacity, Locus Standi & Necessary Party Joinders (Order I CPC)");
  printSubsectionHeader("Plaintiffs Portfolio (Locus Standi & Action Capability)");
  for (const pl of analysis.stage4.plaintiffs) {
    printLabelValue(pl.name, `${pl.legalIdentity || "Natural Person"} Capacity: ${pl.capacity || "Full Legal Person"} Locus: ${pl.causeOfActionAccess || "Inherent rights holder"}`);
  }

  if (analysis.stage4.defendants && analysis.stage4.defendants.length > 0) {
    printSubsectionHeader("Defendants Portfolio (Necessary & Proper Joinders under Order I)");
    for (const df of analysis.stage4.defendants) {
      printLabelValue(df.name, `${df.legalIdentity || "Natural Person / Corporate Entity"} Capacity: ${df.capacity || "Full Representation"} Liability Rule: ${df.liabilityType || "Principal Respondent"}`);
    }
  }

  printSubsectionHeader("Order I CPC Joinder Risk Audit");
  printLabelValue("Defect Alerts (Non-Joinder/Mis-Joinder)", analysis.stage4.joinderIssues || "None");
  printLabelValue("Comprehensive Locus Summary", analysis.stage4.locusStandiSummary);

  // STAGE 5
  printMainSectionHeader("STAGE 5: Competent Suit Forum & Jurisdictional Analysis");
  printSubsectionHeader("Pecuniary Valuation Protocol (Suits Valuation Act & Court Fees Act)");
  printLabelValue("Civil Suit Valuation Amount", analysis.stage5.pecuniary.valuation);
  printLabelValue("Target Trial Court Level", analysis.stage5.pecuniary.courtLevel);
  printLabelValue("Appellate / Pecuniary Forum Limits", analysis.stage5.pecuniary.pecuniaryLimits || "Applies standard pecuniary hierarchy rules");
  printLabelValue("Suits Valuation Procedural Notes", analysis.stage5.pecuniary.suitsValuationActNotes);

  printSubsectionHeader("Territorial Forum Audit (Section 16 to 20 of CPC)");
  printLabelValue("Territorial Audit Rule", analysis.stage5.territorial.rule);
  printLabelValue("Governing CPC Provision Clause", analysis.stage5.territorial.governingSection);
  printLabelValue("Supporting Territorial Facts", analysis.stage5.territorial.jurisdictionalFacts);

  printSubsectionHeader("Subject-Matter Exclusions & Exclusive Statutory Forums");
  printLabelValue("Exclusive Forum Exclusion Bar?", analysis.stage5.subjectMatter.isExcluded ? "Yes (Excluded / Barred by Special Law)" : "No (Standard Civil Court retains complete jurisdiction)");
  printLabelValue("Governing Subject Exclusion Provision", analysis.stage5.subjectMatter.governingStatute);
  printLabelValue("Formulated Suit Forum Assignment", analysis.stage5.subjectMatter.forum);
  printLabelValue("Defensive Forum Challenge Strategy", analysis.stage5.objectionStrategy);

  // STAGE 6
  printMainSectionHeader("STAGE 6: Pleadings Audit, Plaint Verification & Written Statement Defences");
  printSubsectionHeader("Order VII Rule 1 CPC Plaint Draft Checklist");
  for (const c of analysis.stage6.plaintChecklist) {
    printBodyText(`[CHECKED] ${c}`);
  }

  printSubsectionHeader("Order VII Rule 11 CPC Plaint Rejection Warnings");
  if (analysis.stage6.groundsForRejection && analysis.stage6.groundsForRejection.length > 0) {
    for (const g of analysis.stage6.groundsForRejection) {
      printBodyText(`• WARNING: ${g}`);
    }
  } else {
    printBodyText("No obvious grounds for instant plaint rejection identified under O.VII R.11 CPC.");
  }

  printSubsectionHeader("Defendant Pleadings & Specific Denials (Order VIII CPC)");
  printLabelValue("Deemed Admissions (Lack of Specific Denial)", analysis.stage6.writtenStatementDeemedAdmissions);
  printLabelValue("Counterclaims / Set-Off Provisions", analysis.stage6.counterclaimsOrSetOff || "None identified in standard pleading pattern");

  // STAGE 7
  printMainSectionHeader("STAGE 7: Frame of Triable Issues & Burden Assignments (Order XIV CPC)");
  printSubsectionHeader("Judicially Framed Triable Issues List");
  for (const iss of analysis.stage7.issues) {
    checkPageSpace(18);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(30, 37, 43);
    doc.text(`Issue No. ${iss.issueNo}: (${iss.type})`, marginX, y);
    y += 4;
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(60, 60, 60);
    const splitTitle = doc.splitTextToSize(`Whether ${iss.title}`, contentWidth);
    for (const line of splitTitle) {
      checkPageSpace(5);
      doc.text(line, marginX, y);
      y += 4;
    }
    
    printLabelValue("Burden of Proof (Section 101 to 104 of Evidence Act)", iss.burden);
    printLabelValue("Essential Material Evidence Mandatory", iss.evidenceRequired);
    y += 2.5;
  }

  // STAGE 8
  printMainSectionHeader("STAGE 8: Evidence Admissibility, Statutory Presumptions & Burden Shifters");
  if (analysis.stage8.evidenceList && analysis.stage8.evidenceList.length > 0) {
    printSubsectionHeader("Exhibits & Document Vectors");
    for (const ev of analysis.stage8.evidenceList) {
      checkPageSpace(15);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(30, 37, 43);
      doc.text(`Document: ${ev.item} (${ev.type})`, marginX, y);
      y += 4;
      printLabelValue("Exhibited By Source", ev.source);
      printLabelValue("Governing Section of Evidence Act", ev.governingSection);
      printLabelValue("Admissibility Challenge Strategy", ev.admissibilityChallenge);
      y += 1.5;
    }
  }

  if (analysis.stage8.burdenAssignments && analysis.stage8.burdenAssignments.length > 0) {
    printSubsectionHeader("Burden of Proof Assignments (Evidence Act Chapter VII)");
    for (const assignment of analysis.stage8.burdenAssignments) {
      printBodyText(`• ${assignment}`);
    }
  }

  if (analysis.stage8.statutoryPresumptions && analysis.stage8.statutoryPresumptions.length > 0) {
    printSubsectionHeader("Statutory Presumptions & Shifted Evidentiary Burdens");
    for (const pres of analysis.stage8.statutoryPresumptions) {
      printLabelValue(`Section ${pres.statuteSection || "Ref"}`, `${pres.presumptionStyle || "Presumption style"} -> Effect: ${pres.effectOnCase}`);
    }
  }

  // STAGE 9
  printMainSectionHeader("STAGE 9: Issue-wise Adversary Debate & Substantive Trial Merits");
  printSubsectionHeader("Trial Debate Positions & Projected Finding");
  for (const det of analysis.stage9.issueDetails) {
    checkPageSpace(25);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(30, 37, 43);
    doc.text(`Audit on Issue No. ${det.issueNo}: ${det.issueTitle}`, marginX, y);
    y += 4;

    printLabelValue("Plaintiff Pleadings Position", det.plaintiffPosition);
    printLabelValue("Defendant Controverting Position", det.defendantPosition);
    printLabelValue("Probable Court Bench Analysis", det.courtAnalysis);
    printLabelValue("Projected Judicial Final Finding", det.projectedFinding);
    y += 2.5;
  }

  // STAGE 10
  printMainSectionHeader("STAGE 10: Specific Relief Act (SRA) Equity Barriers & Court Discretionary Limits");
  printSubsectionHeader("Equitable SRA Limits & Discretionary Barriers Protection");
  for (const ep of analysis.stage10.applicablePrinciples) {
    checkPageSpace(15);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(30, 37, 43);
    doc.text(`Principle: ${ep.principle}`, marginX, y);
    y += 4;
    printLabelValue("Fact Check Application", ep.application);
    printLabelValue("Weight & Relief Impact", ep.weight);
    y += 1.5;
  }

  printSubsectionHeader("Specific Relief Act s.22 / s.56 Discretionary Safeguard");
  printBodyText(analysis.stage10.discretionaryReliefCheck);

  // STAGE 11
  printMainSectionHeader("STAGE 11: CPC Civil Suit Procedural Lifecycle & Strategic Pathways");
  printSubsectionHeader("CPC Sequential Path From Plaint To Execution");
  for (const step of analysis.stage11.timelineProgress) {
    checkPageSpace(15);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(197, 160, 89);
    doc.text(step.stageName, marginX, y);
    y += 4;
    printLabelValue("Statutory Citation Reference", step.cpcReference);
    printLabelValue("Essential Actions Inside Pathway", step.subActions);
    printLabelValue("Procedural Action Plan Guidance", step.strategicPlay);
    y += 2;
  }

  // STAGE 12
  printMainSectionHeader("STAGE 12: Appellate, Revisional & Review Options Pathways");
  printSubsectionHeader("Appellate Hierarchies & Option Options");
  for (const app of analysis.stage12.appealNodes) {
    checkPageSpace(15);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(30, 37, 43);
    doc.text(`Authority Level: ${app.authority} (${app.level})`, marginX, y);
    y += 4;
    printLabelValue("Governing Legal Provision Code", app.governingSection);
    printLabelValue("Appellate Scope Limit", app.scope);
    y += 1.5;
  }

  // STAGE 13
  printMainSectionHeader("STAGE 13: Sequential Synthesis & Final Decree Form");
  printLabelValue("Direct Decreed Relief & Declaration Formulation", analysis.stage13.reliefDecree);
  printLabelValue("Suits Costs Apportionment Rule (Section 35 CPC)", analysis.stage13.costsApportionment);
  printLabelValue("Discretionary SRA Equitable Bars Applied", analysis.stage13.equitableBars);
  printLabelValue("Post-Decree Execution Plan Strategy (Order XXI CPC)", analysis.stage13.executionPathway);
  
  // Footer signature signoff space close to the end
  checkPageSpace(35);
  y += 5;
  doc.setDrawColor(200, 200, 200);
  doc.line(marginX, y, marginX + 60, y);
  doc.line(pageWidth - marginX - 60, y, pageWidth - marginX, y);
  y += 4.5;
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text("Md. Nazmul Islam, Advocate", marginX, y);
  doc.text("Principal Legal Auditor", pageWidth - marginX, y, { align: "right" });
  
  y += 3.5;
  doc.setFont("helvetica", "normal");
  doc.text("Supreme Court of Bangladesh", marginX, y);
  doc.text("Head of Neum Lex Counsel", pageWidth - marginX, y, { align: "right" });

  const timestamp = Date.now();
  doc.save(`BCCAA_Report_${timestamp}.pdf`);
}
