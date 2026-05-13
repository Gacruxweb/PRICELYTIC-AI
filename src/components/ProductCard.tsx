import { Product } from '@/src/types';
import { formatPrice, cn, convertPrice } from '@/src/lib/utils';
import { TrendingDown, Star, Bell, MapPin, ArrowRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onCompare: (id: string) => void;
  onTrack: (id: string) => void;
  isWatched?: boolean;
  viewMode?: 'grid' | 'list';
  currency?: string;
}

export function ProductCard({ product, onCompare, onTrack, isWatched, viewMode = 'grid', currency = 'USD' }: ProductCardProps) {
  const lowestPriceUSD = Math.min(...product.offers.map(o => o.price));
  const bestOffer = product.offers.find(o => o.price === lowestPriceUSD);

  const displayPrice = convertPrice(lowestPriceUSD, currency);

  if (viewMode === 'list') {
    return (
      <div className="group w-full bg-app-surface border border-app-border rounded-xl overflow-hidden hover:shadow-md transition-all duration-300 p-3 flex items-center gap-8 relative">
        {/* Product Image / Logo */}
        <div className="w-28 h-28 flex-shrink-0 bg-white dark:bg-slate-800 rounded-2xl border border-app-border p-0 flex items-center justify-center shadow-sm relative overflow-hidden">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
          />
          {product.history.length > 1 && product.history[product.history.length - 1].price < product.history[product.history.length - 2].price && (
            <div className="absolute top-1 left-1 bg-red-500 text-white text-[8px] font-bold px-1 py-0.5 rounded flex items-center gap-1 uppercase tracking-wider">
              <TrendingDown className="w-2 h-2" />
              Deal
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col gap-1">
            <p className="text-[9px] text-app-muted font-bold uppercase tracking-widest mb-1">{product.category}</p>
            <h3 className="text-xl font-bold text-app-fg line-clamp-1 mb-1">
              {product.name}
            </h3>
            
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={cn(
                      "w-4 h-4",
                      i < Math.floor(product.rating) 
                        ? "fill-yellow-400 text-yellow-400" 
                        : "text-app-border"
                    )} 
                  />
                ))}
              </div>
              <span className="text-xs text-app-muted font-bold ml-1">({product.reviewCount} reviews)</span>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-app-muted flex-shrink-0 mt-0.5" />
              <p className="text-[12px] text-app-fg/80 leading-relaxed font-medium">
                {bestOffer?.location || "Global Storefront / Online Delivery"} - <span className="opacity-60 italic">Updated {bestOffer?.updatedAt}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Action & Price Section */}
        <div className="flex flex-col items-end gap-4 min-w-[200px]">
          <div className="text-right">
             <div className="flex items-center gap-2 justify-end mb-1">
               <span className="text-2xl font-black text-app-fg tracking-tight leading-none">
                  {formatPrice(displayPrice, currency)}
                </span>
             </div>
             <p className="text-[10px] text-app-muted font-bold uppercase tracking-[0.1em]">
               at {bestOffer?.storeName}
             </p>
          </div>
          
          <div className="flex items-center gap-2 w-full">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onTrack(product.id);
              }}
              className={cn(
                "p-3 rounded-xl border transition-all",
                isWatched 
                  ? "bg-blue-50 border-blue-200 text-blue-600" 
                  : "bg-app-bg border-app-border text-app-muted hover:text-blue-600 hover:border-blue-200"
              )}
            >
              <Bell className={cn("w-4 h-4", isWatched && "fill-current")} />
            </button>
            <button 
              onClick={() => onCompare(product.id)}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold rounded-xl uppercase tracking-widest transition-all shadow-md shadow-blue-500/10"
            >
              Check Offer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-app-surface border border-app-border rounded-xl overflow-hidden hover:shadow-md transition-all duration-300">
      <div className="relative aspect-video overflow-hidden bg-app-bg border-b border-app-border">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          referrerPolicy="no-referrer"
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
        />
        {product.history.length > 1 && product.history[product.history.length - 1].price < product.history[product.history.length - 2].price && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 uppercase tracking-wider">
            <TrendingDown className="w-2.5 h-2.5" />
            Deal
          </div>
        )}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 duration-300">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onTrack(product.id);
            }} 
            className={cn(
              "p-1.5 rounded bg-app-surface/90 shadow-sm transition-colors",
              isWatched ? "text-blue-600" : "text-app-muted hover:text-blue-600"
            )}
          >
            <Bell className={cn("w-3.5 h-3.5", isWatched && "fill-current")} />
          </button>
        </div>
      </div>

      <div className="p-3">
        <div className="flex justify-between items-start mb-1">
          <p className="text-[9px] text-app-muted font-bold uppercase tracking-widest">{product.category}</p>
          <div className="flex items-center gap-1 text-app-fg text-[10px] font-bold">
            <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
            {product.rating}
          </div>
        </div>

        <h3 className="font-bold text-sm text-app-fg line-clamp-2 mb-3 min-h-[2.5rem]">
          {product.name}
        </h3>

        <div className="space-y-3">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
            <span className="text-lg font-black text-app-fg">
              {formatPrice(displayPrice, currency)}
            </span>
            <span className="text-[10px] text-app-muted font-medium uppercase tracking-tight">
              at {bestOffer?.storeName}
            </span>
          </div>
          
          <button 
            onClick={() => onCompare(product.id)}
            className="w-full py-2.5 bg-blue-600 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 dark:shadow-none"
          >
            Check Offer
          </button>
        </div>
      </div>
    </div>
  );
}
