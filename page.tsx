"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../page.module.css"; // Reuse login styles

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        confirmPassword: "",
        fullName: "",
        department: "technical"
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate registration
        alert("Đăng ký thành công! Vui lòng chờ quản trị viên duyệt.");
        router.push("/");
    };

    return (
        <main className={styles.container}>
            <div className={styles.loginCard} style={{ maxWidth: '500px' }}>
                <div className={styles.logoSection}>
                    <h1 className={styles.logoTitle}>ĐĂNG KÝ TÀI KHOẢN</h1>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label className="label">Họ và tên</label>
                        <input
                            type="text"
                            className="input"
                            required
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className="label">Phòng ban / Tổ</label>
                        <select
                            className="input"
                            value={formData.department}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        >
                            <option value="technical">Tổ Kỹ thuật vận hành</option>
                            <option value="nursing">Tổ Hộ lý</option>
                            <option value="driver">Tổ Lái xe</option>
                            <option value="security">Tổ Bảo vệ</option>
                            <option value="supply">Tổ Cung ứng</option>
                            <option value="environment">Tổ Môi trường</option>
                        </select>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className="label">Tên đăng nhập</label>
                        <input
                            type="text"
                            className="input"
                            required
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label className="label">Mật khẩu</label>
                        <input
                            type="password"
                            className="input"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                        Gửi yêu cầu đăng ký
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                        <Link href="/" style={{ color: 'var(--bih-blue)', fontSize: '0.9rem' }}>
                            Đã có tài khoản? Đăng nhập ngay
                        </Link>
                    </div>
                </form>
            </div>
        </main>
    );
}
