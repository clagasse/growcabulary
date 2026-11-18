'use client';

import React, { useEffect, useState } from 'react';
import { Volume2 } from 'lucide-react';

let activeUtteranceRef: SpeechSynthesisUtterance | null = null;

export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function speakWord(
  word: string,
  callbacks?: { onStart?: () => void; onEnd?: () => void }
): boolean {
  if (!isSpeechSupported() || !word.trim()) return false;
  try {
    const synth = window.speechSynthesis;
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(word.trim());
    const voices = synth.getVoices();
    const preferredVoice =
      voices.find((v) => /^en-US$/i.test(v.lang) && !v.localService) ||
      voices.find((v) => /^en-(US|GB)$/i.test(v.lang)) ||
      voices.find((v) => v.lang.toLowerCase().startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }
    utterance.lang = preferredVoice?.lang || 'en-US';
    utterance.rate = 0.92;
    utterance.pitch = 1;

    utterance.onstart = () => callbacks?.onStart?.();
    utterance.onend = () => {
      if (activeUtteranceRef === utterance) activeUtteranceRef = null;
      callbacks?.onEnd?.();
    };
    utterance.onerror = () => {
      if (activeUtteranceRef === utterance) activeUtteranceRef = null;
      callbacks?.onEnd?.();
    };

    activeUtteranceRef = utterance;
    synth.speak(utterance);
    return true;
  } catch {
    callbacks?.onEnd?.();
    return false;
  }
}

interface SpeakWordButtonProps {
  word: string;
  size?: 'xs' | 'sm' | 'md';
  showLabel?: boolean;
  className?: string;
}

export const SpeakWordButton: React.FC<SpeakWordButtonProps> = ({
  word,
  size = 'sm',
  showLabel = false,
  className = '',
}) => {
  const [supported, setSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    setSupported(isSpeechSupported());
    return () => {
      setIsSpeaking(false);
    };
  }, [word]);

  if (!supported || !word.trim()) return null;

  const sizeClasses =
    size === 'xs'
      ? 'px-1.5 py-0.5 text-[10px]'
      : size === 'md'
      ? 'px-3 py-1.5 text-xs'
      : 'px-2.5 py-1 text-[11px]';

  const iconClasses = size === 'xs' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5';

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        speakWord(word, {
          onStart: () => setIsSpeaking(true),
          onEnd: () => setIsSpeaking(false),
        });
      }}
      title={`Pronounce "${word}" (S)`}
      aria-label={`Pronounce "${word}"`}
      className={`inline-flex items-center gap-1 rounded-full border font-bold transition-all shrink-0 ${sizeClasses} ${
        isSpeaking
          ? 'bg-emerald-700 text-white border-emerald-900 shadow-sm scale-[1.03]'
          : 'bg-[#EDF5EB] hover:bg-emerald-200/80 text-emerald-900 border-[#C6DEC2]'
      } ${className}`}
    >
      <Volume2 className={`${iconClasses} ${isSpeaking ? 'animate-pulse' : ''}`} />
      {showLabel && <span>{isSpeaking ? 'Speaking…' : 'Pronounce'}</span>}
    </button>
  );
};
