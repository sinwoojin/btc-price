# BTC Price - Frontend

Next.js 기반의 암호화폐 포트폴리오 관리 프론트엔드

## 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, shadcn/ui
- **Charts**: Recharts
- **Real-time**: Socket.IO Client
- **State Management**: React Context API

## 주요 기능

### 🔐 인증
- 로그인 페이지 (`/login`)
- 회원가입 페이지 (`/signup`)
- JWT 토큰 기반 인증

### 📊 대시보드
- 실시간 암호화폐 가격 차트
- 포트폴리오 현황
- 보유 코인 목록

### 💼 계정 관리
- 프로필 정보
- 지갑 잔액 조회
- 거래 내역

### 🎨 테마
- 다크/라이트 모드 지원
- 반응형 디자인

## 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
`.env.local` 파일을 생성하고 다음 내용을 추가:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. 개발 서버 실행
```bash
npm run dev
```

애플리케이션은 `http://localhost:3000`에서 실행됩니다.

### 4. 프로덕션 빌드
```bash
npm run build
npm run start
```

## 프로젝트 구조

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # 인증 관련 페이지
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── (main)/            # 메인 페이지
│   │   ├── account/           # 계정 페이지
│   │   └── stock/             # 주식/코인 상세
│   ├── components/            # 재사용 가능한 컴포넌트
│   │   ├── ui/               # shadcn/ui 컴포넌트
│   │   ├── SettingCard.tsx
│   │   ├── Header.tsx
│   │   └── ...
│   ├── lib/                   # 유틸리티 함수
│   │   ├── api/              # API 클라이언트
│   │   └── utils/            # 헬퍼 함수
│   ├── context/              # React Context
│   │   └── theme-context.tsx
│   └── config/               # 설정 파일
│       └── api.ts
├── public/                    # 정적 파일
└── package.json
```

## 주요 페이지

### 홈 (`/`)
- 암호화폐 가격 차트
- 인기 코인 목록
- 시장 동향

### 로그인 (`/login`)
- 이메일/비밀번호 로그인
- 회원가입 링크

### 회원가입 (`/signup`)
- 이름, 이메일, 비밀번호 입력
- 유효성 검사
- 자동 로그인 페이지 이동

### 계정 (`/account`)
- 프로필 정보
- 지갑 잔액
- 거래 내역

## API 연동

백엔드 API와 통신하기 위해 `fetchClient` 유틸리티를 사용합니다:

```typescript
import { fetchClient } from "@/lib/api/fetchClient";

// 예시: 로그인
const response = await fetchClient("/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});
```

## 스타일링

### Tailwind CSS
- 유틸리티 우선 CSS 프레임워크
- 커스텀 색상 및 테마 설정

### 다크 모드
```typescript
import { useTheme } from "@/lib/utils/theme-context";

const { theme, toggleTheme } = useTheme();
const isDark = theme === "dark";
```

## 컴포넌트

### UI 컴포넌트 (shadcn/ui)
- Button
- Card
- Input
- Select
- Dialog
- 등...

### 커스텀 컴포넌트
- `SettingCard`: 설정 카드 래퍼
- `Header`: 네비게이션 헤더
- `CoinChart`: 코인 가격 차트

## 개발 가이드

### 새 페이지 추가
```bash
# App Router 사용
# src/app/your-page/page.tsx 생성
```

### 새 컴포넌트 추가
```bash
# shadcn/ui 컴포넌트 추가
npx shadcn@latest add [component-name]
```

### API 엔드포인트 추가
```typescript
// src/config/api.ts에서 BASE_URL 확인
export const BASE_URL = "http://localhost:3001";
```

## 환경 변수

- `NEXT_PUBLIC_API_URL`: 백엔드 API URL

## 빌드 최적화

- **이미지 최적화**: Next.js Image 컴포넌트 사용
- **코드 스플리팅**: 자동 라우트 기반 분할
- **폰트 최적화**: next/font 사용

## 배포

### Vercel (권장)
```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel
```

### Docker
```bash
# Dockerfile 사용
docker build -t btc-price-frontend .
docker run -p 3000:3000 btc-price-frontend
```

## 라이선스

MIT
