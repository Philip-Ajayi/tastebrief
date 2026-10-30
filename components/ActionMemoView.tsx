'use client';

import React from 'react';
import { ActionMemo } from '@/types';
import {
  Printer,
  Download,
  CheckCircle2,
  FileText,
  Clock,
  MapPin,
  Music2,
  ArrowUpRight,
} from 'lucide-react';

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
    <section className="bg-white border border-[#E4E4DB] rounded-[26px] overflow-hidden shadow-[0_4px_30px_rgba(35,45,35,0.04)] print:shadow-none print:border-none print:rounded-none">

      {/* Document cover */}
      <div className="bg-[#29382F] text-white p-7 sm:p-10 lg:p-12 relative overflow-hidden print:bg-white print:text-black">
        <div className="absolute right-0 top-0 w-80 h-80 rounded-full border border-white/[0.07] translate-x-1/3 -translate-y-1/3 print:hidden" />
        <div className="absolute right-16 top-12 w-52 h-52 rounded-full border border-white/[0.07] print:hidden" />

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-[#C1D0AD] mb-7">
                <FileText className="w-4 h-4" />
                <span className="text-[10px] uppercase tracking-[0.22em] font-bold">
                  TasteBrief · Recommendations
                </span>
              </div>

              <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-3 print:text-gray-500">
                Your venue action plan
              </p>

              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight max-w-2xl">
                A better experience for your next guest.
              </h2>

              <p className="mt-4 text-sm text-white/65 leading-7 max-w-xl print:text-gray-600">
                Practical recommendations for your menu, music and atmosphere,
                based on the tastes of visitors from {memo.originCity}.
              </p>
            </div>

            <div className="flex gap-2 shrink-0 print:hidden">
              <button
                onClick={handleDownloadJson}
                className="inline-flex items-center gap-2 px-3 py-2.5 rounded-xl border border-white/15 text-white/80 text-xs font-medium hover:bg-white/10 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                JSON
              </button>

              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D0DABF] text-[#29382F] text-xs font-bold hover:bg-[#DFE8D1] transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                Print memo
              </button>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-6 print:border-gray-300">
            <div>
              <p className="text-[9px] uppercase tracking-[0.17em] text-white/45 mb-2 print:text-gray-500">
                Venue location
              </p>
              <p className="text-sm font-semibold print:text-black">
                {memo.destinationCity}
              </p>
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-[0.17em] text-white/45 mb-2 print:text-gray-500">
                Visitor market
              </p>
              <p className="text-sm font-semibold text-[#D0DABF] print:text-black">
                {memo.originCity}
              </p>
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-[0.17em] text-white/45 mb-2 print:text-gray-500">
                Venue type
              </p>
              <p className="text-sm font-semibold capitalize print:text-black">
                {memo.venueType.replace(/_/g, ' ')}
              </p>
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-[0.17em] text-white/45 mb-2 print:text-gray-500">
                Prepared with
              </p>
              <p className="text-sm font-semibold print:text-black">
                {memo.engineUsed}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Document content */}
      <div className="p-6 sm:p-9 lg:p-10 print:p-4">

        {/* Summary */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-lg bg-[#EFF2E9] flex items-center justify-center text-xs font-bold text-[#687D59]">
              01
            </span>
            <div>
              <h3 className="font-display text-xl text-[#303B32]">
                The big picture
              </h3>
              <p className="text-[10px] text-[#9B9C91] mt-0.5">
                A quick look at what matters most
              </p>
            </div>
          </div>

          <div className="ml-0 sm:ml-11 rounded-2xl bg-[#F7F8F4] border border-[#ECEEE6] p-5 sm:p-6 print:bg-white print:border-gray-300">
            <p className="text-sm text-[#535C51] leading-[1.9]">
              {memo.executiveSummary}
            </p>
          </div>
        </div>

        {/* Menu and atmosphere */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-8 rounded-lg bg-[#EFF2E9] flex items-center justify-center text-xs font-bold text-[#687D59]">
              02
            </span>
            <div>
              <h3 className="font-display text-xl text-[#303B32]">
                What to change
              </h3>
              <p className="text-[10px] text-[#9B9C91] mt-0.5">
                Small changes that can make a difference
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:ml-11">
            <div className="rounded-2xl border border-[#E9EAE2] p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-[#F4EFE5] flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-[#A58A57]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#424C40]">
                    Food and drinks
                  </h4>
                  <p className="text-[10px] text-[#9A9B90] mt-0.5">
                    Menu recommendations
                  </p>
                </div>
              </div>

              <ul className="space-y-4">
                {memo.beverageAdjustments.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs text-[#70776B] leading-[1.8]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A4B18E] shrink-0 mt-1.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-[#E9EAE2] p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-[#EEF1E9] flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-[#728665]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#424C40]">
                    Space and atmosphere
                  </h4>
                  <p className="text-[10px] text-[#9A9B90] mt-0.5">
                    The guest experience
                  </p>
                </div>
              </div>

              <ul className="space-y-4">
                {memo.spatialAtmosphere.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs text-[#70776B] leading-[1.8]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#A4B18E] shrink-0 mt-1.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Music schedule */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-8 rounded-lg bg-[#EFF2E9] flex items-center justify-center text-xs font-bold text-[#687D59]">
              03
            </span>
            <div>
              <h3 className="font-display text-xl text-[#303B32]">
                Set the right mood
              </h3>
              <p className="text-[10px] text-[#9B9C91] mt-0.5">
                Music suggestions throughout the day
              </p>
            </div>
          </div>

          <div className="sm:ml-11 rounded-2xl overflow-hidden border border-[#E8E9E1]">
            <div className="bg-[#F7F8F4] px-5 py-4 border-b border-[#E8E9E1] flex items-center gap-2 print:bg-white">
              <Music2 className="w-4 h-4 text-[#71845F]" />
              <span className="text-xs font-semibold text-[#465342]">
                Daily music schedule
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[#E8E9E1]">
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-3.5 h-3.5 text-[#A28D68]" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8D907F]">
                    Afternoon
                  </span>
                </div>
                <p className="text-[10px] text-[#A4A599] mb-2">11:00 – 16:00</p>
                <p className="text-xs text-[#586253] leading-[1.8]">
                  {memo.musicalProgramming.afternoon}
                </p>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-3.5 h-3.5 text-[#A28D68]" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8D907F]">
                    Evening
                  </span>
                </div>
                <p className="text-[10px] text-[#A4A599] mb-2">16:00 – 21:00</p>
                <p className="text-xs text-[#586253] leading-[1.8]">
                  {memo.musicalProgramming.evening}
                </p>
              </div>

              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Clock className="w-3.5 h-3.5 text-[#A28D68]" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8D907F]">
                    Late night
                  </span>
                </div>
                <p className="text-[10px] text-[#A4A599] mb-2">21:00 – Close</p>
                <p className="text-xs text-[#586253] leading-[1.8]">
                  {memo.musicalProgramming.lateNight}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Partnerships */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-8 h-8 rounded-lg bg-[#EFF2E9] flex items-center justify-center text-xs font-bold text-[#687D59]">
              04
            </span>
            <div>
              <h3 className="font-display text-xl text-[#303B32]">
                People to work with
              </h3>
              <p className="text-[10px] text-[#9B9C91] mt-0.5">
                Local partnerships and collaborations
              </p>
            </div>
          </div>

          <div className="sm:ml-11 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {memo.crossPromotions.map((item, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-[#FAFAF7] border border-[#EBEBE4] flex items-start gap-3 print:bg-white"
              >
                <ArrowUpRight className="w-4 h-4 text-[#899A79] shrink-0 mt-0.5" />
                <p className="text-xs text-[#697064] leading-[1.8]">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Document footer */}
        <div className="pt-6 border-t border-[#EAEAE2] flex flex-col sm:flex-row justify-between gap-3 text-[10px] text-[#A0A196]">
          <div>
            <p className="font-semibold text-[#68765D] mb-1">
              TasteBrief
            </p>
            <p>Prepared for {memo.destinationCity}</p>
          </div>

          <div className="sm:text-right">
            <p>Generated {new Date(memo.generatedAt).toLocaleString()}</p>
            <p className="mt-1">
              Reference IDs: {memo.curatedEntityIds.join(', ')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};