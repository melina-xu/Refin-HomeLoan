import React, { useState } from 'react';
import { PropertyType, LoanParameters } from '../types';
import { Building2, Home, Building, ArrowRight, Sparkles, SlidersHorizontal, ShieldCheck, Zap } from 'lucide-react';

interface PropertySelectorScreenProps {
  loanParams: LoanParameters;
  setLoanParams: React.Dispatch<React.SetStateAction<LoanParameters>>;
  onSelectAndContinue: (propertyType: PropertyType) => void;
  onOpenMethodology: () => void;
}

export const PropertySelectorScreen: React.FC<PropertySelectorScreenProps> = ({
  loanParams,
  setLoanParams,
  onSelectAndContinue,
  onOpenMethodology,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [selectedProp, setSelectedProp] = useState<PropertyType>(loanParams.propertyType);

  const handleExecuteScan = (propType: PropertyType) => {
    setSelectedProp(propType);
    setLoanParams(prev => ({ ...prev, propertyType: propType }));
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      onSelectAndContinue(propType);
    }, 600);
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] flex flex-col justify-center items-center py-16 lg:py-24 relative overflow-hidden">
      
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#c3f400]/5 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="w-full max-w-5xl mx-auto px-6 lg:px-16 flex flex-col gap-12 z-10">
        
        {/* Header Section with Brutalist Geometric Accent */}
        <div className="flex flex-col gap-6 text-left relative pl-6 lg:pl-10">
          
          {/* Vertical geometric accent line */}
          <div className="absolute left-0 top-1 bottom-1 w-2.5 bg-[#c3f400]"></div>
          
          <div className="space-y-2">
            <span className="font-['JetBrains_Mono'] text-xs uppercase tracking-[0.25em] text-[#c3f400] font-semibold">
              INGRESS PROTOCOL // REFINANCE SCANNER
            </span>
            <h1 className="font-['Syne'] text-[44px] sm:text-[64px] lg:text-[80px] leading-[0.95] tracking-tight text-[#e2e2e2] uppercase font-extrabold">
              Optimise Your <br />
              <span className="text-[#c3f400]">Mortgage.</span>
            </h1>
          </div>

          <p className="font-['Geist'] text-lg sm:text-xl text-[#c4c9ac] max-w-2xl font-normal leading-relaxed">
            Select your property type to find the market's most competitive rates. Brutalist precision for your financial future.
          </p>
        </div>

        {/* Selection Tiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          
          {/* Private Property Tile */}
          <div
            onClick={() => handleExecuteScan('private')}
            id="tile-private-property"
            className="group relative bg-[#1e2020] hover:bg-[#282a2b] transition-all duration-300 border border-transparent hover:border-[#444933] p-8 lg:p-10 flex flex-col justify-between min-h-[300px] cursor-pointer overflow-hidden shadow-2xl"
          >
            {/* Decorative background polygon */}
            <div className="absolute -right-8 -top-8 w-36 h-36 bg-[#c3f400]/5 rotate-45 transform group-hover:scale-150 group-hover:bg-[#c3f400]/10 transition-transform duration-700 ease-out"></div>
            
            <div className="flex justify-between items-start z-10">
              <div className="w-16 h-16 bg-[#38393a] flex items-center justify-center border border-[#444933] group-hover:border-[#c3f400] transition-colors">
                <Building2 className="w-8 h-8 text-[#e2e2e2] group-hover:text-[#c3f400] transition-colors" />
              </div>
              <div className="w-9 h-9 flex items-center justify-center bg-transparent border-2 border-[#444933] group-hover:border-[#c3f400] transition-colors group-hover:bg-[#c3f400]">
                <ArrowRight className="w-4 h-4 text-transparent group-hover:text-[#161e00] transition-colors font-bold" />
              </div>
            </div>

            <div className="flex flex-col gap-3 z-10 mt-10">
              <span className="font-['JetBrains_Mono'] text-xs text-[#c4c9ac] tracking-[0.2em] uppercase font-semibold">
                01 // SELECT
              </span>
              <h3 className="font-['Syne'] text-2xl lg:text-3xl text-[#e2e2e2] uppercase font-bold group-hover:text-white transition-colors">
                Private Property
              </h3>
              <p className="font-['Geist'] text-sm text-[#c4c9ac] leading-relaxed">
                Condominiums, landed estates, and commercial real estate refinancing.
              </p>
            </div>

            {/* Bottom Accent progress line on hover */}
            <div className="absolute bottom-0 left-0 w-0 h-1.5 bg-[#c3f400] group-hover:w-full transition-all duration-500 ease-out"></div>
          </div>

          {/* HDB Flat Tile */}
          <div
            onClick={() => handleExecuteScan('hdb')}
            id="tile-hdb-flat"
            className="group relative bg-[#1e2020] hover:bg-[#282a2b] transition-all duration-300 border border-transparent hover:border-[#444933] p-8 lg:p-10 flex flex-col justify-between min-h-[300px] cursor-pointer overflow-hidden shadow-2xl"
          >
            {/* Decorative background polygon */}
            <div className="absolute -left-8 -bottom-8 w-36 h-36 bg-[#c3f400]/5 rotate-12 transform group-hover:scale-150 group-hover:bg-[#c3f400]/10 transition-transform duration-700 ease-out"></div>
            
            <div className="flex justify-between items-start z-10">
              <div className="w-16 h-16 bg-[#38393a] flex items-center justify-center border border-[#444933] group-hover:border-[#c3f400] transition-colors">
                <Home className="w-8 h-8 text-[#e2e2e2] group-hover:text-[#c3f400] transition-colors" />
              </div>
              <div className="w-9 h-9 flex items-center justify-center bg-transparent border-2 border-[#444933] group-hover:border-[#c3f400] transition-colors group-hover:bg-[#c3f400]">
                <ArrowRight className="w-4 h-4 text-transparent group-hover:text-[#161e00] transition-colors font-bold" />
              </div>
            </div>

            <div className="flex flex-col gap-3 z-10 mt-10">
              <span className="font-['JetBrains_Mono'] text-xs text-[#c4c9ac] tracking-[0.2em] uppercase font-semibold">
                02 // SELECT
              </span>
              <h3 className="font-['Syne'] text-2xl lg:text-3xl text-[#e2e2e2] uppercase font-bold group-hover:text-white transition-colors">
                HDB Flat
              </h3>
              <p className="font-['Geist'] text-sm text-[#c4c9ac] leading-relaxed">
                Public housing refinancing tailored for Singaporean homeowners.
              </p>
            </div>

            {/* Bottom Accent line */}
            <div className="absolute bottom-0 left-0 w-0 h-1.5 bg-[#c3f400] group-hover:w-full transition-all duration-500 ease-out"></div>
          </div>

        </div>

        {/* Quick Ingress Tuning Parameters */}
        <div className="bg-[#1a1c1c] border border-[#333535] p-6 lg:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#333535] pb-4">
            <div className="flex items-center gap-3">
              <SlidersHorizontal className="w-5 h-5 text-[#c3f400]" />
              <span className="font-['JetBrains_Mono'] text-xs font-semibold text-white tracking-widest uppercase">
                Quick Ingress Parameters
              </span>
            </div>
            <span className="font-['JetBrains_Mono'] text-xs text-[#c4c9ac]">
              Tweak values below or click above to scan
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* Outstanding Principle */}
            <div className="space-y-1.5">
              <label className="font-['JetBrains_Mono'] text-[11px] text-[#c4c9ac] uppercase tracking-wider block">
                Outstanding Principal
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 font-['JetBrains_Mono'] text-sm text-[#c3f400]">$</span>
                <input
                  type="number"
                  value={loanParams.outstandingPrinciple}
                  onChange={(e) => setLoanParams(prev => ({ ...prev, outstandingPrinciple: Number(e.target.value) || 0 }))}
                  className="w-full bg-[#121414] border-b border-[#8e9379] focus:border-[#c3f400] text-white font-['JetBrains_Mono'] text-base pl-7 pr-3 py-2 focus:outline-none"
                  id="input-outstanding-loan"
                />
              </div>
            </div>

            {/* Remaining Tenure */}
            <div className="space-y-1.5">
              <label className="font-['JetBrains_Mono'] text-[11px] text-[#c4c9ac] uppercase tracking-wider block">
                Remaining Tenure
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={loanParams.remainingTenureYears}
                  min={1}
                  max={35}
                  onChange={(e) => setLoanParams(prev => ({ ...prev, remainingTenureYears: Number(e.target.value) || 1 }))}
                  className="w-full bg-[#121414] border-b border-[#8e9379] focus:border-[#c3f400] text-white font-['JetBrains_Mono'] text-base px-3 py-2 focus:outline-none"
                  id="input-remaining-tenure"
                />
                <span className="absolute right-3 top-2.5 font-['JetBrains_Mono'] text-xs text-[#c4c9ac]">Years</span>
              </div>
            </div>

            {/* Current Interest Rate */}
            <div className="space-y-1.5">
              <label className="font-['JetBrains_Mono'] text-[11px] text-[#c4c9ac] uppercase tracking-wider block">
                Current Interest Rate
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.05"
                  value={loanParams.currentInterestRate}
                  onChange={(e) => setLoanParams(prev => ({ ...prev, currentInterestRate: Number(e.target.value) || 0 }))}
                  className="w-full bg-[#121414] border-b border-[#8e9379] focus:border-[#c3f400] text-white font-['JetBrains_Mono'] text-base px-3 py-2 focus:outline-none"
                  id="input-current-rate"
                />
                <span className="absolute right-3 top-2.5 font-['JetBrains_Mono'] text-xs text-[#c4c9ac]">% p.a.</span>
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-[#c4c9ac] text-xs font-['JetBrains_Mono']">
              <ShieldCheck className="w-4 h-4 text-[#c3f400]" />
              <span>Zero obligation · No physical paperwork required at this step</span>
            </div>

            <button
              onClick={() => handleExecuteScan(selectedProp)}
              disabled={isScanning}
              className="w-full sm:w-auto bg-[#c3f400] hover:bg-white text-[#161e00] font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-wider px-8 py-3.5 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
              id="execute-scan-btn"
            >
              {isScanning ? (
                <>
                  <div className="w-4 h-4 border-2 border-[#161e00] border-t-transparent animate-spin"></div>
                  <span>Scanning 15+ Institutions...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Execute Algorithmic Scan</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer Metadata */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-t border-[#444933]/50 pt-8 gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-[#c3f400] animate-pulse"></span>
            <span className="font-['JetBrains_Mono'] text-xs text-[#c4c9ac] tracking-wider uppercase">
              MARKET RATES UPDATED: RECENTLY // REAL-TIME 3M-SORA BENCHMARK: 2.45%
            </span>
          </div>
          <button 
            onClick={onOpenMethodology}
            className="font-['JetBrains_Mono'] text-xs text-[#c4c9ac]/70 hover:text-[#c3f400] tracking-[0.25em] uppercase transition-colors"
          >
            SYS.REF.001 // VIEW METHODOLOGY →
          </button>
        </div>

      </div>
    </div>
  );
};
