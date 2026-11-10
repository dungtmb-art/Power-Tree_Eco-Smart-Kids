/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PowerTreeFullState } from '../types';
import { Sun, Zap, Droplets, BatteryCharging, Battery, BatteryMedium, Lightbulb, Activity, CheckCircle2, AlertCircle } from 'lucide-react';

interface MetricCardsProps {
  state: PowerTreeFullState;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ state }) => {
  const { solar, piezo, water, battery, ledOn, mode } = state;

  return (
    <div className="space-y-4">
      {/* 3 Core Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* CARD 1: SOLAR (Năng lượng mặt trời) */}
        <div className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-xs relative overflow-hidden transition-all hover:shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <Sun className={`w-5 h-5 ${solar.status === 'generating' ? 'animate-spin-slow' : ''}`} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base leading-tight">SOLAR</h3>
                <p className="text-xs text-slate-500">Năng lượng mặt trời</p>
              </div>
            </div>
            {/* Generating badge */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                solar.status === 'generating'
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  solar.status === 'generating' ? 'bg-amber-500 animate-pulse' : 'bg-slate-400'
                }`}
              />
              {solar.status === 'generating'
                ? 'Đang tạo điện'
                : solar.status === 'idle'
                ? 'Không tạo điện'
                : 'Chưa có dữ liệu'}
            </span>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-baseline justify-between">
            <span className="text-xs text-slate-500">Điện áp tạo ra</span>
            <div className="text-right">
              <span className="font-mono text-2xl font-bold text-slate-800 tabular-nums">
                {solar.voltage !== undefined ? `${solar.voltage.toFixed(1)}` : '--'}
              </span>
              <span className="text-sm font-semibold text-slate-500 ml-1">V</span>
              <span className="block text-[11px] text-slate-400">
                {mode === 'demo' ? '(Mô phỏng)' : '(Đo thực tế)'}
              </span>
            </div>
          </div>
        </div>

        {/* CARD 2: PIEZO (Năng lượng áp điện) */}
        <div className="bg-white rounded-2xl p-5 border border-cyan-200/80 shadow-xs relative overflow-hidden transition-all hover:shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-600">
                <Zap className={`w-5 h-5 ${piezo.hasSignal ? 'animate-bounce text-cyan-500' : ''}`} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base leading-tight">PIEZO</h3>
                <p className="text-xs text-slate-500">Năng lượng áp điện</p>
              </div>
            </div>
            {/* Signal state badge */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                piezo.hasSignal
                  ? 'bg-cyan-100 text-cyan-900 border border-cyan-300 animate-pulse'
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  piezo.hasSignal ? 'bg-cyan-500' : 'bg-slate-400'
                }`}
              />
              {piezo.hasSignal
                ? 'Có tín hiệu'
                : piezo.status === 'idle'
                ? 'Không có tín hiệu'
                : 'Chưa có dữ liệu'}
            </span>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-baseline justify-between">
            <span className="text-xs text-slate-500">Số lần tác động (xe qua)</span>
            <div className="text-right">
              <span className="font-mono text-2xl font-bold text-slate-800 tabular-nums">
                {piezo.hits}
              </span>
              <span className="text-sm font-semibold text-slate-500 ml-1">lượt</span>
              <span className="block text-[11px] text-slate-400">
                Thu hồi động năng
              </span>
            </div>
          </div>
        </div>

        {/* CARD 3: WATER (Quản lý nước thông minh) */}
        <div className="bg-white rounded-2xl p-5 border border-sky-200/80 shadow-xs relative overflow-hidden transition-all hover:shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600">
                <Droplets className={`w-5 h-5 ${water.pumpRunning ? 'animate-pulse' : ''}`} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base leading-tight">WATER</h3>
                <p className="text-xs text-slate-500">Quản lý nước mưa</p>
              </div>
            </div>
            {/* Pump badge */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                water.pumpRunning
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pulse'
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              Máy bơm: {water.pumpRunning ? 'BẬT' : 'TẮT'}
            </span>
          </div>

          {/* 3 Floats status breakdown */}
          <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Bể thu gom:</span>
              <span className={`font-semibold ${water.highFloat ? 'text-sky-700 font-bold' : water.lowFloat ? 'text-slate-700' : 'text-slate-500'}`}>
                {water.highFloat ? 'Đạt mức cao (Kích hoạt bơm)' : water.lowFloat ? 'Mức thấp' : 'Dưới phao thấp'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Túi chứa trong cây:</span>
              <span className={`font-semibold ${water.fullFloat ? 'text-amber-700 font-bold' : 'text-emerald-700'}`}>
                {water.fullFloat ? 'Đã đầy (Ngắt bơm)' : 'Chưa đầy'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SƠ ĐỒ NGUYÊN LÝ NĂNG LƯỢNG & PIN LƯU TRỮ CHUNG */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">
              SƠ ĐỒ NGUYÊN LÝ NĂNG LƯỢNG & PIN LƯU TRỮ CHUNG
            </h4>
          </div>
          <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            {mode === 'demo' ? 'Mô phỏng nguyên lý STEM' : 'Chế độ Arduino thực tế'}
          </span>
        </div>

        {/* 3 Blocks Flow Diagram: Thu nhận & Mạch -> Pin lưu trữ chung -> Tải tiêu thụ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {/* CỘT 1: THU NĂNG LƯỢNG & MẠCH ĐIỀU KHIỂN */}
          <div className="bg-slate-50/90 rounded-xl p-3 border border-slate-200 space-y-2 text-xs">
            <span className="font-bold text-slate-600 block uppercase tracking-wider text-[10px]">
              1. Nguồn thu & Mạch điều khiển
            </span>

            {/* Nhánh 1: Solar -> Mạch quản lý sạc */}
            <div className="p-2 rounded-lg bg-white border border-amber-200 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sun className={`w-4 h-4 text-amber-500 ${solar.status === 'generating' ? 'animate-spin-slow' : ''}`} />
                <div>
                  <span className="font-bold text-slate-800 block leading-tight">Solar → Mạch sạc</span>
                  <span className="text-[10px] text-slate-500">Quản lý điện áp sạc an toàn</span>
                </div>
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                solar.status === 'generating'
                  ? 'bg-amber-100 text-amber-800'
                  : solar.status === 'idle'
                  ? 'bg-slate-100 text-slate-600'
                  : 'bg-slate-100 text-slate-500'
              }`}>
                {solar.status === 'generating' ? 'Đang tạo điện' : solar.status === 'idle' ? 'Không tạo điện' : 'Chưa có dữ liệu'}
              </span>
            </div>

            {/* Nhánh 2: Piezo -> Mạch thu năng lượng */}
            <div className="p-2 rounded-lg bg-white border border-cyan-200 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Zap className={`w-4 h-4 text-cyan-600 ${piezo.hasSignal ? 'animate-bounce text-cyan-500' : ''}`} />
                <div>
                  <span className="font-bold text-slate-800 block leading-tight">Piezo → Mạch thu</span>
                  <span className="text-[10px] text-cyan-700 font-medium">Mục tiêu thu hồi năng lượng</span>
                </div>
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                piezo.hasSignal
                  ? 'bg-cyan-100 text-cyan-900 animate-pulse'
                  : piezo.status === 'idle'
                  ? 'bg-slate-100 text-slate-600'
                  : 'bg-slate-100 text-slate-500'
              }`}>
                {piezo.hasSignal ? 'Có xung điện' : piezo.status === 'idle' ? 'Chờ xe qua' : 'Chưa có dữ liệu'}
              </span>
            </div>
          </div>

          {/* CỘT 2: PIN LƯU TRỮ CHUNG */}
          <div className="bg-emerald-50/60 rounded-xl p-3 border border-emerald-200 flex flex-col justify-between text-xs space-y-2">
            <div>
              <span className="font-bold text-emerald-800 block uppercase tracking-wider text-[10px]">
                2. Lưu trữ năng lượng
              </span>
              <div className="mt-2 flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center border shadow-2xs ${
                  battery === 'charging'
                    ? 'bg-emerald-500 text-white border-emerald-600 animate-pulse'
                    : battery === 'discharging'
                    ? 'bg-amber-500 text-white border-amber-600'
                    : 'bg-white text-slate-600 border-slate-300'
                }`}>
                  {battery === 'charging' ? (
                    <BatteryCharging className="w-6 h-6" />
                  ) : battery === 'discharging' ? (
                    <BatteryMedium className="w-6 h-6" />
                  ) : (
                    <Battery className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <h5 className="font-extrabold text-slate-900 text-sm">PIN LƯU TRỮ CHUNG</h5>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <span className="text-slate-500 text-[11px]">Trạng thái:</span>
                    <span className={`font-black text-xs px-2 py-0.5 rounded-md ${
                      battery === 'charging'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : battery === 'discharging'
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : battery === 'idle'
                        ? 'bg-slate-100 text-slate-700 border border-slate-200'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}>
                      {battery === 'charging'
                        ? 'Đang sạc'
                        : battery === 'discharging'
                        ? 'Đang cấp điện'
                        : battery === 'idle'
                        ? 'Đang chờ'
                        : 'Chưa có dữ liệu'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 leading-normal italic pt-1 border-t border-emerald-200/60">
              {mode === 'demo'
                ? 'Solar nạp vào pin qua mạch sạc. Nghiên cứu tích hợp thu hồi năng lượng Piezo.'
                : 'Chỉ hiển thị sạc khi Arduino nhận tín hiệu xác nhận từ mạch đo / quản lý sạc.'}
            </p>
          </div>

          {/* CỘT 3: TẢI TIÊU THỤ (ĐÈN LED ĐƯỜNG) */}
          <div className="bg-slate-50/90 rounded-xl p-3 border border-slate-200 flex flex-col justify-between text-xs space-y-2">
            <div>
              <span className="font-bold text-slate-600 block uppercase tracking-wider text-[10px]">
                3. Tải tiêu thụ năng lượng
              </span>
              <div className="mt-2 flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center border shadow-2xs ${
                  ledOn
                    ? 'bg-amber-400 text-slate-900 border-amber-500 shadow-amber-200'
                    : 'bg-white text-slate-400 border-slate-300'
                }`}>
                  <Lightbulb className={`w-6 h-6 ${ledOn ? 'fill-amber-300' : ''}`} />
                </div>
                <div>
                  <h5 className="font-extrabold text-slate-900 text-sm">ĐÈN LED ĐƯỜNG</h5>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <span className="text-slate-500 text-[11px]">Nguồn cấp:</span>
                    <span className="font-semibold text-slate-700 text-[11px]">Từ pin lưu trữ chung</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <span className="text-slate-500 text-[11px]">Trạng thái đèn:</span>
              <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                ledOn
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-slate-200 text-slate-600 border border-slate-300'
              }`}>
                {ledOn ? 'ĐÈN BẬT' : 'ĐÈN TẮT'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
