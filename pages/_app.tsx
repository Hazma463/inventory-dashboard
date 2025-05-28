'use client';

import { trpc } from '../utils/trpc';
import type { AppType } from 'next/app';
import '../styles/globals.css';
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error }) {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-4">Something went wrong:</h2>
        <pre className="text-red-400">{error.message}</pre>
      </div>
    </div>
  );
}

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="min-h-screen bg-gray-900">
        <Component {...pageProps} />
      </div>
    </ErrorBoundary>
  );
};

export default trpc.withTRPC(MyApp); 