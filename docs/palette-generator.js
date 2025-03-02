/**
 * BrowserEQ Color Palette Generator
 *
 * This script generates CSS variables and color documentation from the primary colors.
 * Run with Node.js to output ready-to-use CSS.
 */

// Primary colors from coolors.co/c42847-ff9b71-6bd425
const COLORS = {
  ruby: "#c42847",
  atomicTangerine: "#ff9b71",
  greenLizard: "#6bd425",
  // Added complementary dark color
  charcoal: "#2d3142",
};

// Utility functions to manipulate colors
function hexToRgb(hex) {
  // Remove # if present
  hex = hex.replace(/^#/, "");

  // Parse hex values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return { r, g, b };
}

function adjustBrightness(hex, factor) {
  const rgb = hexToRgb(hex);

  // Adjust brightness
  let r = Math.round(rgb.r + (255 - rgb.r) * factor);
  let g = Math.round(rgb.g + (255 - rgb.g) * factor);
  let b = Math.round(rgb.b + (255 - rgb.b) * factor);

  // Make darker instead
  if (factor < 0) {
    r = Math.round(rgb.r * (1 + factor));
    g = Math.round(rgb.g * (1 + factor));
    b = Math.round(rgb.b * (1 + factor));
  }

  // Ensure values are in range 0-255
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  // Convert back to hex
  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

// Generate lighter and darker versions
const colorVariants = {};
for (const [name, hex] of Object.entries(COLORS)) {
  colorVariants[`${name}Light`] = adjustBrightness(hex, 0.2);
  colorVariants[`${name}Dark`] = adjustBrightness(hex, -0.2);
}

// Generate CSS variables
function generateCSSVariables() {
  let css = `:root {\n`;
  css += `  /* Primary colors */\n`;

  for (const [name, hex] of Object.entries(COLORS)) {
    const kebabName = name.replace(/([A-Z])/g, "-$1").toLowerCase();
    css += `  --${kebabName}: ${hex};\n`;
  }

  css += `\n  /* Color variants */\n`;
  for (const [name, hex] of Object.entries(colorVariants)) {
    const kebabName = name.replace(/([A-Z])/g, "-$1").toLowerCase();
    css += `  --${kebabName}: ${hex};\n`;
  }

  css += `}\n`;
  return css;
}

// Generate markdown documentation
function generateMarkdownDoc() {
  let markdown = `# BrowserEQ Color Palette\n\n`;
  markdown += `## Primary Colors\n\n`;
  markdown += `| Color Name | Hex Value | Preview |\n`;
  markdown += `|------------|-----------|--------|\n`;

  for (const [name, hex] of Object.entries(COLORS)) {
    const displayName = name
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
    markdown += `| ${displayName} | \`${hex}\` | ![${displayName}](https://via.placeholder.com/20/${hex.replace(
      "#",
      ""
    )}/000000?text=+) |\n`;
  }

  markdown += `\n## Color Variants\n\n`;
  markdown += `| Color Name | Hex Value | Preview |\n`;
  markdown += `|------------|-----------|--------|\n`;

  for (const [name, hex] of Object.entries(colorVariants)) {
    const displayName = name
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
    markdown += `| ${displayName} | \`${hex}\` | ![${displayName}](https://via.placeholder.com/20/${hex.replace(
      "#",
      ""
    )}/000000?text=+) |\n`;
  }

  return markdown;
}

console.log("/* CSS Variables */");
console.log(generateCSSVariables());
console.log("\n/* Markdown Documentation */");
console.log(generateMarkdownDoc());
