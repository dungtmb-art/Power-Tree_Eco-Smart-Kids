/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sun, Moon, Car, CloudRain, RotateCcw, Sprout, Lightbulb } from 'lucide-react';
import { PowerTreeFullState } from '../types';

interface InteractiveControlsProps {
  state: PowerTreeFullState;
  actions: {
    toggleSun: () => void;
    toggleRain: () => void;
    triggerCarPass: () => void;
    toggleLed: () => void;
    resetSimulation: () => void;
    useStoredWater: () => void;
  };
}

export const InteractiveControls: React.FC<InteractiveControlsProps> = ({ state, actions }) => {
  const { isSunOn, isRaining, isCarMoving, ledOn, water, mode } = state;

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3.5">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
            <span>Bảng điều khiển tương tác mô phỏng</span>
            <span className="text-xs font-normal text-slate-500">
              (Thao tác dành cho học sinh & Giám khảo trải nghiệm)
            </span>
          </h2>
        </div>
        {mode === 'live' && (
          <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            Đang ở Chế độ Thực tế: Thao tác sẽ ưu tiên tín hiệu từ phần cứng Arduino
          </span>
        )}
      </div>

      {/* Row of 4 Primary Simulation Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* BUTTON 1: BẬT/TẮT NẮNG */}
        <button
          onClick={actions.toggleSun}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all shadow-xs cursor-pointer ${
            isSunOn
              ? 'bg-amber-500 hover:bg-amber-600 text-white ring-2 ring-amber-300 ring-offset-1'
              : 'bg-slate-800 hover:bg-slate-900 text-white ring-2 ring-slate-700 ring-offset-1'
          }`}
          title="Bật hoặc tắt ánh sáng mặt trời để quan sát 3 tấm pin mặt trời tạo điện"
        >
          {isSunOn ? <Sun className="w-5 h-5 animate-spin-slow" /> : <Moon className="w-5 h-5 text-amber-300" />}
          <span>{isSunOn ? 'TẮT NẮNG (ĐÊM)' : 'BẬT NẮNG (NGÀY)'}</span>
        </button>

        {/* BUTTON 2: XE QUA PIEZO */}
        <button
          onClick={actions.triggerCarPass}
          disabled={isCarMoving}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all shadow-xs cursor-pointer ${
            isCarMoving
              ? 'bg-cyan-600 text-white opacity-80 cursor-wait'
              : 'bg-cyan-500 hover:bg-cyan-600 active:scale-98 text-white'
          }`}
          title="Cho xe mô hình chạy qua tấm áp điện Piezo để tạo xung điện"
        >
          <Car className={`w-5 h-5 ${isCarMoving ? 'animate-bounce' : ''}`} />
          <span>{isCarMoving ? 'XE ĐANG CHẠY...' : 'XE QUA PIEZO'}</span>
        </button>

        {/* BUTTON 3: TẠO MƯA */}
        <button
          onClick={actions.toggleRain}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all shadow-xs cursor-pointer ${
            isRaining
              ? 'bg-sky-600 hover:bg-sky-700 text-white ring-2 ring-sky-300 ring-offset-1'
              : 'bg-sky-500 hover:bg-sky-600 text-white'
          }`}
          title="Tạo mưa rơi để thu gom nước vào bể ngầm và kích hoạt bơm tự động"
        >
          <CloudRain className={`w-5 h-5 ${isRaining ? 'animate-bounce' : ''}`} />
          <span>{isRaining ? 'DỪNG MƯA' : 'TẠO MƯA'}</span>
        </button>

        {/* BUTTON 4: THỬ LẠI (RESET) */}
        <button
          onClick={actions.resetSimulation}
          className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 transition-all border border-slate-300 cursor-pointer"
          title="Đặt lại toàn bộ trạng thái ban đầu để thực hiện lượt trình diễn mới"
        >
          <RotateCcw className="w-4 h-4 text-slate-500" />
          <span>THỬ LẠI</span>
        </button>
      </div>

      {/* Auxiliary quick utilities for presentation demonstration */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <span>Tiện ích thử nghiệm:</span>
          <button
            onClick={actions.useStoredWater}
            disabled={water.treeVisualLevel <= 15}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-medium transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            title="Mô phỏng lấy nước đã lưu trữ trong túi thân cây để tưới hoa cây cỏ"
          >
            <Sprout className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tưới cây (Dùng nước đã trữ)</span>
          </button>

          <button
            onClick={actions.toggleLed}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-medium transition-colors cursor-pointer"
            title="Thử nghiệm bật tắt đèn đường LED chiếu sáng đô thị"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
            <span>Đổi đèn LED ({ledOn ? 'Tắt' : 'Bật'})</span>
          </button>
        </div>

        <div className="text-slate-400 italic">
          💡 Máy bơm chỉ chạy tự động theo 3 phao an toàn, không có nút bật cưỡng bức
        </div>
      </div>
    </div>
  );
};
