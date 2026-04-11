/**
 * Gut Feeling — Organic Fermentation Design System
 *
 * Inspired by kombucha cultures, amber fermentation jars,
 * warm apothecary vibes, and living bacterial colonies.
 */

export const palette = {
  // Warm fermentation ambers
  amber50: "#FFF8F0",
  amber100: "#FFECD2",
  amber200: "#FFD6A5",
  amber400: "#E8A855",
  amber600: "#C47F17",
  amber800: "#8B5E14",

  // SCOBY culture greens (muted, organic)
  culture100: "#E8F0E4",
  culture300: "#A8C49A",
  culture500: "#6B8F5E",
  culture700: "#3D5C32",

  // Warm neutrals (tea-stained)
  cream: "#FAF6F0",
  parchment: "#F2EBE0",
  linen: "#E8DFD1",
  bark: "#5C4A3A",
  espresso: "#3A2E24",

  // Accents
  rosehip: "#C4626A",
  rose100: "#FDE8E8",
  rose200: "#F5C6C6",
  ginger: "#D4843E",
  turmeric: "#D4A03E",
  lavender: "#8B7EB8",

  // Utility
  white: "#FFFFFF",
  overlay: "rgba(58, 46, 36, 0.06)",
  shadow: "rgba(139, 94, 20, 0.12)",
} as const;

export const typography = {
  // Sizes
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 22,
  xl: 28,

  // Weights
  regular: "400" as const,
  medium: "500" as const,
  semibold: "600" as const,
  bold: "700" as const,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 28,
  xxxl: 48,
} as const;

export const radii = {
  sm: 8,
  md: 16,
  lg: 22,
  xl: 28,
  full: 999,
} as const;

// Minimum recommended touch target (iOS 44pt / Android 48dp).
export const sizes = {
  touchTarget: 44,
} as const;
