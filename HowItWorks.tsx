@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');
@import "tailwindcss";

@theme {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Outfit", sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;

  --color-germany-black: #111111;
  --color-germany-red: #E3000F;
  --color-germany-yellow: #FFCC00;

  --color-sleek-navy: #001F3F;
  --color-sleek-navy-light: #003366;
  --color-sleek-navy-dark: #001124;
  --color-sleek-red: #E3000F;
  --color-sleek-yellow: #FFCC00;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-sans);
  background-color: #f8fafc;
  color: #0f172a;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

/* Hide scrollbar for clean loading screen */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.glow-navy {
  box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.12), 0 2px 8px -1px rgba(15, 23, 42, 0.08);
}

.glow-gold {
  box-shadow: 0 4px 25px -4px rgba(255, 204, 0, 0.25);
}

.text-gradient {
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
