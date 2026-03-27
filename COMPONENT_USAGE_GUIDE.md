# Cotton Candy 컴포넌트 사용 가이드

## 📁 파일 구조

```
client/src/
├── components/
│   ├── layout/
│   │   ├── header.tsx        # 최상단 고정 헤더 (모든 페이지 공통)
│   │   ├── footer.tsx        # 푸터 (모든 페이지 공통)
│   │   └── layout.tsx        # Header + Body + Footer 래퍼
│   └── onboarding/
│       ├── onboarding-step-body.tsx      # 페이지 바디 영역
│       ├── onboarding-modal.tsx          # 팝업 모달
│       └── step-content.tsx              # 스텝 콘텐츠 유틸리티
```

## 🎯 컴포넌트 사용법

### 1. Layout (Header + Footer 자동 포함)

모든 페이지에서 사용. Header는 최상단 고정, Footer는 하단 고정.

```tsx
import Layout from "@/components/layout/layout";

export default function MyPage() {
  return (
    <Layout>
      {/* 여기에 페이지 내용 */}
    </Layout>
  );
}
```

### 2. OnboardingStepBody (바디 영역)

페이지 헤더와 콘텐츠를 감싸는 구조화된 바디 컴포넌트.

```tsx
import OnboardingStepBody from "@/components/onboarding/onboarding-step-body";

<OnboardingStepBody
  title="[Step1] 내 마음을 알아주는 파트너"
  subtitle={
    <p className="page-subtitle">
      광고주 또는 신규 가입자가 광고제작 의뢰 등록시 TVCF PRO서비스 1년 무료!
    </p>
  }
  guideButton={
    <button className="btn-small">이용방법</button>
  }
>
  {/* 여기에 페이지 콘텐츠 */}
</OnboardingStepBody>
```

### 3. OnboardingModal (팝업)

상세 화면에서 각 섹션을 수정할 때 사용하는 모달.

```tsx
import OnboardingModal from "@/components/onboarding/onboarding-modal";
import { useState } from "react";

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)}>수정</button>
      
      <OnboardingModal
        open={isOpen}
        onOpenChange={setIsOpen}
        title="정보 수정"
        description="수정할 내용을 입력하세요"
        maxWidth="max-w-2xl"
      >
        {/* 모달 내용 */}
        <div>수정 폼</div>
      </OnboardingModal>
    </>
  );
}
```

### 4. StepContent 유틸리티

애니메이션이 포함된 스텝 콘텐츠 섹션.

```tsx
import { StepContentSection, StepFormSection, StepActions } from "@/components/onboarding/step-content";

<StepContentSection delay={0.2}>
  {/* 카드 그리드 등 */}
</StepContentSection>

<StepFormSection delay={0.4}>
  {/* 폼 섹션 */}
</StepFormSection>

<StepActions delay={0.6}>
  {/* 버튼 그룹 */}
</StepActions>
```

## 🎨 CSS 클래스 시스템

모든 스타일은 `client/src/index.css`에서 중앙 관리됩니다.

### 자주 사용하는 클래스:

```css
/* 레이아웃 */
.page-container         /* 페이지 컨테이너 */
.page-content          /* 페이지 콘텐츠 영역 */
.header-section        /* 헤더 섹션 */
.section-spacing       /* 섹션 간격 */

/* 타이포그래피 */
.page-title            /* 페이지 제목 */
.page-subtitle         /* 페이지 부제목 */
.card-title            /* 카드 제목 */
.section-title         /* 섹션 제목 */

/* 카드 */
.selection-card        /* 선택 카드 */
.card-grid             /* 카드 그리드 */

/* 버튼 */
.btn-primary           /* 기본 버튼 (핑크) */
.btn-secondary         /* 보조 버튼 (회색) */
.btn-small             /* 작은 버튼 */
.btn-group             /* 버튼 그룹 */

/* 폼 */
.onboarding-section          /* 온보딩 섹션 */
.onboarding-section-title    /* 섹션 제목 */
.onboarding-option-label     /* 옵션 라벨 */
.onboarding-description      /* 설명 텍스트 */
.form-control-group          /* 폼 컨트롤 그룹 */
.input-field                 /* 입력 필드 */

/* 플로팅 */
.floating-buttons      /* 플로팅 버튼 컨테이너 */
.floating-btn-primary  /* 핑크 플로팅 버튼 */
.floating-btn-secondary /* 회색 플로팅 버튼 */
```

## 📋 전체 페이지 예제

```tsx
import Layout from "@/components/layout/layout";
import OnboardingStepBody from "@/components/onboarding/onboarding-step-body";
import { StepContentSection, StepFormSection, StepActions } from "@/components/onboarding/step-content";
import { Button } from "@/components/ui/button";

export default function Step1() {
  return (
    <Layout>
      <OnboardingStepBody
        title="[Step1] 페이지 제목"
        subtitle={<p className="page-subtitle">부제목</p>}
        guideButton={<button className="btn-small">이용방법</button>}
      >
        <StepContentSection delay={0.2}>
          <div className="card-grid card-grid-gap">
            {/* 카드들 */}
          </div>
        </StepContentSection>

        <StepFormSection delay={0.4}>
          <div className="onboarding-section">
            {/* 폼 요소들 */}
          </div>
        </StepFormSection>

        <StepActions delay={0.6}>
          <div className="btn-group">
            <Button className="btn-secondary">이전</Button>
            <Button className="btn-primary">다음</Button>
          </div>
        </StepActions>
      </OnboardingStepBody>
    </Layout>
  );
}
```

## 🚀 주요 특징

1. **모듈화**: 각 UI 요소가 독립적인 컴포넌트
2. **재사용성**: 모든 페이지에서 동일한 구조 사용 가능
3. **중앙 관리**: CSS 클래스로 스타일 통일 관리
4. **팝업 지원**: 상세 화면에서 섹션별 수정 가능
5. **반응형**: 모바일/태블릿/데스크톱 자동 대응
