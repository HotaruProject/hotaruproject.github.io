import { useCallback, useEffect, useRef, useState } from 'react';

function fallbackCopy(text) {
  const field = document.createElement('textarea');
  field.value = text;
  field.setAttribute('readonly', '');
  field.style.position = 'fixed';
  field.style.top = '0';
  field.style.opacity = '0';
  document.body.appendChild(field);
  field.select();
  let done = false;
  try {
    done = document.execCommand('copy');
  } catch {
    done = false;
  }
  document.body.removeChild(field);
  return done;
}

export function useCopy(timeout = 1800) {
  const [state, setState] = useState('idle');
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = useCallback(
    (text) => {
      const fallback = () => fallbackCopy(text);
      const request =
        navigator.clipboard && navigator.clipboard.writeText
          ? navigator.clipboard.writeText(text).catch(fallback)
          : Promise.resolve(fallback());

      request.then(
        (result) => {
          setState(result === false ? 'failed' : 'copied');
          window.clearTimeout(timer.current);
          timer.current = window.setTimeout(() => setState('idle'), timeout);
        },
        () => {
          setState('failed');
          window.clearTimeout(timer.current);
          timer.current = window.setTimeout(() => setState('idle'), timeout);
        }
      );
    },
    [timeout]
  );

  return [state, copy];
}
