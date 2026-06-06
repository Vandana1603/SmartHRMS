import React from 'react';

export default function LoadingSkeleton() {
  return (
    <div className="flex h-full min-h-[400px] items-center justify-center bg-transparent">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
