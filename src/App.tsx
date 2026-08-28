import React, { useState } from 'react';
import { ActiveTab, LoanParameters, QuotationPackage, PropertyType } from './types';
import { DEFAULT_LOAN_PARAMS, DEFAULT_QUOTATION_PACKAGES } from './data/mockRates';
import { Header } from './components/Header';
import { PropertySelectorScreen } from './components/PropertySelectorScreen';
import { ProjectedAlphaScreen } from './components/ProjectedAlphaScreen';
import { MethodologyScreen } from './components/MethodologyScreen';
import { DisqusComments } from './components/DisqusComments';
import { Footer } from './components/Footer';

// Modals
import { RecalibrateDrawer } from './components/RecalibrateDrawer';
import { ArchitectureComparisonModal } from './components/ArchitectureComparisonModal';
import { ApplicationModal } from './components/ApplicationModal';
import { ScheduleCallModal } from './components/ScheduleCallModal';
import { LoginModal } from './components/LoginModal';

export function App() {
  // Core Navigation State (Streamlined to Refinance/Repricing & Methodology)
  const [activeTab, setActiveTab] = useState<ActiveTab>('refinance');
  const [refinanceSubView, setRefinanceSubView] = useState<'selector' | 'alpha'>('alpha');

  // Step 1: Current Loan Parameters State
  const [loanParams, setLoanParams] = useState<LoanParameters>(DEFAULT_LOAN_PARAMS);

  // Step 2: Quotations Obtained State (Max 5 packages)
  const [quotations, setQuotations] = useState<QuotationPackage[]>(DEFAULT_QUOTATION_PACKAGES);

  // Modals State
  const [isRecalibrateOpen, setIsRecalibrateOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [selectedComparePackage, setSelectedComparePackage] = useState<QuotationPackage | null>(null);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  const [selectedApplicationPackage, setSelectedApplicationPackage] = useState<QuotationPackage | null>(DEFAULT_QUOTATION_PACKAGES[0]);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Actions
  const handleSelectPropertyType = (propertyType: PropertyType) => {
    setLoanParams(prev => ({ ...prev, propertyType }));
    setRefinanceSubView('alpha');
    setActiveTab('refinance');
  };

  const handleApplyPackage = (pkg: QuotationPackage) => {
    setSelectedApplicationPackage(pkg);
    setIsApplicationModalOpen(true);
  };

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello Refi Specialist, I would like to explore optimizing my $${loanParams.outstandingPrinciple.toLocaleString()} ${loanParams.propertyType} mortgage currently at ${loanParams.currentInterestRate.toFixed(2)}%.`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#121414] text-[#e2e2e2] flex flex-col justify-between selection:bg-[#c3f400] selection:text-[#161e00]">
      
      {/* Top Fixed Header with Streamlined Scope */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'refinance') {
            setRefinanceSubView('alpha');
          }
        }}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onGetStarted={() => {
          setActiveTab('refinance');
          setRefinanceSubView('alpha');
        }}
      />

      {/* Main View Area */}
      <main className="flex-1 pt-20">
        
        {/* VIEW 1: REFINANCING & REPRICING ARBITRAGE PROTOCOL */}
        {activeTab === 'refinance' && (
          <div>
            {refinanceSubView === 'selector' ? (
              <PropertySelectorScreen
                loanParams={loanParams}
                setLoanParams={setLoanParams}
                onSelectAndContinue={handleSelectPropertyType}
                onOpenMethodology={() => setActiveTab('resources')}
              />
            ) : (
              <div>
                {/* Secondary navigation bar */}
                <div className="max-w-[1280px] mx-auto px-6 lg:px-16 pt-6 flex justify-between items-center text-xs font-['JetBrains_Mono']">
                  <button
                    onClick={() => setRefinanceSubView('selector')}
                    className="text-[#c4c9ac] hover:text-[#c3f400] transition-colors flex items-center gap-1.5 uppercase cursor-pointer"
                  >
                    <span>← Property Type Ingress Selector</span>
                  </button>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#c3f400] animate-pulse"></span>
                    <span className="text-[#8e9379]">SYS.REFI.PROTOCOL.ONLINE</span>
                  </div>
                </div>

                {/* 4-Step Interactive Refinancing / Repricing Workflow Screen */}
                <ProjectedAlphaScreen
                  loanParams={loanParams}
                  setLoanParams={setLoanParams}
                  quotations={quotations}
                  setQuotations={setQuotations}
                  onOpenRecalibrate={() => setIsRecalibrateOpen(true)}
                  onApplyPackage={handleApplyPackage}
                  onViewMethodology={() => setActiveTab('resources')}
                  onNavigateToSchedule={() => setIsScheduleModalOpen(true)}
                />
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: METHODOLOGY & PROTOCOL */}
        {activeTab === 'resources' && (
          <MethodologyScreen
            onOpenSchedule={() => setIsScheduleModalOpen(true)}
            onOpenWhatsApp={handleOpenWhatsApp}
          />
        )}

        {/* Community Discussion & Inquiries via Disqus */}
        <DisqusComments pageIdentifier={`refin-homeloan-${activeTab}`} />

      </main>

      {/* Footer */}
      <Footer
        onNavigate={(tab) => {
          setActiveTab(tab);
          if (tab === 'refinance') setRefinanceSubView('alpha');
        }}
        onOpenSchedule={() => setIsScheduleModalOpen(true)}
      />

      {/* Interactive Modals & Drawers */}
      <RecalibrateDrawer
        isOpen={isRecalibrateOpen}
        onClose={() => setIsRecalibrateOpen(false)}
        loanParams={loanParams}
        onSaveParams={(newParams) => setLoanParams(newParams)}
      />

      <ArchitectureComparisonModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        selectedPackage={selectedComparePackage}
        allPackages={quotations}
        loanParams={loanParams}
        onApplyPackage={handleApplyPackage}
      />

      <ApplicationModal
        isOpen={isApplicationModalOpen}
        onClose={() => setIsApplicationModalOpen(false)}
        selectedPackage={selectedApplicationPackage}
        loanParams={loanParams}
      />

      <ScheduleCallModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

    </div>
  );
}

export default App;
