export interface ChronologyItem {
  date: string;
  event: string;
  partiesInvolved: string;
  statutorySignificance: string;
}

export interface FactMatrix {
  chronology: ChronologyItem[];
  admittedFacts: string[];
  disputedFacts: string[];
  inferredFacts: string[];
  liabilityFacts: string[];
  quantumFacts: string[];
}

export interface TriggerFact {
  domain: string;
  fact: string;
  statutoryTrigger: string;
}

export interface CivilLawArea {
  primaryDomain: string;
  subsidiaryDomains: string[];
  triggerFacts: TriggerFact[];
}

export interface RelevantSection {
  actName: string;
  sectionOrRule: string;
  purpose: string;
}

export interface Precedent {
  citation: string;
  court: string;
  holding: string;
  relevance: string;
}

export interface LegislationMap {
  primaryAct: string;
  relevantSections: RelevantSection[];
  precedents: Precedent[];
  equityPrinciples: string[];
}

export interface LimitationCheck {
  accrualDate: string;
  prescribedPeriod: string;
  limitationArticle: string;
  isTimeBarred: boolean;
  exceptionsOrExtensions: string;
  preliminaryAnalysis: string;
}

export interface LegalParty {
  name: string;
  legalIdentity: string;
  capacity: string;
  causeOfActionAccess?: string; // for plaintiff
  liabilityType?: string; // for defendant
}

export interface PartyAnalysis {
  plaintiffs: LegalParty[];
  defendants: LegalParty[];
  joinderIssues: string;
  locusStandiSummary: string;
}

export interface JurisdictionDetail {
  rule: string;
  governingSection: string;
  jurisdictionalFacts: string;
}

export interface PecuniaryDetail {
  valuation: string;
  courtLevel: string;
  pecuniaryLimits: string;
  suitsValuationActNotes: string;
}

export interface SubjectMatterDetail {
  isExcluded: boolean;
  forum: string;
  governingStatute: string;
}

export interface JurisdictionCheck {
  territorial: JurisdictionDetail;
  pecuniary: PecuniaryDetail;
  subjectMatter: SubjectMatterDetail;
  objectionStrategy: string;
}

export interface PleadingsCheck {
  plaintChecklist: string[];
  groundsForRejection: string[];
  writtenStatementDeemedAdmissions: string;
  counterclaimsOrSetOff: string;
}

export interface FramedIssue {
  issueNo: number;
  title: string;
  type: string;
  burden: string;
  evidenceRequired: string;
}

export interface IssueFraming {
  issues: FramedIssue[];
}

export interface EvidenceItem {
  item: string;
  source: string;
  type: string;
  governingSection: string;
  admissibilityChallenge: string;
}

export interface StatutoryPresumption {
  statuteSection: string;
  presumptionStyle: string;
  effectOnCase: string;
}

export interface EvidenceAnalysis {
  evidenceList: EvidenceItem[];
  burdenAssignments: string[];
  statutoryPresumptions: StatutoryPresumption[];
}

export interface IssueDetail {
  issueNo: number;
  issueTitle: string;
  plaintiffPosition: string;
  defendantPosition: string;
  courtAnalysis: string;
  projectedFinding: string;
}

export interface IssueWiseAnalysis {
  issueDetails: IssueDetail[];
}

export interface EquitablePrinciple {
  principle: string;
  application: string;
  weight: string;
}

export interface EquityPrinciplesAnalysis {
  applicablePrinciples: EquitablePrinciple[];
  discretionaryReliefCheck: string;
}

export interface CourtStageTransition {
  stageName: string;
  cpcReference: string;
  subActions: string;
  strategicPlay: string;
}

export interface CivilCourtTimeline {
  timelineProgress: CourtStageTransition[];
}

export interface AppealNode {
  level: string;
  authority: string;
  scope: string;
  governingSection: string;
}

export interface AppealPathway {
  appealNodes: AppealNode[];
}

export interface FinalSynthesis {
  overview: string;
  reliefDecree: string;
  costsApportionment: string;
  equitableBars: string;
  executionPathway: string;
}

export interface CaseAnalysisResponse {
  stage0: FactMatrix;
  stage1: CivilLawArea;
  stage2: LegislationMap;
  stage3: LimitationCheck;
  stage4: PartyAnalysis;
  stage5: JurisdictionCheck;
  stage6: PleadingsCheck;
  stage7: IssueFraming;
  stage8: EvidenceAnalysis;
  stage9: IssueWiseAnalysis;
  stage10: EquityPrinciplesAnalysis;
  stage11: CivilCourtTimeline;
  stage12: AppealPathway;
  stage13: FinalSynthesis;
}

export interface CaseHistoryItem {
  id: string;
  timestamp: number;
  title: string;
  primaryDomain: string;
  courtLevel: string;
  isTimeBarred: boolean;
  factPattern: string;
  focusDomain: string;
  analysis: CaseAnalysisResponse;
}

