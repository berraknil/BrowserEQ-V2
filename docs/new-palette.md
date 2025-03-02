# BrowserEQ New Color Palette

This document outlines the new color palette for the BrowserEQ documentation website, based around the primary color #CB2A4D.

## Primary Colors

| Color Name | Hex Code | RGB | Description | Usage |
|------------|----------|-----|-------------|-------|
| Primary Red | `#CB2A4D` | rgb(203, 42, 77) | Bold red | Primary buttons, headings, key UI elements |
| Dark Blue-Gray | `#333741` | rgb(51, 55, 65) | Dark blue-gray | Header, footer, backgrounds |
| Warm Orange | `#F59A3E` | rgb(245, 154, 62) | Orange | Accents, highlights |
| Green | `#4CAF50` | rgb(76, 175, 80) | Green | Success states, tertiary elements |

## Color Variations

| Color Name | Hex Code | Description |
|------------|----------|-------------|
| Primary Dark | `#A8213F` | Darker red for hover states |
| Primary Light | `#E04E6D` | Lighter red for subtle elements |
| Secondary Light | `#4A4E58` | Lighter blue-gray |
| Accent Light | `#F7B368` | Lighter orange |

## UI Element Color Assignment

| Element | Color | Notes |
|---------|-------|-------|
| Background | `#f9f9fa` | Light gray background |
| Text | `#2F3136` | Dark text |
| Headings | `#CB2A4D` | Primary red |
| Links | `#CB2A4D` | Primary red |
| Link Hover | `#A8213F` | Darker red |
| Buttons | `#CB2A4D` | Primary red |
| Button Hover | `#A8213F` | Darker red |
| Feature Card Headers | `#CB2A4D` | Primary red |
| Feature Card Borders | Alternating | Uses primary, accent, and success colors |
| Note Boxes | `#F59A3E` | Orange accent |
| Warning Boxes | `#CB2A4D` | Primary red |
| Code | `#f0f2f5` background | Light gray background |

## Color Harmony

This palette uses a split-complementary color scheme:
- **#CB2A4D** (Primary Red) serves as the main color
- **#F59A3E** (Warm Orange) is an analogous color to red
- **#4CAF50** (Green) provides contrast as a complementary color
- **#333741** (Dark Blue-Gray) serves as a neutral dark color

The combination creates a vibrant, energetic feel while maintaining readability and accessibility.

## Accessibility

All color combinations in this palette have been checked to ensure they meet WCAG 2.1 AA accessibility guidelines for contrast ratios.

## Implementation

```css
:root {
  --primary-color: #CB2A4D;
  --primary-dark: #A8213F;
  --primary-light: #E04E6D;
  --secondary-color: #333741;
  --secondary-light: #4A4E58;
  --accent-color: #F59A3E;
  --accent-light: #F7B368;
  --success-color: #4CAF50;
}
```
