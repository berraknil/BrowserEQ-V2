# BrowserEQ Tricolor Palette

This document outlines the simplified tricolor palette used in the BrowserEQ documentation website, based on [Coolors.co](https://coolors.co/c42847-ff9b71-6bd425).

## Primary Brand Colors

| Color Name | Hex Code | RGB | Description | Usage |
|------------|----------|-----|-------------|-------|
| Ruby | `#c42847` | rgb(196, 40, 71) | Bold red | Primary brand color, buttons, headings |
| Atomic Tangerine | `#ff9b71` | rgb(255, 155, 113) | Warm orange | Secondary/accent color, highlights |
| Green Lizard | `#6bd425` | rgb(107, 212, 37) | Bright green | Tertiary/success color |

## Added Complementary Colors

| Color Name | Hex Code | RGB | Description | Usage |
|------------|----------|-----|-------------|-------|
| Charcoal | `#2d3142` | rgb(45, 49, 66) | Dark blue-gray | Background for header & footer |
| White | `#ffffff` | rgb(255, 255, 255) | Pure white | Card backgrounds |
| Off-white | `#f9f9f9` | rgb(249, 249, 249) | Light gray | Page background |

## Supporting Variants

| Color Name | Hex Code | Description |
|------------|----------|-------------|
| Ruby Light | `#e14b67` | Lighter version of ruby |
| Ruby Dark | `#a31f39` | Darker version of ruby |
| Atomic Tangerine Light | `#ffb293` | Lighter version of atomic tangerine |
| Green Lizard Light | `#84e93e` | Lighter version of green lizard |
| Charcoal Light | `#444a63` | Lighter version of charcoal |

## Color Strategy

This simplified palette focuses on three core brand colors that work together to create a cohesive and memorable identity:

1. **Ruby (#c42847)** serves as the primary brand color and is used for main actions, headings, and important UI elements.
2. **Atomic Tangerine (#ff9b71)** is used as a secondary/accent color for highlights, language toggles, and note boxes.
3. **Green Lizard (#6bd425)** is used as a tertiary/success color for success states and as an accent.
4. **Charcoal (#2d3142)** was added as a dark neutral to provide contrast for backgrounds in headers and footers.

## UI Element Color Assignment

| UI Element | Color | Description |
|------------|-------|-------------|
| Page Background | `#f9f9f9` | Light off-white background |
| Text | `#2f3142` | Dark charcoal text |
| Headers & Footer | `#2d3142` | Charcoal background |
| Primary Buttons | `#c42847` | Ruby |
| Links | `#a31f39` | Ruby Dark |
| Link Hover | `#c42847` | Ruby |
| Feature Cards | Alternating borders using the 3 brand colors |
| Note Boxes | `#ff9b71` | Atomic Tangerine for border |
| Warning Boxes | `#c42847` | Ruby for border |

## Accessibility

The color combinations were chosen with accessibility in mind:
- Text on backgrounds maintains at least a 4.5:1 contrast ratio (WCAG AA)
- Interactive elements like buttons have distinct hover states
- Links are clearly distinguishable from surrounding text

## Example Implementation

```css
:root {
  --ruby: #c42847;
  --atomic-tangerine: #ff9b71;
  --green-lizard: #6bd425;
  --charcoal: #2d3142;
}

header {
  background-color: var(--charcoal);
}

h1, h2, h3 {
  color: var(--ruby);
}

.button {
  background-color: var(--ruby);
}

.accent {
  color: var(--atomic-tangerine);
}

.success {
  color: var(--green-lizard);
}
```
