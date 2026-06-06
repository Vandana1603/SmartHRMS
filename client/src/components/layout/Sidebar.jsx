import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { LayoutDashboard, Users, Clock, FileText, BarChart2, UserCheck, Inbox, Award, LogOut, CheckCircle } from 'lucide-react';

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const { user, logout } = useContext(AuthContext);

  if (!user) return null;

  const roleColors = {
    admin: 'bg-red-100 text-red-800',
    manager: 'bg-blue-100 text-blue-800',
    hr: 'bg-green-100 text-green-800',
    employee: 'bg-gray-100 text-gray-800'
  };

  const getLinks = () => {
    switch (user.role) {
      case 'admin':
        return [
          { to: '/admin', icon: <LayoutDashboard />, label: 'Dashboard' },
          { to: '/admin/employees', icon: <Users />, label: 'Employees' },
          { to: '/admin/attendance', icon: <Clock />, label: 'Attendance' },
          { to: '/admin/payroll', icon: <FileText />, label: 'Payroll' },
          { to: '/admin/performance', icon: <BarChart2 />, label: 'Performance' },
        ];
      case 'senior_manager':
        return [
          { to: '/manager', icon: <LayoutDashboard />, label: 'Dashboard' },
          { to: '/admin/employees', icon: <Users />, label: 'Team' },
          { to: '/admin/performance', icon: <BarChart2 />, label: 'Reviews' },
        ];
      case 'hr_recruiter':
        return [
          { to: '/hr', icon: <LayoutDashboard />, label: 'Dashboard' },
          { to: '/hr/resume', icon: <Inbox />, label: 'Resume Screening' },
          { to: '/hr/interview', icon: <UserCheck />, label: 'Interviews' },
          { to: '/hr/onboarding', icon: <CheckCircle />, label: 'Onboarding' },
        ];
      default:
        return [
          { to: '/employee', icon: <LayoutDashboard />, label: 'Dashboard' },
          { to: '/employee/profile', icon: <UserCheck />, label: 'My Profile' },
          { to: '/employee/attendance', icon: <Clock />, label: 'Attendance' },
          { to: '/employee/payslip', icon: <FileText />, label: 'Payslips' },
          { to: '/employee/performance', icon: <Award />, label: 'Performance' },
        ];
    }
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-slate-900 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setSidebarOpen(false)}
      />
      <div id="sidebar" className={`flex flex-col absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 h-screen overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 lg:w-72 lg:sidebar-expanded:!w-72 2xl:!w-72 shrink-0 bg-slate-900 transition-all duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-64'}`}>
        <div className="flex justify-between items-center pr-3 sm:px-6 py-6 border-b border-slate-700">
          <div className="flex items-center">
            <span className="text-white text-2xl font-bold ml-2">SmartHR</span>
          </div>
        </div>
        <div className="space-y-8 mt-6 px-4">
          <ul className="mt-3 space-y-2">
            {getLinks().map((link) => (
              <li key={link.to} className="px-3 py-2 rounded-sm mb-0.5 last:mb-0">
                <NavLink
                  to={link.to}
                  className={({ isActive }) => `flex items-center text-slate-200 hover:text-white transition duration-150 ${isActive ? 'text-blue-500 bg-slate-800 rounded-lg p-2' : 'p-2'}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  {React.cloneElement(link.icon, { size: 20 })}
                  <span className="ml-3 font-medium">{link.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-auto px-4 py-4 border-t border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                {user.name.charAt(0)}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full outline outline-1 outline-white ${roleColors[user.role.includes('admin') ? 'admin' : user.role.includes('manager') ? 'manager' : user.role.includes('hr') ? 'hr' : 'employee']}`}>
                  {user.role.replace('_', ' ')}
                </span>
              </div>
            </div>
            <button onClick={logout} className="text-slate-400 hover:text-white p-2">
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
