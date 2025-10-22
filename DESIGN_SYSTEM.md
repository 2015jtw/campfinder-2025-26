# Design System Documentation

## Overview

This design system provides a comprehensive set of design tokens, patterns, and utilities for building consistent, accessible, and beautiful user interfaces. It's built on top of Tailwind CSS with custom CSS variables and TypeScript support.

## Core Principles

1. **Consistency**: All components use the same design tokens
2. **Accessibility**: Built-in focus states, contrast ratios, and semantic markup
3. **Dark Mode**: Full support for light and dark themes
4. **Performance**: Optimized CSS with minimal bundle size
5. **Developer Experience**: TypeScript support and clear documentation

## Design Tokens

### Colors

The color system is organized into semantic categories:

#### Brand Colors

- **Primary**: `emerald-600` - Main brand color
- **Primary Hover**: `emerald-700` - Hover state
- **Primary Light**: `emerald-50` - Light backgrounds
- **Primary Dark**: `emerald-900` - Dark accents

#### Semantic Colors

- **Success**: `green-600` - Success states, confirmations
- **Error**: `red-600` - Errors, destructive actions
- **Warning**: `yellow-600` - Warnings, attention needed
- **Info**: `blue-600` - Information, neutral actions

#### Neutral Colors

- **Slate Scale**: `slate-50` to `slate-900` - Grays for text and backgrounds

#### Special Colors

- **Rating**: `amber-400` - Star ratings
- **Overlay**: `black/50` - Modal overlays
- **Glass**: `white/10` - Glass morphism effects

### Typography

#### Font Families

- **Sans**: `font-sans` - Primary font family
- **Mono**: `font-mono` - Code and monospace text

#### Font Sizes

- **xs**: `text-xs` - 12px
- **sm**: `text-sm` - 14px
- **base**: `text-base` - 16px
- **lg**: `text-lg` - 18px
- **xl**: `text-xl` - 20px
- **2xl**: `text-2xl` - 24px
- **3xl**: `text-3xl` - 30px
- **4xl**: `text-4xl` - 36px
- **5xl**: `text-5xl` - 48px

#### Font Weights

- **normal**: `font-normal` - 400
- **medium**: `font-medium` - 500
- **semibold**: `font-semibold` - 600
- **bold**: `font-bold` - 700

#### Line Heights

- **tight**: `leading-tight` - 1.25
- **lineNormal**: `leading-normal` - 1.5
- **relaxed**: `leading-relaxed` - 1.625

### Spacing

#### Common Patterns

- **section**: `py-8 md:py-12 lg:py-16` - Section padding
- **container**: `container mx-auto px-4` - Container padding
- **card**: `p-4 md:p-6` - Card padding
- **stack**: `space-y-4` - Vertical spacing
- **stackTight**: `space-y-2` - Tight vertical spacing
- **stackLoose**: `space-y-6` - Loose vertical spacing

### Effects

#### Shadows

- **sm**: `shadow-sm` - Small shadow
- **md**: `shadow-md` - Medium shadow
- **lg**: `shadow-lg` - Large shadow
- **xl**: `shadow-xl` - Extra large shadow
- **2xl**: `shadow-2xl` - 2x large shadow

#### Transitions

- **default**: `transition-all duration-200 ease-in-out`
- **fast**: `transition-all duration-150 ease-in-out`
- **slow**: `transition-all duration-300 ease-in-out`
- **colors**: `transition-colors duration-200`
- **transform**: `transition-transform duration-300`
- **opacity**: `transition-opacity duration-200`

#### Animations

- **fadeIn**: `animate-in fade-in-0`
- **slideUp**: `animate-in slide-in-from-top-2`
- **slideDown**: `animate-in slide-in-from-bottom-2`
- **zoom**: `animate-in zoom-in-95`

### Interactive States

#### Hover Effects

- **card**: `hover:shadow-xl hover:border-neutral-300 hover:-translate-y-1`
- **button**: `hover:scale-105 active:scale-95`
- **link**: `hover:text-emerald-600 dark:hover:text-emerald-400`
- **opacity**: `hover:opacity-80`
- **scale**: `hover:scale-105`
- **transform**: `hover:-translate-y-1`

#### Focus States

- **ring**: `focus:outline-none focus:ring-2 focus:ring-emerald-500/50`
- **border**: `focus:border-emerald-500`
- **ringOffset**: `focus:ring-offset-2`

#### Active States

- **scale**: `active:scale-95`
- **opacity**: `active:opacity-70`

#### Disabled States

- **disabled**: `disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none`

## Component Patterns

### Cards

```tsx
import { patterns } from '@/lib/design-tokens'

// Basic card
<div className={patterns.card}>
  <h3 className="text-lg font-semibold">Card Title</h3>
  <p className="text-slate-600 dark:text-slate-400">Card content</p>
</div>

// Interactive card
<div className={`${patterns.card} ${interactive.hover.card}`}>
  <h3 className="text-lg font-semibold">Interactive Card</h3>
  <p className="text-slate-600 dark:text-slate-400">Hover me!</p>
</div>
```

### Buttons

```tsx
import { patterns } from '@/lib/design-tokens'

// Primary button
<button className={patterns.button.primary}>
  Primary Action
</button>

// Secondary button
<button className={patterns.button.secondary}>
  Secondary Action
</button>

// Ghost button
<button className={patterns.button.ghost}>
  Ghost Action
</button>

// Outline button
<button className={patterns.button.outline}>
  Outline Action
</button>
```

### Forms

```tsx
import { patterns } from '@/lib/design-tokens'

// Form container
;<form className={patterns.form}>
  <div className={patterns.formRow}>
    <input className={patterns.input} placeholder="Input field" />
    <textarea className={patterns.input} placeholder="Textarea" />
  </div>
</form>
```

### Text Elements

```tsx
import { darkMode } from '@/lib/design-tokens'

// Headings
<h1 className={darkMode.text.primary}>Main Heading</h1>
<h2 className={darkMode.text.secondary}>Subheading</h2>
<p className={darkMode.text.muted}>Muted text</p>

// Links
<a className={patterns.link}>Link text</a>
```

## Dark Mode Support

All components automatically support dark mode through CSS variables and Tailwind's dark mode classes:

```tsx
// Text colors
<div className="text-slate-900 dark:text-slate-100">Primary text</div>
<div className="text-slate-600 dark:text-slate-400">Secondary text</div>
<div className="text-slate-500 dark:text-slate-500">Muted text</div>

// Background colors
<div className="bg-white dark:bg-slate-900">Card background</div>
<div className="bg-slate-50 dark:bg-slate-800">Secondary background</div>

// Border colors
<div className="border-slate-200 dark:border-slate-700">Border</div>
```

## Micro-interactions

### Hover Effects

```tsx
// Lift effect
<div className="hover-lift">Hover to lift</div>

// Scale effect
<div className="hover-scale">Hover to scale</div>

// Card hover
<div className="card-hover">Interactive card</div>
```

### Animations

```tsx
// Fade in
<div className="animate-fade-in">Fades in</div>

// Slide up
<div className="animate-slide-up">Slides up</div>

// Scale in
<div className="animate-scale-in">Scales in</div>

// Subtle bounce
<div className="animate-bounce-subtle">Bounces subtly</div>
```

### Loading States

```tsx
// Shimmer effect
<div className="loading-shimmer">Loading content</div>

// Skeleton
<div className="skeleton h-4 w-full rounded"></div>
```

## Layout Utilities

### Containers

```tsx
import { layout } from '@/lib/design-tokens'

// Standard container
<div className={layout.container}>Content</div>

// Wide container
<div className={layout.containerWide}>Wide content</div>
```

### Grid Systems

```tsx
import { layout } from '@/lib/design-tokens'

// Responsive grid
;<div className={`grid ${layout.grid.responsive} gap-6`}>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

### Flexbox Patterns

```tsx
import { layout } from '@/lib/design-tokens'

// Center content
<div className={layout.flex.center}>Centered</div>

// Space between
<div className={layout.flex.between}>Space between</div>

// Column layout
<div className={layout.flex.col}>Column</div>
```

## Best Practices

### 1. Use Design Tokens

Always use design tokens instead of hardcoded values:

```tsx
// ✅ Good
<div className={patterns.card}>
  <h3 className={darkMode.text.primary}>Title</h3>
</div>

// ❌ Bad
<div className="rounded-lg border bg-white shadow-lg">
  <h3 className="text-slate-900">Title</h3>
</div>
```

### 2. Consistent Spacing

Use the spacing patterns for consistent layouts:

```tsx
// ✅ Good
<section className={patterns.section}>
  <div className={patterns.container}>
    <div className={patterns.stack}>
      <h2>Title</h2>
      <p>Content</p>
    </div>
  </div>
</section>
```

### 3. Dark Mode First

Always consider dark mode when building components:

```tsx
// ✅ Good
<div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
  Content
</div>

// ❌ Bad
<div className="bg-white text-slate-900">
  Content
</div>
```

### 4. Interactive States

Include proper hover, focus, and active states:

```tsx
// ✅ Good
<button className={`${patterns.button.primary} ${interactive.focus.ring}`}>Button</button>
```

### 5. Accessibility

Use semantic HTML and proper ARIA attributes:

```tsx
// ✅ Good
<button className={patterns.button.primary} aria-label="Close dialog" onClick={handleClose}>
  ×
</button>
```

## Migration Guide

### From Hardcoded Classes

```tsx
// Before
<div className="rounded-lg border border-gray-200 bg-white p-4 shadow-md hover:shadow-lg transition-all duration-200">
  <h3 className="text-lg font-semibold text-gray-900">Title</h3>
  <p className="text-sm text-gray-600">Content</p>
</div>

// After
<div className={`${patterns.card} ${interactive.hover.card}`}>
  <h3 className={`text-lg font-semibold ${darkMode.text.primary}`}>Title</h3>
  <p className={`text-sm ${darkMode.text.secondary}`}>Content</p>
</div>
```

### From Inline Styles

```tsx
// Before
<div style={{ padding: '1rem', borderRadius: '0.5rem', backgroundColor: '#f3f4f6' }}>
  Content
</div>

// After
<div className={patterns.card}>
  Content
</div>
```

## Examples

See the `DesignTokenDemo` component for a comprehensive example of all design tokens and patterns in action.

## Contributing

When adding new design tokens or patterns:

1. Follow the existing naming conventions
2. Include TypeScript types
3. Add dark mode support
4. Update this documentation
5. Add examples to the demo component

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Design System Best Practices](https://designsystemsrepo.com/)
