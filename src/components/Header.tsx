import React from 'react';
import { ActiveTab } from '../types';
import { Landmark, User, Menu, X, ArrowUpRight } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenLogin: () => void;
  onGetStarted: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenLogin,
  onGetStarted
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="fixed top-0 w-full z-50 bg-[#121414]/95 backdrop-blur-md border-b border-[#444933]/60">
      <div className="h-20 max-w-[1280px] mx-auto px-6 lg:px-16 flex items-center justify-between">
        
        {/* Left: Brand Logo & Navigation */}
        <div className="flex items-center gap-8 lg:gap-12">
          {/* Logo */}
          <button 
            onClick={() => setActiveTab('refinance')}
            className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
            id="brand-logo-btn"
          >
            <div className="w-10 h-10 bg-[#c3f400] flex items-center justify-center transition-transform group-hover:scale-105 duration-200">
              <Landmark className="w-6 h-6 text-[#161e00]" strokeWidth={2.2} />
            </div>
            <span className="font-['Syne'] text-[32px] font-bold tracking-tighter text-[#ffffff] uppercase leading-none">
              Refi.
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <button
              onClick={() => setActiveTab('refinance')}
              className={`font-['JetBrains_Mono'] text-[12px] tracking-[0.2em] uppercase transition-all py-1 cursor-pointer ${
                activeTab === 'refinance'
                  ? 'text-[#c3f400] underline decoration-2 underline-offset-8 font-semibold'
                  : 'text-[#c4c9ac] hover:text-[#c3f400]'
              }`}
              id="nav-refinance"
            >
              Refinance & Reprice
            </button>

            <button
              onClick={() => setActiveTab('resources')}
              className={`font-['JetBrains_Mono'] text-[12px] tracking-[0.2em] uppercase transition-all py-1 cursor-pointer ${
                activeTab === 'resources'
                  ? 'text-[#c3f400] underline decoration-2 underline-offset-8 font-semibold'
                  : 'text-[#c4c9ac] hover:text-[#c3f400]'
              }`}
              id="nav-methodology"
            >
              Methodology
            </button>
          </nav>
        </div>

        {/* Right: Login & Get Started */}
        <div className="flex items-center gap-3 lg:gap-4">
          
          <button
            onClick={onOpenLogin}
            className="font-['JetBrains_Mono'] text-[12px] tracking-[0.1em] px-3 py-2 text-[#e2e2e2] hover:text-[#c3f400] transition-colors uppercase font-medium cursor-pointer"
            id="header-login-btn"
          >
            LOGIN
          </button>

          <button
            onClick={onGetStarted}
            className="bg-[#c3f400] text-[#161e00] font-['JetBrains_Mono'] text-[12px] tracking-[0.1em] px-5 py-2.5 font-bold hover:bg-white transition-all uppercase flex items-center gap-1.5 cursor-pointer shadow-md"
            id="header-get-started-btn"
          >
            <span>Compare Quotes</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenLogin}
            className="w-9 h-9 bg-white flex items-center justify-center ml-1 text-[#283500] hover:bg-[#c3f400] transition-colors cursor-pointer"
            title="User Account"
            id="header-avatar-btn"
          >
            <User className="w-5 h-5" />
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#e2e2e2] hover:text-[#c3f400] focus:outline-none"
            aria-label="Toggle Navigation"
            id="mobile-menu-toggle"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#121414] border-b border-[#444933] px-6 py-6 space-y-4">
          <div className="flex flex-col gap-4">
            <button
              onClick={() => { setActiveTab('refinance'); setMobileMenuOpen(false); }}
              className={`text-left font-['JetBrains_Mono'] text-sm tracking-wider uppercase py-2 ${
                activeTab === 'refinance' ? 'text-[#c3f400] font-bold' : 'text-[#c4c9ac]'
              }`}
            >
              01 // Refinance & Reprice Comparison
            </button>
            <button
              onClick={() => { setActiveTab('resources'); setMobileMenuOpen(false); }}
              className={`text-left font-['JetBrains_Mono'] text-sm tracking-wider uppercase py-2 ${
                activeTab === 'resources' ? 'text-[#c3f400] font-bold' : 'text-[#c4c9ac]'
              }`}
            >
              02 // Methodology & Protocol
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
