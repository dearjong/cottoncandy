# Windows 로컬 환경 설정 가이드

이 프로젝트는 Replit 환경에 최적화되어 있어서, Windows 로컬에서 실행하려면 **2개 파일을 수정**해야 합니다.

## 폴더 위치 예시
```
D:\_JH\dev\cotton-candy
D:\_JH\dev\cotton-candy2
```

## 필수 요구사항

### Node.js 버전
- **Node.js 20.11 이상** 필요 (LTS 권장)
- 버전 확인: `node --version`
- 다운로드: https://nodejs.org

### 패키지 설치
프로젝트 폴더에서:
```bash
npm install
```

---

## 🔧 필수 수정 사항

### 1️⃣ package.json 수정

**파일 위치**: `프로젝트루트/package.json`

**기존 코드** (7번째 줄):
```json
"dev": "NODE_ENV=development tsx server/index.ts",
```

**수정 코드**:
```json
"dev": "cross-env NODE_ENV=development tsx server/index.ts",
```

### 2️⃣ vite.config.ts 수정

**파일 위치**: `프로젝트루트/vite.config.ts`

**기존 코드** (4번째 줄):
```typescript
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
```

**수정 코드** (주석 처리):
```typescript
// import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
```

**기존 코드** (7~9번째 줄):
```typescript
  plugins: [
    react(),
    runtimeErrorOverlay(),
```

**수정 코드**:
```typescript
  plugins: [
    react(),
    // runtimeErrorOverlay(),
```

---

## 실행 방법

### 📌 방법 1: 전체 서버 실행 (권장)

```bash
npm run dev
```

접속: http://localhost:5000

### 📌 방법 2: 클라이언트만 실행

```bash
npx vite
```

접속: http://localhost:5173
(백엔드 API는 동작하지 않음)

---

## 문제 해결

### ❌ Node.js 버전 에러
```
TypeError: Cannot read properties of undefined (reading 'dirname')
```
→ Node.js 20.11 이상으로 업데이트

### ❌ cross-env 명령어 에러
```
'cross-env'은(는) 내부 또는 외부 명령...
```
→ `npm install` 다시 실행

### ❌ 포트 충돌 (5000번 사용중)
```bash
npx cross-env NODE_ENV=development PORT=3000 tsx server/index.ts
```

---

## 클라이언트 개발 팁

프론트엔드만 작업하는 경우:
- `npx vite` 실행
- 파일 저장 시 자동 새로고침 (HMR)
- API 연동 필요시 `npm run dev` 사용
