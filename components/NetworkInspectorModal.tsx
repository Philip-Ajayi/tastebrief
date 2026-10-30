'use client';

import React from 'react';
import { NetworkCallLog } from '@/types';
import {
  X,
  Terminal,
  Clock,
  CheckCircle2,
  AlertCircle,
  Activity,
  Code2,
} from 'lucide-react';

interface NetworkInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: NetworkCallLog[];
}

export const NetworkInspectorModal: React.FC<NetworkInspectorModalProps> = ({
  isOpen,
  onClose,
  logs,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#172019]/55 backdrop-blur-sm animate-fadeIn">

      <div className="bg-white border border-[#E8E8DF] rounded-[24px] w-full max-w-4xl max-h-[88vh] flex flex-col shadow-[0_25px_100px_rgba(0,0,0,0.2)] overflow-hidden">

        {/* Header */}
        <div className="px-5 sm:px-7 py-5 border-b border-[#ECEBE5] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EEF2E9] flex items-center justify-center">
              <Activity className="w-5 h-5 text-[#6D825F]" />
            </div>

            <div>
              <h3 className="font-display text-xl text-[#303B32]">
                API activity
              </h3>
              <p className="text-[11px] text-[#92948A] mt-1">
                Requests made during your analysis
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[#92948A] hover:text-[#303B32] hover:bg-[#F1F1EB] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 gap-3 p-5 sm:px-7 border-b border-[#ECEBE5] bg-[#FAFAF7]">
          <div className="rounded-xl border border-[#EAEAE2] bg-white p-4">
            <p className="text-[10px] uppercase tracking-wider text-[#999B91] font-semibold">
              Total requests
            </p>
            <p className="font-display text-2xl text-[#303B32] mt-2">
              {logs.length}
            </p>
          </div>

          <div className="rounded-xl border border-[#EAEAE2] bg-white p-4">
            <p className="text-[10px] uppercase tracking-wider text-[#999B91] font-semibold">
              Successful requests
            </p>
            <p className="font-display text-2xl text-[#5C8051] mt-2">
              {logs.filter((log) => log.status >= 200 && log.status < 300).length}
            </p>
          </div>
        </div>

        {/* Request list */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-4 flex-1">

          {logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-16">
              <div className="w-14 h-14 rounded-2xl bg-[#F1F2EC] flex items-center justify-center mb-5">
                <Terminal className="w-6 h-6 text-[#8B967E]" />
              </div>

              <h4 className="font-display text-xl text-[#394339]">
                Nothing to show yet
              </h4>

              <p className="text-xs text-[#999B91] mt-2 max-w-xs leading-6">
                Your API requests will appear here once an analysis has run.
              </p>
            </div>
          ) : (
            logs.map((log, index) => (
              <article
                key={index}
                className="rounded-2xl border border-[#E9E9E1] overflow-hidden"
              >
                {/* Request heading */}
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FCFCFA]">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="px-2.5 py-1 rounded-md bg-[#EDF1E8] text-[#637B55] text-[10px] font-bold uppercase">
                      {log.method}
                    </span>

                    <span className="text-xs sm:text-sm font-semibold text-[#414A40] break-all">
                      {log.endpoint}
                    </span>
                  </div>

                  <div className="flex items-center flex-wrap gap-3 text-[10px]">
                    <span className="flex items-center gap-1.5 text-[#92948A]">
                      <Clock className="w-3.5 h-3.5" />
                      {log.durationMs} ms
                    </span>

                    <span className={`inline-flex items-center gap-1.5 font-semibold ${
                      log.status >= 200 && log.status < 300
                        ? 'text-[#638354]'
                        : 'text-[#B77751]'
                    }`}>
                      {log.status >= 200 && log.status < 300 ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5" />
                      )}

                      {log.status}
                    </span>

                    {log.isMocked && (
                      <span className="text-[#A18350] bg-[#F8F2E7] px-2 py-1 rounded-md">
                        Fixture data
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 sm:p-5 space-y-5">

                  {/* Parameters */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Code2 className="w-3.5 h-3.5 text-[#819173]" />
                      <p className="text-[10px] uppercase tracking-[0.14em] font-bold text-[#92958A]">
                        Request parameters
                      </p>
                    </div>

                    <div className="bg-[#F7F8F5] rounded-xl border border-[#EAECE5] p-4 overflow-x-auto">
                      {Object.entries(log.queryParams).map(([k, v]) => (
                        <div
                          key={k}
                          className="flex flex-wrap gap-x-2 py-1 text-[11px] font-mono"
                        >
                          <span className="text-[#71845F]">{k}</span>
                          <span className="text-[#A0A297]">=</span>
                          <span className="text-[#505B4E] break-all">
                            {String(v)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Response */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Terminal className="w-3.5 h-3.5 text-[#819173]" />
                      <p className="text-[10px] uppercase tracking-[0.14em] font-bold text-[#92958A]">
                        Response preview
                      </p>
                    </div>

                    <pre className="bg-[#29382F] text-[#D5DFC9] rounded-xl p-4 text-[11px] leading-6 overflow-x-auto whitespace-pre-wrap break-all font-mono max-h-[260px] overflow-y-auto">
                      {log.responsePreview}
                    </pre>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-7 py-4 border-t border-[#ECEBE5] flex items-center justify-between bg-[#FAFAF7]">
          <div className="flex items-center gap-2 text-[10px] text-[#96988E]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8A9B76]" />
            API request history
          </div>

          <span className="text-[10px] text-[#A3A49A]">
            Qloo REST API
          </span>
        </div>
      </div>
    </div>
  );
};