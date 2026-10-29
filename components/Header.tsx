'use client';

import React from 'react';
import { Globe2, ShieldCheck, Terminal, KeyRound } from 'lucide-react';

interface HeaderProps {
  onOpenInspector: () => void;
  onOpenKeyModal: () => void;
  hasCustomKey: boolean;
  isDemoMode: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenInspector,
  onOpenKeyModal,
  hasCustomKey,
  isDemoMode,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-surface-border bg-background/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-purple-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
            <Globe2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xl tracking-tight text-white">TasteBrief</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-400 border border-brand-500/30">
                QLOO v2 INSIGHTS
              </span>
            </div>
            <p className="text-xs text-gray-400 hidden sm:block">
              Cross-Border Inbound Taste Intelligence for Independent Hospitality
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Status Badge */}
          <div
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-mono border ${
              isDemoMode && !hasCustomKey
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{hasCustomKey ? 'LIVE API KEY' : isDemoMode ? 'HIGH-FIDELITY DEMO' : 'LIVE PRODUCTION'}</span>
          </div>

          {/* Network Inspector Trigger */}
          <button
            onClick={onOpenInspector}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-surface-elevated text-xs font-mono text-gray-300 border border-surface-border transition-colors"
            title="Inspect Live Qloo Network Requests"
          >
            <Terminal className="w-3.5 h-3.5 text-brand-400" />
            <span className="hidden md:inline">Inspect API Logs</span>
          </button>

          {/* API Key Modal Trigger */}
          <button
            onClick={onOpenKeyModal}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-xs font-semibold text-white transition-colors shadow-sm"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>API Keys</span>
          </button>
        </div>
      </div>
    </header>
  );
};
