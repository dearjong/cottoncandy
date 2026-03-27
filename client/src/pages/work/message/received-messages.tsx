import Layout from "@/components/layout/layout";
import WorkSidebar from "@/components/work/sidebar";
import { ChevronLeft } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Message } from "@shared/schema";

export default function ReceivedMessages() {
  const [, setLocation] = useLocation();

  const { data: messages = [], isLoading, error } = useQuery<Message[]>({
    queryKey: ['/api/messages?userId=1&type=received'],
  });

  return (
    <Layout>
      <div className="work-container">
        <div className="work-content">
          <div className="flex gap-6">
            <WorkSidebar />

            <div className="flex-1">
              <div className="mb-6">
                <h1 className="work-title">받은 메세지</h1>
              </div>

              {/* 메시지 리스트 */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                {isLoading ? (
                  <div className="text-center py-12">로딩중...</div>
                ) : error ? (
                  <div className="text-center py-12 text-red-600">메시지를 불러오는데 실패했습니다</div>
                ) : (
                  <>
                <table className="w-full">
                  <thead className="border-b">
                    <tr className="text-left text-sm text-gray-600">
                      <th className="pb-3 font-medium">발신</th>
                      <th className="pb-3 font-medium">제목</th>
                      <th className="pb-3 font-medium">프로젝트</th>
                      <th className="pb-3 font-medium w-32">날짜</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.map((message) => (
                      <tr
                        key={message.id}
                        onClick={() => setLocation(`/work/message/detail/${message.id}`)}
                        className="border-b last:border-0 hover:bg-gray-50 cursor-pointer"
                        data-testid={`message-row-${message.id}`}
                      >
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            {!message.isRead && (
                              <span className="bg-pink-600 text-white text-xs px-2 py-0.5 rounded">New</span>
                            )}
                            <span className="font-medium">[{message.senderCompany}]</span>
                          </div>
                        </td>
                        <td className="py-4">{message.subject}</td>
                        <td className="py-4 text-gray-600">{message.projectTitle}</td>
                        <td className="py-4 text-sm text-gray-500">
                          {message.createdAt ? new Date(message.createdAt).toLocaleDateString('ko-KR') : ''}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {messages.length === 0 && (
                  <div className="text-center py-12 text-gray-500">받은 메시지가 없습니다</div>
                )}
                </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
