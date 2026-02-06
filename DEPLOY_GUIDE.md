# Hướng dẫn Triển khai Web App Bệnh viện Becamex (BIH)

Gói triển khai này bao gồm bộ mã nguồn, Docker configurations, và scripts cần thiết để chạy ứng dụng trên máy chủ Linux.

## 1. Yêu cầu hệ thống
- **OS**: Ubuntu 20.04/22.04 LTS (Khuyến nghị) hoặc CentOS 7+.
- **Docker**: Phiên bản 20.10 trở lên.
- **Docker Compose**: Plugin v2.0+.
- **Cấu hình tối thiểu**:
  - CPU: 2 vCPU
  - RAM: 4GB
  - Disk: 20GB Free

## 2. Cấu trúc thư mục
Giải nén file `bih-deploy.zip`, bạn sẽ thấy cấu trúc như sau:
```
/bih-app
  ├── app/                # Source code ứng dụng
  ├── prisma/             # Cấu trúc CSDL
  ├── public/             # Tài nguyên tĩnh
  ├── ...
  ├── Dockerfile          # Cấu hình build image
  ├── docker-compose.yml  # Cấu hình services
  ├── .env.example        # Mẫu biến môi trường
  └── ...
```

## 3. Các bước triển khai

### Bước 1: Chuẩn bị biến môi trường
Copy file mẫu và tạo file `.env` chính thức:
```bash
cp .env.example .env
```
Mở file `.env` và chỉnh sửa các thông số quan trọng:
```ini
# Database (Quan trọng: Thay đổi mật khẩu mạnh)
POSTGRES_USER=admin
POSTGRES_PASSWORD=MatKhauBaoMatCuaBan
POSTGRES_DB=bih_infra_db

# App Authentication
# Tạo chuỗi ngẫu nhiên bằng lệnh: openssl rand -base64 32
NEXTAUTH_SECRET=ChuoiNgauNhienDai32KyTu
NEXTAUTH_URL=http://your-server-ip:3000

# AI Keys (Nếu có)
GOOGLE_API_KEY=...
OPENAI_API_KEY=...
```

### Bước 2: Build và Chạy Container
Tại thư mục gốc của dự án, chạy lệnh sau:

```bash
# Build images và chạy nền (-d)
docker compose up --build -d
```

### Bước 3: Kiểm tra trạng thái
```bash
docker compose ps
docker compose logs -f app
```
Nếu thấy log `Ready in ...ms` thì ứng dụng đã khởi động thành công.

## 4. Troubleshooting (Sự cố thường gặp)

**Lỗi: `exec format error` hoặc script không chạy**
Do định dạng dòng lệnh Windows (CRLF). Dockerfile đã tự động xử lý (dos2unix), nhưng nếu vẫn lỗi, hãy chạy thủ công:
```bash
dos2unix docker-entrypoint.sh
```

**Lỗi Database Prisma Client**
Nếu gặp lỗi liên quan đến Prisma Engine (binary/library), hãy đảm bảo `schema.prisma` có cấu hình:
```prisma
engineType = "binary"
```
Sau đó restart container:
```bash
docker compose restart app
```

## 5. Backup & Restore
Dữ liệu database được lưu trong volume docker `bih_postgres_data`. Đừng xóa volume này trừ khi muốn reset dữ liệu.

Để backup database:
```bash
docker exec bih_postgres_db pg_dump -U admin bih_infra_db > backup.sql
```
