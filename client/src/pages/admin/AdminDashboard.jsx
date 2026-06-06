import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import StatCard from '../../components/ui/StatCard';
import LoadingSkeleton from '../../components/ui/LoadingSkeleton';
import { Users, UserCheck, Clock, FileText, CheckCircle, Search, Settings, Shield } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/analytics/dashboard');
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <LoadingSkeleton />;
  if (!data) return <div>Error loading data</div>;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-slate-500">Overview of the entire organisation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Employees" value={data.totalEmployees} icon={<Users size={24} className="text-blue-600" />} colorClass="bg-blue-50" />
        <StatCard title="Present Today" value={data.presentToday} icon={<UserCheck size={24} className="text-green-600" />} colorClass="bg-green-50" />
        <StatCard title="Pending Payroll" value={data.pendingPayroll} icon={<FileText size={24} className="text-amber-600" />} colorClass="bg-amber-50" />
        <StatCard title="Active Onboarding" value={data.onboardingActive} icon={<CheckCircle size={24} className="text-purple-600" />} colorClass="bg-purple-50" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <Link to="/admin/employees" className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <Users className="text-blue-600 dark:text-blue-400" size={32} />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">Manage Employees</h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">View and manage all employees</p>
            </div>
          </div>
        </Link>
        <Link to="/admin/teams" className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <Settings className="text-purple-600 dark:text-purple-400" size={32} />
            <div>
              <h3 className="font-semibold text-purple-900 dark:text-purple-100">Team Allocation</h3>
              <p className="text-sm text-purple-700 dark:text-purple-300">Assign managers to employees</p>
            </div>
          </div>
        </Link>
        <Link to="/admin/roles" className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl p-6 border border-red-200 dark:border-red-700 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <Shield className="text-red-600 dark:text-red-400" size={32} />
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-100">Role Management</h3>
              <p className="text-sm text-red-700 dark:text-red-300">Assign user roles & permissions</p>
            </div>
          </div>
        </Link>
        <Link to="/admin/attendance" className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-700 hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <Clock className="text-green-600 dark:text-green-400" size={32} />
            <div>
              <h3 className="font-semibold text-green-900 dark:text-green-100">Attendance Reports</h3>
              <p className="text-sm text-green-700 dark:text-green-300">View attendance analytics</p>
            </div>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Department Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.departmentWiseCount}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="dept"
                  label
                >
                  {data.departmentWiseCount.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Attendance (Last 7 Days)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.attendanceLast7Days.reverse()}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
                <Tooltip cursor={{fill: '#F1F5F9'}} />
                <Bar dataKey="present" name="Present" fill="#10B981" radius={[4, 4, 0, 0]} barSize={32} />
                <Bar dataKey="absent" name="Absent" fill="#EF4444" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
