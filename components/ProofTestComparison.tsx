'use client';

import React from 'react';
import { ComparativeProof } from '@/types';
import { AlertTriangle, CheckCircle2, Scale } from 'lucide-react';

interface ProofTestComparisonProps {
  proof: ComparativeProof;
}

export const ProofTestComparison: React.FC<ProofTestComparisonProps> = ({ proof }) => {
  return (
    <div className="bg-surface rounded-2xl border border-surface-border p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Scale className="w-5 h-5 text-brand-400" />
          <h3 className="text-base font-bold text-white">
            The Cultural Intelligence Proof Test: LLM Cliché vs. Qloo Taste Graph
          </h3>
        </div>
        <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
          EMPIRICAL BENCHMARK
        </span>
      </div>

      <div className="bg-surface-elevated/40 border border-surface-border rounded-xl p-3 mb-6 text-xs text-gray-300 font-mono">
        <span className="text-gray-500">Identical Prompt:</span> &quot;{proof.genericLlmPrompt}&quot;
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Generic LLM Baseline */}
        <div className="p-5 rounded-xl bg-rose-950/10 border border-rose-900/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-rose-400 font-bold text-sm mb-3">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <h4>Generic LLM Baseline (GPT-4 / Claude / Gemini Raw)</h4>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-mono text-gray-400 block mb-1">Recommended Menu:</span>
                <ul className="list-disc list-inside text-gray-300 space-y-0.5">
                  {proof.genericLlmOutput.menu.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-mono text-gray-400 block mb-1">Audio Curation:</span>
                <ul className="list-disc list-inside text-gray-300 space-y-0.5">
                  {proof.genericLlmOutput.music.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-mono text-gray-400 block mb-1">Atmosphere:</span>
                <ul className="list-disc list-inside text-gray-300 space-y-0.5">
                  {proof.genericLlmOutput.vibe.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-rose-900/30 text-[11px] text-rose-300 italic">
            <strong>Critical Failure:</strong> {proof.genericLlmOutput.criticalFlaw}
          </div>
        </div>

        {/* TasteBrief Powered by Qloo */}
        <div className="p-5 rounded-xl bg-emerald-950/10 border border-emerald-900/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm mb-3">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <h4>TasteBrief Powered by Qloo v2 Insights</h4>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="font-mono text-gray-400 block mb-1">Empirically Grounded Deltas:</span>
                <ul className="list-disc list-inside text-gray-200 space-y-0.5">
                  {proof.tasteBriefQlooOutput.menuDeltas.map((item, i) => (
                    <li key={i} className="text-emerald-300">{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-mono text-gray-400 block mb-1">Harmonic Music Bridges:</span>
                <ul className="list-disc list-inside text-gray-300 space-y-0.5">
                  {proof.tasteBriefQlooOutput.musicBridge.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <span className="font-mono text-gray-400 block mb-1">Atmospheric Truth:</span>
                <ul className="list-disc list-inside text-gray-300 space-y-0.5">
                  {proof.tasteBriefQlooOutput.spatialAtmosphere.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-900/30 text-[11px] text-emerald-300">
            <strong>The Measurable Difference:</strong> {proof.tasteBriefQlooOutput.empiricalValidation}
          </div>
        </div>
      </div>
    </div>
  );
};
