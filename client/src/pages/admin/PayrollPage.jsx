import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { DollarSign, CheckCircle, RefreshCcw, FileText } from 'lucide-react';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';

export default function PayrollPage() {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const fetchPayroll = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/payroll/all?month=${month}&year=${year}`);
      setPayrolls(res.data);
    } catch(err) {
      toast.error('Failed to load payroll');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPayroll(); }, [month, year]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await api.post('/payroll/generate', { month, year });
      toast.success(res.data.message);
      fetchPayroll();
    } catch(err) {
      toast.error(err.response?.data?.message || 'Failed to generate payroll');
    } finally {
      setGenerating(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/payroll/${id}/status`, { status });
      toast.success('Status updated');
      fetchPayroll();
    } catch(err) {
      toast.error('Failed to update status');
    }
  };

  const formatMoney = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  if (loading && payrolls.length === 0) return <LoadingSkeleton />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payroll Management</h1>
          <p className="text-slate-500">Generate and process monthly payroll.</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-end justify-between">
        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Month</label>
            <select value={month} onChange={e => setMonth(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 outline-none w-32">
              {Array.from({length: 12}, (_, i) => i + 1).map(m => (
                <option key={m} value={m}>{new Date(2000, m - 1).toLocaleString('default', { month: 'long' })}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Year</label>
            <select value={year} onChange={e => setYear(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 outline-none w-32">
              {[2023, 2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>
        <button 
          onClick={handleGenerate} 
          disabled={generating}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {generating ? <RefreshCcw className="animate-spin mr-2" size={18} /> : <DollarSign size={18} className="mr-2" />}
          Generate Payroll
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Employee</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Basic</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Allowances</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Deductions</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Net Salary</th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payrolls.map(pay => (
                <tr key={pay._id} className="hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-slate-900">{pay.employeeId?.name}</div>
                    <div className="text-xs text-slate-500">{pay.employeeId?.employeeId} | {pay.employeeId?.department}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900">{formatMoney(pay.basicSalary)}</td>
                  <td className="px-6 py-4 text-sm text-green-600">+{formatMoney(pay.allowances)}</td>
                  <td className="px-6 py-4 text-sm text-red-600">-{formatMoney(pay.deductions)}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">{formatMoney(pay.netSalary)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${pay.status === 'paid' ? 'bg-green-100 text-green-800' : 
                        pay.status === 'processed' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {pay.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    {pay.status === 'pending' && (
                      <button onClick={() => updateStatus(pay._id, 'processed')} className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded-md transition-colors">Process</button>
                    )}
                    {pay.status === 'processed' && (
                      <button onClick={() => updateStatus(pay._id, 'paid')} className="text-green-600 hover:text-green-900 bg-green-50 px-3 py-1 rounded-md transition-colors">Mark Paid</button>
                    )}
                    {pay.status === 'paid' && (
                      <span className="text-slate-400 flex items-center justify-end"><CheckCircle size={16} className="mr-1"/> Done</span>
                    )}
                  </td>
                </tr>
              ))}
              {payrolls.length === 0 && (
                <tr><td colSpan="7" className="px-6 py-12 text-center text-slate-500 flex flex-col items-center">
                  <FileText size={48} className="text-slate-300 mb-4" />
                  <p>No payroll generated for this period.</p>
                  <p className="text-sm mt-1">Click "Generate Payroll" to process active employees.</p>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
