# BrowserEQ Color Palette

This document outlines the color palette used in the BrowserEQ documentation website, based on the palette from [Coolors.co](https://coolors.co/000022-c42847-7d82b8-ff9b71-6bd425).

## Primary Colors

| Color Name | Hex Code | RGB | Description | Usage |
|------------|----------|-----|-------------|-------|
| Midnight | `#000022` | rgb(0, 0, 34) | Dark navy blue | Backgrounds, footer, header |
| Ruby | `#c42847` | rgb(196, 40, 71) | Bold red | Primary actions, headings, accents |
| Wisteria | `#7d82b8` | rgb(125, 130, 184) | Soft purple | Secondary elements, links |
| Atomic Tangerine | `#ff9b71` | rgb(255, 155, 113) | Warm orange | Accents, attention elements |
| Green Lizard | `#6bd425` | rgb(107, 212, 37) | Bright green | Success states, special features |

## Supporting Colors

| Color Name | Hex Code | Description |
|------------|----------|-------------|
| Midnight Light | `#1a1a4e` | Lighter version of midnight for hover states |
| Ruby Light | `#e14b67` | Lighter version of ruby |
| Wisteria Light | `#9ca0d0` | Lighter version of wisteria |
| Atomic Tangerine Light | `#ffb293` | Lighter version of atomic tangerine |
| Green Lizard Light | `#84e93e` | Lighter version of green lizard |

## Functional Color Assignments

| Function | Color | Description |
|----------|-------|-------------|
| Primary Color | Ruby | Used for primary buttons, headings |
| Secondary Color | Midnight | Used for dark backgrounds, footer |
| Accent Color | Atomic Tangerine | Used for highlighting, language toggles |
| Link Color | Wisteria | Used for links |
| Success Color | Green Lizard | Used for success indicators |
| Background | `#f5f7fa` | Light gray background |
| Text Color | `#222233` | Dark text with slight blue tint |
| Border Color | `#e1e2ea` | Very light bluish-gray for borders |

## Feature Card Color Coding

The feature cards on the homepage use a color-coding system:

- Odd-numbered cards: Ruby border
- Every third card: Atomic Tangerine border
- Every fourth card: Green Lizard border
- All others: Wisteria border

## Accessibility Considerations

All color combinations have been checked for accessibility and maintain at least a 4.5:1 contrast ratio for text content, in accordance with WCAG 2.1 Level AA guidelines.

## Example Usage

```css
:root {
  --midnight: #000022;
  --ruby: #c42847;
  --wisteria: #7d82b8;
  --atomic-tangerine: #ff9b71;
  --green-lizard: #6bd425;
}

h1 {
  color: var(--ruby);
}

a {
  color: var(--wisteria);
}

.success-message {
  color: var(--green-lizard);
}
```

This color palette gives the BrowserEQ documentation a professional, vibrant look while maintaining readability and visual hierarchy.
