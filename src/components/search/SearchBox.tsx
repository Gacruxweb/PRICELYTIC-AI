import { useState } from 'react';
import { Search, Camera, Mic, Image as ImageIcon, X, Send, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface SearchBoxProps {
  onSearch: (query: string) => void;
  onImageSearch: (base64: string) => void;
  onMicClick?: () => void;
  isLocationSet?: boolean;
  className?: string;
}

export function SearchBox({ onSearch, onImageSearch, onMicClick, isLocationSet, className }: SearchBoxProps) {
  const [query, setQuery] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleMicClick = async () => {
    if (onMicClick) {
      onMicClick();
    } else {
      setIsListening(true);
      // In a real app, use SpeechRecognition API
      setTimeout(() => {
        setIsListening(false);
        setQuery("iPhone 15 Pro Titanium");
      }, 2000);
    }
  };

  const handleCameraClick = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
    } catch (e) {
      console.error("Camera permission denied", e);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageSearch(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={cn("w-full max-w-2xl mx-auto", className)}>
      <form 
        onSubmit={handleSubmit}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="relative group"
      >
        <div className={cn(
          "relative flex items-center bg-app-surface border border-app-border transition-all duration-300 rounded-full overflow-hidden shadow-inner",
          isHovered ? "border-blue-500 ring-2 ring-blue-500/10" : "",
          className?.includes('h-10') ? 'h-10' : 'h-12'
        )}>
          <div className="pl-4 text-app-muted">
            <Search className="w-4 h-4" />
          </div>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, upload image, or paste link..."
            className="flex-1 h-full bg-transparent border-none outline-none px-4 text-app-fg placeholder:text-app-muted text-sm font-medium"
          />

          <div className="flex items-center gap-1 pr-2 border-l border-app-border ml-2">
            {!isLocationSet && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full animate-pulse">
                <MapPin className="w-3 h-3" />
                <span className="text-[9px] font-bold uppercase tracking-tight">Location Required</span>
              </div>
            )}
            <button
              type="button"
              onClick={handleCameraClick}
              className="p-1.5 text-app-muted hover:text-blue-600 transition-colors rounded hover:bg-app-bg"
            >
              <Camera className="w-4 h-4" />
            </button>
            <label className="p-1.5 text-app-muted hover:text-blue-600 cursor-pointer transition-colors rounded hover:bg-app-bg">
              <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              <ImageIcon className="w-4 h-4" />
            </label>
            <button 
              type="button" 
              onClick={handleMicClick}
              className={cn(
                "p-1.5 transition-all rounded hover:bg-app-bg",
                isListening ? "text-red-500 animate-pulse" : "text-app-muted hover:text-blue-600"
              )}
            >
              <Mic className="w-4 h-4" />
            </button>
            {query.trim() && (
              <button 
                type="submit"
                className="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-all flex items-center justify-center"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Suggestion Badge (Optional UI touch) */}
        <AnimatePresence>
          {query.length > 0 && !query.includes(' ') && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full mt-2 flex gap-2"
            >
              {['Price History', 'Best Deals', 'Reviews'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(query + ' ' + tag)}
                  className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-xs font-semibold rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  + {tag}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
