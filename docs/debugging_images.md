# Debugging Images in BrowserEQ Documentation

If images are not displaying correctly on your documentation site, follow these troubleshooting steps:

## 1. Verify Image Files Exist

Make sure all required image files are in the correct directories:

```
/docs/images/
  ├── logo.png
  ├── internet_in_farbe_en.png
  ├── internet_in_farbe_de.png
  └── prototypefund_logo.png

/docs/screenshots/
  └── browsereq-main.png
```

## 2. Check File Permissions

Ensure the image files have appropriate read permissions for your web server.

## 3. Inspect HTML Structure

The image tags should follow this pattern:

```html
<img src="images/image-name.png" alt="Description" class="sponsor-logo">
```

Make sure the src attribute paths are correct relative to the HTML file.

## 4. Check Browser Console

Open your browser's developer tools (F12) and check the Console tab for any 404 errors related to image files.

## 5. Verify Image Format Compatibility

Ensure your images are in web-compatible formats (PNG, JPEG, SVG, WebP).

## 6. Creating Placeholder Images

If you need temporary placeholder images while developing:

### Using ImageMagick:

```bash
convert -size 200x100 -background "#00aaa0" -fill white -gravity center \
  label:"BrowserEQ Logo" logo.png
```

### Using Online Services:

* [Placeholder.com](https://placeholder.com/)
* [Placekitten](https://placekitten.com/)
* [Picsum Photos](https://picsum.photos/)

Example URL: `https://via.placeholder.com/200x100/00aaa0/ffffff?text=BrowserEQ+Logo`

## 7. Image Optimization

For production, optimize your images to reduce load times:

* Use appropriate dimensions (don't scale in HTML)
* Compress images using tools like ImageOptim, TinyPNG, or Squoosh
* Consider using WebP format with fallbacks for older browsers
