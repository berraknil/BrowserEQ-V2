# BrowserEQ V2 Developer Guide

[Deutsche Version weiter unten](#browsereq-v2-entwicklerhandbuch)

This guide provides detailed information for developers who want to understand, modify, or contribute to the BrowserEQ project.

## Architecture Overview

BrowserEQ uses a Vue 3 frontend with the Composition API, combined with Web Audio API for audio processing. The extension follows a component-based architecture:

```
UI Components (Vue) → Audio Logic (TypeScript) → Web Audio API → Browser Audio
```

### Key Components

1. **Popup.vue**: The main component that renders the user interface and orchestrates the other components.
2. **PresetManager.vue**: Handles preset selection and management.
3. **Strip.vue**: Represents a single filter strip with its controls.
4. **Slider.vue & Toggle.vue**: Reusable UI controls.

### Core Logic Modules

1. **audioProcessing.ts**: Contains the Web Audio API implementation.
2. **EQValues.ts**: Defines the default presets.
3. **presetStorage.ts**: Manages storing preferences in localStorage.
4. **recordingService.ts**: Handles audio recording functionality.

## Data Flow

1. User interacts with UI components (sliders, toggles, buttons)
2. Component emits events to parent (Popup.vue)
3. Popup.vue updates the current preset state
4. Audio processing logic applies changes to Web Audio nodes
5. Preferences can be stored in localStorage

## Key Interfaces

The core data structures are defined in several places:

```typescript
// EQ Preset structure
interface EQPreset {
  mainOut: {
    gain: number;
    muted: boolean;
  };
  filters: {
    [key: string]: EQFilter;
  };
}

// Individual filter structure
interface EQFilter {
  name: string;
  type: BiquadFilterType;  // Web Audio API filter type
  enabled: boolean;
  frequency: {
    value: number;
  };
  Q?: {
    name: string;
    value: number;
  };
  gain?: {
    value: number;
  };
}
```

## Audio Processing Pipeline

1. **Capture**: The extension captures tab audio using `chrome.tabCapture`.
2. **Source Creation**: A MediaStreamAudioSourceNode is created from the capture.
3. **Filter Chain**: Audio is routed through various BiquadFilterNode instances based on user settings.
4. **Gain Node**: Final processing includes volume adjustment through a GainNode.
5. **Output**: Processed audio is sent to the AudioContext destination.

```
MediaStreamSource → [Enabled Filters] → GainNode → AudioContext.destination
```

### Filter Connectivity Logic

The system dynamically connects and disconnects filters when users toggle them:

1. When enabling a filter, it's inserted into the chain at the appropriate point.
2. When disabling a filter, it's bypassed, and the chain is reconnected.
3. The `lastFilter` reference always points to the last active filter in the chain.

## Preset Management

The preset system works as follows:

1. Default presets are defined in `EQValues.ts` and serve as the source of truth.
2. User preferences may be stored in localStorage for persistence between sessions.
<!-- Removed mentions of saving/resetting functionality -->

### Deep Copy Implementation

To avoid reference issues, presets are deep-copied using a custom function:

```typescript
function deepCopyPreset(preset: EQPreset): EQPreset {
  // Creates a new object with all nested properties copied
  // This prevents issues with shared references
}
```

## Reactive State Management

The extension uses Vue 3's reactivity system:

1. `ref` and `computed` are used for reactive state.
2. Watchers (`watch`) observe changes to critical values like sliders.
3. Two-way binding with `v-model` connects UI elements to state.

## LocalStorage Schema

Preferences are stored in localStorage for persistence:

```json
// Key format example
{
  "selectedPreset": "Neutral",
  // other settings...
}
```

## Adding New Features

### Adding a New Preset

1. Add the preset definition to `EQValues.ts`:
   ```typescript
   NewPreset: {
     mainOut: { gain: 1.0, muted: false },
     filters: {
       // Define filter settings
     }
   }
   ```

2. The UI will automatically include the new preset in the dropdown menu.

### Adding a New Filter Type

1. Add the filter to the base preset in `EQValues.ts`.
2. Create UI elements in `Popup.vue` for the new filter.
3. Update `audioProcessing.ts` to handle the new filter type.
4. Update related logic as needed.

## Common Pitfalls

1. **Reference Issues**: Always use deep copies when working with preset objects to avoid unintended changes.
2. **Web Audio API Timing**: Be aware that some audio operations must be carefully timed to avoid clicks and pops.
3. **Chrome Extension Context**: Remember that the extension runs in an isolated context with security restrictions.

## Testing

We recommend testing your changes in these scenarios:

1. **Different Content Types**: Test with music, voice calls, videos, etc.
2. **Edge Cases**: Test with extreme filter settings and combinations.
3. **Performance**: Ensure changes don't cause audio glitches or high CPU usage.

## Build Process

The project uses Vite for building:

1. **Development**: `npm run dev` - Builds in development mode with hot reloading.
2. **Production**: `npm run build` - Creates a production version in the `extension` folder.
3. **Testing**: Load the `extension` folder as an unpacked extension in Chrome.

## License

All code is licensed under the [BrowserEQ Strong Copyleft License](../LICENSE). This license ensures that BrowserEQ and all derivative works remain perpetually free and open source. Commercial exploitation, relicensing, or distribution for a fee is explicitly prohibited.

By contributing code or documentation to this project, you agree to license your contributions under the same license.

## Resources

- [Web Audio API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Vue 3 Documentation](https://v3.vuejs.org/)
- [Chrome Extension API](https://developer.chrome.com/docs/extensions/reference/)

---

# BrowserEQ V2 Entwicklerhandbuch

[English version above](#browsereq-v2-developer-guide)

Dieses Handbuch bietet detaillierte Informationen für Entwickler, die das BrowserEQ-Projekt verstehen, modifizieren oder dazu beitragen möchten.

## Architekturübersicht

BrowserEQ verwendet ein Vue 3 Frontend mit der Composition API, kombiniert mit der Web Audio API für die Audioverarbeitung. Die Erweiterung folgt einer komponentenbasierten Architektur:

```
UI-Komponenten (Vue) → Audio-Logik (TypeScript) → Web Audio API → Browser-Audio
```

### Hauptkomponenten

1. **Popup.vue**: Die Hauptkomponente, die die Benutzeroberfläche rendert und die anderen Komponenten orchestriert.
2. **PresetManager.vue**: Verwaltet die Voreinstellungsauswahl und -verwaltung.
3. **Strip.vue**: Repräsentiert einen einzelnen Filterstreifen mit seinen Steuerelementen.
4. **Slider.vue & Toggle.vue**: Wiederverwendbare UI-Steuerelemente.

### Kern-Logikmodule

1. **audioProcessing.ts**: Enthält die Web Audio API-Implementierung.
2. **EQValues.ts**: Definiert die Standardvoreinstellungen.
3. **presetStorage.ts**: Verwaltet die Speicherung von Einstellungen im localStorage.
4. **recordingService.ts**: Handhabt die Audio-Aufnahmefunktionalität.

## Datenfluss

1. Benutzer interagiert mit UI-Komponenten (Schieberegler, Umschalter, Buttons)
2. Komponente sendet Ereignisse an übergeordnetes Element (Popup.vue)
3. Popup.vue aktualisiert den aktuellen Voreinstellungsstatus
4. Audio-Verarbeitungslogik wendet Änderungen auf Web Audio-Knoten an
5. Einstellungen können im localStorage gespeichert werden

## Wichtige Schnittstellen

Die Kerndatenstrukturen sind an mehreren Stellen definiert:

```typescript
// EQ-Voreinstellungsstruktur
interface EQPreset {
  mainOut: {
    gain: number;
    muted: boolean;
  };
  filters: {
    [key: string]: EQFilter;
  };
}

// Individuelle Filterstruktur
interface EQFilter {
  name: string;
  type: BiquadFilterType;  // Web Audio API Filtertyp
  enabled: boolean;
  frequency: {
    value: number;
  };
  Q?: {
    name: string;
    value: number;
  };
  gain?: {
    value: number;
  };
}
```

## Audio-Verarbeitungspipeline

1. **Erfassung**: Die Erweiterung erfasst Tab-Audio mit `chrome.tabCapture`.
2. **Quellenerstellung**: Ein MediaStreamAudioSourceNode wird aus der Erfassung erstellt.
3. **Filterkette**: Audio wird durch verschiedene BiquadFilterNode-Instanzen basierend auf Benutzereinstellungen geleitet.
4. **Verstärkungsknoten**: Abschließende Verarbeitung umfasst Lautstärkeanpassung durch einen GainNode.
5. **Ausgabe**: Verarbeitetes Audio wird an das AudioContext-Ziel gesendet.

```
MediaStreamSource → [Aktivierte Filter] → GainNode → AudioContext.destination
```

### Filterverbindungslogik

Das System verbindet und trennt Filter dynamisch, wenn Benutzer sie umschalten:

1. Beim Aktivieren eines Filters wird er an der entsprechenden Stelle in die Kette eingefügt.
2. Beim Deaktivieren eines Filters wird er umgangen, und die Kette wird neu verbunden.
3. Die `lastFilter`-Referenz zeigt immer auf den letzten aktiven Filter in der Kette.

## Voreinstellungsverwaltung

Das Voreinstellungssystem funktioniert wie folgt:

1. Standardvoreinstellungen sind in `EQValues.ts` definiert und dienen als Quelle der Wahrheit.
2. Benutzereinstellungen können im localStorage für die Persistenz zwischen Sitzungen gespeichert werden.
<!-- Removed mentions of saving/resetting functionality -->

### Deep-Copy-Implementierung

Um Referenzprobleme zu vermeiden, werden Voreinstellungen mit einer benutzerdefinierten Funktion tief kopiert:

```typescript
function deepCopyPreset(preset: EQPreset): EQPreset {
  // Erstellt ein neues Objekt mit allen verschachtelten Eigenschaften kopiert
  // Dies verhindert Probleme mit gemeinsam genutzten Referenzen
}
```

## Reaktive Zustandsverwaltung

Die Erweiterung verwendet das Reaktivitätssystem von Vue 3:

1. `ref` und `computed` werden für den reaktiven Zustand verwendet.
2. Beobachter (`watch`) überwachen Änderungen an kritischen Werten wie Schiebereglern.
3. Zwei-Wege-Bindung mit `v-model` verbindet UI-Elemente mit dem Zustand.

## LocalStorage-Schema

Einstellungen werden im localStorage für die Persistenz gespeichert:

```json
// Schlüsselformat-Beispiel
{
  "selectedPreset": "Neutral",
  // andere Einstellungen...
}
```

## Neue Funktionen hinzufügen

### Hinzufügen einer neuen Voreinstellung

1. Fügen Sie die Voreinstellungsdefinition zu `EQValues.ts` hinzu:
   ```typescript
   NewPreset: {
     mainOut: { gain: 1.0, muted: false },
     filters: {
       // Filtereinstellungen definieren
     }
   }
   ```

2. Die Benutzeroberfläche wird die neue Voreinstellung automatisch im Dropdown-Menü aufnehmen.

### Hinzufügen eines neuen Filtertyps

1. Füge den Filter zur Basisvoreinstellung in `EQValues.ts` hinzu.
2. Erstelle UI-Elemente in `Popup.vue` für den neuen Filter.
3. Aktualisiere `audioProcessing.ts`, um den neuen Filtertyp zu handhaben.
4. Aktualisiere die zugehörige Logik nach Bedarf.

## Häufige Fallstricke

1. **Referenzprobleme**: Verwenden Sie immer tiefe Kopien, wenn Sie mit Voreinstellungsobjekten arbeiten, um unbeabsichtigte Änderungen zu vermeiden.
2. **Web Audio API Timing**: Beachten Sie, dass einige Audiooperationen sorgfältig zeitlich abgestimmt werden müssen, um Klicks und Knackgeräusche zu vermeiden.
3. **Chrome-Erweiterungskontext**: Denken Sie daran, dass die Erweiterung in einem isolierten Kontext mit Sicherheitsbeschränkungen ausgeführt wird.

## Tests

Wir empfehlen, Ihre Änderungen in diesen Szenarien zu testen:

1. **Verschiedene Inhaltstypen**: Testen Sie mit Musik, Sprachanrufen, Videos usw.
2. **Randfälle**: Testen Sie mit extremen Filtereinstellungen und Kombinationen.
3. **Leistung**: Stellen Sie sicher, dass Änderungen keine Audioprobleme oder hohe CPU-Auslastung verursachen.

## Build-Prozess

Das Projekt verwendet Vite zum Erstellen:

1. **Entwicklung**: `npm run dev` - Erstellt im Entwicklungsmodus mit Hot Reloading.
2. **Produktion**: `npm run build` - Erstellt eine Produktionsversion im Ordner `extension`.
3. **Tests**: Laden Sie den Ordner `extension` als entpackte Erweiterung in Chrome.

## License

All code is licensed under the [BrowserEQ Strong Copyleft License](../LICENSE). This license ensures that BrowserEQ and all derivative works remain perpetually free and open source. Commercial exploitation, relicensing, or distribution for a fee is explicitly prohibited.

By contributing code or documentation to this project, you agree to license your contributions under the same license.

## Ressourcen

- [Web Audio API Dokumentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Vue 3 Dokumentation](https://v3.vuejs.org/)
- [Chrome Extension API](https://developer.chrome.com/docs/extensions/reference/)
