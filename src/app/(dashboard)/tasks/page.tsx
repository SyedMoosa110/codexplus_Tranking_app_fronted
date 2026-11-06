'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { apiClient } from '@/lib/api';
import { CheckSquare, Clock, User, Plus } from 'lucide-react';

interface ProjectItem {
  id: string;
  name: string;
  description: string | null;
  tasks: {
    id: string;
    title: string;
    status: string;
    assignee: { id: string; fullName: string; email: string };
    logs: { id: string; startAt: string; note: string | null }[];
  }[];
}

export default function TasksPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        setLoading(true);
        const res = await apiClient<{ projects: ProjectItem[] }>('/api/v1/tasks/projects');
        setProjects(res.projects);
      } catch (err) {
        console.error('Failed to load projects:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  return (
    <div>
      <Header
        title="Tasks & Deliverables (Work Layer)"
        subtitle="Auditable proof-of-work, deliverables and manager review logs"
      />

      <div className="p-8 space-y-8 max-w-7xl">
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Active Projects ({projects.length})
          </p>
        </div>

        {projects.length === 0 && !loading && (
          <div className="bg-white rounded-xl p-8 border border-slate-200 text-center text-xs text-slate-400">
            No projects found. Seed or create projects to assign tasks to remote employees.
          </div>
        )}

        <div className="space-y-6">
          {projects.map((proj) => (
            <div key={proj.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{proj.name}</h3>
                  <p className="text-xs text-slate-500">{proj.description}</p>
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-blue-50 text-blue-700">
                  {proj.tasks.length} tasks
                </span>
              </div>

              {/* Tasks List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {proj.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">{task.title}</span>
                      <span
                        className={`text-[11px] px-2 py-0.5 rounded font-semibold ${
                          task.status === 'DONE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {task.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Assignee: {task.assignee.fullName}</span>
                    </div>

                    {task.logs.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-200/60 text-xs text-slate-600">
                        <span className="font-semibold text-slate-700">Latest Log: </span>
                        <span>{task.logs[0].note ?? 'In progress activity'}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
