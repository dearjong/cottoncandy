import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import {
    BASE_PROCESS_STEPS,
    getProjectSteps,
    getActiveStepIndex,
    ProcessStepper,
} from '@/components/project/ProcessStepper';

export { BASE_PROCESS_STEPS, getProjectSteps, getActiveStepIndex, ProcessStepper };

export const ProjectActionButtons = ({ project, onStatusToggle }: { project: any, onStatusToggle: (id: string, action: 'APPROVE' | 'STOP') => void }) => {
    if (project.status === 'DRAFT') {
         return (
            <div className="flex justify-center">
                <span className="text-[10px] text-slate-400 font-bold opacity-50">-</span>
            </div>
        );
    }
    // 공개의뢰(공개)만 승인 스위치 표시, 비공개·컨설팅은 스위치 없음
    if (project.type !== 'PUBLIC') {
        return (
            <div className="flex justify-center">
                <span className="text-[10px] text-slate-400 font-bold opacity-50">-</span>
            </div>
        );
    }
    let isApproved = false;
    const isActiveStatus = ['MATCHING', 'APPROVED', 'PRODUCTION', 'CONTRACT', 'SETTLEMENT'].includes(project.status);
    const isStoppedStatus = ['STOPPED', 'REJECTED', 'CANCELLED'].includes(project.status);
    const isRequested = project.status === 'REQUESTED';
    if (isActiveStatus) isApproved = true;
    else if (isRequested) isApproved = project.type !== 'PUBLIC';
    else if (isStoppedStatus) isApproved = false;

    if (project.status === 'COMPLETE' || project.status === 'AFTER_SERVICE') {
         return (
            <div className="flex justify-center">
                <button className="text-slate-400 hover:text-[#2b4ea7] p-2 hover:bg-blue-50 rounded-full transition-colors">
                    <MoreHorizontal size={18} />
                </button>
            </div>
        );
    }
    const handleToggle = (e: React.MouseEvent) => {
        e.stopPropagation();
        // 승인/중단 시 확인 팝업
        if (!isApproved) {
            const ok = window.confirm('이 프로젝트를 승인하여 공개 프로젝트로 노출할까요?\n\n승인 후에는 미승인 목록에서 빠지고 공개 프로젝트 목록에 포함됩니다.');
            if (!ok) return;
            onStatusToggle(project.id, 'APPROVE');
        } else {
            const ok = window.confirm('이 프로젝트를 감추기(중단) 처리할까요?\n\n감추기 시 매칭/노출이 중단됩니다.');
            if (!ok) return;
            onStatusToggle(project.id, 'STOP');
        }
    };
    return (
        <div className="flex justify-center">
            <button
                type="button"
                role="switch"
                aria-checked={isApproved}
                onClick={handleToggle}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-[#2b4ea7] focus:ring-offset-2 ${isApproved ? 'bg-[#2b4ea7]' : 'bg-slate-200'}`}
                title={isApproved ? '승인됨 (클릭 시 감추기)' : '감추기/대기 (클릭 시 승인)'}
            >
                <span
                    className={`pointer-events-none inline-block h-5 w-5 shrink-0 rounded-full bg-white shadow ring-0 transition-transform ${isApproved ? 'translate-x-5' : 'translate-x-0.5'}`}
                    style={{ marginTop: '1px' }}
                />
            </button>
        </div>
    );
};
