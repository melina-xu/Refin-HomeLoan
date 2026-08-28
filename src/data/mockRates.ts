import { LoanParameters, QuotationPackage, PackageCostAnalysis, LoanCalculationSummary } from '../types';
import { DEFAULT_MAS_3M_SORA } from '../services/masApi';

export { DEFAULT_MAS_3M_SORA };
export const CURRENT_3M_SORA = DEFAULT_MAS_3M_SORA; // Real-time 3M Compounded SORA benchmark %

export const DEFAULT_LOAN_PARAMS: LoanParameters = {
  propertyType: 'private',
  propertyValue: 1500000,
  outstandingPrinciple: 850000,
  remainingTenureYears: 22,
  currentInterestRate: 4.10,
  currentBank: 'DBS Bank',
  lockInMonthsRemaining: 1,
};

export const DEFAULT_QUOTATION_PACKAGES: QuotationPackage[] = [
  {
    id: 'quote-dbs-2y-fixed',
    bankName: 'DBS Bank',
    bankCode: 'DBS',
    packageName: '2-Year Fixed Alpha Concession',
    rateType: 'fixed',
    fixedTenureYears: 2,
    fixedRate: 2.80,
    nominalRate: 2.80,
    rateDisplay: '2.80% p.a. (2Y Fixed)',
    notes: '2-Year Lock-in with guaranteed fixed installment.'
  },
  {
    id: 'quote-ocbc-sora',
    bankName: 'OCBC Bank',
    bankCode: 'OCBC',
    packageName: 'Dynamic 3M-SORA Vector',
    rateType: 'floating_sora',
    soraSpread: 0.50,
    nominalRate: 2.95, // 2.45 + 0.50
    rateDisplay: '3M SORA + 0.50% (2.95%)',
    notes: 'Daily interest calculation with flexibility to switch to fixed.'
  },
  {
    id: 'quote-uob-3y-fixed',
    bankName: 'UOB Bank',
    bankCode: 'UOB',
    packageName: '3-Year Fixed Stability Concession',
    rateType: 'fixed',
    fixedTenureYears: 3,
    fixedRate: 2.88,
    nominalRate: 2.88,
    rateDisplay: '2.88% p.a. (3Y Fixed)',
    notes: '3-Year Fixed rate immunity with integrated high-yield savings bonus.'
  },
  {
    id: 'quote-hsbc-green',
    bankName: 'HSBC Bank',
    bankCode: 'HSBC',
    packageName: '2-Year Fixed Prime Mortgage',
    rateType: 'fixed',
    fixedTenureYears: 2,
    fixedRate: 2.75,
    nominalRate: 2.75,
    rateDisplay: '2.75% p.a. (2Y Fixed)',
    notes: 'Competitive fixed rate package for residential properties.'
  },
  {
    id: 'quote-scb-sora-offset',
    bankName: 'Standard Chartered',
    bankCode: 'SCB',
    packageName: 'MortgageOne 3M-SORA Float',
    rateType: 'floating_sora',
    soraSpread: 0.58,
    nominalRate: 3.03, // 2.45 + 0.58
    rateDisplay: '3M SORA + 0.58% (3.03%)',
    notes: 'Floating SORA package with interest offset potential.'
  }
];

export const POPULAR_BANKS = [
  'DBS Bank',
  'OCBC Bank',
  'UOB Bank',
  'HSBC Bank',
  'Standard Chartered',
  'Maybank',
  'Citibank',
  'CIMB Bank',
  'RHB Bank',
  'HDB Concession (2.60%)'
];

/**
 * Standard Mortgage Monthly Payment Formula:
 * PMT = P * (r * (1 + r)^n) / ((1 + r)^n - 1)
 */
export function calculateMonthlyPayment(principal: number, annualRatePercent: number, tenureYears: number): number {
  if (principal <= 0 || tenureYears <= 0) return 0;
  if (annualRatePercent <= 0) return Math.round(principal / (tenureYears * 12));

  const monthlyRate = annualRatePercent / 100 / 12;
  const numberOfPayments = tenureYears * 12;
  const pmt = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
  return Math.round(pmt);
}

/**
 * Calculates detailed annualized cost analysis for a quotation compared to the current loan baseline.
 */
export function analyzeQuotationCost(
  loanParams: LoanParameters,
  quotation: QuotationPackage,
  activeSoraBenchmark: number = DEFAULT_MAS_3M_SORA
): Omit<PackageCostAnalysis, 'isLowestCost' | 'costRank'> {
  const currentMonthly = calculateMonthlyPayment(
    loanParams.outstandingPrinciple,
    loanParams.currentInterestRate,
    loanParams.remainingTenureYears
  );
  
  const effectiveRate = quotation.rateType === 'floating_sora'
    ? Number((activeSoraBenchmark + (quotation.soraSpread ?? 0)).toFixed(2))
    : Number((quotation.fixedRate ?? quotation.nominalRate).toFixed(2));

  const newMonthly = calculateMonthlyPayment(
    loanParams.outstandingPrinciple,
    effectiveRate,
    loanParams.remainingTenureYears
  );

  const annualTotalCost = newMonthly * 12;
  const currentAnnualCost = currentMonthly * 12;
  
  // Year 1 interest estimation: Principal * rate
  const annualInterestCost = Math.round(loanParams.outstandingPrinciple * (effectiveRate / 100));
  const annualPrincipalPaid = Math.max(0, annualTotalCost - annualInterestCost);

  const monthlySavingsVsCurrent = currentMonthly - newMonthly;
  const annualSavingsVsCurrent = currentAnnualCost - annualTotalCost;
  const interestRateDelta = Number((effectiveRate - loanParams.currentInterestRate).toFixed(2));

  const threeYearTotalCost = newMonthly * 36;
  const currentThreeYearCost = currentMonthly * 36;
  const threeYearNetSavings = currentThreeYearCost - threeYearTotalCost;

  return {
    quotation: {
      ...quotation,
      nominalRate: effectiveRate,
      rateDisplay: quotation.rateType === 'fixed'
        ? `${effectiveRate.toFixed(2)}% (${quotation.fixedTenureYears || 2}Y Fixed)`
        : `3M SORA + ${(quotation.soraSpread ?? 0).toFixed(2)}% (${effectiveRate.toFixed(2)}%)`
    },
    monthlyPayment: newMonthly,
    annualTotalCost,
    annualInterestCost,
    annualPrincipalPaid,
    annualSavingsVsCurrent,
    monthlySavingsVsCurrent,
    interestRateDelta,
    threeYearTotalCost,
    threeYearNetSavings
  };
}

/**
 * Computes all package comparisons and ranks them by lowest annualized cost.
 */
export function computeComprehensiveSummary(
  loanParams: LoanParameters,
  quotations: QuotationPackage[],
  activeSoraBenchmark: number = DEFAULT_MAS_3M_SORA,
  soraMeta?: { asOfDate?: string; source?: string }
): LoanCalculationSummary {
  const currentMonthlyPayment = calculateMonthlyPayment(
    loanParams.outstandingPrinciple,
    loanParams.currentInterestRate,
    loanParams.remainingTenureYears
  );

  const currentAnnualCost = currentMonthlyPayment * 12;
  const currentAnnualInterest = Math.round(loanParams.outstandingPrinciple * (loanParams.currentInterestRate / 100));

  if (!quotations || quotations.length === 0) {
    return {
      currentMonthlyPayment,
      currentAnnualCost,
      currentAnnualInterest,
      activeSoraBenchmark,
      soraAsOfDate: soraMeta?.asOfDate,
      soraSource: soraMeta?.source,
      lowestCostPackage: null,
      analyses: []
    };
  }

  // Analyze each package
  const basicAnalyses = quotations.map(q => analyzeQuotationCost(loanParams, q, activeSoraBenchmark));

  // Sort by lowest annual total cost (which correlates to highest annual savings)
  const sortedAnalyses = [...basicAnalyses].sort((a, b) => a.annualTotalCost - b.annualTotalCost);

  // Assign ranking & identify lowest cost
  const fullAnalyses: PackageCostAnalysis[] = sortedAnalyses.map((analysis, index) => ({
    ...analysis,
    costRank: index + 1,
    isLowestCost: index === 0
  }));

  return {
    currentMonthlyPayment,
    currentAnnualCost,
    currentAnnualInterest,
    activeSoraBenchmark,
    soraAsOfDate: soraMeta?.asOfDate,
    soraSource: soraMeta?.source,
    lowestCostPackage: fullAnalyses[0] || null,
    analyses: fullAnalyses
  };
}
