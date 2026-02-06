# BIH INFRASTRUCTURE MANAGER - DETAILED IMPLEMENTATION PLAN
## Architecture & Deployment: Docker + PostgreSQL + Next.js

### 1. INFRASTRUCTURE & DATABASE MIGRATION (PRIORITY: IMMEDIATE)
Chuyển đổi từ SQLite sang PostgreSQL để hỗ trợ chạy Docker và Scale sau này.

- [x] **Docker Setup**
  - [x] Tạo `Dockerfile` tối ưu cho Next.js (Standalone mode).
  - [x] Tạo `docker-compose.yml` bao gồm:
    - Service `app`: Next.js application.
    - Service `db`: PostgreSQL 16 (Alpine).
    - Service `pgadmin` (Optional): Giao diện quản lý DB.
  - [x] Cấu hình Volume để persist data cho Postgres.

- [x] **Prisma & Database Setup**
  - [x] Cập nhật `schema.prisma`: Chuyển provider từ `"sqlite"` sang `"postgresql"`.
  - [x] Cập nhật Connection String trong `.env`.
  - [x] Viết script `seed.ts` để khởi tạo dữ liệu mẫu (Users, Locations, Categories) khi container chạy lần đầu.
  - [x] Thiết lập quy trình Migration: `npx prisma migrate dev` (Development) và `npx prisma migrate deploy` (Production/Docker).

---

### 2. CORE MODULES (AUTHENTICATION & AUTHORIZATION)
Hệ thống phân quyền trung tâm, đảm bảo mỗi tổ chỉ thấy những gì họ cần thấy.

- [x] **User Management (Admin)**
  - [x] CRUD User (Tạo, Sửa, Xóa, Reset Password).
  - [x] Assign Role & Position (Role: TECHNICAL, Position: LEADER/STAFF).
  - [x] Organization Chart: Cấu trúc quản lý cha/con.
  - [x] Admin-only access: Chỉ ADMIN mới được quản lý users.
  - [x] Middleware protection cho API `/api/admin/*` và route `/dashboard/system`.

- [x] **Authentication Flow**
  - [x] Đăng nhập (NextAuth.js).
  - [x] Session Persistence (JWT).
  - [x] Middleware Protection: Chặn truy cập trái phép vào các route `/dashboard/*`.
  - [x] Role-based redirect: Mỗi tổ được redirect về dashboard riêng.

- [x] **Cross-Department Request System**
  - [x] Trang "Gửi yêu cầu" cho tất cả users (`/dashboard/request`).
  - [x] Gửi yêu cầu đến các tổ chức năng: Kỹ thuật, Hộ lý, Đội xe, An ninh, Vật tư, Môi trường.
  - [x] Sidebar ẩn các menu không có quyền truy cập.

---

### 3. DEPARTMENT SPECIFIC MODULES (MODULE CÁC TỔ)

#### A. Tổ Kỹ Thuật Vận Hành (Engineering/Technical)
*Status: ✅ Hoàn thành cơ bản*

- [x] **Ticket Management (Sự cố đột xuất)**
  - [x] Tạo yêu cầu sửa chữa.
  - [x] Kanban Board visualization.
  - [x] Chức năng Phân công (Multi-assign) cho Tổ trưởng.
  - [x] Chức năng Edit/Delete/Update Status.
  - [x] **Command/Comment System** - Tổ trưởng giao việc với chỉ đạo cụ thể.
  - [x] Ticket Detail Modal với thread chỉ đạo & phản hồi.
- [x] **Analytics Dashboard**
  - [x] Thống kê tổng quan (Total/Pending/Completed/Rate).
  - [x] Top 10 vị trí hay hư hỏng.
  - [x] Top nhân viên được giao việc nhiều.
  - [x] Biểu đồ hoạt động 7 ngày.
  - [x] Phân bố theo mức độ ưu tiên.
- [x] **Preventive Maintenance (Bảo trì định kỳ)** *(Hoàn thành)*
  - [x] Schema: Asset, MaintenanceSchedule, MaintenanceHistory.
  - [x] API: `/api/technical/assets`, `/api/technical/maintenance`.
  - [x] UI: Tab Bảo trì với danh sách lịch, mark complete.
  - [x] Tự động sinh Ticket khi đến hạn bảo trì (Button "Check & Generate").
  - [x] Checklist bảo trì (Textarea support).
- [x] **Asset Management (Quản lý tài sản kỹ thuật)** *(Hoàn thành)*
  - [x] Schema: Asset model với đầy đủ thông tin.
  - [x] API: CRUD thiết bị.
  - [x] UI: Tab Thiết bị với danh sách cards, modal thêm mới.
  - [ ] QR Code support.
  - [x] Lịch sử sửa chữa chi tiết của từng thiết bị (Modal view).

#### B. Tổ Hộ Lý (Nursing/Orderly/Cleaning)
*Status: 🔄 Đang phát triển - UI cơ bản đã có*

- [x] **Location Management (Quản lý vị trí)**
  - [x] Danh sách vị trí (Phòng, WC, Công cộng).
  - [x] Thêm/Sửa vị trí.
  - [x] Tree view phân cấp vị trí.
- [x] **Staff Management (Quản lý nhân viên)**
  - [x] Danh sách nhân viên hộ lý.
  - [x] Thống kê Đạt/Không đạt.
- [x] **Smart Audit System (Hệ thống kiểm tra thông minh)**
  - [x] Sinh nhiệm vụ kiểm tra tự động (fail history, random, long time).
  - [x] Form ghi nhận kết quả kiểm tra.
- [x] **Patient Transport (Vận chuyển người bệnh)**
  - [x] Form yêu cầu: Khoa/Phòng gọi -> Hộ lý trực nhận.
  - [x] Thông tin: Tên BN, Từ đâu -> Đến đâu, Loại xe (Cáng/Xe đẩy).
  - [x] Tracking: Thời gian nhận, Thời gian hoàn thành.
- [x] **Linen Management (Đồ vải)**
  - [x] Giao nhận đồ vải sạch/bẩn.
  - [x] Nhật ký nhập xuất kho đồ vải.

#### C. Tổ An Ninh (Security)
*Status: ✅ Hoàn thành cơ bản*

... (rest of the file until Changelog) ...

- [x] **Inventory Management (Quản lý kho vật tư - Giai đoạn 2)**
  - [x] Quản lý danh mục vật tư (Tên, mã, ĐVT, Tồn kho min/max).
  - [x] Nhập/Xuất kho (Ghi nhận số lượng, lý do).
  - [x] Cảnh báo tồn kho thấp.

#### C. Tổ An Ninh (Security)
*Status: ✅ Hoàn thành cơ bản*

... (rest of the file until Changelog) ...

### CHANGELOG

**2026-02-02 (Current):**
- ✅ Hoàn thiện module Supply Chain (Cung ứng):
  - Thêm tab **Kho hàng (Inventory)**: Quản lý danh sách vật tư, theo dõi tồn kho.
  - Chức năng **Nhập/Xuất kho**: Ghi nhận biến động số lượng tồn kho.
  - Cập nhật Prisma Schema: Thêm `InventoryItem` và `InventoryTransaction`.
- ✅ Hoàn thiện module Nursing (Hộ lý):
  - Thêm tab **Vận chuyển**: Tạo yêu cầu vận chuyển bệnh nhân (Xe đẩy, Cáng, Giường...).
  - Thêm tab **Đồ vải**: Ghi nhận nhập/xuất đồ vải (Sạch/Bẩn) kèm trọng lượng và danh sách.
  - Cập nhật UI Dashboard Hộ lý với 2 tab mới.
- ✅ Cập nhật Prisma Schema: Thêm `PatientTransport` và `LinenExchange`.
- ✅ API Endpoints: `/api/nursing/transport`, `/api/nursing/linen`.
- ✅ Database synced via `prisma db push`.

**2026-01-29 (Buổi chiều - tiếp 5):**
...
*Status: ✅ Hoàn thành cơ bản*

- [x] **Incident Reporting (Sự cố an ninh)**
  - [x] Ghi nhận sự việc (Mất trộm, Gây rối, Cháy nổ...).
  - [x] Phân loại mức độ nghiêm trọng (LOW → CRITICAL).
  - [ ] Đính kèm hình ảnh bằng chứng.
  - [ ] Quy trình xử lý hồ sơ vụ việc.
- [x] **Patrol Logs (Nhật ký tuần tra)**
  - [x] Check-in điểm tuần tra với mã QR/NFC.
  - [x] Ghi chú tình trạng bất thường tại điểm tuần tra.
  - [x] Lịch sử tuần tra theo ngày.
- [x] **Visitor Management (Khách ra vào)**
  - [x] Ghi nhận khách vào (Họ tên, CMND, Công ty, Mục đích).
  - [x] Thông tin xe và biển số.
  - [x] Cấp thẻ tạm.
  - [x] Checkout khách ra.

#### D. Tổ Lái Xe (Transport/Ambulance)
*Status: ✅ Hoàn thành cơ bản*

- [x] **Trip Management (Điều xe)**
  - [x] Lịch điều xe công tác và cấp cứu.
  - [x] Duyệt chuyến và cập nhật trạng thái (Chờ duyệt -> Đang đi -> Hoàn thành).
  - [x] Ghi nhận xe phục vụ.
- [x] **Vehicle Management (Quản lý xe)**
  - [x] Danh sách xe (Biển số, Loại xe, Số chỗ).
  - [x] Theo dõi hạn đăng kiểm, bảo hiểm (Cảnh báo khi sắp hết hạn).
  - [x] Cập nhật số km hiện tại.

#### E. Tổ Vật Tư (Supply Chain)
*Status: ✅ Hoàn thành cơ bản*

- [x] **Procurement Plan (Dự trù mua sắm)**
  - [x] Lập kế hoạch mua sắm (Theo tuần/tháng).
  - [x] Quy trình duyệt dự trù (Tổ trưởng -> Trưởng phòng -> BGĐ).
  - [x] In/Xuất phiếu dự trù.
- [x] **Inventory (Kho vật tư)**
  - [x] Nhập kho/Xuất kho (Vật tư điện nước, đồ vệ sinh...).
  - [x] Cảnh báo tồn kho thấp.

#### F. Tổ Môi Trường (Environment)
*Xử lý rác thải, cây xanh, môi trường.*

- [x] **Waste Management (Rác thải)**
  - [x] Thu gom rác y tế/sinh hoạt.
  - [x] Nhật ký xử lý rác thải.
- [x] **Green Space (Cây xanh)**
  - [x] Chăm sóc cây, cắt cỏ.
  - [x] Lịch tưới nước tự động.

### GIAI ĐOẠN 2: CHUYÊN SÂU & QUẢN LÝ TÀI NGUYÊN (RESOURCE MANAGEMENT)
*Mục tiêu: Chuyển từ "Quản lý Yêu cầu" sang "Quản lý Nguồn lực" thực tế.*

#### 1. Vật Tư & Kho (Supply & Inventory) - 🚨 CRITICAL
*Hiện tại chỉ mới có dự trù mua sắm (Procurement).*
- [x] **Inventory Management (Quản lý Kho)**
  - [x] Danh mục hàng hóa (SKU, ĐVT, Min/Max level).
  - [x] Quản lý kho (Kho chính, Kho lẻ các khoa).
  - [x] Nhập kho / Xuất kho (Stock In/Out).
  - [x] Thẻ kho (Stock Card) & Báo cáo tồn kho.

#### 2. Kỹ Thuật (Technical Deep Dive)
- [ ] **Spare Parts (Linh kiện thay thế)**
  - [ ] Liên kết với kho vật tư để trừ kho khi sửa chữa.
- [ ] **Preventive Maintenance (Bảo trì dự phòng)**
  - [ ] Lập lịch bảo trì định kỳ tự động sinh ticket.
  - [ ] Checklist kiểm tra thiết bị chi tiết.

#### 3. Đội Xe (Fleet Management)
- [ ] **Fuel & Costs (Nhiên liệu & Chi phí)**
  - [ ] Nhật ký đổ xăng (Số lít, số tiền, Km).
  - [ ] Báo cáo định mức tiêu hao nhiên liệu.
- [ ] **Maintenance (Bảo dưỡng xe)**
  - [ ] Lịch sử sửa chữa, thay thế phụ tùng.
  - [ ] Cảnh báo đăng kiểm, bảo hiểm hết hạn.

#### 4. An Ninh (Security Operations)
- [ ] **Patrol Routes (Tuyến tuần tra)**
  - [ ] Định nghĩa tuyến tuần tra (Route A: Cổng -> Sảnh -> Kho).
  - [ ] QR Code Checkpoint scanning.
- [ ] **Shift Management (Ca trực)**
  - [ ] Phân ca trực, điểm danh đầu ca.

#### 5. Cơ Sở Hạ Tầng (Map & Locations) - ✅ COMPLETED
- [x] **Location Management**
  - [x] Sơ đồ cây (Khu -> Tầng -> Phòng).
  - [x] API Fetch locations.
  - [x] Seed data (Khu A, Khu B, Ngoài trời).

---

### 4. UI/UX & SYSTEM ENHANCEMENTS

- [x] **Notification System**
  - [x] Chuông thông báo Real-time (Socket.io hoặc Polling).
  - [ ] Email notifications cho các yêu cầu khẩn cấp (URGENT).
- [x] **Reporting & Analytics (Dashboard Tổng hợp)**
  - [x] Biểu đồ số lượng yêu cầu theo trạng thái.
  - [x] Thời gian xử lý trung bình (SLA) (Đã implement cho Technical).
  - [x] Export báo cáo ra Excel/PDF (CSV).
- [x] **Mobile Responsiveness**
  - [x] Bottom navigation bar cho điện thoại.
  - [x] Sidebar drawer với overlay.
  - [x] Touch-friendly UI elements (44px targets).
  - [x] Safe area support cho iPhone notch.
  - [x] Responsive notification dropdown.

---

### 5. EXECUTION STRATEGY (NEXT STEPS)

1.  ✅ **DOCKERIZE:** Tạo file `docker-compose.yml` và setup Postgres.
2.  ✅ **MIGRATE:** Chuyển schema sang Postgres, chạy migration.
3.  ✅ **SYNC:** Cập nhật client Prisma, fix các lỗi type.
4.  ✅ **ADMIN MODULE:** Hoàn thiện CRUD user, phân quyền Admin-only.
5.  ✅ **REQUEST SYSTEM:** Tạo trang gửi yêu cầu liên tổ.
6.  ✅ **SECURITY MODULE:** Hoàn thành module An ninh (Sự cố, Tuần tra, Khách).
7.  ✅ **DRIVER MODULE:** Hoàn thành module Đội xe (Điều xe, Quản lý xe).
8.  ✅ **SUPPLY MODULE:** Hoàn thành module Vật tư (Dự trù mua sắm).
9.  ✅ **DEVELOP:** Code tiếp module Môi trường (Environment).
10. ✅ **NOTIFICATIONS:** Triển khai hệ thống thông báo realtime (Polling).
11. 🔄 **DEEP DIVE:** Triển khai Giai đoạn 2 - Bắt đầu với Kho Vật Tư (Inventory).
12. 🔄 **ENHANCE:** Cải thiện UI Reporting và Analytics.

---

### CHANGELOG

**2026-01-29 (Buổi chiều - tiếp 5):**
- ✅ Thêm **Command/Comment System** cho module Technical:
  - Tổ trưởng giao việc kèm chỉ đạo cụ thể (COMMAND).
  - Tổ viên phản hồi/xác nhận (REPLY).
  - Thread conversation với timestamp.
  - Modal chi tiết ticket với toàn bộ thread trao đổi.
- ✅ Thêm model `TicketComment` vào Prisma Schema.
- ✅ API endpoint mới: `/api/technical/comments`.
- ✅ Migration: `scripts/ticket-comment-migration.sql`.

**2026-01-29 (Buổi chiều - tiếp 4):**
- ✅ Mở rộng module Technical (Kỹ thuật vận hành):
  - Thêm tab **Thiết bị**: Quản lý tài sản kỹ thuật (HVAC, Điện, Nước, PCCC...).
  - Thêm tab **Bảo trì**: Lịch bảo trì định kỳ với tần suất linh hoạt.
  - Modal thêm thiết bị và tạo lịch bảo trì.
  - Mark complete và tự động tính ngày đến hạn tiếp theo.
- ✅ Cập nhật Prisma Schema: thêm `Asset`, `MaintenanceSchedule`, `MaintenanceHistory`.
- ✅ API endpoints: `/api/technical/assets`, `/api/technical/maintenance`.
- ✅ Migration database: `scripts/technical-asset-migration.sql`.

**2026-01-29 (Buổi chiều - tiếp 3):**
- ✅ Hoàn thành module Supply (Vật tư):
  - Dashboard dự trù mua sắm (Lập bảng, In phiếu).
  - Chức năng duyệt phiếu (Tổ trường -> BGĐ).
  - Xuất phiếu dự trù ra PDF/In ấn A4.
- ✅ Cập nhật Prisma Schema: thêm `ProcurementPlan` và `ProcurementItem`.
- ✅ API endpoints: `/api/supply/plans` (GET, POST), `/api/supply/plans/[id]` (GET).
- ✅ Migration database cho Supply module.

**2026-01-29 (Buổi chiều - tiếp 2):**
- ✅ Hoàn thành module Driver (Đội xe):
  - Dashboard điều phối xe (Lịch trình, Danh sách xe, Thống kê)
  - Chức năng đặt xe công tác và điều xe cấp cứu
  - Quản lý danh sách xe (Thêm mới, Cảnh báo đăng kiểm/bảo hiểm)
- ✅ Cập nhật Prisma Schema: mở rộng `TransportRequest`, thêm `Vehicle`
- ✅ API endpoints: `/api/driver/requests`, `/api/driver/vehicles`
- ✅ Migration database cho Driver module

**2026-01-29 (Buổi chiều - tiếp):**
- ✅ Hoàn thành module Security với 3 tabs:
  - Sự cố an ninh (báo cáo, phân loại severity)
  - Nhật ký tuần tra (check-in điểm tuần tra)
  - Quản lý khách ra vào (checkin/checkout)
- ✅ Thêm schema PatrolLog và Visitor vào Prisma
- ✅ Tạo API endpoints: `/api/security/patrol`, `/api/security/visitors`
- ✅ Migration database cho Security tables

**2026-01-29 (Buổi chiều):**
- ✅ Thêm trang "Gửi yêu cầu" (`/dashboard/request`) cho tất cả users
- ✅ Cập nhật sidebar: ẩn menu không có quyền truy cập
- ✅ Thêm middleware cho phép tất cả users truy cập trang request
- ✅ UI gửi yêu cầu với 6 tổ chức năng, form modal đẹp

**2026-01-29 (Buổi sáng):**
- ✅ Hoàn thành Docker setup với PostgreSQL
- ✅ Fix lỗi NextAuth route export
- ✅ Fix lỗi CSS print styles
- ✅ Fix lỗi TypeScript type mismatch
- ✅ Thêm script tạo admin user
- ✅ Thêm API thống kê cho Technical dashboard
- ✅ Thêm tab Báo cáo với biểu đồ cho Technical
- ✅ Hoàn thiện module Admin: CRUD users, reset password
- ✅ Thêm middleware bảo vệ route Admin-only
- ✅ Cập nhật UI System page với thống kê và tìm kiếm

**2026-02-02 (Update): Supply Module Refinements**
- **PDF Generation Updates:**
  - Removed "Print" button from UI to enforce PDF download usage.
  - Added **VAT (%)** column and fixed text wrapping for "Nội dung" column.
  - Removed "Loại" (Category) column from PDF table.
  - Added **Bank Account Information** per item, displayed under the supplier name.
  - Updated signage section: Names are now properly capitalized (Title Case) instead of uppercase.
- **Supply Dashboard UI Enhancements:**
  - Added "Create Plan" button to the PLANS tab.
  - Added **VAT (%)** input field for each item in the Create Plan modal.
  - Added **Bank Account** input field for each item in the Create Plan modal.
  - Added "Điều chỉnh" (Adjust) button for Approved plans, allowing Supply Staff to revert plan status to PENDING and edit details.
  - Added "Xóa phiếu" (Delete) button for Approved plans (Admin/Supply Manager only).
  - Fixed syntax errors in button handlers.
- **Backend API Updates:**
  - Updated `POST /api/supply/plans` to accept `vat` and `bankAccount` fields for items.
  - Updated `PATCH /api/supply/plans/[id]` to support full plan editing (title, description, items) when status is PENDING.
  - Allowed `status: 'PENDING'` transition for adjustment flow.
- **Database Schema:**
  - Added `vat` (Float) and `bankAccount` (String?) fields to `ProcurementItem` model in `prisma/schema.prisma`.

**2026-02-03 (New):**
- ✅ **Driver Module Enhancement (Fuel Management):**
  - Thêm tab **Nhiên liệu (Fuel)**: Quản lý chi phí xăng dầu.
  - Chức năng **Ghi nhận đổ nhiên liệu**: Nhập số lít, đơn giá, số km (ODO).
  - Tự động cập nhật ODO của xe.
  - Thống kê tổng chi phí nhiên liệu.
  - Cập nhật Prisma Schema: Thêm model `FuelLog`.
  - API endpoint: `/api/driver/fuel`.
- ✅ **Driver Module Refinement (History & Management):**
  - **Lịch sử (History) Tab**:
    - Hiển thị tất cả chuyến đi đã hoàn thành/hủy hoặc đã lưu trữ.
    - Admin có quyền xóa vĩnh viễn.
  - **Lịch điều xe (Trips) Tab**:
    - Thêm chức năng **Lưu trữ (Archive)** cho các chuyến đã hoàn thành (ẩn khỏi danh sách chính).
  - **Quản lý xe (Vehicles)**:
    - Thêm chức năng **Chỉnh sửa (Edit)** thông tin xe (Admin/Driver Manager).
  - Cập nhật Prisma Schema: Thêm `isArchived` vào `TransportRequest`.
  - **UI Improvements**: Thay thế browser `confirm` bằng Modal xác nhận tùy chỉnh (Archive/Delete).
  - **Bug Fix**: Sửa lỗi hiển thị dữ liệu nhật ký nhiên liệu (`FuelLog`).
  - **Permission Fix**: Cho phép Driver (được phân công) tự lưu trữ phiếu đã hoàn thành.
  - **Error Handling**: Thêm Alert hiển thị lỗi cho người dùng khi API thất bại.
  - **Workflow Update**: Cập nhật luồng Duyệt (Approve) đi kèm với Điều xe (Vehicle Selection/Assignment) cho Manager.
  - **Data Consistency**: Cập nhật trạng thái xe (`AVAILABLE`/`IN_USE`) tự động khi duyệt hoặc hoàn thành chuyến đi.
- ✅ **Cleanup:** Dọn dẹp folder dự án, di chuyển các file rác vào `cleanup/`.
- [2026-02-04] Standardized Request Forms Integration (Driver, Security, Supply)
  - **Global Request Page (`app/dashboard/request/page.tsx`)**:
    - Integrated specialized forms triggered by Department selection:
      - **Driver**: Added fields for `Passenger Name`, `Count`, `Pickup Time`, `Trip Type`, `Destination`.
      - **Security**: Added fields for `Incident Type`, `Severity`, `Location` (Smart Select), `Description` (Mandatory).
      - **Supply**: Added fields for `Item Name`, `Quantity`, `Unit`, `Category`, `Urgency`.
    - **Validation**: implemented client-side validation to enforce required fields for each department.
    - **API Routing**: Updated `handleSubmit` to intelligently route payloads to specific department endpoints (`/api/driver/requests`, `/api/security/requests`, `/api/supply/requests`) instead of the generic one.
  - **UI/UX**:
    - Added visual cues (colors/icons) matching department themes (Driver: Pink/Slate, Security: Red, Supply: Orange).
    - Fixed UI bugs involving React Fragments and layout issues.
