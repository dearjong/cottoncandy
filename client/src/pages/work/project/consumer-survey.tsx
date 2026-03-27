import { useState } from 'react';
import Layout from '@/components/layout/layout';
import WorkSidebar from '@/components/work/sidebar';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const MOCK_PROJECTS = [{ id: '1', label: '[베스트전자] TV 신제품 판매촉진 프로모션' }];

export default function WorkProjectConsumerSurvey() {
  const [projectId, setProjectId] = useState('1');

  return (
    <Layout>
      <div className="work-container">
        <div className="work-content">
          <div className="flex gap-6">
            <WorkSidebar />
            <div className="flex-1 min-w-0">
              <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h1 className="work-title">소비자 반응 조사</h1>
                <Select value={projectId} onValueChange={setProjectId}>
                  <SelectTrigger className="w-full sm:w-[320px]">
                    <SelectValue placeholder="프로젝트 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_PROJECTS.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <p className="text-gray-700 mb-6">선택한 프로젝트의 TVCF 소비자 반응 조사 결과를 확인할 수 있습니다.</p>
                <Button
                  variant="outline"
                  size="default"
                  className="border-pink-200 text-pink-600 hover:bg-pink-50 hover:border-pink-300"
                  asChild
                >
                  <a href="https://www.tvcf.co.kr" target="_blank" rel="noopener noreferrer">
                    TVCF 소비자 반응조사 자세히 보기
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
