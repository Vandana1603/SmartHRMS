import React, { useState, useEffect, useContext } from 'react';
import api from '../../utils/api';
import { AuthContext } from '../../context/AuthContext';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Users, Award, ShieldAlert } from 'lucide-react';

export default function ManagerDashboard() {
  const { user } = useContext(AuthContext);
  const [employees, setEmployees] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const empRes = await api.get('/employees');
        const team = empRes.data.filter(e => e.department === user.department);
        setEmployees(team);

        const revRes = await api.get('/performance/team');
        setReviews(revRes.data);
      } catch(err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, [user.department]);

  if (loading) return <LoadingSkeleton />;

  const avgRatings = { technical: 0, teamwork: 0, communication: 0, leadership: 0, delivery: 0 };
  if (reviews.length > 0) {
    reviews.forEach(r => {
      avgRatings.technical += r.ratings.technical;
      avgRatings.teamwork += r.ratings.teamwork;
      avgRatings.communication += r.ratings.communication;
      avgRatings.leadership += r.ratings.leadership;
      avgRatings.delivery += r.ratings.delivery;
    });
    for(let key in avgRatings) {
      avgRatings[key] /= reviews.length;
    }
  }

  const radarData = [
    { subject: 'Technical', A: avgRatings.technical, fullMark: 5 },
    { subject: 'Teamwork', A: avgRatings.teamwork, fullMark: 5 },
    { subject: 'Communication', A: avgRatings.communication, fullMark: 5 },
    { subject: 'Leadership', A: avgRatings.leadership, fullMark: 5 },
    { subject: 'Delivery', A: avgRatings.delivery, fullMark: 5 }
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Manager Dashboard</h1>
        <p className="text-slate-500">{user.department} Department Overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-sm font-medium">Team Size</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{employees.length}</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Users size={24} /></div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-500 text-sm font-medium">Recent Reviews</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{reviews.length}</p>
          </div>
          <div className="p-3 bg-green-50 text-green-600 rounded-lg"><Award size={24} /></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 border-b pb-2">Team Directory</h3>
          <div className="overflow-x-auto max-h-[400px]">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-500 sticky top-0">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Designation</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {employees.map(emp => (
                  <tr key={emp._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">{emp.name}</td>
                    <td className="px-4 py-3 text-slate-600">{emp.designation}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs ${emp.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {emp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col items-center">
          <h3 className="text-lg font-semibold text-slate-800 w-full mb-4 border-b pb-2">Team Average Performance</h3>
          {reviews.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <ShieldAlert size={48} className="mb-2" />
              <p>No reviews available yet</p>
            </div>
          ) : (
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" tick={{fill: '#475569'}} />
                  <PolarRadiusAxis angle={30} domain={[0, 5]} />
                  <Radar name="Team Avg" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
