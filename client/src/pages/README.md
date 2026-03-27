# pages 구조

```
pages/
├── service/                 # 서비스 이용 (의뢰·가이드·파트너·프로젝트목록)
│   ├── create-project/      # 광고제작 의뢰 플로우
│   ├── guides/              # 이용안내, FAQ, 공지 등
│   ├── partners/            # 파트너 찾기, 포트폴리오
│   └── project-list/        # 프로젝트 목록·상세
├── work/                    # 작업 공간 (프로젝트, 메시지, 파일, 설정)
├── company/                 # 회사(파트너) 포트폴리오
│   └── company-portfolio/
├── my/                      # 마이페이지 (기존 mypage)
├── member/                  # 로그인·회원가입
├── admin/                   # 관리자
├── home.tsx
├── contest.tsx
├── design-system.tsx
└── not-found.tsx
```

**URL은 기존과 동일**합니다. (`/create-project/*`, `/guide/*`, `/work/company-portfolio`, `/mypage/*` 등)
