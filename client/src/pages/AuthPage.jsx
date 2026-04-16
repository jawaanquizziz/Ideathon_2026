import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = isLogin 
      ? await login(formData.email, formData.password)
      : await register(formData.name, formData.email, formData.password);

    if (!res.success) {
      setError(res.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full animate-slide-up">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10 animate-logo">
          <div className="w-20 h-20 mb-4 drop-shadow-xl">
            <img src="/logo.png" alt="EcoSense Logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-3xl font-bold text-on-surface font-headline tracking-tighter italic">EcoSense</h2>
          <p className="text-on-surface-light text-sm mt-1 font-medium">Real-Time Eco Action Assistant</p>
        </div>

        {/* Auth form card */}
        <div className="card shadow-2xl">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-on-surface">{isLogin ? 'Welcome Back' : 'Create Account'}</h3>
            <p className="text-sm text-on-surface-variant font-medium mt-1">
              {isLogin ? 'Enter your credentials to manage your greenhouse.' : 'Join our global community of eco-warriors.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Full Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="John Doe"
                  className="input-standard w-full"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Email Address</label>
              <input 
                type="email" 
                required 
                placeholder="alex@example.com"
                className="input-standard w-full"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1">Password</label>
              <input 
                type="password" 
                required 
                placeholder="••••••••"
                className="input-standard w-full"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>

            {error && <p className="text-xs font-bold text-error bg-error-bg p-3 rounded-lg">{error}</p>}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-surface-border text-center">
            <p className="text-sm text-on-surface-variant font-medium">
              {isLogin ? "Don't have an account?" : "Already Have an account?"}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-primary font-bold hover:underline"
              >
                {isLogin ? 'Register Now' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
