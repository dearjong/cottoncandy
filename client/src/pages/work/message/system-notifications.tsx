import Layout from "@/components/layout/layout";
import WorkSidebar from "@/components/work/sidebar";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Notification } from "@shared/schema";

export default function SystemNotifications() {
  const [, setLocation] = useLocation();

  const { data: notifications = [], isLoading, error } = useQuery<Notification[]>({
    queryKey: ['/api/notifications?userId=1&type=system'],
  });

  return (
    <Layout>
      <div className="work-container">
        <div className="work-content">
          <div className="flex gap-6">
            <WorkSidebar />
            
            <div className="flex-1">
              {/* 헤더 */}
              <div className="mb-6">
                <h1 className="work-title">Cotton Candy 알림</h1>
              </div>

              {/* 알림 리스트 */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                {isLoading ? (
                  <div className="text-center py-12">로딩중...</div>
                ) : error ? (
                  <div className="text-center py-12 text-red-600">알림을 불러오는데 실패했습니다</div>
                ) : (
                  <>

                <table className="w-full">
                  <thead className="border-b">
                    <tr className="text-left text-sm text-gray-600">
                      <th className="pb-3">제목</th>
                      <th className="pb-3">날짜</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notifications.map((notif) => (
                      <tr 
                        key={notif.id} 
                        onClick={() => setLocation(`/work/notification/detail/${notif.id}`)}
                        className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                        data-testid={`notification-row-${notif.id}`}
                      >
                        <td className="py-3 text-sm">{notif.title}</td>
                        <td className="py-3 text-sm text-gray-500">{notif.createdAt ? new Date(notif.createdAt).toLocaleDateString('ko-KR') : ''}</td>
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
                  <Button variant="outline" size="sm" className="ml-4">삭제하기</Button>
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
