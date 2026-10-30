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
import { Loader2, ArrowUpRight, BarChart3, Sparkles, AlertCircle, Key } from 'lucide-react';

export default function DashboardPage() {
  const [selectedPair, setSelectedPair] = useState<CityPair>(PRESET_CITY_PAIRS[0]);
  const [analysisData, setAnalysisData] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [networkLogs, setNetworkLogs] = useState<NetworkCallLog[]>([]);

  // Key state (retrieved from localStorage on mount if available)
  const [customApiKey, setCustomApiKey] = useState<string>('');
  const [customGeminiKey, setCustomGeminiKey] = useState<string>('');

  // Modals
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
      setErrorMessage(err.message || 'Failed to communicate with live cultural endpoints.');
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
    <div className="flex-1 flex flex-col">
      <Header
        onOpenInspector={() => setIsInspectorOpen(true)}
        onOpenKeyModal={() => setIsKeyModalOpen(true)}
        hasCustomKey={Boolean(customApiKey)}
        hasEnvKey={Boolean(process.env.NEXT_PUBLIC_HAS_ENV_KEYS)}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 w-full">
        {/* Hero Value Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-surface to-surface-elevated border border-surface-border p-6 sm:p-10 shadow-2xl">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-mono mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Cross-Border Visitor Taste Intelligence</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Stop serving pretzels to Berliners in Lisbon.
            </h1>
            <p className="mt-3 text-sm sm:text-base text-gray-300 leading-relaxed">
              TasteBrief queries Qloo’s Taste Graph in real time to calculate the mathematical taste divergence between domestic venue baselines and incoming international travelers.
            </p>
          </div>

          <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 opacity-10 pointer-events-none hidden lg:block">
            <BarChart3 className="w-80 h-80 text-white" />
          </div>
        </div>

        {/* City-Pair Selector */}
        <CityPairSelector
          selectedPair={selectedPair}
          onSelectPreset={handleSelectPreset}
          onExecuteCustom={handleExecuteCustom}
          isLoading={isLoading}
        />

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-400" />
              <div>
                <h4 className="font-bold text-sm text-white">Live Query Failed</h4>
                <p className="text-xs text-rose-200 mt-1">{errorMessage}</p>
              </div>
            </div>
            <button
              onClick={() => setIsKeyModalOpen(true)}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white transition-colors flex-shrink-0"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Configure Live API Keys</span>
            </button>
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
            <span className="text-xs font-mono text-gray-400">
              Executing Live Qloo /v2/insights Queries & Calculating Affinity Lift...
            </span>
          </div>
        )}

        {/* Content Modules (Only rendered when live data succeeds) */}
        {!isLoading && analysisData && (
          <div className="space-y-8">
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

      <footer className="border-t border-surface-border bg-background py-6 mt-12 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <div className="flex items-center space-x-2">
            <span>TasteBrief</span>
            <span>•</span>
            <span>Live Qloo v2 Cultural Taste Intelligence Protocol</span>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="https://qloo.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-gray-300 transition-colors flex items-center gap-1 font-mono"
            >
              Qloo v2 API Docs <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}