'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { apiClient } from '@/lib/api';
import { Download, Calendar, CheckCircle2, Clock } from 'lucide-react';

export default function AttendancePage() {
  const [selectedMonth, setSelectedMonth] = useState('2026-11');
  const [records, setRecords] = useState([
    {
      id: '1',
      date: '2026-11-06',
      employee: 'Ali Khan',
      firstStart: '09:02 AM',
      lastEnd: '06:05 PM',
      trackedHours: '8.2 hrs',
      activeHours: '7.4 hrs',
      idleHours: '0.8 hrs',
      status: 'On Time',
    },
    {
      id: '2',
      date: '2026-11-06',
      employee: 'Sara Ahmed',
      firstStart: '09:14 AM',
      lastEnd: '06:10 PM',
      trackedHours: '8.0 hrs',
      activeHours: '7.1 hrs',
      idleHours: '0.9 hrs',
      status: 'Late Arrival (14m)',
    },
  ]);

  const handleExportCsv = () => {
    const headers = 'Date,Employee,First Punch In,Last Punch Out,Tracked Hours,Active Hours,Idle Hours,Status\n';
    const rows = records
      .map(
        (r) =>
          `"${r.date}","${r.employee}","${r.firstStart}","${r.lastEnd}","${r.trackedHours}","${r.activeHours}","${r.idleHours}","${r.status}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Attendance_Report_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <Header
        title="Attendance & Time Records"
        subtitle="Daily punch-in, punch-out, overtime and payroll export calculations"
      />

      <div className="p-8 space-y-6 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-slate-400" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 shadow-sm"
            />
          </div>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV for Payroll</span>
          </button>
        </div>

        {/* Attendance Records Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-6">Date</th>
                <th className="py-3 px-6">Employee</th>
                <th className="py-3 px-6">First Punch In</th>
                <th className="py-3 px-6">Last Punch Out</th>
                <th className="py-3 px-6">Tracked</th>
                <th className="py-3 px-6">Active / Idle</th>
                <th className="py-3 px-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-6 text-xs font-mono text-slate-600">{rec.date}</td>
                  <td className="py-4 px-6 font-semibold text-slate-900">{rec.employee}</td>
                  <td className="py-4 px-6 text-xs text-slate-700">{rec.firstStart}</td>
                  <td className="py-4 px-6 text-xs text-slate-700">{rec.lastEnd}</td>
                  <td className="py-4 px-6 text-xs font-bold text-slate-900">{rec.trackedHours}</td>
                  <td className="py-4 px-6 text-xs text-slate-500">
                    <span className="text-emerald-600 font-semibold">{rec.activeHours}</span> /{' '}
                    <span className="text-amber-600 font-semibold">{rec.idleHours}</span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                        rec.status.includes('Late')
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {rec.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
