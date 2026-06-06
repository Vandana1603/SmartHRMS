import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { Sparkles, Calendar, BookOpen, CheckCircle, Circle, RefreshCcw } from 'lucide-react';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';

export default function OnboardingPage() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmp, setSelectedEmp] = useState('');
  const [onboardings, setOnboardings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchData = async () => {
    try {
      const empRes = await api.get('/employees');
      setEmployees(empRes.data.filter(e => e.status === 'active'));
      if(empRes.data.length > 0) setSelectedEmp(empRes.data[0]._id);
      
      const onbRes = await api.get('/onboarding/all');
      setOnboardings(onbRes.data);
    } catch(err) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleGenerate = async () => {
    const emp = employees.find(e => e._id === selectedEmp);
    if(!emp) return;
    setGenerating(true);
    try {
      await api.post('/onboarding/generate', {
        employeeId: emp._id,
        department: emp.department,
        designation: emp.designation,
        skills: ['JavaScript', 'React', 'Node.js'] 
      });
      toast.success('Onboarding Plan automatically created via AI!');
      fetchData();
    } catch(err) {
      toast.error('Plan generation failed');
    } finally {
      setGenerating(false);
    }
  };

  const handleMarkComplete = async (onboardingId, taskId) => {
    try {
      await api.put(`/onboarding/${onboardingId}/task/${taskId}/complete`);
      fetchData();
    } catch(err) {
      toast.error('Update failed');
    }
  };

  if (loading) return <LoadingSkeleton />;

  const currentView = onboardings.find(o => o.employeeId?._id === selectedEmp) || null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">AI Onboarding Journeys</h1>
          <p className="text-slate-500">Automatically generate 4-week tailored onboarding plans.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 mb-1">Select Employee</label>
          <select value={selectedEmp} onChange={e => setSelectedEmp(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2.5 outline-none max-w-sm">
            {employees.map(e => <option key={e._id} value={e._id}>{e.name} ({e.designation})</option>)}
          </select>
        </div>
        {!currentView && (
          <button onClick={handleGenerate} disabled={generating} className="flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            {generating ? <RefreshCcw className="animate-spin mr-2" size={20} /> : <Sparkles className="mr-2" size={20} />}
            Generate AI Plan
          </button>
        )}
      </div>

      {currentView ? (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-900">{currentView.employeeId?.name}'s Journey</h2>
              <p className="text-slate-500">{currentView.designation} • {currentView.department}</p>
            </div>
            <div className="w-full sm:w-1/3">
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-slate-700">Overall Progress</span>
                <span className="font-bold text-blue-600">{currentView.overallProgress}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 max-w-sm mb-1 overflow-hidden border border-slate-200">
                <div className="bg-blue-600 h-3 rounded-full transition-all duration-500" style={{ width: `${currentView.overallProgress}%` }}></div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full inline-block ${currentView.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                {currentView.status.replace('-', ' ').toUpperCase()}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {currentView.plan.map((weekData) => {
              const weekProgress = currentView.progress.find(p => p.taskId === weekData.taskId);
              const isCompleted = weekProgress?.completed;

              return (
                <div key={weekData.taskId} className={`bg-white rounded-xl shadow-sm border transition-all ${isCompleted ? 'border-green-200 ring-1 ring-green-100' : 'border-slate-200 hover:border-blue-300'}`}>
                  <div className={`p-4 border-b flex justify-between items-center ${isCompleted ? 'bg-green-50' : 'bg-slate-50' } rounded-t-xl`}>
                    <div className="flex items-center space-x-2">
                      <Calendar size={18} className={isCompleted ? 'text-green-600' : 'text-slate-400'} />
                      <h4 className="font-bold text-slate-800">Week {weekData.week}</h4>
                    </div>
                    {isCompleted ? <CheckCircle size={24} className="text-green-500" /> : <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">Pending</div>}
                  </div>
                  <div className="p-5 space-y-4">
                    <div>
                      <h5 className="font-semibold text-slate-900 mb-2">{weekData.title}</h5>
                      <ul className="space-y-2">
                        {weekData.tasks.map((task, i) => (
                          <li key={i} className="flex gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded border border-slate-100"><Circle size={14} className="text-slate-300 mt-0.5 shrink-0" /> {task}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h6 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center"><BookOpen size={12} className="mr-1"/> Resources</h6>
                      <ul className="space-y-1">
                        {weekData.resources.map((res, i) => (
                          <li key={i} className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded inline-block mr-1 mb-1">{res}</li>
                        ))}
                      </ul>
                    </div>
                    
                    {!isCompleted && (
                      <button 
                        onClick={() => handleMarkComplete(currentView._id, weekData.taskId)}
                        className="w-full mt-4 py-2 border-2 border-slate-200 text-slate-600 rounded-lg hover:border-green-500 hover:bg-green-50 hover:text-green-700 transition-colors text-sm font-medium"
                      >
                        Mark Week Complete
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white p-12 rounded-xl border border-slate-200 border-dashed flex flex-col items-center justify-center text-center shadow-sm">
          <Sparkles size={64} className="text-blue-200 mb-4" />
          <h3 className="text-xl font-bold text-slate-800 mb-2">No Plan Found</h3>
          <p className="text-slate-500 max-w-md">This employee currently doesn't have an onboarding plan. Click generate above to instantly create a tailored 4-week AI induction journey.</p>
        </div>
      )}
    </div>
  );
}
