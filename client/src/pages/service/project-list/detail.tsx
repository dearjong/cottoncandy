import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { motion } from "framer-motion";
import Layout from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { ChevronLeft, X } from "lucide-react";
import { getProjectById } from "@/lib/mockProjectData";
import { trackProjectViewed, trackPartnerApplied } from "@/lib/analytics";

const MOCK_COMPANY = {
  name: "솔서창기획",
  bizNo: "123-12-12345",
  ceo: "나애도",
  address: "서울특별시 강남구 매도스타로1길 1",
};

const MOCK_FILES = [
  { name: "[HSAD] 사업자 등록증 서류.pdf", tag: "포트폴리오", date: "2024-04-06" },
  { name: "[HSAD] 포트폴리오_20250807.pdf", tag: "포트폴리오", date: "2024-04-06" },
  { name: "[HSAD] 회사소개서 2025.pdf", tag: "회사소개서", date: "2024-04-06" },
  { name: "[HSAD] 비밀유지 서약서 2025.pdf", tag: "비밀유지서약서", date: "2024-04-06" },
];

function ApplicationModal({
  projectId,
  projectTitle,
  onClose,
  onConfirm,
}: {
  projectId: string;
  projectTitle: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const [agreed, setAgreed] = useState(false);
  const [portfolio, setPortfolio] = useState("선택해주세요.");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[92vh] flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0">
          <h2 className="text-xl font-bold text-gray-900">참여신청서</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 본문 스크롤 영역 */}
        <div className="overflow-y-auto flex-1 px-6 pb-4 space-y-5">

          {/* 1. 프로젝트 */}
          <section>
            <div className="inline-flex items-center bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-full mb-4">
              1. 프로젝트
            </div>
            <div className="space-y-2.5">
              <div className="flex gap-3">
                <span className="text-xs text-pink-600 font-medium w-24 shrink-0 pt-0.5">* 프로젝트명</span>
                <span className="text-xs text-gray-900">{projectTitle}</span>
              </div>
              <div className="flex gap-3">
                <span className="text-xs text-pink-600 font-medium w-24 shrink-0 pt-0.5">* 프로젝트번호</span>
                <span className="text-xs text-gray-900">{projectId}</span>
              </div>
            </div>
          </section>

          {/* 2. 참여업체 정보 */}
          <section>
            <div className="inline-flex items-center bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-full mb-4">
              2. 참여업체 정보
            </div>
            <div className="space-y-2.5">
              {[
                { label: "* 회사명", value: MOCK_COMPANY.name },
                { label: "* 사업자등록번호", value: MOCK_COMPANY.bizNo },
                { label: "* 대표자명", value: MOCK_COMPANY.ceo },
                { label: "* 주소", value: MOCK_COMPANY.address },
              ].map(({ label, value }) => (
                <div key={label} className="flex gap-3">
                  <span className="text-xs text-pink-600 font-medium w-24 shrink-0 pt-0.5">{label}</span>
                  <span className="text-xs text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 3. 담당자명 */}
          <section>
            <div className="inline-flex items-center bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-full mb-4">
              3. 담당자명
            </div>
            <div className="space-y-2.5">
              {[
                { label: "담당자명", ph: "4x1 담당자명" },
                { label: "부서", ph: "4x1 전략기획팀" },
                { label: "직책", ph: "4x1 팀장" },
              ].map(({ label, ph }) => (
                <div key={label} className="flex gap-3 items-center">
                  <span className="text-xs text-gray-600 w-24 shrink-0">{label}</span>
                  <input
                    type="text"
                    placeholder={ph}
                    className="flex-1 text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-400 placeholder:text-gray-300 focus:outline-none focus:border-gray-400"
                  />
                </div>
              ))}
              <div className="flex gap-3 items-center">
                <span className="text-xs text-gray-600 w-24 shrink-0">연락처</span>
                <div className="flex-1 flex gap-1">
                  <input placeholder="4x2" className="w-14 text-xs border border-gray-200 rounded-lg px-2 py-1.5 placeholder:text-gray-300 focus:outline-none focus:border-gray-400" />
                  <span className="text-gray-300 self-center">-</span>
                  <input placeholder="4x3 123" className="flex-1 text-xs border border-gray-200 rounded-lg px-2 py-1.5 placeholder:text-gray-300 focus:outline-none focus:border-gray-400" />
                  <span className="text-gray-300 self-center">-</span>
                  <input placeholder="4x4 5567" className="flex-1 text-xs border border-gray-200 rounded-lg px-2 py-1.5 placeholder:text-gray-300 focus:outline-none focus:border-gray-400" />
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <span className="text-xs text-gray-600 w-24 shrink-0">핸드폰</span>
                <div className="flex-1 flex gap-1">
                  <input placeholder="4x5 010" className="w-14 text-xs border border-gray-200 rounded-lg px-2 py-1.5 placeholder:text-gray-300 focus:outline-none focus:border-gray-400" />
                  <span className="text-gray-300 self-center">-</span>
                  <input placeholder="4x6 1234" className="flex-1 text-xs border border-gray-200 rounded-lg px-2 py-1.5 placeholder:text-gray-300 focus:outline-none focus:border-gray-400" />
                  <span className="text-gray-300 self-center">-</span>
                  <input placeholder="4x7 5678" className="flex-1 text-xs border border-gray-200 rounded-lg px-2 py-1.5 placeholder:text-gray-300 focus:outline-none focus:border-gray-400" />
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <span className="text-xs text-gray-600 w-24 shrink-0">이메일</span>
                <input
                  type="email"
                  placeholder="4x8.set@admarket.co.kr"
                  className="flex-1 text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 placeholder:text-gray-300 focus:outline-none focus:border-gray-400"
                />
              </div>
            </div>
          </section>

          {/* 4. 참가의사 */}
          <section>
            <div className="inline-flex items-center bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-full mb-4">
              4. 참가의사
            </div>
            <p className="text-xs text-gray-700 leading-relaxed">
              당 회사는 상기 프로젝트에 정식으로 참여를 신청하며,<br />
              Cotton Candy 플랫폼의 규정과 공고 조건을 준수할 것을 확약합니다.
            </p>
          </section>

          {/* 5. 서약사항 */}
          <section>
            <div className="inline-flex items-center bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-full mb-4">
              5. 서약사항
            </div>
            <div className="text-xs text-gray-700 leading-relaxed space-y-1.5">
              <p>제출한 정보와 서류는 사실과 다름이 없음을 확약합니다.</p>
              <p>공고 조건 및 Cotton Candy 플랫폼의 규정을 준수하겠습니다.</p>
              <p>프로젝트 진행 중 계약 조건을 성실히 이행할 것을 서약합니다.</p>
              <p>담합, 부정행위 등 위반 사항 발생 시 불이익을 감수합니다.</p>
            </div>
          </section>

          {/* 6. 참여 신청 정보 */}
          <section>
            <div className="inline-flex items-center bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-full mb-4">
              6. 참여 신청 정보
            </div>
            <div className="space-y-3">
              <div className="flex gap-3 items-start">
                <span className="text-xs text-gray-600 w-24 shrink-0 pt-2">제목</span>
                <input
                  type="text"
                  placeholder="참여신청서 제목을 입력해주세요"
                  className="flex-1 text-xs border border-gray-200 rounded-lg px-2.5 py-2 placeholder:text-gray-300 focus:outline-none focus:border-gray-400"
                />
              </div>
              <div className="flex gap-3 items-center">
                <span className="text-xs text-gray-600 w-24 shrink-0">* 기업소개서&<br/>포트폴리오</span>
                <select
                  value={portfolio}
                  onChange={e => setPortfolio(e.target.value)}
                  className="flex-1 text-xs border border-gray-200 rounded-lg px-2.5 py-2 text-gray-500 focus:outline-none focus:border-gray-400 bg-white"
                >
                  <option>선택해주세요.</option>
                  <option>2025 회사소개서</option>
                  <option>2025 포트폴리오</option>
                </select>
              </div>

              {/* 파일업로드 */}
              <div>
                <div className="text-xs text-gray-500 mb-2">파일업로드</div>
                <div className="space-y-2">
                  {MOCK_FILES.map((file, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg px-3 py-2.5 flex items-start justify-between gap-2">
                      <div>
                        <div className="text-xs font-medium text-gray-800">{file.name}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{file.tag} | {file.date}</div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-700 shrink-0 mt-0.5">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 동의 체크박스 */}
          <div className="bg-gray-50 rounded-xl p-3.5">
            <p className="text-xs text-gray-600 leading-relaxed mb-3">
              본 신청을 통해 제공한 모든 정보가 정확하며, 허위로 사실이 있을 경우
              해당 대는 신청이 취소될 수 있음을 인지하고 있습니다. 또한 낙찰되지
              않을시 제출된 자료는 반환하거나 폐기할 것을 보장합니다.
            </p>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                className="w-4 h-4 accent-pink-600 rounded"
              />
              <span className="text-xs text-gray-700 font-medium">위 내용에 동의합니다.</span>
            </label>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-2 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-full border border-gray-300 text-xs text-gray-600 font-medium hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            className="flex-1 py-2.5 rounded-full border border-gray-300 text-xs text-gray-600 font-medium hover:bg-gray-50 transition-colors"
          >
            회사소개서&포트폴리오 관리
          </button>
          <button
            disabled={!agreed}
            onClick={onConfirm}
            className={`flex-1 py-2.5 rounded-full text-xs font-medium transition-colors ${
              agreed
                ? "bg-gray-900 text-white hover:bg-gray-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProjectDetail() {
  const [, params] = useRoute("/project-list/:id");
  const [, setLocation] = useLocation();
  const projectId = params?.id;
  const [showModal, setShowModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const project = projectId ? getProjectById(projectId) : undefined;

  useEffect(() => {
    if (!projectId) return;
    trackProjectViewed({
      project_id: projectId,
      project_type: "공고",
      user_type: "guest",
    });
  }, [projectId]);

  const handleConfirm = () => {
    if (projectId) {
      trackPartnerApplied({ project_id: projectId, project_type: "공고" });
    }
    setShowModal(false);
    setSubmitted(true);
  };

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
                className={`flex-1 ${submitted ? "btn-white" : "btn-pink"}`}
                onClick={() => !submitted && setShowModal(true)}
                disabled={submitted}
              >
                {submitted ? "신청완료" : "참여신청"}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {showModal && projectId && (
        <ApplicationModal
          projectId={projectId}
          projectTitle={`[베스트전자] 신제품 판매촉진 프로모션 대행사 모집`}
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirm}
        />
      )}
    </Layout>
  );
}
