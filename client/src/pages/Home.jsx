import { useNavigate } from 'react-router-dom';
import FAB from '../components/FAB';

const suggestions = [
  {
    tag: 'Transport',
    tagBg: 'bg-tertiary-container text-on-tertiary-container',
    points: '+5 Points',
    title: 'Switch to cycling for your next commute',
    desc: 'The weather is perfect (22°C) and you\'ll save 3.2kg of CO2 today.',
    action: 'Commit Action',
  },
  {
    tag: 'Kitchen',
    tagBg: 'bg-secondary-container text-on-secondary-container',
    points: '+3 Points',
    title: 'Try a plant-based dinner tonight',
    desc: 'Swap beef for lentils to reduce your water footprint by 800L.',
    action: 'View Recipe',
  },
  {
    tag: 'Energy',
    tagBg: 'bg-primary-container text-on-primary-container',
    points: '+4 Points',
    title: 'Set thermostat to 68°F tonight',
    desc: 'Mild temperatures tonight — lower heating could save 2kg of CO2 by morning.',
    action: 'Apply Action',
  },
];

const quickActions = [
  { icon: 'directions_car', label: 'Travel' },
  { icon: 'restaurant', label: 'Food' },
  { icon: 'bolt', label: 'Energy' },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Top App Bar */}
      <header className="sticky top-0 z-50 bg-[#f8faf9]/70 backdrop-blur-xl flex justify-between items-center px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary fill-1" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
          <h1 className="font-headline font-extrabold text-xl tracking-tight text-emerald-900">EcoSense</h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full hover:bg-emerald-50/50 transition-transform active:scale-95">
            <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
          </button>
          <div
            className="w-8 h-8 rounded-full bio-luminescent overflow-hidden flex items-center justify-center text-white text-xs font-bold cursor-pointer"
            onClick={() => navigate('/profile')}
          >
            AR
          </div>
        </div>
      </header>

      <main className="px-5 pt-2 max-w-md mx-auto">
        {/* Greeting */}
        <section className="mb-7">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-on-background">Hi Alex 🌿</h2>
          <p className="text-on-surface-variant font-medium mt-1">Ready to nurture your world today?</p>
        </section>

        {/* Eco Score Hero Card */}
        <section className="mb-8 relative overflow-hidden rounded-xl bio-luminescent p-6 text-white shadow-ambient-lg animate-fade-in">
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest opacity-90 mb-2">Eco Score</p>
              <div className="flex items-baseline gap-1">
                <span className="font-headline text-6xl font-extrabold tracking-tighter">84</span>
                <span className="font-headline text-xl font-bold opacity-80">/100</span>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-full p-3 border border-white/30">
              <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>trending_up</span>
            </div>
          </div>
          <div className="mt-8 bg-white/10 backdrop-blur-md rounded-lg p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined">co2</span>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">Carbon saved today</p>
              <p className="text-xl font-headline font-bold tracking-tight">12.4 kg</p>
            </div>
          </div>
          {/* Decorative blur */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        </section>

        {/* Quick Actions */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-headline text-lg font-bold">Track Impact</h3>
            <button className="text-primary font-bold text-sm">View All</button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {quickActions.map(({ icon, label }) => (
              <button
                key={label}
                className="flex flex-col items-center gap-3 p-4 bg-surface-container-low rounded-lg transition-transform active:scale-95 group hover:bg-white"
              >
                <div className="w-14 h-14 rounded-full bg-surface-container-lowest flex items-center justify-center shadow-sm group-hover:bg-primary-container transition-colors">
                  <span className="material-symbols-outlined text-primary">{icon}</span>
                </div>
                <span className="font-label text-xs font-bold text-on-surface-variant">{label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* AI Suggestions Carousel */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            <h3 className="font-headline text-lg font-bold">Today's AI Suggestions</h3>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-hide -mx-1 px-1">
            {suggestions.map((s, i) => (
              <div
                key={i}
                className="min-w-[280px] bg-surface-container-lowest rounded-xl p-5 shadow-ambient border border-outline-variant/10 animate-slide-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex justify-between items-start mb-3">
                  <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded tracking-wider ${s.tagBg}`}>{s.tag}</span>
                  <span className="text-primary-dim text-xs font-bold">{s.points}</span>
                </div>
                <h4 className="font-headline font-bold text-base leading-snug mb-2">{s.title}</h4>
                <p className="text-on-surface-variant text-sm mb-4">{s.desc}</p>
                <button className="w-full py-2.5 bg-primary text-on-primary font-bold rounded-full text-sm hover:bg-primary-dim transition-colors">
                  {s.action}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Mini Bento Stats */}
        <section className="grid grid-cols-2 gap-4">
          <div className="bg-surface-container-low p-4 rounded-lg flex flex-col justify-between aspect-square">
            <span className="material-symbols-outlined text-primary text-3xl">water_drop</span>
            <div>
              <p className="text-[10px] font-bold uppercase text-on-surface-variant tracking-wider">Water Saved</p>
              <p className="font-headline text-2xl font-bold">42L</p>
            </div>
          </div>
          <div className="bg-surface-container-high p-4 rounded-lg flex flex-col justify-between aspect-square">
            <span className="material-symbols-outlined text-primary text-3xl">compost</span>
            <div>
              <p className="text-[10px] font-bold uppercase text-on-surface-variant tracking-wider">Compost Stat</p>
              <p className="font-headline text-2xl font-bold">1.5kg</p>
            </div>
          </div>
        </section>
      </main>

      <FAB />
    </div>
  );
}
