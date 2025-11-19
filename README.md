# BTC Price - 암호화폐 포트폴리오 관리 시스템

실시간 암호화폐 가격 추적 및 포트폴리오 관리를 위한 풀스택 웹 애플리케이션

## 프로젝트 구조

```
btc-price/
├── frontend/          # Next.js 프론트엔드
├── backend/           # NestJS 백엔드
└── docker-compose.yml # Docker 오케스트레이션
```

## 기술 스택

### Frontend
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Recharts
- Socket.IO Client

### Backend
- NestJS
- Prisma (SQLite)
- JWT Authentication
- Socket.IO (WebSocket)

## 빠른 시작

### Docker 사용 (권장)

```bash
# 전체 애플리케이션 실행
docker-compose up --build

# 백그라운드 실행
docker-compose up -d

# 중지
docker-compose down
```

접속:
- **프론트엔드**: http://localhost:3000
- **백엔드 API**: http://localhost:3001

### 로컬 개발

#### 1. 백엔드 실행
```bash
cd backend
npm install
npx prisma migrate dev --name init
npx prisma generate
npm run start:dev
```

#### 2. 프론트엔드 실행
```bash
cd frontend
npm install
npm run dev
```

## 주요 기능

### 🔐 인증
- 회원가입 / 로그인
- JWT 기반 인증
- 보안 세션 관리

### 💰 지갑 관리
- 실시간 잔액 조회
- 코인 구매/판매
- 거래 내역 추적

### 📊 대시보드
- 실시간 암호화폐 가격 차트
- 포트폴리오 현황
- 시장 동향 분석

### 🔄 실시간 업데이트
- WebSocket 기반 실시간 데이터
- 지갑 잔액 자동 업데이트

### 🎨 UI/UX
- 다크/라이트 모드
- 반응형 디자인
- 모던한 인터페이스

## API 문서

### 인증
- `POST /auth/register` - 회원가입
- `POST /auth/login` - 로그인

### 지갑
- `GET /wallet/balance` - 잔액 조회
- `POST /wallet/buy` - 코인 구매

자세한 API 문서는 [backend/README.md](./backend/README.md)를 참조하세요.

## 환경 변수

### Backend (.env)
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
PORT=3001
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 개발 가이드

### 프로젝트 구조
- 각 서비스(frontend, backend)는 독립적으로 실행 가능
- Docker Compose로 전체 스택 실행 가능

### 코드 스타일
- TypeScript 사용
- ESLint + Prettier 설정
- 컴포넌트 기반 아키텍처

### 테스트
```bash
# 백엔드 테스트
cd backend
npm run test

# 프론트엔드 테스트
cd frontend
npm run test
```

## 배포

### Docker 배포
```bash
# 프로덕션 빌드
docker-compose -f docker-compose.yml up --build -d

# 로그 확인
docker-compose logs -f
```

### 개별 배포
- **Frontend**: Vercel, Netlify 등
- **Backend**: AWS, GCP, Heroku 등

## 트러블슈팅

### 포트 충돌
```bash
# 포트 사용 중인 프로세스 확인
lsof -i :3000
lsof -i :3001

# 프로세스 종료
kill -9 <PID>
```

### 데이터베이스 초기화
```bash
cd backend
rm prisma/dev.db
npx prisma migrate dev --name init
```

### Docker 캐시 삭제
```bash
docker-compose down -v
docker system prune -a
```

## 라이선스

MIT

## 기여

이슈 및 PR은 언제나 환영합니다!
