"use client";

import { useEffect, useState } from "react";

/**
 * Interface for the Health API response.
 * Matches the structure defined in apps/server/schemas/base.py and routes.py.
 */
interface HealthResponse {
  data: {
    status: string;
    database: string;
  } | null;
  error: string | null;
  message: string;
}

export default function Home() {
  const [healthData, setHealthData] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        setLoading(true);
        // Using NEXT_PUBLIC_SERVER_URL for client-side fetching
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";
        const res = await fetch(`${serverUrl}/api/v1/health`);
        
        if (!res.ok) {
          throw new Error(`Server responded with status: ${res.status}`);
        }
        
        const data: HealthResponse = await res.json();
        setHealthData(data);
        setError(null);
      } catch (err) {
        console.error("Health check failed:", err);
        setError(err instanceof Error ? err.message : "Failed to connect to the server");
      } finally {
        setLoading(false);
      }
    };

    fetchHealth();
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans p-8 dark:bg-black">
      <main className="w-full max-w-lg rounded-3xl bg-white p-10 shadow-xl dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 transition-all">
        <div className="flex items-center gap-4 mb-8">
          <div className={`w-3 h-3 rounded-full animate-pulse ${loading ? 'bg-amber-400' : error ? 'bg-red-500' : 'bg-emerald-500'}`} />
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">System Health</h1>
        </div>
        
        {error && (
          <div className="p-4 mb-6 text-sm font-medium text-red-800 bg-red-50 rounded-2xl border border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
            <p className="mt-2 text-xs opacity-70">Make sure the FastAPI server is running on {process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000"}</p>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="w-10 h-10 rounded-full border-4 border-zinc-200 border-t-zinc-800 dark:border-zinc-800 dark:t-zinc-400 animate-spin" />
            <p className="text-zinc-500 dark:text-zinc-400 font-medium">Checking systems...</p>
          </div>
        ) : healthData ? (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-500">Response Message</span>
                <span className="text-lg font-medium text-zinc-900 dark:text-zinc-100">{healthData.message}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-500">API Server</span>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${healthData.data?.status === 'ok' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">{healthData.data?.status?.toUpperCase() || 'ERROR'}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-500">Database</span>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${healthData.data?.database === 'connected' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">{healthData.data?.database?.toUpperCase() || 'OFFLINE'}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl font-bold hover:opacity-90 transition-opacity"
            >
              Refresh Status
            </button>
          </div>
        ) : null}
      </main>
      
      <p className="mt-8 text-zinc-400 text-xs dark:text-zinc-600">
        Inaam Dashboard • Health Monitoring v1.0
      </p>
    </div>
  );
}
