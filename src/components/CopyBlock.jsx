import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';

export function CopyBlock({ code, label, copyLabel, copiedLabel, className = '', stacked = false }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = useCallback(() => {
    navigator.clipboard?.writeText(code).then(
      () => {
        setCopied(true);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setCopied(false), 2000);
      },
      () => {}
    );
  }, [code]);

  const button = (
    <button
      type="button"
      onClick={copy}
      className="copy-block__copy"
      title={copied ? copiedLabel : copyLabel}
      aria-label={copied ? copiedLabel : copyLabel}
    >
      {copied ? (
        <Check aria-hidden="true" className="w-4 h-4" />
      ) : (
        <Copy aria-hidden="true" className="w-4 h-4" />
      )}
      <span className="copy-block__copy-text">{copied ? copiedLabel : copyLabel}</span>
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
