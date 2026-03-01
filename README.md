# SnackFU - SFU Event & Snack Calendar

SnackFU is a weekly event calendar for Simon Fraser University (SFU) students that highlights club events, workshops, and social gatherings—with a special focus on finding free snacks.

## Features

- **Weekly Calendar Grid**: A clean, modern 7-day view of all campus events.
- **Smart Filters**: Filter by campus (Burnaby, Surrey, Vancouver), category, and snack availability.
- **Upcoming Highlights**: Events happening within the next 2 hours are automatically highlighted in red.
- **Event Details**: Click any event to see a summary, location, and snack details.
- **ICS Export**: Add events directly to your personal calendar with one click.
- **Join Links**: Quick access to Discord, Instagram, or SFU event pages.

## How to Run

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## How to Add Events

Events are stored in `src/data/events.ts`. To add a new event, append a new object to the `events` array following the `Event` schema.

### Event Schema

```typescript
interface Event {
  id: string;
  title: string;
  club: string;
  campus: "Burnaby" | "Surrey" | "Vancouver";
  location: string;
  start: string; // ISO 8601 string with timezone offset
  end: string;   // ISO 8601 string with timezone offset
  category: "Social" | "Career" | "Academic" | "Culture" | "Sports" | "Volunteer" | "Other";
  snacks: {
    has: boolean;
    types?: string[]; // Optional list of snack types
  };
  freeToJoin: boolean;
  joinLink: string;
  sourceType: "Discord" | "Instagram" | "SFU";
  sourceLink: string;
  description?: string;
}
```

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **Animation**: Motion (formerly Framer Motion)
- **Icons**: Lucide React
- **Date Handling**: date-fns
