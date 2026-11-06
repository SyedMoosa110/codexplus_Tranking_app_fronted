'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Radio,
  Users,
  CalendarCheck,
  CheckSquare,
  ShieldAlert,
  Sliders,
  LogOut,
} from 'lucide-react';

const navigationItems = [
  { name: 'Overview', href: '/overview', icon: LayoutDashboard },
  { name: 'Live Monitoring', href: '/live', icon: Radio },
  { name: 'Employees', href: '/employees', icon: Users },
  { name: 'Attendance & Time', href: '/attendance', icon: CalendarCheck },
  { name: 'Tasks & Work Logs', href: '/tasks', icon: CheckSquare },
  { name: 'Security Audit', href: '/audit', icon: ShieldAlert },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen flex flex-col justify-between border-r border-slate-800">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-lg text-white shadow-md">
            W
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-wide text-white">WorkTrack Pro</h1>
            <p className="text-xs text-slate-400">Enterprise Monitoring</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1.5">
          {navigationItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Footer & Logout */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2 rounded-lg text-sm text-slate-400 hover:text-red-400 hover:bg-slate-800/80 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
