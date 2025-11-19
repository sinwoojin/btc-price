"use client";

import SettingCard from "@/components/SettingCard";
import { fetchClient } from "@/lib/api/fetchClient";
import { useTheme } from "@/lib/utils/theme-context";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const { theme } = useTheme();
  const router = useRouter();
  const isDark = theme === "dark";

  const inputClass = `p-4 rounded-xl border outline-none mb-2 text-base ${
    isDark
      ? "bg-[#222] border-[#444] text-[#ededed]"
      : "bg-white border-[#e5e8eb] text-[#222]"
  }`;

  const handleSignup = async () => {
    setError("");

    // 유효성 검사
    if (!email || !password || !confirmPassword || !name) {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (password.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    try {
      const response = await fetchClient("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      if (response.ok) {
        // 회원가입 성공 시 로그인 페이지로 이동
        router.push("/login");
      } else {
        const data = await response.json();
        setError(data.message || "회원가입에 실패했습니다.");
      }
    } catch (err) {
      setError("서버 오류가 발생했습니다.");
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
          회원가입
        </h2>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="이름"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
        <input
          type="password"
          placeholder="비밀번호 (최소 6자)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClass}
        />
        <input
          type="password"
          placeholder="비밀번호 확인"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={inputClass}
        />
        <button
          className="bg-[#3182f6] text-white font-semibold text-lg rounded-xl py-4 mt-2 transition-colors duration-200 hover:bg-[#2563eb] w-full"
          onClick={handleSignup}
        >
          회원가입하기
        </button>
        <div className="mt-6 text-[#8b95a1] text-sm text-center">
          이미 계정이 있으신가요?{" "}
          <Link
            href="/login"
            className="text-[#3182f6] font-medium no-underline hover:underline"
          >
            로그인
          </Link>
        </div>
      </SettingCard>
    </div>
  );
}

export default SignupPage;
