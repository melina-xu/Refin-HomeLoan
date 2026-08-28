import React from 'react';
import { QuotationPackage, FixedTenure, RateType } from '../types';
import { POPULAR_BANKS } from '../data/mockRates';
import { Trash2, Lock, TrendingUp, Sparkles, Building2 } from 'lucide-react';

interface QuotationCardEditorProps {
  index: number;
  quotation: QuotationPackage;
  onUpdate: (updated: QuotationPackage) => void;
  onRemove: () => void;
  canRemove: boolean;
  isLowestCost?: boolean;
  costRank?: number;
  activeSoraRate?: number;
  isSoraFallback?: boolean;
}

export const QuotationCardEditor: React.FC<QuotationCardEditorProps> = ({
  index,
  quotation,
  onUpdate,
  onRemove,
  canRemove,
  isLowestCost,
  costRank,
  activeSoraRate = 2.45,
  isSoraFallback = true
}) => {
  const handleRateTypeChange = (rateType: RateType) => {
    if (rateType === 'fixed') {
      const fixedRate = quotation.fixedRate ?? 2.80;
      onUpdate({
        ...quotation,
        rateType: 'fixed',
        fixedTenureYears: quotation.fixedTenureYears ?? 2,
        fixedRate,
        nominalRate: fixedRate,
        rateDisplay: `${fixedRate.toFixed(2)}% p.a. (${quotation.fixedTenureYears ?? 2}Y Fixed)`
      });
    } else {
      const spread = quotation.soraSpread ?? 0.50;
      const nominal = Number((activeSoraRate + spread).toFixed(2));
      onUpdate({
        ...quotation,
        rateType: 'floating_sora',
        soraSpread: spread,
        nominalRate: nominal,
        rateDisplay: `3M SORA + ${spread.toFixed(2)}% (${nominal.toFixed(2)}%)`
      });
    }
  };

  const handleFixedTenureChange = (years: FixedTenure) => {
    onUpdate({
      ...quotation,
      fixedTenureYears: years,
      rateDisplay: `${(quotation.fixedRate ?? quotation.nominalRate).toFixed(2)}% p.a. (${years}Y Fixed)`
    });
  };

  const handleFixedRateChange = (rate: number) => {
    onUpdate({
      ...quotation,
      fixedRate: rate,
      nominalRate: rate,
      rateDisplay: `${rate.toFixed(2)}% p.a. (${quotation.fixedTenureYears ?? 2}Y Fixed)`
    });
  };

  const handleFloatingSpreadChange = (spread: number) => {
    const nominal = Number((activeSoraRate + spread).toFixed(2));
    onUpdate({
      ...quotation,
      soraSpread: spread,
      nominalRate: nominal,
      rateDisplay: `3M SORA + ${spread.toFixed(2)}% (${nominal.toFixed(2)}%)`
    });
  };

  const effectiveRate = quotation.rateType === 'fixed'
    ? (quotation.fixedRate ?? quotation.nominalRate)
    : Number((activeSoraRate + (quotation.soraSpread ?? 0.50)).toFixed(2));

  return (
    <div 
      className={`p-5 lg:p-6 transition-all duration-300 relative space-y-5 flex flex-col justify-between ${
        isLowestCost 
          ? 'bg-[#1a1c1c] border-2 border-[#c3f400] shadow-[0_0_25px_rgba(195,244,0,0.12)]' 
          : 'bg-[#181a1a] border border-[#333535] hover:border-[#444933]'
      }`}
      id={`quote-editor-card-${quotation.id}`}
    >
      <div className="space-y-4">
        {/* Card Header with Rank & Bank name */}
        <div className="flex justify-between items-start border-b border-[#333535] pb-3">
          <div className="flex items-center gap-2.5">
            <span className={`font-['JetBrains_Mono'] text-[11px] font-extrabold px-2 py-0.5 uppercase tracking-wider ${
              isLowestCost 
                ? 'bg-[#c3f400] text-[#161e00]' 
                : 'bg-[#252828] text-[#c4c9ac] border border-[#383b3b]'
            }`}>
              {isLowestCost ? '★ OPTION ' + (index + 1) + ' (LOWEST COST)' : `OPTION 0${index + 1}`}
            </span>
            {costRank && costRank > 1 && (
              <span className="font-['JetBrains_Mono'] text-[10px] text-[#8e9379] uppercase">
                Rank #{costRank}
              </span>
            )}
          </div>

          {canRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="text-[#8e9379] hover:text-[#ff4b4b] transition-colors p-1 cursor-pointer"
              title="Remove this quotation"
              id={`btn-remove-quote-${quotation.id}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Inputs Grid */}
        <div className="space-y-4 font-['JetBrains_Mono'] text-xs">
          
          {/* Bank Selection */}
          <div className="space-y-1.5">
            <label className="text-[#8e9379] uppercase tracking-wider block text-[10px]">
              Financing Bank / Institution
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={quotation.bankName}
                onChange={(e) => onUpdate({ ...quotation, bankName: e.target.value })}
                className="flex-1 bg-[#121414] border border-[#444933] text-white p-2.5 text-xs focus:border-[#c3f400] focus:outline-none cursor-pointer"
              >
                {POPULAR_BANKS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Package name / memo"
                value={quotation.packageName}
                onChange={(e) => onUpdate({ ...quotation, packageName: e.target.value })}
                className="sm:w-1/2 bg-[#121414] border border-[#444933] text-white p-2.5 text-xs focus:border-[#c3f400] focus:outline-none"
              />
            </div>
          </div>

          {/* Rate Structure: Fixed vs Floating Toggle */}
          <div className="space-y-1.5">
            <label className="text-[#8e9379] uppercase tracking-wider block text-[10px]">
              Rate Structure
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleRateTypeChange('fixed')}
                className={`py-2 px-3 text-xs uppercase font-bold text-center border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  quotation.rateType === 'fixed'
                    ? 'bg-[#c3f400] text-[#161e00] border-[#c3f400]'
                    : 'bg-[#121414] text-[#c4c9ac] border-[#333535] hover:border-[#444933]'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Fixed Rate</span>
              </button>
              <button
                type="button"
                onClick={() => handleRateTypeChange('floating_sora')}
                className={`py-2 px-3 text-xs uppercase font-bold text-center border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  quotation.rateType === 'floating_sora'
                    ? 'bg-[#c3f400] text-[#161e00] border-[#c3f400]'
                    : 'bg-[#121414] text-[#c4c9ac] border-[#333535] hover:border-[#444933]'
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Floating SORA</span>
              </button>
            </div>
          </div>

          {/* Conditional inputs depending on Fixed vs Floating */}
          {quotation.rateType === 'fixed' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Fixed Tenure Selector (1, 2, or 3 Years) */}
              <div className="space-y-1.5">
                <label className="text-[#8e9379] uppercase tracking-wider block text-[10px]">
                  Fixed Lock-in
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {([1, 2, 3] as FixedTenure[]).map((yr) => (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => handleFixedTenureChange(yr)}
                      className={`py-2 text-center text-xs uppercase font-semibold border cursor-pointer transition-all ${
                        quotation.fixedTenureYears === yr
                          ? 'bg-[#333535] text-[#c3f400] border-[#c3f400]'
                          : 'bg-[#121414] text-[#c4c9ac] border-[#333535]'
                      }`}
                    >
                      {yr}Y
                    </button>
                  ))}
                </div>
              </div>

              {/* Fixed Rate % p.a. */}
              <div className="space-y-1.5">
                <label className="text-[#8e9379] uppercase tracking-wider block text-[10px]">
                  Fixed Rate (% p.a.)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0.5"
                    max="10"
                    value={quotation.fixedRate ?? quotation.nominalRate}
                    onChange={(e) => handleFixedRateChange(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#121414] border border-[#444933] text-white text-base font-bold p-2 pr-7 focus:border-[#c3f400] focus:outline-none"
                  />
                  <span className="absolute right-2.5 top-2 text-[#c3f400] font-bold text-xs">%</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Floating: Bank Spread over SORA */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap justify-between items-center gap-1">
                  <label className="text-[#8e9379] uppercase tracking-wider block text-[10px]">
                    Bank Spread over 3M SORA (%)
                  </label>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-semibold ${isSoraFallback ? 'text-[#facc15]' : 'text-[#c4c9ac]'}`}>
                      Base: 3M SORA ({activeSoraRate.toFixed(2)}%)
                    </span>
                    {isSoraFallback ? (
                      <span className="inline-flex items-center px-1.5 py-0.2 text-[9px] font-bold uppercase bg-yellow-500/15 text-[#facc15] border border-yellow-500/30">
                        [Fallback / Offline Baseline]
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.2 text-[9px] font-bold uppercase bg-[#c3f400]/15 text-[#c3f400] border border-[#c3f400]/40">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#c3f400] animate-pulse"></span>
                        Live MAS
                      </span>
                    )}
                  </div>
                </div>
                <div className="relative">
                  <span className={`absolute left-3 top-2 font-bold text-xs ${isSoraFallback ? 'text-[#facc15]' : 'text-[#c3f400]'}`}>+</span>
                  <input
                    type="number"
                    step="0.01"
                    min="-2"
                    max="5"
                    value={quotation.soraSpread ?? 0.50}
                    onChange={(e) => handleFloatingSpreadChange(parseFloat(e.target.value) || 0)}
                    className={`w-full bg-[#121414] border text-white text-base font-bold p-2 pl-7 pr-8 focus:outline-none ${
                      isSoraFallback 
                        ? 'border-yellow-500/50 focus:border-yellow-500' 
                        : 'border-[#444933] focus:border-[#c3f400]'
                    }`}
                  />
                  <span className={`absolute right-3 top-2 font-bold text-xs ${isSoraFallback ? 'text-[#facc15]' : 'text-[#c3f400]'}`}>%</span>
                </div>
              </div>
              <div className="text-[10px] flex items-center justify-between gap-1">
                {isSoraFallback ? (
                  <span className="text-[#facc15] italic">
                    * Using Offline Baseline 3M SORA ({activeSoraRate.toFixed(2)}%). Live MAS API disconnected.
                  </span>
                ) : (
                  <span className="text-[#8e9379] italic">
                    * Live 3M Compounded SORA benchmark synced from MAS Gateway API.
                  </span>
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Effective Rate Pill footer */}
      <div className={`p-3 flex flex-wrap justify-between items-center font-['JetBrains_Mono'] mt-3 border ${
        quotation.rateType === 'floating_sora' && isSoraFallback
          ? 'bg-yellow-950/20 border-yellow-500/30'
          : 'bg-[#121414] border-[#2d3030]'
      }`}>
        <span className="text-[11px] text-[#8e9379] uppercase">Effective Rate:</span>
        <div className="flex items-center gap-2">
          {quotation.rateType === 'fixed' ? (
            <span className="text-sm font-extrabold text-[#c3f400]">
              {(quotation.fixedRate ?? quotation.nominalRate).toFixed(2)}% p.a.
            </span>
          ) : (
            <>
              <span className={`text-sm font-extrabold ${isSoraFallback ? 'text-[#facc15]' : 'text-[#c3f400]'}`}>
                3M SORA + {(quotation.soraSpread ?? 0.50).toFixed(2)}% ({effectiveRate.toFixed(2)}%)
              </span>
              {isSoraFallback ? (
                <span className="text-[9px] font-bold px-1.5 py-0.5 bg-yellow-500/20 text-[#facc15] border border-yellow-500/40 uppercase whitespace-nowrap">
                  [Fallback / Offline Baseline]
                </span>
              ) : (
                <span className="text-[9px] font-bold px-1.5 py-0.5 bg-[#c3f400]/20 text-[#c3f400] border border-[#c3f400]/40 uppercase flex items-center gap-1 whitespace-nowrap">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#c3f400] animate-pulse"></span>
                  Live MAS
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
