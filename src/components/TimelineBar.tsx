'use client';

import React from 'react';

export interface TimelineBlock {
  from: number; // Unix timestamp in ms
  to: number;   // Unix timestamp in ms
  kind: 'active' | 'idle' | 'offline';
  label?: string;
  app?: string;
}

interface TimelineBarProps {
  blocks: TimelineBlock[];
  dayStartMs: number;
  dayEndMs: number;
}

const colorClasses = {
  active: 'bg-emerald-500 hover:bg-emerald-600',
  idle: 'bg-amber-400 hover:bg-amber-500',
  offline: 'bg-slate-200 hover:bg-slate-300',
};

export const TimelineBar: React.FC<TimelineBarProps> = ({ blocks, dayStartMs, dayEndMs }) => {
  const totalDurationMs = Math.max(1, dayEndMs - dayStartMs);

  return (
    <div className="w-full space-y-2">
      {/* Visual Timeline Bar */}
      <div className="relative h-10 w-full rounded-lg bg-slate-100 overflow-hidden border border-slate-200 flex">
        {blocks.map((block, index) => {
          const leftPercent = Math.max(0, Math.min(100, ((block.from - dayStartMs) / totalDurationMs) * 100));
          const widthPercent = Math.max(0.2, Math.min(100 - leftPercent, ((block.to - block.from) / totalDurationMs) * 100));

          const formatTime = (ts: number) => {
            const d = new Date(ts);
            return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          };

          const tooltip = `${formatTime(block.from)} - ${formatTime(block.to)}: ${block.kind.toUpperCase()} ${
            block.app ? `(${block.app})` : ''
          }`;

          return (
            <div
              key={index}
              title={tooltip}
              className={`absolute top-0 bottom-0 transition-all cursor-pointer ${colorClasses[block.kind]}`}
              style={{
                left: `${leftPercent}%`,
                width: `${widthPercent}%`,
              }}
            />
          );
        })}
      </div>

      {/* 24-Hour Markers */}
      <div className="flex justify-between text-xs text-slate-400 font-medium px-1">
        <span>09:00</span>
        <span>11:00</span>
        <span>13:00 (Lunch)</span>
        <span>15:00</span>
        <span>17:00</span>
        <span>19:00</span>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 pt-1 text-xs text-slate-600 font-medium">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
          <span>Active Productive</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-400"></span>
          <span>Idle (No Input)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-slate-200 border border-slate-300"></span>
          <span>Offline / Break</span>
        </div>
      </div>
    </div>
  );
};
