import React from 'react';
import { Landmark } from 'lucide-react';
import { ActiveTab } from '../types';

interface FooterProps {
  onNavigate: (tab: ActiveTab) => void;
  onOpenSchedule: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenSchedule }) => {
  return (
    <footer className="bg-[#0c0f0f] border-t border-[#444933]/60 py-20 lg:py-28 text-[#e2e2e2]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-16">
        
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row justify-between gap-12 pb-16 border-b border-[#333535]">
          
          {/* Brand Info */}
          <div className="max-w-md space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#c3f400] flex items-center justify-center">
                <Landmark className="w-5 h-5 text-[#161e00]" strokeWidth={2.2} />
              </div>
              <span className="font-['Syne'] text-[32px] font-bold text-white uppercase tracking-tighter">
                Refi.
              </span>
            </div>
            <p className="font-['Geist'] text-base text-[#c4c9ac] leading-relaxed">
              The avant-garde standard for modern wealth and mortgage optimization. Brutalist precision for your financial future.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="w-2.5 h-2.5 bg-[#c3f400] animate-pulse"></span>
              <span className="font-['JetBrains_Mono'] text-xs text-[#c4c9ac] tracking-wider uppercase">
                MONETARY AUTHORITY OF SINGAPORE (MAS) TDSR/MSR COMPLIANT
              </span>
            </div>
          </div>

          {/* Nav Links Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 lg:gap-16">
            
            {/* Products Column */}
            <div className="flex flex-col gap-4">
              <span className="font-['JetBrains_Mono'] text-xs font-semibold text-white tracking-[0.15em] uppercase mb-1">
                Refinancing Matrix
              </span>
              <button 
                onClick={() => onNavigate('refinance')} 
                className="text-left font-['Geist'] text-sm text-[#c4c9ac] hover:text-[#c3f400] transition-colors cursor-pointer"
              >
                Refinance Protocol
              </button>
              <button 
                onClick={() => onNavigate('refinance')} 
                className="text-left font-['Geist'] text-sm text-[#c4c9ac] hover:text-[#c3f400] transition-colors cursor-pointer"
              >
                Repricing Arbitrage
              </button>
              <button 
                onClick={() => onNavigate('refinance')} 
                className="text-left font-['Geist'] text-sm text-[#c4c9ac] hover:text-[#c3f400] transition-colors cursor-pointer"
              >
                5-Quote Benchmarking
              </button>
            </div>

            {/* Architecture Column */}
            <div className="flex flex-col gap-4">
              <span className="font-['JetBrains_Mono'] text-xs font-semibold text-white tracking-[0.15em] uppercase mb-1">
                Methodology
              </span>
              <button 
                onClick={() => onNavigate('resources')} 
                className="text-left font-['Geist'] text-sm text-[#c4c9ac] hover:text-[#c3f400] transition-colors cursor-pointer"
              >
                The Refi Edge
              </button>
              <button 
                onClick={() => onNavigate('resources')} 
                className="text-left font-['Geist'] text-sm text-[#c4c9ac] hover:text-[#c3f400] transition-colors cursor-pointer"
              >
                Algorithmic Scanner
              </button>
              <button 
                onClick={onOpenSchedule} 
                className="text-left font-['Geist'] text-sm text-[#c4c9ac] hover:text-[#c3f400] transition-colors cursor-pointer"
              >
                Direct Comm Link
              </button>
              <a 
                href="#market-rates"
                onClick={(e) => { e.preventDefault(); onNavigate('refinance'); }}
                className="text-left font-['Geist'] text-sm text-[#c4c9ac] hover:text-[#c3f400] transition-colors cursor-pointer"
              >
                Live SORA Index
              </a>
            </div>

            {/* Legal Column */}
            <div className="flex flex-col gap-4 col-span-2 sm:col-span-1">
              <span className="font-['JetBrains_Mono'] text-xs font-semibold text-white tracking-[0.15em] uppercase mb-1">
                Governance
              </span>
              <span className="font-['Geist'] text-sm text-[#c4c9ac] hover:text-[#c3f400] transition-colors cursor-pointer">
                Privacy Framework
              </span>
              <span className="font-['Geist'] text-sm text-[#c4c9ac] hover:text-[#c3f400] transition-colors cursor-pointer">
                Licensing & Security
              </span>
              <span className="font-['Geist'] text-sm text-[#c4c9ac] hover:text-[#c3f400] transition-colors cursor-pointer">
                Cryptographic Audit
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Metadata Bar */}
        <div className="mt-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-[#c3f400]"></span>
            <span className="font-['JetBrains_Mono'] text-xs text-[#c4c9ac] tracking-wider uppercase">
              MARKET RATES UPDATED: RECENTLY // 15+ FINANCIAL INSTITUTIONS CONNECTED
            </span>
          </div>
          <div className="font-['JetBrains_Mono'] text-xs text-[#c4c9ac]/50 tracking-[0.3em] uppercase">
            SYS.REF.001 // PROTOCOL V.2.4
          </div>
        </div>

      </div>
    </footer>
  );
};
