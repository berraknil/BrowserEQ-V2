#!/bin/bash

# This script removes color palette-related files that are no longer needed

echo "Cleaning up color palette files..."

# Remove the color palette files
rm -f /c:/Users/4dm1n/BrowserEQ-V2/docs/color-palette.md
rm -f /c:/Users/4dm1n/BrowserEQ-V2/docs/color-palette-updated.md
rm -f /c:/Users/4dm1n/BrowserEQ-V2/docs/color-palette-trio.md
rm -f /c:/Users/4dm1n/BrowserEQ-V2/docs/palette-generator.js

echo "Color palette files removed."
echo "Reverted styles.css to original state before color palette modifications."
