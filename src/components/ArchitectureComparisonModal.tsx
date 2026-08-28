import React from 'react';
import { QuotationPackage, LoanParameters } from '../types';
import { analyzeQuotationCost } from '../data/mockRates';
import { X, Check, ArrowRight, FileSpreadsheet } from 'lucide-react';

interface ArchitectureComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage: QuotationPackage | null;
  allPackages: QuotationPackage[];
  loanParams: LoanParameters;
  onApplyPackage: (pkg: QuotationPackage) => void;
}

export const ArchitectureComparisonModal: React.FC<ArchitectureComparisonModalProps> = ({
  isOpen,
  onClose,
  selectedPackage,
  allPackages,
  loanParams,
  onApplyPackage
}) => {
  if (!isOpen || !selectedPackage) return null;

  // Compare the selected package with the other quotations (up to 3 total)
  const comparisonList = [
    selectedPackage,
    ...allPackages.filter(p => p.id !== selectedPackage.id).slice(0, 2)
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 lg:p-10">
      <div className="bg-[#1e2020] border-2 border-[#444933] w-full max-w-5xl max-h-[90vh] overflow-y-auto p-6 lg:p-10 space-y-8 shadow-2xl text-[#e2e2e2]">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-[#333535] pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-[#c3f400]" />
              <span className="font-['JetBrains_Mono'] text-xs text-[#c3f400] tracking-widest uppercase font-bold">
                SIDE-BY-SIDE ARCHITECTURAL DEEP DIVE
              </span>
            </div>
            <h2 className="font-['Syne'] text-2xl sm:text-3xl font-bold uppercase text-white">
              Comparative Debt Structures
            </h2>
            <p className="font-['Geist'] text-xs sm:text-sm text-[#c4c9ac]">
              Benchmarked against current loan @ {loanParams.currentInterestRate.toFixed(2)}% on ${loanParams.outstandingPrinciple.toLocaleString()}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-[#121414] border border-[#333535] hover:border-[#c3f400] text-[#c4c9ac] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {comparisonList.map((pkg, idx) => {
            const analysis = analyzeQuotationCost(loanParams, pkg);
            const isPrimary = idx === 0;

            return (
              <div 
                key={pkg.id}
                className={`p-6 flex flex-col justify-between space-y-6 ${
                  isPrimary 
                    ? 'bg-[#1a1c1c] border-2 border-[#c3f400]' 
                    : 'bg-[#121414] border border-[#333535]'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-['JetBrains_Mono'] text-[10px] font-bold px-2 py-0.5 uppercase bg-[#333535] text-white">
                      {pkg.rateType === 'fixed' ? `${pkg.fixedTenureYears || 2}Y FIXED` : 'FLOATING SORA'}
                    </span>
                    {isPrimary && (
                      <span className="font-['JetBrains_Mono'] text-[10px] text-[#c3f400] font-bold">
                        SELECTED
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-['Syne'] text-lg font-bold text-white uppercase">{pkg.bankName}</h3>
                    <div className="font-['JetBrains_Mono'] text-3xl font-extrabold text-[#c3f400] mt-1">
                      {pkg.rateDisplay}
                    </div>
                    <span className="font-['JetBrains_Mono'] text-[11px] text-[#8e9379] uppercase block mt-1">
                      {pkg.packageName}
                    </span>
                  </div>

                  {/* Financial Metrics */}
                  <div className="space-y-2 font-['JetBrains_Mono'] text-xs border-t border-[#333535] pt-3">
                    <div className="flex justify-between">
                      <span className="text-[#8e9379]">Monthly Installment:</span>
                      <span className="text-white font-bold">${analysis.monthlyPayment.toLocaleString()}/mo</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8e9379]">Annual Total Cost:</span>
                      <span className="text-white font-bold">${analysis.annualTotalCost.toLocaleString()}/yr</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8e9379]">Annual Savings:</span>
                      <span className="text-[#c3f400] font-bold">+${analysis.annualSavingsVsCurrent.toLocaleString()}/yr</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#8e9379]">3-Year Cumulative Cost:</span>
                      <span className="text-white font-bold">${analysis.threeYearTotalCost.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2 font-['Geist'] text-xs text-[#c4c9ac] border-t border-[#333535] pt-3">
                    <div className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-[#c3f400] shrink-0" />
                      <span>Structure: <strong>{pkg.rateType === 'fixed' ? `${pkg.fixedTenureYears}Y Fixed Lock` : 'Floating (Daily SORA)'}</strong></span>
                    </div>
                    {pkg.notes && (
                      <div className="text-[11px] text-[#8e9379] italic pt-1">
                        {pkg.notes}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    onApplyPackage(pkg);
                    onClose();
                  }}
                  className={`w-full font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-wider py-3 flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isPrimary 
                      ? 'bg-[#c3f400] hover:bg-white text-[#161e00]' 
                      : 'bg-transparent hover:bg-[#333535] text-white border border-[#444933]'
                  }`}
                >
                  <span>Select & Apply</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Amortization Schedule Preview */}
        <div className="bg-[#121414] border border-[#333535] p-6 space-y-4">
          <span className="font-['JetBrains_Mono'] text-xs text-[#c3f400] uppercase tracking-widest font-semibold block">
            ESTIMATED 3-YEAR AMORTIZATION PROJECTION ({selectedPackage.bankName})
          </span>
          <div className="grid grid-cols-3 gap-4 font-['JetBrains_Mono'] text-xs">
            <div className="p-3 bg-[#1e2020] border border-[#333535]">
              <span className="text-[#8e9379] block">Year 1 Ending Balance</span>
              <span className="text-white font-bold text-sm">
                ${Math.round(loanParams.outstandingPrinciple * 0.965).toLocaleString()}
              </span>
            </div>
            <div className="p-3 bg-[#1e2020] border border-[#333535]">
              <span className="text-[#8e9379] block">Year 2 Ending Balance</span>
              <span className="text-white font-bold text-sm">
                ${Math.round(loanParams.outstandingPrinciple * 0.929).toLocaleString()}
              </span>
            </div>
            <div className="p-3 bg-[#1e2020] border border-[#333535]">
              <span className="text-[#8e9379] block">Year 3 Ending Balance</span>
              <span className="text-white font-bold text-sm">
                ${Math.round(loanParams.outstandingPrinciple * 0.892).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
