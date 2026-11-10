import React from 'react';
import { Check, Copy, TriangleAlert } from 'lucide-react';
import { useCopy } from '../lib/useCopy.js';

export function CopyChip({ value, label, copiedLabel, failedLabel, className = '', compact = false }) {
  const [state, copy] = useCopy();
  const copied = state === 'copied';
  const failed = state === 'failed';

  const text = copied ? copiedLabel : failed ? failedLabel : label;

  return (
    <button
      type="button"
      onClick={() => copy(value)}
      className={`chip chip--copy ${copied ? 'chip--done' : ''} ${failed ? 'chip--fail' : ''} ${compact ? 'chip--icon' : ''} ${className}`}
      title={text}
      aria-label={text}
    >
      {copied ? (
        <Check aria-hidden="true" className="w-3.5 h-3.5" />
      ) : failed ? (
        <TriangleAlert aria-hidden="true" className="w-3.5 h-3.5" />
      ) : (
        <Copy aria-hidden="true" className="w-3.5 h-3.5" />
      )}
      {compact ? null : <span className="chip__text">{text}</span>}
    </button>
  );
}
