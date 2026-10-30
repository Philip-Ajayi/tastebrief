'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { CityPairSelector } from '@/components/CityPairSelector';
import { AffinityLiftTable } from '@/components/AffinityLiftTable';
import { MusicBridgeCard } from '@/components/MusicBridgeCard';
import { ProofTestComparison } from '@/components/ProofTestComparison';
import { ActionMemoView } from '@/components/ActionMemoView';
import { NetworkInspectorModal } from '@/components/NetworkInspectorModal';
import { ApiKeyModal } from '@/components/ApiKeyModal';
import { PRESET_CITY_PAIRS } from '@/lib/fixtures';
import { CityPair, AnalysisResponse, NetworkCallLog } from '@/types';
import {
  Loader2,
  AlertCircle,
  KeyRound,
  ArrowUpRight,
  Globe2,
  ChartNoAxesCombined,
} from 'lucide-react';

export default function DashboardPage() {
  const [selectedPair, setSelectedPair] = useState<CityPair>(PRESET_CITY_PAIRS[0]);
  const [analysisData, setAnalysisData] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [networkLogs, setNetworkLogs] = useState<NetworkCallLog[]>([]);

  const [customApiKey, setCustomApiKey] = useState<string>('');
  const [customGeminiKey, setCustomGeminiKey] = useState<string>('');

  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(false);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const storedQloo = localStorage.getItem('tb_qloo_key') || '';
    const storedGemini = localStorage.getItem('tb_gemini_key') || '';
    if (storedQloo) setCustomApiKey(storedQloo);
    if (storedGemini) setCustomGeminiKey(storedGemini);
  }, []);

  const runAnalysis = useCallback(async (
    pair: CityPair,
    apiKeyOverride?: string,
    geminiKeyOverride?: string
  ) => {
    setIsLoading(true);
    setErrorMessage(null);

    const qKey = apiKeyOverride !== undefined ? apiKeyOverride : customApiKey;
    const gKey = geminiKeyOverride !== undefined ? geminiKeyOverride : customGeminiKey;

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cityPairId: pair.id,
          customDestination: pair.destinationQuery,
          customOrigin: pair.originQuery,
          customVenueType: pair.venueType,
          customApiKey: qKey,
          customGeminiKey: gKey,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.details || data.error || `HTTP error ${res.status}`);
      }

      setAnalysisData(data);
      setNetworkLogs(data.networkLogs || []);
    } catch (err: any) {
      setErrorMessage(err.message || 'Could not connect to the analysis service.');
    } finally {
      setIsLoading(false);
    }
  }, [customApiKey, customGeminiKey]);

  useEffect(() => {
    runAnalysis(selectedPair);
  }, [selectedPair, runAnalysis]);

  const handleSelectPreset = (pair: CityPair) => {
    setSelectedPair(pair);
  };

  const handleExecuteCustom = (dest: string, orig: string, venueType: string) => {
    const customPair: CityPair = {
      id: 'custom',
      destinationCity: dest.split(',')[0].trim(),
      destinationCountry: dest.split(',')[1]?.trim() || 'Global',
      destinationQuery: dest,
      originCity: orig.split(',')[0].trim(),
      originCountry: orig.split(',')[1]?.trim() || 'Global',
      originQuery: orig,
      venueType: venueType as any,
      baselineTags: ['coffee', 'wine_bar', 'dining'],
    };
    setSelectedPair(customPair);
  };

  const handleSaveKeys = (qKey: string, gKey: string) => {
    setCustomApiKey(qKey);
    setCustomGeminiKey(gKey);
    localStorage.setItem('tb_qloo_key', qKey);
    localStorage.setItem('tb_gemini_key', gKey);
    runAnalysis(selectedPair, qKey, gKey);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F6F2] text-[#20251F]">
      <Header
        onOpenInspector={() => setIsInspectorOpen(true)}
        onOpenKeyModal={() => setIsKeyModalOpen(true)}
        hasCustomKey={Boolean(customApiKey)}
        hasEnvKey={Boolean(process.env.NEXT_PUBLIC_HAS_ENV_KEYS)}
      />

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-8 lg:py-12">

        {/* Page introduction */}
        <section className="relative overflow-hidden rounded-[28px] bg-[#202B25] text-white mb-8">
          <div className="absolute right-0 top-0 w-[420px] h-[420px] rounded-full border border-white/[0.06] translate-x-1/3 -translate-y-1/3" />
          <div className="absolute right-12 top-10 w-[280px] h-[280px] rounded-full border border-white/[0.06]" />
          <div className="absolute right-28 top-24 w-[140px] h-[140px] rounded-full bg-[#A8B58B]/10 blur-3xl" />

          <div className="relative z-10 px-7 py-10 sm:px-12 sm:py-14 lg:py-16 max-w-4xl">
            <div className="flex items-center gap-2 mb-7">
              <span className="w-8 h-px bg-[#B6C49B]" />
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.24em] text-[#C4D0B0] font-semibold">
                TasteBrief · Hospitality Intelligence
              </span>
            </div>

            <h1 className="font-display text-[38px] sm:text-5xl lg:text-[64px] leading-[1.08] tracking-[-0.045em] max-w-3xl">
              Know what your guests love.
              <span className="block text-[#BBC9A4]">Before they walk in.</span>
            </h1>

            <p className="mt-6 text-sm sm:text-base text-white/65 leading-7 max-w-xl">
              Understand what international visitors enjoy, discover what
              local venues are missing, and make better decisions about
              your menu, music and atmosphere.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-5 text-xs text-white/55">
              <div className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-[#BBC9A4]" />
                Cross-border taste insights
              </div>
              <span className="hidden sm:block w-1 h-1 rounded-full bg-white/30" />
              <div className="flex items-center gap-2">
                <ChartNoAxesCombined className="w-4 h-4 text-[#BBC9A4]" />
                Real-world recommendations
              </div>
            </div>
          </div>
        </section>

        {/* Market selection */}
        <CityPairSelector
          selectedPair={selectedPair}
          onSelectPreset={handleSelectPreset}
          onExecuteCustom={handleExecuteCustom}
          isLoading={isLoading}
        />

        {/* Error */}
        {errorMessage && (
          <div className="mt-7 rounded-2xl border border-[#E9C5BE] bg-[#FFF5F2] p-5 sm:p-6 flex flex-col sm:flex-row justify-between gap-5">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 shrink-0 rounded-full bg-[#F9E3DE] flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-[#B85C4A]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#8E4035]">
                  We couldn't complete the analysis
                </h3>
                <p className="text-sm text-[#A15E52] mt-1 leading-relaxed">
                  {errorMessage}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsKeyModalOpen(true)}
              className="shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#28382F] text-white text-xs font-semibold hover:bg-[#354A3E] transition-colors"
            >
              <KeyRound className="w-3.5 h-3.5" />
              Check API keys
            </button>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="mt-8 rounded-[24px] bg-white border border-[#E9E8E1] min-h-[300px] flex flex-col items-center justify-center text-center px-6">
            <div className="w-14 h-14 rounded-2xl bg-[#EFF1E9] flex items-center justify-center mb-5">
              <Loader2 className="w-6 h-6 text-[#637A54] animate-spin" />
            </div>
            <h3 className="font-display text-xl text-[#29342C]">
              Looking at the bigger picture
            </h3>
            <p className="text-sm text-[#898D83] mt-2 max-w-sm leading-6">
              Comparing local tastes with visitor preferences. Your results
              will appear here shortly.
            </p>
            <div className="mt-6 w-40 h-1 rounded-full bg-[#EBEDE6] overflow-hidden">
              <div className="h-full w-1/2 bg-[#879A71] rounded-full animate-pulse" />
            </div>
          </div>
        )}

        {/* Analysis results */}
        {!isLoading && analysisData && (
          <div className="mt-10 space-y-9 animate-fadeIn">

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-[#7D986B]" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#77846D]">
                    Analysis results
                  </span>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl tracking-tight text-[#252D26]">
                  What the data tells us
                </h2>
                <p className="text-sm text-[#85877F] mt-2">
                  Insights for {selectedPair.destinationCity}, based on
                  visitors from {selectedPair.originCity}.
                </p>
              </div>
              <div className="text-xs text-[#8B8D83]">
                Powered by Qloo insights
              </div>
            </div>

            <AffinityLiftTable
              venues={analysisData.affinityLiftVenues}
              tags={analysisData.tagDivergences}
              originCity={selectedPair.originCity}
              destinationCity={selectedPair.destinationCity}
            />

            <MusicBridgeCard
              music={analysisData.musicBridge}
              originCity={selectedPair.originCity}
              destinationCity={selectedPair.destinationCity}
            />

            <ProofTestComparison proof={analysisData.comparativeProof} />

            <ActionMemoView memo={analysisData.actionMemo} />
          </div>
        )}
      </main>

      <footer className="border-t border-[#E8E7DF] bg-[#F2F1EC] mt-16 print:hidden">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-7 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <span className="font-display text-lg font-semibold text-[#27332A]">
              TasteBrief
            </span>
            <p className="text-[11px] text-[#96968D] mt-1">
              Better hospitality starts with understanding people.
            </p>
          </div>

          <a
            href="https://qloo.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs font-medium text-[#687B5C] hover:text-[#344A37] transition-colors"
          >
            Qloo documentation
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </footer>

      <NetworkInspectorModal
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        logs={networkLogs}
      />

      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        onSaveKeys={handleSaveKeys}
        currentQlooKey={customApiKey}
        currentGeminiKey={customGeminiKey}
      />
    </div>
  );
}