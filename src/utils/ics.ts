import { Event } from "../types";
import { parseISO, format } from "date-fns";

export const generateICS = (event: Event) => {
  const start = parseISO(event.start);
  const end = parseISO(event.end);

  const formatICSDate = (date: Date) => {
    return format(date, "yyyyMMdd'T'HHmmss");
  };

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//SnackFU//SFU Event Calendar//EN",
    "BEGIN:VEVENT",
    `UID:${event.id}@snackfu.sfu`,
    `DTSTAMP:${formatICSDate(new Date())}`,
    `DTSTART:${formatICSDate(start)}`,
    `DTEND:${formatICSDate(end)}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description || ""} (Club: ${event.club})`,
    `LOCATION:${event.location}, ${event.campus} Campus`,
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${event.title.replace(/\s+/g, "_")}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
