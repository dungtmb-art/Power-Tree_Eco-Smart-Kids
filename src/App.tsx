/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { usePowerTreeState } from './hooks/usePowerTreeState';
import { Header } from './components/Header';
import { PowerTreeModel } from './components/PowerTreeModel';
import { MetricCards } from './components/MetricCards';
import { InteractiveControls } from './components/InteractiveControls';
import { StemGuideDrawer } from './components/StemGuideDrawer';
import { Footer } from './components/Footer';
import { X, Image as ImageIcon } from 'lucide-react';

export default function App() {
  const { state, serialLogs, actions } = usePowerTreeState();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* 1. Header (Top Bar 3-Zone Contract) */}
      <Header
        mode={state.mode}
        onSetMode={(m) => actions.setMode(m)}
        onOpenDrawer={() => setIsDrawerOpen(true)}
      />

      {/* 2. Main Dashboard Content Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-5">
        {/* Live Mode Notice Banner when active */}
        {state.mode === 'live' && (
          <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-950">
            <div>
              <strong className="font-bold block sm:inline">Chế độ LIVE kết nối phần cứng Arduino: </strong>
              <span>
                {state.serial.connected
                  ? `Đang kết nối: ${state.serial.portName || 'Arduino USB'}. Dữ liệu trên Dashboard hiển thị theo thời gian thực.`
                  : 'Chưa mở cổng Serial. Hãy nhấn nút "Kết nối Arduino" để liên kết với mô hình thật.'}
              </span>
            </div>
            {!state.serial.connected ? (
              <button
                onClick={actions.connectSerial}
                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors cursor-pointer shrink-0"
              >
                Kết nối USB ngay
              </button>
            ) : (
              <button
                onClick={actions.disconnectSerial}
                className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-lg transition-colors cursor-pointer shrink-0"
              >
                Ngắt kết nối
              </button>
            )}
          </div>
        )}

        {/* 3. Central Stage: Large Interactive Power Tree SVG Model */}
        <section aria-label="Mô hình cây POWER TREE">
          <PowerTreeModel
            state={state}
            onCarTrigger={actions.triggerCarPass}
            onOpenPhoto={() => setIsPhotoModalOpen(true)}
          />
        </section>

        {/* 4. Three Core Mission Cards (Solar, Piezo, Water) + Storage Battery & LED */}
        <section aria-label="Các thông số sứ mệnh xanh">
          <MetricCards state={state} />
        </section>

        {/* 5. Interactive Simulation Controls (Sun, Car, Rain, Reset) */}
        <section aria-label="Bảng điều khiển mô phỏng">
          <InteractiveControls state={state} actions={actions} />
        </section>
      </main>

      {/* 6. Footer */}
      <Footer />

      {/* 7. Slide-over Drawer for STEM Principles & Arduino Technical Setup */}
      <StemGuideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        state={state}
        serialLogs={serialLogs}
        onConnectSerial={actions.connectSerial}
        onDisconnectSerial={actions.disconnectSerial}
      />

      {/* 8. Quick Real Photo Modal */}
      {isPhotoModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in"
          onClick={() => setIsPhotoModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl relative border border-slate-200 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">Ảnh thật cây POWER TREE đã chế tạo</h3>
              </div>
              <button
                onClick={() => setIsPhotoModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-xl overflow-hidden bg-slate-950 border border-slate-200 flex justify-center w-full">
              <img
                src="/assets/aistudio/Mo_hinh_cay_2fbe39ee.png"
                alt="Ảnh thật cây POWER TREE"
                referrerPolicy="no-referrer"
                className="max-h-[60vh] object-contain"
              />
            </div>

            <p className="mt-3 text-xs text-slate-600 text-center leading-relaxed">
              Mô hình chế tạo từ bình nhựa trong suốt dáng bầu, cổ xoắn, đế bọc viền lá răng cưa, tán lá răng cưa xòe rộng với 3 tấm pin mặt trời và túi nước đặt bên trong.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
