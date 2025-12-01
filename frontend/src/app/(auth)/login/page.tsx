"use client";

import SettingCard from "@/components/SettingCard";
import { useAuth, useUser } from "@/context/AuthUserProvider";
import { fetchClient } from "@/lib/api/fetchClient";
import { useTheme } from "@/lib/utils/theme-context";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();
  const router = useRouter();
  const { setAccessToken } = useAuth();
  const { setUser } = useUser();
  const isDark = theme === "dark";

  const inputClass = `p-4 rounded-xl border outline-none mb-2 text-base ${
    isDark
      ? "bg-[#222] border-[#444] text-[#ededed]"
      : "bg-white border-[#e5e8eb] text-[#222]"
  }`;

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetchClient("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Context 업데이트 (로컬 스토리지는 Provider가 처리)
        if (data.access_token) {
          setAccessToken(data.access_token);
        }
        if (data.user) {
          setUser(data.user);
        }
        // 메인 페이지로 이동
        router.push("/");
      } else {
        const data = await response.json();
        setError(data.message || "로그인에 실패했습니다.");
      }
    } catch (err) {
      setError("서버 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-center items-center ${
        isDark ? "bg-[#171717]" : "bg-[#f9fafb]"
      }`}
    >
      <SettingCard isDark={isDark}>
        <h2
          className={`font-bold text-2xl mb-4 ${
            isDark ? "text-[#ededed]" : "text-[#222]"
          }`}
        >
          로그인
        </h2>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
          disabled={loading}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleLogin()}
          className={inputClass}
          disabled={loading}
        />
        <button
          className="bg-[#3182f6] text-white font-semibold text-lg rounded-xl py-4 mt-2 transition-colors duration-200 hover:bg-[#2563eb] w-full disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "로그인 중..." : "로그인하기"}
        </button>
        <div className="mt-6 text-[#8b95a1] text-sm text-center">
          계정이 없으신가요?{" "}
          <Link
            href="/signup"
            className="text-[#3182f6] font-medium no-underline hover:underline"
          >
            회원가입
          </Link>
        </div>
      </SettingCard>
    </div>
  );
}

export default LoginPage;
