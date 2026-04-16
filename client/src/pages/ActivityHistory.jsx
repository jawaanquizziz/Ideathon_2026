import { useEco } from '../context/EcoContext';

export default function ActivityHistory() {
  const { activities, loading } = useEco();

  if (loading) return <div className="pt-24 lg:pl-64 text-center text-on-surface-light font-medium">Loading history...</div>;

  const safeActivities = activities || [];

  return (
    <div className="pt-16 lg:pl-64 min-h-screen bg-background pb-12">
      <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-on-surface">Activity Log</h2>
            <p className="text-sm text-on-surface-variant">Detailed history of your logged impacts and automated actions</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-light text-lg">search</span>
              <input type="text" placeholder="Search ID or Activity..." className="input-standard pl-10 w-full bg-white" />
            </div>
          </div>
        </header>

        {/* Action Bar */}
        <div className="flex gap-4 border-b border-surface-border pb-4">
          <button className="text-sm font-semibold text-primary border-b-2 border-primary pb-4 -mb-4">All Activity</button>
        </div>

        {/* Table Container */}
        <div className="card !p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface border-b border-surface-border">
                  <th className="px-6 py-4 text-xs font-semibold text-on-surface-light uppercase tracking-wider">Log ID</th>
                  <th className="px-6 py-4 text-xs font-semibold text-on-surface-light uppercase tracking-wider">Activity</th>
                  <th className="px-6 py-4 text-xs font-semibold text-on-surface-light uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-xs font-semibold text-on-surface-light uppercase tracking-wider">Impact</th>
                  <th className="px-6 py-4 text-xs font-semibold text-on-surface-light uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-4 text-xs font-semibold text-on-surface-light uppercase tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {safeActivities.map((row) => (
                  <tr key={row.id} className="hover:bg-surface transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono text-on-surface-light">{(row.id || '').substring(0, 8)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-on-surface">{row.title}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-on-surface-variant px-2 py-1 bg-background rounded-md border border-surface-border">{row.type}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-semibold ${(row.impact || '').includes('CO2') ? ((row.impact || '').startsWith('-') ? 'text-primary' : 'text-error') : 'text-warning'}`}>{row.impact}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-on-surface">{row.date}</p>
                      <p className="text-xs text-on-surface-light">{row.time}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        row.status === 'Verified' || row.status === 'System' ? 'bg-primary-light text-primary-dark' :
                        row.status === 'Achievement' ? 'bg-warning-bg text-warning-dark' :
                        row.status === 'Pending' ? 'bg-white border border-surface-border text-on-surface-variant' :
                        'bg-surface-border text-on-surface-variant'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {safeActivities.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-20 text-center text-on-surface-light font-medium">No activity history found. Start logging actions on the dashboard!</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Footer (Placeholder) */}
          <div className="px-6 py-4 border-t border-surface-border bg-surface flex items-center justify-between">
            <p className="text-xs text-on-surface-variant">Showing <span className="font-semibold text-on-surface">{safeActivities.length}</span> results</p>
          </div>
        </div>
      </div>
    </div>
  );
}
