import { useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { motion } from "framer-motion";
import Layout from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { getProjectById } from "@/lib/mockProjectData";
import { trackProjectViewed, trackPartnerApplied } from "@/lib/analytics";

export default function ProjectDetail() {
  const [, params] = useRoute("/project-list/:id");
  const [, setLocation] = useLocation();
  const projectId = params?.id;

  const project = projectId ? getProjectById(projectId) : undefined;

  useEffect(() => {
    if (!projectId) return;
    trackProjectViewed({
      project_id: projectId,
      project_type: "공고",
      user_type: "guest",
    });
  }, [projectId]);

  if (!project) {
    return (
      <Layout>
        <div className="py-8 sm:py-12 md:py-20 bg-white">
          <div className="page-content">
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
              <h2 className="text-xl font-bold mb-4">프로젝트를 찾을 수 없습니다</h2>
              <p className="text-gray-600 mb-6 text-sm">요청하신 프로젝트 공고가 존재하지 않거나 삭제되었습니다.</p>
              <Button onClick={() => setLocation('/project-list')} className="btn-pink">
                <ChevronLeft className="w-4 h-4 mr-1" />
                목록으로 돌아가기
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-8 sm:py-12 md:py-20 bg-white">
        <div className="page-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-10 md:mb-12"
          >
            <h1 className="page-title">[참여공고] 프로젝트 상세</h1>
            <p className="page-subtitle mt-4">등록된 공고를 보고 전문 기업이 참여 신청을 합니다.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-8 sm:mb-10 md:mb-12 w-full"
          >
            <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
              <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-200">
                <div>
                  <div className="text-sm text-gray-600 mb-3">{project.id} {project.status}</div>
                </div>
                <div className="text-sm text-gray-600">
                  {project.type} {project.partnerType} {project.bidType} {project.myStatus && `My${project.myStatus}`}
                </div>
              </div>

              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-pink-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {project.company.logo}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-bold mb-2">
                      [{project.company.name}] 신제품 판매촉진 프로모션 {project.partnerType}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-sm text-gray-700 mb-3">
                      <span>{project.company.name}</span>
                      <span className="text-gray-400">|</span>
                      <span>{project.company.type}</span>
                      <span className="text-gray-400">|</span>
                      <span>{project.company.industry}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600 mb-1">총예산 {project.budget.total}</div>
                    <div className="text-xs text-gray-500">(제작비 {project.budget.production})</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 text-sm">
                  {project.features.map((feature, idx) => (
                    <span key={idx} className="flex items-center gap-1">
                      <span className="text-green-600">✓</span> {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-0">
                <div className="space-y-5">
                  <div className="flex gap-4">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">제품명</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900">{project.product.name}</div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1">└ 제품유형</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900">{project.product.type}</div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">의뢰항목</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900">{project.services.join(' ')}</div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">일정대응</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900">{project.schedule.support}</div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">광고목적</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900 space-y-1">
                        {project.adPurpose.map((item, idx) => (
                          <div key={idx}>{item.title} {item.detail}</div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">제작기법</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900">{project.techniques.map(t => `#${t}`).join(', ')}</div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">매체</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900">{project.media.join(' ')}</div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">주요 고객</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900">{project.target.age}</div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1">└ 성별</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900">{project.target.gender}</div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1">└ 직업</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900">{project.target.job}</div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">경쟁사<br/>제한업종</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900">{project.competitors.industry}</div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1">수행기업<br/>제외</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900">
                        {project.competitors.companies.map(c => `#${c}`).join(', ')} ({project.competitors.period})
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">모집 파트너</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900">{project.partner.type}</div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1">└ 세부유형</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900">{project.partner.subType}</div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1">└ 상세조건</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900 space-y-1">
                        {project.partner.conditions.map((cond, idx) => (
                          <div key={idx}>{cond}</div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">상세설명</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900 leading-relaxed">
                        {project.description}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-5 lg:border-l lg:border-gray-200 lg:pl-12 mt-6 lg:mt-0">
                  <div className="flex gap-4">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">접수마감</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900 font-medium">D-35</div>
                      <div className="text-xs text-gray-500 mt-1">(0팀 참여)</div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">접수기간</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900">
                        {project.timeline.applicationStart} ~ {project.timeline.applicationEnd}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">(총 {project.timeline.applicationDays}일)</div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">사전미팅(OT)</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">UP</span>
                          <span>{project.timeline.ot}</span>
                        </div>
                        <div className="text-xs text-gray-500">{project.timeline.otNote}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">제출자료 마감</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900">{project.timeline.proposalDeadline}</div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">경쟁PT</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900 space-y-1">
                        <div>{project.timeline.pt}</div>
                        <div className="text-xs text-gray-500">{project.timeline.ptNote}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">리젝션 Fee</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded">new</span>
                          <span className="font-medium">{project.rejectionFee}</span>
                        </div>
                        <div className="text-xs text-gray-500">{project.rejectionNote}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">파트너 선정 결과</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900">{project.timeline.result}</div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">납품기한</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900">{project.timeline.delivery}</div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">OnAir</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900">{project.timeline.onAir}</div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">대금지급</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900 space-y-1">
                        <div>선금 {project.payment.advance}</div>
                        <div>중도금 {project.payment.interim}</div>
                        <div>잔금 {project.payment.balance}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">지원 서류</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900 space-y-1">
                        <div><span className="text-pink-600">기본</span> {project.documents.basic.join(', ')}</div>
                        <div>{project.documents.required.join(', ')}</div>
                        <div className="font-medium mt-2">제안서·시안</div>
                        {project.documents.proposal.map((doc, idx) => (
                          <div key={idx} className="ml-4">{doc}</div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">계약 체결 시<br/>제출 서류</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900 space-y-1">
                        {project.documents.contract.map((doc, idx) => (
                          <div key={idx}>{doc}</div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-gray-200">
                    <div className="w-28 flex-shrink-0 text-sm text-gray-600 pt-1 font-medium">기업 웹사이트</div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-900 space-y-2">
                        <div>☎ {project.contact.phone}</div>
                        <div className="pt-2 border-t border-gray-100">
                          <div>{project.contact.name} {project.contact.position}</div>
                          <div>☎ {project.contact.phone}</div>
                          <div className="ml-4">{project.contact.mobile}</div>
                          <div>{project.contact.email}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="options-container"
          >
            <div className="flex gap-3">
              <Button
                onClick={() => setLocation('/project-list')}
                className="btn-white flex-1"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                돌아가기
              </Button>
              <Button className="btn-white flex-1">
                문의하기
              </Button>
              <Button
                className="btn-pink flex-1"
                onClick={() => {
                  if (projectId) {
                    trackPartnerApplied({
                      project_id: projectId,
                      project_type: "공고",
                    });
                  }
                }}
              >
                참여신청
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
