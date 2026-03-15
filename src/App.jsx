import { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  ChefHat, 
  CheckCircle2, 
  Circle,
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
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30 font-sans pb-32">
      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[50%] bg-fuchsia-600/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 relative z-10">
        
        {/* Header */}
        <header className="mb-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-fuchsia-500 p-[2px] mb-6 shadow-2xl shadow-indigo-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[inherit] flex items-center justify-center">
              <ShoppingBag className="text-white w-7 h-7" strokeWidth={2.5} />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-3">
            Fresh<span className="text-indigo-400 italic">Market</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium tracking-[0.2em] uppercase">Meal Prep Grocery Run</p>
        </header>

        {/* Progress Bar */}
        <div className="mb-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Your Progress</p>
              <h2 className="text-2xl font-black text-white">{acquiredItems.length} <span className="text-slate-500 text-lg font-medium">/ {totalItems} items</span></h2>
            </div>
            <p className="text-sm font-bold text-indigo-400">{progressPercent}%</p>
          </div>
          <div className="h-3 w-full bg-slate-800/50 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ type: "spring", stiffness: 50, damping: 15 }}
              className="h-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-full relative"
            >
              <div className="absolute inset-0 bg-white/20" style={{ backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)'}} />
            </motion.div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-10 bg-slate-900/50 p-2 rounded-[2rem] border border-white/10 backdrop-blur-md">
          <button 
            onClick={() => setActiveTab('shop')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold tracking-wider transition-all duration-300 ${activeTab === 'shop' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <ListTodo size={16} /> Shopping List
          </button>
          <button 
            onClick={() => setActiveTab('prep')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold tracking-wider transition-all duration-300 ${activeTab === 'prep' ? 'bg-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/25' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
          >
            <ChefHat size={16} /> Prep Steps
          </button>
        </div>

        {/* Missing Items Toggle */}
        {activeTab === 'shop' && (
          <div className="mb-6 flex justify-end">
            <button
              onClick={() => setShowMissingOnly(!showMissingOnly)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 border ${showMissingOnly ? 'bg-rose-500/10 border-rose-500/50 text-rose-400' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
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
                  <div key={category} className="space-y-4">
                    <h2 className="text-sm font-extrabold uppercase tracking-widest text-white flex items-center gap-3">
                      <span className="w-8 h-[2px] bg-slate-700/50 inline-block rounded-full"></span>
                      {category}
                      <span className="w-full h-[2px] bg-gradient-to-r from-slate-700/50 to-transparent inline-block rounded-full"></span>
                    </h2>
                    
                    <div className="grid gap-3">
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
                              className={`
                                cursor-pointer group flex items-center justify-between p-4 rounded-3xl border transition-all duration-300
                                ${isAcquired 
                                  ? 'bg-emerald-500/5 border-emerald-500/20 opacity-60 hover:opacity-100' 
                                  : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-indigo-500/30'}
                              `}
                            >
                              <div className="flex items-center gap-4">
                                <span className={`text-3xl transition-transform duration-300 ${isAcquired ? 'scale-90 grayscale opacity-50' : 'group-hover:scale-110'}`}>
                                  {item.emoji}
                                </span>
                                <div>
                                  <p className={`font-bold transition-colors text-base ${isAcquired ? 'text-emerald-400 line-through' : 'text-slate-100 group-hover:text-white'}`}>
                                    {item.item}
                                  </p>
                                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                                    {item.quantity} {item.unit}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center justify-center p-2">
                                {isAcquired ? (
                                  <CheckCircle2 className="text-emerald-500 w-6 h-6" />
                                ) : (
                                  <div className="w-6 h-6 rounded-full border-2 border-slate-600 group-hover:border-indigo-400 transition-colors" />
                                )}
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
                <div className="text-center py-20">
                  <span className="text-6xl block mb-6">🎉</span>
                  <h3 className="text-2xl font-black text-white mb-2">All Done!</h3>
                  <p className="text-slate-400 font-medium tracking-wide">You have everything you need.</p>
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
                <div key={category} className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 shadow-xl backdrop-blur-md">
                  <h2 className="text-lg font-black uppercase tracking-widest text-white flex items-center gap-3 mb-8">
                    <span className="p-2 rounded-xl bg-fuchsia-500/20 text-fuchsia-400"><ChefHat size={20} /></span>
                    {category}
                  </h2>
                  <div className="space-y-6">
                    {steps.map((step, idx) => (
                      <div key={idx} className="flex gap-5 items-start">
                        <div className="w-8 h-8 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center font-black text-sm flex-shrink-0 border border-white/5 shadow-inner">
                          {idx + 1}
                        </div>
                        <p className="text-[15px] font-medium text-slate-300 leading-relaxed pt-1">
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
