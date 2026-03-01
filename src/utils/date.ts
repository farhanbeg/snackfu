import { format, startOfWeek, addDays, isSameDay, parseISO } from "date-fns";

/**
 * Parses an ISO string as local time, ignoring the timezone offset.
 * This ensures "Wall Clock" consistency across different user timezones.
 */
export const parseAsLocal = (isoString: string) => {
  const match = isoString.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/);
  return match ? new Date(match[1]) : new Date(isoString);
};

export const getStartOfWeek = (date: Date) => {
  return startOfWeek(date, { weekStartsOn: 1 });
};

export const getDaysInWeek = (startDate: Date) => {
  return Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));
};

export const formatTime = (date: Date) => {
  return format(date, "h:mm a");
};

export const formatDateRange = (start: Date, end: Date) => {
  return `${format(start, "MMM d, h:mm a")} – ${format(end, "h:mm a")}`;
};

export const isEventInNextTwoHours = (eventStart: string, now: Date) => {
  const start = parseAsLocal(eventStart);
  const diff = start.getTime() - now.getTime();
  return diff > 0 && diff <= 2 * 60 * 60 * 1000;
};

export const getEventPosition = (start: string, end: string, calendarStartHour: number = 8) => {
  const startDate = parseAsLocal(start);
  const endDate = parseAsLocal(end);
  
  const startMinutes = startDate.getHours() * 60 + startDate.getMinutes();
  const endMinutes = endDate.getHours() * 60 + endDate.getMinutes();
  
  const calendarStartMinutes = calendarStartHour * 60;
  
  // 40px per hour = 0.666px per minute
  const top = Math.max(0, (startMinutes - calendarStartMinutes) * (40 / 60));
  const height = Math.max(20, (endMinutes - startMinutes) * (40 / 60)); // Min height for visibility
  
  return { top: `${top}px`, height: `${height}px` };
};
