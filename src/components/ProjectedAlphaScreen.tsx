import React, { useState, useMemo, useEffect } from 'react';
import { LoanParameters, QuotationPackage, LoanCalculationSummary, PackageCostAnalysis } from '../types';
import { 
  DEFAULT_QUOTATION_PACKAGES, 
  computeComprehensiveSummary, 
  POPULAR_BANKS, 
  DEFAULT_MAS_3M_SORA
} from '../data/mockRates';
import { QuotationCardEditor } from './QuotationCardEditor';
import { fetchMasDomesticInterestRates, MasDomesticInterestRateResponse } from '../services/masApi';
import { 
  TrendingDown, 
  SlidersHorizontal, 
  ArrowRight, 
  Check, 
  ShieldCheck, 
  Sparkles, 
  Zap, 
  Plus, 
  RotateCcw, 
  Building2, 
  Calendar, 
  DollarSign, 
  FileSpreadsheet, 
  Info,
  CheckCircle2,
  Award,
  Lock,
  Compass,
  Cpu,
  RefreshCw,
  Database,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

interface ProjectedAlphaScreenProps {
  loanParams: LoanParameters;
  setLoanParams: React.Dispatch<React.SetStateAction<LoanParameters>>;
  quotations: QuotationPackage[];
  setQuotations: React.Dispatch<React.SetStateAction<QuotationPackage[]>>;
  onOpenRecalibrate: () => void;
  onApplyPackage: (pkg: QuotationPackage) => void;
  onViewMethodology: () => void;
  onNavigateToSchedule: () => void;
}

export const ProjectedAlphaScreen: React.FC<ProjectedAlphaScreenProps> = ({
  loanParams,
  setLoanParams,
  quotations,
  setQuotations,
  onOpenRecalibrate,
  onApplyPackage,
  onViewMethodology,
  onNavigateToSchedule
}) => {
  // MAS API state
  const [masRateData, setMasRateData] = useState<MasDomesticInterestRateResponse>({
    soraComp3M: DEFAULT_MAS_3M_SORA,
    soraComp1M: 2.42,
    soraComp6M: 2.48,
    soraDaily: 2.40,
    asOfDate: new Date().toISOString().split('T')[0],
    source: 'MAS Domestic Interest Rates - Daily Gateway',
    isLive: false,
    apiKeyConfigured: Boolean(import.meta.env.MAS_SORA_API || import.meta.env.VITE_MAS_API_KEY),
    statusMessage: 'Ready to query MAS Domestic Interest Rates dataset under MAS_SORA_API.'
  });
  const [isRefreshingMas, setIsRefreshingMas] = useState<boolean>(false);

  // Simulation / Calculation state
  const [hasSimulated, setHasSimulated] = useState<boolean>(true);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simStepText, setSimStepText] = useState<string>('');

  const syncMasRates = async () => {
    setIsRefreshingMas(true);
    try {
      const res = await fetchMasDomesticInterestRates();
      setMasRateData(res);
    } catch (err) {
      console.warn('Manual MAS sync notice:', err);
    } finally {
      setIsRefreshingMas(false);
    }
  };

  // Initial silent probe of MAS API
  useEffect(() => {
    syncMasRates();
  }, []);

  // Compute all total and annualized costs dynamically using current active MAS 3M SORA
  const summary: LoanCalculationSummary = useMemo(() => {
    return computeComprehensiveSummary(
      loanParams, 
      quotations, 
      masRateData.soraComp3M,
      { asOfDate: masRateData.asOfDate, source: masRateData.source }
    );
  }, [loanParams, quotations, masRateData]);

  const lowestCost = summary.lowestCostPackage;

  // Add a new blank quotation (max 5)
  const handleAddQuotation = () => {
    if (quotations.length >= 5) return;
    const newId = `quote-custom-${Date.now()}`;
    const newQuote: QuotationPackage = {
      id: newId,
      bankName: POPULAR_BANKS[(quotations.length + 1) % POPULAR_BANKS.length],
      bankCode: 'CUSTOM',
      packageName: `Custom Quotation #${quotations.length + 1}`,
      rateType: 'fixed',
      fixedTenureYears: 2,
      fixedRate: 2.85,
      nominalRate: 2.85,
      rateDisplay: '2.85% p.a. (2Y Fixed)',
      isCustom: true
    };
    setQuotations([...quotations, newQuote]);
  };

  // Remove a quotation
  const handleRemoveQuotation = (id: string) => {
    if (quotations.length <= 1) return;
    setQuotations(quotations.filter(q => q.id !== id));
  };

  // Update a quotation
  const handleUpdateQuotation = (index: number, updated: QuotationPackage) => {
    const updatedList = [...quotations];
    updatedList[index] = updated;
    setQuotations(updatedList);
  };

  // Reset to default 5 pre-filled best market quotes
  const handleResetPresets = () => {
    setQuotations(DEFAULT_QUOTATION_PACKAGES);
  };

  // Trigger Simulation & MAS API Query
  const handleRunSimulation = async () => {
    setIsSimulating(true);
    setSimStepText('1/3 Handshaking Monetary Authority of Singapore (MAS) Gateway...');

    await new Promise(r => setTimeout(r, 450));
    setSimStepText('2/3 Fetching dataset "Domestic Interest Rates - Daily" (3M Compounded SORA)...');

    const result = await fetchMasDomesticInterestRates();
    setMasRateData(result);

    await new Promise(r => setTimeout(r, 450));
    setSimStepText('3/3 Processing amortization matrix & identifying optimal debt architecture...');

    await new Promise(r => setTimeout(r, 350));
    setIsSimulating(false);
    setHasSimulated(true);
    setSimStepText('');

    // Smooth scroll to lowest cost highlight
    setTimeout(() => {
      const el = document.getElementById('step-lowest-cost-showcase');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] py-10 lg:py-16 text-[#e2e2e2]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-16 space-y-12">
        
        {/* Top Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#444933]/60 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#c3f400] animate-pulse"></span>
              <span className="font-['JetBrains_Mono'] text-xs uppercase tracking-[0.25em] text-[#c3f400] font-semibold">
                REFINANCING & REPRICING ARBITRAGE ENGINE
              </span>
            </div>
            <h1 className="font-['Syne'] text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-white">
              Optimal Architectures<span className="text-[#c3f400]">.</span>
            </h1>
            <p className="font-['Geist'] text-sm sm:text-base text-[#c4c9ac] max-w-2xl">
              Annualized total cost benchmarking across current baseline and up to 5 institutional quotations.
            </p>
          </div>

          {/* MAS Domestic Interest Rates API Status Pill */}
          <div className="bg-[#1e2020] border border-[#333535] p-3.5 font-['JetBrains_Mono'] text-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Database className="w-4 h-4 text-[#c3f400] shrink-0" />
              <div>
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                  <span className="text-white font-bold">Daily SORA: {masRateData.soraDaily.toFixed(2)}%</span>
                  <span className="text-[#8e9379]">|</span>
                  <span className="text-white">1M: {masRateData.soraComp1M.toFixed(2)}%</span>
                  <span className="text-[#8e9379]">|</span>
                  <span className="text-[#c3f400] font-bold">3M: {masRateData.soraComp3M.toFixed(2)}%</span>
                  <span className="text-[#8e9379]">|</span>
                  <span className="text-white">6M: {masRateData.soraComp6M.toFixed(2)}%</span>
                  <span className={`w-2 h-2 rounded-full shrink-0 ${masRateData.isLive ? 'bg-[#c3f400] animate-pulse' : 'bg-[#8e9379]'}`} title={masRateData.isLive ? 'Live MAS Gateway Stream' : 'MAS Official Benchmark'}></span>
                </div>
                <span className="text-[#8e9379] block text-[10px] truncate max-w-md">
                  {masRateData.source} ({masRateData.asOfDate})
                </span>
              </div>
            </div>
            <button
              onClick={syncMasRates}
              disabled={isRefreshingMas}
              title="Re-query Monetary Authority of Singapore (MAS) Gateway"
              className="px-2.5 py-1.5 bg-[#121414] hover:bg-[#333535] border border-[#444933] text-[#c3f400] text-[11px] flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingMas ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sync MAS</span>
            </button>
          </div>
        </div>

        {/* STEP 1: CURRENT LOAN DETAILS (REPRICING / BASELINE INPUT) */}
        {/* Requirement Step01: Remove text of current institute */}
        <div className="bg-[#1e2020] border-2 border-[#333535] p-6 lg:p-8 space-y-6 shadow-xl relative" id="step-current-loan">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#333535] pb-4">
            <div className="flex items-center gap-2.5">
              <span className="font-['JetBrains_Mono'] text-xs font-bold px-2 py-0.5 bg-[#c3f400] text-[#161e00] uppercase">
                STEP 01
              </span>
              <h2 className="font-['Syne'] text-xl font-bold uppercase text-white">
                Current Loan Baseline
              </h2>
            </div>
            <span className="font-['JetBrains_Mono'] text-xs text-[#8e9379]">
              Baseline for all savings calculations
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-['JetBrains_Mono'] text-xs">
            
            {/* Outstanding Principal */}
            <div className="space-y-1.5 bg-[#121414] border border-[#333535] p-3.5">
              <label className="text-[#8e9379] uppercase block text-[10px]">
                Outstanding Principal
              </label>
              <div className="relative">
                <span className="absolute left-0 top-1 text-[#c3f400] font-bold text-sm">$</span>
                <input
                  type="number"
                  step="10000"
                  value={loanParams.outstandingPrinciple}
                  onChange={(e) => setLoanParams(prev => ({ ...prev, outstandingPrinciple: Number(e.target.value) || 0 }))}
                  className="w-full bg-transparent text-white text-lg font-bold pl-4 focus:outline-none focus:text-[#c3f400]"
                />
              </div>
              <span className="text-[10px] text-[#8e9379]">
                Property: {loanParams.propertyType === 'private' ? 'Private Condo' : 'HDB Flat'}
              </span>
            </div>

            {/* Current Interest Rate */}
            <div className="space-y-1.5 bg-[#121414] border border-[#333535] p-3.5">
              <label className="text-[#8e9379] uppercase block text-[10px]">
                Current Interest Rate
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.05"
                  value={loanParams.currentInterestRate}
                  onChange={(e) => setLoanParams(prev => ({ ...prev, currentInterestRate: Number(e.target.value) || 0 }))}
                  className="w-full bg-transparent text-white text-lg font-bold pr-12 focus:outline-none focus:text-[#c3f400]"
                />
                <span className="absolute right-0 top-1 text-[#8e9379] font-bold text-xs">% p.a.</span>
              </div>
              <span className="text-[10px] text-[#8e9379]">Nominal Baseline Rate</span>
            </div>

            {/* Remaining Tenure */}
            <div className="space-y-1.5 bg-[#121414] border border-[#333535] p-3.5">
              <label className="text-[#8e9379] uppercase block text-[10px]">
                Remaining Tenure
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="35"
                  value={loanParams.remainingTenureYears}
                  onChange={(e) => setLoanParams(prev => ({ ...prev, remainingTenureYears: Number(e.target.value) || 1 }))}
                  className="w-full bg-transparent text-white text-lg font-bold pr-12 focus:outline-none focus:text-[#c3f400]"
                />
                <span className="absolute right-0 top-1 text-[#8e9379] font-bold text-xs">Years</span>
              </div>
              <span className="text-[10px] text-[#8e9379]">({loanParams.remainingTenureYears * 12} Monthly Payments)</span>
            </div>

            {/* Current Monthly & Annualized Outlay */}
            <div className="space-y-1.5 bg-[#1a1c1c] border-2 border-[#444933] p-3.5 flex flex-col justify-between">
              <span className="text-[#8e9379] uppercase block text-[10px]">
                Current Monthly Outlay
              </span>
              <div className="text-xl font-extrabold text-white">
                ${summary.currentMonthlyPayment.toLocaleString()}<span className="text-xs font-normal text-[#8e9379]">/mo</span>
              </div>
              <div className="text-[11px] text-[#c4c9ac] border-t border-[#333535] pt-1">
                Annual Total: <strong className="text-white">${summary.currentAnnualCost.toLocaleString()}/yr</strong>
              </div>
            </div>

          </div>
        </div>

        {/* STEP 2: INPUT QUOTATIONS OBTAINED (MAX 5 PACKAGES) */}
        {/* Requirement Step 02: Remove manual 3M SORA benchmark input, remove subsidies, keep simple */}
        <div className="space-y-6" id="step-quotations-input">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-['JetBrains_Mono'] text-xs font-bold px-2 py-0.5 bg-[#c3f400] text-[#161e00] uppercase">
                  STEP 02
                </span>
                <span className="font-['JetBrains_Mono'] text-xs text-[#c3f400] tracking-widest uppercase font-semibold">
                  QUOTATIONS OBTAINED ({quotations.length} / 5 PACKAGES)
                </span>
              </div>
              <h2 className="font-['Syne'] text-2xl sm:text-3xl font-bold uppercase text-white">
                Configure Comparison Quotes
              </h2>
            </div>

            {/* Action buttons for quotes */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleResetPresets}
                className="bg-[#1e2020] hover:bg-[#282a2a] text-[#c4c9ac] hover:text-white border border-[#444933] font-['JetBrains_Mono'] text-xs uppercase px-3 py-2 flex items-center gap-1.5 cursor-pointer transition-colors"
                id="btn-load-presets"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#c3f400]" />
                <span>Reset Best 5 Presets</span>
              </button>

              <button
                onClick={handleAddQuotation}
                disabled={quotations.length >= 5}
                className={`font-['JetBrains_Mono'] text-xs font-bold uppercase px-4 py-2 flex items-center gap-1.5 transition-all ${
                  quotations.length >= 5
                    ? 'bg-[#333535] text-[#8e9379] cursor-not-allowed'
                    : 'bg-[#c3f400] hover:bg-white text-[#161e00] cursor-pointer shadow-md'
                }`}
                id="btn-add-quotation"
              >
                <Plus className="w-4 h-4" />
                <span>Add Quote ({quotations.length}/5)</span>
              </button>
            </div>
          </div>

          {/* Quotations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quotations.map((quote, idx) => {
              const analysis = summary.analyses.find(a => a.quotation.id === quote.id);
              return (
                <QuotationCardEditor
                  key={quote.id}
                  index={idx}
                  quotation={quote}
                  onUpdate={(updated) => handleUpdateQuotation(idx, updated)}
                  onRemove={() => handleRemoveQuotation(quote.id)}
                  canRemove={quotations.length > 1}
                  isLowestCost={analysis?.isLowestCost}
                  costRank={analysis?.costRank}
                  activeSoraRate={masRateData.soraComp3M}
                />
              );
            })}
          </div>
        </div>

        {/* SIMULATION & CALCULATION ACTION SECTION */}
        {/* Requirement: "calculate" or "simulate" button which pushes the model to pull from the MAS API */}
        <div className="bg-[#1a1c1c] border-2 border-[#444933] p-8 lg:p-10 space-y-6 shadow-2xl relative overflow-hidden" id="simulation-trigger-panel">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <Cpu className="w-5 h-5 text-[#c3f400]" />
                <span className="font-['JetBrains_Mono'] text-xs uppercase tracking-widest text-[#c3f400] font-bold">
                  MAS DOMESTIC INTEREST RATES SYNCHRONIZATION
                </span>
              </div>
              <h3 className="font-['Syne'] text-2xl sm:text-3xl font-extrabold uppercase text-white">
                Simulate & Run Optimization Engine
              </h3>
              <p className="font-['Geist'] text-sm text-[#c4c9ac]">
                Queries the Monetary Authority of Singapore (MAS) Daily Domestic Rates API for the authoritative 3M Compounded SORA benchmark, models complete amortizations, and determines your #1 lowest annualized cost quote.
              </p>
            </div>

            <div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className={`w-full sm:w-auto font-['JetBrains_Mono'] text-sm font-extrabold uppercase tracking-wider px-8 py-5 flex items-center justify-center gap-3 transition-all cursor-pointer shadow-xl ${
                  isSimulating 
                    ? 'bg-[#333535] text-[#8e9379] cursor-wait' 
                    : 'bg-[#c3f400] hover:bg-white text-[#161e00] hover:scale-[1.02]'
                }`}
                id="btn-simulate-calculation"
              >
                {isSimulating ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin text-[#c3f400]" />
                    <span>Processing MAS Matrix...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 fill-current" />
                    <span>Simulate & Calculate Optimal Quote</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Simulation Progress Display */}
          {isSimulating && (
            <div className="bg-[#121414] border border-[#c3f400]/40 p-4 space-y-2 font-['JetBrains_Mono'] text-xs animate-pulse">
              <div className="flex items-center justify-between text-[#c3f400]">
                <span className="font-bold uppercase tracking-wider">{simStepText}</span>
                <span className="text-[10px]">MAS.API.GATEWAY // ACTIVE</span>
              </div>
              <div className="w-full bg-[#1e2020] h-1.5 overflow-hidden">
                <div className="bg-[#c3f400] h-full w-2/3 animate-pulse"></div>
              </div>
            </div>
          )}

          {/* MAS Query Meta readout */}
          {!isSimulating && (
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#333535] font-['JetBrains_Mono'] text-xs text-[#8e9379]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#c3f400]"></span>
                <span>Daily SORA: <strong className="text-white">{masRateData.soraDaily.toFixed(2)}%</strong></span>
                <span className="text-[#444933]">|</span>
                <span>1M: <strong className="text-white">{masRateData.soraComp1M.toFixed(2)}%</strong></span>
                <span className="text-[#444933]">|</span>
                <span>3M: <strong className="text-[#c3f400]">{masRateData.soraComp3M.toFixed(2)}%</strong></span>
                <span className="text-[#444933]">|</span>
                <span>6M: <strong className="text-white">{masRateData.soraComp6M.toFixed(2)}%</strong></span>
              </div>
              <div className="text-[11px] text-[#c4c9ac] flex items-center gap-2">
                <span>Dataset: <span className="text-white">Domestic Interest Rates - Daily</span></span>
                <span className="text-[#444933]">|</span>
                <span>Synced: <strong className="text-white">{masRateData.asOfDate}</strong></span>
              </div>
            </div>
          )}

        </div>

        {/* STEP 3 & 4: CALCULATE TOTAL & ANNUALIZED COSTS + HIGHLIGHT LOWEST COST OPTION */}
        {hasSimulated && lowestCost && (
          <div className="space-y-8" id="step-lowest-cost-showcase">
            
            <div className="flex items-center gap-2">
              <span className="font-['JetBrains_Mono'] text-xs font-bold px-2 py-0.5 bg-[#c3f400] text-[#161e00] uppercase">
                STEP 03 & 04
              </span>
              <span className="font-['JetBrains_Mono'] text-xs text-[#c3f400] tracking-widest uppercase font-semibold">
                ANNUALIZED COST ANALYSIS & LOWEST COST REVEAL
              </span>
            </div>

            {/* HERO CARD: #1 LOWEST COST HIGHLIGHT */}
            <div className="bg-[#1a1c1c] border-2 border-[#c3f400] p-8 lg:p-12 relative overflow-hidden shadow-[0_0_50px_rgba(195,244,0,0.15)]">
              
              {/* Electric Corner Ribbon */}
              <div className="absolute top-0 right-0 bg-[#c3f400] text-[#161e00] font-['JetBrains_Mono'] text-xs font-extrabold px-6 py-1.5 uppercase tracking-widest flex items-center gap-1.5 shadow-md">
                <Award className="w-4 h-4" />
                <span>RANK #1 // LOWEST ANNUALIZED COST</span>
              </div>

              <div className="space-y-8 relative z-10">
                <div className="space-y-2">
                  <span className="font-['JetBrains_Mono'] text-xs text-[#c3f400] tracking-[0.2em] uppercase font-bold block">
                    RECOMMENDED OPTIMAL ARCHITECTURE
                  </span>
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-4">
                    <h2 className="font-['Syne'] text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase text-white">
                      {lowestCost.quotation.bankName} — {lowestCost.quotation.packageName}
                    </h2>
                  </div>
                  <span className="font-['JetBrains_Mono'] text-base text-[#c4c9ac] block">
                    Rate Structure: <strong className="text-white">{lowestCost.quotation.rateDisplay}</strong>
                  </span>
                </div>

                {/* Big Metric Banner */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[#333535]">
                  
                  {/* Annualized Cost */}
                  <div className="bg-[#121414] border border-[#333535] p-5 space-y-1">
                    <span className="font-['JetBrains_Mono'] text-xs text-[#8e9379] uppercase block">
                      Lowest Annual Total Cost
                    </span>
                    <div className="font-['JetBrains_Mono'] text-3xl lg:text-4xl font-extrabold text-white">
                      ${lowestCost.annualTotalCost.toLocaleString()}
                      <span className="text-xs text-[#8e9379] font-normal">/yr</span>
                    </div>
                    <span className="font-['JetBrains_Mono'] text-[11px] text-[#c3f400] block">
                      (${lowestCost.monthlyPayment.toLocaleString()}/month installment)
                    </span>
                  </div>

                  {/* Annualized Savings */}
                  <div className="bg-[#121414] border-2 border-[#c3f400] p-5 space-y-1">
                    <span className="font-['JetBrains_Mono'] text-xs text-[#c3f400] uppercase font-bold block">
                      Annualized Savings vs Current
                    </span>
                    <div className="font-['JetBrains_Mono'] text-3xl lg:text-4xl font-extrabold text-[#c3f400]">
                      +${lowestCost.annualSavingsVsCurrent.toLocaleString()}
                      <span className="text-xs text-[#c3f400] font-normal">/yr</span>
                    </div>
                    <span className="font-['JetBrains_Mono'] text-[11px] text-white block">
                      (Monthly reduction: +${lowestCost.monthlySavingsVsCurrent.toLocaleString()}/mo)
                    </span>
                  </div>

                  {/* 3-Year Cumulative Cost */}
                  <div className="bg-[#121414] border border-[#333535] p-5 space-y-1">
                    <span className="font-['JetBrains_Mono'] text-xs text-[#8e9379] uppercase block">
                      3-Year Cumulative Cost
                    </span>
                    <div className="font-['JetBrains_Mono'] text-3xl lg:text-4xl font-extrabold text-white">
                      ${lowestCost.threeYearTotalCost.toLocaleString()}
                    </div>
                    <span className="font-['JetBrains_Mono'] text-[11px] text-[#8e9379] block">
                      3-Year Savings: +${lowestCost.threeYearNetSavings.toLocaleString()}
                    </span>
                  </div>

                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-[#333535]">
                  <button
                    onClick={() => onApplyPackage(lowestCost.quotation)}
                    className="w-full sm:w-auto bg-[#c3f400] hover:bg-white text-[#161e00] font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-wider px-8 py-4 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
                    id="btn-apply-lowest-quote"
                  >
                    <span>Lock In Lowest Cost Quote</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={onNavigateToSchedule}
                    className="w-full sm:w-auto bg-transparent hover:bg-[#333535] text-[#e2e2e2] border border-[#444933] font-['JetBrains_Mono'] text-xs uppercase px-6 py-4 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>Consult Senior Credit Specialist</span>
                  </button>
                </div>
              </div>
            </div>

            {/* SIDE-BY-SIDE COMPARATIVE MATRIX OF ALL QUOTATIONS */}
            <div className="bg-[#1e2020] border border-[#333535] p-6 lg:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#333535] pb-4">
                <div className="space-y-1">
                  <h3 className="font-['Syne'] text-xl sm:text-2xl font-bold uppercase text-white">
                    Full Side-by-Side Cost Comparison
                  </h3>
                  <p className="font-['Geist'] text-xs text-[#c4c9ac]">
                    Ranked by lowest annualized cost to highest. Benchmarked against Current Loan (${summary.currentAnnualCost.toLocaleString()}/yr).
                  </p>
                </div>
                <span className="font-['JetBrains_Mono'] text-xs text-[#c3f400] font-bold">
                  {summary.analyses.length} QUOTATIONS EVALUATED
                </span>
              </div>

              {/* Responsive Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left font-['JetBrains_Mono'] text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#333535] text-[#8e9379] uppercase">
                      <th className="py-3 px-4">Rank</th>
                      <th className="py-3 px-4">Institution & Structure</th>
                      <th className="py-3 px-4">Effective Rate</th>
                      <th className="py-3 px-4">Monthly Payment</th>
                      <th className="py-3 px-4">Annualized Cost</th>
                      <th className="py-3 px-4">Annual Savings</th>
                      <th className="py-3 px-4">Cost Delta vs Lowest</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2d3030]">
                    {/* Current Loan Row */}
                    <tr className="bg-[#151717] text-[#8e9379]">
                      <td className="py-3.5 px-4 font-bold">CURRENT</td>
                      <td className="py-3.5 px-4">
                        <span className="text-white font-bold">Current Loan Baseline</span>
                      </td>
                      <td className="py-3.5 px-4">{loanParams.currentInterestRate.toFixed(2)}%</td>
                      <td className="py-3.5 px-4 text-white">${summary.currentMonthlyPayment.toLocaleString()}/mo</td>
                      <td className="py-3.5 px-4 text-white">${summary.currentAnnualCost.toLocaleString()}/yr</td>
                      <td className="py-3.5 px-4">$0</td>
                      <td className="py-3.5 px-4 text-[#ff5a5a]">+${(summary.currentAnnualCost - lowestCost.annualTotalCost).toLocaleString()}/yr</td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="text-[10px] text-[#8e9379]">BASELINE</span>
                      </td>
                    </tr>

                    {/* Quotation Rows Ranked */}
                    {summary.analyses.map((analysis) => {
                      const costDelta = analysis.annualTotalCost - lowestCost.annualTotalCost;
                      const isWinner = analysis.isLowestCost;

                      return (
                        <tr 
                          key={analysis.quotation.id}
                          className={`transition-colors ${
                            isWinner ? 'bg-[#c3f400]/10 text-white font-bold' : 'hover:bg-[#252828] text-[#c4c9ac]'
                          }`}
                        >
                          <td className="py-4 px-4">
                            <span className={`px-2 py-0.5 text-[10px] uppercase font-bold ${
                              isWinner ? 'bg-[#c3f400] text-[#161e00]' : 'bg-[#333535] text-white'
                            }`}>
                              {isWinner ? '★ #1' : `#${analysis.costRank}`}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-bold text-white">{analysis.quotation.bankName}</div>
                            <div className="text-[10px] text-[#8e9379]">{analysis.quotation.packageName}</div>
                          </td>
                          <td className="py-4 px-4 font-bold text-[#c3f400]">
                            {analysis.quotation.nominalRate.toFixed(2)}%
                          </td>
                          <td className="py-4 px-4 text-white font-bold">
                            ${analysis.monthlyPayment.toLocaleString()}
                          </td>
                          <td className="py-4 px-4 text-white font-bold">
                            ${analysis.annualTotalCost.toLocaleString()}
                          </td>
                          <td className="py-4 px-4 font-bold text-[#c3f400]">
                            +${analysis.annualSavingsVsCurrent.toLocaleString()}
                          </td>
                          <td className="py-4 px-4">
                            {costDelta === 0 ? (
                              <span className="text-[#c3f400] font-bold">Lowest Cost ($0)</span>
                            ) : (
                              <span className="text-[#ff9900]">+{costDelta.toLocaleString()}/yr</span>
                            )}
                          </td>
                          <td className="py-4 px-4 text-right">
                            <button
                              onClick={() => onApplyPackage(analysis.quotation)}
                              className={`px-3 py-1.5 uppercase font-bold text-[10px] transition-colors cursor-pointer ${
                                isWinner 
                                  ? 'bg-[#c3f400] text-[#161e00] hover:bg-white' 
                                  : 'bg-[#333535] text-white hover:bg-[#c3f400] hover:text-[#161e00]'
                              }`}
                            >
                              Select
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
