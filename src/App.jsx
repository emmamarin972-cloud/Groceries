import { 
  ShoppingBag, 
  ChefHat, 
  ChevronRight, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle,
  TrendingUp,
  DollarSign,
  Beef,
  Flame,
  Egg,
  Grape,
  Target,
  Apple,
  Fish,
  Wheat,
  Container,
  Sprout,
  Milk,
  Dot,
  Citrus,
  Utensils
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { groceryData } from './data/groceryData';

const iconMap = {
  Beef, Flame, Egg, Grape, Circle, Target, Apple, Fish, Wheat, Container, Sprout, Milk, Dot, Citrus, Utensils
};

const IconComponent = ({ name, className }) => {
  const LucideIcon = iconMap[name] || Utensils;
  return <LucideIcon className={className} />;
};

export default function App() {
  const [activeTab, setActiveTab] = useState('shop');
  const [prices, setPrices] = useState(() => {
    const saved = localStorage.getItem('grocery-prices');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('grocery-prices', JSON.stringify(prices));
  }, [prices]);

  const handlePriceChange = (category, item, value) => {
    setPrices(prev => ({
      ...prev,
      [`${category}-${item}`]: value
    }));
  };

  const calculateTotal = () => {
    return Object.values(prices).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-32">
      {/* Header */}
      <header className="mb-12 text-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex p-4 rounded-3xl bg-blue-500/10 text-blue-400 mb-6 border border-blue-500/20"
        >
          <ShoppingBag size={32} />
        </motion.div>
        <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white leading-none mb-2">
          Grocery <span className="text-blue-500">Center</span>
        </h1>
        <p className="text-slate-500 text-xs font-black uppercase tracking-[0.3em]">Operational Procurement v1.0</p>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="glass-card flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total Spent</p>
            <p className="text-2xl font-black text-white">${calculateTotal().toFixed(2)}</p>
          </div>
        </div>
        <div className="glass-card flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Items Count</p>
            <p className="text-2xl font-black text-white">42</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 bg-white/5 p-1.5 rounded-3xl border border-white/5">
        <button 
          onClick={() => setActiveTab('shop')}
          className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'shop' ? 'bg-blue-500 text-white shadow-xl shadow-blue-500/20' : 'text-slate-400 hover:text-white'}`}
        >
          Shopping List
        </button>
        <button 
          onClick={() => setActiveTab('prep')}
          className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'prep' ? 'bg-blue-500 text-white shadow-xl shadow-blue-500/20' : 'text-slate-400 hover:text-white'}`}
        >
          Preparation
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'shop' ? (
          <motion.div 
            key="shop"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-12"
          >
            {Object.entries(groceryData.categories).map(([category, items]) => (
              <div key={category} className="space-y-4">
                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-blue-500 ml-4 mb-6">{category}</h2>
                <div className="grid gap-3">
                  {items.map((item, idx) => (
                    <div key={idx} className="glass-card flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-white/5 text-slate-400 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-all">
                          <IconComponent name={item.icon} className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{item.item}</p>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            {item.quantity} {item.unit}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <input 
                          type="number"
                          placeholder="0.00"
                          value={prices[`${category}-${item.item}`] || ''}
                          onChange={(e) => handlePriceChange(category, item.item, e.target.value)}
                          className="bg-transparent border-b border-white/10 text-right w-20 py-1 focus:outline-none focus:border-blue-500 font-bold text-blue-400 text-sm transition-all"
                        />
                        <DollarSign size={14} className="text-slate-600" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="prep"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            {Object.entries(groceryData.preparations).map(([category, steps]) => (
              <div key={category} className="glass-card space-y-6">
                <h2 className="text-xs font-black uppercase tracking-[0.4em] text-blue-500 flex items-center gap-2">
                  <ChefHat size={16} />
                  {category}
                </h2>
                <div className="space-y-4">
                  {steps.map((step, idx) => (
                    <div key={idx} className="flex gap-4 items-start group">
                      <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center font-black text-[10px] flex-shrink-0 group-hover:bg-blue-500 group-hover:text-white transition-all">
                        {idx + 1}
                      </div>
                      <p className="text-sm font-bold text-slate-400 leading-relaxed group-hover:text-slate-200 transition-colors pt-1">
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

      {/* Floating Action Bar (Mobile Bottom Nav Feel) */}
      <div className="fixed bottom-8 left-4 right-4 z-50">
        <div className="glass rounded-[2rem] p-4 flex items-center justify-between border-white/20">
          <div className="flex items-center gap-3 ml-2">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
              <ShoppingBag size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Status</p>
              <p className="text-[11px] font-bold text-white italic">Ready to Shop</p>
            </div>
          </div>
          <button className="bg-white text-black px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all active:scale-95 mr-2">
            Finish Order
          </button>
        </div>
      </div>
    </div>
  );
}
