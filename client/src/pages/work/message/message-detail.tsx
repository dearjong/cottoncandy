import Layout from "@/components/layout/layout";
import WorkSidebar from "@/components/work/sidebar";
import ProjectButton from "@/components/common/project-button";
import { ChevronLeft, Paperclip } from "lucide-react";
import { useLocation, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Message } from "@shared/schema";

export default function MessageDetail() {
  const [, setLocation] = useLocation();
  const { id } = useParams<{ id: string }>();
  const messageId = id ? parseInt(id) : 1;
  
  // 특정 메시지 조회
  const { data: message, isLoading, error } = useQuery<Message>({
    queryKey: [`/api/messages/${messageId}`],
    enabled: !!messageId,
  });
  
  // 관련 메시지 목록 조회
  const { data: relatedMessages = [] } = useQuery<Message[]>({
    queryKey: ['/api/messages?userId=1&type=received'],
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="work-container">
          <div className="work-content">
            <div className="flex gap-6">
              <WorkSidebar />
              <div className="flex-1">
                <div className="text-center py-12">로딩중...</div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (error) {
    return (
      <Layout>
        <div className="work-container">
          <div className="work-content">
            <div className="flex gap-6">
              <WorkSidebar />
              <div className="flex-1">
                <div className="text-center py-12 text-red-600">
                  메시지를 불러오는데 실패했습니다
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!message) {
    return (
      <Layout>
        <div className="work-container">
          <div className="work-content">
            <div className="flex gap-6">
              <WorkSidebar />
              <div className="flex-1">
                <div className="text-center py-12">메시지를 찾을 수 없습니다</div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="work-container">
        <div className="work-content">
          <div className="flex gap-6">
            <WorkSidebar />
            
            <div className="flex-1">
              {/* 헤더 */}
              <div className="mb-6">
                <h1 className="work-title">답장읽기</h1>
                <p className="work-subtitle">[베스트전자] TV 신제품 판매촉진 프로모션</p>
              </div>

              {/* 메시지 정보 */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="space-y-3 mb-6">
                  <div className="flex gap-3">
                    <span className="text-gray-600 w-20">제목</span>
                    <span className="font-medium">{message.subject}</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-gray-600 w-20">보낸사람</span>
                    <span>[{message.senderCompany}] {message.sender}</span>
                  </div>
                </div>

                {/* 답장 내용 */}
                <div className="border-t pt-6 mb-6">
                  <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                    {message.content}
                  </div>
                </div>

                {/* 원문 */}
                {message.originalContent && (
                  <div className="border-t pt-6">
                    <h3 className="font-bold mb-4">[원문]</h3>
                    <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
                      {message.originalContent}
                    </div>
                  </div>
                )}

                {/* 첨부파일 */}
                {message.attachments && message.attachments.length > 0 && (
                  <div className="border-t pt-6 mt-6">
                    {message.attachments.map((file, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-gray-600 mb-2">
                        <Paperclip className="w-5 h-5" />
                        <span className="text-sm">{file}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 액션 버튼 */}
              <div className="flex justify-center gap-4 mb-8">
                <ProjectButton 
                  variant="white"
                  className="w-auto px-8"
                  onClick={() => {
                    const listPath = message.type === 'sent' 
                      ? '/work/message/sent' 
                      : '/work/message/received';
                    setLocation(listPath);
                  }}
                  data-testid="button-go-back"
                >
                  리스트
                </ProjectButton>
                <ProjectButton variant="white" className="w-auto px-8" data-testid="button-delete">삭제하기</ProjectButton>
                <ProjectButton variant="white" className="w-auto px-8" data-testid="button-view-project">프로젝트 보기</ProjectButton>
                <ProjectButton variant="pink" className="w-auto px-8" data-testid="button-reply">답장하기</ProjectButton>
              </div>

              {/* 관련 프로젝트 */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-bold mb-4">관련 프로젝트</h3>
                <table className="w-full">
                  <thead className="border-b">
                    <tr className="text-left text-sm text-gray-600">
                      <th className="pb-3">유형▽</th>
                      <th className="pb-3">제목</th>
                      <th className="pb-3">기업명</th>
                      <th className="pb-3">보낸사람</th>
                      <th className="pb-3">날짜</th>
                    </tr>
                  </thead>
                  <tbody>
                    {relatedMessages.map((msg) => (
                      <tr key={msg.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 text-sm">{msg.projectTitle}</td>
                        <td className="py-3 text-sm">
                          <span className={msg.messageType ? "text-pink-600" : ""}>{msg.messageType}</span> {msg.subject}
                        </td>
                        <td className="py-3 text-sm">{msg.senderCompany}</td>
                        <td className="py-3 text-sm">{msg.sender}</td>
                        <td className="py-3 text-sm text-gray-500">{msg.createdAt ? new Date(msg.createdAt).toLocaleDateString('ko-KR') : ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* 페이지네이션 */}
                <div className="flex justify-center gap-2 mt-6">
                  <button className="px-3 py-1 text-sm">&lt;&lt;</button>
                  <button className="px-3 py-1 text-sm">&lt;</button>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(page => (
                    <button key={page} className={`px-3 py-1 text-sm ${page === 1 ? 'font-bold' : ''}`}>{page}</button>
                  ))}
                  <button className="px-3 py-1 text-sm">&gt;</button>
                  <button className="px-3 py-1 text-sm">&gt;&gt;</button>
                  <ProjectButton variant="white" className="w-auto px-6 ml-4">삭제하기</ProjectButton>
                </div>

                {/* 검색 */}
                <div className="mt-6">
                  <input 
                    type="text" 
                    placeholder="검색어를 입력하세요"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    data-testid="input-search"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
