import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import StatCard from '../../components/ui/StatCard';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import { Users, FileText, CheckCircle, Clock } from 'lucide-react';

export default function HRDashboard() {
  const [candidates, setCandidates] = useState([]);
  const [onboardings, setOnboardings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [candRes, onbRes] = await Promise.all([
          api.get('/resume/candidates'),
          api.get('/onboarding/all')
        ]);
        setCandidates(candRes.data);
        setOnboardings(onbRes.data);
      } catch(err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSkeleton />;

  const shortlisted = candidates.filter(c => c.status === 'shortlisted');

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">HR Dashboard</h1>
        <p className="text-slate-500">Recruitment and Onboarding overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Candidates" value={candidates.length} icon={<Users size={24} className="text-blue-600" />} colorClass="bg-blue-50" />
        <StatCard title="Shortlisted" value={shortlisted.length} icon={<CheckCircle size={24} className="text-green-600" />} colorClass="bg-green-50" />
        <StatCard title="Active Onboardings" value={onboardings.length} icon={<Clock size={24} className="text-amber-600" />} colorClass="bg-amber-50" />
        <StatCard title="Interviews Pending" value={shortlisted.length} icon={<FileText size={24} className="text-purple-600" />} colorClass="bg-purple-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-800">Top Candidates</h3>
            <Link to="/hr/resume" className="text-sm text-blue-600 hover:underline">View All</Link>
          </div>
          <div className="p-0">
            <ul className="divide-y divide-slate-100">
              {candidates.slice(0, 5).map(c => (
                <li key={c._id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                  <div>
                    <p className="font-semibold text-slate-800">{c.name || c.resumeFileName}</p>
                    <p className="text-xs text-slate-500">{c.jobRole} • Score: {c.overallScore}%</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${c.status === 'shortlisted' ? 'bg-green-100 text-green-800' : c.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-800'}`}>
                    {c.status.toUpperCase()}
                  </span>
                </li>
              ))}
              {candidates.length === 0 && <li className="p-8 text-center text-slate-500">No candidates screened yet.</li>}
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-800">Onboarding Progress</h3>
            <Link to="/hr/onboarding" className="text-sm text-blue-600 hover:underline">Manage</Link>
          </div>
          <div className="p-4 space-y-4">
            {onboardings.slice(0, 5).map(o => (
              <div key={o._id}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-slate-800">{o.employeeId?.name || 'Unknown'}</span>
                  <span className="text-xs font-bold text-blue-600">{o.overallProgress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${o.overallProgress}%` }}></div>
                </div>
              </div>
            ))}
            {onboardings.length === 0 && <div className="text-center text-slate-500 py-8">No active onboardings.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
