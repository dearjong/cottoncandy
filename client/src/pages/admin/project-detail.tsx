import { useRoute, Link } from "wouter"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BackToListButton } from "@/components/BackToListButton"
import { Check, X, Phone, Mail, Globe } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useState } from "react"

interface Project {
  id: string
  title: string
  client: string
  type: '공고' | '1:1' | '컨설팅'
  status: '등록' | '임시저장' | '승인대기' | '승인' | '반려' | '진행중' | '완료'
}

export default function AdminProjectDetail() {
  const [, params] = useRoute("/admin/project-detail/:id")
  const projectId = params?.id || "PN-20250721-0001"
  
  const [isApproveOpen, setIsApproveOpen] = useState(false)
  const [isRejectOpen, setIsRejectOpen] = useState(false)
  const [isCompleteOpen, setIsCompleteOpen] = useState(false)

  const project: Project = {
    id: projectId,
    title: "[베스트전자] 신제품 판매촉진 프로모션 대행사 모집",
    client: "베스트전자",
    type: "공고",
    status: "승인대기",
  }

  const handleApprove = () => {
    setIsApproveOpen(false)
    setIsCompleteOpen(true)
  }

  const handleReject = () => {
    setIsRejectOpen(false)
    setIsCompleteOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">[참여공고] 프로젝트 상세</h1>
            <p className="text-gray-600 text-sm mt-0.5">등록된 공고를 보고 전문 기업이 참여 신청을 합니다.</p>
          </div>
          <BackToListButton href="/admin/projects" className="shrink-0" />
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-start justify-between pb-6 border-b mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-pink-600 rounded flex items-center justify-center text-white font-bold text-2xl">
                B
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-medium text-gray-600">{project.id}</span>
                  <Badge variant="outline">{project.status}</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>참여공고</span>
                  <span>대행사</span>
                  <span>경쟁PT</span>
                  <Badge className="bg-blue-600">My담당</Badge>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">{project.client}</h2>
            <h3 className="text-xl font-semibold mb-3">{project.title}</h3>
            <div className="text-gray-600 mb-4">
              대기업 전기전자
            </div>
            
            <div className="flex gap-4 mb-4">
              <span className="flex items-center gap-1 text-sm">
                <span className="text-green-600">✓</span>
                <span className="text-gray-600">급행 제작 대응</span>
              </span>
              <span className="flex items-center gap-1 text-sm">
                <span className="text-green-600">✓</span>
                <span className="text-gray-600">경쟁사 수행기업 제외</span>
              </span>
              <span className="flex items-center gap-1 text-sm">
                <span className="text-green-600">✓</span>
                <span className="text-gray-600">리젝션 Fee</span>
              </span>
            </div>

            <div className="flex items-center gap-8 text-lg">
              <div>
                <span className="font-semibold">총예산 10~20억</span>
              </div>
              <div className="text-gray-600">
                (제작비 3억~6억)
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-6">
            <div className="space-y-6">
              <div>
                <div className="font-semibold mb-2">제품명</div>
                <div className="text-gray-700">[OLED] 스탠바이미2</div>
                <div className="text-sm text-gray-500">└ 제품유형 카메라/영상/음향가전</div>
              </div>

              <div>
                <div className="font-semibold mb-2">의뢰항목</div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">전략기획</Badge>
                  <Badge variant="secondary">크리에이티브 기획</Badge>
                  <Badge variant="secondary">영상 제작</Badge>
                  <Badge variant="secondary">미디어 집행</Badge>
                  <Badge variant="secondary">성과 측정 및 리포팅</Badge>
                  <Badge variant="secondary">인플루언서/SNS 마케팅</Badge>
                  <Badge variant="secondary">PR/언론보도 대응</Badge>
                  <Badge variant="secondary">오프라인 이벤트/프로모션</Badge>
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">일정대응</div>
                <div className="text-sm text-gray-700">#급행 제작 대응, #당일 피드백 반영 가능, #일정 유동성 대응, #이벤트/행사 대응</div>
              </div>

              <div>
                <div className="font-semibold mb-2">광고목적</div>
                <div className="space-y-2">
                  <div>
                    <div className="font-medium">제품판매촉진</div>
                    <div className="text-sm text-gray-600">리뷰형 콘텐츠 제작 #실사용</div>
                  </div>
                  <div>
                    <div className="font-medium">브랜드 인지도 향상</div>
                    <div className="text-sm text-gray-600">#바이럴 확산형 콘텐츠 기획 및 제작, #TV·디지털 연계 캠페인 기획</div>
                  </div>
                  <div>
                    <div className="font-medium">이벤트/프로모션</div>
                    <div className="text-sm text-gray-600">#명절/할인/이벤트 캠페인</div>
                  </div>
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">제작기법</div>
                <div className="text-gray-700">
                  #AI, #라이브액션, #특수촬영, #캐릭터/동물 모델
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">매체</div>
                <div className="flex gap-2">
                  <Badge variant="outline">TV</Badge>
                  <Badge variant="outline">Youtube</Badge>
                  <Badge variant="outline">디지털광고</Badge>
                  <Badge variant="outline">옥외</Badge>
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">주요 고객</div>
                <div className="text-gray-700">10대, 20대</div>
                <div className="text-sm text-gray-600">└ 성별 전체</div>
                <div className="text-sm text-gray-600">└ 직업 직장인, 주부, 자영업자</div>
              </div>

              <div>
                <div className="font-semibold mb-2">경쟁사 수행기업 제외</div>
                <div className="text-sm text-gray-700">제한업종 - 전기/전자</div>
                <div className="text-sm text-gray-700">
                  #삼성전자, #애플, #HP, #소니
                </div>
                <div className="text-sm text-gray-500">(최근 6개월)</div>
              </div>

              <div>
                <div className="font-semibold mb-2">모집 파트너</div>
                <div className="text-gray-700">대행사</div>
                <div className="text-sm text-gray-600 mb-2">└ 세부유형 종합 광고대행사</div>
                <div className="text-sm text-gray-600">└ 상세조건</div>
                <ul className="ml-6 space-y-1">
                  <li className="text-sm text-gray-600">광고 Awards 수상작 10작품 이상 (최근 3년간)</li>
                  <li className="text-sm text-gray-600">TVCF 명예의 전당 5작품 이상 (최근 3년간)</li>
                  <li className="text-sm text-gray-600">TVCF 포트폴리오 50건 이상 (최근 3년간)</li>
                  <li className="text-sm text-gray-600">최소제작비 2억 이상</li>
                </ul>
              </div>

              <div>
                <div className="font-semibold mb-2">상세설명</div>
                <div className="text-sm text-gray-700 whitespace-pre-line bg-gray-50 p-4 rounded">
베스트전자는 전자, 가전 분야의 혁신적인 기술로 세계적인 일류기업 자리를 지켜나가도록 최선을 다하겠습니다.
베스트전자는 고객을 위한 가치창조와 인간존중의 경영을 실현합니다.
자세한 내용은 OT에서 전달드리겠습니다.
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <a href="https://www.bestelectronics.co.kr" className="text-sm text-blue-600 hover:underline">
                    기업 웹사이트
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-pink-50 p-4 rounded-lg">
                <div className="font-semibold mb-2">접수마감</div>
                <div className="text-2xl font-bold text-pink-600">D-35</div>
                <div className="text-sm text-gray-600">(0팀 참여)</div>
              </div>

              <div>
                <div className="font-semibold mb-2">접수기간</div>
                <div className="text-gray-700">
                  2025.11.10(월) ~ 2025.12.10(수)
                </div>
                <div className="text-sm text-gray-500">(총 30일)</div>
              </div>

              <div>
                <div className="font-semibold mb-2">사전미팅(OT)</div>
                <div className="text-gray-700">2025.12.20 (목) 10:00 온라인</div>
                <div className="text-sm text-gray-500">※ OT 참석기업 &gt; 제안서 검토 후 5일이내 개별 안내</div>
              </div>

              <div>
                <div className="font-semibold mb-2">제출자료 마감</div>
                <div className="text-gray-700">2025.12.20</div>
              </div>

              <div>
                <div className="font-semibold mb-2">경쟁PT</div>
                <div className="text-gray-700">2025.12.25 (수) 12:00 서울시 강남구</div>
                <div className="text-sm text-gray-500">※ PT 참석기업 &gt; 제안서 검토 후 5일이내 개별 안내</div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <div className="font-semibold mb-2">리젝션 Fee</div>
                <div className="text-2xl font-bold text-green-600">30만원</div>
                <div className="text-sm text-gray-600">※ PT후 미선정팀에 개별지급</div>
              </div>

              <div>
                <div className="font-semibold mb-2">파트너 선정 결과</div>
                <div className="text-gray-700">PT발표 후 5일 이내 개별 안내</div>
              </div>

              <div>
                <div className="font-semibold mb-2">납품기한</div>
                <div className="text-gray-700">2025.12.20</div>
              </div>

              <div>
                <div className="font-semibold mb-2">OnAir</div>
                <div className="text-gray-700">2025.12.25</div>
              </div>

              <div>
                <div className="font-semibold mb-2">대금지급</div>
                <div className="space-y-1">
                  <div className="text-gray-700">선금 30%</div>
                  <div className="text-gray-700">중도금 30%</div>
                  <div className="text-gray-700">잔금 40%</div>
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">지원 서류</div>
                <div className="space-y-2">
                  <div>
                    <div className="text-sm font-medium text-gray-700">기본</div>
                    <ul className="ml-4 space-y-1">
                      <li className="text-sm text-gray-600">참여신청서</li>
                      <li className="text-sm text-gray-600">회사소개서 & 포트폴리오</li>
                    </ul>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">필수</div>
                    <ul className="ml-4 space-y-1">
                      <li className="text-sm text-gray-600">사업자등록증사본</li>
                      <li className="text-sm text-gray-600">비밀유지 서약서</li>
                    </ul>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">제안서·시안</div>
                    <ul className="ml-4 space-y-1">
                      <li className="text-sm text-gray-600">제안서</li>
                      <li className="text-sm text-gray-600">시안</li>
                      <li className="text-sm text-gray-600">견적서</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <div className="font-semibold mb-2">계약 체결 시 제출 서류</div>
                <ul className="ml-4 space-y-1">
                  <li className="text-sm text-gray-600">용역계약서</li>
                  <li className="text-sm text-gray-600">법인 등기부등본</li>
                  <li className="text-sm text-gray-600">통장 사본</li>
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="font-semibold mb-3">담당자</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">나해피</span>
                    <span className="text-sm text-gray-500">전략기획팀</span>
                    <span className="text-sm text-gray-400">·</span>
                    <span className="text-sm text-gray-500">선임</span>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>02-1234-5678</span>
                    </div>
                    <div className="flex items-center gap-2 ml-6">
                      <span>010-1234-5679</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>nhappy@yesc.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t flex justify-end">
            {project.status === '승인대기' && (
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setIsRejectOpen(true)}>
                  <X className="w-4 h-4 mr-1" />
                  반려
                </Button>
                <Button className="bg-pink-600 hover:bg-pink-700" onClick={() => setIsApproveOpen(true)}>
                  <Check className="w-4 h-4 mr-1" />
                  승인
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={isApproveOpen} onOpenChange={setIsApproveOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-center">프로젝트를 승인하시겠습니까?</DialogTitle>
            <DialogDescription className="text-center text-gray-600">승인 후 즉시 공고가 게시됩니다.</DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <Button onClick={() => setIsApproveOpen(false)} variant="outline" className="flex-1">취소</Button>
            <Button onClick={handleApprove} className="flex-1 bg-green-600 hover:bg-green-700">승인</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-center">프로젝트를 반려하시겠습니까?</DialogTitle>
            <DialogDescription className="text-center text-gray-600">반려 사유를 입력해 주세요.</DialogDescription>
          </DialogHeader>
          <textarea className="w-full border border-gray-300 rounded-lg p-3 text-sm mt-4" rows={4} placeholder="반려 사유를 입력해 주세요..." />
          <div className="flex gap-3 mt-4">
            <Button onClick={() => setIsRejectOpen(false)} variant="outline" className="flex-1">취소</Button>
            <Button onClick={handleReject} className="flex-1 bg-red-600 hover:bg-red-700 text-white">반려</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isCompleteOpen} onOpenChange={setIsCompleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-center">처리가 완료되었습니다.</DialogTitle>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <div className="flex-1 min-w-0 [&_a]:block [&_a]:w-full">
              <BackToListButton href="/admin/projects" className="w-full" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
