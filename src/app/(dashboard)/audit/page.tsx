'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { apiClient } from '@/lib/api';
import { ShieldCheck, Eye, Key, Smartphone, AlertCircle } from 'lucide-react';

interface AuditItem {
  id: string;
  actorId: string;
  action: string;
  targetType: string;
  targetId: string | null;
  ip: string | null;
  metadata: any;
  createdAt: string;
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLogs() {
      try {
        setLoading(true);
        const res = await apiClient<{ logs: AuditItem[] }>('/api/v1/admin/audit');
        setLogs(res.logs);
      } catch (err) {
        console.error('Failed to load audit logs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'VIEW_TIMELINE':
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Eye className="w-3 h-3" />
            VIEW_TIMELINE
          </span>
        );
      case 'REVOKE_DEVICE':
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded font-semibold bg-red-50 text-red-700 border border-red-200">
            <Smartphone className="w-3 h-3" />
            REVOKE_DEVICE
          </span>
        );
      case 'CREATE_EMPLOYEE':
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Key className="w-3 h-3" />
            CREATE_EMPLOYEE
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded font-semibold bg-slate-100 text-slate-700">
            {action}
          </span>
        );
    }
  };

  return (
    <div>
      <Header
        title="Security & Inspection Audit Trail"
        subtitle="Immutable records of administrative timeline views, credential modifications and device states"
      />

      <div className="p-8 space-y-6 max-w-7xl">
        <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-blue-900 leading-relaxed">
            <strong>Legal & Compliance Notice:</strong> Every single time an administrator or manager views an employee's daily timeline or modifies policy, an immutable record is permanently written to this audit log table with IP and timestamp to protect employee privacy rights.
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-6">Timestamp</th>
                <th className="py-3 px-6">Action</th>
                <th className="py-3 px-6">Target Entity</th>
                <th className="py-3 px-6">IP Address</th>
                <th className="py-3 px-6">Metadata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 font-sans">
                    {loading ? 'Loading audit records...' : 'No audit entries logged yet.'}
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-3 px-6 text-slate-600">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-6 font-sans">{getActionBadge(log.action)}</td>
                    <td className="py-3 px-6 text-slate-800">
                      {log.targetType}: {log.targetId ? log.targetId.substring(0, 8) + '...' : '-'}
                    </td>
                    <td className="py-3 px-6 text-slate-500">{log.ip ?? '127.0.0.1'}</td>
                    <td className="py-3 px-6 text-slate-400">
                      {log.metadata ? JSON.stringify(log.metadata) : '-'}
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
