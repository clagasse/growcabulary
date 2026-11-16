'use client';

import React, { useState } from 'react';
import { MessageSquare, Coffee } from 'lucide-react';
import { FeedbackModal, SUPPORT_URL } from './FeedbackModal';

export const HelpFeedbackSupportActions: React.FC = () => {
  const [showFeedback, setShowFeedback] = useState(false);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setShowFeedback(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF7EE] hover:bg-emerald-50 text-emerald-900 border border-[#DCE5D5] text-xs font-bold transition-colors"
        >
          <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
          <span>Send Feedback</span>
        </button>

        {SUPPORT_URL && (
          <a
            href={SUPPORT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-colors"
          >
            <Coffee className="w-3.5 h-3.5 text-amber-700" />
            <span>Support the Developer</span>
          </a>
        )}
      </div>

      <FeedbackModal isOpen={showFeedback} onClose={() => setShowFeedback(false)} />
    </>
  );
};
