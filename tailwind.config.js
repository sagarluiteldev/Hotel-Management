/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      colors: {
        appBg: "#EAF0F6",
        cardBg: "#FFFFFF",
        textMain: "#111827",
        textMuted: "#6B7280",
        primary: "#111827",
        accentTeal: "#A5F3FC",
        accentBlue: "#C7D2FE",
        accentPurple: "#DDD6FE",
        accentGreen: "#D1FAE5",
        badgeBg: "#E0F2FE",
        badgeText: "#0369A1"
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem"
      },
      boxShadow: {
        soft: "0 20px 40px -15px rgba(15, 23, 42, 0.08), 0 0 1px 1px rgba(15, 23, 42, 0.02)",
        card: "0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 8px 24px -6px rgba(15, 23, 42, 0.06)",
        "card-hover": "0 12px 32px -8px rgba(15, 23, 42, 0.12), 0 4px 8px -4px rgba(15, 23, 42, 0.04)",
        "inner-soft": "inset 0 1px 2px 0 rgba(255, 255, 255, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.2)"
      }
    }
  },
  plugins: []
};
