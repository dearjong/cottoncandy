import React from 'react';
import { X, Printer, Share2, FileText, User, Building2, Paperclip, Download, ImageIcon, Phone, MessageSquare } from 'lucide-react';
import { ProjectTypeBadge, StatusBadge } from '@/components/Badges';
import { ProcessStepper, getProjectSteps, getActiveStepIndex, ProjectActionButtons } from './ProjectCommon';

interface ProjectDetailDrawerProps {
    project: any;
    onClose: () => void;
    onStatusToggle: (id: string, action: 'APPROVE' | 'STOP') => void;
}

const ProjectDetailDrawer = ({ project, onClose, onStatusToggle }: ProjectDetailDrawerProps) => {
    if (!project) return null;
    const steps = getProjectSteps(project.type);
    const activeStepIdx = getActiveStepIndex(project.status, steps);
    const SectionTitle = ({ title, icon: Icon }: { title: string, icon: any }) => (
        <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
            <div className="w-1 h-5 bg-[#2b4ea7] rounded-full"></div>
            {title}
        </h3>
    );
    const InfoItem = ({ label, value, full = false }: { label: string, value: React.ReactNode, full?: boolean }) => (
        <div className={`flex flex-col gap-1.5 ${full ? 'col-span-2' : ''}`}>
            <span className="text-xs font-bold text-slate-400">{label}</span>
            <div className="text-sm font-medium text-slate-700 break-words leading-relaxed">{value || '-'}</div>
        </div>
    );
    const isPublicRequested = project.type === 'PUBLIC' && project.status === 'REQUESTED';

    return (
        <>
            <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity" onClick={onClose}></div>
            <div className="fixed inset-y-0 right-0 w-[900px] bg-slate-50 shadow-2xl z-50 transform transition-transform animate-in slide-in-from-right flex flex-col border-l border-slate-200">
                <div className="bg-white px-8 py-6 border-b border-slate-200 shrink-0">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                            <ProjectTypeBadge type={project.type} />
                            <StatusBadge status={project.status} />
                            <span className="text-xs text-slate-400 font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{project.id}</span>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="인쇄"><Printer size={18}/></button>
                            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors" title="공유"><Share2 size={18}/></button>
                            <div className="w-px h-8 bg-slate-200 mx-1"></div>
                            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"><X size={22} /></button>
                        </div>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 leading-tight mb-6">{project.title}</h2>
                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                        <ProcessStepper currentStepIndex={activeStepIdx} steps={steps} mode="DETAILED" />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                            <SectionTitle title="기본 정보" icon={FileText} />
                            <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                                <InfoItem label="카테고리" value={project.category} />
                                <InfoItem label="제품/서비스명" value={project.productName} />
                                <InfoItem label="예산" value={<div className="flex items-end gap-1"><span className="text-lg font-black text-[#2b4ea7]">{project.budget}</span><span className="text-xs text-slate-400 mb-0.5">{project.budgetDetail}</span></div>} full />
                                <InfoItem label="예상 기간" value={project.period} />
                                <InfoItem label="등록일" value={project.submittedDate} />
                            </div>
                        </div>
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
                            <SectionTitle title="모집 요강" icon={User} />
                            <div className="grid grid-cols-2 gap-y-5 gap-x-4">
                                <InfoItem label="모집 마감일" value={<div className="flex items-center gap-2"><span className="font-bold">{project.deadline}</span><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${project.dDay.includes('D-') ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-500'}`}>{project.dDay}</span></div>} full />
                                <InfoItem label="모집 방식" value={project.recruitType} />
                                <InfoItem label="PT 진행 여부" value={project.isPT ? '진행 (오프라인)' : '미진행'} />
                                <InfoItem label="지원 현황" value={<div className="flex items-center gap-2 font-bold text-slate-700"><User size={14} className="text-slate-400"/>{project.applicantCount}개사 지원중</div>} full />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <SectionTitle title="프로젝트 상세 내용" icon={FileText} />
                        <div className="mt-4 min-h-[150px] text-sm text-slate-700 leading-7 whitespace-pre-line border-t border-slate-100 pt-4">
                            <p className="font-bold text-slate-900 mb-2">1. 프로젝트 배경 및 목적</p>
                            <p className="text-slate-600 mb-4">본 프로젝트는 {project.clientName}의 신규 캠페인 '{project.title}'을 위한 영상 제작 건입니다.</p>
                            <p className="font-bold text-slate-900 mb-2">2. 주요 과업 범위</p>
                            <ul className="list-disc pl-5 text-slate-600 space-y-1 mb-4">
                                <li>영상 기획 및 스토리보드 작성</li>
                                <li>모델 섭외 및 로케이션 헌팅</li>
                                <li>촬영 및 종합 편집 (2D 모션그래픽 포함)</li>
                            </ul>
                            <p className="font-bold text-slate-900 mb-2">3. 참고 레퍼런스</p>
                            <p className="text-slate-600">- 기존 브랜드 영상 톤앤매너 유지 필수</p>
                        </div>
                        <div className="mt-6 flex flex-wrap gap-2">
                            {project.tags.map((tag: string) => (
                                <span key={tag} className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200">#{tag}</span>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                            <div>
                                <SectionTitle title="클라이언트 정보" icon={Building2} />
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-bold border border-slate-200">Logo</div>
                                    <div>
                                        <h4 className="font-bold text-lg text-slate-900">{project.clientName}</h4>
                                        <p className="text-xs text-slate-500">{project.clientIndustry} | {project.clientScale}</p>
                                    </div>
                                </div>
                                <div className="space-y-2 border-t border-slate-100 pt-4 mb-4">
                                    <div className="flex items-center gap-2 text-xs text-slate-600"><User size={14} className="text-slate-400"/> 담당자: 비공개</div>
                                    <div className="flex items-center gap-2 text-xs text-slate-600"><Phone size={14} className="text-slate-400"/> 연락처: 비공개</div>
                                </div>
                            </div>
                            <button className="w-full py-2.5 bg-blue-50 text-blue-600 font-bold text-sm rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2 border border-blue-100">
                                <MessageSquare size={16}/> 메시지 보내기
                            </button>
                        </div>
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                            <SectionTitle title="첨부 파일" icon={Paperclip} />
                            <div className="space-y-2 mt-4">
                                <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-slate-200 text-rose-500 shadow-sm"><FileText size={16}/></div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-xs font-bold text-slate-700 truncate group-hover:text-[#2b4ea7] transition-colors">프로젝트_RFP_v1.0.pdf</span>
                                            <span className="text-[10px] text-slate-400">2.4 MB</span>
                                        </div>
                                    </div>
                                    <Download size={14} className="text-slate-400 group-hover:text-slate-600"/>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-slate-200 text-blue-500 shadow-sm"><ImageIcon size={16}/></div>
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-xs font-bold text-slate-700 truncate group-hover:text-[#2b4ea7] transition-colors">참고_이미지_모음.zip</span>
                                            <span className="text-[10px] text-slate-400">15.8 MB</span>
                                        </div>
                                    </div>
                                    <Download size={14} className="text-slate-400 group-hover:text-slate-600"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-white border-t border-slate-200 p-5 shrink-0 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <ProjectActionButtons project={project} onStatusToggle={onStatusToggle} />
                        <div className="w-px h-4 bg-slate-200"></div>
                        <span className="text-xs text-slate-400 font-medium">관리자 전용 기능</span>
                    </div>
                    <div className="flex gap-2 items-center">
                        {isPublicRequested && (
                            <button
                                type="button"
                                className="px-5 py-2.5 bg-[#2b4ea7] text-white rounded-xl text-sm font-bold hover:bg-[#203b80] transition-colors shadow-sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (window.confirm('이 공개 의뢰를 승인하여 공개 프로젝트로 전환할까요?\n\n승인 후에는 미승인 목록에서 빠지고 전체 프로젝트에 포함됩니다.')) {
                                        onStatusToggle(project.id, 'APPROVE');
                                    }
                                }}
                            >
                                승인처리
                            </button>
                        )}
                        <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">정보 수정</button>
                        <button className="px-5 py-2.5 bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-slate-700 transition-colors shadow-lg shadow-slate-900/10">관리자 메모 작성</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProjectDetailDrawer;
