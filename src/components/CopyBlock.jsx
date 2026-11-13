import React from 'react';
import { Check, Copy, TriangleAlert } from 'lucide-react';
import { useCopy } from '../lib/useCopy.jsx';
import { codeText } from '../lib/codeText.jsx';

export function CopyState({ state, copyLabel, copiedLabel, failedLabel, className = '' }) {
  const copied = state === 'copied';
  const failed = state === 'failed';
  const text = copied ? copiedLabel : failed ? failedLabel : copyLabel;

  return (
    <span
      className={`copy-state ${copied ? 'copy-state--done' : ''} ${failed ? 'copy-state--fail' : ''} ${className}`}
      aria-live="polite"
    >
      {copied ? (
        <Check aria-hidden="true" className="w-3.5 h-3.5" />
      ) : failed ? (
        <TriangleAlert aria-hidden="true" className="w-3.5 h-3.5" />
      ) : (
        <Copy aria-hidden="true" className="w-3.5 h-3.5" />
      )}
      <span className="copy-state__text">{text}</span>
    </span>
  );
}

export function CopyBlock({ code, label, copyLabel, copiedLabel, failedLabel, className = '', stacked = false }) {
  const [state, copy] = useCopy();

  const codeButton = (
    <button
      type="button"
      onClick={() => copy(code)}
      className={`copy-block__code ${state === 'copied' ? 'copy-block__code--done' : ''}`}
      title={copyLabel}
    >
      <code>{codeText(code)}</code>
      <span className="visually-hidden">{copyLabel}</span>
    </button>
  );

  const stateMark = (
    <CopyState
      state={state}
      copyLabel={copyLabel}
      copiedLabel={copiedLabel}
      failedLabel={failedLabel}
    />
  );

  if (stacked) {
    return (
      <div className={`copy-block copy-block--stacked ${className}`}>
        <div className="copy-block__head">
          {label ? <p className="copy-block__label">{label}</p> : <span />}
          {stateMark}
        </div>
        {codeButton}
      </div>
    );
  }

  return (
    <div className={`copy-block ${className}`}>
      {label ? <p className="copy-block__label">{label}</p> : null}
      <div className="copy-block__row">
        {codeButton}
        {stateMark}
      </div>
    </div>
  );
}
