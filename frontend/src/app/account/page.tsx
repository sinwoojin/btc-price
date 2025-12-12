"use client";

import SettingCard from "@/components/SettingCard";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useAuth, useUser } from "@/context/AuthUserProvider";
import { fetchClient } from "@/lib/api/fetchClient";
import { useTheme } from "@/lib/utils/theme-context";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Portfolio {
  balance: number;
  holdings: {
    coinId: string;
    amount: number;
    averagePrice: number;
  }[];
}

function Account() {
  const { user, clearUser } = useUser();
  const { accessToken, clearAccessToken } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const isDark = theme === "dark";

  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);

  useEffect(() => {
    if (accessToken) {
      fetchPortfolio();
    }
  }, [accessToken]);

  const fetchPortfolio = async () => {
    try {
      const response = await fetchClient("/wallet/portfolio", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        method: "GET",
      });
      if (response.ok) {
        const data = await response.json();
        setPortfolio(data);
      }
    } catch (err) {
      console.error("Failed to fetch portfolio:", err);
    }
  };

  const handleLogout = () => {
    clearAccessToken();
    clearUser();
    router.push("/login");
  };

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
          내 계정
        </h2>
        <div className="flex flex-col gap-4">
          {/* 사용자 정보 */}
          <div
            className={`flex flex-col gap-2 ${
              isDark
                ? "bg-[#222] border border-[#444] text-[#ededed]"
                : "bg-white border border-[#e5e8eb] text-[#222]"
            } rounded-xl px-4 py-4 font-medium text-base`}
          >
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">이메일</span>
              <span>{user?.email ?? "로그인 필요"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">이름</span>
              <span>{user?.name ?? "-"}</span>
            </div>
          </div>

          {/* 지갑 정보 */}
          {user && (
            <div
              className={`flex flex-col gap-3 ${
                isDark
                  ? "bg-[#222] border border-[#444] text-[#ededed]"
                  : "bg-white border border-[#e5e8eb] text-[#222]"
              } rounded-xl px-4 py-4`}
            >
              <h3 className="font-bold text-lg border-b pb-2 mb-1 border-gray-700/50">
                지갑 현황
              </h3>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">보유 현금</span>
                <span className="font-bold text-lg text-[#3182f6]">
                  {portfolio ? Math.floor(portfolio.balance).toLocaleString() : 0} USDT
                </span>
              </div>
              
              <div className="mt-2">
                <span className="text-sm text-gray-500 mb-2 block">보유 코인</span>
                {portfolio?.holdings.length === 0 ? (
                  <div className="text-center text-sm text-gray-400 py-2">
                    보유 중인 코인이 없습니다.
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {portfolio?.holdings.map((holding) => (
                      <div key={holding.coinId} className="flex justify-between items-center bg-black/5 dark:bg-white/5 p-2 rounded-lg">
                        <span className="font-medium">{holding.coinId}</span>
                        <div className="text-right">
                          <div className="font-medium">{holding.amount} 개</div>
                          <div className="text-xs text-gray-500">
                            평단가: {Math.floor(holding.averagePrice).toLocaleString()} USDT
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 테마 설정 */}
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
              테마 설정
            </span>
            <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-2">
          {user ? (
            <Button 
              onClick={handleLogout}
              className="bg-[#e5e8eb] text-[#222] font-semibold text-base rounded-xl py-3 transition-colors duration-500 hover:bg-gray-300"
            >
              로그아웃
            </Button>
          ) : (
            <Link
              href="/login"
              className="bg-[#3182f6] text-white font-semibold text-base rounded-xl py-3 text-center no-underline transition-colors duration-500 hover:bg-blue-600"
            >
              로그인
            </Link>
          )}
        </div>
      </SettingCard>
    </div>
  );
}

export default Account;
