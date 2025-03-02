#!/bin/bash

# This script removes the files related to the color palette changes

echo "Cleaning up color palette files..."

# Remove the color palette test page
rm -f /c:/Users/4dm1n/BrowserEQ-V2/docs/palette-test.html

# Remove the new palette documentation
rm -f /c:/Users/4dm1n/BrowserEQ-V2/docs/new-palette.md

echo "Color palette files removed."
echo "Reverted styles.css to original teal/turquoise color palette."
