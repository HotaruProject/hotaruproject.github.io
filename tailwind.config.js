const token = (name) => `var(--${name})`;

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: token('color-paper'),
        'paper-2': token('color-paper-2'),
        'paper-3': token('color-paper-3'),
        ink: token('color-ink'),
        'ink-2': token('color-ink-2'),
        muted: token('color-muted'),
        rule: token('color-rule'),
        'rule-2': token('color-rule-2'),
        accent: token('color-accent'),
        'accent-ink': token('color-accent-ink'),
        focus: token('color-focus'),
        scrim: token('color-scrim'),
        success: token('color-success'),
      },
      fontFamily: {
        display: token('font-display'),
        sans: token('font-body'),
        mono: token('font-outlier'),
      },
      fontSize: {
        poster: [token('text-poster'), { lineHeight: '0.92' }],
        display: [token('text-display'), { lineHeight: '1.02' }],
        section: [token('text-section'), { lineHeight: '1.05' }],
        title: [token('text-title'), { lineHeight: '1.2' }],
        lead: [token('text-lead'), { lineHeight: '1.45' }],
      },
      maxWidth: {
        container: token('container'),
      },
      borderRadius: {
        card: token('radius-card'),
        input: token('radius-input'),
        pill: token('radius-pill'),
      },
      transitionTimingFunction: {
        out: token('ease-out'),
      },
      transitionDuration: {
        micro: '120ms',
        short: '220ms',
      },
      zIndex: {
        base: '1',
        raised: '10',
        dropdown: '100',
        sticky: '200',
        'sticky-nav': '300',
      },
    },
  },
  plugins: [],
}
