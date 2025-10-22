/**
 * Design tokens for consistent styling across the application.
 * Use these instead of hardcoded Tailwind classes.
 */

export const colors = {
  // Brand colors - using emerald as primary
  brand: {
    primary: 'emerald-600',
    primaryHover: 'emerald-700',
    primaryLight: 'emerald-50',
    primaryDark: 'emerald-900',
    primaryForeground: 'emerald-50',
  },

  // Semantic colors
  success: {
    base: 'green-600',
    light: 'green-50',
    dark: 'green-900',
    border: 'green-200',
    foreground: 'green-50',
  },

  error: {
    base: 'red-600',
    light: 'red-50',
    dark: 'red-900',
    border: 'red-200',
    foreground: 'red-50',
  },

  warning: {
    base: 'yellow-600',
    light: 'yellow-50',
    dark: 'yellow-900',
    border: 'yellow-200',
    foreground: 'yellow-50',
  },

  info: {
    base: 'blue-600',
    light: 'blue-50',
    dark: 'blue-900',
    border: 'blue-200',
    foreground: 'blue-50',
  },

  // Neutral colors - using slate for consistency
  neutral: {
    50: 'slate-50',
    100: 'slate-100',
    200: 'slate-200',
    300: 'slate-300',
    400: 'slate-400',
    500: 'slate-500',
    600: 'slate-600',
    700: 'slate-700',
    800: 'slate-800',
    900: 'slate-900',
  },

  // Special purpose colors
  rating: 'amber-400',
  ratingEmpty: 'gray-300',
  overlay: 'black/50',
  glass: 'white/10',
  backdrop: 'white/80',
  backdropDark: 'slate-950/70',
} as const

export const typography = {
  // Font families
  sans: 'font-sans',
  mono: 'font-mono',

  // Font sizes
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  '5xl': 'text-5xl',

  // Font weights
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',

  // Line heights
  tight: 'leading-tight',
  lineNormal: 'leading-normal',
  relaxed: 'leading-relaxed',
} as const

export const spacing = {
  // Common spacing patterns
  section: 'py-8 md:py-12 lg:py-16',
  container: 'container mx-auto px-4',
  card: 'p-4 md:p-6',
  stack: 'space-y-4',
  stackTight: 'space-y-2',
  stackLoose: 'space-y-6',

  // Specific spacing values
  xs: 'p-1',
  sm: 'p-2',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8',
} as const

export const effects = {
  // Shadows
  shadow: {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl',
  },

  // Borders
  border: {
    default: 'border',
    rounded: 'rounded-lg',
    roundedFull: 'rounded-full',
    roundedXl: 'rounded-xl',
  },

  // Transitions
  transition: {
    default: 'transition-all duration-200 ease-in-out',
    fast: 'transition-all duration-150 ease-in-out',
    slow: 'transition-all duration-300 ease-in-out',
    colors: 'transition-colors duration-200',
    transform: 'transition-transform duration-300',
    opacity: 'transition-opacity duration-200',
  },

  // Animations
  animation: {
    fadeIn: 'animate-in fade-in-0',
    slideInFromTop: 'animate-in slide-in-from-top-2',
    slideInFromBottom: 'animate-in slide-in-from-bottom-2',
    zoom: 'animate-in zoom-in-95',
    pulse: 'animate-pulse',
  },

  // Backdrop effects
  backdrop: {
    blur: 'backdrop-blur-sm',
    blurMd: 'backdrop-blur-md',
  },
} as const

export const interactive = {
  // Hover states
  hover: {
    card: 'hover:shadow-xl hover:border-neutral-300 hover:-translate-y-1',
    button: 'hover:scale-105 active:scale-95',
    link: 'hover:text-emerald-600 dark:hover:text-emerald-400',
    opacity: 'hover:opacity-80',
    scale: 'hover:scale-105',
    transform: 'hover:-translate-y-1',
  },

  // Focus states
  focus: {
    ring: 'focus:outline-none focus:ring-2 focus:ring-emerald-500/50',
    border: 'focus:border-emerald-500',
    ringOffset: 'focus:ring-offset-2',
  },

  // Active states
  active: {
    scale: 'active:scale-95',
    opacity: 'active:opacity-70',
  },

  // Disabled states
  disabled: 'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
} as const

// Layout utilities
export const layout = {
  // Container patterns
  container: 'container mx-auto px-4 sm:px-6 lg:px-8',
  containerWide: 'container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16',

  // Grid patterns
  grid: {
    cols1: 'grid-cols-1',
    cols2: 'grid-cols-2',
    cols3: 'grid-cols-3',
    cols4: 'grid-cols-4',
    responsive: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  },

  // Flex patterns
  flex: {
    center: 'flex items-center justify-center',
    between: 'flex items-center justify-between',
    start: 'flex items-center justify-start',
    end: 'flex items-center justify-end',
    col: 'flex flex-col',
    row: 'flex flex-row',
  },

  // Positioning
  position: {
    sticky: 'sticky top-0',
    fixed: 'fixed top-0',
    absolute: 'absolute',
    relative: 'relative',
  },
} as const

// Helper function to combine classes
export function designTokens(...tokens: (string | string[])[]): string {
  return tokens.flat().join(' ')
}

// Example usage patterns
export const patterns = {
  // Card component pattern
  card: `rounded-xl border bg-white dark:bg-slate-900 ${effects.shadow.lg} ${effects.transition.default} ${interactive.hover.card}`,

  // Button patterns
  button: {
    primary: `bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-6 py-2 rounded-lg cursor-pointer ${effects.transition.default} ${interactive.active.scale}`,
    secondary: `bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold px-6 py-2 rounded-lg cursor-pointer ${effects.transition.default}`,
    ghost: `hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium px-4 py-2 rounded-lg cursor-pointer ${effects.transition.colors}`,
    outline: `border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium px-4 py-2 rounded-lg cursor-pointer ${effects.transition.colors}`,
  },

  // Input pattern
  input: `w-full px-4 py-2 border rounded-lg ${effects.transition.colors} focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20`,

  // Link pattern
  link: `text-emerald-600 dark:text-emerald-400 ${interactive.hover.link} ${effects.transition.colors} font-medium`,

  // Header pattern
  header: `sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/70`,

  // Form pattern
  form: `space-y-6`,
  formField: `space-y-2`,
  formRow: `grid grid-cols-1 md:grid-cols-2 gap-4`,

  // Loading skeleton pattern
  skeleton: `animate-pulse bg-slate-200 dark:bg-slate-700 rounded`,

  // Rating pattern
  rating: {
    star: `w-3 h-3`,
    filled: `text-amber-400 fill-current`,
    empty: `text-gray-300`,
  },

  // Image pattern
  image: {
    cover: `object-cover`,
    hover: `group-hover:scale-105 transition-transform duration-300`,
    hoverStrong: `group-hover:scale-110 transition-transform duration-500`,
  },

  // Badge pattern
  badge: {
    default: `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`,
    success: `bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`,
    error: `bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`,
    warning: `bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`,
    info: `bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`,
  },
} as const

// Dark mode utilities
export const darkMode = {
  // Text colors
  text: {
    primary: 'text-slate-900 dark:text-slate-100',
    secondary: 'text-slate-700 dark:text-slate-200',
    muted: 'text-slate-600 dark:text-slate-400',
    inverse: 'text-slate-100 dark:text-slate-900',
  },

  // Background colors
  bg: {
    primary: 'bg-white dark:bg-slate-900',
    secondary: 'bg-slate-50 dark:bg-slate-800',
    muted: 'bg-slate-100 dark:bg-slate-700',
    inverse: 'bg-slate-900 dark:bg-white',
  },

  // Border colors
  border: {
    default: 'border-slate-200 dark:border-slate-700',
    muted: 'border-slate-100 dark:border-slate-800',
  },
} as const

// Responsive utilities
export const responsive = {
  // Breakpoint utilities
  mobile: 'min-[1200px]:hidden',
  desktop: 'hidden min-[1200px]:flex',
  tablet: 'hidden md:flex lg:hidden',

  // Container queries
  container: {
    sm: 'container-sm',
    md: 'container-md',
    lg: 'container-lg',
    xl: 'container-xl',
  },
} as const

// Export all utilities for easy access
export const tokens = {
  colors,
  typography,
  spacing,
  effects,
  interactive,
  layout,
  patterns,
  darkMode,
  responsive,
} as const

// Type definitions for better TypeScript support
export type ColorToken = keyof typeof colors
export type TypographyToken = keyof typeof typography
export type SpacingToken = keyof typeof spacing
export type EffectToken = keyof typeof effects
export type InteractiveToken = keyof typeof interactive
export type LayoutToken = keyof typeof layout
export type PatternToken = keyof typeof patterns
