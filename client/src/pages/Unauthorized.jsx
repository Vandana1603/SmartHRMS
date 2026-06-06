import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export default function Unauthorized() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 text-center max-w-md w-full border border-slate-100">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="w-10 h-10 text-red-600" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Access Denied</h2>
        <p className="text-slate-500 mb-8">
          You don't have the required permissions to access this page. Please contact your administrator if you believe this is a mistake.
        </p>
        <Link
          to="/"
          className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors w-full"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
