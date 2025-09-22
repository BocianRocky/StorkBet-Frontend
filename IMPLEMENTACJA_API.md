# Implementacja API dla StorkBet Frontend

## Opis funkcjonalności

Zaimplementowano profesjonalny system pobierania i wyświetlania danych o kursach sportowych z API. Po kliknięciu konkretnego sportu w SideBarze wykonywany jest endpoint `http://localhost:5119/api/Odds/{sportKey}`, gdzie `sportKey` to parametr `key` z `GroupedSportItem`.

## Struktura plików

### Nowe pliki:
- `src/services/api.ts` - Serwis API do komunikacji z backendem
- `src/context/SportContext.tsx` - Kontekst React do zarządzania stanem aplikacji
- `src/hooks/useApiError.ts` - Hook do obsługi błędów API

### Zmodyfikowane pliki:
- `src/App.tsx` - Dodano SportProvider
- `src/components/layout/SideBar.tsx` - Dodano obsługę kliknięć i wywołania API
- `src/components/layout/MainContent.tsx` - Dodano wyświetlanie danych z API

## Funkcjonalności

### 1. Pobieranie danych o sportach
- Automatyczne pobieranie listy sportów z `/api/Sports/grouped`
- Grupowanie sportów w kategorie
- Rozwijane/zwijane sekcje

### 2. Wybór sportu i pobieranie kursów
- Kliknięcie na sport wywołuje endpoint `/api/Odds/{sportKey}`
- Wizualne oznaczenie wybranego sportu
- Stan ładowania podczas pobierania danych

### 3. Wyświetlanie danych
- Profesjonalne karty meczów z kursami
- Obsługa różnych typów kursów (z remisem i bez)
- Formatowanie dat w języku polskim
- Licznik dostępnych meczy

### 4. Obsługa błędów i stanów
- Stany ładowania z animacją
- Obsługa błędów z przyjaznymi komunikatami
- Przycisk do czyszczenia wyboru
- Fallback dla pustych danych

### 5. UX/UI
- Responsywny design
- Płynne animacje i przejścia
- Spójny design z resztą aplikacji
- Intuicyjna nawigacja

## Użycie

1. Uruchom aplikację
2. Kliknij na dowolny sport w menu bocznym
3. Zostaną pobrane i wyświetlone kursy dla tego sportu
4. Użyj przycisku "Wyczyść wybór" aby wrócić do stanu początkowego

## Struktura danych API

### Rzeczywista odpowiedź z `/api/Odds/{sportKey}`:
```typescript
interface ApiEventData {
  eventId: number;
  eventDate: string;
  odds: Array<{
    teamName: string;
    oddsValue: number;
  }>;
}
```

### Przykład danych:
```json
[
  {
    "eventId": 2,
    "eventDate": "2025-10-11T21:00:00",
    "odds": [
      {
        "teamName": "Arslanbek Makhmudov",
        "oddsValue": 1.81
      },
      {
        "teamName": "David Allen",
        "oddsValue": 1.98
      },
      {
        "teamName": "Draw",
        "oddsValue": 33
      }
    ]
  }
]
```

### Przekształcona struktura dla komponentów:
```typescript
interface OddsData {
  id: string;
  home: string;
  away: string;
  league: string;
  date: string;
  odds: {
    home: number | undefined;
    draw?: number | undefined;
    away: number | undefined;
  };
}
```

### Odpowiedź z `/api/Sports/grouped`:
```typescript
interface GroupedSports {
  group: string;
  sports: GroupedSportItem[];
}

interface GroupedSportItem {
  title: string;
  group: string;
  key: string;  // używane jako parametr w URL
}
```

## Logika przekształcania danych

API service automatycznie przekształca dane z formatu API do formatu używanego przez komponenty:

1. **Identyfikacja zespołów**: Pierwszy zespół (nie "Draw") to home, drugi to away
2. **Kurs na remis**: Szuka zespołu o nazwie "Draw" 
3. **Liga**: Używa sportKey jako nazwy ligi (np. "boxing_boxing" → "BOXING BOXING")
4. **ID**: Tworzy unikalne ID z eventId
5. **Data**: Przekazuje eventDate bez zmian

## Konfiguracja

URL API można zmienić w pliku `src/services/api.ts` w zmiennej `baseUrl`.
