'use client';

import React from 'react';
import { ActionMemo } from '@/types';
import { Printer, Download, Sparkles, CheckCircle, FileText } from 'lucide-react';

interface ActionMemoViewProps {
  memo: ActionMemo;
}

export const ActionMemoView: React.FC<ActionMemoViewProps> = ({ memo }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(memo, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `TasteBrief-ActionMemo-${memo.destinationCity}-${memo.originCity}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="bg-surface rounded-2xl border border-surface-border p-6 sm:p-8 shadow-2xl relative print:bg-white print:text-black print:border-none print:shadow-none">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-surface-border gap-4 print:border-black">
        <div>
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-brand-400 print:text-black" />
            <h2 className="text-xl font-bold text-white print:text-black">
              Venue Programming Action Memo
            </h2>
          </div>
          <p className="text-xs text-gray-400 print:text-gray-600 mt-1 font-mono">
            Target Market: {memo.destinationCity} Venue Operations ↔ {memo.originCity} Visitor Inbound
          </p>
        </div>

        <div className="flex items-center space-x-2 print:hidden">
          <button
            onClick={handleDownloadJson}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-surface-elevated hover:bg-gray-700 text-xs text-gray-300 border border-surface-border transition-colors font-mono"
          >
            <Download className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-xs font-semibold text-white transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print 1-Page Memo</span>
          </button>
        </div>
      </div>

      {/* Memo Meta */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-b border-surface-border/60 text-xs font-mono print:border-gray-300">
        <div>
          <span className="text-gray-500 block">DESTINATION</span>
          <span className="text-white print:text-black font-semibold">{memo.destinationCity}</span>
        </div>
        <div>
          <span className="text-gray-500 block">INBOUND SIGNAL</span>
          <span className="text-brand-400 print:text-black font-semibold">{memo.originCity}</span>
        </div>
        <div>
          <span className="text-gray-500 block">CONCEPT TYPE</span>
          <span className="text-white print:text-black font-semibold capitalize">{memo.venueType}</span>
        </div>
        <div>
          <span className="text-gray-500 block">ENGINE</span>
          <span className="text-emerald-400 print:text-black font-semibold truncate block">
            {memo.engineUsed}
          </span>
        </div>
      </div>

      {/* Body Content */}
      <div className="py-6 space-y-6 text-sm">
        {/* Executive Summary */}
        <div>
          <h4 className="text-xs font-mono uppercase text-gray-400 print:text-gray-700 tracking-wider mb-2">
            Executive Summary
          </h4>
          <p className="text-gray-200 print:text-black leading-relaxed font-sans bg-surface-elevated/30 print:bg-transparent p-4 rounded-xl border border-surface-border/40 print:border-none">
            {memo.executiveSummary}
          </p>
        </div>

        {/* Operational Adjustments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Beverage & Culinary Adjustments */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase text-brand-400 print:text-black tracking-wider flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              Beverage & Menu Pivots
            </h4>
            <ul className="space-y-2 text-xs text-gray-300 print:text-gray-800">
              {memo.beverageAdjustments.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-brand-500 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Spatial & Aesthetic Programming */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase text-accent-emerald print:text-black tracking-wider flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5" />
              Spatial & Atmosphere Alignment
            </h4>
            <ul className="space-y-2 text-xs text-gray-300 print:text-gray-800">
              {memo.spatialAtmosphere.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-accent-emerald font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Music Programming Slots */}
        <div className="p-4 rounded-xl bg-surface-elevated/40 print:bg-gray-100 border border-surface-border print:border-gray-300 space-y-3">
          <h4 className="text-xs font-mono uppercase text-purple-400 print:text-black tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Curated Soundtrack Schedule
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="font-mono text-gray-400 print:text-gray-600 block text-[10px]">
                AFTERNOON (11:00 - 16:00)
              </span>
              <p className="text-gray-200 print:text-black mt-1">{memo.musicalProgramming.afternoon}</p>
            </div>
            <div>
              <span className="font-mono text-gray-400 print:text-gray-600 block text-[10px]">
                APERITIVO (16:00 - 21:00)
              </span>
              <p className="text-gray-200 print:text-black mt-1">{memo.musicalProgramming.evening}</p>
            </div>
            <div>
              <span className="font-mono text-gray-400 print:text-gray-600 block text-[10px]">
                LATE NIGHT (21:00 - CLOSE)
              </span>
              <p className="text-gray-200 print:text-black mt-1">{memo.musicalProgramming.lateNight}</p>
            </div>
          </div>
        </div>

        {/* Cross Promotions */}
        <div>
          <h4 className="text-xs font-mono uppercase text-gray-400 print:text-gray-700 tracking-wider mb-2">
            Local Micro-Brand Activations
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-300 print:text-gray-800">
            {memo.crossPromotions.map((item, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-surface-elevated/30 print:bg-gray-50 border border-surface-border/40 print:border-gray-200"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer URN ledger */}
      <div className="pt-4 border-t border-surface-border text-[10px] font-mono text-gray-500 print:text-gray-600 flex flex-wrap items-center justify-between gap-2">
        <span>Verified Qloo Entity Proof URNs: {memo.curatedEntityIds.join(', ')}</span>
        <span>Generated: {new Date(memo.generatedAt).toUTCString()}</span>
      </div>
    </div>
  );
};
