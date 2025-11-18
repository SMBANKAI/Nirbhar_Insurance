
export enum OnboardingStep {
  SplashScreen,
  LanguageSelection,
  NotificationPermission,
  Welcome,
  VideoIntro,
  Login,
  Otp,
  CreateAccount,
  Congratulations,
  SavingsSetup,
  Completed,
}

export enum AppScreen {
  Home,
  Explore,
  Save,
  Transactions,
}

export enum SaveScreenView {
    Home,
    Chart,
    Plan,
}

export enum TransactionScreenView {
    Portfolio,
    Transactions,
    Claims,
    Renew,
}

export interface Language {
  code: string;
  name: string;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  audioUrl?: string;
  sources?: { web?: { uri: string; title: string }; maps?: { uri: string; title: string } }[];
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
  }
}

export interface InsuranceProductSummary {
  id: number;
  productNameKey: string;
  icon: string;
  color: {
    bg: string;
    text: string;
  };
}

export interface RoiGraphData {
    label: string;
    stacks: { [key: string]: number };
    roi: number;
}

export interface InsuranceProduct {
  id: number;
  productNameKey: string;
  header: {
    icons: string[];
    titleKey: string;
    subtextKey: string;
  };
  video: {
    titleKey: string;
    script: string[];
    url?: string;
  };
  coverage: {
    summary: { key: string; value: string }[];
    notCovered: string[];
  };
  benefits: string[];
  roiGraph: {
    titleKey: string;
    xAxisKey: string;
    yAxisKey: string;
    legend: { [key: string]: string };
    data: RoiGraphData[];
    type: 'bar' | 'area';
  };
  eligibility: string[];
  cta: {
    textKey: string;
  };
  tags?: string[];
}

export interface ActivePolicy {
    id: string;
    policyId: number;
    purchaseDate: string;
    premiumAmount: number;
    nextDueDate: string;
    status: 'active' | 'inactive';
}

// --- Savings Feature Types ---

export interface SavingsAccount {
    id: string;
    type: 'emergency' | 'daily' | 'goal';
    titleKey: string;
    balance: number;
    goal: number;
    planActive: boolean;
}

export interface SavingsTransaction {
    id: number;
    accountId: string;
    description: string;
    amount: number;
    date: string;
    type: 'deposit' | 'withdrawal' | 'round-up';
}

export interface DistributionDataPoint {
    id: string;
    name: string;
    value: number;
    color: string;
    tooltipKey: string;
}

// --- Claims Feature Types ---

export interface ClaimDocument {
    key: string;
    nameKey: string;
}

export interface ClaimScenario {
    key: string;
    nameKey: string;
    documents: ClaimDocument[];
}

export interface PolicyClaimInfo {
    policyId: number;
    scenarios?: ClaimScenario[];
    documents?: ClaimDocument[];
}