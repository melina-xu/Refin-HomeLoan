import React, { useState } from 'react';
import { X, Lock, User, KeyRound, ShieldCheck, Check } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [role, setRole] = useState<'client' | 'broker'>('client');
  const [email, setEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setTimeout(() => {
      setIsLoggedIn(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#1e2020] border-2 border-[#444933] w-full max-w-md p-6 lg:p-8 space-y-6 shadow-2xl text-[#e2e2e2] relative">
        
        <button
          onClick={onClose}
          className="absolute right-6 top-6 p-2 bg-[#121414] border border-[#333535] hover:border-[#c3f400] text-[#c4c9ac] hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#c3f400]" />
            <span className="font-['JetBrains_Mono'] text-xs text-[#c3f400] tracking-widest uppercase font-bold">
              SYS.AUTH.GATEWAY
            </span>
          </div>
          <h2 className="font-['Syne'] text-2xl font-bold uppercase text-white">
            Access Refi Portal
          </h2>
        </div>

        {/* Role Toggle */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setRole('client')}
            className={`py-2 px-3 font-['JetBrains_Mono'] text-xs uppercase text-center border transition-all cursor-pointer ${
              role === 'client'
                ? 'bg-[#c3f400] text-[#161e00] font-bold border-[#c3f400]'
                : 'bg-[#121414] text-[#c4c9ac] border-[#333535]'
            }`}
          >
            Borrower / Investor
          </button>
          <button
            type="button"
            onClick={() => setRole('broker')}
            className={`py-2 px-3 font-['JetBrains_Mono'] text-xs uppercase text-center border transition-all cursor-pointer ${
              role === 'broker'
                ? 'bg-[#c3f400] text-[#161e00] font-bold border-[#c3f400]'
                : 'bg-[#121414] text-[#c4c9ac] border-[#333535]'
            }`}
          >
            B2B Broker Portal
          </button>
        </div>

        {!isLoggedIn ? (
          <form onSubmit={handleLogin} className="space-y-4 font-['JetBrains_Mono'] text-xs">
            <div className="space-y-1">
              <label className="text-[#c4c9ac] uppercase">Email / Account ID</label>
              <input
                type="email"
                required
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#121414] border border-[#444933] p-2.5 text-white focus:border-[#c3f400] focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[#c4c9ac] uppercase">Passcode / Cryptographic Token</label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                className="w-full bg-[#121414] border border-[#444933] p-2.5 text-white focus:border-[#c3f400] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#c3f400] hover:bg-white text-[#161e00] font-bold uppercase tracking-wider py-3 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <KeyRound className="w-4 h-4" />
              <span>Authenticate Session</span>
            </button>
          </form>
        ) : (
          <div className="text-center py-6 space-y-2">
            <div className="w-10 h-10 bg-[#c3f400] text-[#161e00] flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <div className="font-['Syne'] text-lg font-bold text-white uppercase">
              Session Authenticated
            </div>
            <p className="font-['Geist'] text-xs text-[#c4c9ac]">
              Loading customized portfolio parameters...
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
