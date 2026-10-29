'use client';

import React from 'react';
import { AffinityLiftItem, TagDivergence } from '@/types';
import { TrendingUp, TrendingDown, Sparkles, Tag, HelpCircle } from 'lucide-react';

interface AffinityLiftTableProps {
  venues: AffinityLiftItem[];
  tags: TagDivergence[];
  originCity: string;
  destinationCity: string;
}

export const AffinityLiftTable: React.FC<AffinityLiftTableProps> = ({
  venues,
  tags,
  originCity,
  destinationCity,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Venues Lift Table */}
      <div className="lg:col-span-2 bg-surface rounded-2xl border border-surface-border p-6 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-400" />
                Empirical Venue Affinity Lift
              </h3>
              <p className="text-xs text-gray-400">
                Mathematical divergence: Local {destinationCity} baseline vs.{' '}
                <span className="text-brand-300 font-medium">signal.location={originCity}</span>
              </p>
            </div>
            <span className="text-[11px] font-mono text-gray-500">Qloo /v2/insights</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-surface-border text-gray-400 font-mono">
                  <th className="pb-3 font-medium">Venue Entity</th>
                  <th className="pb-3 font-medium text-center">Baseline</th>
                  <th className="pb-3 font-medium text-center">Inbound Lift</th>
                  <th className="pb-3 font-medium text-right">Divergence %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border/50">
                {venues.map((venue) => {
                  const isPositive = venue.liftPercentage > 0;
                  return (
                    <tr key={venue.id} className="hover:bg-surface-elevated/40 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="font-semibold text-white text-sm">{venue.name}</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {venue.tags.slice(0, 3).map((tag, i) => (
                            <span
                              key={i}
                              className="px-1.5 py-0.5 rounded text-[10px] bg-surface-elevated text-gray-400 font-mono"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <div className="text-[11px] text-gray-400 mt-1 max-w-sm">
                          {venue.significanceReason}
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center font-mono text-gray-400">
                        {(venue.baselineScore * 100).toFixed(0)}%
                      </td>
                      <td className="py-3 px-2 text-center font-mono font-medium text-white">
                        {(venue.visitorScore * 100).toFixed(0)}%
                      </td>
                      <td className="py-3 pl-2 text-right">
                        <span
                          className={`inline-flex items-center space-x-1 px-2 py-1 rounded-md font-mono text-xs font-bold ${
                            isPositive
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {isPositive ? (
                            <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
                          ) : (
                            <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
                          )}
                          {isPositive ? `+${venue.liftPercentage}%` : `${venue.liftPercentage}%`}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-surface-border flex items-center justify-between text-[11px] text-gray-500 font-mono">
          <span>Formula: ((VisitorScore - BaselineScore) / BaselineScore) * 100</span>
          <span>URN Filter: urn:entity:place</span>
        </div>
      </div>

      {/* Cultural Tag Surges */}
      <div className="bg-surface rounded-2xl border border-surface-border p-6 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Tag className="w-4 h-4 text-accent-emerald" />
              Micro-Cultural Tag Spikes
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              OPERATIONAL DELTA
            </span>
          </div>

          <div className="space-y-4">
            {tags.map((tag, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-surface-elevated/50 border border-surface-border/60 hover:border-gray-500 transition-colors"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-semibold text-xs text-white">{tag.tag}</span>
                  <span
                    className={`font-mono text-xs font-bold ${
                      tag.liftPercentage > 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {tag.liftPercentage > 0 ? `+${tag.liftPercentage}%` : `${tag.liftPercentage}%`}
                  </span>
                </div>

                {/* Progress bar visualizer */}
                <div className="w-full bg-surface h-1.5 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full ${
                      tag.liftPercentage > 0 ? 'bg-emerald-500' : 'bg-rose-500'
                    }`}
                    style={{
                      width: `${Math.min(100, Math.max(10, Math.abs(tag.liftPercentage) / 3))}%`,
                    }}
                  />
                </div>

                <p className="text-[11px] text-gray-300 leading-relaxed">
                  {tag.actionableInsight}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-surface-border text-[11px] text-gray-400 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-brand-400 flex-shrink-0" />
          <span>Surfaces where visitor cohorts depart most radically from domestic norms.</span>
        </div>
      </div>
    </div>
  );
};
