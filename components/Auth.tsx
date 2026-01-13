
import React, { useState } from 'react';

interface AuthProps {
  onLogin: (userData: any) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      onLogin({
        id: 'user-' + Math.random(),
        name: email.split('@')[0],
        email: email,
        role: 'Founder',
        company: 'HyperScale',
        age: 32,
        gender: 'Male',
        quickActions: []
      });
      setIsLoading(false);
    }, 1500);
  };

  const handleGoogleAuth = () => {
    setIsLoading(true);
    setTimeout(() => {
      onLogin({
        id: 'google-user',
        name: 'Alex Rivera',
        email: 'alex.rivera@gmail.com',
        role: 'Founder',
        company: 'Nova AI',
        age: 29,
        gender: 'Non-binary',
        quickActions: []
      });
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] p-6 relative overflow-hidden">
      {/* Abstract Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="bg-[#111] border border-white/5 p-10 rounded-[2.5rem] shadow-2xl relative z-10 backdrop-blur-xl">
          <header className="text-center mb-10">
            <h1 className="text-3xl font-black bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent mb-2">ExecAI</h1>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-[0.3em]">Operational Uplink</p>
          </header>

          <div className="space-y-6">
            <button 
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-3 bg-white hover:bg-gray-100 text-black py-4 rounded-2xl font-bold transition-all transform active:scale-[0.98]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>{isLogin ? 'Continue with Google' : 'Sign up with Google'}</span>
            </button>

            <div className="flex items-center space-x-4">
              <div className="flex-1 h-[1px] bg-white/5"></div>
              <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest">or email</span>
              <div className="flex-1 h-[1px] bg-white/5"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-4">Identity (Email)</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@entity.com"
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-blue-600/30 outline-none transition-all text-white placeholder-gray-700"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest ml-4">Secure Key (Password)</label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm font-medium focus:ring-2 focus:ring-blue-600/30 outline-none transition-all text-white placeholder-gray-700"
                />
              </div>

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-bold transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98] disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Initializing Link...</span>
                  </div>
                ) : (
                  <span>{isLogin ? 'Establish Connection' : 'Register Identity'}</span>
                )}
              </button>
            </form>
          </div>

          <footer className="mt-10 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs text-gray-500 hover:text-blue-400 font-medium transition-colors"
            >
              {isLogin ? "No identity detected? Register here" : "Already registered? Establishment login"}
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Auth;
