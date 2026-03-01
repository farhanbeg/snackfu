import { format } from "date-fns";
import { Utensils, ChevronLeft, ChevronRight } from "lucide-react";

interface HeaderProps {
  weekStart: Date;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  isCurrentWeek: boolean;
  onLogoClick?: () => void;
}

export default function Header({ weekStart, onPrevWeek, onNextWeek, isCurrentWeek, onLogoClick }: HeaderProps) {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  return (
    <header className="bg-white border-b border-gray-100 py-6 px-4 sm:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div 
        className="flex items-center gap-3 cursor-pointer group"
        onClick={onLogoClick}
      >
        <div className="bg-red-600 p-2 rounded-lg text-white group-hover:scale-110 transition-transform">
          <Utensils size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">SnackFU</h1>
          <p className="text-sm text-gray-500 font-medium italic">Come for the food, stay for the memories.</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex gap-1">
          <button 
            onClick={onPrevWeek}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
            title="Previous Week"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={onNextWeek}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
            title="Next Week"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="flex flex-col items-end min-w-[140px]">
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            {isCurrentWeek ? "This Week" : "Week of"}
          </span>
          <div className="text-lg font-semibold text-gray-700">
            {format(weekStart, "MMM d")} – {format(weekEnd, "MMM d")}
          </div>
        </div>
      </div>
    </header>
  );
}
