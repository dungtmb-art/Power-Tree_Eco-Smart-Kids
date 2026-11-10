/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Cpu, BookOpen, Usb, Copy, Check, Terminal, ShieldCheck, Sun, Zap, Droplets, Image as ImageIcon } from 'lucide-react';
import { PowerTreeFullState } from '../types';

interface StemGuideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  state: PowerTreeFullState;
  serialLogs: string[];
  onConnectSerial: () => void;
  onDisconnectSerial: () => void;
}

export const StemGuideDrawer: React.FC<StemGuideDrawerProps> = ({
  isOpen,
  onClose,
  state,
  serialLogs,
  onConnectSerial,
  onDisconnectSerial,
}) => {
  const [activeTab, setActiveTab] = useState<'stem' | 'arduino' | 'realPhoto'>('stem');
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const arduinoSampleCode = `/*
  DỰ ÁN: POWER TREE - SMART DASHBOARD (STEM LỚP 3)
  Bo mạch: Arduino Uno / Nano
  Baudrate: 9600 baud
*/

// Chân cắm cảm biến & thiết bị
const int PIN_PIEZO = 2;          // Cảm biến áp điện (Ngắt ngoài hoặc Digital)
const int PIN_LOW_FLOAT = 4;      // Phao mức thấp (Bể ngầm)
const int PIN_HIGH_FLOAT = 5;     // Phao mức cao (Bể ngầm)
const int PIN_FULL_FLOAT = 6;     // Phao báo đầy (Thân cây)
const int PIN_PUMP_RELAY = 8;     // Relay điều khiển máy bơm mini
const int PIN_LED_STREET = 9;     // Đèn đường LED
const int PIN_SOLAR_ANALOG = A0;  // Đo điện áp pin mặt trời

// Biến trạng thái
volatile long piezoCount = 0;
bool isPumpOn = false;

void setup() {
  Serial.begin(9600);
  pinMode(PIN_PIEZO, INPUT_PULLUP);
  pinMode(PIN_LOW_FLOAT, INPUT_PULLUP);
  pinMode(PIN_HIGH_FLOAT, INPUT_PULLUP);
  pinMode(PIN_FULL_FLOAT, INPUT_PULLUP);
  pinMode(PIN_PUMP_RELAY, OUTPUT);
  pinMode(PIN_LED_STREET, OUTPUT);

  digitalWrite(PIN_PUMP_RELAY, LOW); // Mặc định dừng bơm
  digitalWrite(PIN_LED_STREET, HIGH); // Bật đèn đường
}

void loop() {
  // 1. Đọc trạng thái các phao cảm biến (Active LOW khi đóng công tắc)
  bool lowReached = (digitalRead(PIN_LOW_FLOAT) == LOW);
  bool highReached = (digitalRead(PIN_HIGH_FLOAT) == LOW);
  bool treeFull = (digitalRead(PIN_FULL_FLOAT) == LOW);

  // 2. Logic điều khiển bơm 3 phao an toàn (Hysteresis)
  if (highReached && !treeFull) {
    isPumpOn = true; // Nước đạt phao cao -> BẬT BƠM
  }
  if (!lowReached || treeFull) {
    isPumpOn = false; // Nước cạn dưới phao thấp HOẶC cây đầy -> DỪNG BƠM
  }
  digitalWrite(PIN_PUMP_RELAY, isPumpOn ? HIGH : LOW);

  // 3. Đọc điện áp Solar
  int solarRaw = analogRead(PIN_SOLAR_ANALOG);
  float solarV = (solarRaw / 1023.0) * 5.0;
  bool solarActive = (solarV > 1.5);

  // 4. Đọc xung Piezo
  if (digitalRead(PIN_PIEZO) == LOW) {
    piezoCount++;
    delay(50); // Chống dội
  }

  // 5. Gửi dữ liệu JSON lên Dashboard qua Serial 9600 baud
  Serial.print("{\\"solar\\":");
  Serial.print(solarActive ? 1 : 0);
  Serial.print(",\\"solarV\\":");
  Serial.print(solarV, 1);
  Serial.print(",\\"piezoHits\\":");
  Serial.print(piezoCount);
  Serial.print(",\\"lowFloat\\":");
  Serial.print(lowReached ? 1 : 0);
  Serial.print(",\\"highFloat\\":");
  Serial.print(highReached ? 1 : 0);
  Serial.print(",\\"fullFloat\\":");
  Serial.print(treeFull ? 1 : 0);
  Serial.print(",\\"pump\\":");
  Serial.print(isPumpOn ? 1 : 0);
  Serial.print(",\\"battery\\":\\\"");
  Serial.print(solarActive ? "CHARGING" : "DISCHARGING");
  Serial.print("\\",\\"led\\":1}\\n");

  delay(400); // Tần suất gửi 2.5 lần/giây
}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(arduinoSampleCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Tài liệu STEM & Kỹ thuật</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Eco Smart Kids
                </span>
              </h2>
              <p className="text-xs text-emerald-700 font-bold">We Think. We Create. We Go Green!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Tabs */}
        <div className="flex border-b border-slate-200 px-4 bg-white text-xs font-semibold">
          <button
            onClick={() => setActiveTab('stem')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'stem'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Nguyên lý STEM</span>
          </button>
          <button
            onClick={() => setActiveTab('arduino')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'arduino'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Usb className="w-4 h-4" />
            <span>Kết nối Arduino (USB)</span>
          </button>
          <button
            onClick={() => setActiveTab('realPhoto')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'realPhoto'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Ảnh mô hình thật</span>
          </button>
        </div>

        {/* Drawer Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 text-sm text-slate-700">
          {activeTab === 'stem' && (
            <div className="space-y-5">
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 text-xs leading-relaxed text-emerald-900">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <strong className="text-sm font-extrabold text-emerald-950">
                    Mô hình POWER TREE – Nhóm Eco Smart Kids
                  </strong>
                  <span className="px-2 py-0.5 rounded bg-emerald-200/80 text-emerald-900 font-bold text-[10px]">
                    STEMPETITION
                  </span>
                </div>
                <p className="text-emerald-800 font-bold text-xs mb-1.5">
                  Slogan: We Think. We Create. We Go Green!
                </p>
                <p>
                  Dự án do nhóm học sinh sáng tạo kết hợp giữa vật liệu tái chế (bình nhựa, xốp, màng nilon) với công nghệ STEM năng lượng tái tạo (Solar, Piezo) và tự động hóa quản lý nước mưa đô thị thông minh.
                </p>
              </div>

              {/* Mission 1: Solar */}
              <div className="p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span>1. Năng lượng mặt trời (SOLAR)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  3 tấm pin mặt trời lắp khéo léo trên tán lá xanh để đón ánh sáng ban ngày. Điện năng sinh ra được dẫn qua mạch sạc nạp vào pin dự trữ để thắp sáng hệ thống đèn LED đường phố khi trời tối.
                </p>
              </div>

              {/* Mission 2: Piezo */}
              <div className="p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Zap className="w-4 h-4 text-cyan-600" />
                  <span>2. Năng lượng áp điện (PIEZO)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Các tấm cảm biến áp điện (Piezo) được bố trí dưới mặt đường. Khi ô tô mô hình hoặc người đi bộ tạo lực nén, tinh thể áp điện phát ra xung điện. Nhóm nghiên cứu thu hồi năng lượng cơ học này hướng tới bổ trợ hệ thống điện chung.
                </p>
              </div>

              {/* Mission 3: Water */}
              <div className="p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Droplets className="w-4 h-4 text-sky-600" />
                  <span>3. Quản lý nước mưa thông minh (WATER)</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Nước mưa chảy qua rãnh thoát nước mặt đường vào bể thu gom ngầm. Hệ thống 3 công tắc phao bảo vệ tự động hóa hoàn toàn:
                </p>
                <ul className="text-xs text-slate-600 space-y-1 list-disc pl-4 mt-1">
                  <li><strong>Phao mức cao (Bể ngầm):</strong> Khi nước ngập đến phao cao, Arduino tự động bật máy bơm đưa nước lên thân cây.</li>
                  <li><strong>Phao mức thấp (Bể ngầm):</strong> Khi nước cạn xuống phao thấp, máy bơm tự động tắt để <em>tránh chạy khô cháy bơm</em>.</li>
                  <li><strong>Phao báo đầy (Thân cây):</strong> Khi túi chứa trong bình nhựa đầy, máy bơm tự động ngắt để <em>chống tràn nước</em>.</li>
                  <li>Nước sạch giữ trong túi thân cây sẵn sàng dùng tưới cây xanh sau bão!</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'arduino' && (
            <div className="space-y-4">
              {/* Web Serial Connection Box */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Usb className="w-4 h-4 text-emerald-600" />
                    <span>Kết nối Web Serial API (USB)</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                    state.serial.connected ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {state.serial.connected ? 'ĐÃ KẾT NỐI' : 'CHƯA KẾT NỐI'}
                  </span>
                </div>

                <p className="text-xs text-slate-600">
                  Cắm bo Arduino vào cổng USB máy tính (sử dụng trình duyệt Chrome hoặc Edge), sau đó nhấn nút bên dưới để chọn cổng COM.
                </p>

                {state.serial.error && (
                  <div className="p-2.5 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200">
                    {state.serial.error}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  {!state.serial.connected ? (
                    <button
                      onClick={onConnectSerial}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <Usb className="w-3.5 h-3.5" />
                      <span>Kết nối Bo Arduino (9600 baud)</span>
                    </button>
                  ) : (
                    <button
                      onClick={onDisconnectSerial}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Ngắt kết nối Serial</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Serial Live Packet Monitor */}
              <div className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Serial JSON Monitor (Thời gian thực)</span>
                  </div>
                  <span>9600 baud</span>
                </div>
                <div className="h-28 overflow-y-auto space-y-1 font-mono text-[11px] text-emerald-300">
                  {serialLogs.length > 0 ? (
                    serialLogs.map((log, i) => (
                      <div key={i} className="truncate">
                        &gt; {log}
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-500 italic py-2">
                      {state.serial.connected
                        ? 'Đang lắng nghe gói tin JSON từ Arduino...'
                        : 'Chưa có kết nối Serial. Hãy nhấn nút Kết nối phía trên khi cắm dây USB.'}
                    </div>
                  )}
                </div>
              </div>

              {/* Arduino Code Snippet */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800">Mã nguồn Arduino mẫu (.ino):</span>
                  <button
                    onClick={handleCopyCode}
                    className="inline-flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? 'Đã sao chép!' : 'Sao chép code'}</span>
                  </button>
                </div>
                <pre className="p-3 rounded-xl bg-slate-900 text-slate-300 font-mono text-[11px] overflow-x-auto max-h-56 leading-relaxed">
                  {arduinoSampleCode}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'realPhoto' && (
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-xs text-slate-600">
                <strong>Đối chiếu mô hình chế tạo thực tế:</strong> Bình nhựa trong suốt dáng bầu với phần cổ hẹp ren xoắn, viền lá xanh răng cưa ôm lấy đế bình, và tán lá lớn nhiều lớp xòe rộng làm từ màng tái chế.
              </div>
              <div className="rounded-xl overflow-hidden border border-slate-300 shadow-sm bg-slate-950 flex justify-center">
                <img
                  src="/assets/aistudio/Mo_hinh_cay_2fbe39ee.png"
                  alt="Ảnh chụp mô hình thật của cây POWER TREE"
                  referrerPolicy="no-referrer"
                  className="max-h-96 w-auto object-contain"
                />
              </div>
              <p className="text-xs text-slate-500 italic text-center">
                Mô hình thật POWER TREE do nhóm học sinh chế tạo phục vụ thuyết trình STEMPETITION.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
