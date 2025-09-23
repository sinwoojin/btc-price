// src/components/ui/CountingNumber.tsx
"use client";

import { useEffect, useRef, useState } from "react";

interface CountingNumberProps {
  value: number; // 최종 목표 값
  duration?: number; // 애니메이션 지속 시간 (밀리초), 기본값 1000
  toFixed?: number; // 소수점 자릿수, 기본값 2
}

export const CountingNumber = ({
  value,
  duration = 1000,
  toFixed = 2,
}: CountingNumberProps) => {
  const [currentValue, setCurrentValue] = useState(0);
  const startValue = useRef(0);
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    // value가 변경될 때마다 애니메이션 시작
    const startTimestamp = performance.now();
    startValue.current = currentValue;

    const animate = (timestamp: DOMHighResTimeStamp) => {
      const progress = timestamp - startTimestamp;
      const animationProgress = Math.min(progress / duration, 1);

      const nextValue =
        startValue.current + (value - startValue.current) * animationProgress;
      setCurrentValue(nextValue);

      if (animationProgress < 1) {
        animationFrameId.current = requestAnimationFrame(animate);
      }
    };

    animationFrameId.current = requestAnimationFrame(animate);

    // 컴포넌트가 언마운트될 때 애니메이션 정리
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [value, duration]);

  // toFixed 속성을 적용하여 소수점 자릿수 조절
  const displayValue = Number(currentValue.toFixed(toFixed)).toLocaleString();

  return <>{displayValue}</>;
};
