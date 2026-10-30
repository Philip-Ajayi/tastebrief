'use client';

import React, { useState } from 'react';
import {
  X,
  KeyRound,
  Check,
  ShieldCheck,
  Info,
  LockKeyhole,
} from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172019]/55 backdrop-blur-sm animate-fadeIn">

      <div className="bg-white border border-[#E8E8DF] rounded-[26px] w-full max-w-[470px] shadow-[0_25px_100px_rgba(0,0,0,0.2)] overflow-hidden">

        <div className="bg-[#29382F] p-6 sm:p-7 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-40 h-40 rounded-full border border-white/10 translate-x-1/3 -translate-y-1/3" />

          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="relative z-10">
            <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center mb-5">
              <KeyRound className="w-5 h-5 text-[#D0DABF]" />
            </div>

            <h3 className="font-display text-2xl text-white">
              Connect your accounts
            </h3>
            <p className="text-xs text-white/55 mt-2 leading-6 max-w-xs">
              Add your API keys to connect TasteBrief to live taste data and recommendations.
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="p-6 sm:p-7 space-y-5">

          <div>
            <label className="field-label">
              Qloo API key
            </label>
            <input
              type="password"
              value={qloo}
              onChange={(e) => setQloo(e.target.value)}
              placeholder="Enter your Qloo API key"
              className="premium-input"
              required
            />
            <p className="text-[10px] text-[#A0A196] mt-2">
              Used to retrieve venue and cultural preferences.
            </p>
          </div>

          <div>
            <label className="field-label">
              Google Gemini API key
            </label>
            <input
              type="password"
              value={gemini}
              onChange={(e) => setGemini(e.target.value)}
              placeholder="Enter your Gemini API key"
              className="premium-input"
              required
            />
            <p className="text-[10px] text-[#A0A196] mt-2">
              Used to prepare your recommendations.
            </p>
          </div>

          <div className="rounded-xl bg-[#F5F7F2] border border-[#E6EBDF] p-4 flex items-start gap-3">
            <LockKeyhole className="w-4 h-4 text-[#738667] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-[#506047]">
                Your keys stay in your browser
              </p>
              <p className="text-[11px] text-[#899183] mt-1 leading-5">
                Keys are saved in this browser and sent with analysis requests.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 text-xs font-semibold text-[#777B70] hover:text-[#333F35] transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 min-w-[155px] px-5 py-3 rounded-xl bg-[#354B3C] text-white text-xs font-semibold hover:bg-[#26392D] transition-colors"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4" />
                  Saved
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  Save and connect
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};