import { X, MapPin, Clock, Users, ExternalLink, Download, Cookie, Info } from "lucide-react";
import { Event } from "../types";
import { parseISO, format } from "date-fns";
import { generateICS } from "../utils/ics";
import { motion, AnimatePresence } from "motion/react";

interface EventModalProps {
  event: Event | null;
  onClose: () => void;
}

export default function EventModal({ event, onClose }: EventModalProps) {
  if (!event) return null;

  const startDate = parseISO(event.start);
  const endDate = parseISO(event.end);

  const generateSummary = (e: Event) => {
    const snackInfo = e.snacks.has 
      ? `Expect ${e.snacks.types?.join(", ") || "snacks"}` 
      : "No snacks listed";
    
    return `Hosted by ${e.club}. Drop in for ${e.category.toLowerCase()} at ${e.location}. ${snackInfo} and meet other SFU students. This event is ${e.freeToJoin ? "free to join" : "paid/member-only"}.`;
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Modal Header */}
          <div className="relative h-32 bg-red-600 p-8 flex items-end">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            <div className="text-white">
              <span className="text-xs font-bold uppercase tracking-widest opacity-80">{event.club}</span>
              <h2 className="text-2xl font-bold leading-tight">{event.title}</h2>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-gray-600">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Clock size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-tight text-gray-400">Time</p>
                  <p className="text-sm font-medium">{format(startDate, "MMM d, HH:mm")} – {format(endDate, "HH:mm")}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-gray-600">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-tight text-gray-400">Location</p>
                  <p className="text-sm font-medium">{event.location} ({event.campus})</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-bold uppercase tracking-tight">
                  {event.category}
                </span>
                {event.freeToJoin && (
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-tight">
                    Free to Join
                  </span>
                )}
                {event.snacks.has && (
                  <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-bold uppercase tracking-tight flex items-center gap-1">
                    <Cookie size={12} />
                    Snacks Provided
                  </span>
                )}
              </div>

              <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex gap-3">
                <Info className="text-blue-500 shrink-0" size={20} />
                <p className="text-sm text-blue-800 leading-relaxed italic">
                  "{generateSummary(event)}"
                </p>
              </div>

              {event.description && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">About</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{event.description}</p>
                </div>
              )}

              {event.snacks.has && event.snacks.types && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400">Snack Menu</h4>
                  <div className="flex flex-wrap gap-2">
                    {event.snacks.types.map(type => (
                      <span key={type} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <a
                  href={event.joinLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20"
                >
                  <ExternalLink size={18} />
                  Join {event.sourceType}
                </a>
                <button
                  onClick={() => generateICS(event)}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                  <Download size={18} />
                  Add to Calendar
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
