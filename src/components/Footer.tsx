/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-8 border-t border-slate-200 py-6 text-center text-xs text-slate-500 bg-white">
      <div className="max-w-5xl mx-auto px-4 space-y-2">
        <div className="flex flex-wrap items-center justify-center gap-2 text-slate-700 font-bold">
          <span className="text-emerald-800 text-sm font-extrabold">Mô hình POWER TREE</span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wide border border-emerald-300">
            Nhóm Eco Smart Kids
          </span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="text-slate-600 font-medium">Cuộc thi STEMPETITION</span>
        </div>
        <p className="text-emerald-700 font-extrabold text-xs tracking-wide">
          We Think. We Create. We Go Green!
        </p>
        <p className="text-slate-400 text-[11px] max-w-2xl mx-auto">
          Mô hình nguyên lý giáo dục STEM về năng lượng tái tạo và quản lý nước thông minh của nhóm học sinh tiểu học hướng tới một hành tinh xanh bền vững.
        </p>
      </div>
    </footer>
  );
};
