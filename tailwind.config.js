const token = (name) => `var(--${name})`;

export default {
  content: ["./index.html", "./src/**/*.jsx"],
  theme: {
    extend: {
      colors: {
        ink: token('color-ink'),
        'ink-2': token('color-ink-2'),
        muted: token('color-muted'),
        rule: token('color-rule'),
        focus: token('color-focus'),
      },
      fontFamily: {
        display: token('font-display'),
      },
      fontSize: {
        poster: [token('text-poster'), { lineHeight: '0.92' }],
      },
      maxWidth: {
        container: token('container'),
      },
      borderRadius: {
        input: token('radius-control'),
      },
      zIndex: {
        base: '1',
        raised: '10',
        'sticky-nav': '300',
      },
    },
  },
  plugins: [],
}
