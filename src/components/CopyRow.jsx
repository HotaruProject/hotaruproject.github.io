import React from 'react';
import { Check, Copy, TriangleAlert } from 'lucide-react';
import { useCopy } from '../lib/useCopy.jsx';

export function CopyRow({ value, label, copiedLabel, failedLabel, className = '', children }) {
  const [state, copy] = useCopy();
  const copied = state === 'copied';
  const failed = state === 'failed';
  const text = copied ? copiedLabel : failed ? failedLabel : label;

  return (
    <button
      type="button"
      onClick={() => copy(value)}
      className={`${className} ${copied ? 'copy-row--done' : ''} ${failed ? 'copy-row--fail' : ''}`}
      aria-label={`${text}: ${value}`}
      title={text}
    >
      {children}
      <span className="copy-row__icon" aria-hidden="true">
        {copied ? (
          <Check className="w-3.5 h-3.5" />
        ) : failed ? (
          <TriangleAlert className="w-3.5 h-3.5" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
      </span>
    </button>
  );
}
