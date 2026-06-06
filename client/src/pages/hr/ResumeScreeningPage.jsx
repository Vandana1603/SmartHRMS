import React, { useState, useCallback, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { UploadCloud, CheckCircle, XCircle, ChevronRight, Loader2, Award, Zap } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import EmptyState from '../../components/ui/EmptyState';

export default function ResumeScreeningPage() {
  const [jobRole, setJobRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [files, setFiles] = useState([]);
  const [isScreening, setIsScreening] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      const res = await api.get('/resume/candidates');
      setCandidates(res.data);
    } catch(err) {
      toast.error('Failed to fetch candidates');
    }
  };

  const onFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleScreening = async () => {
    if (!jobRole || !jobDescription || files.length === 0) {
      return toast.error('Please fill all fields and upload PDFs.');
    }
    
    setIsScreening(true);
    const formData = new FormData();
    formData.append('jobRole', jobRole);
    formData.append('jobDescription', jobDescription);
    files.forEach(f => formData.append('resumes', f));

    try {
      await api.post('/resume/screen-bulk', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Resumes screened successfully!');
      setFiles([]);
      fetchCandidates();
    } catch(err) {
      toast.error(err.response?.data?.message || 'Error parsing resumes');
    } finally {
      setIsScreening(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/resume/candidates/${id}/status`, { status });
      toast.success('Status updated');
      setSelectedCandidate(null);
      fetchCandidates();
    } catch(err) {
      toast.error('Status update failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">AI Resume Screening</h1>
          <p className="text-slate-500">Upload resumes and let AI evaluate them against the Job Description.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">New Screening Task</h3>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Job Role</label>
            <input type="text" value={jobRole} onChange={e => setJobRole(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Senior Frontend Developer" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Job Description</label>
            <textarea value={jobDescription} onChange={e => setJobDescription(e.target.value)} className="w-full border border-slate-300 rounded-lg p-2 h-32 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Paste JD here..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Upload Resumes (PDF)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-lg bg-slate-50 relative hover:bg-slate-100 transition-colors">
              <div className="space-y-1 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-slate-400" />
                <div className="flex text-sm text-slate-600 justify-center">
                  <span className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500 p-1">
                    <span>Upload files</span>
                    <input type="file" multiple accept=".pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={onFileChange} />
                  </span>
                </div>
                <p className="text-xs text-slate-500">Up to 10 PDFs</p>
              </div>
            </div>
            {files.length > 0 && <p className="text-sm text-green-600 mt-2 font-medium">{files.length} files selected</p>}
          </div>
          <button 
            onClick={handleScreening} 
            disabled={isScreening}
            className="w-full flex justify-center items-center px-4 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50 font-medium"
          >
            {isScreening ? <><Loader2 className="animate-spin mr-2" size={18} /> Analyzing with AI...</> : <><Zap size={18} className="mr-2" /> Screen with AI</>}
          </button>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-200 bg-slate-50">
            <h3 className="text-lg font-semibold text-slate-800">Screening Results</h3>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[600px]">
            {candidates.length === 0 ? (
              <EmptyState title="No candidates yet" description="Start by uploading resumes on the left." icon={<Award size={48}/>} />
            ) : (
              <ul className="divide-y divide-slate-100">
                {candidates.map((c, i) => (
                  <li key={c._id} className="hover:bg-slate-50 cursor-pointer p-4 transition-colors flex items-center justify-between" onClick={() => setSelectedCandidate(c)}>
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600 border border-slate-200">
                        #{i+1}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{c.name || c.resumeFileName}</p>
                        <p className="text-xs text-slate-500">{c.jobRole} • {c.yearsOfExperience} yrs exp</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-slate-500 uppercase tracking-wider">Score</span>
                          <span className="text-lg font-bold text-blue-600">{c.overallScore}%</span>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                          c.recommendation.includes('Strongly') ? 'bg-green-100 text-green-800' :
                          c.recommendation.includes('Not') ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {c.recommendation}
                        </span>
                      </div>
                      <ChevronRight size={20} className="text-slate-400" />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={!!selectedCandidate} onClose={() => setSelectedCandidate(null)} title="AI Candidate Analysis" maxWidth="max-w-4xl">
        {selectedCandidate && (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{selectedCandidate.name}</h2>
                <p className="text-slate-500">{selectedCandidate.email} • {selectedCandidate.phone}</p>
              </div>
              <div className={`px-4 py-2 rounded-lg font-bold text-lg border ${
                selectedCandidate.status === 'shortlisted' ? 'bg-green-50 text-green-700 border-green-200' :
                selectedCandidate.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-slate-50 text-slate-700 border-slate-200'
              }`}>
                Status: {selectedCandidate.status.toUpperCase()}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
                <p className="text-sm font-medium text-blue-800 mb-1">Overall Score</p>
                <p className="text-3xl font-bold text-blue-600">{selectedCandidate.overallScore}%</p>
              </div>
              <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 text-center">
                <p className="text-sm font-medium text-indigo-800 mb-1">Technical Fit</p>
                <p className="text-3xl font-bold text-indigo-600">{selectedCandidate.technicalScore}%</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 text-center">
                <p className="text-sm font-medium text-purple-800 mb-1">Communication</p>
                <p className="text-3xl font-bold text-purple-600">{selectedCandidate.communicationScore}%</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-slate-800 mb-2 border-b pb-1">AI Feedback</h4>
              <p className="text-slate-700 text-sm leading-relaxed">{selectedCandidate.aiFeedback}</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-slate-800 mb-2 border-b pb-1">Skills Matched</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCandidate.skillsMatched.map(s => <span key={s} className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-md">{s}</span>)}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 mb-2 border-b pb-1">Missing Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCandidate.skillsMissing.map(s => <span key={s} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-md">{s}</span>)}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200 mt-6">
              <button onClick={() => updateStatus(selectedCandidate._id, 'rejected')} className="px-6 py-2 border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-medium transition-colors">
                Reject
              </button>
              <button onClick={() => updateStatus(selectedCandidate._id, 'shortlisted')} className="px-6 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg font-medium transition-colors">
                Shortlist Candidate
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
