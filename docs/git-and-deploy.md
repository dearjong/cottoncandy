# Git · 배포 치트시트

로컬에서 수정한 내용이 **브라우저에 안 보일 때** 대부분은 “커밋/푸시”가 아니라 **실행 중인 서버가 옛 코드**인 경우입니다.

## 한 줄 요약

- **GitHub에 반영** = `commit` + `push`
- **화면에 반영** = 그 URL을 띄우는 머신에서 `git pull` + (필요 시) `npm install` / `npm run build` + **프로세스 재시작**

## 원격(remote) 확인

```powershell
git remote -v
```

`origin`이 바라보는 저장소가 곧 `git push` / `git pull` 대상입니다.

## 로컬에서 올리기

```powershell
git status
git add .
git commit -m "설명"
git push origin main
```

## 서버에서 최신 맞추기 (예: Windows)

```powershell
cd D:\_JH\prototype\cottoncandy
git pull origin main
```

의존성·빌드가 필요할 때(에러나 `vite`/`cross-env` 없음 등):

```powershell
taskkill /F /IM node.exe
npm install
npm run build
npm start
```

개발 모드:

```powershell
npm run dev
```

## 포트

서버 기본 포트는 `server/index.ts`에서 `process.env.PORT`가 없을 때의 기본값을 씁니다.  
다른 포트로 띄우려면 실행 전에:

```powershell
$env:PORT=4000; npm run dev
# 또는
$env:PORT=4000; npm start
```

`EADDRINUSE`가 나오면 해당 포트를 쓰는 프로세스를 먼저 종료합니다.

```powershell
netstat -ano | findstr :4000
taskkill /F /PID <PID>
```

## PR로 `main`에 합치기

브랜치에 올린 뒤 GitHub에서 **Pull Request → Merge**하면 `main`이 갱신됩니다.  
머지 후에도 서버는 **pull + 재시작**을 해야 화면이 바뀝니다.

## 주소 구분

- `http://localhost:포트/...` → **지금 PC**에서 띄운 서버
- `http://192.168.x.x:포트/...` → **해당 IP의 PC**에서 띄운 서버 (내 PC와 다를 수 있음)
