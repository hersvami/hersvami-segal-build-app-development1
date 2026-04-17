/* ─── Segal Build — Domain Types ─── */

export type Company = {
  id: string;
  name: string;
  abn: string;
  licence: string;
  phone: string;
  email: string;
  logoUrl: string;
  defaultOverheadPercent: number;
  defaultProfitPercent: number;
};

export type ProjectCustomer = {
  name: string;
  email: string;
  phone: string;
};

export type Project = {
  id: string;
  name: string;
  address: string;
  customer: ProjectCustomer;
  companyId: string;
  createdAt: string;
  geminiApiKey?: string;
  heroPhoto?: string;
};

export type PCItem = {
  id: string;
  description: string;
  allowance: number;
  unit: string;
  actualCost?: number;
  suppliedBy?: string;
};

export type InclusionItem = {
  id: string;
  text: string;
  isDefault: boolean;
};

export type ExclusionItem = {
  id: string;
  text: string;
  isDefault: boolean;
};

export type JobStage = {
  name: string;
  trade: string;
  cost: number;
  duration: number;
  description: string;
  status: 'not-started' | 'in-progress' | 'complete';
};

export type Solution = {
  name: string;
  totalCost: number;
  duration: number;
  stages: JobStage[];
  description: string;
};

export type QuoteScope = {
  id: string;
  categoryId: string;
  categoryLabel: string;
  description: string;
  stages: JobStage[];
  dimensions: { width: number; length: number; height: number };
  answers: Record<string, string>;
  pcItems: PCItem[];
  inclusions: InclusionItem[];
  exclusions: ExclusionItem[];
};

export type QuotePricing = {
  overheadPercent: number;
  profitPercent: number;
  contingencyPercent: number;
  gstPercent: number;
  tradeCost: number;
  overhead: number;
  profit: number;
  contingency: number;
  gst: number;
  clientTotal: number;
  totalIncGst: number;
};

export type Signature = {
  name: string;
  date: string;
  dataUrl: string;
};

export type ChangeLogEntry = {
  id: string;
  action: string;
  timestamp: string;
  user: string;
  details: string;
};

export type ProgressPhoto = {
  id: string;
  url: string;
  caption: string;
  stage: string;
  date: string;
};

export type ProgressStage = {
  name: string;
  status: 'not-started' | 'in-progress' | 'complete';
};

export type ExternalQuoteReference = {
  referenceNumber: string;
  originalQuoteDate: string;
  originalApprovedAmount: number;
  summaryScope: string;
  notes?: string;
};

export type Variation = {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'sent' | 'approved' | 'rejected';
  documentType: 'quote' | 'variation';
  scopes: QuoteScope[];
  pricing: QuotePricing;
  signature?: Signature;
  changeLog: ChangeLogEntry[];
  referenceQuoteId?: string;
  reasonForChange?: string;
  variationNumber?: string;
  costImpact?: 'additional' | 'credit' | 'no-change';
  source?: 'internal' | 'external';
  externalQuoteRef?: ExternalQuoteReference;
  createdAt: string;
  updatedAt: string;
  internalNotes: string[];
  progressPhotos?: ProgressPhoto[];
  progressStages?: ProgressStage[];
};
