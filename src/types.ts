export type PropertyType = 'private' | 'hdb' | 'commercial' | 'landed';

export type ActiveTab = 'refinance' | 'resources';

export interface LoanParameters {
  propertyType: PropertyType;
  propertyValue: number;
  outstandingPrinciple: number;
  remainingTenureYears: number;
  currentInterestRate: number; // e.g. 4.10 for 4.10%
  currentBank: string;
  lockInMonthsRemaining: number;
  currentMonthlyPayment?: number;
}

export type RateType = 'fixed' | 'floating_sora';
export type FixedTenure = 1 | 2 | 3;

export interface QuotationPackage {
  id: string;
  bankName: string;
  bankCode: string;
  packageName: string;
  rateType: RateType;
  // If fixed
  fixedTenureYears?: FixedTenure;
  fixedRate?: number; // e.g. 2.80%
  // If floating
  soraSpread?: number; // e.g. 0.50% (Bank spread added to live MAS 3M SORA)
  nominalRate: number; // calculated effective rate
  rateDisplay: string;
  notes?: string;
  isCustom?: boolean;
}

export interface PackageCostAnalysis {
  quotation: QuotationPackage;
  monthlyPayment: number;
  annualTotalCost: number; // Monthly payment * 12
  annualInterestCost: number; // Year 1 interest
  annualPrincipalPaid: number;
  annualSavingsVsCurrent: number; // Current annual cost - New annual cost
  monthlySavingsVsCurrent: number;
  interestRateDelta: number;
  threeYearTotalCost: number;
  threeYearNetSavings: number;
  isLowestCost: boolean;
  costRank: number; // 1 = lowest cost, 2 = second lowest, etc.
}

export interface LoanCalculationSummary {
  currentMonthlyPayment: number;
  currentAnnualCost: number;
  currentAnnualInterest: number;
  activeSoraBenchmark: number;
  isSoraFallback?: boolean;
  soraRateSourceType?: 'live' | 'fallback';
  soraAsOfDate?: string;
  soraSource?: string;
  lowestCostPackage: PackageCostAnalysis | null;
  analyses: PackageCostAnalysis[];
}

