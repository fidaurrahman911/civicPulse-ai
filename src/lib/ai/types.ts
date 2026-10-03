import {
  ImpactVerification,
  ComplaintAnalysis,
  ResolutionVerification,
  ActivityCategory,
  EvidenceItem,
  ComplaintSeverity
} from '../../types';

export interface ImpactSubmission {
  title: string;
  category: ActivityCategory;
  description: string;
  locationName: string;
  date: string;
  evidence: EvidenceItem[];
  forceDuplicateWarning?: boolean;
}

export interface ComplaintSubmission {
  title: string;
  category?: string;
  description: string;
  locationName: string;
  coordinates?: { lat: number; lng: number };
  evidence: EvidenceItem[];
  departmentPreference?: string;
}

export interface ResolutionInput {
  complaintId: string;
  beforeEvidenceUrl?: string;
  afterEvidenceUrl?: string;
  afterEvidence?: EvidenceItem[];
  officerNotes?: string;
  forceLowConfidence?: boolean;
}

export interface DistrictContext {
  totalComplaints: number;
  resolvedComplaints: number;
  pendingComplaints: number;
  highPriorityCount: number;
  topCategories: { category: string; count: number }[];
  departmentBreakdown: { department: string; pending: number; resolved: number }[];
  locationsWithIssues: string[];
}

export interface AssistantAnswer {
  headline: string;
  explanation: string;
  tableData?: { label: string; value: string | number }[];
  chartData?: { name: string; count: number }[];
  basis: string;
  followUpQuestions: string[];
  isDemo: true;
}

export interface CivicAIProvider {
  verifyImpact(
    input: ImpactSubmission,
    onProgress?: (stepIndex: number, stepLabel: string) => void
  ): Promise<ImpactVerification>;

  analyzeComplaint(
    input: ComplaintSubmission,
    onProgress?: (stepIndex: number, stepLabel: string) => void
  ): Promise<ComplaintAnalysis>;

  verifyResolution(
    input: ResolutionInput,
    onProgress?: (stepIndex: number, stepLabel: string) => void
  ): Promise<ResolutionVerification>;

  answerDistrictQuestion(
    query: string,
    context: DistrictContext
  ): Promise<AssistantAnswer>;
}
