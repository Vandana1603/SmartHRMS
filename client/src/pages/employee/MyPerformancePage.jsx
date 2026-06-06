import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { Award, ShieldAlert, FileText } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import EmptyState from '../../components/ui/EmptyState';

export default function MyPerformancePage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get('/performance/my');
        setReviews(res.data);
      } catch(err) {
        toast.error('Failed to fetch reviews');
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  if (loading) return <LoadingSkeleton />;

  const getRadarData = (r) => [
    { subject: 'Technical', val: r.ratings.technical, fullMark: 5 },
    { subject: 'Teamwork', val: r.ratings.teamwork, fullMark: 5 },
    { subject: 'Comm.', val: r.ratings.communication, fullMark: 5 },
    { subject: 'Leader', val: r.ratings.leadership, fullMark: 5 },
    { subject: 'Delivery', val: r.ratings.delivery, fullMark: 5 }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">My Performance</h1>
        <p className="text-slate-500">Track your continuous growth and feedback.</p>
      </div>

      {reviews.length === 0 ? (
        <EmptyState title="No Reviews Yet" description="You have not received any official performance reviews." icon={<Award size={48} />} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col items-center overflow-hidden">
            <h3 className="text-lg font-semibold text-slate-800 w-full mb-6 border-b pb-2">Latest Review Analytics</h3>
            <div className="w-full h-64 -ml-6">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={getRadarData(reviews[0])}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" tick={{fill: '#475569', fontSize: 11}} />
                  <PolarRadiusAxis angle={30} domain={[0, 5]} />
                  <Radar name="Review" dataKey="val" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-slate-500">Overall Rating</p>
              <div className="flex items-end justify-center">
                <span className="text-4xl font-extrabold text-blue-600">{reviews[0].overallRating.toFixed(1)}</span>
                <span className="text-lg text-slate-400 font-bold mb-1">/5</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-lg font-semibold text-slate-800">Review History</h3>
            {reviews.map(r => (
              <div key={r._id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CalendarIcon />
                    <h4 className="font-bold text-slate-800">{r.reviewPeriod} Review - {r.year}</h4>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full">
                    Score: {r.overallRating.toFixed(1)}/5
                  </span>
                </div>
                <div className="p-6">
                  <div className="mb-6">
                    <h5 className="font-semibold text-slate-700 text-sm mb-3 flex items-center"><FileText size={16} className="mr-2"/> Manager Comments</h5>
                    <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100 italic">"{r.reviewerComments}"</p>
                    <p className="text-xs text-slate-400 mt-2 text-right">- Reviewed by {r.reviewedBy?.name}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-6 border-t border-slate-100">
                    {['technical', 'teamwork', 'communication', 'leadership', 'delivery'].map(rt => (
                      <div key={rt} className="text-center">
                        <div className="text-sm font-medium text-slate-500 capitalize">{rt.substring(0, 4)}.</div>
                        <div className="text-xl font-bold text-slate-800">{r.ratings[rt]}/5</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const CalendarIcon = () => <Award size={18} className="text-blue-500" />;
