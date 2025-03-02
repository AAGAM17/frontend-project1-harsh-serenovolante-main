/* eslint-disable @typescript-eslint/no-unused-vars */
import ClientWrapper from '@/components/ClientWrapper';

// Loading component
function LoadingUI() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="text-center flex flex-col items-center justify-center space-y-4 w-full h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
        <div className="text-lg font-semibold text-gray-800">Loading chat...</div>
        <div className="text-sm text-gray-500">Please wait while we prepare your session.</div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <ClientWrapper />
    </main>
  );
} 