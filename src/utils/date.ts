import { format, startOfWeek, addDays, isSameDay, parseISO, startOfDay, endOfDay } from "date-fns";

export const getStartOfWeek = (date: Date) => {
  // SFU weeks usually start on Monday for calendars
  return startOfWeek(date, { weekStartsOn: 1 });
};

export const getDaysInWeek = (startDate: Date) => {
  return Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));
};

export const formatTime = (date: Date) => {
  return format(date, "HH:mm");
};

export const formatDateRange = (start: Date, end: Date) => {
  return `${format(start, "MMM d, HH:mm")} – ${format(end, "HH:mm")}`;
};

export const isEventInNextTwoHours = (eventStart: string, now: Date) => {
  const start = parseISO(eventStart);
  const diff = start.getTime() - now.getTime();
  return diff > 0 && diff <= 2 * 60 * 60 * 1000;
};

export const getEventPosition = (start: string, end: string, calendarStartHour: number = 8) => {
  const startDate = parseISO(start);
  const endDate = parseISO(end);
  
  const startMinutes = startDate.getHours() * 60 + startDate.getMinutes();
  const endMinutes = endDate.getHours() * 60 + endDate.getMinutes();
  
  const calendarStartMinutes = calendarStartHour * 60;
  
  const top = Math.max(0, (startMinutes - calendarStartMinutes) / 60 * 100); // percentage
  const height = (endMinutes - startMinutes) / 60 * 100; // percentage
  
  return { top: `${top}%`, height: `${height}%` };
};
