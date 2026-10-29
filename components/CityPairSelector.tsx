'use client';

import React, { useState } from 'react';
import { PRESET_CITY_PAIRS } from '@/lib/fixtures';
import { CityPair } from '@/types';
import { ArrowRight, Compass, Sparkles, SlidersHorizontal } from 'lucide-react';

interface CityPairSelectorProps {
  selectedPair: CityPair;
  onSelectPreset: (pair: CityPair) => void;
  onExecuteCustom: (dest: string, orig: string, type: string) => void;
  isLoading: boolean;
}

export const CityPairSelector: React.FC<CityPairSelectorProps> = ({
  selectedPair,
  onSelectPreset,
  onExecuteCustom,
  isLoading,
}) => {
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [dest, setDest] = useState('Lisbon, Portugal');
  const [orig, setOrig] = useState('Berlin, Germany');
  const [venueType, setVenueType] = useState('café_wine_bar');

  const handleSubmitCustom = (e: React.FormEvent) => {
    e.preventDefault();
    onExecuteCustom(dest, orig, venueType);
  };

  return (
    <div className="bg-surface rounded-2xl border border-surface-border p-6 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-brand-400" />
            Market Divergence Engine
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Compare domestic venue baselines against incoming international traveler taste graphs.
          </p>
        </div>

        <button
          onClick={() => setIsCustomMode(!isCustomMode)}
          className="self-start md:self-auto flex items-center gap-1.5 text-xs font-mono text-brand-400 hover:text-brand-300 transition-colors"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          {isCustomMode ? 'Switch to Curated Presets' : 'Custom City-Pair'}
        </button>
      </div>

      {!isCustomMode ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESET_CITY_PAIRS.map((pair) => {
            const isSelected = selectedPair.id === pair.id;
            return (
              <button
                key={pair.id}
                onClick={() => onSelectPreset(pair)}
                disabled={isLoading}
                className={`flex flex-col p-4 rounded-xl border text-left transition-all relative ${
                  isSelected
                    ? 'bg-brand-500/10 border-brand-500 text-white shadow-md shadow-brand-500/10'
                    : 'bg-surface-elevated/50 border-surface-border text-gray-300 hover:bg-surface-elevated hover:border-gray-600'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                  <span className="capitalize">{pair.venueType.replace(/_/g, ' ')}</span>
                  {isSelected && (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2 text-sm font-semibold">
                  <span className="text-white">{pair.destinationCity}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
                  <span className="text-brand-300">{pair.originCity}</span>
                </div>

                <div className="text-[11px] font-mono text-gray-500 mt-2">
                  {pair.destinationCountry} ↔ {pair.originCountry}
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <form onSubmit={handleSubmitCustom} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1">
                Destination Venue Location
              </label>
              <input
                type="text"
                value={dest}
                onChange={(e) => setDest(e.target.value)}
                placeholder="e.g. Lisbon, Portugal"
                className="w-full bg-surface-elevated border border-surface-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1">
                Visitor Origin Market
              </label>
              <input
                type="text"
                value={orig}
                onChange={(e) => setOrig(e.target.value)}
                placeholder="e.g. Berlin, Germany"
                className="w-full bg-surface-elevated border border-surface-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-400 mb-1">Venue Concept</label>
              <select
                value={venueType}
                onChange={(e) => setVenueType(e.target.value)}
                className="w-full bg-surface-elevated border border-surface-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
              >
                <option value="café_wine_bar">Café & Natural Wine Bar</option>
                <option value="cocktail_lounge">Artisanal Cocktail Lounge</option>
                <option value="boutique_hotel">Boutique Hotel & Lounge</option>
                <option value="bistro">Contemporary Neighborhood Bistro</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center space-x-2 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-medium py-2.5 px-4 rounded-lg transition-colors text-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isLoading ? 'Querying Qloo v2 Graph...' : 'Execute Live Cultural Lift Analysis'}</span>
          </button>
        </form>
      )}
    </div>
  );
};
