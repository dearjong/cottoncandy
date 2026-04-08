import { useState } from 'react';
import Layout from '@/components/layout/layout';
import WorkSidebar from '@/components/work/sidebar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { ChevronDown, ExternalLink, X, FileText } from 'lucide-react';
import {
  trackContractSaved,
  trackContractRequestSent,
  trackContractSigned,
  trackContractCancelled,
} from '@/lib/analytics';

const PARTNER = '마케팅에이전션';

const TASK_ITEMS = [
  ['편집이행', '크리에이티브 기획', '영상 제작', '60초 이상'],
  ['유튜브 채널 운영', '인스타그램/SNS 마케팅', 'PR/언론보도 대응'],
  ['옥외/미디어 광고'],
  ['의뢰 기획', '맞춤 광고', '맞춤 및 추가특성', '실의기획'],
  ['이벤트/팝업 전략', '기타'],
  ['공통 제작 기업', '상임 대응', '일반 우선순위 대표', '이벤트/행사기획'],
];

const BUDGET_RANGES = [
  '1억 미만', '1억~1.5억원', '1.5억~2억원', '2억~3억원', '3억~5억원', '5억~10억원', '10억 이상',
];

const MOCK_FILES = [
  { id: 1, name: '[베스트전자] LG 전자마케팅 프로젝트 광고계약서.pdf', date: '2024-10-05' },
  { id: 2, name: '[HSAD] 사업자 등록증 사본.pdf', date: '2024-10-05' },
  { id: 3, name: '[HSAD] 비밀유지 서약서 2025.pdf', date: '2024-10-05' },
  { id: 4, name: '[HSAD] 프로젝트 기획서 2025.pdf', date: '2024-10-05' },
];

type ContractState = 'draft' | 'requested' | 'registered';

export default function WorkProjectContract() {
  const { toast } = useToast();
  const [open, setOpen] = useState(true);
  const [contractState, setContractState] = useState<ContractState>('draft');
  const [tasks, setTasks] = useState<string[]>(['크리에이티브 기획', '영상 제작']);
  const [adType, setAdType] = useState<string[]>(['기획 확정형']);
  const [budgetRange, setBudgetRange] = useState('1.5억~2억원');
  const [extraRange, setExtraRange] = useState('3억~10억원');
  const [memo, setMemo] = useState('');
  const [files, setFiles] = useState(MOCK_FILES);
  const [agree1, setAgree1] = useState(true);
  const [agree2, setAgree2] = useState(true);
  const [agree3, setAgree3] = useState(false);

  const toggleTask = (t: string) =>
    setTasks(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const toggleAdType = (t: string) =>
    setAdType(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);

  const removeFile = (id: number) =>
    setFiles(prev => prev.filter(f => f.id !== id));

  function handleSave() {
    trackContractSaved({ partner_name: PARTNER });
    toast({ title: '임시저장', description: '계약 정보가 임시저장되었습니다.', duration: 2000 });
  }

  function handleInternalRequest() {
    trackContractRequestSent({ partner_name: PARTNER, request_type: 'internal' });
    toast({ title: '인정부서 계약 협의 요청', description: '인정부서에 협의 요청을 보냈습니다.', duration: 2500 });
  }

  function handlePartnerRequest() {
    trackContractRequestSent({ partner_name: PARTNER, request_type: 'partner' });
    setContractState('requested');
    toast({ title: '파트너사 계약 협의 요청', description: `${PARTNER}에 계약 협의 요청을 보냈습니다.`, duration: 2500 });
  }

  function handleRegister() {
    trackContractSigned({ partner_name: PARTNER, budget_range: budgetRange });
    setContractState('registered');
    toast({ title: '계약 등록 완료', description: '계약이 등록되었습니다. 파트너가 선정되었습니다.', duration: 3000 });
  }

  function handleCancel() {
    trackContractCancelled({ partner_name: PARTNER });
    toast({ title: '계약 취소', description: '계약이 취소되었습니다.', duration: 2500 });
  }

  const isReadonly = contractState === 'registered';

  return (
    <Layout>
      <div className="work-container">
        <div className="work-content">
          <div className="flex gap-6">
            <WorkSidebar />

            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-center mb-6">
                계약정보{contractState === 'draft' && ' (임시저장)'}
                {contractState === 'requested' && ' (협의 요청 중)'}
                {contractState === 'registered' && ' (등록 완료)'}
              </h1>

              <div className="bg-white rounded-lg border">
                {/* 프로젝트 헤더 */}
                <div className="px-5 py-3 border-b flex items-center justify-between">
                  <button
                    className="flex items-center gap-2 font-medium text-gray-800 hover:text-pink-600"
                    onClick={() => setOpen(v => !v)}
                  >
                    <ChevronDown className={`w-4 h-4 transition-transform ${open ? '' : '-rotate-90'}`} />
                    [베스트전자] TV 신제품 판매촉진 프로모션
                  </button>
                  <ExternalLink className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                </div>

                {open && (
                  <div className="p-6 space-y-5">
                    {/* 파트너사 */}
                    <div className="flex items-center gap-4 py-3 border-b">
                      <span className="text-sm text-gray-500 w-24 flex-shrink-0">파트너사</span>
                      <span className="text-gray-800 font-medium">{PARTNER}</span>
                    </div>

                    {/* 의뢰 사항 */}
                    <div className="flex gap-4 py-3 border-b">
                      <span className="text-sm text-gray-500 w-24 flex-shrink-0 pt-1">의뢰 사항</span>
                      <div className="flex-1 space-y-2">
                        {TASK_ITEMS.map((row, ri) => (
                          <div key={ri} className="flex flex-wrap gap-x-5 gap-y-1">
                            {row.map(item => (
                              <label key={item} className="flex items-center gap-1.5 cursor-pointer">
                                <Checkbox
                                  checked={tasks.includes(item)}
                                  onCheckedChange={() => !isReadonly && toggleTask(item)}
                                  disabled={isReadonly}
                                />
                                <span className="text-sm text-gray-700">{item}</span>
                              </label>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 광고 담당자 */}
                    <div className="flex items-center gap-4 py-3 border-b">
                      <span className="text-sm text-gray-500 w-24 flex-shrink-0">광고 담당자</span>
                      <div className="flex gap-6">
                        {['기획 확정형', '공간가격형'].map(t => (
                          <label key={t} className="flex items-center gap-1.5 cursor-pointer">
                            <Checkbox
                              checked={adType.includes(t)}
                              onCheckedChange={() => !isReadonly && toggleAdType(t)}
                              disabled={isReadonly}
                            />
                            <span className="text-sm text-gray-700">{t}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* 계약비 */}
                    <div className="flex items-center gap-4 py-3 border-b">
                      <span className="text-sm text-gray-500 w-24 flex-shrink-0">계약비</span>
                      <div className="flex items-center gap-3">
                        <select
                          value={budgetRange}
                          onChange={e => setBudgetRange(e.target.value)}
                          disabled={isReadonly}
                          className="text-sm border border-gray-300 rounded px-2 py-1.5"
                        >
                          {BUDGET_RANGES.map(r => <option key={r} value={r}>{r} (VAT 포함)</option>)}
                        </select>
                        {!isReadonly && <button className="text-xs text-blue-500 hover:underline">바꾸기</button>}
                      </div>
                    </div>

                    {/* 추가 특 */}
                    <div className="flex items-center gap-4 py-3 border-b">
                      <span className="text-sm text-gray-500 w-24 flex-shrink-0">추가 특</span>
                      <div className="flex items-center gap-3">
                        <select
                          value={extraRange}
                          onChange={e => setExtraRange(e.target.value)}
                          disabled={isReadonly}
                          className="text-sm border border-gray-300 rounded px-2 py-1.5"
                        >
                          {BUDGET_RANGES.map(r => <option key={r} value={r}>{r} (VAT 포함)</option>)}
                        </select>
                        {!isReadonly && <button className="text-xs text-blue-500 hover:underline">바꾸기</button>}
                      </div>
                    </div>

                    {/* 날짜 */}
                    <div className="py-3 border-b space-y-3">
                      {[
                        { label: '주무일', value: '2025.10.18' },
                        { label: '기획/계약 담당자', value: '2025.10.18' },
                        { label: '1차 납품기간', value: '2025.10.18' },
                        { label: '최종 납품기간', value: '2025.10.18' },
                        { label: 'D-day', value: '2025.10.18' },
                      ].map(({ label, value }) => (
                        <div key={label} className="flex items-center gap-4">
                          <span className="text-sm text-gray-500 w-24 flex-shrink-0">{label}</span>
                          <Input
                            defaultValue={value}
                            disabled={isReadonly}
                            className="w-40 text-sm h-8"
                          />
                        </div>
                      ))}
                    </div>

                    {/* 선금/중금/잔금 */}
                    <div className="py-3 border-b">
                      <div className="space-y-3">
                        {[
                          { label: '선금', timing: '제작 제작 시' },
                          { label: '중금', timing: '기획/스토리보드 확정 시' },
                          { label: '잔금', timing: '최종 결과물 납품 시' },
                        ].map(({ label, timing }) => (
                          <div key={label} className="flex items-center gap-3">
                            <span className="text-sm text-gray-500 w-12 flex-shrink-0">{label}</span>
                            <select disabled={isReadonly} className="text-sm border border-gray-300 rounded px-2 py-1.5 flex-1">
                              <option>{timing}</option>
                            </select>
                            <select disabled={isReadonly} className="text-sm border border-gray-300 rounded px-2 py-1.5 w-20">
                              <option>0%</option>
                              <option>30%</option>
                              <option>50%</option>
                              <option>70%</option>
                              <option>100%</option>
                            </select>
                            <Input defaultValue="2025.10.15" disabled={isReadonly} className="w-32 text-sm h-8" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 기업인증 */}
                    <div className="flex items-center gap-4 py-3 border-b">
                      <span className="text-sm text-gray-500 w-24 flex-shrink-0">기업인증</span>
                      <span className="text-sm text-gray-600">사업자 정보 - 준비중</span>
                    </div>

                    {/* 사업인증 */}
                    <div className="flex items-center gap-4 py-3 border-b">
                      <span className="text-sm text-gray-500 w-24 flex-shrink-0">사업인증</span>
                      <span className="text-sm text-gray-600">사업자 정보 없음 (2027.12.31까지)</span>
                    </div>

                    {/* 기타 메모 */}
                    <div className="flex gap-4 py-3 border-b">
                      <span className="text-sm text-gray-500 w-24 flex-shrink-0 pt-1">기타 메모</span>
                      <Textarea
                        value={memo}
                        onChange={e => setMemo(e.target.value)}
                        disabled={isReadonly}
                        placeholder="입력해주세요."
                        className="flex-1 min-h-[80px] resize-none text-sm"
                      />
                    </div>

                    {/* 파일 첨부 */}
                    <div className="py-3 border-b">
                      <p className="text-sm text-gray-500 mb-3">서명완료된 계약서 / 최종기획서 / 기타서류 파일 등록</p>
                      <div className="space-y-2">
                        {files.map(f => (
                          <div key={f.id} className="flex items-center justify-between bg-gray-50 rounded px-3 py-2">
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-800">{f.name}</span>
                              <span className="text-xs text-gray-400">{f.date}</span>
                            </div>
                            {!isReadonly && (
                              <button onClick={() => removeFile(f.id)} className="text-gray-400 hover:text-red-500">
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 동의 체크박스 */}
                    <div className="space-y-2 py-2">
                      {[
                        { state: agree1, set: setAgree1, text: '입력하신 정보는 프로젝트 관리 서비스 제공 목적에만 사용되는 것에 동의합니다.' },
                        { state: agree2, set: setAgree2, text: '파트너사의 확인 및 동의 후 계약이 완료됩니다.' },
                        { state: agree3, set: setAgree3, text: '계약이 확정되면 이후 수정은 불가능합니다.' },
                      ].map(({ state, set, text }, i) => (
                        <label key={i} className="flex items-start gap-2 cursor-pointer">
                          <Checkbox checked={state} onCheckedChange={v => set(!!v)} disabled={isReadonly} className="mt-0.5" />
                          <span className="text-sm text-gray-600">{text}</span>
                        </label>
                      ))}
                    </div>

                    {/* 하단 버튼 */}
                    <div className="pt-2 space-y-2">
                      {/* 비활성 미리보기 */}
                      <div className="flex gap-2">
                        <button disabled className="flex-1 py-2 text-sm text-gray-400 bg-gray-100 rounded-full cursor-not-allowed">임시저장</button>
                        <button disabled className="flex-1 py-2 text-sm text-gray-400 bg-gray-100 rounded-full cursor-not-allowed">인정부서 계약 협의 요청</button>
                        <button disabled className="flex-1 py-2 text-sm text-gray-400 bg-gray-100 rounded-full cursor-not-allowed">계약취소</button>
                        <button disabled className="flex-1 py-2 text-sm text-gray-400 bg-gray-100 rounded-full cursor-not-allowed">계약등록</button>
                      </div>

                      {/* 활성 버튼 */}
                      {contractState !== 'registered' && (
                        <div className="flex gap-2">
                          <button className="btn-white flex-1 text-sm" onClick={handleSave}>임시저장</button>
                          <button className="btn-white flex-1 text-sm" onClick={handleInternalRequest}>인정부서 계약 협의 요청</button>
                          <button className="btn-white flex-1 text-sm" onClick={handleCancel}>계약취소</button>
                        </div>
                      )}

                      {contractState === 'draft' && (
                        <div className="flex gap-2">
                          <button className="btn-pink flex-1" onClick={handlePartnerRequest}>파트너사 계약 협의 요청</button>
                          <button disabled className="flex-1 py-2.5 text-sm text-gray-400 bg-gray-100 rounded-full cursor-not-allowed">계약등록</button>
                        </div>
                      )}

                      {contractState === 'requested' && (
                        <div className="flex gap-2">
                          <button disabled className="flex-1 py-2.5 text-sm text-gray-400 bg-gray-100 rounded-full cursor-not-allowed">파트너사 협의 요청 중</button>
                          <button className="btn-pink flex-1" onClick={handleRegister}>계약등록</button>
                        </div>
                      )}

                      {contractState === 'registered' && (
                        <button disabled className="w-full py-2.5 text-sm text-gray-400 bg-gray-100 rounded-full cursor-not-allowed">
                          계약 등록 완료
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
