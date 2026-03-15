import { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  ChefHat, 
  CheckCircle2, 
  AlertCircle,
  ListTodo
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { groceryData } from './data/groceryData';

export default function App() {
  const [activeTab, setActiveTab] = useState('shop');
  const [showMissingOnly, setShowMissingOnly] = useState(false);
  const [acquiredItems, setAcquiredItems] = useState(() => {
    const saved = localStorage.getItem('grocery-acquired');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('grocery-acquired', JSON.stringify(acquiredItems));
  }, [acquiredItems]);

  const toggleItem = (categoryId, itemKey) => {
    const key = `${categoryId}-${itemKey}`;
    setAcquiredItems(prev => 
      prev.includes(key) 
        ? prev.filter(i => i !== key)
        : [...prev, key]
    );
  };

  const totalItems = Object.values(groceryData.categories).flat().length;
  const progressPercent = Math.round((acquiredItems.length / totalItems) * 100);

  return (
    <div className="min-h-screen text-slate-800 font-sans pb-32 relative selection:bg-sky-200">
      <div className="wavy-bg"></div>

      <div className="max-w-3xl mx-auto px-6 py-10 relative z-10">
        
        {/* Header */}
        <header className="mb-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-[1.5rem] bg-white text-sky-500 shadow-xl shadow-sky-200 flex items-center justify-center mb-6">
            <ShoppingBag className="w-8 h-8" strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-800 mb-3 drop-shadow-sm">
            Fresh<span className="text-sky-500 italic">Market</span>
          </h1>
          <p className="text-sky-700 text-sm font-bold tracking-[0.2em] uppercase">Meal Prep Grocery Run</p>
        </header>

        {/* Progress Bar */}
        <div className="mb-8 bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-6 shadow-xl shadow-sky-100">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-sky-600 mb-1">Your Progress</p>
              <h2 className="text-2xl font-black text-slate-800">{acquiredItems.length} <span className="text-slate-400 text-lg font-bold">/ {totalItems} items</span></h2>
            </div>
            <p className="text-sm font-black text-sky-500">{progressPercent}%</p>
          </div>
          <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200 p-0.5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ type: "spring", stiffness: 50, damping: 15 }}
              className="h-full bg-gradient-to-r from-sky-400 to-blue-500 rounded-full relative shadow-sm"
            >
              <div className="absolute inset-0 bg-white/20" style={{ backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.2) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.2) 50%,rgba(255,255,255,.2) 75%,transparent 75%,transparent)', backgroundSize: '1rem 1rem'}} />
            </motion.div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-10 bg-white/40 p-2 rounded-[2rem] border border-white/60 backdrop-blur-md shadow-lg shadow-sky-100/50">
          <button 
            onClick={() => setActiveTab('shop')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold tracking-wider transition-all duration-300 ${activeTab === 'shop' ? 'bg-sky-500 text-white shadow-md shadow-sky-300' : 'text-sky-800 hover:bg-white/60'}`}
          >
            <ListTodo size={16} /> Shopping List
          </button>
          <button 
            onClick={() => setActiveTab('prep')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold tracking-wider transition-all duration-300 ${activeTab === 'prep' ? 'bg-blue-500 text-white shadow-md shadow-blue-300' : 'text-sky-800 hover:bg-white/60'}`}
          >
            <ChefHat size={16} /> Prep Steps
          </button>
        </div>

        {/* Missing Items Toggle */}
        {activeTab === 'shop' && (
          <div className="mb-6 flex justify-end">
            <button
              onClick={() => setShowMissingOnly(!showMissingOnly)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 border shadow-sm ${showMissingOnly ? 'bg-rose-100 border-rose-300 text-rose-600' : 'bg-white/60 border-white/80 text-sky-700 hover:bg-white'}`}
            >
              <AlertCircle size={14} /> 
              {showMissingOnly ? 'Show All Items' : 'Show Missing Only'}
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          {activeTab === 'shop' ? (
            <motion.div 
              key="shop"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-10"
            >
              {Object.entries(groceryData.categories).map(([category, items]) => {
                const visibleItems = showMissingOnly 
                  ? items.filter(item => !acquiredItems.includes(`${category}-${item.item}`))
                  : items;

                if (visibleItems.length === 0) return null;

                return (
                  <div key={category} className="space-y-5 flex flex-col items-center w-full">
                    <h2 className="text-sm font-extrabold uppercase tracking-widest text-sky-800 flex items-center justify-center gap-3 w-full max-w-sm text-center">
                      <span className="w-8 h-[3px] bg-sky-300 inline-block rounded-full"></span>
                      <span>{category}</span>
                      <span className="w-8 h-[3px] bg-sky-300 inline-block rounded-full"></span>
                    </h2>
                    
                    <div className="flex flex-col items-center justify-center gap-5 w-full">
                      <AnimatePresence>
                        {visibleItems.map((item, idx) => {
                          const itemKey = `${category}-${item.item}`;
                          const isAcquired = acquiredItems.includes(itemKey);
                          
                          return (
                            <motion.div 
                              layout
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              transition={{ duration: 0.2 }}
                              key={itemKey} 
                              onClick={() => toggleItem(category, item.item)}
                              className={`food-card w-full max-w-sm group ${isAcquired ? 'opacity-50 hover:opacity-80 !bg-emerald-50 !border-emerald-200 shadow-none' : ''}`}
                            >
                              <div className="corner-tr"></div>
                              <div className="corner-bl"></div>

                              <div className="absolute top-4 right-4 flex items-center justify-center z-10 w-6 h-6">
                                {isAcquired ? (
                                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                    <CheckCircle2 className="text-emerald-500 w-6 h-6 bg-white rounded-full" strokeWidth={3} />
                                  </motion.div>
                                ) : (
                                  <div className="w-6 h-6 rounded-full border-[3px] border-white/80 bg-white/20 group-hover:bg-white/40 transition-colors shadow-sm" />
                                )}
                              </div>
                              <span className={`text-6xl mb-4 transition-transform duration-300 ${isAcquired ? 'grayscale opacity-70' : 'group-hover:scale-110 group-hover:rotate-3 drop-shadow-xl'}`}>
                                {item.emoji}
                              </span>
                              <div className="flex flex-col items-center justify-center text-center w-full z-10">
                                <p className={`font-black text-xl leading-tight transition-colors mb-2 line-clamp-2 text-center drop-shadow-md ${isAcquired ? 'text-emerald-700/70 line-through' : 'text-white'}`}>
                                  {item.item}
                                </p>
                                <span className={`text-[12px] font-black uppercase tracking-widest px-3 py-1 rounded-full border shadow-sm text-center drop-shadow-lg ${isAcquired ? 'bg-emerald-200/50 text-emerald-800 border-emerald-300/50' : 'bg-black/20 text-white border-white/40 group-hover:bg-black/30 backdrop-blur-sm'}`}>
                                  {item.quantity} {item.unit}
                                </span>
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  </div>
                );
              })}
              
              {showMissingOnly && acquiredItems.length === totalItems && (
                <div className="text-center py-20 bg-white/40 backdrop-blur-md rounded-3xl border border-white/60 shadow-xl">
                  <span className="text-7xl block mb-6 animate-bounce">🎉</span>
                  <h3 className="text-3xl font-black text-slate-800 mb-2">All Done!</h3>
                  <p className="text-sky-700 font-bold tracking-wide">You have everything you need.</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="prep"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-10"
            >
              {Object.entries(groceryData.preparations).map(([category, steps]) => (
                <div key={category} className="bg-white/60 border border-white/80 rounded-[2.5rem] p-8 shadow-xl backdrop-blur-md">
                  <h2 className="text-xl font-black uppercase tracking-widest text-slate-800 flex items-center gap-3 mb-8">
                    <span className="p-2.5 rounded-xl bg-blue-100 text-blue-500 shadow-sm"><ChefHat size={24} /></span>
                    {category}
                  </h2>
                  <div className="space-y-6">
                    {steps.map((step, idx) => (
                      <div key={idx} className="flex gap-5 items-start">
                        <div className="w-10 h-10 rounded-2xl bg-white text-blue-500 flex items-center justify-center font-black text-base flex-shrink-0 border border-blue-100 shadow-md">
                          {idx + 1}
                        </div>
                        <p className="text-[16px] font-bold text-slate-700 leading-relaxed pt-2">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
