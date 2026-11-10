import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';

export function CopyChip({ value, label, copiedLabel, className = '', compact = false }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = useCallback(
    (event) => {
      event.stopPropagation();
      navigator.clipboard?.writeText(value).then(
        () => {
          setCopied(true);
          window.clearTimeout(timer.current);
          timer.current = window.setTimeout(() => setCopied(false), 1600);
        },
        () => {}
      );
    },
    [value]
  );

  return (
    <button
      type="button"
      onClick={copy}
      className={`chip chip--copy ${copied ? 'chip--done' : ''} ${compact ? 'chip--icon' : ''} ${className}`}
      title={copied ? copiedLabel : label}
      aria-label={copied ? copiedLabel : label}
    >
      {copied ? (
        <Check aria-hidden="true" className="w-3.5 h-3.5" />
      ) : (
        <Copy aria-hidden="true" className="w-3.5 h-3.5" />
      )}
      {compact ? null : <span className="chip__text">{copied ? copiedLabel : label}</span>}
    </button>
  );
}
