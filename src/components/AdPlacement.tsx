import { cn } from '@/src/lib/utils';

interface AdPlacementProps {
  type: 'banner' | 'sidebar' | 'inline' | 'footer';
  className?: string;
}

export function AdPlacement({ type, className }: AdPlacementProps) {
  const styles = {
    banner: "h-32 w-full",
    sidebar: "h-[600px] w-full",
    inline: "h-40 w-full",
    footer: "h-24 w-full"
  };

  return (
    <div className={cn(
      "bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center relative overflow-hidden",
      styles[type],
      className
    )}>
      <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-[8px] font-bold text-slate-400 rounded uppercase tracking-widest border border-slate-200 dark:border-slate-700">
        AD
      </div>
      <div className="text-center px-4">
        <p className="text-slate-300 dark:text-slate-600 text-[9px] font-bold uppercase tracking-wider mb-1">
          Google AdSense Unit
        </p>
        <p className="text-slate-400 dark:text-slate-500 text-[8px] italic">
          Place your ad code here
        </p>
      </div>
      {/* 
        DEVELOPER NOTE: Replace this placeholder with your AdSense script
        <ins className="adsbygoogle" ... />
      */}
    </div>
  );
}
