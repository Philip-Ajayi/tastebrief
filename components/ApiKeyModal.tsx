'use client';

import React, { useState } from 'react';
import { X, Key, Check } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveKeys: (qlooKey: string, geminiKey: string) => void;
  currentQlooKey: string;
  currentGeminiKey: string;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  onSaveKeys,
  currentQlooKey,
  currentGeminiKey,
}) => {
  const [qloo, setQloo] = useState(currentQlooKey);
  const [gemini, setGemini] = useState(currentGeminiKey);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveKeys(qloo, gemini);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-surface border border-surface-border rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 mb-4">
          <Key className="w-5 h-5 text-brand-400" />
          <h3 className="text-base font-bold text-white">Live API Key Configuration</h3>
        </div>

        <p className="text-xs text-gray-400 mb-4 leading-relaxed">
          Provide your live hackathon API keys below to query Qloo v2 and Gemini 1.5 Flash in real time. If left blank, the system automatically uses verified empirical fixtures.
        </p>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-gray-300 mb-1">
              Qloo Hackathon API Key (<code className="text-brand-300">x-api-key</code>)
            </label>
            <input
              type="password"
              value={qloo}
              onChange={(e) => setQloo(e.target.value)}
              placeholder="e.g. qloo_live_..."
              className="w-full bg-surface-elevated border border-surface-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-gray-300 mb-1">
              Google AI Studio Gemini API Key
            </label>
            <input
              type="password"
              value={gemini}
              onChange={(e) => setGemini(e.target.value)}
              placeholder="e.g. AIzaSy..."
              className="w-full bg-surface-elevated border border-surface-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500 font-mono"
            />
          </div>

          <div className="pt-2 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-surface-elevated text-xs text-gray-300 hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-xs font-semibold text-white transition-colors"
            >
              {saved ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Keys</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
