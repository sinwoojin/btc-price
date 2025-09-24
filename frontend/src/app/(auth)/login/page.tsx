"use client";

import SettingCard from "@/components/SettingCard";
import { fetchClient } from "@/lib/api/fetchClient";
import { useTheme } from "@/lib/utils/theme-context";
import Link from "next/link";
import { useState } from "react";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const inputClass = `p-4 rounded-xl border outline-none mb-2 text-base ${
    isDark
      ? "bg-[#222] border-[#444] text-[#ededed]"
      : "bg-white border-[#e5e8eb] text-[#222]"
  }`;

  const handleLogin = async () =>
    await fetchClient("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

  return (
    <div
      className={`min-h-screen flex flex-col justify-center items-center ${
        isDark ? "bg-[#171717]" : "bg-[#f9fafb]"
      }`}
    >
      <SettingCard isDark={isDark}>
        <h2
          className={`font-bold text-2xl ${
            isDark ? "text-[#ededed]" : "text-[#222]"
          }`}
        >
          로그인
        </h2>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
        />
        <button
          className="bg-[#3182f6] text-white font-semibold text-lg rounded-xl py-4 mt-2 transition-colors duration-1000"
          onClick={handleLogin}
        >
          로그인하기
        </button>
        <div className="mt-6 text-[#8b95a1] text-sm text-center">
          계정이 없으신가요?{" "}
          <Link
            href="/signup"
            className="text-[#3182f6] font-medium no-underline"
          >
            회원가입
          </Link>
        </div>
      </SettingCard>
    </div>
  );
}

export default LoginPage;
