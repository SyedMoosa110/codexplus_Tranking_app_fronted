'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { apiClient } from '@/lib/api';
import { Radio, Monitor, RefreshCw, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface LiveEmployee {
  id: string;
  fullName: string;
  email: string;
  role: string;
  isOnline: boolean;
  lastSeenAt: string | null;
  hostname: string | null;
  currentSessionStatus: string;
  currentActivityType: string;
  currentApp: string;
  currentWindowTitle?: string | null;
}

export default function LiveMonitoringPage() {
  const [employees, setEmployees] = useState<LiveEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const fetchLiveState = async () => {
    try {
      setLoading(true);
      const res = await apiClient<{ employees: LiveEmployee[] }>('/api/v1/admin/live');
      setEmployees(res.employees);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Failed to fetch live employees:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveState();
    const interval = setInterval(fetchLiveState, 15000); // Auto-refresh every 15s
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Header
        title="Live Monitoring Board"
        subtitle="Real-time employee connection status, active processes, and heartbeat tracking"
      />

      <div className="p-8 space-y-6 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
            <span>Auto-refreshing every 15s (Last updated: {lastRefreshed.toLocaleTimeString()})</span>
          </div>

          <button
            onClick={fetchLiveState}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-700 shadow-sm transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Now</span>
          </button>
        </div>

        {/* Live Status Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-6">Employee</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Device Hostname</th>
                <th className="py-3 px-6">Current Application</th>
                <th className="py-3 px-6">Last Heartbeat</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-xs">
                    {loading ? 'Loading active workforce...' : 'No employees found.'}
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-900">{emp.fullName}</div>
                      <div className="text-xs text-slate-400">{emp.email}</div>
                    </td>

                    <td className="py-4 px-6">
                      {emp.isOnline ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Online Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                          Offline
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-xs text-slate-600 font-mono">
                      {emp.hostname ? (
                        <span className="flex items-center gap-1.5">
                          <Monitor className="w-3.5 h-3.5 text-slate-400" />
                          {emp.hostname}
                        </span>
                      ) : (
                        'No device bound'
                      )}
                    </td>

                    <td className="py-4 px-6 max-w-md">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-700">
                            {emp.currentApp}
                          </span>
                        </div>
                        {emp.currentWindowTitle && (
                          <span className="text-[11px] text-slate-600 truncate max-w-sm" title={emp.currentWindowTitle}>
                            {emp.currentWindowTitle}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-6 text-xs text-slate-500">
                      {emp.lastSeenAt
                        ? new Date(emp.lastSeenAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })
                        : 'Never'}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/employees/${emp.id}/timeline`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
                      >
                        <span>Timeline</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
