# Next.js 마이그레이션 가이드

## 현재 진행 상황

### ✅ 완료된 작업

1. **Next.js 14 설치 및 기본 설정**
   - `next.config.js` 설정
   - `tsconfig.json` 업데이트 (App Router 지원)
   - Path aliases 설정 (`@components`, `@lib`, `@styles` 등)

2. **프로젝트 구조 생성**
   ```
   ├── app/
   │   ├── layout.tsx (Root Layout)
   │   ├── page.tsx (Redirect to /home)
   │   ├── home/page.tsx (홈 페이지)
   │   └── mypage/members/page.tsx (구성원 관리 페이지)
   ├── components/ (기존 컴포넌트 복사)
   ├── lib/
   │   ├── api/
   │   │   ├── client.ts (API 클라이언트 설정)
   │   │   └── members.ts (Members API 함수)
   │   └── query-client.ts (React Query 설정)
   ├── providers/
   │   └── query-provider.tsx (Query Client Provider)
   ├── styles/ (기존 스타일 복사)
   └── docs/
       ├── api.md (API 문서)
       └── mockapi-setup.md (MockAPI 설정 가이드)
   ```

3. **API 클라이언트 구현**
   - Axios 기반 API 클라이언트 (`lib/api/client.ts`)
   - Members API 함수 (`lib/api/members.ts`)
   - Request/Response 인터셉터 (인증, 에러 처리)

4. **API 문서 작성**
   - 전체 API 엔드포인트 문서 (`docs/api.md`)
   - MockAPI 설정 가이드 (`docs/mockapi-setup.md`)
   - Request/Response 예시 포함

5. **샘플 페이지 구현**
   - 홈 페이지 (`app/home/page.tsx`)
   - 구성원 관리 페이지 (`app/mypage/members/page.tsx`)
   - React Query 통합

### ⏳ 진행 중인 작업

- Workflow 설정 변경 (Next.js dev 서버 실행)
- 나머지 페이지 마이그레이션

### 📋 남은 작업

1. **페이지 마이그레이션**
   - 인증 페이지 (로그인, 회원가입)
   - 프로젝트 생성 플로우 (18단계)
   - Work 섹션 (프로젝트, 스케줄, 메시지 등)
   - 가이드 페이지들

2. **API 구현**
   - Projects API
   - Messages API
   - Authentication API
   - MockAPI 컬렉션 설정

3. **스타일 마이그레이션**
   - 기존 CSS 클래스 검증
   - 반응형 디자인 확인
   - Dark mode 지원 (필요시)

4. **테스트 및 QA**
   - 모든 페이지 기능 테스트
   - 한국어 UI 확인
   - CSS 일관성 검증

## 실행 방법

### 개발 서버 시작

**중요**: Workflow 설정을 업데이트해야 합니다.

Replit Workflow 설정:
- Command: `next dev -p 5000`

또는 직접 실행:
```bash
# Next.js 개발 서버 (포트 5000)
npx next dev -p 5000

# 기존 Express 서버 (현재 Workflow 설정)
npm run dev
```

### 빌드
```bash
# Next.js 프로덕션 빌드
npx next build

# 빌드된 앱 실행
npx next start -p 5000
```

**참고**: package.json의 scripts는 직접 수정할 수 없으므로 Workflow 설정을 변경하거나 npx를 사용해야 합니다.

## 환경 변수 설정

1. `.env.local` 파일 생성:
```bash
cp .env.local.example .env.local
```

2. MockAPI URL 설정:
```env
NEXT_PUBLIC_API_URL=https://your-project-id.mockapi.io/api/v1
```

## MockAPI 설정

1. [mockapi.io](https://mockapi.io)에서 프로젝트 생성
2. `docs/mockapi-setup.md` 가이드 참고
3. Members, Projects, Messages 컬렉션 생성
4. `.env.local`에 API URL 설정

## API 문서

- 전체 API 문서: `docs/api.md`
- MockAPI 설정: `docs/mockapi-setup.md`

## 주요 변경사항

### 라우팅
- **이전**: wouter (`/path`)
- **이후**: Next.js App Router (`app/path/page.tsx`)

### 데이터 페칭
- **이전**: Express API + React Query
- **이후**: MockAPI + React Query

### 스타일링
- **변경 없음**: Tailwind CSS + 중앙집중식 CSS 클래스 유지

### 컴포넌트
- **변경 없음**: Shadcn UI 컴포넌트 유지

## 다음 단계

1. Workflow 설정을 `npm run dev`로 변경
2. 나머지 페이지를 Next.js로 마이그레이션
3. MockAPI 컬렉션 설정
4. 전체 기능 테스트

## 참고사항

- 기존 코드는 `client/`, `server/` 폴더에 보존됨
- Next.js와 기존 시스템을 병행 운영 가능
- 점진적 마이그레이션 가능
