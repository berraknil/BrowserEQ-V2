# BrowserEQ v2 - Hear Better

[Deutsche Version weiter unten](#browsereq-v2---audio-verbesserung-für-deinen-browser)

BrowserEQ-V2 is a powerful audio equalizer extension that enhances your listening experience by giving you complete control over how audio sounds in your web browser. Whether you're dealing with challenging audio on video calls, enjoying music, or need to make content more accessible for your hearing needs, BrowserEQ puts professional audio tools at your fingertips.

> **📚 Full Documentation Available**: Visit our [documentation website](https://berraknil.github.io/BrowserEQ-V2/) for complete guides, examples, and interactive demonstrations of all features.

![BrowserEQ Screenshot](docs/screenshots/browsereq-main.png)

## Features

- **Intuitive Interface**: Simple controls with both full and compact modes
- **6-Band EQ**: Complete equalization with low pass, high pass, band pass, peaking, and shelf filters
- **Specialized Presets**: Purpose-built sound profiles for voice calls, music, podcasts, and more
- **Real-time Processing**: Hear changes to your audio immediately as you adjust settings
- **Audio Capture**: Record audio with your current EQ settings applied
- **Accessibility First**: Designed to accommodate various hearing needs

## Installation

### Manual Installation (From GitHub)
1. Go to the [latest release](https://github.com/berraknil/BrowserEQ-V2/releases/latest) on GitHub
2. Download the `browsereq-v2.zip` file and extract it to a folder on your computer
3. Open Chrome and navigate to `chrome://extensions`
4. Enable "Developer mode" by toggling the switch in the top-right corner
5. Click the "Load unpacked" button
6. Select the extracted folder containing the extension files

> **Note:** When installing extensions manually, you'll need to update them manually as well. Check the GitHub repository regularly for new releases.

### Chrome Web Store
> **⚠️ Coming Soon:** The extension is currently in the Chrome Web Store approval process and is not yet available for direct installation from there. Please use the GitHub installation method for now.

1. Navigate to the BrowserEQ page on Chrome Web Store (coming soon)
2. Click the "Add to Chrome" button
3. Confirm by clicking "Add extension" in the popup

## User Guide

### Getting Started

After installing BrowserEQ, you'll see the BrowserEQ icon in your browser toolbar. Click it to open the equalizer panel.

### Basic Controls

1. **Preset Selection**: Choose from ready-made sound profiles
2. **Volume Control**: Adjust the "Main" slider to control overall volume
3. **Mute Button**: Quickly silence all audio
4. **Transport Controls**: Control audio playback and recording
5. **Mono/Stereo Toggle**: Switch between stereo (normal) and mono (combines left and right channels) 
6. **Compact Mode Toggle**: Switch between full and minimal interface

### Understanding Filters

BrowserEQ gives you six different filters to shape your sound:

- **High Pass**: Removes low rumbling sounds (like air conditioners, traffic noise)
- **Low Pass**: Removes high-pitched sounds (like hiss, sibilance)
- **Band Pass**: Lets you focus on just middle frequencies (great for voices)
- **Low Shelf**: Adjusts the bass level without cutting it completely
- **High Shelf**: Adjusts the treble/high frequencies
- **Peaking**: Creates precise adjustments to specific frequency ranges

Each filter has:
- An on/off toggle
- A frequency control (which sound frequencies to affect)
- A secondary control (either Resonance, Bandwidth, or Gain)

## Example Uses

### Voice Clarity and Noise Reduction

BrowserEQ excels at enhancing voice intelligibility in video conferences, online meetings, and webinars. You can eliminate background noise, reduce echo, and enhance speech frequencies for crystal-clear communication. This is perfect for improving hard-to-hear speakers or using your computer in noisy environments.

### Stereo/Mono Conversion

The Stereo/Mono switch is a powerful accessibility feature that combines left and right audio channels. This benefits users with unilateral hearing loss, helps when using a single earbud, and improves audio where stereo separation is too extreme. You can easily switch between stereo and mono modes depending on your listening situation.

### Music Enhancement and Timbral Control

Transform your music listening experience with BrowserEQ's precise frequency controls. You can adjust specific frequency ranges to enhance bass response, brighten vocals, or completely reshape the timbral quality of any music. Create custom sound signatures for different genres, compensate for headphone or speaker deficiencies, and discover new sonic details in your favorite tracks.

## Accessibility Features

BrowserEQ was designed with accessibility in mind:
- **Hearing Accessibility**: Customize audio to accommodate hearing sensitivities or impairments
- **Auditory Processing**: Enhance clarity by filtering out distracting frequencies
- **Sensory Sensitivities**: Reduce frequencies that trigger discomfort
- **Audio Balance**: Correct for imbalanced audio in content

## For Developers

### Project Structure

```
BrowserEQ-V2/
├── src/
│   ├── components/           # Vue components
│   │   ├── PresetManager.vue # Preset management
│   │   ├── Slider.vue        # Slider control
│   │   ├── Strip.vue         # Filter strip
│   │   └── Toggle.vue        # Toggle switch
│   ├── logic/                # Core business logic
│   │   ├── audioProcessing.ts  # Web Audio API handling
│   │   ├── EQValues.ts       # Default preset definitions
│   │   ├── presetStorage.ts  # LocalStorage management
│   │   └── ...
│   ├── popup/                # Extension popup
│   │   └── Popup.vue         # Main UI
│   └── ...
├── extension/                # Compiled extension
└── ...
```

### Key Technologies

- **Vue 3**: Frontend framework with Composition API
- **Web Audio API**: Core audio processing capabilities
- **LocalStorage API**: Preset persistence
- **Chrome Extension APIs**: For tab audio capture

### Audio Processing Pipeline

1. **Capture**: The extension captures tab audio using `chrome.tabCapture`.
2. **Source Creation**: A MediaStreamAudioSourceNode is created from the capture.
3. **Filter Chain**: Audio is routed through various BiquadFilterNode instances based on user settings.
4. **Gain Node**: Final processing includes volume adjustment through a GainNode.
5. **Output**: Processed audio is sent to the AudioContext destination.

```
MediaStreamSource → [Enabled Filters] → GainNode → AudioContext.destination
```

### Building and Testing

```bash
# Install dependencies
npm install

# Development build with hot-reload
npm run dev

# Production build
npm run build

# Run tests
npm test
```

## Contributing

We welcome contributions to BrowserEQ! Please check out our contribution guidelines in [CONTRIBUTING.md](CONTRIBUTING.md).

### Bug Reports & Feature Requests

Please use the GitHub issue tracker to report bugs or suggest features. When reporting a bug, include:
- Your browser version
- BrowserEQ version
- Steps to reproduce the issue
- Expected vs actual behavior
- Any relevant screenshots or console logs

## License

BrowserEQ is released under the [BrowserEQ Strong Copyleft License](LICENSE), a license designed to keep the software and all derivatives perpetually free and open source. This license:

- Ensures the software remains free to use, modify, and distribute
- Prohibits any commercial exploitation or selling of the software or derivatives
- Requires that all modifications must be shared under the same license terms
- Prevents any future relicensing under different terms

This license was specifically chosen to protect user freedoms and ensure BrowserEQ remains a community resource that cannot be commercialized or closed down.

## Sponsors

<p align="center">BrowserEQ is proudly supported by:</p>

<p align="center">
  <a href="https://www.bmbf.de/DE/Home/home_node.html" target="_blank">
    <img src="docs/images/internet_in_farbe_en.jpg" alt="Internet in Farbe" width="300">
  </a>
  <a href="https://prototypefund.de" target="_blank">
    <img src="docs/images/PrototypeFund-Logo.png" alt="Prototype Fund" width="300">
  </a>
</p>

---

# BrowserEQ v2 - Audio-Verbesserung für deinen Browser

[English version above](#browsereq-v2---audio-enhancement-for-your-browser)

BrowserEQ-V2 ist eine leistungsstarke Audio-Equalizer-Erweiterung, die dein Hörerlebnis verbessert, indem sie dir die vollständige Kontrolle darüber gibt, wie Audio in deinem Webbrowser klingt. Egal, ob du mit herausforderndem Audio bei Videoanrufen zu tun hast, Musik genießt oder Inhalte für deine Hörbedürfnisse zugänglicher machen musst, BrowserEQ stellt dir professionelle Audio-Tools zur Verfügung.

> **📚 Vollständige Dokumentation verfügbar**: Besuche unsere [Dokumentationswebsite](https://berraknil.github.io/BrowserEQ-V2/) für vollständige Anleitungen, Beispiele und interaktive Demonstrationen aller Funktionen.

![BrowserEQ Screenshot](docs/screenshots/browsereq-main.png)

## Funktionen

- **Intuitive Benutzeroberfläche**: Einfache Steuerung mit sowohl vollständigen als auch kompakten Modi
- **6-Band EQ**: Komplette Entzerrung mit Tiefpass-, Hochpass-, Bandpass-, Peaking- und Shelf-Filtern
- **Spezialisierte Voreinstellungen**: Zweckgebundene Klangprofile für Sprachanrufe, Musik, Podcasts und mehr
- **Echtzeitverarbeitung**: Höre Änderungen an deinem Audio sofort, wenn du die Einstellungen anpasst
- **Audioaufnahme**: Nimm Audio mit deinen aktuellen EQ-Einstellungen auf
- **Barrierefreiheit an erster Stelle**: Entwickelt, um verschiedenen Hörbedürfnissen gerecht zu werden

## Installation

### Manuelle Installation (von GitHub)
1. Gehe zur [neuesten Version](https://github.com/berraknil/BrowserEQ-V2/releases/latest) auf GitHub
2. Lade die Datei `browsereq-v2.zip` herunter und entpacke sie in einen Ordner auf deinem Computer
3. Öffne Chrome und navigiere zu `chrome://extensions`
4. Aktiviere den "Entwicklermodus" durch Umschalten des Schalters in der oberen rechten Ecke
5. Klicke auf die Schaltfläche "Entpackte Erweiterung laden"
6. Wähle den entpackten Ordner mit den Erweiterungsdateien aus

> **Hinweis:** Bei manuell installierten Erweiterungen musst du diese auch manuell aktualisieren. Überprüfe regelmäßig das GitHub-Repository auf neue Versionen.

### Chrome Web Store
> **⚠️ Bald verfügbar:** Die Erweiterung befindet sich derzeit im Genehmigungsprozess des Chrome Web Stores und ist noch nicht direkt von dort installierbar. Bitte nutze vorerst die GitHub-Installationsmethode.

1. Gehe zur BrowserEQ-Seite im Chrome Web Store (bald verfügbar)
2. Klicke auf die Schaltfläche "Zu Chrome hinzufügen"
3. Bestätige, indem du im Popup auf "Erweiterung hinzufügen" klickst

## Benutzerhandbuch

### Erste Schritte

Nach der Installation von BrowserEQ siehst du das BrowserEQ-Symbol in der Browser-Symbolleiste. Klicke darauf, um das Equalizer-Panel zu öffnen.

### Grundlegende Steuerung

1. **Voreinstellungsauswahl**: Wähle aus vorgefertigten Klangprofilen
2. **Lautstärkeregelung**: Passe den "Main"-Schieberegler an, um die Gesamtlautstärke zu steuern
3. **Stummschalt-Button**: Schalte schnell alle Audioausgaben stumm
4. **Transportsteuerung**: Steuere die Audiowiedergabe und -aufnahme
5. **Mono/Stereo-Umschalter**: Wechsle zwischen Stereo (normal) und Mono (kombiniert linke und rechte Kanäle)
6. **Kompaktmodus-Umschalter**: Wechsle zwischen vollständiger und minimaler Benutzeroberfläche

### Filter verstehen

BrowserEQ bietet dir sechs verschiedene Filter, um deinen Klang zu formen:

- **Hochpass**: Entfernt tiefe Rumpelgeräusche (wie Klimaanlagen, Verkehrslärm)
- **Tiefpass**: Entfernt hochfrequente Geräusche (wie Zischen, Zischlaute)
- **Bandpass**: Ermöglicht es dir, dich nur auf mittlere Frequenzen zu konzentrieren (ideal für Stimmen)
- **Tiefen-Shelf**: Passt den Basspegel an, ohne ihn vollständig zu entfernen
- **Höhen-Shelf**: Passt die Höhenfrequenzen an
- **Peaking**: Ermöglicht präzise Anpassungen an bestimmten Frequenzbereichen

Jeder Filter hat:
- Einen Ein-/Ausschalter
- Eine Frequenzregelung (welche Frequenzen beeinflusst werden sollen)
- Eine sekundäre Regelung (entweder Resonanz, Bandbreite oder Verstärkung)

## Anwendungsbeispiele

### Sprachklarheit und Rauschunterdrückung

BrowserEQ ist hervorragend darin, die Sprachverständlichkeit in Videokonferenzen, Online-Meetings und Webinaren zu verbessern. Du kannst Hintergrundgeräusche eliminieren, Echo reduzieren und Sprachfrequenzen für kristallklare Kommunikation verstärken. Dies ist ideal zur Verbesserung schwer zu hörender Sprecher oder für die Verwendung deines Computers in geräuschvollen Umgebungen.

### Stereo/Mono-Umwandlung

Der Stereo/Mono-Schalter ist eine leistungsstarke Barrierefreiheitsfunktion, die den linken und rechten Audiokanal kombiniert. Dies hilft Nutzern mit einseitigem Hörverlust, verbessert die Nutzung mit nur einem Ohrhörer und optimiert Audio, bei dem die Stereo-Trennung zu extrem ist. Du kannst je nach deiner Hörsituation einfach zwischen Stereo- und Mono-Modi wechseln.

### Musikverbesserung und Klangfarbensteuerung

Verwandle dein Musikhörerlebnis mit den präzisen Frequenzreglern von BrowserEQ. Du kannst bestimmte Frequenzbereiche anpassen, um die Bassansprache zu verbessern, Gesang aufzuhellen oder die Klangqualität jeder Musik komplett neu zu gestalten. Erstelle maßgeschneiderte Klangsignaturen für verschiedene Genres, gleiche Defizite von Kopfhörern oder Lautsprechern aus und entdecke neue klangliche Details in deinen Lieblingsstücken.

## Barrierefreiheitsfunktionen

BrowserEQ wurde mit Blick auf Barrierefreiheit entwickelt:
- **Hörzugänglichkeit**: Passe Audio an, um Hörsensibilitäten oder -beeinträchtigungen gerecht zu werden
- **Auditive Verarbeitung**: Verbessere die Klarheit, indem du ablenkende Frequenzen herausfilterst
- **Sensorische Empfindlichkeiten**: Reduziere Frequenzen, die Unbehagen auslösen
- **Audiobalance**: Korrigiere unausgewogenes Audio in Inhalten

## Für Entwickler

### Projektstruktur

```
BrowserEQ-V2/
├── src/
│   ├── components/           # Vue-Komponenten
│   │   ├── PresetManager.vue # Voreinstellungsverwaltung
│   │   ├── Slider.vue        # Schieberegler-Steuerung
│   │   ├── Strip.vue         # Filterstreifen
│   │   └── Toggle.vue        # Umschalter
│   ├── logic/                # Kernlogik
│   │   ├── audioProcessing.ts  # Web Audio API Handhabung
│   │   ├── EQValues.ts       # Standard-Voreinstellungen
│   │   ├── presetStorage.ts  # LocalStorage-Verwaltung
│   │   └── ...
│   ├── popup/                # Erweiterungspopup
│   │   └── Popup.vue         # Hauptbenutzeroberfläche
│   └── ...
├── extension/                # Kompilierte Erweiterung
└── ...
```

### Schlüsseltechnologien

- **Vue 3**: Frontend-Framework mit Composition API
- **Web Audio API**: Kernfähigkeiten zur Audiobearbeitung
- **LocalStorage API**: Voreinstellungsspeicherung
- **Chrome Extension APIs**: Für Tab-Audioaufnahme

### Audio-Verarbeitungspipeline

1. **Erfassung**: Die Erweiterung erfasst Tab-Audio mit `chrome.tabCapture`.
2. **Quellenerstellung**: Ein MediaStreamAudioSourceNode wird aus der Erfassung erstellt.
3. **Filterkette**: Audio wird durch verschiedene BiquadFilterNode-Instanzen basierend auf Benutzereinstellungen geleitet.
4. **Verstärkungsknoten**: Abschließende Verarbeitung umfasst Lautstärkeanpassung durch einen GainNode.
5. **Ausgabe**: Verarbeitetes Audio wird an das AudioContext-Ziel gesendet.

```
MediaStreamSource → [Aktivierte Filter] → GainNode → AudioContext.destination
```

### Bauen und Testen

```bash
# Abhängigkeiten installieren
npm install

# Entwicklungsbuild mit Hot-Reload
npm run dev

# Produktionsbuild
npm run build

# Tests ausführen
npm test
```

## Beitrag leisten

Wir begrüßen Beiträge zu BrowserEQ! Bitte überprüfe unsere Beitragsrichtlinien in [CONTRIBUTING.md](CONTRIBUTING.md).

### Fehlermeldungen & Funktionsanfragen

Bitte verwende den GitHub Issue Tracker, um Fehler zu melden oder Funktionen vorzuschlagen. Bei der Meldung eines Fehlers bitte angeben:
- Deine Browser-Version
- BrowserEQ-Version
- Schritte zur Reproduktion des Problems
- Erwartetes vs. tatsächliches Verhalten
- Alle relevanten Screenshots oder Konsolenprotokolle

## Lizenz

BrowserEQ wird unter der [BrowserEQ Strong Copyleft License](LICENSE) veröffentlicht, einer Lizenz, die darauf ausgelegt ist, die Software und alle Derivate dauerhaft frei und Open Source zu halten. Diese Lizenz:

- Stellt sicher, dass die Software frei zur Nutzung, Modifikation und Verteilung bleibt
- Untersagt jegliche kommerzielle Ausbeutung oder den Verkauf der Software oder ihrer Derivate
- Erfordert, dass alle Modifikationen unter denselben Lizenzbedingungen geteilt werden müssen
- Verhindert jede zukünftige Relizenzierung unter anderen Bedingungen

Diese Lizenz wurde speziell gewählt, um die Benutzerfreiheiten zu schützen und sicherzustellen, dass BrowserEQ eine Gemeinschaftsressource bleibt, die nicht kommerzialisiert oder geschlossen werden kann.

## Sponsoren

<p align="center">BrowserEQ wird stolz unterstützt von:</p>

<p align="center">
  <a href="https://www.bmbf.de/DE/Home/home_node.html" target="_blank">
    <img src="docs/images/internet_in_farbe_de.jpg" alt="Internet in Farbe" width="300">
  </a>
  <a href="https://prototypefund.de" target="_blank">
    <img src="docs/images/PrototypeFund-Logo.png" alt="Prototype Fund" width="300">
  </a>
</p>
