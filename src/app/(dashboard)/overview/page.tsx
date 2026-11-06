'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { KpiCard } from '@/components/KpiCard';
import { apiClient } from '@/lib/api';
import { Users, Radio, Clock, Coffee, ArrowUpRight, Activity } from 'lucide-react';
import Link from 'next/link';

interface OverviewData {
  totalEmployees: number;
  onlineNow: number;
  activeSessions: number;
  todayMetrics: {
    trackedHours: number;
    activeHours: number;
    idleHours: number;
  };
}

export default function OverviewPage() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await apiClient<OverviewData>('/api/v1/admin/overview');
        setData(res);
      } catch (err) {
        console.error('Failed to load overview data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div>
      <Header
        title="Workforce Analytics & Overview"
        subtitle="Real-time productivity, attendance and activity tracking overview"
      />

      <div className="p-8 space-y-8 max-w-7xl">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <KpiCard
            title="Total Employees"
            value={loading ? '...' : data?.totalEmployees ?? 0}
            subtitle="Registered active workforce"
            icon={<Users className="w-5 h-5" />}
          />
          <KpiCard
            title="Online Now"
            value={loading ? '...' : data?.onlineNow ?? 0}
            badge={{ text: 'Live Heartbeat', trend: 'up' }}
            subtitle="Laptops reporting within 5 min"
            icon={<Radio className="w-5 h-5 text-emerald-500" />}
          />
          <KpiCard
            title="Tracked Hours Today"
            value={loading ? '...' : `${data?.todayMetrics.trackedHours ?? 0} hrs`}
            subtitle="Cumulative team hours"
            icon={<Clock className="w-5 h-5" />}
          />
          <KpiCard
            title="Active vs Idle Mix"
            value={loading ? '...' : `${data?.todayMetrics.activeHours ?? 0}h / ${data?.todayMetrics.idleHours ?? 0}h`}
            subtitle="Active input vs idle ratio"
            icon={<Coffee className="w-5 h-5 text-amber-500" />}
          />
        </div>

        {/* Feature Cards / Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Live Monitoring Board</h3>
                  <p className="text-xs text-slate-500">View which remote employees are currently online and working</p>
                </div>
              </div>
              <Link
                href="/live"
                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <ArrowUpRight className="w-5 h-5" />
              </Link>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Real-time heartbeat table refreshed continuously. View foreground application names (VS Code, Chrome, Excel) and current active/idle status.
            </p>
            <Link
              href="/live"
              className="inline-block text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Open Live Board &rarr;
            </Link>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Interactive 24-Hour Timelines</h3>
                  <p className="text-xs text-slate-500">Inspect employee activity blocks down to the exact minute</p>
                </div>
              </div>
              <Link
                href="/employees"
                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <ArrowUpRight className="w-5 h-5" />
              </Link>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Visually distinct active, idle, and offline intervals with Win32 clock drift compensation and employee dispute correction workflows.
            </p>
            <Link
              href="/employees"
              className="inline-block text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              View Employee Timelines &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
