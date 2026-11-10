/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppMode } from '../types';
import { BookOpen, TreeDeciduous } from 'lucide-react';

interface HeaderProps {
  mode: AppMode;
  onSetMode: (mode: AppMode) => void;
  onOpenDrawer: () => void;
}

export const Header: React.FC<HeaderProps> = ({ mode, onSetMode, onOpenDrawer }) => {
  return (
    <header className="flex items-center justify-between gap-4 px-4 sm:px-6 py-3.5 bg-white border-b border-slate-200 sticky top-0 z-40 shadow-2xs">
      {/* Zone 1: Prominent Brand Title, Team Name & Inspiring Slogan */}
      <div className="flex items-center gap-3 whitespace-nowrap shrink-0">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700 text-white flex items-center justify-center shadow-md ring-2 ring-emerald-200/80">
          <TreeDeciduous className="w-6 h-6 stroke-[2.5]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-emerald-900 via-green-800 to-teal-900 bg-clip-text text-transparent block leading-none">
              POWER TREE
            </span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-extrabold uppercase tracking-wide border border-emerald-300 shadow-2xs">
              Eco Smart Kids
            </span>
          </div>
          <p className="text-xs font-bold text-emerald-700 mt-1 flex items-center gap-1.5">
            <span className="text-amber-500">🌱</span>
            <span>We Think. We Create. We Go Green!</span>
          </p>
        </div>
      </div>

      {/* Zone 2: Mode Toggle / Status */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
        <button
          onClick={() => onSetMode('demo')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            mode === 'demo'
              ? 'bg-white text-emerald-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Mô phỏng Demo
        </button>
        <button
          onClick={() => onSetMode('live')}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            mode === 'live'
              ? 'bg-white text-amber-800 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Arduino USB
        </button>
      </div>

      {/* Zone 3: 1 Primary Action */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onOpenDrawer}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 rounded-xl transition-colors shadow-xs cursor-pointer whitespace-nowrap shrink-0"
        >
          <BookOpen className="w-4 h-4" />
          <span className="hidden sm:inline">Hướng dẫn STEM & Kết nối</span>
          <span className="sm:hidden">Hướng dẫn</span>
        </button>
      </div>
    </header>
  );
};
