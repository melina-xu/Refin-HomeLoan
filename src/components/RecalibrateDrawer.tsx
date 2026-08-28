import React, { useState } from 'react';
import { LoanParameters, PropertyType } from '../types';
import { X, SlidersHorizontal, ArrowRight, RotateCcw, Check } from 'lucide-react';

interface RecalibrateDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  loanParams: LoanParameters;
  onSaveParams: (params: LoanParameters) => void;
}

export const RecalibrateDrawer: React.FC<RecalibrateDrawerProps> = ({
  isOpen,
  onClose,
  loanParams,
  onSaveParams,
}) => {
  const [formData, setFormData] = useState<LoanParameters>(loanParams);

  if (!isOpen) return null;

  const handleApply = () => {
    onSaveParams(formData);
    onClose();
  };

  const handleReset = () => {
    setFormData(loanParams);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm flex justify-end">
      <div 
        className="w-full max-w-lg bg-[#1e2020] border-l border-[#444933] h-full overflow-y-auto p-6 lg:p-8 flex flex-col justify-between shadow-2xl text-[#e2e2e2]"
        id="recalibrate-drawer"
      >
        {/* Header */}
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b border-[#333535] pb-4">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-[#c3f400]" />
              <h2 className="font-['Syne'] text-xl font-bold uppercase text-white">
                Recalibrate Parameters
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center bg-[#121414] border border-[#333535] hover:border-[#c3f400] text-[#c4c9ac] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            
            {/* Property Type */}
            <div className="space-y-2">
              <label className="font-['JetBrains_Mono'] text-xs text-[#c4c9ac] uppercase tracking-wider block">
                Property Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, propertyType: 'private' })}
                  className={`py-2.5 px-3 font-['JetBrains_Mono'] text-xs uppercase text-center border transition-all cursor-pointer ${
                    formData.propertyType === 'private'
                      ? 'bg-[#c3f400] text-[#161e00] font-bold border-[#c3f400]'
                      : 'bg-[#121414] text-[#c4c9ac] border-[#333535] hover:border-[#444933]'
                  }`}
                >
                  Private Condo
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, propertyType: 'hdb' })}
                  className={`py-2.5 px-3 font-['JetBrains_Mono'] text-xs uppercase text-center border transition-all cursor-pointer ${
                    formData.propertyType === 'hdb'
                      ? 'bg-[#c3f400] text-[#161e00] font-bold border-[#c3f400]'
                      : 'bg-[#121414] text-[#c4c9ac] border-[#333535] hover:border-[#444933]'
                  }`}
                >
                  HDB Flat
                </button>
              </div>
            </div>

            {/* Outstanding Principal Slider & Input */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-['JetBrains_Mono'] text-xs text-[#c4c9ac] uppercase tracking-wider">
                  Outstanding Principal
                </label>
                <span className="font-['JetBrains_Mono'] text-base font-bold text-[#c3f400]">
                  ${formData.outstandingPrinciple.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="100000"
                max="5000000"
                step="25000"
                value={formData.outstandingPrinciple}
                onChange={(e) => setFormData({ ...formData, outstandingPrinciple: Number(e.target.value) })}
                className="w-full accent-[#c3f400] cursor-pointer bg-[#121414]"
              />
              <div className="flex justify-between text-[10px] font-['JetBrains_Mono'] text-[#8e9379]">
                <span>$100,000</span>
                <span>$2,500,000</span>
                <span>$5,000,000+</span>
              </div>
            </div>

            {/* Remaining Tenure */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-['JetBrains_Mono'] text-xs text-[#c4c9ac] uppercase tracking-wider">
                  Remaining Tenure
                </label>
                <span className="font-['JetBrains_Mono'] text-base font-bold text-white">
                  {formData.remainingTenureYears} Years
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="35"
                step="1"
                value={formData.remainingTenureYears}
                onChange={(e) => setFormData({ ...formData, remainingTenureYears: Number(e.target.value) })}
                className="w-full accent-[#c3f400] cursor-pointer bg-[#121414]"
              />
              <div className="flex justify-between text-[10px] font-['JetBrains_Mono'] text-[#8e9379]">
                <span>1 Year</span>
                <span>18 Years</span>
                <span>35 Years</span>
              </div>
            </div>

            {/* Current Interest Rate */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="font-['JetBrains_Mono'] text-xs text-[#c4c9ac] uppercase tracking-wider">
                  Current Interest Rate (% p.a.)
                </label>
                <span className="font-['JetBrains_Mono'] text-base font-bold text-[#c3f400]">
                  {formData.currentInterestRate.toFixed(2)}%
                </span>
              </div>
              <input
                type="range"
                min="1.50"
                max="6.00"
                step="0.05"
                value={formData.currentInterestRate}
                onChange={(e) => setFormData({ ...formData, currentInterestRate: Number(e.target.value) })}
                className="w-full accent-[#c3f400] cursor-pointer bg-[#121414]"
              />
              <div className="flex justify-between text-[10px] font-['JetBrains_Mono'] text-[#8e9379]">
                <span>1.50%</span>
                <span>3.75%</span>
                <span>6.00%</span>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-8 border-t border-[#333535] space-y-3">
          <button
            onClick={handleApply}
            className="w-full bg-[#c3f400] hover:bg-white text-[#161e00] font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-wider py-3.5 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Apply Parameters & Recalculate</span>
          </button>

          <button
            onClick={handleReset}
            className="w-full bg-transparent hover:bg-[#333535] text-[#c4c9ac] font-['JetBrains_Mono'] text-xs uppercase tracking-wider py-2.5 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Initial Baseline</span>
          </button>
        </div>
      </div>
    </div>
  );
};
