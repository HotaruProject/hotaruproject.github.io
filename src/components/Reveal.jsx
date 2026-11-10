import React, { useEffect, useRef, useState } from 'react';

export function Reveal({ as: Tag = 'div', className = '', delay = 0, children }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true);
      return undefined;
    }

    let frame = 0;
    const reveal = () => setShown(true);
    const check = () => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.94 && rect.bottom > 0) reveal();
    };
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        check();
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) reveal();
        });
      },
      { threshold: 0.04, rootMargin: '0px 0px -6% 0px' }
    );
    observer.observe(el);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    const timer = window.setTimeout(check, 1200);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.clearTimeout(timer);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const style = delay ? { transitionDelay: `${delay}ms` } : undefined;

  return (
    <Tag ref={ref} style={style} className={`reveal ${shown ? 'reveal--shown' : ''} ${className}`}>
      {children}
    </Tag>
  );
}
