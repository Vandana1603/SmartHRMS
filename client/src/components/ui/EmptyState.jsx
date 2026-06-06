import React from 'react';

export default function EmptyState({ title, description, icon }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-gray-200 border-dashed">
      <div className="text-gray-400 mb-4 bg-gray-50 p-4 rounded-full">{icon}</div>
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500 text-center max-w-sm">{description}</p>
    </div>
  );
}
