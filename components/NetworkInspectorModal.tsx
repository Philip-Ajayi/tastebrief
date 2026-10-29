'use client';

import React from 'react';
import { NetworkCallLog } from '@/types';
import { X, Terminal, Clock, CheckCircle2, AlertCircle } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-surface border border-surface-border rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-surface-border flex items-center justify-between bg-surface-elevated/50">
          <div className="flex items-center space-x-2">
            <Terminal className="w-5 h-5 text-brand-400" />
            <h3 className="text-sm font-mono font-bold text-white">
              Live Qloo v2 Network & Telemetry Inspector
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-surface-elevated transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4 font-mono text-xs">
          {logs.length === 0 ? (
            <div className="text-gray-400 text-center py-12">
              No network requests executed yet. Run an analysis above.
            </div>
          ) : (
            logs.map((log, index) => (
              <div
                key={index}
                className="bg-background border border-surface-border rounded-xl p-4 space-y-2 text-gray-300"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-surface-border/50">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded bg-brand-500/20 text-brand-400 font-bold">
                      {log.method}
                    </span>
                    <span className="text-white font-semibold">{log.endpoint}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-[11px]">
                    <span className="flex items-center text-gray-400">
                      <Clock className="w-3 h-3 mr-1" />
                      {log.durationMs}ms
                    </span>
                    <span
                      className={`flex items-center font-bold ${
                        log.status === 200 ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      {log.status === 200 ? (
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                      ) : (
                        <AlertCircle className="w-3 h-3 mr-1" />
                      )}
                      HTTP {log.status} {log.isMocked && '(Fixture Verified)'}
                    </span>
                  </div>
                </div>

                {/* Query Params */}
                <div>
                  <span className="text-gray-500 text-[10px]">RESOLVED QUERY PARAMETERS:</span>
                  <div className="bg-surface-elevated/50 p-2 rounded mt-1 overflow-x-auto text-gray-200">
                    {Object.entries(log.queryParams).map(([k, v]) => (
                      <div key={k}>
                        <span className="text-brand-300">{k}</span> = <span className="text-white">&quot;{v}&quot;</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div>
                  <span className="text-gray-500 text-[10px]">PAYLOAD PREVIEW:</span>
                  <pre className="bg-surface-elevated/30 p-2 rounded mt-1 overflow-x-auto text-[11px] text-emerald-400/90 font-mono">
                    {log.responsePreview}
                  </pre>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-surface-elevated/40 border-t border-surface-border flex items-center justify-between text-[11px] text-gray-400 font-mono">
          <span>Qloo REST Protocol v2</span>
          <span>Zero User PII Transmitted</span>
        </div>
      </div>
    </div>
  );
};
