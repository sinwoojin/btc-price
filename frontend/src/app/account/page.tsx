"use client";

import SettingCard from "@/components/SettingCard";
import ThemeToggle from "@/components/ThemeToggle";
import { useUser } from "@/context/AuthUserProvider";
import { useTheme } from "@/lib/utils/theme-context";
import Link from "next/link";

function Account() {
  const { user } = useUser();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

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
          개인설정
        </h2>
        <div className="flex flex-col gap-4">
          <div
            className={`flex items-center justify-between ${
              isDark
                ? "bg-[#222] border border-[#444]"
                : "bg-white border border-[#e5e8eb]"
            } rounded-xl px-4 py-4`}
          >
            <span
              className={`font-medium text-base ${
                isDark ? "text-[#ededed]" : "text-[#222]"
              }`}
            >
              테마
            </span>
            <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
          </div>
          <div
            className={`flex flex-col gap-2 ${
              isDark
                ? "bg-[#222] border border-[#444] text-[#ededed]"
                : "bg-white border border-[#e5e8eb] text-[#222]"
            } rounded-xl px-4 py-4 font-medium text-base`}
          >
            <span>이메일: {user?.email ?? "로그인 필요"}</span>
            <span>이름: {user?.name ?? "-"}</span>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Link
            href="/login"
            className="bg-[#3182f6] text-white font-semibold text-base rounded-xl py-3 text-center no-underline transition-colors duration-500"
          >
            로그인
          </Link>
          <button className="bg-[#e5e8eb] text-[#222] font-semibold text-base rounded-xl py-3 transition-colors duration-500">
            로그아웃
          </button>
        </div>
      </SettingCard>
    </div>
  );
}

export default Account;
