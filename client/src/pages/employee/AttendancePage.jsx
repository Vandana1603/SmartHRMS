import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { Clock, Calendar as CalendarIcon, CheckCircle, XCircle } from 'lucide-react';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';

export default function AttendancePage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/attendance/my?month=${month}&year=${year}`);
      setRecords(res.data);
    } catch(err) {
      toast.error('Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRecords(); }, [month, year]);

  if (loading && records.length === 0) return <LoadingSkeleton />;

  const presentDays = records.filter(r => r.status === 'present').length;
  const absentDays = records.filter(r => r.status === 'absent').length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Attendance</h1>
          <p className="text-slate-500">View your monthly attendance logs.</p>
        </div>
        <div className="flex gap-2">
          <select value={month} onChange={e => setMonth(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500">
            {Array.from({length: 12}, (_, i) => i + 1).map(m => (
              <option key={m} value={m}>{new Date(2000, m - 1).toLocaleString('default', { month: 'long' })}</option>
            ))}
          </select>
          <select value={year} onChange={e => setYear(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500">
            {[2023, 2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-sm font-medium text-slate-500 uppercase">Total Days</p>
          <p className="text-2xl font-bold text-slate-900">{records.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-center">
          <p className="text-sm font-medium text-green-800 uppercase">Present</p>
          <p className="text-2xl font-bold text-green-600">{presentDays}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-center">
          <p className="text-sm font-medium text-red-800 uppercase">Absent</p>
          <p className="text-2xl font-bold text-red-600">{absentDays}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-center">
          <p className="text-sm font-medium text-blue-800 uppercase">Leaves</p>
          <p className="text-2xl font-bold text-blue-600">{records.filter(r => r.status === 'leave').length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Punch In</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Punch Out</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Total Hours</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map(record => (
                <tr key={record._id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <CalendarIcon size={16} className="text-slate-400 mr-2" />
                      <span className="text-sm font-medium text-slate-900">{new Date(record.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric'})}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">{record.checkIn || '--:--'}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{record.checkOut || '--:--'}</td>
                  <td className="px-6 py-4 text-sm text-slate-900 font-medium">{record.hoursWorked ? `${record.hoursWorked} hrs` : '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${record.status === 'present' ? 'bg-green-100 text-green-800' : 
                        record.status === 'absent' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {record.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-500">No attendance records found for this month.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
