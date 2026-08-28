import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Terminal, 
  MessageSquare, 
  PhoneCall, 
  ArrowUpRight, 
  CheckCircle2, 
  Sparkles, 
  TrendingDown, 
  Clock, 
  Radio, 
  Cpu, 
  Lock, 
  FileCheck,
  Building2,
  ExternalLink
} from 'lucide-react';

interface MethodologyScreenProps {
  onOpenSchedule: () => void;
  onOpenWhatsApp: () => void;
}

export const MethodologyScreen: React.FC<MethodologyScreenProps> = ({
  onOpenSchedule,
  onOpenWhatsApp
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [tickerIndex, setTickerIndex] = useState(0);

  const LIVE_TICKERS = [
    { bank: 'DBS BANK', rate: '2.85% FIXED', delta: '-0.10% (Live)', status: 'ACTIVE' },
    { bank: 'OCBC BANK', rate: '3.05% SORA+0.60', delta: '-0.05% (Live)', status: 'ACTIVE' },
    { bank: 'UOB BANK', rate: '2.95% FIXED', delta: '-0.15% (Live)', status: 'OPTIMAL' },
    { bank: 'HSBC PREMIER', rate: '2.80% GREEN', delta: '-0.20% (Live)', status: 'ACTIVE' },
    { bank: 'SCB PRIVATE', rate: '2.98% OFFSET', delta: '-0.08% (Live)', status: 'ACTIVE' },
    { bank: 'MAYBANK SG', rate: '2.90% FIXED', delta: '-0.12% (Live)', status: 'ACTIVE' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % LIVE_TICKERS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [LIVE_TICKERS.length]);

  return (
    <div className="w-full min-h-[calc(100vh-80px)] py-12 lg:py-20 text-[#e2e2e2]">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-16 space-y-16">
        
        {/* Top Header */}
        <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6 border-b border-[#444933]/60 pb-8">
          <div className="space-y-2">
            <span className="font-['JetBrains_Mono'] text-xs uppercase tracking-[0.25em] text-[#c3f400] font-semibold">
              METHODOLOGY & ARCHITECTURE
            </span>
            <h1 className="font-['Syne'] text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight text-white">
              The Refi Edge<span className="text-[#c3f400]">.</span>
            </h1>
            <p className="font-['Geist'] text-base sm:text-lg text-[#c4c9ac] max-w-2xl">
              We stripped away the bureaucracy of traditional banking to deliver a hyper-optimized, algorithmic path to mortgage rate reduction.
            </p>
          </div>

          <div className="bg-[#1e2020] border border-[#333535] px-5 py-3.5 flex items-center gap-3">
            <Clock className="w-5 h-5 text-[#c3f400]" />
            <div className="font-['JetBrains_Mono'] text-xs">
              <span className="text-[#8e9379] block">AVERAGE TIME TO APPROVAL</span>
              <span className="text-white font-bold text-sm">48 Hours (Turnkey Protocol)</span>
            </div>
          </div>
        </div>

        {/* 4-Step Interactive Process Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left: 4 Steps Accordion / Timeline */}
          <div className="space-y-4">
            <span className="font-['JetBrains_Mono'] text-xs text-[#c3f400] uppercase tracking-[0.2em] font-semibold block mb-2">
              THE 4-STEP ALGORITHMIC PIPELINE
            </span>

            {/* Step 1 */}
            <div
              onClick={() => setActiveStep(1)}
              className={`border p-6 transition-all duration-200 cursor-pointer ${
                activeStep === 1
                  ? 'bg-[#1e2020] border-[#c3f400]'
                  : 'bg-[#1a1c1c] border-[#333535] hover:border-[#444933]'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="font-['JetBrains_Mono'] text-xs text-[#c3f400] font-bold tracking-widest uppercase">
                    STEP 01
                  </span>
                  <h3 className="font-['Syne'] text-xl font-bold uppercase text-white">
                    Data Ingress
                  </h3>
                </div>
                <div className="w-8 h-8 bg-[#121414] border border-[#444933] flex items-center justify-center font-['JetBrains_Mono'] text-xs text-[#c3f400]">
                  01
                </div>
              </div>
              <p className="font-['Geist'] text-sm text-[#c4c9ac] mt-3 leading-relaxed">
                Input your property coordinates and existing liability structure. Zero friction, zero physical document upload at inception.
              </p>
              {activeStep === 1 && (
                <div className="mt-4 pt-4 border-t border-[#333535] flex items-center justify-between text-xs font-['JetBrains_Mono'] text-[#8e9379]">
                  <span>Status: Immediate Simulation</span>
                  <span className="text-[#c3f400]">Time: ~60 Seconds</span>
                </div>
              )}
            </div>

            {/* Step 2 */}
            <div
              onClick={() => setActiveStep(2)}
              className={`border p-6 transition-all duration-200 cursor-pointer ${
                activeStep === 2
                  ? 'bg-[#1e2020] border-[#c3f400]'
                  : 'bg-[#1a1c1c] border-[#333535] hover:border-[#444933]'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="font-['JetBrains_Mono'] text-xs text-[#c3f400] font-bold tracking-widest uppercase">
                    STEP 02
                  </span>
                  <h3 className="font-['Syne'] text-xl font-bold uppercase text-white">
                    Algorithmic Scan
                  </h3>
                </div>
                <div className="w-8 h-8 bg-[#121414] border border-[#444933] flex items-center justify-center font-['JetBrains_Mono'] text-xs text-[#c3f400]">
                  02
                </div>
              </div>
              <p className="font-['Geist'] text-sm text-[#c4c9ac] mt-3 leading-relaxed">
                Proprietary scraping across 15+ tier-1 institutions. Identifying asymmetric rate anomalies and unpublished broker concessions.
              </p>
              {activeStep === 2 && (
                <div className="mt-4 pt-4 border-t border-[#333535] flex items-center justify-between text-xs font-['JetBrains_Mono'] text-[#8e9379]">
                  <span>Radar: 15+ Banks Active</span>
                  <span className="text-[#c3f400]">Frequency: Real-Time SORA</span>
                </div>
              )}
            </div>

            {/* Step 3 */}
            <div
              onClick={() => setActiveStep(3)}
              className={`border p-6 transition-all duration-200 cursor-pointer ${
                activeStep === 3
                  ? 'bg-[#1e2020] border-[#c3f400]'
                  : 'bg-[#1a1c1c] border-[#333535] hover:border-[#444933]'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="font-['JetBrains_Mono'] text-xs text-[#c3f400] font-bold tracking-widest uppercase">
                    STEP 03
                  </span>
                  <h3 className="font-['Syne'] text-xl font-bold uppercase text-white">
                    Human Validation
                  </h3>
                </div>
                <div className="w-8 h-8 bg-[#121414] border border-[#444933] flex items-center justify-center font-['JetBrains_Mono'] text-xs text-[#c3f400]">
                  03
                </div>
              </div>
              <p className="font-['Geist'] text-sm text-[#c4c9ac] mt-3 leading-relaxed">
                Senior mortgage specialists review the quantitative output, factoring in macro trends and unadvertised institutional appetite.
              </p>
              {activeStep === 3 && (
                <div className="mt-4 pt-4 border-t border-[#333535] flex items-center justify-between text-xs font-['JetBrains_Mono'] text-[#8e9379]">
                  <span>Reviewer: Tier-1 Credit Desk</span>
                  <span className="text-[#c3f400]">Check: TDSR & Legal Subsidies</span>
                </div>
              )}
            </div>

            {/* Step 4 */}
            <div
              onClick={() => setActiveStep(4)}
              className={`border p-6 transition-all duration-200 cursor-pointer ${
                activeStep === 4
                  ? 'bg-[#1e2020] border-[#c3f400]'
                  : 'bg-[#1a1c1c] border-[#333535] hover:border-[#444933]'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="font-['JetBrains_Mono'] text-xs text-[#c3f400] font-bold tracking-widest uppercase">
                    STEP 04
                  </span>
                  <h3 className="font-['Syne'] text-xl font-bold uppercase text-white">
                    Execution Protocol
                  </h3>
                </div>
                <div className="w-8 h-8 bg-[#121414] border border-[#444933] flex items-center justify-center font-['JetBrains_Mono'] text-xs text-[#c3f400]">
                  04
                </div>
              </div>
              <p className="font-['Geist'] text-sm text-[#c4c9ac] mt-3 leading-relaxed">
                Digital signing, zero branch visits. Your dedicated concierge handles legal subsidy coordination and bank discharge filings seamlessly.
              </p>
              {activeStep === 4 && (
                <div className="mt-4 pt-4 border-t border-[#333535] flex items-center justify-between text-xs font-['JetBrains_Mono'] text-[#8e9379]">
                  <span>Paperwork: 100% Digital via Singpass</span>
                  <span className="text-[#c3f400]">Result: Full Legal Offset</span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Live Interactive Terminal HUD */}
          <div className="bg-[#0c0f0f] border-2 border-[#444933] p-6 lg:p-8 space-y-6 shadow-2xl relative">
            
            {/* Terminal Header */}
            <div className="flex items-center justify-between border-b border-[#333535] pb-4">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#c3f400]" />
                <span className="font-['JetBrains_Mono'] text-xs text-white font-bold tracking-widest uppercase">
                  SYS_V.2.4 // RADAR HUD
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#c3f400] animate-ping"></span>
                <span className="font-['JetBrains_Mono'] text-[11px] text-[#c3f400] uppercase tracking-wider">
                  SCANNING LIVE RATES
                </span>
              </div>
            </div>

            {/* Radar Feed Graphic */}
            <div className="bg-[#121414] border border-[#333535] p-5 space-y-4 font-['JetBrains_Mono'] text-xs">
              <div className="flex justify-between text-[#8e9379] border-b border-[#333535] pb-2">
                <span>INSTITUTION</span>
                <span>RATE ARCHITECTURE</span>
                <span>DELTA</span>
              </div>

              {LIVE_TICKERS.map((item, idx) => (
                <div 
                  key={idx}
                  className={`flex justify-between items-center py-1.5 transition-all ${
                    idx === tickerIndex ? 'text-[#c3f400] font-bold bg-[#1e2020] px-2' : 'text-[#c4c9ac]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 ${idx === tickerIndex ? 'bg-[#c3f400]' : 'bg-[#444933]'}`}></span>
                    {item.bank}
                  </span>
                  <span>{item.rate}</span>
                  <span className="text-[#c3f400]">{item.delta}</span>
                </div>
              ))}
            </div>

            {/* Precision in Practice Points */}
            <div className="space-y-3 pt-2">
              <span className="font-['JetBrains_Mono'] text-xs font-semibold text-white tracking-widest uppercase block">
                Precision In Practice:
              </span>
              
              <div className="space-y-2 font-['Geist'] text-xs text-[#c4c9ac]">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#c3f400] shrink-0 mt-0.5" />
                  <span>Real-time SORA rate feeds refreshed continuously from MAS and interbank benchmarks.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#c3f400] shrink-0 mt-0.5" />
                  <span>Automated legal subsidy and clawback penalty offset algorithms built into every quote.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#c3f400] shrink-0 mt-0.5" />
                  <span>Direct Singpass MyInfo verification bypasses manual pay-slip submission delays.</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Testimonial Section with Brutalist Aesthetics */}
        <div className="bg-[#1e2020] border border-[#333535] p-8 lg:p-12 relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center gap-2">
                <span className="font-['JetBrains_Mono'] text-xs text-[#c3f400] tracking-[0.2em] uppercase font-bold">
                  VERIFIED PROTOCOL OUTCOME
                </span>
              </div>

              <blockquote className="font-['Syne'] text-xl sm:text-2xl lg:text-3xl text-white font-bold leading-tight">
                "The traditional process felt archaic. Refi's interface is a brutalist masterpiece of efficiency. We restructured our debt in a fraction of the time, with absolute transparency on the spread."
              </blockquote>

              <div className="flex items-center gap-4 pt-2">
                <div className="w-12 h-12 bg-[#38393a] border border-[#444933] flex items-center justify-center font-['JetBrains_Mono'] font-bold text-[#c3f400]">
                  JD
                </div>
                <div>
                  <div className="font-['Syne'] text-base font-bold text-white uppercase">
                    Julian Drake
                  </div>
                  <div className="font-['Geist'] text-xs text-[#c4c9ac]">
                    Senior Partner, Drake & Sterling Asset Management
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial Metric Card */}
            <div className="bg-[#121414] border border-[#444933] p-6 lg:p-8 flex flex-col justify-between space-y-6">
              <div>
                <span className="font-['JetBrains_Mono'] text-xs text-[#8e9379] uppercase tracking-wider block">
                  Liquidity Unlocked
                </span>
                <div className="font-['JetBrains_Mono'] text-4xl font-extrabold text-[#c3f400] tracking-tight mt-1">
                  +$4,200
                </div>
                <span className="font-['JetBrains_Mono'] text-xs text-[#c4c9ac] uppercase block mt-0.5">
                  Annual Interest Repayment Reduction
                </span>
              </div>

              <div className="space-y-1.5 pt-4 border-t border-[#333535]">
                <div className="flex justify-between text-xs font-['JetBrains_Mono']">
                  <span className="text-[#8e9379]">Previous Rate:</span>
                  <span className="text-white">4.30% Fixed</span>
                </div>
                <div className="flex justify-between text-xs font-['JetBrains_Mono']">
                  <span className="text-[#8e9379]">Refi Structure:</span>
                  <span className="text-[#c3f400]">2.85% 2Y Fixed</span>
                </div>
                <div className="flex justify-between text-xs font-['JetBrains_Mono']">
                  <span className="text-[#8e9379]">Execution Speed:</span>
                  <span className="text-white">36 Hours</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Direct Comm Link CTA Section */}
        <div className="bg-[#1a1c1c] border-2 border-[#c3f400]/50 p-8 lg:p-12">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
            
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-[#c3f400] animate-pulse" />
                <span className="font-['JetBrains_Mono'] text-xs font-bold text-[#c3f400] uppercase tracking-widest">
                  DIRECT COMM LINK
                </span>
              </div>
              <h2 className="font-['Syne'] text-2xl sm:text-3xl lg:text-4xl font-bold uppercase text-white tracking-tight">
                Engage Senior Debt Architects
              </h2>
              <p className="font-['Geist'] text-sm sm:text-base text-[#c4c9ac] leading-relaxed">
                Need a bespoke structure for complex corporate holding entities, multi-property portfolios, or trust funds? Initialize an encrypted comms channel with our senior debt architects.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
              <button
                onClick={onOpenWhatsApp}
                className="bg-[#c3f400] hover:bg-white text-[#161e00] font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-wider px-6 py-3.5 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
                id="btn-methodology-whatsapp"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Us</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenSchedule}
                className="bg-transparent hover:bg-[#333535] text-white border border-[#444933] font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-wider px-6 py-3.5 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                id="btn-methodology-schedule"
              >
                <PhoneCall className="w-4 h-4 text-[#c3f400]" />
                <span>Schedule Call</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
