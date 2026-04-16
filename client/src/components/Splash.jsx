import { useMemo } from 'react';

const SLOGANS = [
  "Real-Time Action",
  "Empowering Your Greenhouse",
  "Small Acts, Global Impact",
  "A Smarter Future for Earth",
  "Your Carbon, Your Control",
  "Green Actions, Real Data",
  "Nurture Your Digital Forest"
];

export default function Splash() {
  const randomSlogan = useMemo(() => {
    return SLOGANS[Math.floor(Math.random() * SLOGANS.length)];
  }, []);

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center overflow-hidden">
      
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none animate-[radial-glow_4s_ease-in-out_infinite]" />
      
      <div className="flex flex-col items-center gap-8 relative z-10">
        {/* New Premium Logo */}
        <div className="w-40 h-40 animate-logo drop-shadow-2xl">
          <img src="/logo.png" alt="EcoSense Logo" className="w-full h-full object-contain" />
        </div>

        <div className="text-center">
          <h1 className="text-5xl font-extrabold text-on-surface tracking-tighter animate-reveal">EcoSense</h1>
          <p className="text-sm font-semibold text-primary uppercase tracking-[0.3em] mt-2 animate-reveal-slow">
            {randomSlogan}
          </p>
        </div>
      </div>
      
      {/* Sleek Progress Bar */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-32 h-[3px] bg-surface-border rounded-full overflow-hidden animate-reveal-slow" style={{ opacity: 0.5 }}>
        <div className="h-full bg-primary animate-[drawLine_2.5s_ease-in-out_infinite]" />
      </div>
    </div>
  );
}
