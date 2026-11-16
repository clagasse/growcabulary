'use client';

import React, { useState } from 'react';
import {
  MessageSquare,
  Coffee,
  X,
  Send,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

type FeedbackCategory = 'bug' | 'word-suggestion' | 'feature' | 'general';

const CATEGORY_OPTIONS: { id: FeedbackCategory; label: string; emoji: string }[] = [
  { id: 'word-suggestion', label: 'Word Suggestion', emoji: '📚' },
  { id: 'bug', label: 'Bug Report', emoji: '🐛' },
  { id: 'feature', label: 'Feature Idea', emoji: '💡' },
  { id: 'general', label: 'General', emoji: '💬' },
];

export const SUPPORT_URL = (process.env.NEXT_PUBLIC_SUPPORT_URL || '').trim();

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEmail?: string;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  isOpen,
  onClose,
  defaultEmail = '',
}) => {
  const [category, setCategory] = useState<FeedbackCategory>('general');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState(defaultEmail);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorState, setErrorState] = useState<{ text: string; fallbackUrl?: string } | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    setSubmitted(false);
    setErrorState(null);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setErrorState(null);

    if (message.trim().length < 5) {
      setErrorState({ text: 'Please enter at least 5 characters.' });
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          message: message.trim(),
          userEmail: email.trim() || defaultEmail || '',
          pageUrl: typeof window !== 'undefined' ? window.location.pathname : '',
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; fallbackUrl?: string };
      if (!res.ok || !data.ok) {
        setErrorState({
          text: data.error || 'Could not submit feedback.',
          fallbackUrl: data.fallbackUrl,
        });
        return;
      }

      setSubmitted(true);
      setMessage('');
    } catch {
      setErrorState({
        text: 'Network error while sending feedback.',
        fallbackUrl: 'https://github.com/clagasse/growcabulary/issues/new',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[115] bg-emerald-950/85 backdrop-blur-md flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="feedback-modal-title"
    >
      <div className="journal-card w-full max-w-md rounded-3xl overflow-hidden animate-scale-in">
        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-[#DCE5D5]">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-800" />
              <h2 id="feedback-modal-title" className="serif text-xl font-bold text-emerald-950">
                Send Feedback
              </h2>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="p-1.5 rounded-full text-emerald-700 hover:bg-emerald-50 hover:text-emerald-950 transition-colors"
              aria-label="Close feedback modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {submitted ? (
            <div className="py-6 text-center space-y-4">
              <CheckCircle2 className="w-11 h-11 text-emerald-700 mx-auto" />
              <div>
                <h3 className="serif text-xl font-bold text-emerald-950 mb-1">
                  Thank you for the feedback!
                </h3>
                <p className="text-xs sm:text-sm text-emerald-800">
                  Your note has been saved for the developer.
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-black uppercase tracking-wider"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-emerald-700 mb-1.5">
                  Topic
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  {CATEGORY_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setCategory(opt.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border text-left transition-all ${
                        category === opt.id
                          ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm'
                          : 'bg-[#FAF7EE] text-emerald-900 border-[#DCE5D5] hover:bg-emerald-50'
                      }`}
                    >
                      {opt.emoji} {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="feedback-message"
                  className="block text-[10px] font-black uppercase tracking-wider text-emerald-700 mb-1"
                >
                  Message
                </label>
                <textarea
                  id="feedback-message"
                  rows={4}
                  required
                  maxLength={2000}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share a bug, word suggestion, or idea for Growcabulary..."
                  className="w-full p-3 rounded-xl bg-[#FAF7EE] border border-[#C8D8C2] focus:border-emerald-700 focus:bg-[#FFFDF8] outline-none text-sm text-emerald-950 resize-none"
                />
              </div>

              <div>
                <label
                  htmlFor="feedback-email"
                  className="block text-[10px] font-black uppercase tracking-wider text-emerald-700 mb-1"
                >
                  Reply Email (Optional)
                </label>
                <input
                  id="feedback-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3 py-2 rounded-xl bg-[#FAF7EE] border border-[#C8D8C2] focus:border-emerald-700 focus:bg-[#FFFDF8] outline-none text-xs sm:text-sm text-emerald-950"
                />
              </div>

              {errorState && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs font-bold space-y-1.5">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" />
                    <span>{errorState.text}</span>
                  </div>
                  {errorState.fallbackUrl && (
                    <a
                      href={errorState.fallbackUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 underline text-emerald-900"
                    >
                      <span>Open GitHub Issues instead</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 disabled:opacity-60 text-white text-xs font-black uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Sending...' : 'Send Feedback'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

interface SupportNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenFeedback: () => void;
}

export const SupportNoticeModal: React.FC<SupportNoticeModalProps> = ({
  isOpen,
  onClose,
  onOpenFeedback,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[115] bg-emerald-950/85 backdrop-blur-md flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="support-modal-title"
    >
      <div className="journal-card w-full max-w-sm rounded-3xl p-6 text-center space-y-4 animate-scale-in">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
          <Coffee className="w-6 h-6" />
        </div>
        <div>
          <h2 id="support-modal-title" className="serif text-xl font-bold text-emerald-950 mb-1.5">
            Support Growcabulary
          </h2>
          <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
            A direct support link is coming soon! In the meantime, sharing feedback or word ideas
            helps keep Growcabulary growing ad-free.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenFeedback();
            }}
            className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-black uppercase tracking-wider"
          >
            💬 Share Feedback
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#F4F7F0] hover:bg-emerald-100 text-emerald-900 border border-[#DCE5D5] text-xs font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
