import { useState, useMemo, useEffect, useRef, ChangeEvent } from "react";
import { events as initialEvents } from "./data/events";
import { FilterState, Event, Campus } from "./types";
import { getStartOfWeek, getDaysInWeek } from "./utils/date";
import Header from "./components/Header";
import Filters from "./components/Filters";
import WeekCalendar from "./components/WeekCalendar";
import EventModal from "./components/EventModal";
import { parseISO } from "date-fns";

const INITIAL_FILTERS: FilterState = {
  campuses: ["Burnaby", "Surrey", "Vancouver"],
  snacksOnly: false,
  category: "All",
  freeToJoinOnly: false,
  search: "",
};

export default function App() {
  // Use the current date from metadata: 2026-03-01
  const [now, setNow] = useState(new Date("2026-03-01T00:30:00-08:00"));
  const [viewDate, setViewDate] = useState(new Date("2026-03-01T00:30:00-08:00"));
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load events on mount
  useEffect(() => {
    const savedEvents = localStorage.getItem("snackfu_events");
    if (savedEvents) {
      try {
        setAllEvents(JSON.parse(savedEvents));
      } catch (e) {
        console.error("Failed to parse saved events", e);
        setAllEvents(initialEvents);
      }
    } else {
      setAllEvents(initialEvents);
    }
  }, []);
  
  // Calculate current week
  const weekStart = useMemo(() => getStartOfWeek(viewDate), [viewDate]);
  const days = useMemo(() => getDaysInWeek(weekStart), [weekStart]);

  // Update "now" every minute to keep the "upcoming" highlight fresh
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(prev => new Date(prev.getTime() + 60000));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const filteredEvents = useMemo(() => {
    return allEvents.filter(event => {
      // Campus filter
      if (filters.campuses.length > 0 && !filters.campuses.includes(event.campus)) return false;
      
      // Snacks filter
      if (filters.snacksOnly && !event.snacks.has) return false;
      
      // Category filter
      if (filters.category !== "All" && event.category !== filters.category) return false;
      
      // Free to join filter
      if (filters.freeToJoinOnly && !event.freeToJoin) return false;
      
      // Search filter
      if (filters.search) {
        const search = filters.search.toLowerCase();
        const matches = 
          event.title.toLowerCase().includes(search) ||
          event.club.toLowerCase().includes(search) ||
          event.location.toLowerCase().includes(search);
        if (!matches) return false;
      }
      
      return true;
    });
  }, [filters, allEvents]);

  const handleToday = () => {
    const realNow = new Date("2026-03-01T00:30:00-08:00");
    setNow(realNow);
    setViewDate(realNow);
    
    // Scroll to today column
    setTimeout(() => {
      const todayCol = document.getElementById("today-column");
      if (todayCol) {
        todayCol.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }, 100);
  };

  const handleReset = () => {
    setFilters(INITIAL_FILTERS);
  };

  const handlePrevWeek = () => {
    setViewDate(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 7);
      return d;
    });
  };

  const handleNextWeek = () => {
    setViewDate(prev => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 7);
      return d;
    });
  };

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      try {
        // This is a bit hacky because we're expecting a .ts file but we'll try to parse it as JSON
        // If the user uploads a .ts file that is just `export const events = [...]`, we need to extract the array
        let data: Event[] = [];
        if (content.includes("export const events")) {
          const jsonMatch = content.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            // We'll try to evaluate it loosely or just use JSON.parse if it's clean enough
            // For a hackathon demo, we'll assume they upload a JSON file or a very clean TS array
            const rawJson = jsonMatch[0].replace(/(\w+):/g, '"$1":').replace(/'/g, '"');
            data = JSON.parse(rawJson);
          }
        } else {
          data = JSON.parse(content);
        }

        if (Array.isArray(data)) {
          setAllEvents(data);
          localStorage.setItem("snackfu_events", JSON.stringify(data));
          alert("Events updated successfully!");
        }
      } catch (err) {
        console.error("Failed to upload events", err);
        alert("Failed to upload events. Please ensure the file is valid JSON or a simple TS array.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-red-100 selection:text-red-900">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept=".json,.ts,.js" 
        onChange={handleFileUpload}
      />
      <Header 
        weekStart={weekStart} 
        onPrevWeek={handlePrevWeek} 
        onNextWeek={handleNextWeek} 
        isCurrentWeek={getStartOfWeek(now).getTime() === weekStart.getTime()}
        onLogoClick={handleLogoClick}
      />
      
      <Filters 
        filters={filters} 
        setFilters={setFilters} 
        onToday={handleToday} 
        onReset={handleReset} 
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        {filteredEvents.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl">🥨</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No snacks found!</h2>
            <p className="text-gray-500 max-w-md">
              Try adjusting your filters or search terms. Maybe there's food at another campus?
            </p>
            <button
              onClick={handleReset}
              className="mt-6 px-6 py-2 bg-red-600 text-white rounded-full font-bold hover:bg-red-700 transition-colors"
            >
              Show all events
            </button>
          </div>
        ) : (
          <WeekCalendar 
            days={days} 
            events={filteredEvents} 
            onEventClick={setSelectedEvent} 
            now={now}
          />
        )}
      </main>

      <EventModal 
        event={selectedEvent} 
        onClose={() => setSelectedEvent(null)} 
      />

      {/* Mobile list view toggle could go here, but we'll stick to a responsive grid for now */}
      <footer className="bg-white border-t border-gray-100 py-4 px-8 text-center">
        <p className="text-xs text-gray-400 font-medium tracking-wide uppercase">
          SnackFU • Mountain Madness 2026 Hackathon Project
        </p>
      </footer>
    </div>
  );
}
