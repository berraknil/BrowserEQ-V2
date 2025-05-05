# BrowserEQ V2 Privacy Policy

Last Updated: [Current Date]

## Overview

BrowserEQ V2 is an audio equalizer Chrome extension that gives users control over how audio sounds in their browser. We are committed to protecting your privacy and ensuring transparency about how our extension functions.

## Data Collection and Usage

**BrowserEQ V2 does not collect, store, or transmit any personal information or browsing data.**

Specifically:

- We **do not** collect any personal information
- We **do not** track your browsing history
- We **do not** store or transmit audio content
- We **do not** use analytics or tracking tools
- We **do not** share any data with third parties

## Local Storage Usage

BrowserEQ V2 stores the following data locally on your device only:

- EQ settings and preferences
- Custom presets you create
- UI state preferences (minimized state, selected filters)

This data remains on your device and is only used to preserve your settings between browser sessions.

## Permissions Explained

Our extension requests the following permissions, and here's why each is needed:

- **tabCapture**: Required to access and process audio from browser tabs
- **storage**: Needed to save your EQ settings locally
- **tabs**: Used to apply audio processing to the active tab
- **activeTab**: Ensures the extension only affects the tab you're currently using
- **scripting**: Enables the extension to apply audio processing correctly
- **host_permissions**: Allows the extension to function across all websites where you want audio enhancement

These permissions are used solely for the core audio processing functionality of the extension and not for collecting any user data.

## Audio Processing

All audio processing happens locally (on your computer):

1. Audio from the browser tab is captured
2. The audio is processed through our equalizer filters locally
3. The processed audio is played back in real-time
4. No audio data is ever sent to external servers or stored

## Changes to This Policy

We may occasionally update this Privacy Policy. When we do, we will revise the "Last Updated" date above.

## Contact

If you have any questions or concerns about this Privacy Policy or our extension, please contact us through our [GitHub repository](https://github.com/berraknil/BrowserEQ-V2).

## Additional Resources

For more information about how Chrome extensions work with your data, visit the [Chrome Web Store User Data Privacy page](https://developer.chrome.com/docs/webstore/user_data/).
