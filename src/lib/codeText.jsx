import { Fragment } from 'react';

const BREAK_AFTER = '/.,:;()[]{}<>';

export function codeText(text) {
  if (!text) return null;
  const chunks = [];
  let current = '';
  for (const ch of text) {
    current += ch;
    if (BREAK_AFTER.includes(ch)) {
      chunks.push(current);
      current = '';
    }
  }
  if (current) chunks.push(current);
  return chunks.map((chunk, index) => (
    <Fragment key={index}>
      {chunk}
      {index < chunks.length - 1 ? <wbr /> : null}
    </Fragment>
  ));
}
