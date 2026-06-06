import React from 'react';

export default function StatCard({ title, value, icon, colorClass }) {
  return (
    <div className="flex flex-col bg-white shadow-sm rounded-xl border border-gray-100 p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="text-slate-500 text-sm font-medium uppercase tracking-wider">{title}</div>
        <div className={`p-2 rounded-lg ${colorClass}`}>
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-baseline">
        <span className="text-3xl font-bold text-slate-800">{value}</span>
      </div>
    </div>
  );
}
