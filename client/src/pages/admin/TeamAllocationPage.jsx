import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Users, Edit2, Save, X, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';

export default function TeamAllocationPage() {
  const [employees, setEmployees] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [selectedManager, setSelectedManager] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const empRes = await api.get('/employees');
      const managerRes = await api.get('/employees?role=senior_manager');
      setEmployees(empRes.data);
      setManagers(managerRes.data);
    } catch (err) {
      toast.error('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (employeeId, currentManagerId) => {
    setEditing(employeeId);
    setSelectedManager(currentManagerId || '');
  };

  const handleSave = async (employeeId) => {
    try {
      await api.put(`/employees/${employeeId}`, { managerId: selectedManager || null });
      toast.success('Team allocation updated!');
      setEditing(null);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setSelectedManager('');
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <Users className="text-blue-600 dark:text-blue-400" size={32} />
          Team Allocation
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage manager assignments for employees</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
        <input
          type="text"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Team Allocation Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Employee Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Current Manager</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <tr key={emp._id} className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600 dark:text-blue-300">
                            {emp.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-slate-900 dark:text-white">{emp.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300 text-sm">{emp.email}</td>
                    <td className="px-6 py-4">
                      {editing === emp._id ? (
                        <select
                          value={selectedManager}
                          onChange={(e) => setSelectedManager(e.target.value)}
                          className="px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                        >
                          <option value="">Unassigned</option>
                          {managers.map((m) => (
                            <option key={m._id} value={m._id}>
                              {m.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div>
                          <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                            emp.managerId
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                              : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                          }`}>
                            {emp.managerId
                              ? managers.find(m => m._id === emp.managerId)?.name || 'Unknown'
                              : 'Unassigned'}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editing === emp._id ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSave(emp._id)}
                            className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                            title="Save"
                          >
                            <Save size={18} />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                            title="Cancel"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEdit(emp._id, emp.managerId)}
                          className="p-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                    No employees found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
          <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Employees</h3>
          <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-2">{employees.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl p-6 border border-green-200 dark:border-green-700">
          <h3 className="text-sm font-medium text-green-700 dark:text-green-300">Assigned</h3>
          <p className="text-3xl font-bold text-green-900 dark:text-green-100 mt-2">{employees.filter(e => e.managerId).length}</p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/30 rounded-xl p-6 border border-amber-200 dark:border-amber-700">
          <h3 className="text-sm font-medium text-amber-700 dark:text-amber-300">Unassigned</h3>
          <p className="text-3xl font-bold text-amber-900 dark:text-amber-100 mt-2">{employees.filter(e => !e.managerId).length}</p>
        </div>
      </div>
    </div>
  );
}
