import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-100 dark:bg-gradient-to-br dark:from-slate-950 dark:via-blue-950/10 dark:to-slate-900 relative">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Large Animated Rings */}
        <div className="absolute top-[5%] left-[8%] w-96 h-96 rounded-full border-2 border-blue-400/40 dark:border-blue-400/50 animate-ring-pulse" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-[55%] right-[8%] w-80 h-80 rounded-full border-2 border-indigo-400/40 dark:border-indigo-400/50 animate-ring-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute -bottom-16 left-[12%] w-80 h-80 rounded-full border-2 border-purple-400/35 dark:border-purple-400/45 animate-ring-pulse" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-[35%] left-[50%] w-72 h-72 rounded-full border-2 border-cyan-400/30 dark:border-cyan-400/40 animate-ring-pulse" style={{ animationDelay: '2.5s' }}></div>

        {/* Large Floating Particles - High Visibility */}
        <div className="absolute top-[15%] left-[10%] w-55 h-75 rounded-full bg-gradient-to-br from-blue-400/70 to-blue-300/20 blur-3xl animate-float opacity-70 dark:opacity-60" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-[45%] right-[12%] w-40 h-40 rounded-full bg-gradient-to-br from-indigo-400/60 to-indigo-300/10 blur-3xl animate-float-reverse opacity-60 dark:opacity-50" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-[15%] left-[20%] w-36 h-36 rounded-full bg-gradient-to-br from-purple-400/65 to-purple-300/15 blur-3xl animate-float opacity-65 dark:opacity-55" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-[30%] right-[5%] w-28 h-28 rounded-full bg-gradient-to-br from-cyan-400/55 to-cyan-300/10 blur-2xl animate-float-reverse opacity-55 dark:opacity-45" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-[25%] right-[15%] w-32 h-32 rounded-full bg-gradient-to-br from-blue-400/60 to-blue-300/15 blur-3xl animate-float opacity-60 dark:opacity-50" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-[60%] left-[5%] w-24 h-24 rounded-full bg-gradient-to-br from-indigo-400/65 to-indigo-300/20 blur-2xl animate-float-reverse opacity-65 dark:opacity-55" style={{ animationDelay: '5s' }}></div>
        <div className="absolute top-[8%] right-[25%] w-28 h-28 rounded-full bg-gradient-to-br from-purple-400/50 to-purple-300/10 blur-2xl animate-float opacity-50 dark:opacity-40" style={{ animationDelay: '2.5s' }}></div>
        <div className="absolute bottom-[5%] right-[30%] w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400/60 to-cyan-300/15 blur-2xl animate-float-reverse opacity-60 dark:opacity-50" style={{ animationDelay: '4.5s' }}></div>
        
        {/* Additional Medium Floating Elements */}
        <div className="absolute top-[72%] right-[40%] w-20 h-20 rounded-full bg-gradient-to-br from-blue-400/50 to-transparent blur-xl animate-float opacity-50 dark:opacity-40" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-[22%] left-[35%] w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400/45 to-transparent blur-xl animate-float-reverse opacity-45 dark:opacity-35" style={{ animationDelay: '3.5s' }}></div>
        <div className="absolute bottom-[40%] left-[8%] w-16 h-16 rounded-full bg-gradient-to-br from-purple-400/55 to-transparent blur-lg animate-float opacity-55 dark:opacity-45" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[65%] right-[2%] w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400/50 to-transparent blur-xl animate-float-reverse opacity-50 dark:opacity-40" style={{ animationDelay: '0.5s' }}></div>

        <div className="absolute top-[5%] left-[8%] w-96 h-96 rounded-full border-2 border-blue-400/40 dark:border-blue-400/50 animate-ring-pulse" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-[55%] right-[8%] w-80 h-80 rounded-full border-2 border-indigo-400/40 dark:border-indigo-400/50 animate-ring-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute -bottom-16 left-[12%] w-80 h-80 rounded-full border-2 border-purple-400/35 dark:border-purple-400/45 animate-ring-pulse" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-[35%] left-[50%] w-72 h-72 rounded-full border-2 border-cyan-400/30 dark:border-cyan-400/40 animate-ring-pulse" style={{ animationDelay: '2.5s' }}></div>
              
        {/* Tiny Visible Particle Balls - Enhanced Visibility */}
        <div className="absolute top-[12%] left-[15%] w-4 h-4 rounded-full bg-blue-500 animate-float opacity-100 dark:opacity-90 shadow-lg shadow-blue-500/80" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-[28%] left-[22%] w-5 h-5 rounded-full bg-indigo-500 animate-float-reverse opacity-100 dark:opacity-90 shadow-lg shadow-indigo-500/80" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-[45%] left-[18%] w-4 h-4 rounded-full bg-purple-500 animate-float opacity-100 dark:opacity-90 shadow-lg shadow-purple-500/80" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[18%] right-[20%] w-5 h-5 rounded-full bg-cyan-500 animate-float-reverse opacity-100 dark:opacity-90 shadow-lg shadow-cyan-500/80" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-[52%] right-[18%] w-4 h-4 rounded-full bg-blue-400 animate-float opacity-100 dark:opacity-90 shadow-lg shadow-blue-400/80" style={{ animationDelay: '2.5s' }}></div>
        <div className="absolute top-[68%] right-[8%] w-5 h-5 rounded-full bg-indigo-400 animate-float-reverse opacity-100 dark:opacity-90 shadow-lg shadow-indigo-400/80" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute bottom-[18%] left-[40%] w-4 h-4 rounded-full bg-purple-400 animate-float opacity-100 dark:opacity-90 shadow-lg shadow-purple-400/80" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-[28%] right-[35%] w-5 h-5 rounded-full bg-cyan-400 animate-float-reverse opacity-100 dark:opacity-90 shadow-lg shadow-cyan-400/80" style={{ animationDelay: '3.5s' }}></div>
        <div className="absolute top-[35%] left-[5%] w-4 h-4 rounded-full bg-blue-500 animate-float opacity-100 dark:opacity-90 shadow-lg shadow-blue-500/80" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-[42%] right-[45%] w-5 h-5 rounded-full bg-indigo-500 animate-float-reverse opacity-100 dark:opacity-90 shadow-lg shadow-indigo-500/80" style={{ animationDelay: '4.5s' }}></div>
        <div className="absolute bottom-[35%] left-[60%] w-4 h-4 rounded-full bg-purple-500 animate-float opacity-100 dark:opacity-90 shadow-lg shadow-purple-500/80" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-[75%] left-[25%] w-5 h-5 rounded-full bg-cyan-500 animate-float-reverse opacity-100 dark:opacity-90 shadow-lg shadow-cyan-500/80" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-[55%] left-[70%] w-4 h-4 rounded-full bg-blue-400 animate-float opacity-100 dark:opacity-90 shadow-lg shadow-blue-400/80" style={{ animationDelay: '0.8s' }}></div>
        <div className="absolute bottom-[12%] left-[35%] w-5 h-5 rounded-full bg-indigo-400 animate-float-reverse opacity-100 dark:opacity-90 shadow-lg shadow-indigo-400/80" style={{ animationDelay: '2.3s' }}></div>
        <div className="absolute top-[8%] left-[60%] w-4 h-4 rounded-full bg-purple-400 animate-float opacity-100 dark:opacity-90 shadow-lg shadow-purple-400/80" style={{ animationDelay: '3.2s' }}></div>
        <div className="absolute bottom-[42%] right-[5%] w-5 h-5 rounded-full bg-cyan-400 animate-float-reverse opacity-100 dark:opacity-90 shadow-lg shadow-cyan-400/80" style={{ animationDelay: '3.7s' }}></div>
        <div className="absolute top-[62%] right-[42%] w-4 h-4 rounded-full bg-blue-500 animate-float opacity-100 dark:opacity-90 shadow-lg shadow-blue-500/80" style={{ animationDelay: '1.2s' }}></div>
        <div className="absolute top-[32%] right-[65%] w-5 h-5 rounded-full bg-indigo-500 animate-float-reverse opacity-100 dark:opacity-90 shadow-lg shadow-indigo-500/80" style={{ animationDelay: '2.8s' }}></div>
        <div className="absolute bottom-[22%] left-[25%] w-4 h-4 rounded-full bg-purple-500 animate-float opacity-100 dark:opacity-90 shadow-lg shadow-purple-500/80" style={{ animationDelay: '0.7s' }}></div>
        <div className="absolute top-[18%] left-[80%] w-5 h-5 rounded-full bg-cyan-500 animate-float-reverse opacity-100 dark:opacity-90 shadow-lg shadow-cyan-500/80" style={{ animationDelay: '1.8s' }}></div>
        <div className="absolute top-[48%] left-[80%] w-4 h-4 rounded-full bg-blue-400 animate-float opacity-100 dark:opacity-90 shadow-lg shadow-blue-400/80" style={{ animationDelay: '2.6s' }}></div>
        <div className="absolute bottom-[32%] right-[25%] w-5 h-5 rounded-full bg-indigo-400 animate-float-reverse opacity-100 dark:opacity-90 shadow-lg shadow-indigo-400/80" style={{ animationDelay: '3.3s' }}></div>    
        <div className="absolute top-[25%] left-[50%] w-4 h-4 rounded-full bg-purple-400 animate-float opacity-100 dark:opacity-90 shadow-lg shadow-purple-400/80" style={{ animationDelay: '0.3s' }}></div>
        <div className="absolute bottom-[18%] left-[50%] w-5 h-5 rounded-full bg-cyan-400 animate-float-reverse opacity-100 dark:opacity-90 shadow-lg shadow-cyan-400/80" style={{ animationDelay: '4s' }}></div>
        <div className="absolute top-[40%] right-[30%] w-4 h-4 rounded-full bg-blue-500 animate-float opacity-100 dark:opacity-90 shadow-lg shadow-blue-500/80" style={{ animationDelay: '1.7s' }}></div>
        <div className="absolute top-[60%] left-[30%] w-5 h-5 rounded-full bg-indigo-500 animate-float-reverse opacity-100 dark:opacity-90 shadow-lg shadow-indigo-500/80" style={{ animationDelay: '2.2s' }}></div>
        <div className="absolute bottom-[28%] right-[40%] w-4 h-4 rounded-full bg-purple-500 animate-float opacity-100 dark:opacity-90 shadow-lg shadow-purple-500/80" style={{ animationDelay: '3.8s' }}></div>
        <div className="absolute top-[20%] left-[25%] w-5 h-5 rounded-full bg-cyan-500 animate-float-reverse opacity-100 dark:opacity-90 shadow-lg shadow-cyan-500/80" style={{ animationDelay: '0.9s' }}></div>
        <div className="absolute top-[50%] right-[20%] w-4 h-4 rounded-full bg-blue-400 animate-float opacity-100 dark:opacity-90 shadow-lg shadow-blue-400/80" style={{ animationDelay: '1.3s' }}></div>
        <div className="absolute bottom-[12%] left-[60%] w-5 h-5 rounded-full bg-indigo-400 animate-float-reverse opacity-100 dark:opacity-90 shadow-lg shadow-indigo-400/80" style={{ animationDelay: '2.7s' }}></div>
        <div className="absolute top-[30%] right-[50%] w-4 h-4 rounded-full bg-purple-400 animate-float opacity-100 dark:opacity-90 shadow-lg shadow-purple-400/80" style={{ animationDelay: '3.1s' }}></div>
        <div className="absolute bottom-[25%] left-[15%] w-5 h-5 rounded-full bg-cyan-500 animate-float-reverse opacity-100 dark:opacity-90 shadow-lg shadow-cyan-500/80" style={{ animationDelay: '1.9s' }}></div>
        <div className="absolute top-[45%] left-[40%] w-4 h-4 rounded-full bg-blue-500 animate-float opacity-100 dark:opacity-90 shadow-lg shadow-blue-500/80" style={{ animationDelay: '2.4s' }}></div>
        <div className="absolute top-[25%] right-[15%] w-5 h-5 rounded-full bg-indigo-500 animate-float-reverse opacity-100 dark:opacity-90 shadow-lg shadow-indigo-500/80" style={{ animationDelay: '3.6s' }}></div>
        <div className="absolute bottom-[30%] left-[25%] w-4 h-4 rounded-full bg-purple-500 animate-float opacity-100 dark:opacity-90 shadow-lg shadow-purple-500/80" style={{ animationDelay: '0.4s' }}></div>
        <div className="absolute top-[10%] left-[70%] w-5 h-5 rounded-full bg-cyan-500 animate-float-reverse opacity-100 dark:opacity-90 shadow-lg shadow-cyan-500/80" style={{ animationDelay: '2.1s' }}></div>
        <div className ="absolute top-[55%] right-[35%] w-4 h-4 rounded-full bg-blue-400 animate-float opacity-100 dark:opacity-90 shadow-lg shadow-blue-400/80" style={{ animationDelay: '1.6s' }}></div>


        {/* Larger Gradient Blobs for Ambient Glow */}
        <div className="absolute top-[-15%] left-[-10%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-blue-400/15 to-transparent dark:from-blue-500/20 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute bottom-[-20%] right-[-15%] w-[75%] h-[75%] rounded-full bg-gradient-to-tl from-indigo-400/12 to-transparent dark:from-indigo-500/18 blur-[120px] animate-pulse" style={{ animationDuration: '12s' }}></div>
        <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-gradient-to-br from-cyan-400/10 to-transparent dark:from-cyan-500/15 blur-[120px] animate-pulse" style={{ animationDuration: '10s' }}></div>
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex w-full">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main className="w-full">
            <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
);
}