'use client';

import React, { useState } from 'react';
import { PRESET_CITY_PAIRS } from '@/lib/fixtures';
import { CityPair } from '@/types';
import {
  ArrowRight,
  MapPin,
  SlidersHorizontal,
  Check,
  Sparkles,
} from 'lucide-react';

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
    <section className="premium-card p-6 sm:p-8">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-7">
        <div>
          <div className="section-label mb-2">Choose your market</div>
          <h2 className="font-display text-2xl sm:text-[28px] text-[#29342C] tracking-tight">
            Where are your guests coming from?
          </h2>
          <p className="text-sm text-[#85877F] mt-2 leading-6">
            Compare the tastes of international visitors with the local market.
          </p>
        </div>

        <button
          onClick={() => setIsCustomMode(!isCustomMode)}
          className="inline-flex items-center justify-center gap-2 self-start sm:self-center px-4 py-2.5 rounded-xl border border-[#E5E5DC] text-xs font-semibold text-[#56644F] hover:bg-[#F2F3ED] transition-colors"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          {isCustomMode ? 'Browse examples' : 'Custom comparison'}
        </button>
      </div>

      {!isCustomMode ? (
        <>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] uppercase tracking-[0.16em] font-bold text-[#9B9C91]">
              Suggested comparisons
            </span>
            <div className="h-px flex-1 bg-[#ECEBE4]" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
            {PRESET_CITY_PAIRS.map((pair) => {
              const isSelected = selectedPair.id === pair.id;

              return (
                <button
                  key={pair.id}
                  onClick={() => onSelectPreset(pair)}
                  disabled={isLoading}
                  className={`group relative text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 disabled:opacity-60 ${
                    isSelected
                      ? 'bg-[#F0F3EA] border-[#91A47D] shadow-[0_0_0_2px_rgba(145,164,125,0.10)]'
                      : 'bg-white border-[#EAE9E2] hover:border-[#B7C3A8] hover:bg-[#FAFBF8]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-5">
                    <span className={`text-[10px] uppercase tracking-wider font-semibold ${
                      isSelected ? 'text-[#627B54]' : 'text-[#999B91]'
                    }`}>
                      {pair.venueType.replace(/_/g, ' ')}
                    </span>

                    {isSelected ? (
                      <span className="w-6 h-6 rounded-full bg-[#536B48] flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-white" />
                      </span>
                    ) : (
                      <span className="w-6 h-6 rounded-full border border-[#E9E8E1] flex items-center justify-center group-hover:border-[#9BAC8D]">
                        <ArrowRight className="w-3 h-3 text-[#9C9F94]" />
                      </span>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#9A9B91] mb-1">
                        Venue location
                      </p>
                      <p className="text-base font-semibold text-[#29342C]">
                        {pair.destinationCity}
                      </p>
                      <p className="text-xs text-[#96978E] mt-0.5">
                        {pair.destinationCountry}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="h-px flex-1 bg-[#E6E7DE]" />
                      <ArrowRight className="w-3.5 h-3.5 text-[#89977A]" />
                      <div className="h-px flex-1 bg-[#E6E7DE]" />
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#9A9B91] mb-1">
                        Visitor market
                      </p>
                      <p className="text-base font-semibold text-[#536C49]">
                        {pair.originCity}
                      </p>
                      <p className="text-xs text-[#96978E] mt-0.5">
                        {pair.originCountry}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <form onSubmit={handleSubmitCustom} className="animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

            <div>
              <label className="field-label">
                Where is your venue?
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8D9A7D]" />
                <input
                  type="text"
                  value={dest}
                  onChange={(e) => setDest(e.target.value)}
                  placeholder="e.g. Lisbon, Portugal"
                  className="premium-input pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="field-label">
                Where are your guests from?
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8D9A7D]" />
                <input
                  type="text"
                  value={orig}
                  onChange={(e) => setOrig(e.target.value)}
                  placeholder="e.g. Berlin, Germany"
                  className="premium-input pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="field-label">
                What kind of venue do you run?
              </label>
              <select
                value={venueType}
                onChange={(e) => setVenueType(e.target.value)}
                className="premium-input"
              >
                <option value="café_wine_bar">Café & Natural Wine Bar</option>
                <option value="cocktail_lounge">Cocktail Lounge</option>
                <option value="boutique_hotel">Boutique Hotel & Lounge</option>
                <option value="bistro">Neighbourhood Bistro</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-5 border-t border-[#EEEDE6]">
            <p className="text-xs text-[#93948A]">
              We'll compare visitor preferences with local tastes.
            </p>

            <button
              type="submit"
              disabled={isLoading}
              className="primary-button min-w-[190px]"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isLoading ? 'Analysing...' : 'Run comparison'}</span>
            </button>
          </div>
        </form>
      )}
    </section>
  );
};