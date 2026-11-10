# POWER TREE – Smart Dashboard (Green Planet STEM)

Ứng dụng web tương tác trực quan dành cho nhóm học sinh lớp 3 tham gia cuộc thi STEMpetition, giúp mô phỏng sinh động và kết nối trực tiếp với mô hình thực tế **POWER TREE: Một thân cây, Ba sứ mệnh xanh (Solar – Piezo – Quản lý nước mưa)**.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> **Các quyết định đã được xác nhận qua phỏng vấn định hướng:**
> - **Hình minh họa cây trung tâm**: Sử dụng đồ họa vector SVG tùy biến tỉ mỉ, bám sát từng chi tiết của ảnh chụp thực tế (bình nhựa trong suốt cổ hẹp dáng bầu, tán lá răng cưa tái chế xòe rộng, viền lá răng cưa ôm gốc, túi nước bên trong và 3 tấm pin mặt trời).
> - **Giao thức Web Serial Arduino**: Truyền nhận định dạng chuỗi JSON chuẩn ở tốc độ `9600 baud` (tối ưu, tương thích cao với mọi dòng bo Arduino Uno/Nano/Mega).
> - **Khu vực kỹ thuật & hướng dẫn**: Tích hợp ngăn kéo trượt (Slide-over Drawer) gọn gàng bên sườn phải, giữ trọn vẹn màn hình chính sáng sủa cho ban giám khảo và học sinh lớp 3 quan sát mà không bị rối mắt.

---

## 1. Overview & Core Concept

- **Mục tiêu**: Cung cấp một bảng điều khiển trung tâm (Smart Dashboard) vừa là công cụ thuyết trình sinh động cho học sinh lớp 3, vừa là giao diện giám sát thực tế kết nối bo Arduino của mô hình cây POWER TREE.
- **Đối tượng sử dụng**: Học sinh tiểu học (lớp 3), thầy cô hướng dẫn, phụ huynh và Ban Giám khảo cuộc thi STEMpetition.
- **Ba sứ mệnh xanh trọng tâm**:
  1. **SOLAR (Năng lượng mặt trời)**: Thu năng lượng qua 3 tấm pin trên tán lá, quản lý sạc pin dự trữ và thắp sáng đèn LED đường phố.
  2. **PIEZO (Năng lượng áp điện)**: Thu hồi xung điện khi xe ô tô mô hình chạy qua mặt đường, đếm số lượt tác động.
  3. **WATER (Quản lý nước thông minh)**: Thu gom nước mưa qua rãnh thoát nước vào bể ngầm; tự động điều khiển máy bơm mini bơm nước lên túi chứa trong thân cây theo logic an toàn 3 phao chống tràn và chống chạy khô.

---

## 2. Phân tích ảnh cây thật & Trải nghiệm trực quan (UX/UI)

### 2.1. Phân tích ảnh mô hình thực tế (`/public/assets/aistudio/Mo_hinh_cay_2fbe39ee.png`)
Qua đối chiếu ảnh chụp thật do nhóm cung cấp:
- **Thân cây**: Bình nhựa tái chế trong suốt, hình dáng bầu tròn ở phần thân dưới, thu hẹp về phía cổ bình có các rãnh ren xoắn.
- **Túi chứa nước**: Được đặt lơ lửng bên trong lòng bình nhựa. Khi nước dâng lên trong túi, **hình dáng bình nhựa bên ngoài giữ nguyên cố định tuyệt đối**, không biến dạng hay phình to.
- **Đế bình**: Có lớp đai trang trí bằng vật liệu xốp/giấy màu xanh lá cắt hình răng cưa nhọn ôm sát chân đế.
- **Tán lá**: Tầng tầng lớp lớp lá lớn cắt từ màng nhựa/vải xanh tái chế, viền răng cưa nhọn xòe ra bốn hướng, vươn cao ở đỉnh cổ bình.
- **Các thành phần bổ sung trực quan**:
  - 3 tấm pin năng lượng mặt trời (Solar Cell) gắn trên 3 phiến lá đón nắng.
  - 2 tuyến đường giao thông chạy hai bên gốc cây với vạch kẻ đường, xe ô tô mô hình chuyển động.
  - Các miếng cảm biến áp điện Piezo ẩn dưới lòng đường.
  - Các cột đèn đường LED chiếu sáng hai bên vỉa hè.
  - Hệ thống rãnh thu nước mặt đường chảy vào bể ngầm bên dưới cùng đường ống bơm dẫn nước lên thân bình.

### 2.2. Bố cục giao diện Green Planet (1 Màn hình chính tối ưu trình chiếu)

Giao diện áp dụng bảng màu tự nhiên dịu mắt: Xanh lá cây tự nhiên (`#16a34a`), Vàng nắng Solar (`#eab308`), Xanh Cyan công nghệ Piezo (`#06b6d4`), Xanh biển Water (`#0284c7`), trên nền trắng sáng thanh lịch (`#f8fafc`).

Bố cục một trang (Single-Page Viewport) từ trên xuống dưới:
1. **Header tinh gọn (Top Bar)**:
   - Thương hiệu: **POWER TREE** (Kèm phụ đề: *Green Planet – Một thân cây, Ba sứ mệnh xanh*).
   - Huy hiệu chế độ hoạt động: Chuyển đổi linh hoạt giữa **Demo Mode (Mô phỏng)** và **Live Mode (Arduino USB)**.
   - Nút mở nhanh: **Hướng dẫn STEM & Kết nối** (mở ngăn kéo Slide-over).
2. **Khu vực trung tâm (Central Stage)**:
   - Khung cảnh mô hình tương tác SVG kích thước lớn, thể hiện toàn cảnh: Bầu trời (Mặt trời tỏa nắng/Mây mưa rơi), Cây Power Tree bình nhựa trong suốt với túi nước dâng hạ, 3 tấm Solar trên lá, Đèn đường, Xe chạy qua Piezo, Rãnh thu nước và Bể ngầm.
3. **Ba thẻ thông tin cốt lõi (Không hiển thị thông số rườm rà)**:
   - ☀️ **SOLAR**: Trạng thái (*Đang tạo điện* / *Không tạo điện*), Điện áp minh họa đo được.
   - ⚡ **PIEZO**: Số lượt xe tác động (*Lượt nhấn*), Trạng thái xung (*Có tín hiệu* / *Chờ tác động*).
   - 💧 **WATER**: Bể thu gom (*Mức thấp* / *Đạt mức cao*), Máy bơm mini (*ĐANG BƠM* / *DỪNG*), Túi trong cây (*Chưa đầy* / *ĐÃ ĐẦY*).
4. **Trạng thái thiết bị phụ (Chỉ 2 biểu tượng trực quan)**:
   - 🔋 **Pin lưu trữ**: Đang sạc / Đang cấp điện / Chờ.
   - 💡 **Đèn đường LED**: BẬT sáng / TẮT.
5. **Thanh điều khiển tương tác mô phỏng (Dành cho học sinh & Giám khảo)**:
   - ☀️ **BẬT/TẮT NẮNG**: Chuyển trạng thái ban ngày/đêm, kích hoạt tấm pin mặt trời và sạc điện.
   - 🚗 **XE QUA PIEZO**: Kích hoạt xe chạy qua tấm Piezo, phát xung điện cyan sinh động và cộng dồn số lượt.
   - 🌧️ **TẠO MƯA**: Tạo hiệu ứng mưa rơi, nước chảy vào rãnh thu gom, kích hoạt bơm tự động lên túi thân cây.
   - 🔄 **THỬ LẠI**: Đặt lại mô phỏng về trạng thái ban đầu sạch sẽ để nhóm tiếp tục lượt trình diễn mới.
6. **Ngăn kéo Slide-over (Tách biệt khỏi màn hình chính)**:
   - Sơ đồ nguyên lý 3 sứ mệnh theo chuẩn giáo dục STEM tiểu học.
   - Hướng dẫn cấu hình cổng COM Web Serial và code mẫu nạp Arduino (C++ `.ino`).
   - Khung cửa sổ Serial Monitor xem dữ liệu JSON thực tế từ phần cứng.

---

## 3. Bảng phân tích hiện trạng & Giải pháp thay đổi

| Hạng mục | Phiên bản cũ / Khởi tạo ban đầu | Phiên bản POWER TREE mới | Rationale / Lợi ích |
| :--- | :--- | :--- | :--- |
| **Hình tượng cây trung tâm** | Chưa có hoặc dùng hình cây chung chung | Đồ họa SVG mô phỏng chính xác bình nhựa dáng bầu, cổ hẹp, viền răng cưa xanh ôm gốc và tán lá lớn theo ảnh thật | Bám sát 100% hiện vật thực tế của nhóm học sinh khi dự thi |
| **Hiệu ứng thân cây** | Dễ mắc lỗi phình to kích thước khi đầy nước | Giữ nguyên form bình nhựa; túi nước bên trong dâng lên tự nhiên | Chuẩn xác về mặt vật lý của bình nhựa cố định |
| **Thẻ số liệu** | Quá nhiều biểu đồ công nghiệp, phần trăm pin ước lượng vô căn cứ | Giản lược còn đúng 3 thẻ: Solar, Piezo, Water + 2 icon Pin & Đèn LED | Thân thiện với học sinh lớp 3 và thuyết trình trực quan |
| **Thu nước & Bơm** | Bơm thủ công không điều kiện an toàn | Tự động hóa bằng thuật ngữ trễ 2 ngưỡng (Phao cao - Phao thấp) + Phao chống tràn thân cây | Mô phỏng chính xác nguyên lý kỹ thuật tự động hóa thực tế |
| **Kết nối Arduino** | Chưa hỗ trợ hoặc kết nối giả lập | Tích hợp chuẩn **Web Serial API** (trực tiếp qua cổng USB trình duyệt Chrome/Edge) định dạng JSON 9600 baud | Trình diễn kết nối thực tế với phần cứng thật trước hội đồng giám khảo |
| **Kiến trúc mã nguồn** | File trống ban đầu | React 19 + TypeScript + Tailwind v4 + Lucide React, không cài thêm thư viện nặng | Nhẹ, mượt mà, build đạt chuẩn Vercel không lỗi |

---

## 4. Technical Architecture & Simulation Logic

### 4.1. Sơ đồ luồng dữ liệu & Thành phần hệ thống

```
┌────────────────────────────────────────────────────────────────────────┐
│                        POWER TREE DASHBOARD                            │
│  ┌──────────────────────┐                     ┌─────────────────────┐  │
│  │   Demo Simulation    │                     │   Web Serial API    │  │
│  │   State Controller   │                     │  (Arduino Hardware) │  │
│  └──────────┬───────────┘                     └──────────┬──────────┘  │
│             │                                            │             │
│             └───────────────────┬────────────────────────┘             │
│                                 ▼                                      │
│                  Unified PowerTreeState Manager                        │
│            ┌────────────────────┼────────────────────┐                 │
│            ▼                    ▼                    ▼                 │
│      [Central Stage]     [3 Core Cards]      [Controls & Drawer]       │
│      - Sky / Rain FX     - Solar Status      - Sun / Rain / Car        │
│      - Plastic Bottle    - Piezo Hits        - Reset Button            │
│      - Inner Water Bag   - Water Logic       - STEM Guide Drawer       │
│      - Road, Cars, LED   - Battery & LED     - Serial JSON Monitor     │
└────────────────────────────────────────────────────────────────────────┘
```

### 4.2. Logic Quản lý nước 3 phao (Hysteresis Auto-Pumping)

```
[Bể Thu Gom Ngầm]                           [Thân Cây - Túi Chứa]
  - Phao Cao (highFloat)                      - Phao Đầy (fullFloat)
  - Phao Thấp (lowFloat)

Thuật toán điều khiển máy bơm:
1. Nước chưa chạm Phao Cao  ──> Máy bơm TẮT
2. Nước chạm Phao Cao       ──> NẾU Túi trong cây CHƯA ĐẦY ──> BẬT MÁY BƠM
3. Máy bơm đang chạy         ──> Tiếp tục bơm cho tới khi:
                                 - Nước bể tụt xuống dưới Phao Thấp ──> TẮT (Chống cháy bơm)
                                 - HOẶC Túi trong cây chạm Phao Đầy ──> TẮT (Chống tràn)
4. Sự cố tín hiệu           ──> Tự động dừng bơm an toàn.
```

### 4.3. Định dạng dữ liệu Arduino Live Mode (JSON 9600 Baud)
Khi Arduino gửi gói tin qua cổng Serial cổng COM:
```json
{
  "solar": 1,
  "solarV": 5.1,
  "piezoHits": 24,
  "piezoTrigger": false,
  "lowFloat": true,
  "highFloat": false,
  "fullFloat": false,
  "pump": false,
  "battery": "CHARGING",
  "led": true
}
```
Dashboard tự động phân tích cú pháp, cập nhật giao diện trong thời gian thực và ghi nhận trạng thái kết nối có dây USB.

---

## 5. Kế hoạch triển khai mã nguồn & Kiểm soát rủi ro

### Danh mục bước triển khai chi tiết:
1. **Bước 1**: Cập nhật thông tin nhận diện dự án trong `metadata.json` và `index.html` (tiêu đề, mô tả chuẩn tiếng Việt).
2. **Bước 2**: Xây dựng mô-đun trạng thái ứng dụng `usePowerTreeState` hỗ trợ chuyển đổi mượt mà giữa Demo Mode và Live Web Serial.
3. **Bước 3**: Thiết kế thành phần đồ họa vector tương tác `PowerTreeModel.tsx` với hình dạng bình nhựa dáng bầu, cổ xoắn, túi nước bên trong, lá răng cưa, đường xá, xe hơi và hiệu ứng thời tiết.
4. **Bước 4**: Xây dựng 3 thẻ thông tin cốt lõi (Solar, Piezo, Water) và 2 icon thiết bị phụ (Pin lưu trữ, Đèn LED).
5. **Bước 5**: Lắp ráp thanh điều khiển 4 nút bấm tương tác mô phỏng và ngăn kéo trượt `StemGuideDrawer.tsx` kèm code mẫu Arduino.
6. **Bước 6**: Kiểm tra toàn diện chất lượng mã với `compile_applet` và `lint_applet`.

### Bảng đánh giá rủi ro & Biện pháp phòng ngừa:
- **Rủi ro tương thích Web Serial API**: Trình duyệt di động hoặc Safari có thể không hỗ trợ Web Serial.
  *Giải pháp*: Kiểm tra tính năng `navigator.serial`; nếu không hỗ trợ, hiển thị thông báo thân thiện và tự động hướng dẫn sử dụng trên Google Chrome / Microsoft Edge hoặc chuyển sang Demo Mode.
- **Rủi ro giao diện vỡ trên màn hình máy chiếu/máy tính bảng**:
  *Giải pháp*: Áp dụng thiết kế co giãn responsive với tỷ lệ khung hình cân đối, bố cục trung tâm căn chỉnh trực quan, tối ưu cho tỷ lệ 16:9 phổ biến của máy chiếu trường học.
- **Rủi ro triển khai Vercel**:
  *Giải pháp*: Không sử dụng thư viện bên ngoài không cần thiết; tuân thủ nghiêm ngặt TypeScript types và chuẩn Vite build của dự án.
