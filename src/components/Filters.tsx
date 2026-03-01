import { Search, RotateCcw, Calendar as CalendarIcon } from "lucide-react";
import { Campus, Category, FilterState } from "../types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface FiltersProps {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  onToday: () => void;
  onReset: () => void;
}

const campuses: Campus[] = ["Burnaby", "Surrey", "Vancouver"];
const categories: (Category | "All")[] = ["All", "Social", "Career", "Academic", "Culture", "Sports", "Volunteer", "Other"];

export default function Filters({ filters, setFilters, onToday, onReset }: FiltersProps) {
  const toggleCampus = (campus: Campus) => {
    const newCampuses = filters.campuses.includes(campus)
      ? filters.campuses.filter(c => c !== campus)
      : [...filters.campuses, campus];
    setFilters({ ...filters, campuses: newCampuses });
  };

  return (
    <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 p-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col gap-4">
        {/* Top Row: Search and Quick Actions */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search title, club, or location..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              onClick={onToday}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              <CalendarIcon size={16} />
              Today
            </button>
            <button
              onClick={onReset}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              <RotateCcw size={16} />
              Reset
            </button>
          </div>
        </div>

        {/* Bottom Row: Chips and Toggles */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-tight mr-1">Campus</span>
            <div className="flex gap-1">
              {campuses.map(campus => (
                <button
                  key={campus}
                  onClick={() => toggleCampus(campus)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium border transition-all",
                    filters.campuses.includes(campus)
                      ? "bg-red-50 border-red-200 text-red-700"
                      : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
                  )}
                >
                  {campus}
                </button>
              ))}
            </div>
          </div>

          <div className="h-4 w-px bg-gray-200 hidden sm:block" />

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={filters.snacksOnly}
                  onChange={(e) => setFilters({ ...filters, snacksOnly: e.target.checked })}
                />
                <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-red-500 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
              </div>
              <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">Snacks only 🍪</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={filters.freeToJoinOnly}
                  onChange={(e) => setFilters({ ...filters, freeToJoinOnly: e.target.checked })}
                />
                <div className="w-10 h-5 bg-gray-200 rounded-full peer peer-checked:bg-red-500 transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full"></div>
              </div>
              <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">Free to join</span>
            </label>
          </div>

          <div className="h-4 w-px bg-gray-200 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-tight mr-1">Category</span>
            <select
              className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value as Category | "All" })}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
