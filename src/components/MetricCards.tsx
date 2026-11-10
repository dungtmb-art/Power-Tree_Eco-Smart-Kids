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

      {/* Secondary Indicators: Battery & LED */}
      <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200 flex flex-wrap items-center justify-around gap-4 text-xs font-medium text-slate-700">
        {/* PIN LƯU TRỮ */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
            {battery === 'charging' ? (
              <BatteryCharging className="w-4 h-4 animate-pulse" />
            ) : battery === 'discharging' ? (
              <BatteryMedium className="w-4 h-4 text-amber-600" />
            ) : (
              <Battery className="w-4 h-4 text-slate-500" />
            )}
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">PIN LƯU TRỮ:</span>
            <span className="font-bold text-slate-800">
              {battery === 'charging'
                ? 'Đang sạc'
                : battery === 'discharging'
                ? 'Đang cấp điện'
                : battery === 'idle'
                ? 'Đang chờ'
                : 'Chưa xác định'}
            </span>
          </div>
        </div>

        <div className="w-px h-6 bg-slate-300 hidden sm:block" />

        {/* ĐÈN LED */}
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
            ledOn ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-500'
          }`}>
            <Lightbulb className={`w-4 h-4 ${ledOn ? 'fill-amber-400 text-amber-500' : ''}`} />
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">ĐÈN LED ĐƯỜNG:</span>
            <span className={`font-bold ${ledOn ? 'text-amber-700' : 'text-slate-600'}`}>
              {ledOn ? 'BẬT' : 'TẮT'}
            </span>
          </div>
        </div>

        <div className="w-px h-6 bg-slate-300 hidden sm:block" />

        {/* NGHIÊN CỨU & BẢO VỆ */}
        <div className="flex items-center gap-1.5 text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="text-slate-600">
            Cơ chế bảo vệ 3 phao: <strong className="text-emerald-700">Chống tràn & Chống chạy khô</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
