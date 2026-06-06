import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { Mic, Zap, CheckCircle, Video, FileText, Loader2 } from 'lucide-react';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';

export default function InterviewPage() {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [transcript, setTranscript] = useState('');
  const [generatingQs, setGeneratingQs] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  useEffect(() => {
    const fetchShortlisted = async () => {
      try {
        const res = await api.get('/resume/candidates?status=shortlisted');
        setCandidates(res.data);
        if(res.data.length > 0) setSelectedCandidate(res.data[0]._id);
      } catch(err) {
        toast.error('Failed to load candidates');
      } finally {
        setLoading(false);
      }
    };
    fetchShortlisted();
  }, []);

  const handleGenQuestions = async () => {
    const candidate = candidates.find(c => c._id === selectedCandidate);
    if(!candidate) return;
    setGeneratingQs(true);
    try {
      const res = await api.post('/interview/generate-questions', {
        jobRole: candidate.jobRole,
        jobDescription: 'Senior role requiring excellent technical skills.'
      });
      setQuestions(res.data.questions);
      toast.success('Questions AI Generated');
    } catch(err) {
      toast.error('Failed to generate questions');
    } finally {
      setGeneratingQs(false);
    }
  };

  const handleAnalysiys = async () => {
    if(!transcript || questions.length === 0) return toast.error('Requires transcript and generated questions');
    const candidate = candidates.find(c => c._id === selectedCandidate);
    setAnalyzing(true);
    try {
      const res = await api.post('/interview/analyse', {
        candidateId: candidate._id,
        transcript,
        jobRole: candidate.jobRole,
        questions
      });
      setAnalysisResult(res.data);
      toast.success('Interview Analysed!');
    } catch(err) {
      toast.error('Analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">AI Interview Analysis</h1>
          <p className="text-slate-500">Generate context-aware questions and analyze transcript instantly.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Select Shortlisted Candidate</label>
            <select value={selectedCandidate} onChange={e => {setSelectedCandidate(e.target.value); setQuestions([]); setAnalysisResult(null); setTranscript('');}} className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50">
              {candidates.map(c => <option key={c._id} value={c._id}>{c.name} - {c.jobRole}</option>)}
            </select>
            {candidates.length === 0 && <p className="text-red-500 text-sm mt-1">No shortlisted candidates available. Screen resumes first.</p>}
          </div>

          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center">
              <h4 className="font-semibold text-slate-800 flex items-center"><FileText size={18} className="mr-2 text-blue-600"/> Interview Questions</h4>
              <button onClick={handleGenQuestions} disabled={generatingQs || !selectedCandidate} className="px-3 py-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md text-sm font-medium flex items-center transition-colors">
                {generatingQs ? <Loader2 size={16} className="animate-spin mr-1"/> : <Zap size={16} className="mr-1"/>} Generate
              </button>
            </div>
            <div className="p-4 bg-white min-h-[150px]">
              {questions.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm">Click generate to let AI create questions.</div>
              ) : (
                <ul className="space-y-2">
                  {questions.map((q, idx) => (
                    <li key={idx} className="flex gap-2 text-sm text-slate-700">
                      <span className="font-bold text-slate-400">{idx+1}.</span> <span>{q}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div>
            <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
              <Mic size={18} className="mr-2 text-red-500"/> Paste Transcript
            </label>
            <textarea 
              value={transcript} 
              onChange={e => setTranscript(e.target.value)} 
              className="w-full border border-slate-300 rounded-lg p-3 h-48 focus:ring-2 focus:ring-red-500 outline-none" 
              placeholder="Speaker 1: Hi, let's start...&#10;Candidate: Sure!" 
            />
          </div>

          <button 
            onClick={handleAnalysiys}
            disabled={analyzing || !transcript || questions.length===0}
            className="w-full py-3 bg-slate-900 text-white rounded-lg flex items-center justify-center font-medium hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            {analyzing ? <Loader2 className="animate-spin mr-2" size={20}/> : <Video className="mr-2" size={20}/>}
            Analyze Interview Details
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="bg-slate-50 p-4 border-b border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800">AI Verdict</h3>
          </div>
          <div className="p-6 flex-1 bg-white">
            {!analysisResult ? (
              <div className="h-full min-h-[300px] flex flex-col justify-center items-center text-slate-400">
                <CheckCircle size={48} className="text-slate-200 mb-4" />
                <p>Submit transcript to get AI insights.</p>
              </div>
            ) : (
              <div className="animate-fade-in space-y-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900">{analysisResult.overallScore}%</h2>
                    <p className="text-slate-500">Overall Score</p>
                  </div>
                  <span className={`px-4 py-2 rounded-lg font-bold border ${
                    analysisResult.verdict === 'Strong Hire' ? 'bg-green-50 text-green-700 border-green-200' :
                    analysisResult.verdict === 'No Hire' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-blue-50 text-blue-700 border-blue-200'
                  }`}>
                    {analysisResult.verdict}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                    <div className="text-xl font-bold text-slate-800">{analysisResult.clarityScore}</div>
                    <div className="text-xs text-slate-500 uppercase">Clarity</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                    <div className="text-xl font-bold text-slate-800">{analysisResult.confidenceScore}</div>
                    <div className="text-xs text-slate-500 uppercase">Confidence</div>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                    <div className="text-xl font-bold text-slate-800">{analysisResult.relevanceScore}</div>
                    <div className="text-xs text-slate-500 uppercase">Relevance</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-slate-800 mb-2">Detailed Feedback</h4>
                  <p className="text-sm text-slate-600 leading-relaxed bg-blue-50/50 p-4 rounded-lg border border-blue-100">{analysisResult.detailedFeedback}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2 flex items-center"><CheckCircle size={16} className="mr-1"/> Strengths</h4>
                    <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
                      {analysisResult.strengths.map(s => <li key={s}>{s}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-red-700 mb-2 flex items-center"><CheckCircle size={16} className="mr-1"/> Improvements</h4>
                    <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
                      {analysisResult.improvements.map(s => <li key={s}>{s}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
