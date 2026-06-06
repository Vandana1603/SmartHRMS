import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { Download, Filter, Search } from 'lucide-react';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';

export default function AttendanceReportPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ startDate: '', endDate: '', department: '' });

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (filter.startDate) query.append('startDate', filter.startDate);
      if (filter.endDate) query.append('endDate', filter.endDate);
      if (filter.department) query.append('department', filter.department);
      
      const res = await api.get(`/attendance/report?${query.toString()}`);
      setRecords(res.data);
    } catch(err) {
      toast.error('Failed to load attendance report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    setFilter(f => ({
      ...f,
      startDate: firstDay.toISOString().split('T')[0],
      endDate: today.toISOString().split('T')[0]
    }));
  }, []);

  useEffect(() => {
    if (filter.startDate && filter.endDate) {
      fetchRecords();
    }
  }, [filter.startDate, filter.endDate, filter.department]);

  if (loading && records.length === 0) return <LoadingSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Attendance Report</h1>
          <p className="text-slate-500">View and export employee attendance logs.</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
          <Download size={18} className="mr-2" /> Export CSV
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
          <input type="date" value={filter.startDate} onChange={(e) => setFilter({...filter, startDate: e.target.value})} className="border border-slate-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
          <input type="date" value={filter.endDate} onChange={(e) => setFilter({...filter, endDate: e.target.value})} className="border border-slate-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
          <select value={filter.department} onChange={(e) => setFilter({...filter, department: e.target.value})} className="border border-slate-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none bg-white min-w-[200px]">
            <option value="">All Departments</option>
            {['Engineering', 'HR', 'Finance', 'Marketing', 'Operations'].map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Employee</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Check In</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Check Out</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Hours Worked</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map(record => (
                <tr key={record._id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm text-slate-900">{new Date(record.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-900">{record.employeeId?.name || 'Unknown'}</div>
                    <div className="text-sm text-slate-500">{record.employeeId?.department}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700">{record.checkIn || '-'}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{record.checkOut || '-'}</td>
                  <td className="px-6 py-4 text-sm text-slate-700">{record.hoursWorked ? `${record.hoursWorked} hrs` : '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${record.status === 'present' ? 'bg-green-100 text-green-800' : 
                        record.status === 'absent' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
              {records.length === 0 && (
                <tr><td colSpan="6" className="px-6 py-10 text-center text-slate-500">No attendance records found for this period.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
