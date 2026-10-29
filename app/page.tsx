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
import { PRESET_CITY_PAIRS, COMPARATIVE_PROOF_SCENARIO } from '@/lib/fixtures';
import { CityPair, AnalysisResponse, NetworkCallLog } from '@/types';
import { Loader2, ArrowUpRight, BarChart3, Sparkles } from 'lucide-react';

export default function DashboardPage() {
  const [selectedPair, setSelectedPair] = useState<CityPair>(PRESET_CITY_PAIRS[0]);
  const [analysisData, setAnalysisData] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [networkLogs, setNetworkLogs] = useState<NetworkCallLog[]>([]);

  // Key state
  const [customApiKey, setCustomApiKey] = useState<string>('');
  const [customGeminiKey, setCustomGeminiKey] = useState<string>('');

  // Modals
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(false);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState<boolean>(false);

  const runAnalysis = useCallback(async (
    pair: CityPair,
    apiKeyOverride?: string,
    geminiKeyOverride?: string
  ) => {
    setIsLoading(true);
    try {
      const res = await fetch('/app/api/analyze' ? '/api/analyze' : '/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cityPairId: pair.id,
          customDestination: pair.destinationQuery,
          customOrigin: pair.originQuery,
          customVenueType: pair.venueType,
          customApiKey: apiKeyOverride !== undefined ? apiKeyOverride : customApiKey,
          customGeminiKey: geminiKeyOverride !== undefined ? geminiKeyOverride : customGeminiKey,
        }),
      });

      if (!res.ok) {
        throw new Error('API request failed');
      }

      const data: AnalysisResponse = await res.json();
      setAnalysisData(data);
      setNetworkLogs(data.networkLogs || []);
    } catch {
      // In extreme network fault situations, use fallback data locally
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
      destinationCity: dest.split(',')[0],
      destinationCountry: dest.split(',')[1] || 'Global',
      destinationQuery: dest,
      originCity: orig.split(',')[0],
      originCountry: orig.split(',')[1] || 'Global',
      originQuery: orig,
      venueType: venueType as any,
      baselineTags: ['coffee', 'wine_bar', 'dining'],
    };
    setSelectedPair(customPair);
    runAnalysis(customPair);
  };

  const handleSaveKeys = (qKey: string, gKey: string) => {
    setCustomApiKey(qKey);
    setCustomGeminiKey(gKey);
    runAnalysis(selectedPair, qKey, gKey);
  };

  return (
    <div className="flex-1 flex flex-col">
      <Header
        onOpenInspector={() => setIsInspectorOpen(true)}
        onOpenKeyModal={() => setIsKeyModalOpen(true)}
        hasCustomKey={Boolean(customApiKey)}
        isDemoMode={analysisData?.isDemoMode ?? true}
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
              TasteBrief queries Qloo’s Taste Graph to calculate the mathematical taste divergence between domestic venue baselines and incoming international travelers. Independent hospitality operators can now replace cultural clichés with empirical lifestyle correlations.
            </p>
          </div>

          <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 opacity-10 pointer-events-none hidden lg:block">
            <BarChart3 className="w-80 h-80 text-white" />
          </div>
        </div>

        {/* 1. City-Pair Selector */}
        <CityPairSelector
          selectedPair={selectedPair}
          onSelectPreset={handleSelectPreset}
          onExecuteCustom={handleExecuteCustom}
          isLoading={isLoading}
        />

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 space-y-3">
            <Loader2 className="w-8 h-8 text-brand-500 animate-spin" />
            <span className="text-xs font-mono text-gray-400">
              Querying Qloo v2 Graph & Calculating Statistical Affinity Lift...
            </span>
          </div>
        )}

        {/* Content Modules */}
        {!isLoading && analysisData && (
          <div className="space-y-8">
            {/* 2. Affinity Lift Table & Micro-Cultural Tags */}
            <AffinityLiftTable
              venues={analysisData.affinityLiftVenues}
              tags={analysisData.tagDivergences}
              originCity={selectedPair.originCity}
              destinationCity={selectedPair.destinationCity}
            />

            {/* 3. Cross-Domain Music Bridge */}
            <MusicBridgeCard
              music={analysisData.musicBridge}
              originCity={selectedPair.originCity}
              destinationCity={selectedPair.destinationCity}
            />

            {/* 4. Comparative Proof Test */}
            <ProofTestComparison proof={COMPARATIVE_PROOF_SCENARIO} />

            {/* 5. 1-Page Printable Action Memo */}
            <ActionMemoView memo={analysisData.actionMemo} />
          </div>
        )}
      </main>

      {/* Network Inspector Drawer Modal */}
      <NetworkInspectorModal
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        logs={networkLogs}
      />

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        onSaveKeys={handleSaveKeys}
        currentQlooKey={customApiKey}
        currentGeminiKey={customGeminiKey}
      />

      {/* Footer */}
      <footer className="border-t border-surface-border bg-background py-6 mt-12 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <div className="flex items-center space-x-2">
            <span>TasteBrief</span>
            <span>•</span>
            <span>Zero-Cost Enterprise Architecture on Vercel Hobby & Qloo Hackathon Tier</span>
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
