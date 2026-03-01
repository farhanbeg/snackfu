# SnackFU Event Schema Specification

This document defines the structure required for uploading custom event data via the **SnackFU** hidden admin feature (triggered by clicking the "SnackFU" logo in the header).

## Supported File Formats
- **JSON (`.json`)**: A raw array of event objects.
- **TypeScript/JavaScript (`.ts`, `.js`)**: A file containing `export const events = [...]`.

---

## The Event Interface (TypeScript)

```typescript
export type Campus = "Burnaby" | "Surrey" | "Vancouver";
export type Category = "Social" | "Career" | "Academic" | "Culture" | "Sports" | "Volunteer" | "Other";
export type SourceType = "Discord" | "Instagram" | "SFU";

export interface Event {
  id: string;           // Unique identifier (e.g., "1", "uuid-123")
  title: string;        // Name of the event
  club: string;         // Name of the organizing club
  campus: Campus;       // One of: "Burnaby", "Surrey", "Vancouver"
  location: string;     // Room number or building (e.g., "AQ 3000")
  start: string;        // ISO 8601 string (e.g., "2026-03-02T17:30:00-08:00")
  end: string;          // ISO 8601 string (e.g., "2026-03-02T19:00:00-08:00")
  category: Category;   // One of the categories listed above
  snacks: {
    has: boolean;       // Whether snacks are provided
    types?: string[];   // Optional: List of snack types (e.g., ["Pizza", "Soda"])
  };
  freeToJoin: boolean;  // Whether the event is free for all students
  joinLink: string;     // URL to join or register
  sourceType: SourceType; // Where the event was found ("Discord", "Instagram", "SFU")
  sourceLink: string;   // Original link to the event post
  description?: string; // Optional: Longer blurb about the event
}
```

---

## Example Files

### 1. JSON Format (`events.json`)
```json
[
  {
    "id": "custom-1",
    "title": "Hackathon Workshop",
    "club": "SFU Surge",
    "campus": "Burnaby",
    "location": "SUB 2000",
    "start": "2026-03-02T18:00:00-08:00",
    "end": "2026-03-02T20:00:00-08:00",
    "category": "Career",
    "snacks": {
      "has": true,
      "types": ["Pizza", "Energy Drinks"]
    },
    "freeToJoin": true,
    "joinLink": "https://sfusurge.com",
    "sourceType": "Discord",
    "sourceLink": "https://discord.gg/sfusurge",
    "description": "Learn how to build amazing projects in 24 hours!"
  }
]
```

### 2. TypeScript Format (`events.ts`)
```typescript
export const events = [
  {
    id: "custom-2",
    title: "Yoga in the Park",
    club: "Wellness Club",
    campus: "Vancouver",
    location: "Stanley Park",
    start: "2026-03-03T10:00:00-08:00",
    end: "2026-03-03T11:30:00-08:00",
    category: "Sports",
    snacks: {
      has: false
    },
    "freeToJoin": true,
    "joinLink": "https://sfu.ca/wellness",
    "sourceType": "SFU",
    "sourceLink": "https://sfu.ca/wellness"
  }
];
```

---

## Important Notes
1. **Date Format**: Use ISO 8601 strings with the `-08:00` offset for Vancouver time.
2. **Persistence**: Uploaded files are stored in your browser's `localStorage`. To revert to the default data, clear your browser cache or site data for this URL.
3. **Validation**: The app performs a basic check to ensure the uploaded content is an array. If the format is invalid, an alert will notify you.

---

## AI Event Parser (Gemini)

The **Parse** button in the filter bar allows you to add events by pasting raw text (e.g., Discord announcements).

### Configuration
To use this feature outside of the AI Studio environment:
1. Create a `.env` file in the project root.
2. Add `VITE_GEMINI_API_KEY=your_api_key_here`.
3. Restart your development server.

### How it Works
- Gemini extracts the title, club, location, and time.
- It intelligently infers dates (e.g., "next Monday") based on the current app date (March 1, 2026).
- It categorizes the event and identifies if snacks are provided.
- New events are added to your local session and persisted in `localStorage`.
