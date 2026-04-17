export const AI_SUGGESTIONS = [
  "Analyze my footprint",
  "How to reduce carbon?",
  "Calculate solar ROI",
  "Latest sustainability trends",
  "Energy optimization tips",
  "How am I doing today?",
  "Log a green activity",
  "Machine Learning opportunities"
];

export const getSearchMatches = (query, activities = []) => {
  if (!query) return [];
  const q = query.toLowerCase();
  
  // Search in AI Suggestions
  const aiMatches = AI_SUGGESTIONS.filter(s => s.toLowerCase().includes(q)).map(s => ({
    type: 'ai',
    title: s,
    icon: 'auto_awesome'
  }));
  
  // Search in Activities
  const activityMatches = activities.filter(a => 
    a.title.toLowerCase().includes(q) || 
    (a.id && a.id.toLowerCase().includes(q))
  ).map(a => ({
    type: 'activity',
    title: a.title,
    subtitle: a.date,
    icon: 'history',
    id: a.id
  }));
  
  return [...aiMatches, ...activityMatches].slice(0, 6);
};
