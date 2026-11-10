/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PowerTreeFullState } from '../types';
import { Sun, CloudRain, Car, Zap, Droplets, BatteryCharging, Lightbulb, Image as ImageIcon } from 'lucide-react';

interface PowerTreeModelProps {
  state: PowerTreeFullState;
  onCarTrigger?: () => void;
  onOpenPhoto?: () => void;
}

export const PowerTreeModel: React.FC<PowerTreeModelProps> = ({ state, onCarTrigger, onOpenPhoto }) => {
  const { isSunOn, isRaining, isCarMoving, solar, piezo, water, battery, ledOn } = state;

  // Calculate inner bladder fill height inside bottle
  // Bottle inner cavity runs from y=340 (bottom of neck) down to y=490 (bottom base inside teeth)
  // Height = 150px. Max fill height ~ 130px.
  const innerBagFillHeight = Math.max(8, (water.treeVisualLevel / 100) * 120);
  const innerBagY = 485 - innerBagFillHeight;

  // Underground reservoir fill height
  // Reservoir box: x=470 to 670 (w=200), y=540 to 630 (h=90)
  const reservoirFillHeight = Math.max(4, (water.reservoirVisualLevel / 100) * 75);
  const reservoirY = 625 - reservoirFillHeight;

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-b from-sky-100 via-emerald-50/40 to-slate-100 border border-slate-200 shadow-sm">
      {/* Top badges / Quick Indicators over stage */}
      <div className="absolute top-3 left-4 z-10 flex items-center gap-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/95 backdrop-blur shadow-sm text-emerald-950 border border-emerald-300">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-extrabold text-emerald-800 tracking-tight">POWER TREE</span>
          <span className="text-slate-300">|</span>
          <span className="text-emerald-700 font-bold">Eco Smart Kids</span>
          <span className="text-slate-300 hidden md:inline">·</span>
          <span className="text-slate-600 font-semibold hidden md:inline">We Think. We Create. We Go Green!</span>
        </div>
        <button
          onClick={onOpenPhoto}
          title="Xem ảnh chụp mô hình thật chế tạo từ bình nhựa và vật liệu tái chế"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-white/90 hover:bg-emerald-50 backdrop-blur shadow-xs text-slate-700 hover:text-emerald-700 border border-slate-200 transition-colors cursor-pointer"
        >
          <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
          <span>Đối chiếu ảnh thật</span>
        </button>
      </div>

      <div className="absolute top-3 right-4 z-10 flex items-center gap-2">
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
          state.mode === 'live' 
            ? 'bg-amber-100 text-amber-900 border border-amber-300' 
            : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
        }`}>
          <span>{state.mode === 'live' ? 'Dữ liệu thực tế (Arduino USB)' : 'Dữ liệu mô phỏng STEM'}</span>
        </div>
      </div>

      {/* Main Interactive SVG Canvas */}
      <svg
        viewBox="0 0 1000 660"
        className="w-full h-auto select-none block"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Sky background gradients */}
          <linearGradient id="skyDay" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#bfdbfe" />
            <stop offset="60%" stopColor="#e0f2fe" />
            <stop offset="100%" stopColor="#f0fdf4" />
          </linearGradient>
          <linearGradient id="skyNight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="60%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#1e3a5f" />
          </linearGradient>

          {/* Sun Glow */}
          <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fde047" stopOpacity="1" />
            <stop offset="60%" stopColor="#facc15" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
          </radialGradient>

          {/* Solar Panel Texture Gradient */}
          <linearGradient id="solarCellGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1e3a8a" />
            <stop offset="50%" stopColor="#1d4ed8" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          {/* Leaf Gradients */}
          <linearGradient id="leafGradTop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#15803d" />
          </linearGradient>
          <linearGradient id="leafGradDark" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#16a34a" />
            <stop offset="100%" stopColor="#166534" />
          </linearGradient>

          {/* Transparent Plastic Bottle Gradient */}
          <linearGradient id="bottleGlass" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
            <stop offset="20%" stopColor="#e0f2fe" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.12" />
            <stop offset="80%" stopColor="#e0f2fe" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.45" />
          </linearGradient>

          {/* Inner Bladder Silicone Pouch Gradient (Túi nước màu hơi xanh dương rõ rệt) */}
          <linearGradient id="bladderPouchGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#bae6fd" stopOpacity="0.55" />
            <stop offset="40%" stopColor="#7dd3fc" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.50" />
          </linearGradient>

          {/* Water gradient - Màu nước xanh dương đậm đà, dễ quan sát */}
          <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.95" />
            <stop offset="45%" stopColor="#0284c7" stopOpacity="0.98" />
            <stop offset="100%" stopColor="#0369a1" stopOpacity="1" />
          </linearGradient>

          {/* Piezo cyan glow */}
          <radialGradient id="piezoGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#06b6d4" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#0891b2" stopOpacity="0" />
          </radialGradient>

          {/* LED light cone */}
          <radialGradient id="ledCone" cx="50%" cy="0%" r="80%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.6" />
            <stop offset="60%" stopColor="#fde047" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#facc15" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ================= 1. SKY & WEATHER ================= */}
        <rect
          x="0"
          y="0"
          width="1000"
          height="510"
          fill={isSunOn ? 'url(#skyDay)' : 'url(#skyNight)'}
          className="transition-colors duration-700"
        />

        {/* Stars at night */}
        {!isSunOn && (
          <g opacity="0.75" className="transition-opacity duration-500">
            <circle cx="120" cy="80" r="1.5" fill="#ffffff" />
            <circle cx="240" cy="60" r="2" fill="#fde047" />
            <circle cx="360" cy="95" r="1.5" fill="#ffffff" />
            <circle cx="720" cy="70" r="2" fill="#ffffff" />
            <circle cx="850" cy="110" r="1.5" fill="#fde047" />
            <circle cx="920" cy="50" r="2" fill="#ffffff" />
            <circle cx="620" cy="40" r="1.5" fill="#ffffff" />
            {/* Moon */}
            <path
              d="M 880,50 A 25,25 0 0,0 870,95 A 28,28 0 1,1 880,50 Z"
              fill="#fef08a"
              filter="drop-shadow(0 0 8px rgba(254,240,138,0.7))"
            />
          </g>
        )}

        {/* Sun (when isSunOn is true) */}
        {isSunOn && (
          <g transform="translate(850, 95)" className="transition-all duration-500">
            {/* Outer solar glow */}
            <circle cx="0" cy="0" r="65" fill="url(#sunGlow)" />
            {/* Rotating sun rays */}
            <g className="animate-[spin_24s_linear_infinite]">
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                <line
                  key={deg}
                  x1="0"
                  y1="-38"
                  x2="0"
                  y2="-50"
                  stroke="#f59e0b"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  transform={`rotate(${deg})`}
                />
              ))}
            </g>
            {/* Sun Core */}
            <circle cx="0" cy="0" r="32" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2.5" />
            {/* Sun Rays to Leaves (Photovoltaic Energy Flow) */}
            <path
              d="M -30,20 L -330,120"
              stroke="#facc15"
              strokeWidth="2"
              strokeDasharray="6 6"
              opacity="0.6"
              className="animate-pulse"
            />
            <path
              d="M -25,25 L -350,160"
              stroke="#facc15"
              strokeWidth="2"
              strokeDasharray="6 6"
              opacity="0.6"
              className="animate-pulse"
            />
          </g>
        )}

        {/* Rain Clouds & Animated Raindrops */}
        {isRaining && (
          <g>
            {/* Cloud Left */}
            <g transform="translate(180, 60)">
              <path
                d="M 30,50 A 30,30 0 0,1 80,30 A 40,40 0 0,1 150,35 A 30,30 0 0,1 190,65 A 25,25 0 0,1 170,90 L 40,90 A 25,25 0 0,1 30,50 Z"
                fill="#94a3b8"
                opacity="0.85"
              />
            </g>
            {/* Cloud Center-Right */}
            <g transform="translate(480, 50)">
              <path
                d="M 30,50 A 35,35 0 0,1 85,25 A 45,45 0 0,1 165,30 A 35,35 0 0,1 210,65 A 30,30 0 0,1 190,95 L 40,95 A 30,30 0 0,1 30,50 Z"
                fill="#64748b"
                opacity="0.9"
              />
            </g>

            {/* Falling Raindrops along roads and gutters */}
            <g stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" opacity="0.8">
              {[
                { x: 100, y: 150 }, { x: 140, y: 220 }, { x: 180, y: 170 }, { x: 230, y: 260 },
                { x: 280, y: 190 }, { x: 320, y: 270 }, { x: 360, y: 200 }, { x: 420, y: 280 },
                { x: 580, y: 210 }, { x: 640, y: 290 }, { x: 700, y: 180 }, { x: 750, y: 260 },
                { x: 800, y: 200 }, { x: 860, y: 270 }, { x: 910, y: 190 }, { x: 950, y: 280 },
              ].map((drop, i) => (
                <line
                  key={i}
                  x1={drop.x}
                  y1={drop.y}
                  x2={drop.x - 4}
                  y2={drop.y + 14}
                  className="animate-pulse"
                />
              ))}
            </g>
          </g>
        )}

        {/* ================= 2. ROADS, CARS & PIEZO ================= */}
        {/* Road Surface (Runs left to right behind and flanking tree) */}
        <g id="roadsAndSidewalks">
          {/* Ground / Grass Meadow */}
          <rect x="0" y="475" width="1000" height="40" fill="#86efac" />
          <path d="M 0,480 Q 250,470 500,480 T 1000,475 L 1000,515 L 0,515 Z" fill="#4ade80" stroke="#16a34a" strokeWidth="2" />

          {/* Left Road: x=0 to 380, y=490 to 535 */}
          <rect x="0" y="490" width="370" height="45" fill="#334155" stroke="#1e293b" strokeWidth="2" />
          {/* Right Road: x=630 to 1000, y=490 to 535 */}
          <rect x="630" y="490" width="370" height="45" fill="#334155" stroke="#1e293b" strokeWidth="2" />

          {/* Road Lane Dashes (Left) - Đậm hơn */}
          <line x1="20" y1="512" x2="350" y2="512" stroke="#f8fafc" strokeWidth="3.5" strokeDasharray="16 12" />
          {/* Road Lane Dashes (Right) - Đậm hơn */}
          <line x1="650" y1="512" x2="980" y2="512" stroke="#f8fafc" strokeWidth="3.5" strokeDasharray="16 12" />

          {/* Road Curbs & Sidewalks */}
          <rect x="0" y="485" width="370" height="5" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
          <rect x="630" y="485" width="370" height="5" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />

          {/* Rain Gutters & Drainage Grates (Rãnh thu nước mặt đường) */}
          {/* Left Gutter */}
          <g transform="translate(320, 520)">
            <rect x="0" y="0" width="40" height="12" fill="#0f172a" stroke="#64748b" strokeWidth="2" rx="2" />
            <line x1="5" y1="2" x2="5" y2="10" stroke="#94a3b8" strokeWidth="2" />
            <line x1="12" y1="2" x2="12" y2="10" stroke="#94a3b8" strokeWidth="2" />
            <line x1="19" y1="2" x2="19" y2="10" stroke="#94a3b8" strokeWidth="2" />
            <line x1="26" y1="2" x2="26" y2="10" stroke="#94a3b8" strokeWidth="2" />
            <line x1="33" y1="2" x2="33" y2="10" stroke="#94a3b8" strokeWidth="2" />
            {isRaining && (
              <path d="M 20,-6 L 20,4" stroke="#0284c7" strokeWidth="2.5" strokeDasharray="3 2" className="animate-pulse" />
            )}
            <text x="20" y="24" textAnchor="middle" fill="#0369a1" fontSize="9.5" fontWeight="900">Rãnh thu gom</text>
          </g>

          {/* Right Gutter */}
          <g transform="translate(640, 520)">
            <rect x="0" y="0" width="40" height="12" fill="#0f172a" stroke="#64748b" strokeWidth="2" rx="2" />
            <line x1="5" y1="2" x2="5" y2="10" stroke="#94a3b8" strokeWidth="2" />
            <line x1="12" y1="2" x2="12" y2="10" stroke="#94a3b8" strokeWidth="2" />
            <line x1="19" y1="2" x2="19" y2="10" stroke="#94a3b8" strokeWidth="2" />
            <line x1="26" y1="2" x2="26" y2="10" stroke="#94a3b8" strokeWidth="2" />
            <line x1="33" y1="2" x2="33" y2="10" stroke="#94a3b8" strokeWidth="2" />
            {isRaining && (
              <path d="M 20,-6 L 20,4" stroke="#0284c7" strokeWidth="2.5" strokeDasharray="3 2" className="animate-pulse" />
            )}
            <text x="20" y="24" textAnchor="middle" fill="#0369a1" fontSize="9.5" fontWeight="900">Rãnh thu gom</text>
          </g>

          {/* Gutter drainage pipes sloping toward underground reservoir */}
          <path
            d="M 340,532 L 360,560 L 470,570"
            fill="none"
            stroke={isRaining ? '#0284c7' : '#475569'}
            strokeWidth="4.5"
            strokeDasharray={isRaining ? '5 3' : 'none'}
            className={isRaining ? 'animate-pulse' : ''}
          />
          <path
            d="M 660,532 L 640,560 L 610,570"
            fill="none"
            stroke={isRaining ? '#0284c7' : '#475569'}
            strokeWidth="4.5"
            strokeDasharray={isRaining ? '5 3' : 'none'}
            className={isRaining ? 'animate-pulse' : ''}
          />
        </g>

        {/* PIEZO SENSOR PADS (Tấm áp điện dưới lòng đường) */}
        {/* Left Piezo Pad: x=170, y=500 */}
        <g id="piezoLeft" transform="translate(170, 502)">
          <rect
            x="0"
            y="0"
            width="55"
            height="20"
            rx="3"
            fill="#0891b2"
            stroke="#22d3ee"
            strokeWidth={piezo.hasSignal ? '3' : '2'}
          />
          <text x="27" y="13.5" textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="900">PIEZO</text>

          {/* Piezo electrical signal pulse ripple effect */}
          {piezo.hasSignal && (
            <g>
              <ellipse cx="27" cy="10" rx="36" ry="16" fill="url(#piezoGlow)" className="animate-ping" />
              <path d="M 27,20 L 27,55 L 430,55" fill="none" stroke="#0891b2" strokeWidth="2.5" strokeDasharray="4 2" />
              <text x="27" y="-6" textAnchor="middle" fill="#0891b2" fontSize="10.5" fontWeight="900">⚡ XUNG ĐIỆN!</text>
            </g>
          )}
        </g>

        {/* Right Piezo Pad: x=780, y=502 */}
        <g id="piezoRight" transform="translate(780, 502)">
          <rect
            x="0"
            y="0"
            width="55"
            height="20"
            rx="3"
            fill="#0891b2"
            stroke="#22d3ee"
            strokeWidth="2"
          />
          <text x="27" y="13.5" textAnchor="middle" fill="#ffffff" fontSize="9.5" fontWeight="900">PIEZO</text>
        </g>

        {/* TOY CAR MODEL (Xe ô tô mô hình chạy qua Piezo) */}
        <g
          id="toyCar"
          className="transition-transform duration-1000 ease-in-out cursor-pointer"
          style={{
            transform: isCarMoving ? 'translateX(190px)' : 'translateX(0px)',
          }}
          onClick={onCarTrigger}
        >
          {/* Car Body (Red Sports Toy Car) */}
          <g transform="translate(40, 484)">
            <title>Nhấn vào xe để chạy qua tấm Piezo!</title>
            {/* Shadow */}
            <ellipse cx="40" cy="28" rx="35" ry="5" fill="#0f172a" opacity="0.35" />
            {/* Main Chassis - Đậm nét */}
            <path
              d="M 10,24 L 70,24 Q 75,24 75,20 L 72,14 Q 70,12 60,11 L 45,6 Q 42,5 30,5 L 20,11 Q 14,14 10,18 Z"
              fill="#ef4444"
              stroke="#991b1b"
              strokeWidth="2.5"
            />
            {/* Windows */}
            <path d="M 22,12 L 31,7 L 44,7 L 45,12 Z" fill="#93c5fd" stroke="#1d4ed8" strokeWidth="1.2" opacity="0.9" />
            <path d="M 48,12 L 48,7 L 58,12 Z" fill="#93c5fd" stroke="#1d4ed8" strokeWidth="1.2" opacity="0.9" />
            {/* Headlights */}
            <circle cx="73" cy="18" r="2.5" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
            {/* Wheels */}
            <circle cx="24" cy="24" r="6" fill="#0f172a" stroke="#475569" strokeWidth="2.5" />
            <circle cx="24" cy="24" r="2" fill="#cbd5e1" />
            <circle cx="62" cy="24" r="6" fill="#0f172a" stroke="#475569" strokeWidth="2.5" />
            <circle cx="62" cy="24" r="2" fill="#cbd5e1" />
          </g>
        </g>

        {/* Secondary Static Car on Right Road */}
        <g transform="translate(870, 484)">
          {/* Blue Toy Car */}
          <ellipse cx="35" cy="28" rx="30" ry="5" fill="#0f172a" opacity="0.35" />
          <path
            d="M 10,24 L 65,24 Q 70,24 70,20 L 67,14 Q 65,12 55,11 L 42,6 Q 39,5 30,5 L 20,11 Q 14,14 10,18 Z"
            fill="#3b82f6"
            stroke="#1e3a8a"
            strokeWidth="2.5"
          />
          <path d="M 22,12 L 30,7 L 42,7 L 43,12 Z" fill="#e0f2fe" stroke="#1e40af" strokeWidth="1.2" opacity="0.9" />
          <circle cx="22" cy="24" r="5.5" fill="#0f172a" stroke="#475569" strokeWidth="2.5" />
          <circle cx="56" cy="24" r="5.5" fill="#0f172a" stroke="#475569" strokeWidth="2.5" />
        </g>

        {/* ================= 3. STREET LAMPS (ĐÈN ĐƯỜNG LED) ================= */}
        {/* Left Streetlight */}
        <g transform="translate(100, 395)">
          {/* Post */}
          <rect x="0" y="0" width="6" height="92" fill="#475569" stroke="#1e293b" strokeWidth="1.5" rx="2" />
          {/* Curved Arm */}
          <path d="M 3,0 Q 3,-25 25,-25 L 35,-25" fill="none" stroke="#334155" strokeWidth="5" strokeLinecap="round" />
          {/* Lamp Fixture */}
          <path d="M 30,-28 L 44,-28 L 40,-20 L 34,-20 Z" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
          {/* LED Emitter */}
          <ellipse cx="37" cy="-20" rx="3.5" ry="1.5" fill={ledOn ? '#fef08a' : '#94a3b8'} />
          {/* Light Cone Glow (When LED is ON) */}
          {ledOn && (
            <polygon
              points="34,-19 40,-19 80,95 -10,95"
              fill="url(#ledCone)"
              opacity="0.85"
            />
          )}
        </g>

        {/* Right Streetlight */}
        <g transform="translate(890, 395)">
          <rect x="0" y="0" width="6" height="92" fill="#475569" stroke="#1e293b" strokeWidth="1.5" rx="2" />
          <path d="M 3,0 Q 3,-25 -20,-25 L -30,-25" fill="none" stroke="#334155" strokeWidth="5" strokeLinecap="round" />
          <path d="M -39,-28 L -25,-28 L -29,-20 L -35,-20 Z" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
          <ellipse cx="-32" cy="-20" rx="3.5" ry="1.5" fill={ledOn ? '#fef08a' : '#94a3b8'} />
          {ledOn && (
            <polygon
              points="-35,-19 -29,-19 15,95 -75,95"
              fill="url(#ledCone)"
              opacity="0.85"
            />
          )}
        </g>

        {/* ================= 3B. HỆ THỐNG PIN LƯU TRỮ CHUNG & SƠ ĐỒ NGUYÊN LÝ NĂNG LƯỢNG ================= */}
        <g id="commonBatteryAndEnergyFlow">
          {/* 1. Tuyến dây Solar -> Mạch quản lý sạc -> Pin lưu trữ */}
          <g id="solarToBatteryCircuit">
            {/* Dây từ tán cây dẫn xuống mạch sạc */}
            <path
              d="M 470,320 L 440,350 L 440,385"
              fill="none"
              stroke={solar.status === 'generating' ? '#f59e0b' : '#64748b'}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {solar.status === 'generating' && (
              <path
                d="M 470,320 L 440,350 L 440,385"
                fill="none"
                stroke="#fef08a"
                strokeWidth="2"
                strokeDasharray="4 4"
                className="animate-pulse"
              />
            )}

            {/* Hộp Mạch Quản Lý Sạc Solar */}
            <g transform="translate(440, 395)">
              <rect x="-18" y="-9" width="36" height="18" rx="3.5" fill="#ffffff" stroke="#f59e0b" strokeWidth="2" />
              <text x="0" y="3.5" textAnchor="middle" fill="#b45309" fontSize="6.5" fontWeight="900">MẠCH SẠC</text>
            </g>

            {/* Dây từ Mạch sạc vào Pin lưu trữ */}
            <path
              d="M 440,405 L 440,428 L 425,434"
              fill="none"
              stroke={solar.status === 'generating' ? '#f59e0b' : '#64748b'}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {solar.status === 'generating' && (
              <path
                d="M 440,405 L 440,428 L 425,434"
                fill="none"
                stroke="#fef08a"
                strokeWidth="2"
                strokeDasharray="4 4"
                className="animate-pulse"
              />
            )}
          </g>

          {/* 2. Tuyến dây Piezo -> Mạch thu năng lượng -> Pin lưu trữ (Minh họa mục tiêu thu hồi) */}
          <g id="piezoToHarvesterCircuit">
            {/* Dây từ tấm Piezo bên trái sang mạch thu */}
            <path
              d="M 225,512 L 270,512 L 270,480"
              fill="none"
              stroke={piezo.hasSignal ? '#06b6d4' : '#64748b'}
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Hộp Mạch Thu Năng Lượng Piezo */}
            <g transform="translate(270, 470)">
              <rect x="-20" y="-9" width="40" height="18" rx="3.5" fill="#ffffff" stroke="#0891b2" strokeWidth="2" />
              <text x="0" y="3.5" textAnchor="middle" fill="#0e7490" fontSize="6" fontWeight="900">MẠCH THU</text>
              {piezo.hasSignal && (
                <circle cx="0" cy="0" r="14" fill="none" stroke="#22d3ee" strokeWidth="2" className="animate-ping" />
              )}
            </g>

            {/* Đường dây nét đứt minh họa hướng nghiên cứu tích hợp vào pin chung */}
            <path
              d="M 290,470 L 392,460"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2"
              strokeDasharray="4 3"
              className={piezo.hasSignal ? 'animate-pulse' : ''}
            />
            <text x="340" y="464" textAnchor="middle" fill="#0891b2" fontSize="6.5" fontWeight="800">
              (Mục tiêu thu hồi năng lượng)
            </text>
          </g>

          {/* 3. Tuyến dây Pin lưu trữ -> Đèn LED đường */}
          <g id="batteryToLedCircuit">
            <path
              d="M 392,455 L 103,455 L 103,440"
              fill="none"
              stroke={ledOn ? '#facc15' : '#64748b'}
              strokeWidth={ledOn ? '2.5' : '1.5'}
              strokeLinecap="round"
            />
            {ledOn && (
              <path
                d="M 392,455 L 103,455 L 103,440"
                fill="none"
                stroke="#fef08a"
                strokeWidth="2"
                strokeDasharray="6 4"
                className="animate-pulse"
              />
            )}
            <text x="210" y="450" fill={ledOn ? '#b45309' : '#64748b'} fontSize="7.5" fontWeight="900">
              ⚡ Cấp điện cho Đèn LED ({ledOn ? 'BẬT' : 'TẮT'})
            </text>
          </g>

          {/* 4. KHỐI BIỂU TƯỢNG PIN LƯU TRỮ CHUNG */}
          <g id="commonBatteryUnit" transform="translate(415, 452)">
            {/* Đế đỡ hộp pin */}
            <rect x="-24" y="19" width="48" height="6" rx="2" fill="#334155" stroke="#0f172a" strokeWidth="1.5" />

            {/* Khối thân Pin lưu trữ */}
            <rect
              x="-22"
              y="-17"
              width="44"
              height="36"
              rx="4"
              fill="#0f172a"
              stroke={battery === 'charging' ? '#10b981' : battery === 'discharging' ? '#f59e0b' : '#64748b'}
              strokeWidth="2.5"
            />

            {/* Cọc đấu nối điện cực (+) và (-) trên nắp pin */}
            <rect x="-14" y="-22" width="7" height="5" rx="1" fill="#ef4444" stroke="#991b1b" strokeWidth="1" />
            <text x="-10.5" y="-18" textAnchor="middle" fill="#ffffff" fontSize="5" fontWeight="900">+</text>

            <rect x="7" y="-22" width="7" height="5" rx="1" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1" />
            <text x="10.5" y="-18" textAnchor="middle" fill="#ffffff" fontSize="5" fontWeight="900">-</text>

            {/* Màn hình hiển thị trạng thái trên mặt trước pin */}
            <rect x="-18" y="-12" width="36" height="24" rx="2.5" fill="#1e293b" stroke="#334155" strokeWidth="1" />

            {/* Biểu tượng pin & Trạng thái */}
            <g transform="translate(-13, -7)">
              <rect x="0" y="0" width="16" height="10" rx="2" fill="none" stroke="#e2e8f0" strokeWidth="1.2" />
              <rect x="16" y="2.5" width="2" height="5" rx="0.5" fill="#e2e8f0" />
              {/* Vạch nạp bên trong */}
              {battery === 'charging' ? (
                <rect x="2" y="2" width="12" height="6" rx="1" fill="#10b981" className="animate-pulse" />
              ) : battery === 'discharging' ? (
                <rect x="2" y="2" width="8" height="6" rx="1" fill="#f59e0b" />
              ) : battery === 'idle' ? (
                <rect x="2" y="2" width="6" height="6" rx="1" fill="#94a3b8" />
              ) : null}
            </g>

            {/* Đèn LED trạng thái trên hộp pin */}
            <circle
              cx="10"
              cy="-2"
              r="2.5"
              fill={battery === 'charging' ? '#10b981' : battery === 'discharging' ? '#f59e0b' : '#94a3b8'}
              className={battery === 'charging' ? 'animate-ping' : ''}
            />

            {/* Nhãn trạng thái hiển thị đơn giản: Đang sạc, Đang cấp điện, Đang chờ, Chưa có dữ liệu */}
            <text x="0" y="9" textAnchor="middle" fill="#ffffff" fontSize="6.5" fontWeight="800">
              {battery === 'charging'
                ? 'ĐANG SẠC'
                : battery === 'discharging'
                ? 'CẤP ĐIỆN'
                : battery === 'idle'
                ? 'ĐANG CHỜ'
                : 'CHƯA CÓ DỮ LIỆU'}
            </text>

            {/* Bảng tên phía dưới chân đế */}
            <rect x="-38" y="26" width="76" height="15" rx="3" fill="#ffffff" stroke="#059669" strokeWidth="1.8" filter="drop-shadow(0 1px 3px rgba(0,0,0,0.1))" />
            <text x="0" y="36.5" textAnchor="middle" fill="#065f46" fontSize="7" fontWeight="900">
              PIN LƯU TRỮ CHUNG
            </text>
          </g>
        </g>

        {/* ================= 4. UNDERGROUND SYSTEM (BỂ THU GOM & MÁY BƠM) ================= */}
        <g id="undergroundSystem">
          {/* Soil / Ground Cutaway Background: y=530 to 660 */}
          <rect x="0" y="535" width="1000" height="125" fill="#e2e8f0" />
          {/* Cross-section texture lines - Đậm hơn */}
          <path d="M 0,535 L 1000,535" stroke="#94a3b8" strokeWidth="2.5" />

          {/* Reservoir Outer Shell: x=410, y=545, w=200, h=95 - Đậm nét hơn */}
          <rect
            x="400"
            y="545"
            width="200"
            height="95"
            rx="6"
            fill="#f8fafc"
            stroke="#0284c7"
            strokeWidth="3.5"
          />
          {/* Reservoir Label */}
          <text x="500" y="561" textAnchor="middle" fill="#0369a1" fontSize="11" fontWeight="900">
            BỂ THU GOM NƯỚC MƯA
          </text>

          {/* Water inside Underground Reservoir */}
          {reservoirFillHeight > 0 && (
            <rect
              x="403"
              y={reservoirY}
              width="194"
              height={reservoirFillHeight}
              fill="url(#waterGrad)"
              rx="4"
              className="transition-all duration-300"
            />
          )}

          {/* Water Surface Wave Highlight */}
          {reservoirFillHeight > 4 && (
            <line
              x1="404"
              y1={reservoirY}
              x2="596"
              y2={reservoirY}
              stroke="#bae6fd"
              strokeWidth="2.5"
            />
          )}

          {/* Float Switch 1: Phao Mức Thấp (lowFloat) at y=605 - Đậm hơn */}
          <g transform="translate(425, 600)">
            {/* Guide rod */}
            <line x1="0" y1="-30" x2="0" y2="25" stroke="#475569" strokeWidth="2" />
            {/* Float Ball */}
            <circle
              cx="0"
              cy={water.lowFloat ? -12 : 12}
              r="7"
              fill={water.lowFloat ? '#10b981' : '#f59e0b'}
              stroke="#0f172a"
              strokeWidth="1.8"
              className="transition-transform duration-300"
            />
            <text x="13" y="3.5" fill="#0f172a" fontSize="9.5" fontWeight="700">
              Phao Thấp {water.lowFloat ? '(Đạt)' : ''}
            </text>
          </g>

          {/* Float Switch 2: Phao Mức Cao (highFloat) at y=575 - Đậm hơn */}
          <g transform="translate(425, 570)">
            <circle
              cx="0"
              cy={water.highFloat ? -8 : 10}
              r="7"
              fill={water.highFloat ? '#0284c7' : '#94a3b8'}
              stroke="#0f172a"
              strokeWidth="1.8"
              className="transition-transform duration-300"
            />
            <text x="13" y="3" fill="#0f172a" fontSize="9.5" fontWeight="700">
              Phao Cao {water.highFloat ? '(Kích hoạt bơm)' : ''}
            </text>
          </g>

          {/* Mini Water Pump at Reservoir Bottom Right: x=540, y=605 - Đậm hơn */}
          <g transform="translate(545, 605)">
            <rect x="0" y="0" width="38" height="24" rx="4" fill="#0f172a" stroke="#0284c7" strokeWidth="2.5" />
            <circle cx="19" cy="12" r="6.5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1" className={water.pumpRunning ? 'animate-spin' : ''} />
            <text x="19" y="33" textAnchor="middle" fill="#0f172a" fontSize="9" fontWeight="900">
              BƠM MINI
            </text>
            {/* Pump Running Indicator */}
            {water.pumpRunning && (
              <circle cx="19" cy="12" r="14" fill="none" stroke="#0284c7" strokeWidth="2" className="animate-ping" />
            )}
          </g>

          {/* Water Pipe running from pump UP into tree bladder - Đậm hơn */}
          <path
            d="M 563,605 L 563,535 L 515,505 L 515,350 L 500,350"
            fill="none"
            stroke={water.pumpRunning ? '#0284c7' : '#64748b'}
            strokeWidth="5.5"
            strokeLinecap="round"
          />

          {/* Animated Water flow bubbles in pipe when pump is running */}
          {water.pumpRunning && (
            <path
              d="M 563,605 L 563,535 L 515,505 L 515,350 L 500,350"
              fill="none"
              stroke="#bae6fd"
              strokeWidth="3"
              strokeDasharray="6 6"
              className="animate-pulse"
            />
          )}
        </g>

        {/* ================= 5. THE CENTRAL POWER TREE ================= */}
        {/*
          Tái hiện chính xác theo ảnh mô hình thật:
          - Tán cây gồm các phiến lá xanh lớn, dài, xếp nhiều tầng xòe sang các hướng, dáng cong tự nhiên có răng cưa.
          - 3 tấm pin mặt trời nhỏ gắn hài hòa trên các phiến lá đón nắng.
          - Cổ bình hẹp có các rãnh ren xoắn.
          - Thân bình nhựa trong suốt cố định: cổ hẹp, phần giữa phình bầu, đáy thu nhỏ.
          - Túi chứa nước trong suốt bên trong bình, quan sát rõ mực nước dâng hạ (không làm biến dạng vỏ bình).
          - Gốc bình được trang trí bằng vòng các lá xanh nhỏ ôm quanh đáy.
          - Không che khuất xe ô tô, tấm Piezo, đèn đường hay bể ngầm.
        */}
        <g id="powerTreeObject" transform="translate(500, 0)">
          {/* ---- A. GỐC BÌNH & VÒNG LÁ XANH NHỎ TRANG TRÍ (Đáy thu nhỏ) ---- */}
          {/* Đáy bình hẹp: x=-32..32, y=478..494 */}
          <rect x="-32" y="476" width="64" height="20" rx="5" fill="#f8fafc" stroke="#475569" strokeWidth="2" />

          {/* ---- B. TÚI CHỨA NƯỚC BÊN TRONG BÌNH (MÀU HƠI XANH DƯƠNG RÕ NÉT) ---- */}
          <g id="innerWaterBladder">
            {/* Đường bao túi chứa dẻo màu hơi xanh dương rõ rệt quan sát dễ dàng */}
            <path
              d="M -10,345 
                 Q -12,375 -36,405
                 Q -50,435 -48,460
                 Q -46,478 -24,480
                 L 24,480
                 Q 46,478 48,460
                 Q 50,435 36,405
                 Q 12,375 10,345 Z"
              fill="url(#bladderPouchGrad)"
              stroke="#0284c7"
              strokeWidth="2.5"
            />
            {/* Viền gân dẻo của túi nước */}
            <path
              d="M -8,350 Q -10,375 -32,405 Q -45,435 -44,458 Q -42,474 -22,476 L 22,476 Q 42,474 44,458 Q 45,435 32,405 Q 10,375 8,350 Z"
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="1.5"
              strokeDasharray="4 2"
              opacity="0.85"
            />

            {/* Vùng cắt (Clip-path) chứa nước bên trong túi */}
            <clipPath id="innerBladderClip">
              <path
                d="M -10,345 
                   Q -12,375 -36,405
                   Q -50,435 -48,460
                   Q -46,478 -24,480
                   L 24,480
                   Q 46,478 48,460
                   Q 50,435 36,405
                   Q 12,375 10,345 Z"
              />
            </clipPath>

            {/* Mực nước dâng hạ bên trong túi chứa - Màu xanh dương đậm đà nổi bật */}
            <g clipPath="url(#innerBladderClip)">
              <rect
                x="-55"
                y={innerBagY}
                width="110"
                height={innerBagFillHeight + 10}
                fill="url(#waterGrad)"
                className="transition-all duration-300"
              />
              {/* Vệt sáng mặt nước gợn sóng */}
              <ellipse
                cx="0"
                cy={innerBagY}
                rx="34"
                ry="3.5"
                fill="#bae6fd"
                opacity="0.9"
              />
            </g>

            {/* Phao báo đầy bên trong túi thân cây tại y=365 - Đậm nét hơn */}
            <g transform="translate(0, 365)">
              <line x1="-10" y1="0" x2="10" y2="0" stroke="#0f172a" strokeWidth="1.5" strokeDasharray="3 1" />
              <circle
                cx="0"
                cy={water.fullFloat ? -4 : 6}
                r="5.5"
                fill={water.fullFloat ? '#ef4444' : '#10b981'}
                stroke="#0f172a"
                strokeWidth="1.8"
                className="transition-transform duration-300"
              />
              <text x="13" y="3.5" fill="#0f172a" fontSize="8.5" fontWeight="900">
                Phao Đầy {water.fullFloat ? '(ĐÃ ĐẦY)' : ''}
              </text>
            </g>
          </g>

          {/* ---- C. THÂN BÌNH NHỰA TRONG SUỐT (DÁNG BẦU, CỔ HẸP, ĐÁY THU NHỎ) ---- */}
          {/* Vỏ bình CỐ ĐỊNH 100%, nét vẽ đậm đà 3px */}
          <path
            d="M -14,335 
               L -14,345
               Q -16,375 -44,400
               Q -58,425 -58,450
               Q -58,472 -32,482
               L 32,482
               Q 58,472 58,450
               Q 58,425 44,400
               Q 16,375 14,345
               L 14,335 Z"
            fill="url(#bottleGlass)"
            stroke="#2563eb"
            strokeWidth="3"
            filter="drop-shadow(0 4px 8px rgba(0,0,0,0.15))"
          />

          {/* Các đường gân phản quang dọc thân bình nhựa */}
          <path
            d="M -46,420 Q -52,445 -36,470"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3.5"
            strokeLinecap="round"
            opacity="0.75"
          />
          <path
            d="M -10,345 L -10,365 Q -28,390 -38,415"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.6"
          />
          <path
            d="M 44,420 Q 50,445 34,470"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.5"
          />

          {/* Cổ bình hẹp có các rãnh ren xoắn (Screw Threads) - Đậm nét hơn */}
          <g id="bottleNeckWithThreads">
            <rect x="-14" y="295" width="28" height="40" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2.5" rx="2" />
            <line x1="-14" y1="304" x2="14" y2="304" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="-14" y1="314" x2="14" y2="314" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="-14" y1="324" x2="14" y2="324" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" />
            {/* Miệng bình (Mouth rim) */}
            <ellipse cx="0" cy="295" rx="14" ry="3" fill="#bae6fd" stroke="#0284c7" strokeWidth="2" />
          </g>

          {/* ---- D. PHẦN GỐC BÌNH ĐƯỢC TRANG TRÍ BẰNG CÁC LÁ XANH NHỎ ---- */}
          <g id="baseSmallLeaves" transform="translate(0, 480)">
            {/* Lớp lá xanh đậm phía sau - Nét đậm 1.8px */}
            <path
              d="M -34,4 
                 L -30,-14 L -24,2 
                 L -18,-18 L -12,2 
                 L -6,-22 L 0,2 
                 L 6,-22 L 12,2 
                 L 18,-18 L 24,2 
                 L 30,-14 L 34,4 Z"
              fill="#15803d"
              stroke="#052e16"
              strokeWidth="1.8"
            />
            {/* Lớp lá xanh non phía trước với các ngọn lá hơi cong tự nhiên - Nét đậm 2.2px */}
            <path
              d="M -36,8 
                 L -32,-8 L -26,6 
                 L -20,-12 L -14,6 
                 L -8,-15 L -2,6 
                 L 4,-16 L 10,6 
                 L 16,-12 L 22,6 
                 L 28,-8 L 36,8 Z"
              fill="#22c55e"
              stroke="#14532d"
              strokeWidth="2.2"
            />
            {/* Đai nẹp chân gốc màu xanh nhạt */}
            <rect x="-35" y="6" width="70" height="8" rx="3" fill="#4ade80" stroke="#14532d" strokeWidth="2" />
          </g>

          {/* ---- E. TÁN CÂY: CÁC LÁ XANH LỚN, DÀI, XÒE NHIỀU HƯỚNG, XẾP NHIỀU TẦNG ---- */}
          <g id="organicMultiTierCanopy" transform="translate(0, 295)">
            {/* === TẦNG 1: CÁC LÁ PHÍA SAU (Màu xanh đậm, vươn rộng, nét đậm 2.2px) === */}
            {/* Lá 1.1: Xòe xa sang trái phía sau */}
            <path
              d="M -4,-2 
                 C -35,-8 -75,-2 -115,14
                 C -135,22 -155,34 -175,48
                 L -168,43 L -165,36 L -150,30 L -145,24 L -130,18 L -115,10
                 C -75,-6 -40,-12 -2,-4 Z"
              fill="url(#leafGradDark)"
              stroke="#052e16"
              strokeWidth="2.2"
            />
            {/* Lá 1.2: Xòe xa sang phải phía sau */}
            <path
              d="M 4,-2 
                 C 35,-8 75,-2 115,14
                 C 135,22 155,34 175,48
                 L 168,43 L 165,36 L 150,30 L 145,24 L 130,18 L 115,10
                 C 75,-6 40,-12 2,-4 Z"
              fill="url(#leafGradDark)"
              stroke="#052e16"
              strokeWidth="2.2"
            />
            {/* Lá 1.3: Vươn cao phía sau bên trái */}
            <path
              d="M -6,-6 
                 C -25,-40 -50,-85 -70,-130
                 C -78,-148 -88,-168 -95,-188
                 L -88,-172 L -82,-160 L -72,-142 L -65,-128 L -52,-105
                 C -38,-72 -20,-38 -3,-8 Z"
              fill="#166534"
              stroke="#052e16"
              strokeWidth="2.2"
            />
            {/* Lá 1.4: Vươn cao phía sau bên phải */}
            <path
              d="M 6,-6 
                 C 25,-40 50,-85 70,-130
                 C 78,-148 88,-168 95,-188
                 L 88,-172 L 82,-160 L 72,-142 L 65,-128 L 52,-105
                 C 38,-72 20,-38 3,-8 Z"
              fill="#166534"
              stroke="#052e16"
              strokeWidth="2.2"
            />

            {/* === TẦNG 2: 5 LÁ Ở GIỮA CONG CONG NHƯ CÂY TỰ NHIÊN (Màu xanh tươi sáng, nét đậm 2.5px) === */}
            {/* Lá 2.1: Lá sải cánh bên trái uốn lượn cong vút tự nhiên */}
            <g id="leafMidLeft">
              <path
                d="M -2,0 
                   C -42,-28 -88,-32 -130,-18
                   C -155,-10 -178,5 -196,24
                   C -188,18 -182,10 -174,6
                   L -166,12 L -158,4 L -150,10 L -140,2 L -130,6
                   L -116,-2 L -100,-10 L -76,-18 L -48,-18 L -2,-4 Z"
                fill="url(#leafGradTop)"
                stroke="#052e16"
                strokeWidth="2.5"
              />
              {/* Gân chính cong theo thân lá */}
              <path
                d="M -2,-2 C -48,-24 -105,-20 -190,22"
                fill="none"
                stroke="#86efac"
                strokeWidth="2.6"
                strokeLinecap="round"
                opacity="0.9"
              />
              {/* Các gân phụ nhỏ */}
              <line x1="-50" y1="-19" x2="-62" y2="-28" stroke="#86efac" strokeWidth="1.4" opacity="0.75" />
              <line x1="-85" y1="-16" x2="-100" y2="-25" stroke="#86efac" strokeWidth="1.4" opacity="0.75" />
              <line x1="-125" y1="-8" x2="-142" y2="-15" stroke="#86efac" strokeWidth="1.4" opacity="0.75" />
              <line x1="-155" y1="5" x2="-170" y2="0" stroke="#86efac" strokeWidth="1.4" opacity="0.75" />
            </g>

            {/* Lá 2.2: Lá sải cánh bên phải uốn lượn cong vút tự nhiên */}
            <g id="leafMidRight">
              <path
                d="M 2,0 
                   C 42,-28 88,-32 130,-18
                   C 155,-10 178,5 196,24
                   C 188,18 182,10 174,6
                   L 166,12 L 158,4 L 150,10 L 140,2 L 130,6
                   L 116,-2 L 100,-10 L 76,-18 L 48,-18 L 2,-4 Z"
                fill="url(#leafGradTop)"
                stroke="#052e16"
                strokeWidth="2.5"
              />
              <path
                d="M 2,-2 C 48,-24 105,-20 190,22"
                fill="none"
                stroke="#86efac"
                strokeWidth="2.6"
                strokeLinecap="round"
                opacity="0.9"
              />
              <line x1="50" y1="-19" x2="62" y2="-28" stroke="#86efac" strokeWidth="1.4" opacity="0.75" />
              <line x1="85" y1="-16" x2="100" y2="-25" stroke="#86efac" strokeWidth="1.4" opacity="0.75" />
              <line x1="125" y1="-8" x2="142" y2="-15" stroke="#86efac" strokeWidth="1.4" opacity="0.75" />
              <line x1="155" y1="5" x2="170" y2="0" stroke="#86efac" strokeWidth="1.4" opacity="0.75" />
            </g>

            {/* Lá 2.3: Lá chính giữa uốn lượn duyên dáng vươn cao (Mang Tấm Pin 2) */}
            <g id="leafTopCenter">
              <path
                d="M 0,-4 
                   C -16,-30 -28,-65 -30,-105
                   C -31,-125 -27,-150 -20,-175
                   L -26,-165 L -19,-155 L -25,-145 L -18,-135 L -26,-120 L -20,-105
                   C -16,-150 -8,-185 0,-218
                   C 8,-185 16,-150 20,-105
                   L 26,-120 L 18,-135 L 25,-145 L 19,-155 L 26,-165
                   C 27,-150 31,-125 30,-105
                   C 28,-65 16,-30 0,-4 Z"
                fill="url(#leafGradTop)"
                stroke="#052e16"
                strokeWidth="2.6"
              />
              {/* Gân chính giữa lá vươn lên đỉnh */}
              <line x1="0" y1="-4" x2="0" y2="-212" stroke="#bbf7d0" strokeWidth="2.8" strokeLinecap="round" />
              {/* Các gân phụ tủa ra 2 bên uốn cong tự nhiên */}
              <path d="M 0,-50 C -10,-60 -18,-68 -24,-72" fill="none" stroke="#86efac" strokeWidth="1.5" opacity="0.8" />
              <path d="M 0,-50 C 10,-60 18,-68 24,-72" fill="none" stroke="#86efac" strokeWidth="1.5" opacity="0.8" />
              <path d="M 0,-90 C -12,-100 -20,-108 -26,-112" fill="none" stroke="#86efac" strokeWidth="1.5" opacity="0.8" />
              <path d="M 0,-90 C 12,-100 20,-108 26,-112" fill="none" stroke="#86efac" strokeWidth="1.5" opacity="0.8" />
              <path d="M 0,-150 C -8,-160 -14,-168 -18,-172" fill="none" stroke="#86efac" strokeWidth="1.5" opacity="0.8" />
              <path d="M 0,-150 C 8,-160 14,-168 18,-172" fill="none" stroke="#86efac" strokeWidth="1.5" opacity="0.8" />
            </g>

            {/* Lá 2.4: Lá nghiêng vươn cao góc 10h uốn cong vòm tự nhiên */}
            <g id="leafHighLeft">
              <path
                d="M -3,-4 
                   C -25,-40 -50,-75 -68,-115
                   C -78,-138 -86,-165 -88,-195
                   C -85,-182 -78,-170 -72,-162
                   L -79,-152 L -72,-142 L -80,-130 L -72,-120 L -79,-108
                   C -62,-80 -40,-45 -1,-6 Z"
                fill="#16a34a"
                stroke="#052e16"
                strokeWidth="2.5"
              />
              <path
                d="M -2,-4 C -28,-45 -58,-95 -85,-190"
                fill="none"
                stroke="#86efac"
                strokeWidth="2.6"
                strokeLinecap="round"
                opacity="0.9"
              />
              <line x1="-30" y1="-50" x2="-44" y2="-62" stroke="#86efac" strokeWidth="1.4" opacity="0.75" />
              <line x1="-50" y1="-95" x2="-68" y2="-108" stroke="#86efac" strokeWidth="1.4" opacity="0.75" />
              <line x1="-68" y1="-140" x2="-82" y2="-152" stroke="#86efac" strokeWidth="1.4" opacity="0.75" />
            </g>

            {/* Lá 2.5: Lá nghiêng vươn cao góc 2h uốn cong vòm tự nhiên */}
            <g id="leafHighRight">
              <path
                d="M 3,-4 
                   C 25,-40 50,-75 68,-115
                   C 78,-138 86,-165 88,-195
                   C 85,-182 78,-170 72,-162
                   L 79,-152 L 72,-142 L 80,-130 L 72,-120 L 79,-108
                   C 62,-80 40,-45 1,-6 Z"
                fill="#16a34a"
                stroke="#052e16"
                strokeWidth="2.5"
              />
              <path
                d="M 2,-4 C 28,-45 58,-95 85,-190"
                fill="none"
                stroke="#86efac"
                strokeWidth="2.6"
                strokeLinecap="round"
                opacity="0.9"
              />
              <line x1="30" y1="-50" x2="44" y2="-62" stroke="#86efac" strokeWidth="1.4" opacity="0.75" />
              <line x1="50" y1="-95" x2="68" y2="-108" stroke="#86efac" strokeWidth="1.4" opacity="0.75" />
              <line x1="68" y1="-140" x2="82" y2="-152" stroke="#86efac" strokeWidth="1.4" opacity="0.75" />
            </g>

            {/* === TẦNG 3: CÁC LÁ PHÍA TRƯỚC RỦ NHẸ & ÔM CỔ BÌNH (Tạo độ nổi bật) === */}
            {/* Lá 3.1: Lá trước bên trái chúc xuống nhẹ qua vai bình */}
            <path
              d="M -2,0 
                 C -25,12 -55,22 -85,28
                 C -105,32 -125,38 -145,46
                 L -138,40 L -134,34 L -120,30 L -114,24 L -98,20
                 C -65,14 -35,6 -1,0 Z"
              fill="#22c55e"
              stroke="#052e16"
              strokeWidth="2.2"
            />
            <path d="M -2,0 C -45,18 -85,26 -140,42" fill="none" stroke="#86efac" strokeWidth="2.2" opacity="0.9" />

            {/* Lá 3.2: Lá trước bên phải chúc xuống nhẹ qua vai bình */}
            <path
              d="M 2,0 
                 C 25,12 55,22 85,28
                 C 105,32 125,38 145,46
                 L 138,40 L 134,34 L 120,30 L 114,24 L 98,20
                 C 65,14 35,6 1,0 Z"
              fill="#22c55e"
              stroke="#052e16"
              strokeWidth="2.2"
            />
            <path d="M 2,0 C 45,18 85,26 140,42" fill="none" stroke="#86efac" strokeWidth="2.2" opacity="0.9" />

            {/* Lá 3.3: Lá ngắn phía trước uốn cong ngay trên miệng chai */}
            <path
              d="M -8,0 
                 C -15,16 -12,32 0,44
                 C 12,32 15,16 8,0 Z"
              fill="#4ade80"
              stroke="#052e16"
              strokeWidth="2"
            />
            <line x1="0" y1="0" x2="0" y2="40" stroke="#ffffff" strokeWidth="1.8" opacity="0.9" />

            {/* === F. 3 TẤM PIN MẶT TRỜI NHỎ BỐ TRÍ CÂN ĐỐI TRÊN TÁN LÁ (PIN 2 NẰM TRÊN LÁ CHÍNH GIỮA) === */}
            {/* TẤM PIN 1 (Phiến lá sải cánh bên trái) */}
            <g transform="translate(-118, -18) rotate(-14)">
              {/* Đế khung nhôm bảo vệ */}
              <rect x="-20" y="-13" width="40" height="26" rx="2.5" fill="#0f172a" stroke="#0f172a" strokeWidth="2.2" />
              {/* Lưới silicon quang điện */}
              <rect x="-18" y="-11" width="36" height="22" rx="1.5" fill="url(#solarCellGrad)" />
              <line x1="-18" y1="0" x2="18" y2="0" stroke="#93c5fd" strokeWidth="1.2" opacity="0.85" />
              <line x1="-6" y1="-11" x2="-6" y2="11" stroke="#93c5fd" strokeWidth="1.2" opacity="0.85" />
              <line x1="6" y1="-11" x2="6" y2="11" stroke="#93c5fd" strokeWidth="1.2" opacity="0.85" />
              {/* Vệt sáng mặt trời khi đang tạo điện */}
              {solar.status === 'generating' && (
                <polygon points="-16,-9 -6,-9 -11,9 -17,9" fill="#ffffff" opacity="0.4" className="animate-pulse" />
              )}
              {/* Chân kẹp gắn vào cuống lá */}
              <rect x="-2.5" y="13" width="5" height="6" fill="#334155" stroke="#0f172a" strokeWidth="1" />
              <text x="0" y="3.5" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="900">PIN 1</text>
            </g>

            {/* TẤM PIN 2 (NẰM TRÊN LÁ CHÍNH GIỮA - CÂN ĐỐI & HÀI HÒA) */}
            <g transform="translate(0, -118)">
              {/* Đế khung nhôm bảo vệ */}
              <rect x="-20" y="-13" width="40" height="26" rx="2.5" fill="#0f172a" stroke="#0f172a" strokeWidth="2.2" />
              {/* Lưới silicon quang điện */}
              <rect x="-18" y="-11" width="36" height="22" rx="1.5" fill="url(#solarCellGrad)" />
              <line x1="-18" y1="0" x2="18" y2="0" stroke="#93c5fd" strokeWidth="1.2" opacity="0.85" />
              <line x1="-6" y1="-11" x2="-6" y2="11" stroke="#93c5fd" strokeWidth="1.2" opacity="0.85" />
              <line x1="6" y1="-11" x2="6" y2="11" stroke="#93c5fd" strokeWidth="1.2" opacity="0.85" />
              {solar.status === 'generating' && (
                <polygon points="-12,-9 -2,-9 -7,9 -15,9" fill="#ffffff" opacity="0.4" className="animate-pulse" />
              )}
              {/* Chân kẹp gắn vào thân lá chính giữa */}
              <rect x="-2.5" y="13" width="5" height="7" fill="#334155" stroke="#0f172a" strokeWidth="1" />
              <text x="0" y="3.5" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="900">PIN 2</text>
            </g>

            {/* TẤM PIN 3 (Phiến lá sải cánh bên phải) */}
            <g transform="translate(118, -18) rotate(14)">
              <rect x="-20" y="-13" width="40" height="26" rx="2.5" fill="#0f172a" stroke="#0f172a" strokeWidth="2.2" />
              <rect x="-18" y="-11" width="36" height="22" rx="1.5" fill="url(#solarCellGrad)" />
              <line x1="-18" y1="0" x2="18" y2="0" stroke="#93c5fd" strokeWidth="1.2" opacity="0.85" />
              <line x1="-6" y1="-11" x2="-6" y2="11" stroke="#93c5fd" strokeWidth="1.2" opacity="0.85" />
              <line x1="6" y1="-11" x2="6" y2="11" stroke="#93c5fd" strokeWidth="1.2" opacity="0.85" />
              {solar.status === 'generating' && (
                <polygon points="-16,-9 -6,-9 -11,9 -17,9" fill="#ffffff" opacity="0.4" className="animate-pulse" />
              )}
              <rect x="-2.5" y="13" width="5" height="6" fill="#334155" stroke="#0f172a" strokeWidth="1" />
              <text x="0" y="3.5" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="900">PIN 3</text>
            </g>
          </g>

        </g>
      </svg>
    </div>
  );
};
