import { useState } from 'react';
import { useLocation } from 'wouter';
import Layout from '@/components/layout/layout';
import WorkSidebar from '@/components/work/sidebar';
import { Plus } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  MOCK_PROPOSAL_SUBMISSION_PROJECTS,
  MOCK_PROPOSAL_SUBMISSION_ROWS,
  PROPOSAL_SUBMISSION_FIELD_COLUMNS,
} from '@/data/proposalSubmissionMock';

const COLUMNS = [
  { key: 'companyName' as const, label: '업체명', className: 'text-left min-w-[140px]' },
  ...PROPOSAL_SUBMISSION_FIELD_COLUMNS.map((c) => ({
    key: c.key,
    label: c.label,
    className: 'text-center w-20',
  })),
  { key: 'submittedAt' as const, label: '제출일', className: 'text-center w-28' },
] as const;

export default function WorkProjectProposal() {
  const [, setLocation] = useLocation();
  const [projectId, setProjectId] = useState(MOCK_PROPOSAL_SUBMISSION_PROJECTS[0].id);

  return (
    <Layout>
      <div className="work-container">
        <div className="work-content">
          <div className="flex gap-6">
            <WorkSidebar />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-0">
                <h1 className="work-title">제안서·시안 (제출현황)</h1>
                <button
                  type="button"
                  onClick={() => setLocation('/work/project/proposal/register')}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-pink-600 hover:bg-pink-700 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  등록하기
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-sm mt-6 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <Select value={projectId} onValueChange={setProjectId}>
                    <SelectTrigger className="w-full max-w-xl">
                      <SelectValue placeholder="프로젝트 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_PROPOSAL_SUBMISSION_PROJECTS.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="px-6 py-3 border-b border-gray-100 bg-gray-50/80">
                  <h2 className="text-sm font-medium text-gray-700">기업별 제출현황</h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm" data-testid="proposal-submission-table">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        {COLUMNS.map((col) => (
                          <th
                            key={col.key}
                            className={`py-3 px-3 font-medium text-gray-700 ${col.className}`}
                          >
                            {col.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_PROPOSAL_SUBMISSION_ROWS.map((row) => (
                          <tr
                            key={row.id}
                            className="border-b border-gray-100 hover:bg-gray-50/50 cursor-pointer"
                            onClick={() => setLocation(`/work/project/proposal/view/${row.id}`)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === 'Enter' && setLocation(`/work/project/proposal/view/${row.id}`)}
                          >
                            <td className="py-3 px-3 text-gray-800">
                              <div className="flex flex-col gap-0.5">
                                <span className="font-medium">{row.companyName}</span>
                                {row.versions && row.versions.length > 0 && (
                                  <div className="text-gray-500 text-xs mt-1 space-y-0.5">
                                    {row.versions.map((v) => (
                                      <div key={v}>└ {v}</div>
                                    ))}
                                    {row.confirmed && (
                                      <span className="text-green-600 font-medium">✔ 확정</span>
                                    )}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-3 text-center text-gray-700">
                              {row.strategy === 0 ? '-' : row.strategy}
                            </td>
                            <td className="py-3 px-3 text-center text-gray-700">
                              {row.creative === 0 ? '-' : row.creative}
                            </td>
                            <td className="py-3 px-3 text-center text-gray-700">
                              {row.video === 0 ? '-' : row.video}
                            </td>
                            <td className="py-3 px-3 text-center text-gray-700">
                              {row.image === 0 ? '-' : row.image}
                            </td>
                            <td className="py-3 px-3 text-center text-gray-700">
                              {row.companyIntro === 0 ? '-' : row.companyIntro}
                            </td>
                            <td className="py-3 px-3 text-center text-gray-700">
                              {row.documents === 0 ? '-' : row.documents}
                            </td>
                            <td className="py-3 px-3 text-center text-gray-600">
                              {row.submittedAt}
                            </td>
                          </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
