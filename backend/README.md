# BTC Price - Backend

NestJS 기반의 암호화폐 포트폴리오 관리 백엔드 API

## 기술 스택

- **Framework**: NestJS
- **Database**: SQLite (Prisma ORM)
- **Authentication**: JWT (JSON Web Token)
- **Real-time**: Socket.IO (WebSocket)
- **Language**: TypeScript

## 주요 기능

### 🔐 인증 (Authentication)
- 회원가입 (`POST /auth/register`)
- 로그인 (`POST /auth/login`)
- JWT 기반 인증

### 💰 지갑 관리 (Wallet)
- 잔액 조회 (`GET /wallet/balance`)
- 코인 구매 (`POST /wallet/buy`)
- 트랜잭션 기록

### 🔄 실시간 업데이트 (WebSocket)
- 지갑 잔액 변경 시 실시간 알림
- Socket.IO 기반

## 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경 변수 설정
`.env` 파일을 생성하고 다음 내용을 추가:
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key"
PORT=3001
```

### 3. 데이터베이스 마이그레이션
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 4. 서버 실행
```bash
# 개발 모드
npm run start:dev

# 프로덕션 모드
npm run build
npm run start:prod
```

서버는 `http://localhost:3001`에서 실행됩니다.

## API 엔드포인트

### 인증
```bash
# 회원가입
POST /auth/register
Content-Type: application/json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name"
}

# 로그인
POST /auth/login
Content-Type: application/json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### 지갑 (인증 필요)
```bash
# 잔액 조회
GET /wallet/balance
Authorization: Bearer {access_token}

# 코인 구매
POST /wallet/buy
Authorization: Bearer {access_token}
Content-Type: application/json
{
  "coinId": "bitcoin",
  "amount": 0.1,
  "price": 50000
}
```

## 데이터베이스 스키마

### User
- `id`: 사용자 ID
- `email`: 이메일 (unique)
- `password`: 암호화된 비밀번호
- `name`: 사용자 이름
- `createdAt`: 생성일

### Wallet
- `id`: 지갑 ID
- `balance`: 잔액
- `userId`: 사용자 ID (1:1)

### Transaction
- `id`: 트랜잭션 ID
- `walletId`: 지갑 ID
- `coinId`: 코인 ID
- `amount`: 수량
- `price`: 가격
- `type`: 거래 타입 (BUY/SELL)
- `createdAt`: 생성일

## 프로젝트 구조

```
backend/
├── prisma/
│   ├── schema.prisma      # 데이터베이스 스키마
│   └── migrations/        # 마이그레이션 파일
├── src/
│   ├── auth/             # 인증 모듈
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   └── jwt.strategy.ts
│   ├── wallet/           # 지갑 모듈
│   │   ├── wallet.controller.ts
│   │   ├── wallet.service.ts
│   │   └── wallet.module.ts
│   ├── events/           # WebSocket 모듈
│   │   ├── events.gateway.ts
│   │   └── events.module.ts
│   ├── prisma/           # Prisma 서비스
│   │   ├── prisma.service.ts
│   │   └── prisma.module.ts
│   └── main.ts           # 애플리케이션 엔트리
└── package.json
```

## 테스트

```bash
# 유닛 테스트
npm run test

# E2E 테스트
npm run test:e2e

# 테스트 커버리지
npm run test:cov
```

## 개발 도구

- **Prisma Studio**: 데이터베이스 GUI
  ```bash
  npx prisma studio
  ```

## CORS 설정

프론트엔드(`http://localhost:3000`)에서의 요청을 허용하도록 CORS가 설정되어 있습니다.

## 라이선스

MIT
