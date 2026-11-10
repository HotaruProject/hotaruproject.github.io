import React, { useEffect, useRef, useState } from 'react';

export function RevealGroup({ as: Tag = 'div', className = '', children }) {
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
    let observer = null;
    const reveal = () => {
      setShown(true);
      if (observer) observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
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

    observer = new IntersectionObserver(
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
      if (observer) observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.clearTimeout(timer);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <Tag ref={ref} className={`reveal-group ${shown ? 'reveal-group--shown' : ''} ${className}`}>
      {children}
    </Tag>
  );
}
