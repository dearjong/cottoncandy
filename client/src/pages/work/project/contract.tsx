import { useState } from 'react';
import Layout from '@/components/layout/layout';
import WorkSidebar from '@/components/work/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, Save, Send, CheckCircle } from 'lucide-react';
import { ProposalSecurityGate } from '@/components/admin/proposal-security-gate';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const MOCK_PROJECTS = [{ id: '1', label: '[베스트전자] TV 신제품 판매촉진 프로모션' }];

const MOCK_DELEGATION_TAGS = [
  '전략기획', '크리에이티브 기획', '영상 제작', '성과 측정 및 리포팅', '인플루언서/SNS 마케팅',
  '오프라인 이벤트/프로모션', '영상 기획', '영상 촬영', '편집 및 후반작업', '모델/배우 섭외', '매체 집행',
  '급행 제작 대응', '당일 피드백 반영 가능', '미디어 집행', 'PR/언론보도 대응', '가격 확정형', '구간가격형',
  '일정 유동성 대응', '음악/BGM', '이벤트/행사 대응', '미공개',
];

const MOCK_FILES = [
  { name: '[계약서] LG 스탠바이미2 프로모션 광고계약서.pdf', type: '계약서', date: '2024-04-06' },
  { name: '[HSAD] 사업자 등록증 사본.pdf', date: '2024-04-06' },
  { name: '[HSAD] 비밀유지 서약서 2025.pdf', type: '비밀유지 서약서', date: '2024-04-06' },
  { name: '[HSAD] 프로젝트 기획서 2025.pdf', type: '프로젝트 기획서', date: '2024-04-06' },
];

export default function WorkProjectContract() {
  const [projectId, setProjectId] = useState('1');
  const [contractStatus, setContractStatus] = useState<'draft' | 'request' | 'requesting' | 'done'>('draft');
  const [selectedDelegation, setSelectedDelegation] = useState<string[]>([]);
  const [sensitiveOpen, setSensitiveOpen] = useState(false);

  const toggleDelegation = (tag: string) => {
    setSelectedDelegation((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const SCHEDULE_OPTIONS = [
    '급행 제작 대응',
    '당일 피드백 반영 가능',
    '일정 유동성 대응',
    '이벤트/행사 대응',
  ];
  const [scheduleResponse, setScheduleResponse] = useState<string[]>([]);
  const toggleSchedule = (opt: string) => {
    setScheduleResponse((prev) =>
      prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]
    );
  };

  const isEmbed =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get('embed') === '1';

  // 작성/편집용 본문 (사용자 화면)
  const body = (
    <div className="space-y-6">
      {/* 계약파트너 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <Label className="text-gray-500 text-sm">계약파트너</Label>
        <p className="mt-1 text-gray-800 font-medium">예쓰커뮤니케이션</p>
      </div>

      {/* 의뢰 내용 (체크박스) */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <Label className="text-gray-500 text-sm block mb-3">의뢰 내용</Label>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {MOCK_DELEGATION_TAGS.map((tag) => (
            <label key={tag} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={selectedDelegation.includes(tag)}
                onCheckedChange={() => toggleDelegation(tag)}
              />
              <span className="text-sm text-gray-700">{tag}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 일정 대응 / 금액입력방식 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col gap-6">
          <div>
            <Label className="text-gray-700 text-sm block mb-3">일정 대응</Label>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
              {SCHEDULE_OPTIONS.map((opt) => (
                <label key={opt} className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={scheduleResponse.includes(opt)}
                    onCheckedChange={() => toggleSchedule(opt)}
                  />
                  <span className="text-sm text-gray-700">{opt}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <Label className="text-gray-500 text-sm block mb-2">금액입력방식</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <div>
                <p className="text-xs text-gray-500 mb-1">제작비</p>
                <Input placeholder="ex) 200,000,000" className="mb-1" />
                <p className="text-xs text-gray-500">원 VAT 포함</p>
                <p className="text-xs text-gray-600 mt-1">1.5억~3억원 (VAT 포함)</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">총 예산 (매체비포함)</p>
                <Input placeholder="ex) 2,000,000,000" className="mb-1" />
                <p className="text-xs text-gray-500">원 VAT 포함</p>
                <p className="text-xs text-gray-600 mt-1">5억 ~ 10억원 (VAT 포함)</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 계약일 / 최종기획안 / 납품기한 / OnAir */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <Label className="text-gray-500 text-sm">계약일</Label>
            <Input type="date" defaultValue="2025-10-15" className="mt-1" />
          </div>
          <div>
            <Label className="text-gray-500 text-sm">최종기획안 제출일</Label>
            <Input type="date" defaultValue="2025-10-15" className="mt-1" />
          </div>
          <div>
            <Label className="text-gray-500 text-sm">1차 납품기한</Label>
            <Input type="date" defaultValue="2025-10-15" className="mt-1" />
          </div>
          <div>
            <Label className="text-gray-500 text-sm">최종 납품기한</Label>
            <Input type="date" defaultValue="2025-10-15" className="mt-1" />
          </div>
          <div>
            <Label className="text-gray-500 text-sm">OnAir</Label>
            <Input type="date" defaultValue="2025-10-15" className="mt-1" />
          </div>
        </div>
      </div>

      {/* 선금 / 중도금 / 잔금 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <Label className="text-gray-500 text-sm block mb-3">결제 조건</Label>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="py-2 px-3 text-left font-medium text-gray-700">구분</th>
                <th className="py-2 px-3 text-left font-medium text-gray-700">시점</th>
                <th className="py-2 px-3 text-center font-medium text-gray-700 w-20">비율</th>
                <th className="py-2 px-3 text-left font-medium text-gray-700">일자</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-2 px-3">선금</td>
                <td className="py-2 px-3">계약 체결 시</td>
                <td className="py-2 px-3 text-center">0%</td>
                <td className="py-2 px-3">2025.10.15</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 px-3">중도금</td>
                <td className="py-2 px-3">기획안/스토리보드 확정 시</td>
                <td className="py-2 px-3 text-center">0%</td>
                <td className="py-2 px-3">2025.10.15</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 px-3">잔금</td>
                <td className="py-2 px-3">최종 결과물 납품 시</td>
                <td className="py-2 px-3 text-center">0%</td>
                <td className="py-2 px-3">2025.10.15</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 기업인증 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <Label className="text-gray-500 text-sm block mb-2">기업인증</Label>
        <p className="text-sm text-gray-700">사업자 정보·인증완료 (2027.12.31까지)</p>
      </div>

      {/* 기타 계약조건 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <Label className="text-gray-500 text-sm block mb-2">기타 계약조건</Label>
        <Textarea
          className="min-h-[80px]"
          placeholder="입력해주세요."
        />
      </div>

      {/* 서명완료된 계약서 / 최종기획서 / 기타문서 등록 */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <Label className="text-gray-500 text-sm block mb-3">서명완료된 계약서 / 최종기획서 / 기타문서 등록</Label>
        <ul className="space-y-2 mb-4">
          {MOCK_FILES.map((f) => (
            <li key={f.name} className="flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4 text-gray-400" />
              <span className="text-gray-800">{f.name}</span>
              {f.type && <span className="text-gray-400">| {f.type}</span>}
              <span className="text-gray-400">| {f.date}</span>
            </li>
          ))}
        </ul>
        <Button variant="outline" size="sm">파일 추가</Button>
      </div>

      {/* 안내 문구 */}
      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 space-y-1">
        <p>입력하신 정보는 안전하게 저장되며, 프로젝트 관리와 서비스 제공 목적에만 사용되는 것에 동의합니다.</p>
        <p>계약은 파트너사의 확인 및 동의 후 완료됩니다.</p>
        <p>계약이 확정되면 이후 수정은 불가능합니다.</p>
      </div>

      {/* 하단 버튼 */}
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" size="sm">
          <Save className="w-4 h-4 mr-1" />
          임시저장
        </Button>
        {contractStatus === 'draft' && (
          <Button size="sm" className="bg-pink-600 hover:bg-pink-700">
            <Send className="w-4 h-4 mr-1" />
            선정사에 계약 확정 요청
          </Button>
        )}
        {contractStatus === 'request' && (
          <Button size="sm" variant="secondary" disabled>
            선정사에 계약 확정 요청 중
          </Button>
        )}
        {contractStatus === 'done' && (
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            <CheckCircle className="w-4 h-4 mr-1" />
            계약 확정 완료
          </Button>
        )}
        <Button variant="outline" size="sm">계약내용 확인 및 동의</Button>
      </div>
    </div>
  );

  // 임베드(운영자 탭)에서 사용하는 출력 전용 뷰
  const bodyView = (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border p-4">
        <p className="text-xs text-gray-500 mb-1">계약파트너</p>
        <p className="text-sm font-medium text-gray-900">예쓰커뮤니케이션</p>
      </div>

      <div className="bg-white rounded-lg border p-4">
        <p className="text-xs text-gray-500 mb-2">의뢰 내용</p>
        <div className="flex flex-wrap gap-2 text-xs text-gray-800">
          {MOCK_DELEGATION_TAGS.map((tag) => (
            <span key={tag} className="inline-flex items-center rounded-full border px-2 py-0.5">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border p-4">
        <p className="text-xs text-gray-500 mb-2">일정 및 금액 구간</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-800">
          <div>
            <p className="text-gray-600 text-xs mb-1">일정 대응</p>
            <p>급행 제작 대응, 당일 피드백 반영 가능</p>
          </div>
          <div>
            <p className="text-gray-600 text-xs mb-1">제작비 (구간)</p>
            <p>1.5억 ~ 3억원 (VAT 포함)</p>
          </div>
          <div>
            <p className="text-gray-600 text-xs mb-1">총 예산 (구간)</p>
            <p>5억 ~ 10억원 (VAT 포함)</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-4">
        <p className="text-xs text-gray-500 mb-2">주요 일정</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-gray-800">
          <div>
            <p className="text-gray-500 mb-0.5">계약일</p>
            <p>2025-10-15</p>
          </div>
          <div>
            <p className="text-gray-500 mb-0.5">최종기획안 제출일</p>
            <p>2025-10-15</p>
          </div>
          <div>
            <p className="text-gray-500 mb-0.5">1차 납품기한</p>
            <p>2025-10-15</p>
          </div>
          <div>
            <p className="text-gray-500 mb-0.5">최종 납품기한</p>
            <p>2025-10-15</p>
          </div>
          <div>
            <p className="text-gray-500 mb-0.5">OnAir</p>
            <p>2025-10-15</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-4">
        <p className="text-xs text-gray-500 mb-2">결제 조건</p>
        <table className="w-full text-xs text-gray-800">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="py-1.5 px-2 text-left font-medium">구분</th>
              <th className="py-1.5 px-2 text-left font-medium">시점</th>
              <th className="py-1.5 px-2 text-center font-medium w-16">비율</th>
              <th className="py-1.5 px-2 text-left font-medium">일자</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-100">
              <td className="py-1.5 px-2">선금</td>
              <td className="py-1.5 px-2">계약 체결 시</td>
              <td className="py-1.5 px-2 text-center">0%</td>
              <td className="py-1.5 px-2">2025.10.15</td>
            </tr>
            <tr className="border-b border-gray-100">
              <td className="py-1.5 px-2">중도금</td>
              <td className="py-1.5 px-2">기획안/스토리보드 확정 시</td>
              <td className="py-1.5 px-2 text-center">0%</td>
              <td className="py-1.5 px-2">2025.10.15</td>
            </tr>
            <tr>
              <td className="py-1.5 px-2">잔금</td>
              <td className="py-1.5 px-2">최종 결과물 납품 시</td>
              <td className="py-1.5 px-2 text-center">0%</td>
              <td className="py-1.5 px-2">2025.10.15</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-white rounded-lg border p-4">
        <p className="text-xs text-gray-500 mb-2">기타 계약조건</p>
        <button
          type="button"
          className="inline-flex items-center rounded border px-2 py-1 text-[11px] text-gray-700 hover:border-pink-400 hover:text-pink-600"
          onClick={() => setSensitiveOpen(true)}
        >
          민감정보로 비공개 · 내용 보기 (보안)
        </button>
      </div>

      <div className="bg-white rounded-lg border p-4">
        <p className="text-xs text-gray-500 mb-2">첨부 문서</p>
        <ul className="space-y-1 text-xs text-gray-800">
          {MOCK_FILES.map((f) => (
            <li key={f.name} className="flex items-center gap-2">
              <FileText className="w-3 h-3 text-gray-400" />
              <span>{f.name}</span>
              {f.type && <span className="text-gray-400">| {f.type}</span>}
              <span className="text-gray-400">| {f.date}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-gray-50 rounded-lg p-3 text-[11px] text-gray-600 space-y-1">
        <p>입력하신 정보는 프로젝트 관리와 서비스 제공 목적에만 사용됩니다.</p>
        <p>계약은 파트너사의 확인 및 동의 후 완료됩니다. 계약 확정 후에는 수정이 불가능합니다.</p>
      </div>
    </div>
  );

  if (isEmbed) {
    // 운영자 탭 등 임베드에서는 입력 UI 없이 출력용 뷰만 노출
    return (
      <div className="p-4">
        {bodyView}
        <ProposalSecurityGate
          open={sensitiveOpen}
          onCancel={() => setSensitiveOpen(false)}
          onVerified={() => {
            // TODO: 실제 기타 계약조건 내용 출력/확대 뷰 연동
            setSensitiveOpen(false);
          }}
          validatePassword={() => true}
        />
      </div>
    );
  }

  return (
    <Layout>
      <div className="work-container">
        <div className="work-content">
          <div className="flex gap-6">
            <WorkSidebar />
            <div className="flex-1">
              <div className="mb-6 flex items-center justify-between">
                <h1 className="work-title">계약정보 (임시저장)</h1>
                <Select value={projectId} onValueChange={setProjectId}>
                  <SelectTrigger className="w-full max-w-xl">
                    <SelectValue placeholder="프로젝트 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_PROJECTS.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {body}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
