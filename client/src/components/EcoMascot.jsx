import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PAGED_ADVICE = {
  '/': "Welcome to your Dashboard! Here you can check your daily eco-score and log quick actions like biking or meat-free meals. Keep that score high! 🌿",
  '/dashboard': "Welcome! This is your control center. Track your real-time carbon savings and see how your score compares to the top 5% of users. 🏆",
  '/assistant': "Need eco-advice? Ask me or our AI Assistant! We can help you find low-carbon alternatives for almost anything you can think of! 🤖",
  '/insights': "Time for deep data! These charts show exactly where you're saving the most carbon. Travel is usually the biggest impact area! 📊",
  '/activity': "This is your permanent wall of fame. Every single green action you've taken is recorded here for life. Look at all that impact! ✨",
  '/profile': "Keep your details up to date! Changing your name here will update your profile across the entire EcoSense platform instantly. 👤",
};

export default function EcoMascot() {
  const location = useLocation();
  const [showSpeech, setShowSpeech] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const path = location.pathname;
    const advice = PAGED_ADVICE[path] || "I'm Leafy, your Eco-Assistant! I'm here to help you navigate your greenhouse and reach your sustainability goals. 🍃";
    setMessage(advice);
    
    // Auto-open speech on EVERY page change
    setShowSpeech(true);
  }, [location.pathname]);

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end pointer-events-none sm:bottom-20 md:bottom-24 lg:bottom-8">
      
      {/* Cloud-style Speech Bubble - Click to close */}
      <div 
        onClick={() => setShowSpeech(false)}
        className={`mr-4 mb-3 max-w-[220px] bg-white text-on-surface text-xs font-bold p-5 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-primary/10 transition-all duration-700 pointer-events-auto relative cursor-pointer group/bubble ${
          showSpeech ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-75 select-none'
        }`}
      >
        {/* Dismiss hint - Visible on hover */}
        <div className="absolute top-3 right-5 opacity-0 group-hover/bubble:opacity-100 transition-opacity text-[9px] text-primary uppercase font-black bg-primary-light px-1.5 py-0.5 rounded">
           Dismiss
        </div>

        {/* Cloud bumps for aesthetic */}
        <div className="absolute -top-3 left-1/4 w-8 h-8 bg-white rounded-full"></div>
        <div className="absolute -top-2 right-1/4 w-6 h-6 bg-white rounded-full"></div>
        
        <p className="leading-relaxed relative z-10 pr-4">{message}</p>
        
        {/* Cloud tail circles */}
        <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white rounded-full shadow-md"></div>
        <div className="absolute -bottom-5 right-6 w-2.5 h-2.5 bg-white rounded-full shadow-sm"></div>
      </div>

      {/* 3D-feel Mascot Wrapper */}
      <div 
        onClick={() => setShowSpeech(!showSpeech)}
        className="w-24 h-24 sm:w-28 sm:h-28 cursor-pointer pointer-events-auto animate-float group relative"
      >
        {/* Soft shadow for 3D depth */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-3 bg-black/10 rounded-[100%] blur-md group-hover:bg-black/20 transition-all"></div>
        
        <div className="relative w-full h-full">
          {/* Subtle glow behind mascot */}
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-colors"></div>
          
          <img 
            src="/leafy.png" 
            alt="Leafy 3D Mascot" 
            className="w-full h-full object-contain relative z-10 drop-shadow-2xl transform transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3" 
          />
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-12px) rotate(2deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}} />
    </div>
  );
}
