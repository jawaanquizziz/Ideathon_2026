import { useState } from 'react';
import { useEco } from '../context/EcoContext';

export default function ActivityHistory() {
  const { activities, loading } = useEco();
  const [searchTerm, setSearchTerm] = useState('');

  if (loading) return <div className="pt-24 lg:pl-64 text-center text-on-surface-light font-medium uppercase tracking-widest">Synchronizing History...</div>;

  const safeActivities = activities || [];
  
  // Real-time Filtering Logic
  const filteredActivities = safeActivities.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pt-16 lg:pl-64 min-h-screen bg-background pb-12">
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-on-surface">Environmental Log</h2>
            <p className="text-sm text-on-surface-variant">Validated history of your sustainability optimizations</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64 group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-light text-lg group-focus-within:text-primary transition-colors">search</span>
              <input 
                type="text" 
                placeholder="Filter by ID or Action..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-standard pl-10 w-full bg-white focus:ring-1 focus:ring-primary focus:border-primary border-surface-border transition-all" 
              />
            </div>
          </div>
        </header>

        {/* Action Bar */}
        <div className="flex gap-4 border-b border-surface-border pb-4">
          <button className="text-sm font-bold text-primary border-b-2 border-primary pb-4 -mb-4 uppercase tracking-wider">All Intelligence Logs</button>
        </div>

        {/* Table Container */}
        <div className="card !p-0 overflow-hidden shadow-sm border border-surface-border">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface border-b border-surface-border">
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-light uppercase tracking-[0.2em]">Log ID</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-light uppercase tracking-[0.2em]">Activity Parameter</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-light uppercase tracking-[0.2em]">Classification</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-light uppercase tracking-[0.2em]">Carbon Delta</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-light uppercase tracking-[0.2em]">Intelligence Timestamp</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-on-surface-light uppercase tracking-[0.2em] text-right">Engine Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {filteredActivities.length > 0 ? (
                  filteredActivities.map((row) => (
                    <tr key={row.id} className="hover:bg-primary/[0.02] transition-colors group">
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono text-on-surface-light group-hover:text-on-surface transition-colors">{(row.id || '').substring(0, 8)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-on-surface">{row.title}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[10px] font-bold text-primary px-2 py-0.5 bg-primary-light rounded border border-primary/10 uppercase tracking-tighter">{row.type}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-sm font-bold ${(row.impact || '').includes('CO2') ? ((row.impact || '').startsWith('-') ? 'text-primary' : 'text-error') : 'text-warning'}`}>{row.impact}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-on-surface font-medium">{row.date}</p>
                        <p className="text-[10px] text-on-surface-light uppercase">{row.time}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter ${
                          row.status?.includes('Verified') || row.status === 'System' ? 'bg-primary-light text-primary-dark' :
                          row.status === 'Achievement' ? 'bg-warning-bg text-warning-dark' :
                          'bg-surface-border text-on-surface-variant'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-20 text-center text-on-surface-light font-medium italic">No matching intelligence logs found. Try a different parameter.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-4 border-t border-surface-border bg-surface flex items-center justify-between">
            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Showing <span className="text-primary">{filteredActivities.length}</span> Environmental Synchronizations</p>
          </div>
        </div>
      </div>
    </div>
  );
}
