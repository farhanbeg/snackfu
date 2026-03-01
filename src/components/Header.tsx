import { format } from "date-fns";
import { Utensils } from "lucide-react";

interface HeaderProps {
  weekStart: Date;
}

export default function Header({ weekStart }: HeaderProps) {
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  return (
    <header className="bg-white border-b border-gray-100 py-6 px-4 sm:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="bg-red-600 p-2 rounded-lg text-white">
          <Utensils size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">SnackFU</h1>
          <p className="text-sm text-gray-500 font-medium italic">Come for the food, stay for the memories.</p>
        </div>
      </div>
      
      <div className="flex flex-col items-end">
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">This Week</span>
        <div className="text-lg font-semibold text-gray-700">
          {format(weekStart, "MMM d")} – {format(weekEnd, "MMM d, yyyy")}
        </div>
      </div>
    </header>
  );
}
