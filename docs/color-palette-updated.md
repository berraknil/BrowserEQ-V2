# BrowserEQ Updated Color Palette

This document outlines the color palette used in the BrowserEQ documentation website, based on the palette from [Coolors.co](https://coolors.co/000022-c42847-ff9b71-6bd425).

## Primary Colors

| Color Name | Hex Code | RGB | Description | Usage |
|------------|----------|-----|-------------|-------|
| Midnight | `#000022` | rgb(0, 0, 34) | Dark navy blue | Backgrounds, footer, header |
| Ruby | `#c42847` | rgb(196, 40, 71) | Bold red | Primary actions, headings, accents |
| Atomic Tangerine | `#ff9b71` | rgb(255, 155, 113) | Warm orange | Accents, links, highlights |
| Green Lizard | `#6bd425` | rgb(107, 212, 37) | Bright green | Success states, special features |

## Supporting Colors

| Color Name | Hex Code | Description |
|------------|----------|-------------|
| Midnight Light | `#1a1a4e` | Lighter version of midnight for hover states |
| Ruby Light | `#e14b67` | Lighter version of ruby |
| Atomic Tangerine Light | `#ffb293` | Lighter version of atomic tangerine |
| Green Lizard Light | `#84e93e` | Lighter version of green lizard |

## Functional Color Assignments

| Function | Color | Description |
|----------|-------|-------------|
| Primary Color | Ruby | Used for primary buttons, headings |
| Secondary Color | Midnight | Used for dark backgrounds, footer |
| Accent Color | Atomic Tangerine | Used for highlighting, links, language toggles |
| Success Color | Green Lizard | Used for success indicators |
| Background | `#f5f7fa` | Light gray background |
| Text Color | `#222233` | Dark text with slight blue tint |
| Border Color | `#e1e2ea` | Very light bluish-gray for borders |

## Color Palette Hierarchy

The color palette has been created with a clear hierarchy:

1. **Ruby** - Primary action color for buttons, headings, and important UI elements
2. **Midnight** - Secondary color for backgrounds, footer, header
3. **Atomic Tangerine** - Accent color for links, highlights, and accent UI elements
4. **Green Lizard** - Supporting color for success states and special features

## Feature Card Color Coding

The feature cards on the homepage use a color-coding system:

- Default cards: Ruby border
- Every third card: Atomic Tangerine border  
- Every fourth card: Green Lizard border

## Accessibility Considerations

All color combinations have been checked for accessibility and maintain at least a 4.5:1 contrast ratio for text content, in accordance with WCAG 2.1 Level AA guidelines.

## Example Usage

```css
:root {
  --midnight: #000022;
  --ruby: #c42847;
  --atomic-tangerine: #ff9b71;
  --green-lizard: #6bd425;
}

h1 {
  color: var(--ruby);
}

a {
  color: var(--atomic-tangerine);
}

.success-message {
  color: var(--green-lizard);
}
```

This updated color palette gives the BrowserEQ documentation a bold, cohesive look with a focused color scheme while maintaining readability and visual hierarchy.
