/**
 * 프로젝트 진행 단계 스테퍼 (admin v1/v2 공통)
 * 참여 → OT → 제안서 → PT → 계약 → 제작 → 정산 → 리뷰
 */
import React from 'react';

export const BASE_PROCESS_STEPS = [
  { label: '참여', key: 'MATCHING' },
  { label: 'OT', key: 'OT' },
  { label: '제안서', key: 'PROPOSAL' },
  { label: 'PT', key: 'PT' },
  { label: '계약', key: 'CONTRACT' },
  { label: '제작', key: 'PRODUCTION' },
  { label: '정산', key: 'SETTLEMENT' },
  { label: '리뷰', key: 'COMPLETE' },
] as const;

/** 공개(공고): OT/PT 포함. 비공개(1:1): OT/PT 제외 */
export const getProjectSteps = (type: string) => {
  if (type === 'PRIVATE' || type === '1:1') {
    return BASE_PROCESS_STEPS.filter((step) => step.key !== 'OT' && step.key !== 'PT');
  }
  return [...BASE_PROCESS_STEPS];
};

/** v2 스타일 status → step index */
export const getActiveStepIndex = (
  status: string,
  steps: readonly { label: string; key: string }[]
) => {
  if (['DRAFT', 'REQUESTED', 'REJECTED', 'STOPPED', 'CANCELLED'].includes(status)) return -1;
  if (status === 'AFTER_SERVICE') return steps.findIndex((s) => s.key === 'COMPLETE');
  const idx = steps.findIndex((s) => s.key === status);
  if (idx !== -1) return idx;
  return 0;
};

/** v1 MainStatus → step index. 1:1(OT/PT 없음)일 때 OT/PT 상태는 다음 단계로 매핑 */
export const getActiveStepIndexFromMainStatus = (
  status: string,
  steps: readonly { label: string; key: string }[]
): number => {
  const beforeStart = ['DRAFT', 'REQUESTED', 'APPROVED'];
  if (beforeStart.includes(status)) return -1;

  const stepKeyMap: Record<string, string> = {
    PROPOSAL_OPEN: 'MATCHING',
    PROPOSAL_CLOSED: 'MATCHING',
    OT_SCHEDULED: 'OT',
    OT_COMPLETED: 'OT',
    PROPOSAL_SUBMIT: 'PROPOSAL',
    PROPOSAL_SUBMITTED: 'PROPOSAL',
    PT_SCHEDULED: 'PT',
    PT_COMPLETED: 'PT',
    NO_SELECTION: 'PT',
    SELECTED: 'CONTRACT',
    CONTRACT: 'CONTRACT',
    SHOOTING: 'PRODUCTION',
    EDITING: 'PRODUCTION',
    DRAFT_SUBMITTED: 'PRODUCTION',
    FINAL_APPROVED: 'PRODUCTION',
    PRODUCTION_COMPLETE: 'PRODUCTION',
    ONAIR_STARTED: 'SETTLEMENT',
    AFTER_SERVICE: 'COMPLETE',
    COMPLETE: 'COMPLETE',
    ADMIN_CHECKING: 'COMPLETE',
    ADMIN_CONFIRMED: 'COMPLETE',
  };

  const key = stepKeyMap[status];
  if (!key) return -1;
  let idx = steps.findIndex((s) => s.key === key);
  if (idx >= 0) return idx;
  // 1:1 등 OT/PT가 없는 steps: OT→제안서, PT→계약으로 폴백
  const fallback: Record<string, string> = { OT: 'PROPOSAL', PT: 'CONTRACT' };
  const fallbackKey = fallback[key];
  if (fallbackKey) {
    idx = steps.findIndex((s) => s.key === fallbackKey);
    return idx >= 0 ? idx : 0;
  }
  return 0;
};

type StepperMode = 'COMPACT' | 'DETAILED' | 'MINI';

interface ProcessStepperProps {
  currentStepIndex: number;
  steps: readonly { label: string; key: string }[];
  mode?: StepperMode;
}

export const ProcessStepper = ({
  currentStepIndex,
  steps,
  mode = 'COMPACT',
}: ProcessStepperProps) => {
  if (mode === 'MINI') {
    return (
      <div
        className="flex w-full min-w-0 max-w-[160px] h-1 rounded-full overflow-hidden bg-neutral-100"
        title={steps.map((s) => s.label).join(' → ')}
      >
        {steps.map((step, idx) => {
          const isActive = idx === currentStepIndex;
          const isPast = idx < currentStepIndex;
          const barColor = isActive ? 'bg-neutral-400' : isPast ? 'bg-neutral-200' : 'bg-neutral-100';
          return (
            <div
              key={idx}
              className={`flex-1 min-w-[2px] transition-colors ${barColor}`}
            />
          );
        })}
      </div>
    );
  }
  return (
    <div className="flex items-end gap-1 w-full min-w-0">
      {steps.map((step, idx) => {
        const isActive = idx === currentStepIndex;
        const isPast = idx < currentStepIndex;
        const barColor = isActive ? 'bg-neutral-400' : isPast ? 'bg-neutral-200' : 'bg-neutral-100';
        const textColor = isActive ? 'text-neutral-500' : isPast ? 'text-neutral-400' : 'text-neutral-300';
        const fontWeight = isActive ? 'font-black' : 'font-medium';
        return (
          <div
            key={idx}
            className="flex flex-col items-center gap-0.5 flex-1 min-w-0 overflow-visible"
          >
            <div className="w-full min-w-0">
              <div
                className={`h-1 rounded-full transition-colors ${barColor} w-full min-w-[4px]`}
              />
            </div>
            <span
              className={`text-[9px] ${fontWeight} whitespace-nowrap transition-colors ${textColor} leading-none block text-center truncate w-full`}
              style={{ padding: 0 }}
              title={step.label}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
