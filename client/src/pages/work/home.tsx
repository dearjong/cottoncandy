import { useState } from "react";
import Layout from "@/components/layout/layout";
import WorkSidebar from "@/components/work/sidebar";
import { useQuery } from "@tanstack/react-query";
import type { Message } from "@shared/schema";

export default function WorkHome() {
  const userMode = (localStorage.getItem('userMode') as 'request' | 'participate') || 'request';
  const [activeTab, setActiveTab] = useState<"request" | "participate">(userMode);

  // API에서 메시지 가져오기
  const { data: apiMessages = [], error: messagesError, isLoading: messagesLoading } = useQuery<Message[]>({
    queryKey: ['/api/messages?userId=1&type=received'],
  });

  // API 메시지를 화면 형식으로 변환
  const formattedMessages = (messagesLoading || messagesError) ? [] : apiMessages.slice(0, 3).map(msg => ({
    from: `[${msg.senderCompany}]`,
    text: msg.subject.substring(0, 20) + (msg.subject.length > 20 ? '...' : ''),
    time: msg.createdAt ? new Date(msg.createdAt).toLocaleDateString('ko-KR') : '',
    isNew: !msg.isRead
  }));

  const requestData = {
    company: {
      name: "베스트전자",
      logo: "B",
      type: "대기업",
      industry: "전기전자"
    },
    stats: {
      pending: 1,
      inProgress: 1,
      completed: 1,
      cancelled: 1
    },
    messages: formattedMessages.length > 0 ? formattedMessages : [
      { from: "[핑크애드]", text: "프로모션 광고제작에 문의드려요.", time: "11:30", isNew: true },
      { from: "[블루애드]", text: "프로모션 광고제작에 문의드려요.", time: "어제", isNew: false },
      { from: "[그린애드]", text: "프로모션 광고제작에 문의드...", time: "2025-05-30", isNew: false }
    ],
    applications: [
      { company: "[핑크애드]", text: "비딩 참여합니다.", time: "11:30" },
      { company: "[블루애드]", text: "제작 참여 신청합니다.", time: "어제" },
      { company: "[그린애드]", text: "프로젝트 참여 신청합니다.", time: "2025-05-30" }
    ],
    projects: [
      { title: "[베스트전자] 엑설런트 포로모션", status: "접수중", deadline: "마감 7일전" },
      { title: "[베스트전자] 스탠바이미 신제품 런칭", status: "OT", deadline: "10일 전" },
      { title: "[베스트전자] 기업홍보 광고 영상 제작", status: "제작중", deadline: "마감 30일 전" }
    ],
    interested: [
      { title: "[옐로애드] 프로모션 광고제작 참여기업 모집", deadline: "마감 7일전" },
      { title: "[퍼플애드] 프로모션 광고제작 참여기업", deadline: "마감 15일전" },
      { title: "[블랙애드] 프로모션 광고제작 참여기업", deadline: "마감 30일전" }
    ],
    recommended: [
      { title: "[래빗애드] 프로모션 광고제작 참여기업 모집", deadline: "마감 7일전" },
      { title: "[퍼피애드] 프로모션 광고제작 참여기업", deadline: "마감 15일전" },
      { title: "[덕클링애드] 프로모션 광고제작 참여기업", deadline: "마감 30일전" }
    ]
  };

  const participateData = {
    company: {
      name: "솜사탕애드",
      logo: "",
      type: "Creative중심 대행사",
      industry: ""
    },
    stats: {
      pending: 1,
      inProgress: 1,
      completed: 1,
      cancelled: 1
    },
    messages: formattedMessages.length > 0 ? formattedMessages : [
      { from: "[베스트전자]", text: "프로모션 광고제작에 문의드...", time: "11:30", isNew: true },
      { from: "[베스트푸드]", text: "프로모션 광고제작에 문의드려요.", time: "어제", isNew: false },
      { from: "[베스트쇼핑]", text: "프로모션 광고제작에 문의...", time: "2025-05-30", isNew: false }
    ],
    applications: [
      { company: "[빙그레]", text: "비딩 참여합니다.", time: "발표 7일 전" },
      { company: "[베스트전자]", text: "제작 참여 신청합니다.", time: "발표 10일 전" },
      { company: "[동원]", text: "프로젝트 참여 신청합니다.", time: "발표 13일 전" }
    ],
    projects: [
      { title: "[빙그레] 엑설런트 포로모션 광고", status: "참여신청", deadline: "마감 7일 전" },
      { title: "[베스트전자] 스타 런칭 신제품", status: "OT참여 참석", deadline: "10일 전" },
      { title: "[동원] 기업홍보 영상 광고 제작", status: "제작중", deadline: "마감 30일 전" }
    ],
    interested: [
      { title: "[베스트전자] 프로모션 광고제작 참여 기업", deadline: "마감 7일 전" },
      { title: "[빙그레] 프로모션 광고제작 참여 기업 모집", deadline: "마감 15일 전" },
      { title: "[동원] 프로모션 광고제작 참여 기업 모집", deadline: "마감 30일 전" }
    ],
    recommended: [
      { title: "[오리온] 프로모션 광고제작 참여 기업 모집", deadline: "마감 7일 전" },
      { title: "[LG전자] 프로모션 광고제작 참여 기업 모집", deadline: "마감 15일 전" },
      { title: "[LG화학] 프로모션 광고제작 참여 기업 모집", deadline: "마감 30일 전" }
    ]
  };

  const data = activeTab === "request" ? requestData : participateData;

  return (
    <Layout>
      <div className="work-container">
        <div className="work-content">
          <div className="flex gap-6">
            <WorkSidebar />

            {/* 메인 컨텐츠 */}
            <div className="flex-1">
              {/* 회사 정보 & 활동 현황 */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-pink-600 rounded flex items-center justify-center text-white font-bold text-2xl">
                      {data.company.logo || data.company.name.substring(0, 1)}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{data.company.name}</h2>
                      <p className="text-gray-600">{data.company.type} {data.company.industry}</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="text-center">
                      <div className="text-sm text-gray-600">{activeTab === "request" ? "승인전" : "참여신청"}</div>
                      <div className="text-2xl font-bold text-pink-600">({data.stats.pending})</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">{activeTab === "request" ? "진행중" : "제작중"}</div>
                      <div className="text-2xl font-bold">({data.stats.inProgress})</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">완료</div>
                      <div className="text-2xl font-bold">({data.stats.completed})</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">취소/중단</div>
                      <div className="text-2xl font-bold">({data.stats.cancelled})</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-2">회사소개 & 포트폴리오</div>
                  <div className="font-medium">
                    [공개중] {activeTab === "request" ? `${data.company.name} 입니다.` : `Campaign creators ${data.company.name} 입니다.`}
                  </div>
                </div>
              </div>

              {/* 받은 메세지 & 참여신청/프로젝트 현황 */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                {/* 받은 메세지 */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="font-bold mb-4">받은 메세지</h3>
                  {messagesLoading ? (
                    <div className="text-center py-6 text-gray-500">로딩중...</div>
                  ) : messagesError ? (
                    <div className="text-center py-6 text-red-600">메시지를 불러오는데 실패했습니다</div>
                  ) : (
                    <div className="space-y-3">
                      {data.messages.map((msg, idx) => (
                        <div key={idx} className="flex items-start justify-between py-2 border-b border-gray-100 last:border-0">
                          <div className="flex-1">
                            <div className="text-sm text-gray-900">{msg.from} {msg.text}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            {msg.isNew && <span className="bg-pink-600 text-white text-xs px-2 py-0.5 rounded">New</span>}
                            <span className="text-xs text-gray-500 whitespace-nowrap">{msg.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 참여신청 현황 */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="font-bold mb-4">참여신청 현황</h3>
                  <div className="space-y-3">
                    {data.applications.map((app, idx) => (
                      <div key={idx} className="flex items-start justify-between py-2 border-b border-gray-100 last:border-0">
                        <div className="text-sm text-gray-900">{app.company} {app.text}</div>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-4">{app.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 프로젝트 진행 현황 */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="font-bold mb-4">프로젝트 진행 현황</h3>
                <div className="space-y-3">
                  {data.projects.map((project, idx) => (
                    <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div className="flex-1">
                        <div className="font-medium">{project.title}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm px-3 py-1 bg-pink-50 text-pink-600 rounded-full">[{project.status}]</span>
                        <span className="text-sm text-gray-500 whitespace-nowrap">{project.deadline}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 관심업체/공고 & 추천업체/공고 */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="font-bold mb-4">{activeTab === "request" ? "관심 업체" : "관심공고"}</h3>
                  <div className="space-y-3">
                    {data.interested.map((item, idx) => (
                      <div key={idx} className="flex items-start justify-between py-2 border-b border-gray-100 last:border-0">
                        <div className="text-sm text-gray-900 flex-1">{item.title}</div>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-4">{item.deadline}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="font-bold mb-4">{activeTab === "request" ? "추천 업체" : "추천공고"}</h3>
                  <div className="space-y-3">
                    {data.recommended.map((item, idx) => (
                      <div key={idx} className="flex items-start justify-between py-2 border-b border-gray-100 last:border-0">
                        <div className="text-sm text-gray-900 flex-1">{item.title}</div>
                        <span className="text-xs text-gray-500 whitespace-nowrap ml-4">{item.deadline}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
