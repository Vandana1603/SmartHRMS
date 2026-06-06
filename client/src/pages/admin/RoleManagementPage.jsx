import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Edit2, Save, X, Shield } from 'lucide-react';
import { toast } from 'react-hot-toast';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';

const ROLES = [
  { value: 'employee', label: 'Employee', color: 'slate' },
  { value: 'senior_manager', label: 'Manager', color: 'blue' },
  { value: 'hr_recruiter', label: 'HR Recruiter', color: 'green' },
  { value: 'admin', label: 'Admin', color: 'red' }
];

export default function RoleManagementPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await api.get('/employees');
      setEmployees(res.data);
    } catch (err) {
      toast.error('Failed to load employees');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (employeeId, currentRole) => {
    setEditing(employeeId);
    setSelectedRole(currentRole || 'employee');
  };

  const handleSave = async (employeeId) => {
    try {
      await api.put(`/employees/${employeeId}`, { role: selectedRole });
      toast.success('Role updated successfully!');
      setEditing(null);
      fetchEmployees();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const handleCancel = () => {
    setEditing(null);
    setSelectedRole('');
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleColor = (role) => {
    const roleObj = ROLES.find(r => r.value === role);
    return roleObj?.color || 'slate';
  };

  const getRoleLabel = (role) => {
    const roleObj = ROLES.find(r => r.value === role);
    return roleObj?.label || role;
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <Shield className="text-red-600 dark:text-red-400" size={32} />
          Role Management
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Assign roles and permissions to employees</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search employees by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Role Management Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Employee</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900 dark:text-white">Current Role</th>
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
                          value={selectedRole}
                          onChange={(e) => setSelectedRole(e.target.value)}
                          className="px-3 py-2 border border-blue-300 dark:border-blue-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                        >
                          {ROLES.map((role) => (
                            <option key={role.value} value={role.value}>
                              {role.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold bg-${getRoleColor(emp.role)}-100 dark:bg-${getRoleColor(emp.role)}-900/30 text-${getRoleColor(emp.role)}-700 dark:text-${getRoleColor(emp.role)}-300`}>
                          {getRoleLabel(emp.role)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editing === emp._id ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSave(emp._id)}
                            className="p-2 bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 text-white rounded-lg transition-colors"
                            title="Save"
                          >
                            <Save size={18} />
                          </button>
                          <button
                            onClick={handleCancel}
                            className="p-2 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white rounded-lg transition-colors"
                            title="Cancel"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEdit(emp._id, emp.role)}
                          className="p-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg transition-colors"
                          title="Edit Role"
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

      {/* Role Legend */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Role Permissions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600">
            <h4 className="font-semibold text-slate-900 dark:text-white mb-2">Employee</h4>
            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
              <li>✓ View own profile</li>
              <li>✓ Check attendance</li>
              <li>✓ View payslips</li>
            </ul>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Manager</h4>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>✓ Employee access</li>
              <li>✓ Manage team</li>
              <li>✓ Review performance</li>
            </ul>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700">
            <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">HR Recruiter</h4>
            <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
              <li>✓ Screen resumes</li>
              <li>✓ Schedule interviews</li>
              <li>✓ Onboarding</li>
            </ul>
          </div>
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700">
            <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">Admin</h4>
            <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
              <li>✓ Full access</li>
              <li>✓ Manage all</li>
              <li>✓ Analytics</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
