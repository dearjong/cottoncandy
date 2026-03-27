/**
 * 프로젝트 등록 마법사 — `pages/service/create-project/` 내 TSX 파일명(확장자 제외)과 단계.
 * Mixpanel 이벤트명: `step_{단계번호|consulting}_{파일베이스}` (하이픈은 `_`로)
 */
export const CREATE_PROJECT_STEP_META: Record<
  string,
  {
    wizard_step: number | "consulting";
    /** 예: step1-partner-selection.tsx → step1-partner-selection */
    source_file: string;
    screen: string;
    title_ko: string;
  }
> = {
  "/create-project/step1": {
    wizard_step: 1,
    source_file: "step1-partner-selection",
    screen: "partner_selection",
    title_ko: "어떤 방식으로 파트너를 찾으시나요?",
  },
  "/create-project/consulting-inquiry": {
    wizard_step: "consulting",
    source_file: "consulting-inquiry",
    screen: "consulting_inquiry",
    title_ko: "컨설팅 문의 드립니다.",
  },
  "/create-project/step2": {
    wizard_step: 2,
    source_file: "partner-type",
    screen: "partner_type",
    title_ko: "어떤 파트너를 찾고 계신가요?",
  },
  "/create-project/step3": {
    wizard_step: 3,
    source_file: "project-name",
    screen: "project_name",
    title_ko: "프로젝트명을 입력해주세요",
  },
  "/create-project/step4": {
    wizard_step: 4,
    source_file: "advertising-objective",
    screen: "advertising_objective",
    title_ko: "광고 목적",
  },
  "/create-project/step5": {
    wizard_step: 5,
    source_file: "production-technique",
    screen: "production_technique",
    title_ko: "제작 기법",
  },
  "/create-project/step6": {
    wizard_step: 6,
    source_file: "media-channel",
    screen: "media_channel",
    title_ko: "노출 매체",
  },
  "/create-project/step7": {
    wizard_step: 7,
    source_file: "main-client",
    screen: "main_client",
    title_ko: "주요 고객",
  },
  "/create-project/step8": {
    wizard_step: 8,
    source_file: "budget",
    screen: "budget",
    title_ko: "예산",
  },
  "/create-project/step9": {
    wizard_step: 9,
    source_file: "payment-terms",
    screen: "payment_terms",
    title_ko: "대금 지급",
  },
  "/create-project/step10": {
    wizard_step: 10,
    source_file: "schedule",
    screen: "schedule",
    title_ko: "일정",
  },
  "/create-project/step11": {
    wizard_step: 11,
    source_file: "product-info",
    screen: "product_info",
    title_ko: "제품정보",
  },
  "/create-project/step12": {
    wizard_step: 12,
    source_file: "contact-person",
    screen: "contact_person",
    title_ko: "담당자정보",
  },
  "/create-project/step13": {
    wizard_step: 13,
    source_file: "excluded-competitors",
    screen: "excluded_competitors",
    title_ko: "경쟁사 제외",
  },
  "/create-project/step14": {
    wizard_step: 14,
    source_file: "participant-conditions",
    screen: "participant_conditions",
    title_ko: "참여기업 조건",
  },
  "/create-project/step15": {
    wizard_step: 15,
    source_file: "required-files",
    screen: "required_files",
    title_ko: "제출자료",
  },
  "/create-project/step16": {
    wizard_step: 16,
    source_file: "company-info",
    screen: "company_info",
    title_ko: "기업정보",
  },
  "/create-project/step17": {
    wizard_step: 17,
    source_file: "additional-description",
    screen: "additional_description",
    title_ko: "상세설명",
  },
  "/create-project/step18": {
    wizard_step: 18,
    source_file: "project-details",
    screen: "project_details",
    title_ko: "프로젝트 등록하기",
  },
};

/** Mixpanel — 화면 진입: step_1_step1_partner_selection */
export function buildCreateProjectEventName(meta: {
  wizard_step: number | "consulting";
  source_file: string;
}): string {
  const filePart = meta.source_file.replace(/-/g, "_");
  const stepPart =
    meta.wizard_step === "consulting" ? "consulting" : String(meta.wizard_step);
  return `step_${stepPart}_${filePart}`;
}

/** Mixpanel — 다음/이전 등 버튼: step_1_step1_partner_selection_cta */
export function buildCreateProjectCtaEventName(meta: {
  wizard_step: number | "consulting";
  source_file: string;
}): string {
  return `${buildCreateProjectEventName(meta)}_cta`;
}
