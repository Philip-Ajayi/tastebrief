'use client';

import React from 'react';
import { ComparativeProof } from '@/types';
import {
  AlertTriangle,
  CheckCircle2,
  Scale,
  Minus,
  Plus,
} from 'lucide-react';

interface ProofTestComparisonProps {
  proof: ComparativeProof;
}

export const ProofTestComparison: React.FC<ProofTestComparisonProps> = ({ proof }) => {
  return (
    <section className="premium-card overflow-hidden">

      <div className="p-6 sm:p-8 border-b border-[#ECEBE5]">
        <div className="section-label mb-2">04 · Why the difference matters</div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-display text-2xl sm:text-3xl text-[#29342C] tracking-tight">
              Guesswork or real insight?
            </h3>
            <p className="text-sm text-[#898B81] mt-2 leading-6">
              See how general recommendations compare with recommendations
              based on actual taste data.
            </p>
          </div>

          <div className="w-11 h-11 rounded-xl bg-[#F0F2EA] flex items-center justify-center shrink-0">
            <Scale className="w-5 h-5 text-[#71845F]" />
          </div>
        </div>

        <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-[#F8F8F4] border border-[#ECEBE5]">
          <p className="text-[10px] uppercase tracking-[0.16em] text-[#92958A] font-bold mb-2">
            The question
          </p>
          <p className="text-sm text-[#4D574C] leading-7">
            "{proof.genericLlmPrompt}"
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">

        {/* Generic recommendations */}
        <div className="p-6 sm:p-8 lg:border-r border-[#ECEBE5]">
          <div className="flex items-center gap-3 mb-7">
            <div className="w-10 h-10 rounded-xl bg-[#F8EEE9] flex items-center justify-center">
              <AlertTriangle className="w-[18px] h-[18px] text-[#B77A64]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#41473F]">
                General recommendations
              </h4>
              <p className="text-[11px] text-[#A0A095] mt-1">
                Without local taste data
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#A0A095] font-bold mb-3">
                Menu ideas
              </p>
              <ul className="space-y-2.5">
                {proof.genericLlmOutput.menu.map((item, i) => (
                  <li key={i} className="flex gap-2.5 text-xs text-[#73776D] leading-5">
                    <Minus className="w-3.5 h-3.5 text-[#B58B78] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#A0A095] font-bold mb-3">
                Music
              </p>
              <ul className="space-y-2.5">
                {proof.genericLlmOutput.music.map((item, i) => (
                  <li key={i} className="flex gap-2.5 text-xs text-[#73776D] leading-5">
                    <Minus className="w-3.5 h-3.5 text-[#B58B78] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#A0A095] font-bold mb-3">
                Atmosphere
              </p>
              <ul className="space-y-2.5">
                {proof.genericLlmOutput.vibe.map((item, i) => (
                  <li key={i} className="flex gap-2.5 text-xs text-[#73776D] leading-5">
                    <Minus className="w-3.5 h-3.5 text-[#B58B78] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-7 p-4 rounded-xl bg-[#FAF4F0] border border-[#F0E4DC]">
            <p className="text-[10px] uppercase tracking-wider text-[#A87965] font-bold mb-2">
              The problem
            </p>
            <p className="text-xs text-[#8E7063] leading-6">
              {proof.genericLlmOutput.criticalFlaw}
            </p>
          </div>
        </div>

        {/* TasteBrief recommendations */}
        <div className="p-6 sm:p-8 bg-[#FBFCF9]">
          <div className="flex items-center gap-3 mb-7">
            <div className="w-10 h-10 rounded-xl bg-[#EAF1E5] flex items-center justify-center">
              <CheckCircle2 className="w-[18px] h-[18px] text-[#658452]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#354B38]">
                TasteBrief recommendations
              </h4>
              <p className="text-[11px] text-[#929B8B] mt-1">
                Based on Qloo taste data
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#8A9680] font-bold mb-3">
                Menu ideas
              </p>
              <ul className="space-y-2.5">
                {proof.tasteBriefQlooOutput.menuDeltas.map((item, i) => (
                  <li key={i} className="flex gap-2.5 text-xs text-[#53664D] leading-5">
                    <Plus className="w-3.5 h-3.5 text-[#759365] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#8A9680] font-bold mb-3">
                Music
              </p>
              <ul className="space-y-2.5">
                {proof.tasteBriefQlooOutput.musicBridge.map((item, i) => (
                  <li key={i} className="flex gap-2.5 text-xs text-[#657064] leading-5">
                    <Plus className="w-3.5 h-3.5 text-[#759365] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#8A9680] font-bold mb-3">
                Atmosphere
              </p>
              <ul className="space-y-2.5">
                {proof.tasteBriefQlooOutput.spatialAtmosphere.map((item, i) => (
                  <li key={i} className="flex gap-2.5 text-xs text-[#657064] leading-5">
                    <Plus className="w-3.5 h-3.5 text-[#759365] shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-7 p-4 rounded-xl bg-[#EDF3E8] border border-[#DFE9D8]">
            <p className="text-[10px] uppercase tracking-wider text-[#68805B] font-bold mb-2">
              What makes it different
            </p>
            <p className="text-xs text-[#627458] leading-6">
              {proof.tasteBriefQlooOutput.empiricalValidation}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};