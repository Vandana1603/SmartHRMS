import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/ui/ProtectedRoute';
import LoadingSkeleton from './components/ui/LoadingSkeleton';
import HRChatbot from './components/ui/HRChatbot';

const Login = lazy(() => import('./pages/Login'));
const Unauthorized = lazy(() => import('./pages/Unauthorized'));

const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const EmployeesPage = lazy(() => import('./pages/admin/EmployeesPage'));
const AttendanceReportPage = lazy(() => import('./pages/admin/AttendanceReportPage'));
const PayrollPage = lazy(() => import('./pages/admin/PayrollPage'));
const PerformancePage = lazy(() => import('./pages/admin/PerformancePage'));
const TeamAllocationPage = lazy(() => import('./pages/admin/TeamAllocationPage'));
const RoleManagementPage = lazy(() => import('./pages/admin/RoleManagementPage'));

const ManagerDashboard = lazy(() => import('./pages/manager/ManagerDashboard'));

const HRDashboard = lazy(() => import('./pages/hr/HRDashboard'));
const ResumeScreeningPage = lazy(() => import('./pages/hr/ResumeScreeningPage'));
const InterviewPage = lazy(() => import('./pages/hr/InterviewPage'));
const OnboardingPage = lazy(() => import('./pages/hr/OnboardingPage'));

const EmployeeDashboard = lazy(() => import('./pages/employee/EmployeeDashboard'));
const MyProfilePage = lazy(() => import('./pages/employee/MyProfilePage'));
const AttendancePage = lazy(() => import('./pages/employee/AttendancePage'));
const PayslipPage = lazy(() => import('./pages/employee/PayslipPage'));
const MyPerformancePage = lazy(() => import('./pages/employee/MyPerformancePage'));

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <HRChatbot />
      <Suspense fallback={<LoadingSkeleton />}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Admin Only Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/attendance" element={<AttendanceReportPage />} />
              <Route path="/admin/payroll" element={<PayrollPage />} />
              <Route path="/admin/teams" element={<TeamAllocationPage />} />
              <Route path="/admin/roles" element={<RoleManagementPage />} />
            </Route>

            {/* Shared Admin/Manager Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin', 'senior_manager']} />}>
              <Route path="/admin/employees" element={<EmployeesPage />} />
              <Route path="/admin/performance" element={<PerformancePage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['senior_manager']} />}>
              <Route path="/manager" element={<ManagerDashboard />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['hr_recruiter']} />}>
              <Route path="/hr" element={<HRDashboard />} />
              <Route path="/hr/resume" element={<ResumeScreeningPage />} />
              <Route path="/hr/interview" element={<InterviewPage />} />
              <Route path="/hr/onboarding" element={<OnboardingPage />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={['employee', 'admin', 'senior_manager', 'hr_recruiter']} />}>
              <Route path="/employee" element={<EmployeeDashboard />} />
              <Route path="/employee/profile" element={<MyProfilePage />} />
              <Route path="/employee/attendance" element={<AttendancePage />} />
              <Route path="/employee/payslip" element={<PayslipPage />} />
              <Route path="/employee/performance" element={<MyPerformancePage />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;

