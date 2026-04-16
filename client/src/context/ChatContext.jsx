import { createContext, useContext, useState } from 'react';
import axios from 'axios';

const ChatContext = createContext(null);

const SYSTEM_CONTEXT = `You are EcoSense AI, a premium AI environmental assistant built on the "Digital Greenhouse" philosophy. You help users:
- Track and reduce their carbon footprint
- Understand the environmental impact of their daily activities (travel, food, energy, shopping)
- Provide actionable, specific eco-friendly alternatives
- Analyze and interpret personal environmental data

Always respond in a warm, knowledgeable, and encouraging tone. Format responses with clear sections when presenting data. Quantify impacts (e.g., kg CO2, liters of water, kWh) whenever possible. When suggesting alternatives, explain the exact environmental benefit. Start every analysis with a brief, friendly acknowledgment of the user's action.`;

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
      content: 'I just finished my weekly grocery shopping. I bought mostly local produce but had to get some imported berries and a few plastic-wrapped snacks. How\'s my impact?',
    },
    {
      role: 'assistant',
      content: 'Great choices on the local produce! 🌿 Your mixed basket has a moderate footprint. Here\'s the breakdown:\n\n**Local produce:** Excellent choice — significantly reduces transportation emissions (food miles).\n\n**Imported berries:** These contribute the most to your carbon footprint this week. Fresh imports carry roughly 4.2 kg CO2e due to air freight.\n\n**Eco Alternative:** Opt for frozen local berries instead — same nutrients, 60% less carbon footprint from shipping.',
      metrics: [
        { label: 'CO2 Impact', value: '4.2', unit: 'kg CO2e', bar: 0.6, barColor: 'bg-orange-400', note: '15% higher than your average' },
        { label: 'Eco Score', value: '74', unit: '/100', bar: 0.74, barColor: 'bg-primary', note: 'Room to improve with alternatives' },
      ],
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content) => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { role: 'user', content, timestamp };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Get current user id for personal stats context
      const userData = localStorage.getItem('ecosense_user');
      const userId = userData ? JSON.parse(userData).id : '';
      
      const response = await axios.post('/api/chat', {
        message: content,
        history: messages.map(m => ({ role: m.role, content: m.content })),
        systemContext: SYSTEM_CONTEXT,
      }, {
        headers: { 'x-user-id': userId }
      });
      
      const aiMsg = { 
        role: 'assistant', 
        content: response.data.reply, 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      const errMsg = {
        role: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: error.response?.status === 503 
          ? '🌿 EcoSense AI is ready, but your API Key is missing. Please add it to the server .env file to enable live coaching!'
          : 'I\'m experiencing a climate connection issue. Please try again soon! 🍃',
      };
      setMessages(prev => [...prev, errMsg]);
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
