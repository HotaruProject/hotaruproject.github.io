import React, { useEffect, useRef, useState } from 'react';

export function RevealGroup({ as: Tag = 'div', className = '', delay = 0, children }) {
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
      if (rect.top < window.innerHeight * 1.12 && rect.bottom > 0) reveal();
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
      { threshold: 0.02, rootMargin: '0px 0px 12% 0px' }
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

  const items = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    const cls = child.props.className ? `${child.props.className} keep-motion` : 'keep-motion';
    return React.cloneElement(child, { className: cls });
  });

  return (
    <Tag
      ref={ref}
      style={delay ? { '--base': delay } : undefined}
      className={`reveal-group ${shown ? 'reveal-group--shown' : ''} ${className}`}
    >
      {items}
    </Tag>
  );
}
