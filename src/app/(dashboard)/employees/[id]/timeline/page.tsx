'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { TimelineBar, TimelineBlock } from '@/components/TimelineBar';
import { apiClient } from '@/lib/api';
import { Calendar, ArrowLeft, Clock, ShieldCheck, Activity, Globe, AppWindow } from 'lucide-react';
import Link from 'next/link';

interface TimelineData {
  employee: { id: string; fullName: string; email: string };
  date: string;
  sessions: any[];
  events: any[];
  segments: any[];
}

export default function EmployeeTimelinePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [data, setData] = useState<TimelineData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    async function loadTimeline() {
      try {
        setLoading(true);
        const res = await apiClient<TimelineData>(
          `/api/v1/admin/employees/${id}/timeline?date=${selectedDate}`
        );
        setData(res);
      } catch (err) {
        console.error('Failed to load employee timeline:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTimeline();
    const interval = setInterval(loadTimeline, 15000); // Auto-refresh every 15s
    return () => clearInterval(interval);
  }, [id, selectedDate]);

  // Convert raw events into TimelineBlock items for the visual component
  const dayStartMs = new Date(`${selectedDate}T00:00:00.000Z`).getTime();
  const dayEndMs = dayStartMs + 86400000;

  const blocks: TimelineBlock[] = [];
  if (data?.sessions) {
    for (const session of data.sessions) {
      const sStart = new Date(session.startAt).getTime();
      const sEnd = session.endAt ? new Date(session.endAt).getTime() : Date.now();

      const sessionEvents = (data.events || []).filter(
        (e) => e.sessionId === session.id
      );

      let currentFrom = sStart;
      let isIdle = false;

      for (const ev of sessionEvents) {
        const evTime = new Date(ev.occurredAt).getTime();
        if (ev.type === 'IDLE_START' && !isIdle) {
          if (evTime > currentFrom) {
            blocks.push({ from: currentFrom, to: evTime, kind: 'active', label: 'Active Work' });
          }
          currentFrom = evTime;
          isIdle = true;
        } else if (ev.type === 'IDLE_END' && isIdle) {
          blocks.push({ from: currentFrom, to: evTime, kind: 'idle', label: 'Idle / Inactive' });
          currentFrom = evTime;
          isIdle = false;
        }
      }

      if (sEnd > currentFrom) {
        blocks.push({
          from: currentFrom,
          to: sEnd,
          kind: isIdle ? 'idle' : 'active',
          label: isIdle ? 'Idle / Inactive' : 'Active Work',
        });
      }
    }
  }

  // Sorted events (Newest first)
  const sortedEvents = data?.events
    ? [...data.events].sort(
        (a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime()
      )
    : [];

  return (
    <div>
      <Header
        title={data?.employee ? `${data.employee.fullName}'s Minute-by-Minute Activity` : 'Employee Timeline'}
        subtitle="Detailed minute-by-minute work activity, documents, open windows and audit logs"
      />

      <div className="p-8 space-y-6 max-w-7xl">
        <div className="flex items-center justify-between">
          <Link
            href="/employees"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Directory</span>
          </Link>

          {/* Date Picker */}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 shadow-sm"
            />
          </div>
        </div>

        {/* Visual Timeline Section */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">24-Hour Continuous Timeline</h3>
              <p className="text-xs text-slate-500">
                Date: {selectedDate} &bull; Recorded on {data?.sessions?.[0]?.device?.hostname ?? 'Company Device'}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Audit Logged &bull; Auto-refreshing every 15s</span>
            </div>
          </div>

          {loading && blocks.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">Loading timeline data...</div>
          ) : blocks.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No recorded work sessions for this employee on {selectedDate}.
            </div>
          ) : (
            <TimelineBar blocks={blocks} dayStartMs={dayStartMs} dayEndMs={dayEndMs} />
          )}
        </div>

        {/* Detailed Events Log: Minute by Minute Activity */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                Detailed Minute-by-Minute Activity Log ({sortedEvents.length} records)
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Exact applications, open documents, browser tabs and active/idle state
              </p>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Win32 Clock-Drift Corrected</span>
          </div>

          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-6">Timestamp</th>
                <th className="py-3 px-6">State / Event</th>
                <th className="py-3 px-6">Application (Process)</th>
                <th className="py-3 px-6">Document / Webpage / Window Title</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedEvents.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400">
                    No activity records recorded yet.
                  </td>
                </tr>
              ) : (
                sortedEvents.map((ev: any) => {
                  let p = ev.payload;
                  if (typeof p === 'string') {
                    try {
                      p = JSON.parse(p);
                    } catch {
                      p = {};
                    }
                  }
                  p = p || {};

                  const appName = p.processName || (ev.type === 'RESUME' ? 'System Resume' : '-');
                  const winTitle = p.windowTitle || (appName !== '-' ? 'Active Window / Main Task' : '-');

                  return (
                    <tr key={ev.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-6 font-mono text-slate-600 whitespace-nowrap">
                        {new Date(ev.occurredAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </td>

                      <td className="py-3 px-6 whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            ev.type === 'IDLE_START'
                              ? 'bg-amber-100 text-amber-800'
                              : ev.type === 'IDLE_END'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ev.type === 'PAUSE'
                              ? 'bg-red-100 text-red-800'
                              : ev.type === 'RESUME'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {ev.type === 'APP_CHANGE' ? 'Active Work' : ev.type}
                        </span>
                      </td>

                      <td className="py-3 px-6 font-semibold text-slate-800 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-mono">
                          <AppWindow className="w-3.5 h-3.5 text-slate-400" />
                          <span>{appName}</span>
                        </div>
                      </td>

                      <td className="py-3 px-6 text-slate-700 max-w-lg truncate">
                        <span className="font-sans text-xs" title={winTitle}>
                          {winTitle}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
