'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { apiClient } from '@/lib/api';
import { Users, Plus, Calendar, Shield, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface EmployeeItem {
  id: string;
  fullName: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  devices: { id: string; hostname: string; status: string; lastSeenAt: string | null }[];
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<EmployeeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await apiClient<{ employees: EmployeeItem[] }>('/api/v1/admin/employees');
      setEmployees(res.employees);
    } catch (err) {
      console.error('Failed to fetch employees:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiClient('/api/v1/admin/employees', {
        method: 'POST',
        body: JSON.stringify({
          email: newEmail,
          fullName: newName,
          password: newPassword,
          role: 'EMPLOYEE',
        }),
      });
      setShowAddModal(false);
      setNewEmail('');
      setNewName('');
      setNewPassword('');
      fetchEmployees();
    } catch (err: any) {
      alert(`Error creating employee: ${err.message}`);
    }
  };

  return (
    <div>
      <Header
        title="Employee Directory"
        subtitle="Manage employees, credentials, and individual timeline inspections"
      />

      <div className="p-8 space-y-6 max-w-7xl">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Registered team members ({employees.length})
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Employee</span>
          </button>
        </div>

        {/* Directory Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-6">Employee</th>
                <th className="py-3 px-6">Role</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Bound Laptop</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 text-xs">
                    {loading ? 'Loading directory...' : 'No employees registered.'}
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
                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        <Shield className="w-3 h-3 text-slate-400" />
                        {emp.role}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <span className="text-xs font-semibold text-emerald-600">Active</span>
                    </td>

                    <td className="py-4 px-6 text-xs text-slate-600 font-mono">
                      {emp.devices[0]?.hostname ?? 'Unbound'}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/employees/${emp.id}/timeline`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold transition-colors"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>View Timeline</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-bold text-lg text-slate-900">Add New Employee</h3>
            <form onSubmit={handleCreateEmployee} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  placeholder="e.g. Bilal Tariq"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Corporate Email</label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  placeholder="bilal@enterprise.local"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Temporary Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  placeholder="Min 8 characters"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700"
                >
                  Create & Issue Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
