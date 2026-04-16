import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setFormData({ 
        name: user.name || '', 
        email: user.email || '' 
      });
    }
  }, [user]);

  const handleSave = async () => {
    setIsUpdating(true);
    setMessage({ type: '', text: '' });
    
    const res = await updateProfile(formData);
    
    if (res.success) {
      setMessage({ type: 'success', text: 'Profile updated successfully! Header sync complete.' });
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to update profile.' });
    }
    setIsUpdating(false);
  };

  const initials = formData.name ? formData.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'US';

  return (
    <div className="pt-16 lg:pl-64 min-h-screen bg-background pb-12">
      <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
        
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-on-surface">Account Settings</h2>
          <p className="text-sm text-on-surface-variant">Manage your profile, preferences, and data privacy</p>
        </header>

        {/* Profile Card */}
        <div className="card animate-slide-up">
          <h3 className="font-semibold text-lg border-b border-surface-border pb-4 mb-4">Personal Information</h3>
          
          {message.text && (
            <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${
              message.type === 'success' ? 'bg-primary-light text-primary-dark' : 'bg-error-bg text-error'
            }`}>
              {message.text}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-8 mb-6">
            <div className="relative group">
              <div className="w-28 h-28 rounded-full bg-primary-light flex items-center justify-center text-primary-dark text-4xl font-bold shrink-0 border-4 border-white shadow-lg">
                {initials}
              </div>
              <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <span className="material-symbols-outlined text-white">photo_camera</span>
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Display Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="input-standard w-full" 
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Email Address</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="input-standard w-full" 
                    placeholder="alex@example.com"
                  />
                  <p className="text-[10px] text-on-surface-light mt-2 italic">Updating your email will change your login credentials.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end pt-6 border-t border-surface-border">
            <button 
              onClick={handleSave}
              disabled={isUpdating}
              className="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isUpdating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Syncing...
                </>
              ) : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Preferences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h3 className="font-semibold text-lg border-b border-surface-border pb-4 mb-4">Application Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-on-surface">Smart Notifications</p>
                  <p className="text-xs text-on-surface-light mt-0.5">Receive AI-based eco suggestions</p>
                </div>
                <div className="w-10 h-6 bg-primary rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 bg-white w-4 h-4 rounded-full" />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-on-surface">Weekly Reports</p>
                  <p className="text-xs text-on-surface-light mt-0.5">Email summary of impact</p>
                </div>
                <div className="w-10 h-6 bg-surface-border rounded-full relative cursor-pointer hover:bg-on-surface-light transition-colors">
                  <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow-sm" />
                </div>
              </div>
            </div>
          </div>

          <div className="card border-error/10 bg-error-bg/20">
            <h3 className="font-semibold text-lg text-error border-b border-error/10 pb-4 mb-4">Security</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-on-surface">Data Privacy</p>
                <p className="text-xs text-on-surface-light mt-0.5 mb-3">Download a copy of your carbon footprint data.</p>
                <button className="px-3 py-1.5 bg-white border border-surface-border text-xs font-bold rounded-lg hover:bg-surface text-on-surface shadow-sm">Export Data (JSON)</button>
              </div>
              <div className="pt-4 border-t border-error/10">
                <button className="text-xs text-error font-bold hover:underline">Deactivate my account</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
