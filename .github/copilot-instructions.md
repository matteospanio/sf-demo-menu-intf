# Copilot Instructions

Queste istruzioni guidano GitHub Copilot nello sviluppo di questo progetto React/TypeScript.

## Principi Fondamentali

### DRY (Don't Repeat Yourself)
- **Estrai logica comune** in hook personalizzati (`src/hooks/`)
- **Crea componenti riutilizzabili** per UI elements ripetuti
- **Centralizza costanti** in `src/constants.ts`
- **Utilizza utility functions** in `src/utils.ts` per operazioni comuni
- **Evita duplicazione** di tipi e interfacce - definiscili una volta in `src/api/types.ts`

### SOLID Principles

#### Single Responsibility
- Ogni componente deve avere **una sola responsabilità**
- Separa la logica di business dalla presentazione
- Usa hook custom per incapsulare logica complessa

#### Open/Closed
- I componenti devono essere **aperti all'estensione, chiusi alla modifica**
- Usa props e composition per estendere funzionalità
- Preferisci la composizione all'ereditarietà

#### Liskov Substitution
- I componenti figli devono poter sostituire i componenti padre
- Mantieni contratti di interfaccia consistenti

#### Interface Segregation
- Definisci **interfacce piccole e specifiche**
- Non forzare componenti a dipendere da props non utilizzate

#### Dependency Inversion
- Dipendi da **astrazioni, non implementazioni concrete**
- Usa Context API per dependency injection
- Centralizza le chiamate API in `src/api/services.ts`

## Design Patterns

### Component Patterns
- **Container/Presentational**: Separa logica (containers) da UI (presentational)
- **Compound Components**: Per componenti complessi con sotto-componenti correlati
- **Render Props / Children as Function**: Per logica condivisa tra componenti
- **Higher-Order Components (HOC)**: Solo quando necessario, preferisci hooks

### State Management Patterns
- **Context + Reducer**: Per stato globale complesso (vedi `src/contexts/`)
- **Custom Hooks**: Per logica di stato riutilizzabile (vedi `src/hooks/`)
- **Lifting State Up**: Quando lo stato deve essere condiviso tra siblings

### API Patterns
- **Repository Pattern**: Centralizza accesso dati in `src/api/services.ts`
- **Adapter Pattern**: Per normalizzare risposte API in `src/api/client.ts`

## Testing

### Requisiti
- **Scrivi test per ogni nuova feature** implementata
- Posiziona i test accanto ai file sorgente: `Component.tsx` → `Component.test.tsx`
- Usa **Vitest** per unit test e **Playwright** per E2E test

### Struttura Test
```typescript
// Component.test.tsx
import { render, screen } from '../test/test-utils';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('should render correctly', () => {
    // Arrange
    render(<ComponentName />);

    // Act & Assert
    expect(screen.getByRole('...')).toBeInTheDocument();
  });

  it('should handle user interaction', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<ComponentName />);

    // Act
    await user.click(screen.getByRole('button'));

    // Assert
    expect(...).toBe(...);
  });
});
```

### Test Coverage
- **Unit test**: Componenti, hooks, utility functions
- **Integration test**: Flussi utente completi
- **E2E test**: Scenari critici in `e2e/`

## UI/UX Guidelines

### Stile Elegante e Minimal
- **Whitespace generoso**: Usa spacing consistente
- **Palette colori limitata**: Massimo 3-4 colori principali
- **Tipografia pulita**: Font sans-serif, gerarchia chiara
- **Animazioni subtle**: Transizioni fluide, non invasive
- **Focus su contenuto**: Elimina elementi decorativi superflui

### Componenti UI
- Usa **Mantine UI** come design system principale
- Mantieni consistenza con il tema definito
- Preferisci componenti nativi Mantine prima di crearne custom

## Internazionalizzazione (i18n)

### Requisiti
- **Traduci SEMPRE** in inglese e italiano
- Usa **i18next** per le traduzioni
- File traduzioni in `public/locales/{lang}/translation.json`

### Struttura Traduzioni
```json
// public/locales/en/translation.json
{
  "namespace": {
    "key": "English text"
  }
}

// public/locales/it/translation.json
{
  "namespace": {
    "key": "Testo italiano"
  }
}
```

### Utilizzo
```typescript
import { useTranslation } from 'react-i18next';

const Component = () => {
  const { t } = useTranslation();
  return <Text>{t('namespace.key')}</Text>;
};
```

## Configurazione

### No Hardcoding!
- **MAI** hardcodare URL, chiavi API, configurazioni
- Usa **variabili d'ambiente** in `.env`
- Accedi tramite `import.meta.env.VITE_*`

### File di Configurazione
```
.env                 # Variabili locali (gitignored)
.env.example         # Template per sviluppatori
src/api/config.ts    # Configurazione API centralizzata
src/constants.ts     # Costanti applicative
```

### Esempio
```typescript
// ❌ SBAGLIATO
const API_URL = 'https://api.example.com';

// ✅ CORRETTO
// .env
VITE_API_URL=https://api.example.com

// src/api/config.ts
export const API_URL = import.meta.env.VITE_API_URL;
```

## Documentazione

### Quando Aggiornare
- **Nuove feature**: Aggiungi descrizione in README.md
- **Breaking changes**: Documenta migrazione necessaria
- **Nuovi componenti**: Aggiungi JSDoc con esempi d'uso
- **Modifiche API**: Aggiorna tipi in `src/api/types.ts`

### JSDoc per Componenti
```typescript
/**
 * Componente per la selezione del colore del piatto.
 *
 * @example
 * <ColorSelector
 *   value={selectedColor}
 *   onChange={(color) => setSelectedColor(color)}
 * />
 */
export const ColorSelector: React.FC<ColorSelectorProps> = ({ ... }) => {
  // ...
};
```

## Struttura Progetto

```
src/
├── api/           # Client HTTP, servizi, tipi API
├── components/    # Componenti React + test
├── contexts/      # React Context providers
├── hooks/         # Custom hooks
├── test/          # Setup e utilities per test
├── constants.ts   # Costanti applicative
├── utils.ts       # Utility functions
└── i18n.ts        # Configurazione i18next

e2e/               # Test end-to-end Playwright
public/locales/    # File traduzioni i18n
```

## Checklist Pre-Commit

- [ ] Codice segue principi DRY e SOLID
- [ ] Test scritti per nuove funzionalità
- [ ] Traduzioni aggiunte in EN e IT
- [ ] Nessun hardcoding di configurazioni
- [ ] Documentazione aggiornata se necessario
- [ ] UI consistente con lo stile minimal
