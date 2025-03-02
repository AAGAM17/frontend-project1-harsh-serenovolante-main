'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Loading component
function LoadingUI() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#67B7F7] border-t-transparent"></div>
        <div className="text-gray-600">Loading project details...</div>
        <div className="text-sm text-gray-500">Please wait while we prepare your chat session.</div>
      </div>
    </div>
  );
}

// Dynamically import the client component
const ProjectDetailsClient = dynamic(
  () => import('./ProjectDetailsClient'),
  {
    ssr: false,
    loading: LoadingUI,
  }
);

export default function ProjectDetailsWrapper() {
  return (
    <Suspense fallback={<LoadingUI />}>
      <ProjectDetailsClient />
    </Suspense>
  );
} 