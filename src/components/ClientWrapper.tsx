'use client';

import dynamic from 'next/dynamic';

// Loading component
function LoadingUI() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="text-center flex flex-col items-center justify-center space-y-4 w-full h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        <div className="text-lg font-semibold text-gray-800">Loading chat...</div>
        <div className="text-sm text-gray-500">Please wait while we prepare your session.</div>
      </div>
    </div>
  );
}

// Dynamically import the client component
const HomeClient = dynamic(() => import('./HomeClient'), {
  loading: LoadingUI,
  ssr: false
});

export default function ClientWrapper() {
  return <HomeClient />;
} 