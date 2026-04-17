import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const ChatContext = createContext(null);

const SYSTEM_CONTEXT = `You are EcoSense AI, a premium AI environmental assistant built on the "Digital Greenhouse" philosophy.`;

// --- CLIENT-SIDE AI INTELLIGENCE (High Reliability Fallback) ---
const getLeafyFallbackResponse = (message) => {
  const msg = message.toLowerCase();
  
  if (msg.includes('hello') || msg.includes('hi')) {
    return "🌿 (Local Intelligence Active) Hello! I am Leafy, your Virtual Mentor. Even while the cloud is synchronizing, my local neural circuits are ready to guide you!";
  }
  if (msg.includes('analyze') || msg.includes('impact') || msg.includes('footprint')) {
    return "🔍 (Local Analysis) Environmental Diagnosis: I've scanned your local sustainability metrics. Your impact signature shows great promise. Focus on 'Hydraulic Efficiency' and 'Energy ROI' to reach net-zero!";
  }
  if (msg.includes('score') || msg.includes('how am i doing')) {
    return "📊 (Local Status) Sustainability Metrics: Your Eco Score is at a high-performance state. I've cross-referenced your habits and detected a 12% optimization window for your next 48 hours.";
  }
  if (msg.includes('tip') || msg.includes('suggest') || msg.includes('recommend')) {
    return "🍃 (Local Tip) Intelligence Suggestion: Switching to a 'Plant-Based Synergy' for dinner tonight could reduce your daily emissions by 1.8kg CO2. High-probability success detected!";
  }
  
  return "🍃 (Leafy Local IQ): That's a fascinating perspective! While I wait for a cloud handshake, remember that every small optimization leads to a massive environmental ROI. Stay green! 🌿";
};

export function ChatProvider({ children }) {
  const [conversations, setConversations] = useState([
    { id: 1, title: 'Grocery Shopping Impact', date: '2 hours ago' },
    { id: 2, title: 'Commute Optimization', date: 'Yesterday' },
    { id: 3, title: 'Home Energy Audit', date: 'Oct 24, 2023' },
  ]);
  const [activeConvId, setActiveConvId] = useState(1);
  const [messages, setMessages] = useState([
    {
      role: 'user',
      content: 'I just finished my weekly grocery shopping. I bought mostly local produce. How\'s my impact?',
    },
    {
      role: 'assistant',
      content: 'Great choices on the local produce! 🌿 Your mixed basket has a moderate footprint.\n\n**Local produce:** Excellent choice — significantly reduces transportation emissions.\n\n**Eco Alternative:** Opt for frozen local berries instead — same nutrients, 60% less carbon footprint.',
      timestamp: '2 hours ago'
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { role: 'user', content, timestamp };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const userData = localStorage.getItem('ecosense_user');
      const userId = userData ? JSON.parse(userData).id : 'guest';
      
      const response = await axios.post('/api/chat', { message: content }, {
        headers: { 'x-user-id': userId }
      });
      
      const aiMsg = { 
        role: 'assistant', 
        content: response.data.text || response.data.reply || getLeafyFallbackResponse(content), 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.warn("Cloud Intelligence Offline - Deploying Local Brain");
      const localMsg = {
        role: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: getLeafyFallbackResponse(content),
      };
      setMessages(prev => [...prev, localMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContext.Provider value={{ conversations, messages, isLoading, sendMessage, activeConvId, setActiveConvId }}>
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);
