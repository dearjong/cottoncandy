import { useState } from 'react';
import Layout from '@/components/layout/layout';
import WorkSidebar from '@/components/work/sidebar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SelectionStage {
  id: string;
  stage: string;
  companyName: string;
  status: 'pending' | 'passed' | 'rejected';
  submittedAt: string;
}

export default function WorkProjectSelection() {
  const [selectedProject, setSelectedProject] = useState('1');
  const [activeStage, setActiveStage] = useState('application');

  const projects = [
    { id: '1', title: '[베스트전자] TV 신제품 판매촉진 프로모션' },
    { id: '2', title: '[글로벌식품] 신제품 런칭 캠페인' },
    { id: '3', title: '[패션하우스] FW 시즌 브랜드 캠페인' },
  ];

  const stages = [
    { id: 'application', label: '참여신청', count: 5 },
    { id: 'ot', label: 'OT', count: 4 },
    { id: 'proposal', label: '제안서', count: 3 },
    { id: 'pt', label: 'PT', count: 2 },
    { id: 'final', label: '최종선정', count: 1 },
  ];

  const selectionData: SelectionStage[] = [
    { id: '1', stage: 'application', companyName: 'VEGA', status: 'passed', submittedAt: '2025.01.15' },
    { id: '2', stage: 'application', companyName: '솜사탕애드', status: 'passed', submittedAt: '2025.01.14' },
    { id: '3', stage: 'application', companyName: '크리에이티브랩', status: 'pending', submittedAt: '2025.01.13' },
    { id: '4', stage: 'application', companyName: '미디어웍스', status: 'rejected', submittedAt: '2025.01.12' },
    { id: '5', stage: 'application', companyName: '디지털플러스', status: 'pending', submittedAt: '2025.01.11' },
  ];

  const getStatusLabel = (status: SelectionStage['status']) => {
    switch (status) {
      case 'passed': return '통과';
      case 'rejected': return '탈락';
      case 'pending': return '검토중';
    }
  };

  const getStatusColor = (status: SelectionStage['status']) => {
    switch (status) {
      case 'passed': return 'bg-green-100 text-green-600';
      case 'rejected': return 'bg-red-100 text-red-600';
      case 'pending': return 'bg-yellow-100 text-yellow-600';
    }
  };

  const filteredData = selectionData.filter(item => item.stage === activeStage);

  return (
    <Layout>
      <div className="work-container">
        <div className="work-content">
          <div className="flex gap-6">
            <WorkSidebar />
            
            <div className="flex-1">
              <div className="mb-6">
                <h1 className="work-title">선정단계</h1>
              </div>

              <div className="bg-white rounded-lg shadow-sm mb-6">
                <div className="px-6 py-4 border-b">
                  <div className="flex items-center justify-end">
                    <Select value={selectedProject} onValueChange={setSelectedProject}>
                      <SelectTrigger className="w-[400px]" data-testid="select-project">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="px-6 py-4 border-b">
                  <div className="flex gap-4">
                    {stages.map((stage) => (
                      <button
                        key={stage.id}
                        onClick={() => setActiveStage(stage.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          activeStage === stage.id
                            ? 'bg-pink-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        data-testid={`stage-${stage.id}`}
                      >
                        {stage.label} ({stage.count})
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-6">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">기업명</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">제출일</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">상태</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-700">액션</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((item) => (
                        <tr key={item.id} className="border-b hover:bg-gray-50">
                          <td className="py-4 px-4 font-medium">{item.companyName}</td>
                          <td className="py-4 px-4 text-gray-600">{item.submittedAt}</td>
                          <td className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                              {getStatusLabel(item.status)}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex gap-2 justify-end">
                              <button 
                                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
                                data-testid={`button-view-${item.id}`}
                              >
                                상세보기
                              </button>
                              {item.status === 'pending' && (
                                <>
                                  <button 
                                    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                                    data-testid={`button-pass-${item.id}`}
                                  >
                                    통과
                                  </button>
                                  <button 
                                    className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                                    data-testid={`button-reject-${item.id}`}
                                  >
                                    탈락
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredData.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      해당 단계에 데이터가 없습니다.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
