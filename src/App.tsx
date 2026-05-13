/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { 
  BarChart3, 
  History, 
  Settings, 
  Sun, 
  Moon, 
  Bell, 
  Download,
  Filter,
  ArrowUpDown,
  LayoutGrid,
  List as ListIcon,
  ChevronRight,
  TrendingDown,
  Globe,
  MapPin,
  LogOut,
  User as UserIcon,
  Star,
  ExternalLink,
  Search,
  Mic
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SearchBox } from './components/search/SearchBox';
import { ProductCard } from './components/ProductCard';
import { PriceChart } from './components/PriceChart';
import { AdPlacement } from './components/AdPlacement';
import { TypewriterText } from './components/TypewriterText';
import { AuthModal } from './components/AuthModal';
import { Dashboard } from './components/Dashboard';
import { MOCK_PRODUCTS } from './mockData';
import { CurrencySelector } from './components/CurrencySelector';
import { Product, Offer, CurrencyCode } from './types';
import { cn, formatPrice, convertPrice } from './lib/utils';
import { analyzeProductImage, searchProducts } from './lib/gemini';
import { auth, db } from './lib/firebase';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  User 
} from 'firebase/auth';
import { 
  collection, 
  query, 
  onSnapshot, 
  doc, 
  setDoc, 
  deleteDoc,
  serverTimestamp,
  getDocs,
  where
} from 'firebase/firestore';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') return saved;
    }
    return 'dark';
  });
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('USD');
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterType, setFilterType] = useState<'all' | 'local' | 'international'>('local');
  const [sortBy, setSortBy] = useState<'price' | 'rating' | 'popularity'>('price');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [watchedIds, setWatchedIds] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [userLocation, setUserLocation] = useState<string | null>(null);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isMicModalOpen, setIsMicModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [view, setView] = useState<'search' | 'dashboard'>('search');
  const [viewedProducts, setViewedProducts] = useState<Product[]>([]);

  const watchlist = useMemo(() => {
    return products.filter(p => watchedIds.includes(p.id));
  }, [products, watchedIds]);

  useEffect(() => {
    if (selectedProduct) {
      setViewedProducts(prev => {
        const filtered = prev.filter(p => p.id !== selectedProduct.id);
        return [selectedProduct, ...filtered].slice(0, 10);
      });
    }
  }, [selectedProduct]);

  useEffect(() => {
    // Show location modal on startup if not set
    if (!userLocation) {
      setIsLocationModalOpen(true);
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    // Auth logic disabled for simulation
    // const unsubscribe = onAuthStateChanged(auth, (u) => {
    //   setUser(u);
    // });
    // return () => unsubscribe();
  }, []);

  // Sync watched items from Firestore (Disabled for simulation)
  useEffect(() => {
    if (!user) {
      setWatchedIds([]);
      return;
    }
    // Simulation: Using local state for this demo
    /*
    const path = `users/${user.uid}/watchedItems`;
    const q = query(collection(db, path));
    
    // Also sync search history
    const historyPath = `users/${user.uid}/history`;
    const historyQ = query(collection(db, historyPath));

    const unsubscribeWatched = onSnapshot(q, (snapshot) => {
      const ids = snapshot.docs.map(doc => doc.data().productId);
      setWatchedIds(ids);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    });

    const unsubscribeHistory = onSnapshot(historyQ, (snapshot) => {
      const history = snapshot.docs.map(doc => doc.data().query);
      setSearchHistory(history);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, historyPath);
    });

    return () => {
      unsubscribeWatched();
      unsubscribeHistory();
    };
    */
  }, [user]);

  const handleLogin = async () => {
    // Simulated Login
    const mockUser = {
      uid: 'demo-user-123',
      displayName: 'Demo User',
      email: 'demo@pricelytic.ai',
      photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pricelytic'
    };
    setUser(mockUser);
    setWatchedIds(['1', '4', '5']); // Default watched items for demo
    setViewedProducts(MOCK_PRODUCTS.slice(0, 5)); // Initial history
    setIsAuthModalOpen(false);
    setView('dashboard');
  };

  const handleLogout = () => {
    signOut(auth);
    setView('search');
  };

  const toggleWatch = async (productId: string) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    // Simulation: Using local state instead of Firestore
    if (watchedIds.includes(productId)) {
      setWatchedIds(prev => prev.filter(id => id !== productId));
    } else {
      setWatchedIds(prev => [...prev, productId]);
    }

    /*
    const path = `users/${user.uid}/watchedItems`;
    const docRef = doc(db, path, productId);

    try {
      if (watchedIds.includes(productId)) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, {
          productId,
          createdAt: serverTimestamp(),
          targetPrice: 0 // Default, can be adjusted
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
    */
  };

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (filterType !== 'all') {
      result = result.filter(p => 
        p.offers.some(o => 
          (filterType === 'local' && o.isLocal) || 
          (filterType === 'international' && o.isInternational)
        )
      );
    }

    result.sort((a, b) => {
      if (sortBy === 'price') {
        const aMin = Math.min(...a.offers.map(o => o.price));
        const bMin = Math.min(...b.offers.map(o => o.price));
        return aMin - bMin;
      }
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'popularity') return b.reviewCount - a.reviewCount;
      return 0;
    });

    return result;
  }, [products, searchQuery, filterType, sortBy]);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    if (!userLocation) {
      setIsLocationModalOpen(true);
      return;
    }

    setSearchQuery(query);
    setIsSearching(true);
    setVisibleCount(10);
    
    try {
      const results = await searchProducts(query);
      if (results && results.length > 0) {
        setProducts(results);
        
        // Add to history
        if (!searchHistory.includes(query)) {
          const newHistory = [query, ...searchHistory].slice(0, 10);
          setSearchHistory(newHistory);
          
          if (user) {
            // Simulation: Disable Firestore search history write
            /*
            const historyRef = doc(db, `users/${user.uid}/history`, query.replace(/\//g, '_'));
            await setDoc(historyRef, { query, timestamp: serverTimestamp() });
            */
          }
        }
      } else {
        setProducts([]);
      }
    } catch (e) {
      console.error("Search failed:", e);
    } finally {
      setIsSearching(false);
    }
  };

  const handleImageSearch = async (base64: string) => {
    if (!userLocation) {
      setIsLocationModalOpen(true);
      return;
    }
    setIsSearching(true);
    try {
      const result = await analyzeProductImage(base64.split(',')[1]);
      setSearchQuery(result || 'Image result');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSearching(false);
    }
  };

  const exportToCSV = () => {
    const headers = ['Product', 'Price', 'Store', 'Category', 'Rating'];
    const rows = filteredProducts.map(p => {
      const best = p.offers.reduce((prev, curr) => prev.price < curr.price ? prev : curr);
      return [p.name, best.price, best.storeName, p.category, p.rating];
    });
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");
    
    window.open(encodeURI(csvContent));
  };

  return (
    <div className="min-h-screen transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-app-surface/80 backdrop-blur-md border-b border-app-border shadow-sm h-14">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-app-fg">PRICELYTIC AI</span>
          </div>

          <div className="flex items-center gap-6 text-sm font-medium">
            <nav className="hidden md:flex gap-4">
              <button 
                onClick={() => setView('search')}
                className={cn(
                  "transition-colors",
                  view === 'search' ? "text-blue-600 font-bold" : "text-app-muted hover:text-blue-600"
                )}
              >
                Search
              </button>
              {user && (
                <button 
                  onClick={() => setView('dashboard')}
                  className={cn(
                    "transition-colors",
                    view === 'dashboard' ? "text-blue-600 font-bold" : "text-app-muted hover:text-blue-600"
                  )}
                >
                  Dashboard
                </button>
              )}
              <button className="text-app-muted hover:text-blue-600 transition-colors">
                Alerts
              </button>
            </nav>
            <div className="h-4 w-[1px] bg-app-border" />
            
            <CurrencySelector 
              selected={selectedCurrency} 
              onSelect={setSelectedCurrency} 
            />

            <button 
              onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')} 
              className="p-2 text-app-muted hover:text-blue-600 transition-all active:scale-95 flex items-center justify-center"
              aria-label={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={theme}
                  initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
                </motion.div>
              </AnimatePresence>
            </button>
            
            {user ? (
               <div className="flex items-center gap-3">
                 <button 
                    onClick={() => setView('dashboard')}
                    className="w-8 h-8 rounded-full border border-slate-200 overflow-hidden shadow-sm hover:ring-2 hover:ring-blue-500 transition-all cursor-pointer"
                  >
                   <img src={user.photoURL || ''} alt={user.displayName || ''} className="w-full h-full object-cover" />
                 </button>
                 <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                   <LogOut className="w-4 h-4" />
                 </button>
               </div>
            ) : (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="bg-[#155dfc] text-white px-4 py-1.5 rounded-md hover:opacity-90 transition-colors shadow-sm"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="transition-all duration-500">
        <AnimatePresence mode="wait">
          {view === 'dashboard' && user ? (
            <motion.div
              key="dashboard-view"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Dashboard 
                user={user}
                watchlist={watchlist}
                history={viewedProducts}
                currency={selectedCurrency}
                onRemoveFromWatchlist={toggleWatch}
                onProductClick={(p) => {
                  setSelectedProduct(p);
                  setView('search');
                  setTimeout(() => {
                    document.getElementById('results-column')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="search-view"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="max-w-7xl mx-auto px-4 py-8"
            >
              {/* Search Hero */}
              <section className="mb-12 text-center">
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[48px] leading-[52px] font-bold italic text-app-fg mb-6 tracking-tight"
                >
                  Smarter Shopping,<br />
                  <TypewriterText text="Simpler Prices." className="text-blue-600" />
                </motion.h1>
                <SearchBox 
                  onSearch={handleSearch} 
                  onImageSearch={handleImageSearch} 
                  onMicClick={() => setIsMicModalOpen(true)}
                  isLocationSet={!!userLocation}
                />
                
                {/* ... existing search code continues (I'll keep it within this block) ... */}
          
          {/* Location Modal */}
          <AnimatePresence>
            {isLocationModalOpen && (
              <motion.div 
                key="location-modal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center px-4"
              >
                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setIsLocationModalOpen(false)} />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-200 dark:border-slate-800"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6">
                      <MapPin className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">Set Your Location</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">
                      Pricelytic AI uses your location to find the best local deals and availability in your area. This is mandatory for search.
                    </p>
                    
                    <div className="w-full space-y-4">
                      <button 
                        onClick={async () => {
                          try {
                            const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
                              navigator.geolocation.getCurrentPosition(resolve, reject);
                            });
                            // In a real app, you'd reverse geocode this. For now, let's just use mock data if granted.
                            setUserLocation(`${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)}`);
                            setIsLocationModalOpen(false);
                          } catch (e) {
                            console.error("Location permission denied", e);
                          }
                        }}
                        className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
                      >
                        <MapPin className="w-5 h-5" /> Use Current Location
                      </button>
                      
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-white dark:bg-slate-900 px-2 text-slate-400 font-bold">Or enter manually</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="Zip code or City"
                          id="manual-location"
                          className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none text-slate-800 dark:text-slate-100"
                        />
                        <button 
                          onClick={() => {
                            const val = (document.getElementById('manual-location') as HTMLInputElement).value;
                            if (val) {
                              setUserLocation(val);
                              setIsLocationModalOpen(false);
                            }
                          }}
                          className="bg-slate-800 dark:bg-white text-white dark:text-slate-900 px-6 rounded-xl font-bold text-sm hover:opacity-90"
                        >
                          Set
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Microphone Permission Modal */}
          <AnimatePresence>
            {isMicModalOpen && (
              <motion.div 
                key="mic-modal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] flex items-center justify-center px-4"
              >
                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setIsMicModalOpen(false)} />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-200 dark:border-slate-800 text-center"
                >
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-6 mx-auto">
                      <Mic className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-bold dark:text-white mb-2 text-slate-800">Voice Search</h2>
                  <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">
                    Allow Pricelytic AI to access your microphone to use voice commands.
                  </p>
                  
                  <div className="flex flex-col gap-3">
                    <button 
                      onClick={async () => {
                        try {
                          await navigator.mediaDevices.getUserMedia({ audio: true });
                          setIsMicModalOpen(false);
                          // Voice implementation would go here...
                        } catch (e) {
                          console.error("Mic permission denied", e);
                          setIsMicModalOpen(false);
                        }
                      }}
                      className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-500/10"
                    >
                      Allow Access
                    </button>
                    <button 
                      onClick={() => setIsMicModalOpen(false)}
                      className="w-full text-slate-400 font-bold py-3 hover:text-slate-600 transition-all text-sm"
                    >
                      Not Now
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <AnimatePresence>
            {!searchQuery && searchHistory.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 max-w-2xl mx-auto"
              >
                <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">Your Recent Searches</h4>
                <div className="flex flex-wrap justify-center gap-2">
                  {searchHistory.slice(0, 10).map((item, idx) => (
                    <button
                      key={`${item}-${idx}`}
                      onClick={() => handleSearch(item)}
                      className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-400 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm flex items-center gap-2 group"
                    >
                      <History className="w-3 h-3 text-slate-300 group-hover:text-blue-500" />
                      {item}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Side Filters */}
          <aside className="lg:col-span-3">
            <div className="sticky top-20 space-y-6">
              <div className="bg-app-surface border border-app-border p-4 rounded-xl shadow-sm">
              <h3 className="text-xs font-bold text-app-muted uppercase tracking-widest mb-4">Quick Filters</h3>
              <div className="space-y-3 text-sm">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={filterType === 'local'} 
                    onChange={() => setFilterType(filterType === 'local' ? 'all' : 'local')}
                    className="accent-blue-600" 
                  />
                  <span className="group-hover:text-blue-600 transition-colors font-medium text-app-fg">Regional Only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={filterType === 'international'} 
                    onChange={() => setFilterType(filterType === 'international' ? 'all' : 'international')}
                    className="accent-blue-600" 
                  />
                  <span className="group-hover:text-blue-600 transition-colors font-medium text-app-fg">International Deals</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="accent-blue-600" />
                  <span className="group-hover:text-blue-600 transition-colors font-medium text-app-fg">In Stock Only</span>
                </label>
              </div>
            </div>

            <div className="bg-app-surface border border-app-border p-4 rounded-xl shadow-sm">
              <h3 className="text-xs font-bold text-app-muted uppercase tracking-widest mb-4">Price Range</h3>
              <div className="flex gap-2 mb-3">
                <input type="text" placeholder="Min" className="w-full border border-app-border bg-app-bg rounded px-2 py-1 text-xs text-app-fg" />
                <span className="text-app-muted">-</span>
                <input type="text" placeholder="Max" className="w-full border border-app-border bg-app-bg rounded px-2 py-1 text-xs text-app-fg" />
              </div>
              <div className="h-1 bg-app-border relative rounded-full">
                <div className="absolute left-0 right-1/4 h-full bg-blue-500 rounded-full"></div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30 shadow-sm">
              <p className="text-xs text-blue-900 dark:text-blue-200 font-medium leading-relaxed">
                Get real-time alerts when your favorite items drop below target price.
              </p>
              <button className="w-full mt-3 text-xs bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700 transition-colors">
                Enable Alerts
              </button>
            </div>
          </div>
        </aside>

          {/* Center Column: Results */}
          <div id="results-column" className="lg:col-span-6 space-y-6">
            {/* Tools Bar */}
            <div className="flex items-center justify-between bg-app-surface p-3 rounded-xl border border-app-border shadow-sm">
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2 text-app-muted text-[10px] font-bold uppercase tracking-wider">
                  <ArrowUpDown className="w-3 h-3" />
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-transparent border-none outline-none cursor-pointer hover:text-app-fg"
                  >
                    <option value="price">Price: Low to High</option>
                    <option value="rating">Top Rated</option>
                    <option value="popularity">Most Popular</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={exportToCSV}
                  className="text-[10px] flex items-center gap-1.5 border border-app-border px-3 py-1.5 rounded font-bold uppercase tracking-wider hover:bg-app-bg transition-colors text-app-muted hover:text-app-fg"
                >
                  <Download className="w-3 h-3" /> Export CSV
                </button>
                <div className="flex border border-app-border rounded p-0.5">
                   <button 
                    onClick={() => setViewMode('grid')}
                    className={cn("p-1 rounded", viewMode === 'grid' ? "bg-app-bg text-blue-600" : "text-app-muted")}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={cn("p-1 rounded", viewMode === 'list' ? "bg-app-bg text-blue-600" : "text-app-muted")}
                  >
                    <ListIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Feed */}
            <div className={cn(
              "grid gap-6",
              viewMode === 'grid' 
                ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" 
                : "grid-cols-1"
            )}>
              <AnimatePresence mode="popLayout">
                {isSearching ? (
                  <motion.div 
                    key="skeletons"
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="contents"
                  >
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="h-[400px] bg-slate-200 dark:bg-slate-900 rounded-xl animate-pulse" />
                    ))}
                  </motion.div>
                ) : filteredProducts.length > 0 ? (
                  <motion.div
                    key="results-grid"
                    layout
                    className="contents"
                  >
                    {filteredProducts.slice(0, visibleCount).map((product) => (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="w-full flex"
                      >
                        <ProductCard 
                          product={product} 
                          onCompare={() => setSelectedProduct(product)}
                          onTrack={() => toggleWatch(product.id)}
                          isWatched={watchedIds.includes(product.id)}
                          viewMode={viewMode}
                          currency={selectedCurrency}
                        />
                      </motion.div>
                    ))}
                    {filteredProducts.length > visibleCount && (
                      <motion.div 
                        key="show-more-container"
                        layout
                        className="col-span-full flex justify-center py-4"
                      >
                        <button 
                          onClick={() => setVisibleCount(prev => prev + 10)}
                          className="px-8 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-600 dark:text-slate-300 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm"
                        >
                          Show More Results
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full py-20 text-center bg-white dark:bg-slate-900 rounded-xl border border-dashed border-slate-200 dark:border-slate-800"
                  >
                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No results found</h3>
                    <p className="text-slate-500 max-w-xs mx-auto mb-6">
                      Try searching for a specific brand or model like "iPhone 15" or "Nike Air Max".
                    </p>
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="text-blue-600 font-bold hover:underline"
                    >
                      Clear Search
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <AdPlacement type="inline" />
          </div>

          {/* Right Column: Analytics & History */}
          <aside className="hidden lg:block lg:col-span-3 space-y-6">
            <div className="sticky top-20 space-y-6">
              {/* Historical Trends */}
              <div className="bg-app-surface border border-app-border rounded-xl p-4 shadow-sm">
                <h4 className="text-[10px] font-bold text-app-muted uppercase tracking-[0.15em] mb-4">Historical Trends</h4>
                <div className="h-24 px-1">
                  <PriceChart 
                    data={MOCK_PRODUCTS[0].history.map(h => ({
                      ...h,
                      price: convertPrice(h.price, selectedCurrency)
                    }))} 
                    height={80} 
                  />
                </div>
                <div className="flex justify-between mt-3 text-[10px] font-bold text-app-muted uppercase">
                  <span>Start</span><span>Now</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                  <div className="bg-app-bg p-2 rounded border border-app-border">
                    <p className="text-[9px] text-app-muted uppercase font-bold">Lowest</p>
                    <p className="text-xs font-bold text-green-600">
                      {formatPrice(convertPrice(1145, selectedCurrency), selectedCurrency)}
                    </p>
                  </div>
                  <div className="bg-app-bg p-2 rounded border border-app-border">
                    <p className="text-[9px] text-app-muted uppercase font-bold">Current</p>
                    <p className="text-xs font-bold text-app-fg">
                      {formatPrice(convertPrice(1224, selectedCurrency), selectedCurrency)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Competitor Analysis */}
              <div className="bg-app-surface border border-app-border rounded-xl p-4 shadow-sm">
                <h4 className="text-[10px] font-bold text-app-muted uppercase tracking-[0.15em] mb-4">Competitor Analysis</h4>
                <div className="space-y-4">
                  {[
                    { label: "Market Volatility", value: "30%", color: "bg-orange-500" },
                    { label: "Review Sentiment", value: "92%", color: "bg-green-500" },
                    { label: "Stock Availability", value: "85%", color: "bg-blue-500" }
                  ].map((stat) => (
                    <div key={stat.label} className="text-[10px]">
                      <div className="flex justify-between items-center mb-1 font-bold text-app-muted uppercase">
                        <span>{stat.label}</span>
                        <span>{stat.value}</span>
                      </div>
                      <div className="w-full h-1.5 bg-app-bg rounded-full overflow-hidden">
                        <div className={cn("h-full rounded-full transition-all duration-1000", stat.color)} style={{ width: stat.value }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Search History */}
              <div className="bg-app-surface border border-app-border rounded-xl p-4 shadow-sm">
                <h3 className="font-bold text-app-fg mb-4 text-xs uppercase tracking-widest">Search History</h3>
                <div className="space-y-2">
                  {searchHistory.length > 0 ? searchHistory.map((item, index) => (
                    <button 
                      key={`${item}-${index}`} 
                      onClick={() => handleSearch(item)}
                      className="w-full text-left p-2 hover:bg-app-bg rounded-lg transition-colors group flex items-center justify-between"
                    >
                      <span className="text-xs font-semibold text-app-fg opacity-70 group-hover:opacity-100 line-clamp-1">{item}</span>
                      <ChevronRight className="w-3 h-3 text-app-muted group-hover:text-app-fg" />
                    </button>
                  )) : (
                    <p className="text-[10px] text-app-muted italic text-center py-2 font-medium">No recent searches</p>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />

      {/* Comparison Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div 
            key="modal-root"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProduct(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-6 border-bottom border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <h2 className="text-xl font-bold dark:text-white">Price Comparison</h2>
                <button onClick={() => setSelectedProduct(null)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full">
                  <ArrowUpDown className="w-5 h-5 rotate-45 dark:text-white" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                <div className="flex flex-col md:flex-row gap-8 mb-8">
                  <div className="w-full md:w-1/3 aspect-square bg-zinc-50 dark:bg-zinc-800 rounded-2xl overflow-hidden">
                    <img src={selectedProduct.imageUrl} alt={selectedProduct.name} referrerPolicy="no-referrer" className="w-full h-full object-contain p-4" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black mb-2 dark:text-white">{selectedProduct.name}</h3>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center gap-1 text-sm font-bold bg-yellow-400 px-2 py-1 rounded">
                        <Star className="w-3 h-3 fill-current" /> {selectedProduct.rating}
                      </div>
                      <span className="text-xs text-zinc-500 font-bold">{selectedProduct.reviewCount} Reviews</span>
                    </div>
                    
                    <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Price History</h4>
                    <div className="h-40 bg-zinc-50 dark:bg-zinc-800 rounded-xl p-4">
                      <PriceChart 
                        data={selectedProduct.history.map(h => ({
                          ...h,
                          price: convertPrice(h.price, selectedCurrency)
                        }))} 
                        height={140} 
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">Available Offers</h4>
                  {selectedProduct.offers.map((offer) => (
                    <div key={offer.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-zinc-50 dark:bg-zinc-800 rounded-2xl border border-zinc-100 dark:border-zinc-700 hover:border-blue-500 transition-all">
                      <div className="flex items-center gap-4 mb-4 sm:mb-0">
                        <div className="w-12 h-12 bg-white dark:bg-zinc-700 rounded-xl flex items-center justify-center font-black text-xs text-zinc-400 border border-zinc-200 dark:border-zinc-600">
                          {offer.storeName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold dark:text-white">{offer.storeName}</p>
                          <div className="flex gap-2">
                            {offer.isLocal && <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400">Local Stock</span>}
                            {offer.isInternational && <span className="text-[10px] font-bold text-blue-500 uppercase tracking-tighter">International</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 justify-between sm:justify-end">
                        <div className="text-right">
                          <p className="text-xl font-black dark:text-white">
                            {formatPrice(convertPrice(offer.price, selectedCurrency), selectedCurrency)}
                          </p>
                          <p className="text-[10px] text-zinc-400">Updated {offer.updatedAt}</p>
                        </div>
                        <a 
                          href={offer.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-6 py-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-bold rounded-xl hover:bg-black dark:hover:bg-white transition-colors flex items-center gap-2"
                        >
                          View Deal <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-2 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-400 px-6 mt-12 mb-4">
        <div className="flex gap-6 mb-2 md:mb-0">
          <span className="font-bold tracking-tight text-slate-500 uppercase">PRICELYTIC AI</span>
          <span className="hover:text-blue-600 cursor-pointer font-bold uppercase transition-colors">Privacy Policy</span>
          <span className="hover:text-blue-600 cursor-pointer font-bold uppercase transition-colors">Terms of Service</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-medium">Data Secured with 256-bit Encryption</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
            <div className="w-3 h-3 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
          </div>
        </div>
      </footer>
    </div>
  );
}

