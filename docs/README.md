# BrowserEQ V2 Documentation Website

This folder contains the files for the BrowserEQ V2 documentation website.

## Directory Structure

- `/images/` - Contains logo and website images
  - `logo.png` - Main BrowserEQ logo
  - `internet_in_farbe_en.png` - Internet in Farbe logo (English version)
  - `internet_in_farbe_de.png` - Internet in Farbe logo (German version)
  - `prototypefund_logo.png` - PrototypeFund logo
  
- `/screenshots/` - Contains application screenshots
  - `browsereq-main.png` - Main screenshot of the extension interface
  - `controls-guide.png` - Screenshot showing the labeled controls

## Adding New Images

When adding new images:

1. Place website graphics in the `/images/` folder
2. Place application screenshots in the `/screenshots/` folder
3. Use descriptive filenames and optimize images for the web
4. Update references in the HTML files as needed

## Image Requirements

### Logo Images
The logos in the footer require specific handling:

1. **Internet in Farbe Logo**:
   - File: `images/internet_in_farbe_en.jpg` (English) and `images/internet_in_farbe_de.jpg` (German)
   - This logo should be in its original colors and NOT have any filters applied
   - Recommended size: Up to 250px width, maintaining aspect ratio

2. **PrototypeFund Logo**:
   - File: `images/PrototypeFund-Logo.png`
   - Since this logo appears on a dark background, it should be white or light-colored
   - The CSS applies a brightness/invert filter to make it visible on dark background

### Screenshot Images
- Main application screenshot: `screenshots/browsereq-main.png`
- Recommended size: ~800px width for optimal display

## Testing Logo Display
If logos don't appear properly:

1. Check that the file exists in the correct location
2. Ensure file extensions match exactly (.jpg vs .png)
3. Open browser dev tools (F12) and check for 404 errors
4. Verify that no CSS filter is unintentionally hiding the images

## Localization

The website supports both English and German, with language-specific content defined using CSS classes:

- `.en` - For English content
- `.de` - For German content

Language switching is handled by JavaScript that toggles the `german` class on the `body` element.
