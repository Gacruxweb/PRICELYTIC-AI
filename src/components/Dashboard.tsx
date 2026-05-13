import { motion } from 'motion/react';
import { 
  History, 
  Star, 
  TrendingDown, 
  ArrowRight, 
  ExternalLink, 
  Trash2, 
  ChevronRight,
  Package,
  Clock,
  Layout
} from 'lucide-react';
import { Product, CurrencyCode } from '@/src/types';
import { cn, formatPrice } from '@/src/lib/utils';

interface DashboardProps {
  user: any;
  watchlist: Product[];
  history: Product[];
  currency: CurrencyCode;
  onRemoveFromWatchlist: (productId: string) => void;
  onProductClick: (product: Product) => void;
}

export function Dashboard({ user, watchlist, history, currency, onRemoveFromWatchlist, onProductClick }: DashboardProps) {
  const stats = [
    { label: 'Watched Items', value: watchlist.length, icon: Star, color: 'text-yellow-500' },
    { label: 'Active Alerts', value: watchlist.filter(p => (p.offers?.[0]?.price || 0) > 0).length, icon: TrendingDown, color: 'text-green-500' },
    { label: 'Items Scanned', value: history.length, icon: History, color: 'text-blue-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-2">
          {user.photoURL ? (
            <img src={user.photoURL} alt={user.displayName} className="w-14 h-14 rounded-full border-2 border-blue-500" />
          ) : (
            <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {user.displayName?.[0] || user.email?.[0] || '?'}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-app-fg">Dashboard</h1>
            <p className="text-app-muted text-sm max-w-md mt-1">
              Welcome back, {user.displayName?.split(' ')[0] || 'User'}. Pricelytic AI is tracking your favorite items across regional and international stores.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-app-surface border border-app-border p-6 rounded-2xl shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-app-muted font-medium mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-app-fg">{stat.value}</p>
            </div>
            <div className={cn("p-4 rounded-xl bg-app-bg", stat.color)}>
              <stat.icon className="w-6 h-6" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Watchlist Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <h2 className="text-xl font-bold text-app-fg">Active Watchlist</h2>
            </div>
            <button className="text-xs font-bold text-blue-600 hover:underline">View All</button>
          </div>

          {watchlist.length > 0 ? (
            <div className="space-y-4">
              {watchlist.map((product) => (
                <motion.div
                  layout
                  key={product.id}
                  className="bg-app-surface border border-app-border rounded-2xl p-4 flex gap-4 hover:shadow-md transition-all group"
                >
                  <div className="w-24 h-24 bg-white rounded-xl overflow-hidden flex-shrink-0 border border-app-border">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain p-2" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-app-fg truncate pr-4">{product.name}</h3>
                      <button 
                        onClick={() => onRemoveFromWatchlist(product.id)}
                        className="text-app-muted hover:text-red-500 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs text-app-muted line-clamp-1 mb-2">{product.description}</p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-blue-600">
                          {formatPrice(product.offers?.[0]?.price || 0, currency)}
                        </span>
                        <span className="text-[10px] text-green-500 font-bold bg-green-50 dark:bg-green-950/20 px-1.5 py-0.5 rounded">
                          Lowest Price
                        </span>
                      </div>
                      <button 
                        onClick={() => onProductClick(product)}
                        className="text-xs font-bold bg-app-bg px-3 py-1.5 rounded-lg border border-app-border hover:border-blue-500 transition-all flex items-center gap-1"
                      >
                        Details <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-app-surface border border-dashed border-app-border rounded-2xl p-12 text-center">
              <Package className="w-12 h-12 text-app-muted mx-auto mb-4 opacity-20" />
              <p className="text-app-muted font-medium">Your watchlist is empty.</p>
              <p className="text-xs text-app-muted mt-1">Start tracking prices by searching for products.</p>
            </div>
          )}
        </div>

        {/* Recent History Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-bold text-app-fg">Recent Activity</h2>
          </div>

          <div className="bg-app-surface border border-app-border rounded-2xl overflow-hidden divide-y divide-app-border">
            {history.length > 0 ? (
              history.slice(0, 6).map((item) => (
                <button
                  key={item.id}
                  onClick={() => onProductClick(item)}
                  className="w-full p-4 flex items-center gap-3 hover:bg-app-bg transition-colors group text-left"
                >
                  <div className="w-10 h-10 bg-white rounded-lg p-1 border border-app-border flex-shrink-0">
                    <img src={item.imageUrl} alt="" className="w-full h-full object-contain" />
                  </div>
                  <div className="min-w-0 flex-grow">
                    <p className="text-xs font-bold text-app-fg truncate group-hover:text-blue-600 transition-colors">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Clock className="w-3 h-3 text-app-muted" />
                      <span className="text-[10px] text-app-muted">Viewed 2h ago</span>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-app-muted group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-app-muted">
                No recent activity.
              </div>
            )}
          </div>

          {/* Quick Shortcuts */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
            <h3 className="font-bold mb-2">Pro Insights</h3>
            <p className="text-xs text-blue-100 mb-4 leading-relaxed">
              Unlock historical data for over 10,000+ local products automatically.
            </p>
            <button className="w-full bg-white text-blue-600 text-xs font-bold py-2.5 rounded-lg active:scale-[0.98] transition-all">
              Invite Friends
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
