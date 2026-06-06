import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';
import { Clock, LogOut, CheckCircle, ChevronRight, FileText } from 'lucide-react';
import { toast } from 'react-hot-toast';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';

export default function EmployeeDashboard() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [todayAttendance, setTodayAttendance] = useState(null);
  const [onboarding, setOnboarding] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const proRes = await api.get('/employees/me');
      setProfile(proRes.data);
      if(proRes.data) {
         const onbRes = await api.get(`/onboarding/employee/${proRes.data._id}`);
         setOnboarding(onbRes.data);
      }
      
      const attRes = await api.get('/attendance/my');
      const todayString = new Date().toISOString().split('T')[0];
      const todayRec = attRes.data.find(r => r.date.startsWith(todayString));
      setTodayAttendance(todayRec);
      
    } catch(err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCheckIn = async () => {
    try {
      await api.post('/attendance/checkin');
      toast.success('Punched In Successfully!');
      fetchData();
    } catch(err) {
      toast.error(err.response?.data?.message || 'Checkin failed');
    }
  };

  const handleCheckOut = async () => {
    try {
      await api.post('/attendance/checkout');
      toast.success('Punched Out Successfully!');
      fetchData();
    } catch(err) {
      toast.error(err.response?.data?.message || 'Checkout failed');
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) return <LoadingSkeleton />;

  const isCheckedIn = todayAttendance && todayAttendance.checkIn;
  const isCheckedOut = todayAttendance && todayAttendance.checkOut;

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">{getGreeting()}, {user?.name.split(' ')[0]} 👋</h1>
        <p className="text-slate-500 mt-1">Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-lg p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-8 -mt-8 w-48 h-48 bg-white opacity-10 rounded-full blur-2xl"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-lg font-medium opacity-90 mb-1">Time & Attendance</h3>
                <div className="text-4xl font-bold mb-4">
                  {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
                <div className="flex space-x-4 text-sm font-medium">
                  <div className="bg-black/20 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                    In: {todayAttendance?.checkIn || '--:--'}
                  </div>
                  <div className="bg-black/20 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                    Out: {todayAttendance?.checkOut || '--:--'}
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-3 w-full md:w-auto">
                <button 
                  onClick={handleCheckIn} 
                  disabled={isCheckedIn}
                  className={`px-8 py-3 rounded-xl font-bold transition-all shadow-lg flex items-center justify-center ${isCheckedIn ? 'bg-white/20 text-white/50 cursor-not-allowed' : 'bg-white text-blue-700 hover:bg-slate-50 hover:scale-105'}`}
                >
                  <Clock size={20} className="mr-2" /> 
                  {isCheckedIn ? 'Checked In' : 'Punch In'}
                </button>
                <button 
                  onClick={handleCheckOut} 
                  disabled={!isCheckedIn || isCheckedOut}
                  className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center justify-center ${(!isCheckedIn || isCheckedOut) ? 'bg-black/10 text-white/50 cursor-not-allowed' : 'bg-red-500 text-white hover:bg-red-400 shadow-lg shadow-red-500/30 hover:scale-105'}`}
                >
                  <LogOut size={20} className="mr-2" /> 
                  {isCheckedOut ? 'Checked Out' : 'Punch Out'}
                </button>
              </div>
            </div>
          </div>

          {onboarding && onboarding.status !== 'completed' && (
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-800">Your Onboarding Journey</h3>
                <span className="text-sm font-bold text-blue-600">{onboarding.overallProgress}% Complete</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 mb-6">
                <div className="bg-blue-600 h-2 rounded-full transition-all duration-1000" style={{ width: `${onboarding.overallProgress}%` }}></div>
              </div>
              
              <div className="grid gap-3">
                {onboarding.plan.slice(0, 2).map((week, idx) => {
                  const isCompleted = onboarding.progress.find(p => p.taskId === week.taskId)?.completed;
                  return (
                    <div key={idx} className={`p-4 rounded-lg flex items-center justify-between border ${isCompleted ? 'bg-green-50 border-green-100' : 'bg-slate-50 border-slate-200'}`}>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-800">Week {week.week}: {week.title}</span>
                        <span className="text-xs text-slate-500 mt-1">{week.tasks.length} tasks scheduled</span>
                      </div>
                      {isCompleted ? <CheckCircle className="text-green-500" /> : <div className="text-xs bg-white border border-slate-300 px-2 py-1 rounded shadow-sm text-slate-600 font-medium">In Progress</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-semibold text-slate-800">Quick Links</h3>
            </div>
            <div className="p-2 flex flex-col">
              <Link to="/employee/attendance" className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors group">
                <div className="flex items-center text-slate-700">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors"><Clock size={18}/></div>
                  View Attendance log
                </div>
                <ChevronRight size={16} className="text-slate-400 group-hover:text-blue-600" />
              </Link>
              <Link to="/employee/payslip" className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors group">
                <div className="flex items-center text-slate-700">
                  <div className="bg-amber-100 p-2 rounded-lg mr-3 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors"><FileText size={18}/></div>
                  Download Payslips
                </div>
                <ChevronRight size={16} className="text-slate-400 group-hover:text-amber-600" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
