import React from 'react';
import { Check, Copy, TriangleAlert } from 'lucide-react';
import { useCopy } from '../lib/useCopy.js';

export function CopyBlock({ code, label, copyLabel, copiedLabel, failedLabel, className = '', stacked = false }) {
  const [state, copy] = useCopy();
  const copied = state === 'copied';
  const failed = state === 'failed';
  const text = copied ? copiedLabel : failed ? failedLabel : copyLabel;

  const button = (
    <button
      type="button"
      onClick={() => copy(code)}
      className={`copy-block__copy ${failed ? 'copy-block__copy--fail' : ''}`}
      title={text}
      aria-label={text}
    >
      {copied ? (
        <Check aria-hidden="true" className="w-4 h-4" />
      ) : failed ? (
        <TriangleAlert aria-hidden="true" className="w-4 h-4" />
      ) : (
        <Copy aria-hidden="true" className="w-4 h-4" />
      )}
      <span className="copy-block__copy-text">{text}</span>
    </button>
  );

  if (stacked) {
    return (
      <div className={`copy-block copy-block--stacked ${className}`}>
        <div className="copy-block__head">
          {label ? <p className="copy-block__label">{label}</p> : <span />}
          {button}
        </div>
        <pre className="copy-block__code">
          <code>{code}</code>
        </pre>
      </div>
    );
  }

  return (
    <div className={`copy-block ${className}`}>
      {label ? <p className="copy-block__label">{label}</p> : null}
      <div className="copy-block__row">
        <pre className="copy-block__code">
          <code>{code}</code>
        </pre>
        {button}
      </div>
    </div>
  );
}
