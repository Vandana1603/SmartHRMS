import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { Download, FileText, Banknote, Calendar } from 'lucide-react';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import Modal from '../../components/ui/Modal';

export default function PayslipPage() {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlip, setSelectedSlip] = useState(null);

  useEffect(() => {
    const fetchPayroll = async () => {
      try {
        const res = await api.get('/payroll/my');
        setPayrolls(res.data);
      } catch(err) {
        toast.error('Failed to load payslips');
      } finally {
        setLoading(false);
      }
    };
    fetchPayroll();
  }, []);

  const formatMoney = (amount) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Payslips</h1>
        <p className="text-slate-500">View and download your monthly salary slips.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {payrolls.map(pay => (
          <div key={pay._id} onClick={() => setSelectedSlip(pay)} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-4 -mt-4 opacity-50 z-0 group-hover:scale-110 transition-transform"></div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="text-slate-500 text-sm font-medium flex items-center">
                  <Calendar size={16} className="mr-1" />
                  {new Date(pay.year, pay.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
                </p>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-slate-900">{formatMoney(pay.netSalary)}</p>
                  <p className="text-xs text-slate-500 mt-1">Net Salary</p>
                </div>
              </div>
              <div className={`p-2 rounded-lg ${pay.status==='paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                <Banknote size={24} />
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center relative z-10">
              <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${pay.status==='paid' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                {pay.status.toUpperCase()}
              </span>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                View Details
              </button>
            </div>
          </div>
        ))}
        {payrolls.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 flex flex-col items-center justify-center bg-white border border-dashed rounded-xl border-slate-200">
            <FileText size={48} className="text-slate-300 mb-4" />
            <p className="text-lg font-medium text-slate-800">No Payslips Available</p>
            <p className="text-sm">Your payslips will appear here once generated.</p>
          </div>
        )}
      </div>

      <Modal isOpen={!!selectedSlip} onClose={() => setSelectedSlip(null)} title="Salary Slip" maxWidth="max-w-xl">
        {selectedSlip && (
          <div className="bg-white p-2">
            <div className="text-center pb-6 border-b border-slate-200 mb-6">
              <h2 className="text-2xl font-bold text-slate-900">SmartHR Inc.</h2>
              <p className="text-slate-500">Payslip for the month of {new Date(selectedSlip.year, selectedSlip.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between p-3 bg-slate-50 rounded-lg">
                <span className="font-medium text-slate-700">Earnings</span>
                <span className="font-bold text-slate-900">Amount</span>
              </div>
              
              <div className="flex justify-between px-3 text-sm">
                <span className="text-slate-600">Basic Salary</span>
                <span className="text-slate-900">{formatMoney(selectedSlip.basicSalary)}</span>
              </div>
              <div className="flex justify-between px-3 text-sm">
                <span className="text-slate-600">Allowances</span>
                <span className="text-green-600">+{formatMoney(selectedSlip.allowances)}</span>
              </div>
              <div className="flex justify-between px-3 text-sm">
                <span className="text-slate-600">Deductions (Tax, PF)</span>
                <span className="text-red-600">-{formatMoney(selectedSlip.deductions)}</span>
              </div>
              
              <div className="border-t border-slate-200 mt-6 pt-4 flex justify-between px-3 bg-blue-50 p-4 rounded-lg">
                <span className="font-bold text-blue-900">Net Salary (Transferable)</span>
                <span className="font-bold text-xl text-blue-700">{formatMoney(selectedSlip.netSalary)}</span>
              </div>
              
              <div className="flex justify-between items-center mt-8 pt-4">
                <span className={`text-sm px-3 py-1 rounded-full font-medium ${selectedSlip.status==='paid' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                  Status: {selectedSlip.status.toUpperCase()}
                </span>
                <button className="flex items-center px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 text-sm font-medium">
                  <Download size={16} className="mr-2" /> Download PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
