import React, { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Lock, Mail, Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useContext(AuthContext);

  if (user) {
    if (user.role === 'admin') return <Navigate to="/admin" />;
    if (user.role === 'senior_manager') return <Navigate to="/manager" />;
    if (user.role === 'hr_recruiter') return <Navigate to="/hr" />;
    return <Navigate to="/employee" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      toast.success('Logged in successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 dark:bg-gradient-to-br dark:from-slate-950 dark:via-blue-950/20 dark:to-slate-900 transition-colors duration-300">
      
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Animated Gradient Bar */}
        <div className="absolute top-0 left-0 w-full h-1 z-1 bg-gradient-to-r from-blue-500 via-indigo-500 via-purple-500 to-blue-500 bg-[length:200%_100%] animate-gradient-shift"></div>
        
        {/* Dot Grid Background */}
        <div className="absolute inset-0 opacity-20 dark:opacity-10 animate-grid-drift" style={{
          backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}></div>

        {/* Animated Rings */}
        <div className="absolute top-[10%] left-[5%] w-80 h-80 rounded-full border-2 border-blue-400/30 animate-ring-pulse" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-[50%] right-[10%] w-96 h-96 rounded-full border-2 border-indigo-400/20 animate-ring-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-[10%] left-[50%] w-64 h-64 rounded-full border-2 border-purple-400/25 animate-ring-pulse" style={{ animationDelay: '2s' }}></div>

        {/* Floating Particles */}
        <div className="absolute top-[15%] left-[10%] w-20 h-20 rounded-full bg-gradient-radial from-blue-400/80 to-transparent blur-lg animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-[45%] right-[15%] w-16 h-16 rounded-full bg-gradient-radial from-indigo-400/60 to-transparent blur-lg animate-float-reverse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-[15%] left-[20%] w-24 h-24 rounded-full bg-gradient-radial from-indigo-400/60 to-transparent blur-lg animate-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-[30%] right-[5%] w-16 h-16 rounded-full bg-gradient-radial from-purple-400/50 to-transparent blur-lg animate-float-reverse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-[20%] right-[10%] w-20 h-20 rounded-full bg-gradient-radial from-blue-400/80 to-transparent blur-lg animate-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-[55%] left-[5%] w-14 h-14 rounded-full bg-gradient-radial from-blue-400/70 to-transparent blur-lg animate-float-reverse" style={{ animationDelay: '5s' }}></div>
        <div className="absolute top-[5%] right-[30%] w-20 h-20 rounded-full bg-gradient-radial from-indigo-400/50 to-transparent blur-lg animate-float" style={{ animationDelay: '2.5s' }}></div>
        <div className="absolute bottom-[5%] right-[25%] w-16 h-16 rounded-full bg-gradient-radial from-purple-400/60 to-transparent blur-lg animate-float-reverse" style={{ animationDelay: '4.5s' }}></div>

        {/* Tiny Visible Colored Particles - Bright Glowing Balls */}
        <div className="absolute top-[20%] left-[8%] w-5 h-5 rounded-full bg-blue-500 animate-float opacity-100 shadow-lg shadow-blue-500/90" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-[35%] left-[15%] w-4 h-4 rounded-full bg-indigo-500 animate-float-reverse opacity-100 shadow-lg shadow-indigo-500/90" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-[50%] left-[12%] w-5 h-5 rounded-full bg-purple-500 animate-float opacity-100 shadow-lg shadow-purple-500/90" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[25%] right-[12%] w-4 h-4 rounded-full bg-cyan-500 animate-float-reverse opacity-100 shadow-lg shadow-cyan-500/90" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-[60%] right-[15%] w-5 h-5 rounded-full bg-blue-500 animate-float opacity-100 shadow-lg shadow-blue-500/90" style={{ animationDelay: '2.5s' }}></div>
        <div className="absolute bottom-[25%] right-[8%] w-4 h-4 rounded-full bg-indigo-500 animate-float-reverse opacity-100 shadow-lg shadow-indigo-500/90" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute bottom-[15%] left-[35%] w-5 h-5 rounded-full bg-purple-500 animate-float opacity-100 shadow-lg shadow-purple-500/90" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-[32%] right-[30%] w-4 h-4 rounded-full bg-cyan-500 animate-float-reverse opacity-100 shadow-lg shadow-cyan-500/90" style={{ animationDelay: '3.5s' }}></div>
        <div className="absolute top-[40%] left-[3%] w-5 h-5 rounded-full bg-blue-500 animate-float opacity-100 shadow-lg shadow-blue-500/90" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-[55%] right-[40%] w-4 h-4 rounded-full bg-indigo-500 animate-float-reverse opacity-100 shadow-lg shadow-indigo-500/90" style={{ animationDelay: '4.5s' }}></div>
        <div className="absolute bottom-[40%] left-[55%] w-5 h-5 rounded-full bg-purple-500 animate-float opacity-100 shadow-lg shadow-purple-500/90" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-[75%] left-[20%] w-4 h-4 rounded-full bg-cyan-500 animate-float-reverse opacity-100 shadow-lg shadow-cyan-500/90" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[60%] left-[65%] w-5 h-5 rounded-full bg-blue-500 animate-float opacity-100 shadow-lg shadow-blue-500/90" style={{ animationDelay: '0.8s' }}></div>
        <div className="absolute bottom-[12%] left-[30%] w-4 h-4 rounded-full bg-indigo-500 animate-float-reverse opacity-100 shadow-lg shadow-indigo-500/90" style={{ animationDelay: '2.3s' }}></div>
        <div className="absolute top-[10%] left-[55%] w-5 h-5 rounded-full bg-purple-500 animate-float opacity-100 shadow-lg shadow-purple-500/90" style={{ animationDelay: '3.2s' }}></div>
        <div className="absolute bottom-[45%] right-[3%] w-4 h-4 rounded-full bg-cyan-500 animate-float-reverse opacity-100 shadow-lg shadow-cyan-500/90" style={{ animationDelay: '3.7s' }}></div>
        <div className="absolute top-[70%] right-[38%] w-5 h-5 rounded-full bg-blue-500 animate-float opacity-100 shadow-lg shadow-blue-500/90" style={{ animationDelay: '1.2s' }}></div>
        <div className="absolute top-[32%] right-[60%] w-4 h-4 rounded-full bg-indigo-500 animate-float-reverse opacity-100 shadow-lg shadow-indigo-500/90" style={{ animationDelay: '2.8s' }}></div>

        {/* Gradient Blobs */}
        <div className="absolute top-[-20%] left-[-15%] w-[60%] h-[60%] rounded-full bg-blue-500/10 dark:bg-blue-500/15 blur-[150px] animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-[-20%] right-[-15%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 dark:bg-indigo-500/15 blur-[150px] animate-pulse" style={{ animationDuration: '12s' }}></div>
        <div className="absolute top-[25%] right-[5%] w-[35%] h-[35%] rounded-full bg-purple-500/5 dark:bg-purple-500/10 blur-[120px] animate-pulse" style={{ animationDuration: '10s' }}></div>
      </div>

      {/* Content Layer */}
      <div className="relative z-20 flex flex-col justify-center items-center">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white flex justify-center items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/30 dark:shadow-blue-500/10 transform hover:rotate-6 transition-transform duration-300">
              <span className="text-white font-black text-2xl">S</span>
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">SmartHR</span>
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600 dark:text-slate-400">
            Enterprise Human Resource Management System
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl py-8 px-4 shadow-2xl shadow-slate-200/80 dark:shadow-none sm:rounded-3xl sm:px-10 border border-slate-100/80 dark:border-slate-800/80 transition-colors">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email address</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    className="focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full pl-10 sm:text-sm border-slate-200 dark:border-slate-700/80 rounded-xl py-3 border bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="password"
                    required
                    className="focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full pl-10 sm:text-sm border-slate-200 dark:border-slate-700/80 rounded-xl py-3 border bg-slate-50/50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-500/25 dark:shadow-none text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-150 transform active:scale-[0.98]"
                >
                  {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Sign in to Dashboard'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
