import React, { useState, useEffect, useContext } from 'react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { UserCheck, Star, Send } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import { AuthContext } from '../../context/AuthContext';

export default function PerformancePage() {
  const { user } = useContext(AuthContext);
  const [employees, setEmployees] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState('');
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [formData, setFormData] = useState({
    reviewPeriod: 'Q3',
    year: new Date().getFullYear(),
    technical: 3, teamwork: 3, communication: 3, leadership: 3, delivery: 3,
    reviewerComments: ''
  });

  const fetchData = async () => {
    try {
      const empRes = await api.get('/employees');
      setEmployees(empRes.data);
      
      const revRes = await api.get('/performance/team');
      setReviews(revRes.data);
    } catch(err) {
      toast.error('Failed to load performance data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (employees.length > 0) {
      const isManager = user && user.role === 'senior_manager';
      const filteredList = isManager
        ? employees.filter(e => e.department === user.department)
        : employees;
      if (filteredList.length > 0 && !selectedEmp) {
        setSelectedEmp(filteredList[0]._id);
      }
    }
  }, [employees, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        employeeId: selectedEmp,
        reviewPeriod: formData.reviewPeriod,
        year: formData.year,
        ratings: {
          technical: formData.technical,
          teamwork: formData.teamwork,
          communication: formData.communication,
          leadership: formData.leadership,
          delivery: formData.delivery
        },
        reviewerComments: formData.reviewerComments
      };
      await api.post('/performance', payload);
      toast.success('Review submitted successfully');
      setFormData({ ...formData, technical: 3, teamwork: 3, communication: 3, leadership: 3, delivery: 3, reviewerComments: '' });
      fetchData();
    } catch(err) {
      toast.error('Failed to submit review');
    }
  };

  const getRadarData = () => {
    if(!selectedEmp) return [];
    const empReviews = reviews.filter(r => r.employeeId?._id === selectedEmp);
    if(empReviews.length === 0) return [{subject: 'No Data', value: 0}];
    const latest = empReviews[0];
    return [
      { subject: 'Technical', A: latest.ratings.technical, fullMark: 5 },
      { subject: 'Teamwork', A: latest.ratings.teamwork, fullMark: 5 },
      { subject: 'Communication', A: latest.ratings.communication, fullMark: 5 },
      { subject: 'Leadership', A: latest.ratings.leadership, fullMark: 5 },
      { subject: 'Delivery', A: latest.ratings.delivery, fullMark: 5 }
    ];
  };

  if (loading) return <LoadingSkeleton />;

  const isManager = user && user.role === 'senior_manager';
  const displayEmployees = isManager
    ? employees.filter(e => e.department === user.department)
    : employees;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Performance Reviews</h1>
          <p className="text-slate-500">Conduct and analyse employee performance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-slate-800 border-b pb-2 mb-4">New Review Form</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Employee</label>
                <select value={selectedEmp} onChange={e => setSelectedEmp(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2 outline-none">
                  {displayEmployees.map(e => <option key={e._id} value={e._id}>{e.name} ({e.department})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Period</label>
                <select value={formData.reviewPeriod} onChange={e => setFormData({...formData, reviewPeriod: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2 outline-none">
                  {['Q1', 'Q2', 'Q3', 'Q4'].map(q => <option key={q} value={q}>{q}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Year</label>
                <input type="number" value={formData.year} onChange={e => setFormData({...formData, year: parseInt(e.target.value)})} className="w-full border border-slate-300 rounded-lg p-2 outline-none" />
              </div>
            </div>

            <div className="space-y-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <h4 className="font-medium text-slate-800">Ratings (1-5)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                {['technical', 'teamwork', 'communication', 'leadership', 'delivery'].map(rt => (
                  <div key={rt} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 capitalize w-32">{rt}</span>
                    <input type="range" min="1" max="5" value={formData[rt]} onChange={e => setFormData({...formData, [rt]: parseInt(e.target.value)})} className="flex-1 mx-4" />
                    <span className="text-sm font-bold w-4 text-center text-blue-600">{formData[rt]}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Reviewer Comments</label>
              <textarea required value={formData.reviewerComments} onChange={e => setFormData({...formData, reviewerComments: e.target.value})} className="w-full border border-slate-300 rounded-lg p-3 h-24 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Provide detailed feedback..." />
            </div>

            <div className="flex justify-end">
              <button type="submit" className="flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                <Send size={18} className="mr-2" /> Submit Review
              </button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col h-[600px]">
          <h3 className="text-lg font-semibold text-slate-800 border-b pb-2 mb-4">Latest Radar</h3>
          <div className="flex-1 flex items-center justify-center -ml-6 -mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={getRadarData()}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{fill: '#475569', fontSize: 12}} />
                <PolarRadiusAxis angle={30} domain={[0, 5]} />
                <Radar name="Employee" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 text-center text-sm text-slate-500">
            Radar chart represents the latest review ratings for the selected employee.
          </div>
        </div>
      </div>
    </div>
  );
}
