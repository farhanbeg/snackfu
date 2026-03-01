import { Event } from "../types";
import { format, parseISO, isSameDay } from "date-fns";
import { getEventPosition, isEventInNextTwoHours } from "../utils/date";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion } from "motion/react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface WeekCalendarProps {
  days: Date[];
  events: Event[];
  onEventClick: (event: Event) => void;
  now: Date;
}

const HOURS = Array.from({ length: 15 }).map((_, i) => i + 8); // 8:00 to 22:00

const CATEGORY_COLORS: Record<string, string> = {
  Social: "bg-blue-50 border-blue-200 text-blue-900 hover:border-blue-400",
  Career: "bg-emerald-50 border-emerald-200 text-emerald-900 hover:border-emerald-400",
  Academic: "bg-violet-50 border-violet-200 text-violet-900 hover:border-violet-400",
  Culture: "bg-amber-50 border-amber-200 text-amber-900 hover:border-amber-400",
  Sports: "bg-rose-50 border-rose-200 text-rose-900 hover:border-rose-400",
  Volunteer: "bg-cyan-50 border-cyan-200 text-cyan-900 hover:border-cyan-400",
  Other: "bg-slate-50 border-slate-200 text-slate-900 hover:border-slate-400",
};

const CATEGORY_TEXT_MUTED: Record<string, string> = {
  Social: "text-blue-600",
  Career: "text-emerald-600",
  Academic: "text-violet-600",
  Culture: "text-amber-600",
  Sports: "text-rose-600",
  Volunteer: "text-cyan-600",
  Other: "text-slate-600",
};

export default function WeekCalendar({ days, events, onEventClick, now }: WeekCalendarProps) {
  return (
    <div className="flex flex-col h-full bg-white overflow-hidden">
      {/* Calendar Header */}
      <div className="flex border-b border-gray-100 ml-16">
        {days.map((day, i) => {
          const isToday = isSameDay(day, now);
          return (
            <div
              key={i}
              className={cn(
                "flex-1 py-4 text-center border-r border-gray-100 last:border-r-0",
                isToday && "bg-red-50/30"
              )}
            >
              <div className={cn(
                "text-xs font-bold uppercase tracking-widest mb-1",
                isToday ? "text-red-600" : "text-gray-400"
              )}>
                {format(day, "EEE")}
              </div>
              <div className={cn(
                "text-2xl font-light",
                isToday ? "text-red-700 font-medium" : "text-gray-700"
              )}>
                {format(day, "d")}
              </div>
            </div>
          );
        })}
      </div>

      {/* Calendar Body */}
      <div className="flex-1 overflow-y-auto relative custom-scrollbar">
        <div className="flex min-h-[600px]">
          {/* Time Axis */}
          <div className="w-16 flex-shrink-0 border-r border-gray-100 bg-gray-50/50">
            {HOURS.map(hour => (
              <div key={hour} className="h-[40px] text-[10px] font-bold text-gray-400 text-right pr-2 pt-1 border-b border-gray-100/50">
                {hour}:00
              </div>
            ))}
          </div>

          {/* Day Columns */}
          <div className="flex-1 flex relative">
            {/* Horizontal Grid Lines */}
            <div className="absolute inset-0 pointer-events-none">
              {HOURS.map(hour => (
                <div key={hour} className="h-[40px] border-b border-gray-100/50 w-full" />
              ))}
            </div>

            {days.map((day, i) => {
              const dayEvents = events.filter(e => isSameDay(parseISO(e.start), day));
              const isToday = isSameDay(day, now);

              return (
                <div
                  key={i}
                  id={isToday ? "today-column" : undefined}
                  className={cn(
                    "flex-1 relative border-r border-gray-100 last:border-r-0",
                    isToday && "bg-red-50/10"
                  )}
                >
                  {dayEvents.map(event => {
                    const pos = getEventPosition(event.start, event.end, 8, 23);
                    const isUpcoming = isEventInNextTwoHours(event.start, now);
                    const categoryColor = CATEGORY_COLORS[event.category] || CATEGORY_COLORS.Other;
                    const mutedColor = CATEGORY_TEXT_MUTED[event.category] || CATEGORY_TEXT_MUTED.Other;
                    
                    return (
                      <motion.button
                        key={event.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.02, zIndex: 10 }}
                        onClick={() => onEventClick(event)}
                        className={cn(
                          "absolute left-1 right-1 p-2 rounded-lg text-left overflow-hidden shadow-sm border transition-all group",
                          isUpcoming 
                            ? "bg-red-600 text-white border-red-700 ring-2 ring-red-500/50 ring-offset-1 z-10" 
                            : categoryColor
                        )}
                        style={{ top: pos.top, height: pos.height }}
                      >
                        <div className="flex flex-col h-full justify-between">
                          <div>
                            <h3 className={cn(
                              "text-[11px] font-bold leading-tight line-clamp-2",
                              isUpcoming ? "text-white" : "text-inherit"
                            )}>
                              {event.title}
                            </h3>
                            <p className={cn(
                              "text-[9px] mt-0.5 font-medium",
                              isUpcoming ? "text-red-100" : mutedColor
                            )}>
                              {format(parseISO(event.start), "HH:mm")} – {format(parseISO(event.end), "HH:mm")}
                            </p>
                          </div>
                          
                          <div className="flex flex-wrap gap-1 mt-1">
                            <span className={cn(
                              "text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-tighter",
                              isUpcoming ? "bg-white/20 text-white" : "bg-white/50 text-inherit border border-black/5"
                            )}>
                              {event.campus[0]}
                            </span>
                            {event.snacks.has && (
                              <span className={cn(
                                "text-[10px]",
                                isUpcoming ? "filter brightness-0 invert" : ""
                              )}>
                                🍪
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
