'use client';

import React, { useEffect, useState } from 'react';
import { getBotanicalPlate } from '../utils/wordBotanicalPlates';
import { X } from 'lucide-react';

interface BotanicalPlateSpecimenProps {
  word: string;
  variant?: 'dossier' | 'reveal' | 'game-bg' | 'flashcard';
  showCaption?: boolean;
  className?: string;
}

/**
 * Renders a subtle, background-watermarked public-domain vintage botanical plate
 * inside a `relative overflow-hidden` parent card (using `object-contain` so the
 * full plate fits cleanly without edge cropping), plus an optional quiet italic
 * species footnote that opens the full-resolution Herbarium Lightbox on click.
 */
export const BotanicalPlateSpecimen: React.FC<BotanicalPlateSpecimenProps> = ({
  word,
  variant = 'reveal',
  showCaption = true,
  className = '',
}) => {
  const plate = getBotanicalPlate(word);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setFailed(false);
    setLightboxOpen(false);
  }, [word]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setLightboxOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxOpen]);

  if (!plate || failed) return null;

  const watermarkOpacity =
    variant === 'flashcard'
      ? 'opacity-[0.16] sm:opacity-[0.20] p-4 sm:p-6'
      : variant === 'game-bg'
      ? 'opacity-[0.26] sm:opacity-[0.32] p-3 sm:p-5'
      : variant === 'dossier'
      ? 'opacity-[0.28] sm:opacity-[0.32] p-3 sm:p-4'
      : 'opacity-[0.25] sm:opacity-[0.29] p-2 sm:p-3';

  return (
    <>
      {/* Full-Card Uncropped Background Herbarium Engraving (melts into parchment via mix-blend-multiply) */}
      <div
        aria-hidden="true"
        className={`pointer-events-none select-none absolute inset-0 z-0 overflow-hidden flex items-center justify-center ${watermarkOpacity}`}
      >
        <img
          src={plate.thumbUrl}
          alt=""
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`w-full h-full object-contain object-center mix-blend-multiply transition-opacity duration-700 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>

      {/* Noticeable Clickable Species & Source Pill (opens full Herbarium Lightbox) */}
      {showCaption && (
        <div className={`relative z-10 flex justify-end ${className}`}>
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="inline-flex flex-wrap items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF6EA]/95 hover:bg-[#EDF5EB] text-emerald-950 border border-[#C6DEC2] hover:border-emerald-600 shadow-xs text-[11px] sm:text-xs transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600"
            title={`View full vintage botanical plate & source (${plate.sourceAtlas})`}
          >
            <span aria-hidden="true">🖼️</span>
            <span className="serif italic font-semibold">{plate.scientificName}</span>
            {plate.commonName && (
              <span className="font-medium not-italic text-emerald-900">
                · {plate.commonName}
              </span>
            )}
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 underline underline-offset-2 ml-0.5">
              Full plate &amp; source ↗
            </span>
          </button>
        </div>
      )}

      {/* Full Herbarium Plate Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[120] bg-emerald-950/85 backdrop-blur-md flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Botanical plate for ${plate.scientificName}`}
          onClick={(e) => {
            if (e.target === e.currentTarget) setLightboxOpen(false);
          }}
        >
          <div className="journal-card w-full max-w-lg max-h-[90vh] rounded-3xl overflow-hidden flex flex-col animate-scale-in">
            <div className="px-5 py-3.5 border-b border-[#DCE5D5] bg-[#FAF6EA] flex items-center justify-between gap-3 shrink-0">
              <div className="min-w-0">
                <span className="text-[9.5px] font-black uppercase tracking-widest text-amber-800 block">
                  Herbarium Plate · {word}
                </span>
                <h4 className="serif text-lg sm:text-xl font-bold text-emerald-950 truncate">
                  {plate.commonName ? `${plate.commonName} ` : ''}
                  <span className="italic font-normal text-emerald-800 text-base">
                    ({plate.scientificName})
                  </span>
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="p-2 rounded-full hover:bg-emerald-100 text-emerald-800 transition-colors shrink-0"
                aria-label="Close plate viewer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 bg-[#F8F3E4] flex items-center justify-center overflow-y-auto">
              <img
                src={plate.fullUrl || plate.thumbUrl}
                alt={`${plate.scientificName} public domain botanical illustration`}
                referrerPolicy="no-referrer"
                className="max-h-[64vh] w-auto object-contain rounded-xl mix-blend-multiply"
              />
            </div>

            <div className="px-5 py-3 border-t border-[#DCE5D5] bg-[#FAF7EE] flex flex-wrap items-center justify-between gap-2 text-[11px] text-emerald-800 shrink-0">
              <span className="font-semibold">
                {plate.sourceAtlas} · Public Domain (Wikimedia Commons)
              </span>
              <button
                type="button"
                onClick={() => setLightboxOpen(false)}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-black uppercase tracking-wider transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
