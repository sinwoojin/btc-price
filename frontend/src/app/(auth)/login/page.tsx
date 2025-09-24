"use client";

import { fetchClient } from "@/lib/api/fetchClient";
import Link from "next/link";
import { useState } from "react";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () =>
    await fetchClient("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

  return (
    <div className="min-h-[100vh] bg-[#f9fafb] flex flex-col justify-center items-center">
      <div
        style={{
          background: "#fff",
          borderRadius: 24,
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
          padding: "40px 32px",
          width: 340,
          display: "flex",
          flexDirection: "column",
          gap: 24,
        }}
      >
        <h2 style={{ fontWeight: 700, fontSize: 28, color: "#222" }}>로그인</h2>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            padding: "16px",
            borderRadius: 12,
            border: "1px solid #e5e8eb",
            fontSize: 16,
            outline: "none",
            marginBottom: 8,
          }}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: "16px",
            borderRadius: 12,
            border: "1px solid #e5e8eb",
            fontSize: 16,
            outline: "none",
            marginBottom: 8,
          }}
        />
        <button
          style={{
            background: "#3182f6",
            color: "#fff",
            fontWeight: 600,
            fontSize: 18,
            border: "none",
            borderRadius: 12,
            padding: "16px",
            cursor: "pointer",
            marginTop: 8,
            transition: "background 0.2s",
          }}
          onClick={handleLogin}
        >
          로그인하기
        </button>
      </div>
      <div style={{ marginTop: 24, color: "#8b95a1", fontSize: 15 }}>
        계정이 없으신가요?{" "}
        <Link
          href="/signup"
          style={{ color: "#3182f6", textDecoration: "none", fontWeight: 500 }}
        >
          회원가입
        </Link>
      </div>
    </div>
  );
}

export default LoginPage;
