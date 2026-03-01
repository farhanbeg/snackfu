import { useState } from "react";
import { X, Sparkles, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { parseEventFromText } from "../services/geminiService";
import { Event } from "../types";

interface ParseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventParsed: (event: Event) => void;
}

export default function ParseModal({ isOpen, onClose, onEventParsed }: ParseModalProps) {
  const [text, setText] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleParse = async () => {
    if (!text.trim()) return;
    
    setIsParsing(true);
    setError(null);
    
    try {
      const event = await parseEventFromText(text);
      onEventParsed(event);
      setText("");
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to parse event. Please check your API key and try again.");
    } finally {
      setIsParsing(false);
    }
  };

  if (!isOpen) return null;

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
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                  <Sparkles size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">AI Event Parser</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-sm text-gray-500">
              Paste an event announcement, Discord message, or Instagram caption. Gemini will extract the details and add it to your calendar.
            </p>

            <textarea
              className="w-full h-40 p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 resize-none transition-all"
              placeholder="e.g., 'Hey everyone! CSSS is hosting a pizza party next Tuesday at 5pm in ASB 9700. Come hang out!'"
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={isParsing}
            />

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                disabled={isParsing}
              >
                Cancel
              </button>
              <button
                onClick={handleParse}
                disabled={isParsing || !text.trim()}
                className="flex-[2] flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isParsing ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Parsing...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Parse Event
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
