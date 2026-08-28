import React, { useState } from 'react';
import { QuotationPackage, LoanParameters } from '../types';
import { X, ShieldCheck, CheckCircle2, ArrowRight, KeyRound } from 'lucide-react';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPackage: QuotationPackage | null;
  loanParams: LoanParameters;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  isOpen,
  onClose,
  selectedPackage,
  loanParams
}) => {
  const [step, setStep] = useState<'singpass' | 'form' | 'success'>('singpass');
  const [applicantName, setApplicantName] = useState('Dr. Marcus Vance');
  const [applicantNric, setApplicantNric] = useState('S••••482A');
  const [applicantPhone, setApplicantPhone] = useState('+65 9123 4567');
  const [applicantEmail, setApplicantEmail] = useState('marcus.vance@assetmgmt.sg');
  const [monthlyIncome, setMonthlyIncome] = useState(16500);

  if (!isOpen) return null;

  const handleSingpassAuth = () => {
    setStep('form');
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('success');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#1e2020] border-2 border-[#c3f400] w-full max-w-xl p-6 lg:p-10 space-y-6 shadow-2xl text-[#e2e2e2] relative">
        
        <button
          onClick={onClose}
          className="absolute right-6 top-6 p-2 bg-[#121414] border border-[#333535] hover:border-[#c3f400] text-[#c4c9ac] hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* STEP 1: SINGPASS / DIGITAL AUTH */}
        {step === 'singpass' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#c3f400]" />
                <span className="font-['JetBrains_Mono'] text-xs text-[#c3f400] tracking-widest uppercase font-bold">
                  EXECUTION PROTOCOL // QUOTATION LOCK-IN
                </span>
              </div>
              <h2 className="font-['Syne'] text-2xl font-bold uppercase text-white">
                Initialize Institutional Lock-In
              </h2>
              <p className="font-['Geist'] text-sm text-[#c4c9ac]">
                Lock in {selectedPackage?.bankName} ({selectedPackage?.rateDisplay || `${selectedPackage?.nominalRate}%`}) on ${loanParams.outstandingPrinciple.toLocaleString()} with guaranteed legal subsidies.
              </p>
            </div>

            <div className="bg-[#121414] border border-[#333535] p-5 space-y-3 font-['JetBrains_Mono'] text-xs">
              <div className="flex justify-between">
                <span className="text-[#8e9379]">Target Institution:</span>
                <span className="text-white font-bold">{selectedPackage?.bankName || 'DBS Bank'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8e9379]">Rate Structure:</span>
                <span className="text-[#c3f400] font-bold">{selectedPackage?.rateDisplay}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8e9379]">Structure Type:</span>
                <span className="text-white font-bold">{selectedPackage?.rateType === 'fixed' ? `${selectedPackage.fixedTenureYears}Y Fixed Rate` : 'Floating (3M SORA)'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8e9379]">Tenure:</span>
                <span className="text-white font-bold">{loanParams.remainingTenureYears} Years</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                onClick={handleSingpassAuth}
                className="w-full bg-[#e1251b] hover:bg-[#c91e14] text-white font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-wider py-4 flex items-center justify-center gap-3 transition-all cursor-pointer shadow-lg"
              >
                <KeyRound className="w-5 h-5" />
                <span>Retrieve Verified Credentials via Singpass</span>
              </button>

              <button
                onClick={() => setStep('form')}
                className="w-full bg-transparent hover:bg-[#121414] text-[#c4c9ac] border border-[#444933] font-['JetBrains_Mono'] text-xs uppercase py-3 cursor-pointer"
              >
                Continue with Manual Verification
              </button>
            </div>

            <div className="text-[11px] font-['Geist'] text-[#8e9379] text-center">
              🔒 256-bit encrypted direct connection to Government MyInfo API. Zero credit score impact.
            </div>
          </div>
        )}

        {/* STEP 2: REVIEW & SUBMISSION FORM */}
        {step === 'form' && (
          <form onSubmit={handleSubmitApplication} className="space-y-5">
            <div className="space-y-1">
              <span className="font-['JetBrains_Mono'] text-xs text-[#c3f400] font-bold uppercase tracking-wider">
                CONFIRM APPLICATION CREDENTIALS
              </span>
              <h3 className="font-['Syne'] text-xl font-bold uppercase text-white">
                Applicant Information
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-['JetBrains_Mono'] text-xs">
              <div className="space-y-1">
                <label className="text-[#c4c9ac] uppercase">Full Name</label>
                <input
                  type="text"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  className="w-full bg-[#121414] border border-[#444933] p-2.5 text-white focus:border-[#c3f400] focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#c4c9ac] uppercase">NRIC / FIN</label>
                <input
                  type="text"
                  value={applicantNric}
                  onChange={(e) => setApplicantNric(e.target.value)}
                  className="w-full bg-[#121414] border border-[#444933] p-2.5 text-white focus:border-[#c3f400] focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#c4c9ac] uppercase">Mobile Number</label>
                <input
                  type="text"
                  value={applicantPhone}
                  onChange={(e) => setApplicantPhone(e.target.value)}
                  className="w-full bg-[#121414] border border-[#444933] p-2.5 text-white focus:border-[#c3f400] focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#c4c9ac] uppercase">Monthly Gross Income</label>
                <input
                  type="number"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                  className="w-full bg-[#121414] border border-[#444933] p-2.5 text-white focus:border-[#c3f400] focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="bg-[#121414] border border-[#333535] p-3 text-xs font-['Geist'] text-[#c4c9ac]">
              ✓ Legal subsidy voucher (${selectedPackage?.legalSubsidy || 2500}) automatically assigned to conveyancing panel.
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep('singpass')}
                className="font-['JetBrains_Mono'] text-xs text-[#c4c9ac] px-4 py-2 hover:text-white"
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-[#c3f400] text-[#161e00] font-['JetBrains_Mono'] text-xs font-bold uppercase px-6 py-3 hover:bg-white transition-colors cursor-pointer"
              >
                Submit Protocol Application →
              </button>
            </div>
          </form>
        )}

        {/* STEP 3: SUCCESS PROTOCOL ACTIVE */}
        {step === 'success' && (
          <div className="space-y-6 text-center py-4">
            <div className="w-16 h-16 bg-[#c3f400] mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-[#161e00]" />
            </div>

            <div className="space-y-2">
              <span className="font-['JetBrains_Mono'] text-xs text-[#c3f400] font-bold uppercase tracking-widest">
                PROTOCOL EXECUTED // TXN_CONFIRMED
              </span>
              <h2 className="font-['Syne'] text-2xl sm:text-3xl font-extrabold uppercase text-white">
                Application Successfully Logged
              </h2>
              <p className="font-['Geist'] text-sm text-[#c4c9ac] max-w-md mx-auto">
                Reference ID: <strong className="text-white font-['JetBrains_Mono']">REFI-2026-TXN-9021</strong>
              </p>
            </div>

            <div className="bg-[#121414] border border-[#333535] p-5 text-left font-['JetBrains_Mono'] text-xs space-y-2 max-w-md mx-auto">
              <div className="flex justify-between">
                <span className="text-[#8e9379]">Assigned Concierge:</span>
                <span className="text-white font-bold">Marcus Vance (Credit Desk Lead)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8e9379]">Bank Turnaround Target:</span>
                <span className="text-[#c3f400] font-bold">24-48 Hours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8e9379]">Conveyancing Legal Firm:</span>
                <span className="text-white">RHT Law / WongPartnership</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="bg-[#c3f400] hover:bg-white text-[#161e00] font-['JetBrains_Mono'] text-xs font-bold uppercase tracking-wider px-8 py-3.5 cursor-pointer transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
