import Layout from "@/components/layout/layout"
import WorkSidebar from "@/components/work/sidebar"
import { Link } from "wouter"
import { useState } from "react"
import { Phone, Send, Building2, ExternalLink } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

const dummyProjects = [
  { id: "C-001", title: "[(주)오리온] 더미 컨설팅 문의 1" },
  { id: "C-002", title: "[(주)오리온] 더미 컨설팅 문의 2" },
  { id: "C-003", title: "[(주)삼성] 마케팅 전략 컨설팅" },
]

const progressSteps = ["접수", "진행중", "완료·종료", "확정 전"]

const messages = [
  {
    id: 1,
    type: "inquiry",
    icon: "📋",
    sender: "문의 접수",
    content: "더미 컨설팅 문의 2\n컨설팅 문의 더미 내용 2",
    date: "2026.03.20 09:00",
  },
  {
    id: 2,
    type: "consultant",
    icon: "💬",
    sender: "김컨설턴트",
    content: "고객님 b채중으로 안내 문자 발송함.",
    date: "03.26 11:24",
  },
  {
    id: 3,
    type: "system",
    icon: "💬",
    sender: "시스템",
    content: "[안녕] 안녕하세요. 배정된 담당자 김컨설턴트입니다. 금일 오후 2시에 연락드리겠습니다.",
    date: "03.26 11:25",
  },
]

const messageTags = ["문자", "카톡", "앱메시지"]

export default function WorkConsultingInquiryDetail() {
  const [selectedProject, setSelectedProject] = useState(dummyProjects[1].id)
  const [currentStep] = useState(1)
  const [messageText, setMessageText] = useState("")
  const [activeTag, setActiveTag] = useState("문자")

  const currentProject = dummyProjects.find(p => p.id === selectedProject)

  return (
    <Layout>
      <div className="work-container">
        <div className="work-content">
          <div className="flex gap-6">
            <WorkSidebar />
            <div className="flex-1 min-w-0">
              {/* 페이지 헤더 */}
              <div className="mb-6">
                <h1 className="work-title">컨설팅 문의</h1>
                <p className="work-subtitle">/ 프로젝트 상세</p>
              </div>

              {/* 프로젝트 선택 드롭다운 + 목록으로 버튼 */}
              <div className="flex items-center justify-between mb-4 gap-3">
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger className="flex-1 max-w-lg h-10 text-sm border-gray-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {dummyProjects.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Link href="/work/consulting-inquiries">
                  <button className="flex items-center gap-1.5 px-4 py-2 bg-gray-700 text-white text-sm rounded-md hover:bg-gray-800 transition-colors whitespace-nowrap">
                    ← 목록으로
                  </button>
                </Link>
              </div>

              {/* 클라이언트 정보 + 진행 단계 */}
              <div className="bg-white border border-gray-200 rounded-lg px-5 py-4 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-900 text-sm">(주)오리온</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <Phone className="w-3.5 h-3.5" />
                    <span>010-1234-11</span>
                  </div>
                  <button className="text-xs text-blue-600 border border-blue-300 rounded px-2 py-0.5 hover:bg-blue-50">
                    전화하기
                  </button>
                </div>

                {/* 진행 단계 */}
                <div className="flex items-center gap-0">
                  {progressSteps.map((step, idx) => (
                    <div key={step} className="flex items-center">
                      <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold border-2 ${
                        idx === currentStep
                          ? "bg-blue-500 border-blue-500 text-white"
                          : idx < currentStep
                          ? "bg-gray-400 border-gray-400 text-white"
                          : "bg-white border-gray-300 text-gray-400"
                      }`}>
                        {idx + 1}
                      </div>
                      {idx < progressSteps.length - 1 && (
                        <div className={`w-8 h-0.5 ${idx < currentStep ? "bg-gray-400" : "bg-gray-200"}`} />
                      )}
                    </div>
                  ))}
                  <div className="ml-3 flex gap-2 text-xs text-gray-500">
                    {progressSteps.map((step, idx) => (
                      <span key={step} className={idx === currentStep ? "text-blue-600 font-medium" : ""}>
                        {step}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 메시지 스레드 */}
              <div className="bg-white border border-gray-200 rounded-lg mb-4">
                <div className="divide-y divide-gray-100">
                  {messages.map(msg => (
                    <div key={msg.id} className="px-5 py-4">
                      <div className="flex items-start gap-3">
                        <div className="text-xl flex-shrink-0 mt-0.5">{msg.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="font-medium text-gray-900 text-sm">{msg.sender}</span>
                            <span className="text-xs text-gray-400 flex-shrink-0">{msg.date}</span>
                          </div>
                          <div className="text-sm text-gray-700 whitespace-pre-line">{msg.content}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 메시지 입력 */}
                <div className="border-t border-gray-200 px-5 py-4">
                  {/* 태그 버튼 */}
                  <div className="flex items-center gap-2 mb-3">
                    {messageTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => setActiveTag(tag)}
                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs border transition-colors ${
                          activeTag === tag
                            ? "bg-gray-800 text-white border-gray-800"
                            : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {activeTag === tag && <span>✓</span>} {tag}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Textarea
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="고객에게 발송할 메시지를 입력하여주세요..."
                      className="flex-1 resize-none h-20 text-sm border-gray-200"
                    />
                    <Button
                      onClick={() => setMessageText("")}
                      className="self-end px-4 py-2 text-white text-xs rounded-lg flex flex-col items-center gap-1 h-auto"
                      style={{ backgroundColor: "#16C2E9" }}
                    >
                      <Send className="w-4 h-4" />
                      <span>보내기</span>
                    </Button>
                  </div>
                </div>
              </div>

              {/* 연결된 프로젝트 */}
              <div className="bg-white border border-gray-200 rounded-lg px-5 py-5">
                <h3 className="font-bold text-gray-900 mb-1">연결된 프로젝트</h3>
                <p className="text-sm text-gray-500 mb-4">이 컨설팅 문의를 통해 생성된 프로젝트입니다.</p>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div>
                    <p className="text-sm font-medium text-gray-900">[(주)오리온] 브랜드 영상 제작 프로젝트</p>
                    <p className="text-xs text-gray-400 mt-0.5">PRJ-2026-0042 · 진행중</p>
                  </div>
                  <Link href="/work/projects/42">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-700 text-xs rounded-md hover:bg-gray-100 transition-colors whitespace-nowrap">
                      <ExternalLink className="w-3.5 h-3.5" />
                      프로젝트 보기
                    </button>
                  </Link>
                </div>
              </div>

              {/* 하단 목록으로 */}
              <div className="flex justify-end mt-4">
                <Link href="/work/consulting-inquiries">
                  <button className="flex items-center gap-1.5 px-4 py-2 bg-gray-700 text-white text-sm rounded-md hover:bg-gray-800 transition-colors">
                    ← 목록으로
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
