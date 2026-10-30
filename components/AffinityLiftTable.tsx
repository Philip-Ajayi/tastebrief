'use client';

import React from 'react';
import { AffinityLiftItem, TagDivergence } from '@/types';
import {
  TrendingUp,
  TrendingDown,
  Sparkles,
  Tag,
  ArrowUpRight,
  ArrowDownRight,
  Lightbulb,
} from 'lucide-react';

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
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

      {/* Venue comparison */}
      <section className="xl:col-span-2 premium-card overflow-hidden">

        <div className="p-6 sm:p-7 border-b border-[#ECEBE5]">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
            <div>
              <div className="section-label mb-2">01 · Venue preferences</div>
              <h3 className="font-display text-2xl text-[#29342C] tracking-tight">
                Places visitors are drawn to
              </h3>
              <p className="text-sm text-[#888A80] mt-2 leading-6">
                How popular venues compare between {destinationCity} locals
                and visitors from {originCity}.
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-2 text-[10px] text-[#7B876E] bg-[#F0F3EA] px-3 py-2 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#82966D]" />
              Live insights
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[590px]">
            <thead>
              <tr className="bg-[#FAFAF7] text-[10px] uppercase tracking-[0.12em] text-[#999B91]">
                <th className="px-6 py-4 font-semibold">Venue</th>
                <th className="px-4 py-4 font-semibold text-center">Local</th>
                <th className="px-4 py-4 font-semibold text-center">Visitors</th>
                <th className="px-6 py-4 font-semibold text-right">Difference</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#F0EFE9]">
              {venues.map((venue) => {
                const isPositive = venue.liftPercentage > 0;

                return (
                  <tr
                    key={venue.id}
                    className="group hover:bg-[#FAFBF8] transition-colors"
                  >
                    <td className="px-6 py-5 max-w-[280px]">
                      <div className="text-sm font-semibold text-[#303B32]">
                        {venue.name}
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {venue.tags.slice(0, 3).map((tag, i) => (
                          <span
                            key={i}
                            className="text-[10px] text-[#7C846F] bg-[#F0F2EB] px-2 py-1 rounded-md"
                          >
                            {tag.replace(/_/g, ' ')}
                          </span>
                        ))}
                      </div>

                      <p className="text-xs text-[#92948B] mt-2 leading-5">
                        {venue.significanceReason}
                      </p>
                    </td>

                    <td className="px-4 py-5 text-center">
                      <span className="text-sm font-semibold tabular-nums text-[#92948B]">
                        {(venue.baselineScore * 100).toFixed(0)}%
                      </span>
                    </td>

                    <td className="px-4 py-5 text-center">
                      <span className="text-sm font-semibold tabular-nums text-[#344B39]">
                        {(venue.visitorScore * 100).toFixed(0)}%
                      </span>
                    </td>

                    <td className="px-6 py-5 text-right">
                      <span className={`inline-flex items-center justify-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-bold tabular-nums ${
                        isPositive
                          ? 'bg-[#EDF4E9] text-[#587B4C]'
                          : 'bg-[#FAEEEB] text-[#AD6353]'
                      }`}>
                        {isPositive ? (
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowDownRight className="w-3.5 h-3.5" />
                        )}
                        {isPositive ? '+' : ''}{venue.liftPercentage}%
                      </span>
                    </td>
                  </tr>
                );
              })}

              {venues.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-sm text-[#92948B]">
                    No venue comparisons available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-[#FAFAF7] border-t border-[#ECEBE5] flex flex-wrap items-center justify-between gap-2">
          <span className="text-[10px] text-[#9A9B91]">
            Based on local and visitor preference scores
          </span>
          <span className="text-[10px] text-[#A3A399]">
            Qloo Insights
          </span>
        </div>
      </section>

      {/* Cultural trends */}
      <section className="premium-card p-6 sm:p-7 flex flex-col">
        <div className="section-label mb-2">02 · Cultural interests</div>

        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display text-2xl text-[#29342C] tracking-tight">
            What's different?
          </h3>
          <div className="w-9 h-9 rounded-xl bg-[#F0F3EA] flex items-center justify-center">
            <Tag className="w-4 h-4 text-[#71845F]" />
          </div>
        </div>

        <p className="text-xs text-[#8D8F85] mt-2 mb-6 leading-5">
          Interests that stand out among visitors compared with local tastes.
        </p>

        <div className="space-y-3 flex-1">
          {tags.map((tag, i) => {
            const isPositive = tag.liftPercentage > 0;

            return (
              <div
                key={i}
                className="rounded-2xl border border-[#EDEDE5] bg-[#FCFCFA] p-4 hover:border-[#CBD5BE] transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-sm font-semibold text-[#344036]">
                    {tag.tag.replace(/_/g, ' ')}
                  </span>

                  <span className={`shrink-0 text-xs font-bold tabular-nums ${
                    isPositive ? 'text-[#638552]' : 'text-[#B56C5D]'
                  }`}>
                    {isPositive ? '+' : ''}{tag.liftPercentage}%
                  </span>
                </div>

                <div className="mt-3 h-1.5 w-full rounded-full bg-[#ECEDE6] overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      isPositive ? 'bg-[#8DA37A]' : 'bg-[#CB9387]'
                    }`}
                    style={{
                      width: `${Math.min(100, Math.max(10, Math.abs(tag.liftPercentage) / 3))}%`,
                    }}
                  />
                </div>

                <p className="mt-3 text-xs text-[#85877E] leading-[1.65]">
                  {tag.actionableInsight}
                </p>
              </div>
            );
          })}

          {tags.length === 0 && (
            <p className="text-sm text-[#92948B] text-center py-8">
              No cultural trends available.
            </p>
          )}
        </div>

        <div className="mt-5 pt-4 border-t border-[#ECEBE5] flex gap-2.5 items-start">
          <Lightbulb className="w-4 h-4 text-[#A58B56] shrink-0 mt-0.5" />
          <p className="text-[11px] text-[#92948B] leading-5">
            Use these differences to decide what deserves a place on your menu
            and in your venue.
          </p>
        </div>
      </section>
    </div>
  );
};