import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, CURRENCIES } from '@/src/lib/utils';
import { CurrencyCode } from '@/src/types';

interface CurrencySelectorProps {
  selected: CurrencyCode;
  onSelect: (code: CurrencyCode) => void;
  className?: string;
}

export function CurrencySelector({ selected, onSelect, className }: CurrencySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCurrency = CURRENCIES.find(c => c.code === selected) || CURRENCIES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-app-bg px-3 py-1.5 rounded-lg border border-app-border hover:border-blue-500 transition-all active:scale-95 text-app-fg"
      >
        <Globe className="w-3.5 h-3.5 text-app-muted" />
        <span className="text-[11px] font-bold uppercase tracking-tight">
          {selectedCurrency.code} ({selectedCurrency.symbol})
        </span>
        <ChevronDown className={cn("w-3 h-3 text-app-muted transition-transform", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 w-48 bg-app-surface border border-app-border rounded-xl shadow-xl overflow-hidden z-50 py-1"
          >
            {CURRENCIES.map((currency) => (
              <button
                key={currency.code}
                onClick={() => {
                  onSelect(currency.code as CurrencyCode);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full text-left px-4 py-2.5 text-[11px] font-bold transition-colors flex items-center justify-between group",
                  selected === currency.code 
                    ? "bg-blue-600 text-white" 
                    : "text-app-fg hover:bg-app-bg"
                )}
              >
                <div className="flex flex-col">
                  <span>{currency.label}</span>
                  <span className={cn(
                    "text-[9px] font-medium opacity-70",
                    selected === currency.code ? "text-white" : "text-app-muted"
                  )}>
                    {currency.code} • {currency.symbol}
                  </span>
                </div>
                {selected === currency.code && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
