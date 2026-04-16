import { useState, useEffect } from 'react';
import { useEco } from '../context/EcoContext';
import axios from 'axios';

const weekData = [
  { day: 'Mon', h: '50%' },
  { day: 'Tue', h: '75%' },
  { day: 'Wed', h: '100%', highlight: true },
  { day: 'Thu', h: '65%' },
  { day: 'Fri', h: '45%' },
  { day: 'Sat', h: '85%' },
  { day: 'Sun', h: '60%' },
];

export default function Dashboard() {
  const { stats, activities, logAction, loading } = useEco();
  const [recs, setRecs] = useState({ suggestions: [], opportunities: [] });
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Custom Activity Modal State
  const [showModal, setShowModal] = useState(false);
  const [customDesc, setCustomDesc] = useState('');
  const [isEstimating, setIsEstimating] = useState(false);
  const [estimate, setEstimate] = useState(null);

  useEffect(() => {
    fetchAIInsights();
  }, []);

  const fetchAIInsights = async () => {
    try {
      setIsRefreshing(true);
      const res = await axios.get('/api/eco/recommendations', {
        headers: { 'x-user-id': localStorage.getItem('ecosense_user') ? JSON.parse(localStorage.getItem('ecosense_user')).id : '' }
      });
      setRecs(res.data);
    } catch (err) {
      console.error("AI Fetch failed", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleQuickLog = async (type, title, carbon, isRec = false, recId = null) => {
    const res = await logAction({ type, title, carbonSaved: carbon });
    if (res.success && isRec) {
      setRecs(prev => ({
        ...prev,
        suggestions: prev.suggestions.filter(s => s.id !== recId)
      }));
    }
  };

  const handleEstimate = async () => {
    if (!customDesc.trim()) return;
    setIsEstimating(true);
    try {
      const res = await axios.post('/api/eco/estimate', { description: customDesc });
      setEstimate(res.data);
    } catch (err) {
      console.error("Estimate failed", err);
    } finally {
      setIsEstimating(false);
    }
  };

  const handleApplyEstimate = async () => {
    if (!estimate) return;
    await logAction({ 
      type: estimate.type, 
      title: estimate.title, 
      carbonSaved: estimate.carbon 
    });
    setShowModal(false);
    setCustomDesc('');
    setEstimate(null);
  };

  if (loading || !stats) return <div className="p-8 text-center text-on-surface-light font-medium">Synchronizing ecosystem data...</div>;

  return (
    <div className="pt-16 lg:pl-64 min-h-screen bg-background pb-12">
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        
        {/* Row 1: Key Metrics & Quick Actions */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-4 card justify-between bg-primary-dark text-white border-none shadow-xl">
            <div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-bold opacity-70 uppercase tracking-widest text-primary-light">Overall Score</span>
                <span className="px-2 py-1 bg-white/10 text-white text-[10px] font-black rounded backdrop-blur-md">
                   {stats.score > 80 ? 'TOP 5% GLOBALLY' : 'IMPROVING'}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-6xl font-black tracking-tighter">{stats.score}</h3>
                <span className="text-xl opacity-50 font-medium">/100</span>
              </div>
              <div className="mt-8 flex items-center gap-2">
                 <div className="flex -space-x-2">
                    {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-primary-dark bg-surface-border"></div>)}
                 </div>
                 <p className="text-[10px] font-bold opacity-60">Joined by 1.2k heroes today</p>
              </div>
            </div>
          </div>

          <div className="col-span-12 sm:col-span-6 lg:col-span-2 card justify-between card-hover group" onClick={() => fetchAIInsights()}>
            <div>
               <div className="w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined fill-1">cloud</span>
               </div>
               <p className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Carbon Saved</p>
               <h3 className="text-3xl font-black text-on-surface">
                 {parseFloat(stats.carbonSaved).toFixed(1)}
                 <span className="text-sm text-on-surface-light ml-1 font-bold">kg</span>
               </h3>
            </div>
            <div className="mt-4 flex items-center gap-1 text-[10px] font-black text-primary">
               <span className="material-symbols-outlined text-xs">trending_up</span>
               {stats.trend}
            </div>
          </div>

          {/* Quick Logs with Press animations via card-hover */}
          <div onClick={() => handleQuickLog('Travel', 'Biked to work', 3.2)} className="col-span-12 sm:col-span-6 lg:col-span-2 card-hover card items-center text-center justify-center group">
            <div className="w-12 h-12 bg-surface rounded-full flex items-center justify-center text-on-surface-variant group-hover:bg-primary-light group-hover:text-primary transition-colors mb-3">
              <span className="material-symbols-outlined">directions_bike</span>
            </div>
            <p className="font-bold text-sm text-on-surface">Log Bike</p>
            <p className="text-[10px] text-on-surface-light mt-1">+3.2kg</p>
          </div>

          <div onClick={() => handleQuickLog('Food', 'Plant-based Meal', 1.8)} className="col-span-12 sm:col-span-6 lg:col-span-2 card-hover card items-center text-center justify-center group">
            <div className="w-12 h-12 bg-surface rounded-full flex items-center justify-center text-on-surface-variant group-hover:bg-primary-light group-hover:text-primary transition-colors mb-3">
              <span className="material-symbols-outlined">restaurant</span>
            </div>
            <p className="font-bold text-sm text-on-surface">Log Meal</p>
            <p className="text-[10px] text-on-surface-light mt-1">+1.8kg</p>
          </div>

          {/* ADD ACTIVITY BUTTON - Trigger Modal */}
          <div onClick={() => setShowModal(true)} className="col-span-12 sm:col-span-6 lg:col-span-2 card-hover card bg-primary text-white items-center text-center justify-center group border-none shadow-lg shadow-primary/20">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white mb-3">
               <span className="material-symbols-outlined font-bold">add</span>
            </div>
            <p className="font-bold text-sm">Add Activity</p>
            <p className="text-[10px] opacity-70 mt-1">AI Calculation</p>
          </div>
        </div>

        {/* Row 2: AI Suggestions & Activity */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-7 card">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary fill-1">psychology</span>
                <h3 className="font-bold text-lg text-on-surface">AI Smart Suggestions</h3>
              </div>
              {isRefreshing && <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recs.suggestions.length > 0 ? recs.suggestions.map(s => (
                <div key={s.id} className="p-4 border border-surface-border rounded-xl bg-surface/50 hover:bg-white transition-colors group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black text-primary bg-primary-light px-2 py-0.5 rounded uppercase">{s.type}</span>
                  </div>
                  <h4 className="font-bold text-sm mb-1">{s.title}</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed mb-4">{s.desc}</p>
                  <button 
                    onClick={() => handleQuickLog(s.type, s.title, s.carbon, true, s.id)}
                    className="w-full py-2 bg-white border border-surface-border text-xs font-bold rounded-lg group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all active:scale-95"
                  >
                    Apply Suggestion +{Math.ceil(s.carbon/2)} pts
                  </button>
                </div>
              )) : (
                <div className="col-span-2 text-center py-10">
                   <p className="text-sm text-on-surface-light">Great job! No urgent AI suggestions right now. Keep exploring! 🌿</p>
                </div>
              )}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-5 card">
            <h3 className="font-bold text-lg text-on-surface mb-6 flex items-center gap-2">
               <span className="material-symbols-outlined text-on-surface-variant">history</span>
               Recent History
            </h3>
            <div className="space-y-4">
              {activities.slice(0, 3).map((act, i) => (
                <div key={act.id} className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-surface border border-surface-border flex items-center justify-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-lg">
                       {act.type === 'Travel' ? 'directions_bike' : act.type === 'Food' ? 'restaurant' : 'bolt'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">{act.title}</p>
                    <p className="text-[10px] text-on-surface-light uppercase tracking-tighter">{act.time} • {act.type}</p>
                  </div>
                  <span className="text-sm font-black text-primary">{act.impact}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 3: ML Opportunities (Now Dynamic) */}
        <div className="card">
           <h3 className="font-bold text-lg text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-warning fill-1">bolt</span>
              Machine-Learning Opportunities
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recs.opportunities.length > 0 ? recs.opportunities.map(o => (
                <div key={o.id} className="p-5 border border-surface-border rounded-xl bg-surface/30">
                   <div className="flex justify-between items-center mb-3">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded ${o.impact === 'High' ? 'bg-error-bg text-error' : 'bg-warning-bg text-warning-dark'}`}>{o.impact} IMPACT</span>
                      <p className="text-[10px] font-bold text-primary">{o.metric}</p>
                   </div>
                   <h4 className="font-bold text-sm mb-2">{o.title}</h4>
                   <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2">{o.desc}</p>
                </div>
              )) : (
                [1,2,3].map(i => <div key={i} className="h-32 bg-surface animate-pulse rounded-xl"></div>)
              )}
           </div>
        </div>

      </div>

      {/* CUSTOM ACTIVITY MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
           <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl relative animate-scale-up">
              <button 
                onClick={() => { setShowModal(false); setEstimate(null); setCustomDesc(''); }}
                className="absolute top-6 right-6 text-on-surface-light hover:text-on-surface transition-colors"
              >
                 <span className="material-symbols-outlined">close</span>
              </button>

              <h3 className="text-2xl font-black text-on-surface mb-2">AI Activity Logger</h3>
              <p className="text-sm text-on-surface-variant mb-8">Describe what you did in plain English, and Leafy's AI brain will do the math.</p>

              <div className="space-y-6">
                 <div>
                    <label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2">Action Description</label>
                    <textarea 
                       value={customDesc}
                       onChange={(e) => setCustomDesc(e.target.value)}
                       placeholder="e.g., I planted two oak trees in the garden today..."
                       className="w-full h-32 p-4 bg-surface border border-surface-border rounded-2xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                    />
                 </div>

                 {!estimate ? (
                    <button 
                       onClick={handleEstimate}
                       disabled={isEstimating || !customDesc.trim()}
                       className="w-full py-4 bg-primary text-white font-black rounded-2xl hover:bg-primary-hover shadow-xl shadow-primary/20 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
                    >
                       {isEstimating ? <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div> : 'Analyze Impact'}
                    </button>
                 ) : (
                    <div className="space-y-6 animate-slide-up">
                       <div className="p-6 bg-primary-light rounded-2xl text-center">
                          <p className="text-xs font-bold text-primary-dark uppercase mb-1">Estimated Savings</p>
                          <h4 className="text-4xl font-black text-primary tracking-tighter">-{estimate.carbon}kg <span className="text-lg">CO2</span></h4>
                          <p className="text-xs text-primary-dark font-medium mt-2">Validated as <span className="font-black">{estimate.type}</span> improvement</p>
                       </div>
                       <div className="flex gap-4">
                          <button 
                             onClick={() => setEstimate(null)}
                             className="flex-1 py-4 bg-surface border border-surface-border font-bold text-sm rounded-2xl"
                          >
                             Retry
                          </button>
                          <button 
                             onClick={handleApplyEstimate}
                             className="flex-1 py-4 bg-black text-white font-bold text-sm rounded-2xl shadow-xl active:scale-95 transition-all"
                          >
                             Confirm & Log
                          </button>
                       </div>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scale-up { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-scale-up { animation: scale-up 0.3s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
      `}} />
    </div>
  );
}
