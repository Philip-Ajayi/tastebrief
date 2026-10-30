'use client';

import React from 'react';
import { MusicBridgeArtist } from '@/types';
import {
  Disc3,
  Clock,
  Music2,
  Radio,
  ArrowUpRight,
} from 'lucide-react';

interface MusicBridgeCardProps {
  music: MusicBridgeArtist[];
  originCity: string;
  destinationCity: string;
}

export const MusicBridgeCard: React.FC<MusicBridgeCardProps> = ({
  music,
  originCity,
  destinationCity,
}) => {
  return (
    <section className="premium-card overflow-hidden">

      <div className="p-6 sm:p-8 border-b border-[#ECEBE5]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="section-label mb-2">03 · Music and atmosphere</div>
            <h3 className="font-display text-2xl sm:text-3xl text-[#29342C] tracking-tight">
              Find the common ground
            </h3>
            <p className="text-sm text-[#898B81] mt-2 leading-6 max-w-xl">
              Artists that connect the musical tastes of visitors from
              {` ${originCity}`} with the culture of {destinationCity}.
            </p>
          </div>

          <div className="w-12 h-12 rounded-2xl bg-[#F0EFE9] flex items-center justify-center shrink-0">
            <Disc3 className="w-6 h-6 text-[#788765]" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
        {music.map((item, idx) => (
          <article
            key={idx}
            className={`p-6 sm:p-7 flex flex-col justify-between min-h-[245px] hover:bg-[#FAFBF8] transition-colors ${
              idx !== 0 ? 'border-t md:border-t-0 md:border-l border-[#ECEBE5]' : ''
            } ${idx > 1 ? 'xl:border-l' : ''}`}
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-6">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F0F2EA] text-[#657858] px-3 py-1.5 text-[10px] font-semibold capitalize">
                  <Music2 className="w-3 h-3" />
                  {item.subgenre}
                </span>

                <div className="text-xs font-bold text-[#657D54] tabular-nums">
                  {(item.harmonicOverlapScore * 100).toFixed(0)}%
                  <span className="text-[#A0A297] font-normal ml-1">match</span>
                </div>
              </div>

              <h4 className="font-display text-[26px] text-[#303B32] tracking-tight leading-tight">
                {item.name}
              </h4>

              <p className="text-xs text-[#888B80] mt-3 leading-[1.8]">
                {item.rationale}
              </p>
            </div>

            <div className="mt-7 pt-4 border-t border-[#ECEBE5] flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#F0F2EA] flex items-center justify-center shrink-0">
                <Clock className="w-3.5 h-3.5 text-[#788968]" />
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-wider text-[#A0A095]">
                  Suggested time
                </p>
                <p className="text-xs font-semibold text-[#485447] mt-0.5">
                  {item.recommendedTimeSlot}
                </p>
              </div>
            </div>
          </article>
        ))}

        {music.length === 0 && (
          <div className="col-span-full py-12 text-center text-sm text-[#92948B]">
            No music recommendations available.
          </div>
        )}
      </div>

      <div className="px-6 sm:px-8 py-4 bg-[#FAFAF7] border-t border-[#ECEBE5] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[11px] text-[#909287]">
          <Radio className="w-3.5 h-3.5 text-[#839174]" />
          Music preferences across both markets
        </div>
        <ArrowUpRight className="w-4 h-4 text-[#A2A598]" />
      </div>
    </section>
  );
};