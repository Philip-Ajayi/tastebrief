'use client';

import React from 'react';
import { MusicBridgeArtist } from '@/types';
import { Disc3, Radio, Clock, Sparkles } from 'lucide-react';

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
    <div className="bg-surface rounded-2xl border border-surface-border p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Disc3 className="w-5 h-5 text-purple-400 animate-spin-slow" />
            Cross-Domain Music Bridge
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Artists that over-index across both {originCity} and {destinationCity} cultural taste graphs.
          </p>
        </div>
        <div className="flex items-center space-x-1 text-xs font-mono text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">
          <Radio className="w-3.5 h-3.5" />
          <span>urn:entity:artist</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {music.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col justify-between p-4 rounded-xl bg-surface-elevated/40 border border-surface-border hover:border-purple-500/50 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">
                  {item.subgenre}
                </span>
                <div className="flex items-center space-x-1 text-xs font-mono text-emerald-400">
                  <Sparkles className="w-3 h-3" />
                  <span>{(item.harmonicOverlapScore * 100).toFixed(0)}% Overlap</span>
                </div>
              </div>

              <h4 className="font-bold text-white text-base mb-1">{item.name}</h4>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">{item.rationale}</p>
            </div>

            <div className="pt-3 border-t border-surface-border/60">
              <div className="flex items-center text-[11px] font-mono text-brand-300">
                <Clock className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                <span>Slot: {item.recommendedTimeSlot}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
