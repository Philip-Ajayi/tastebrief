'use client';

import React from 'react';
import {
  Globe2,
  ShieldCheck,
  Terminal,
  KeyRound,
  AlertTriangle,
} from 'lucide-react';

interface HeaderProps {
  onOpenInspector: () => void;
  onOpenKeyModal: () => void;
  hasCustomKey: boolean;
  hasEnvKey: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenInspector,
  onOpenKeyModal,
  hasCustomKey,
  hasEnvKey,
}) => {
  const isConnected = hasCustomKey || hasEnvKey;

  return (
    <header className="sticky top-0 z-40 bg-[#F7F6F2]/95 backdrop-blur-xl border-b border-[#E8E7DF]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 h-[76px] flex items-center justify-between">

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#29382F] flex items-center justify-center">
            <Globe2 className="w-[21px] h-[21px] text-[#D1DDBB]" />
          </div>

          <div>
            <div className="font-display text-[22px] tracking-tight text-[#26332A] leading-none">
              TasteBrief
            </div>
            <p className="text-[10px] text-[#92948A] mt-1.5 hidden sm:block tracking-wide">
              Hospitality, with a better understanding of people.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">

          <div className={`hidden sm:flex items-center gap-2 px-3 py-2 rounded-full border text-[11px] font-medium ${
            isConnected
              ? 'bg-[#EFF3EA] border-[#DCE5D4] text-[#557148]'
              : 'bg-[#FBF0E9] border-[#EEDCD0] text-[#A56A45]'
          }`}>
            {isConnected ? (
              <ShieldCheck className="w-3.5 h-3.5" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5" />
            )}
            <span>{isConnected ? 'Connected' : 'Setup required'}</span>
          </div>

          <button
            onClick={onOpenInspector}
            title="View API activity"
            className="w-10 h-10 flex items-center justify-center rounded-xl border border-[#E5E5DC] bg-white text-[#72786C] hover:bg-[#F0F1EA] hover:text-[#354B3C] transition-all"
          >
            <Terminal className="w-[17px] h-[17px]" />
          </button>

          <button
            onClick={onOpenKeyModal}
            className="inline-flex items-center gap-2 px-3 sm:px-4 h-10 rounded-xl bg-[#354B3C] text-white text-xs font-semibold hover:bg-[#26392D] transition-colors"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>API settings</span>
          </button>
        </div>
      </div>
    </header>
  );
};