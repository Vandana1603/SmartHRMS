import React, { useState, useEffect, useContext } from 'react';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { Search, Plus, Edit, Trash2 } from 'lucide-react';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import EmptyState from '../../components/ui/EmptyState';
import Modal from '../../components/ui/Modal';
import { AuthContext } from '../../context/AuthContext';

export default function EmployeesPage() {
  const { user } = useContext(AuthContext);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', department: 'Engineering', designation: '', dateOfJoining: '', salary: '', address: '', emergencyContact: ''
  });

  const fetchEmployees = async () => {
    try {
      const res = await api.get('/employees');
      setEmployees(res.data);
    } catch (err) {
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEmployees(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/employees/${editingId}`, formData);
        toast.success('Employee updated successfully');
      } else {
        await api.post('/employees', formData);
        toast.success('Employee created successfully');
      }
      setIsModalOpen(false);
      setEditingId(null);
      fetchEmployees();
    } catch (err) {
      toast.error(editingId ? 'Failed to update employee' : 'Failed to create employee');
    }
  };

  const handleEditClick = (emp) => {
    setEditingId(emp._id);
    setFormData({
      name: emp.name || '',
      email: emp.email || '',
      password: '',
      phone: emp.phone || '',
      department: emp.department || 'Engineering',
      designation: emp.designation || '',
      dateOfJoining: emp.dateOfJoining ? new Date(emp.dateOfJoining).toISOString().split('T')[0] : '',
      salary: emp.salary || '',
      address: emp.address || '',
      emergencyContact: emp.emergencyContact || ''
    });
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingId(null);
    setFormData({
      name: '', email: '', password: '', phone: '', department: 'Engineering', designation: '', dateOfJoining: '', salary: '', address: '', emergencyContact: ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee and their login account?')) {
      try {
        await api.delete(`/employees/${id}`);
        toast.success('Employee deleted');
        fetchEmployees();
      } catch (err) {
        toast.error('Failed to delete employee');
      }
    }
  };

  const isManager = user && user.role === 'senior_manager';

  // Filter employees by manager department if applicable
  const departmentFiltered = isManager 
    ? employees.filter(e => e.department === user.department)
    : employees;

  const filtered = departmentFiltered.filter(e => 
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    e.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSkeleton />;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isManager ? 'My Team Directory' : 'Employees Directory'}
          </h1>
          <p className="text-slate-500">
            {isManager ? "View and oversee your department's team members" : 'Manage all organisation employees'}
          </p>
        </div>
        {!isManager && (
          <button onClick={handleAddClick} className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus size={20} className="mr-2" /> Add Employee
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center bg-slate-50">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search by name or ID..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-slate-400" size={20} />
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="No employees found" description="Try adjusting your search criteria." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Department</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Designation</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                  {!isManager && <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(emp => (
                  <tr key={emp._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                          {emp.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900">{emp.name}</div>
                          <div className="text-sm text-slate-500">{emp.employeeId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">{emp.department}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{emp.designation}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${emp.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {emp.status}
                      </span>
                    </td>
                    {!isManager && (
                      <td className="px-6 py-4 text-right text-sm font-medium space-x-2">
                        <button onClick={() => handleEditClick(emp)} className="text-slate-400 hover:text-blue-600 transition-colors"><Edit size={18} /></button>
                        <button onClick={() => handleDelete(emp._id)} className="text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingId(null); }} title={editingId ? "Edit Employee" : "Add New Employee"}>
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <input required type="text" className="w-full rounded-lg border border-slate-300 p-2" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input required type="email" className="w-full rounded-lg border border-slate-300 p-2" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                {editingId ? 'Password (leave blank to keep current)' : 'Password (default: Employee@123)'}
              </label>
              <input required={!editingId} type="password" placeholder={editingId ? "••••••••" : "Enter password"} className="w-full rounded-lg border border-slate-300 p-2" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
              <input required type="text" className="w-full rounded-lg border border-slate-300 p-2" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
              <select className="w-full rounded-lg border border-slate-300 p-2" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})}>
                {['Engineering', 'HR', 'Finance', 'Marketing', 'Operations'].map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Designation</label>
              <input required type="text" className="w-full rounded-lg border border-slate-300 p-2" value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date of Joining</label>
              <input required type="date" className="w-full rounded-lg border border-slate-300 p-2" value={formData.dateOfJoining} onChange={e => setFormData({...formData, dateOfJoining: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Salary (Annual)</label>
              <input required type="number" className="w-full rounded-lg border border-slate-300 p-2" value={formData.salary} onChange={e => setFormData({...formData, salary: e.target.value})} />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Emergency Contact</label>
              <input type="text" className="w-full rounded-lg border border-slate-300 p-2" value={formData.emergencyContact} onChange={e => setFormData({...formData, emergencyContact: e.target.value})} />
            </div>
          </div>
          <div className="pt-4 flex justify-end space-x-3">
            <button type="button" onClick={() => { setIsModalOpen(false); setEditingId(null); }} className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{editingId ? 'Save Changes' : 'Create'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
