import { useState } from 'react';
import Layout from '@/components/layout/layout';
import WorkSidebar from '@/components/work/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { MessageSquare, Mail, FileText, Send } from 'lucide-react';

const MOCK_COMPANIES = [
  'HS애드', '이노션', '위더스애드', '제일기획', '에이엘', 'TBWA', '파일원',
  '대학내일', 'BBQ코리아', '금강오길비', '미쓰윤', '레오버넷', '밴드앤링크', '저스트빌더', '제이포디',
];

const MOCK_ATTACHMENTS = [
  { name: '[HSAD] 비밀유지 서약서 2025.pdf', date: '2024-04-06' },
  { name: 'OT자료 2025.pdf', date: '2024-04-06' },
];

export default function WorkProjectOtGuide() {
  const [placeType, setPlaceType] = useState<'online' | 'offline'>('online');
  const [schedulePeriod, setSchedulePeriod] = useState<'am' | 'pm'>('am');
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [channelMessage, setChannelMessage] = useState(false);

  const toggleCompany = (name: string) => {
    setSelectedCompanies((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };
  const [channelSms, setChannelSms] = useState(false);
  const [channelKakao, setChannelKakao] = useState(false);
  const [channelEmail, setChannelEmail] = useState(false);

  return (
    <Layout>
      <div className="work-container">
        <div className="work-content">
          <div className="flex gap-6">
            <WorkSidebar />
            <div className="flex-1">
              <h1 className="work-title">OT 안내</h1>

              <div className="bg-white rounded-lg shadow-sm mt-6 overflow-hidden">
                {/* 제목 */}
                <div className="px-6 py-4 border-b border-gray-100">
                  <Label className="text-gray-500 text-sm">제목</Label>
                  <Input
                    defaultValue="스탠바이미2 판매촉진 프로모션 OT참여 안내드립니다."
                    className="mt-1 border-0 px-0 font-medium focus-visible:ring-0"
                    data-testid="ot-guide-title"
                  />
                </div>

                {/* 기업선택 (버튼 형태, 다중 선택) */}
                <div className="px-6 py-4 border-b border-gray-100">
                  <Label className="text-gray-500 text-sm block mb-3">기업선택</Label>
                  <div className="flex flex-wrap gap-2">
                    {MOCK_COMPANIES.map((name) => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => toggleCompany(name)}
                        className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors ${
                          selectedCompanies.includes(name)
                            ? 'bg-gray-800 text-white border-gray-800'
                            : 'bg-white text-gray-700 border-input hover:bg-gray-50'
                        }`}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 일정 */}
                <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap items-end gap-4">
                  <div className="flex-1 min-w-[140px]">
                    <Label className="text-gray-500 text-sm">일정</Label>
                    <Input type="date" defaultValue="2025-10-15" className="mt-1" />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setSchedulePeriod('am')}
                      className={`px-4 py-2 rounded text-sm ${schedulePeriod === 'am' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                      오전
                    </button>
                    <button
                      type="button"
                      onClick={() => setSchedulePeriod('pm')}
                      className={`px-4 py-2 rounded text-sm ${schedulePeriod === 'pm' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600'}`}
                    >
                      오후
                    </button>
                  </div>
                </div>

                {/* 장소 */}
                <div className="px-6 py-4 border-b border-gray-100 space-y-4">
                  <div className="flex items-center gap-4">
                    <Label className="text-gray-500 text-sm">장소</Label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setPlaceType('online')}
                        className={`px-4 py-2 rounded text-sm ${placeType === 'online' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600'}`}
                      >
                        온라인
                      </button>
                      <button
                        type="button"
                        onClick={() => setPlaceType('offline')}
                        className={`px-4 py-2 rounded text-sm ${placeType === 'offline' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600'}`}
                      >
                        오프라인
                      </button>
                    </div>
                  </div>
                  {placeType === 'online' ? (
                    <div>
                      <Label className="text-gray-500 text-sm">온라인 URL</Label>
                      <Input
                        defaultValue="https://meet.google.com/xvt-rzpt-sua"
                        className="mt-1"
                        placeholder="https://..."
                      />
                    </div>
                  ) : (
                    <div>
                      <Label className="text-gray-500 text-sm">주소</Label>
                      <div className="flex gap-2 mt-1">
                        <Input placeholder="주소검색" className="flex-1" />
                        <Button variant="outline" size="sm">검색</Button>
                      </div>
                      <Input
                        defaultValue="영등포구 여의대로 128 베스트전자 본사 5층 대회의실"
                        className="mt-2"
                        placeholder="상세 주소"
                      />
                    </div>
                  )}
                </div>

                {/* 내용 */}
                <div className="px-6 py-4 border-b border-gray-100">
                  <Label className="text-gray-500 text-sm">내용</Label>
                  <Textarea
                    className="mt-2 min-h-[180px] resize-y"
                    defaultValue={`안녕하세요. 베스트전자 광고기획팀입니다.
이번 [스탠바이미2 판매촉진 프로모션] 프로젝트에 비딩으로 관심을 보내주셔서 진심으로 감사드립니다.
프로젝트의 방향성과 주요 요구사항을 공유드리고, 향후 제안서 제출에 앞서 기대하는 부분을 명확히 전달드리기 위해 아래와 같이 OT를 진행하고자 합니다.`}
                  />
                </div>

                {/* 📌 OT 안내 요약 박스 */}
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/80">
                  <h3 className="font-semibold text-gray-800 mb-3">📌 OT 안내</h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li><span className="text-gray-500">프로젝트명:</span> 스탠바이미2 판매촉진 프로모션</li>
                    <li><span className="text-gray-500">주최:</span> 베스트전자</li>
                    <li><span className="text-gray-500">일시:</span> 2025년 6월 10일(화) 오전 10시</li>
                    <li><span className="text-gray-500">방식:</span> 온라인 Google Meeting / 링크 발송</li>
                    <li className="pt-2"><span className="text-gray-500">주요 내용:</span></li>
                    <li className="list-disc list-inside">프로모션 방향성 및 핵심 메시지</li>
                    <li className="list-disc list-inside">예산 구간 및 집행 범위 안내</li>
                    <li className="list-disc list-inside">제안서 제출 일정 및 가이드라인 공유</li>
                    <li className="list-disc list-inside">광고주의 주요 기대사항 정리</li>
                    <li className="list-disc list-inside">질의응답</li>
                    <li className="pt-2 text-amber-700">※ OT 참석은 향후 제안/PT 절차 진행을 위한 필수 단계입니다.</li>
                  </ul>
                </div>

                {/* 📨 참석 여부 회신 */}
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-800 mb-3">📨 참석 여부 회신</h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li><span className="text-gray-500">회신 기한:</span> 2025년 6월 7일(토)까지</li>
                    <li><span className="text-gray-500">회신 방법:</span> ADMarket 메시지함 또는 이메일 (marketing@lge.co.kr)</li>
                  </ul>
                  <p className="mt-3 text-sm text-gray-600">
                    소중한 시간을 내어 OT에 참석해주시길 부탁드리며, 본 프로젝트를 통해 함께하게 되기를 기대합니다.<br />
                    감사합니다.<br />
                    베스트전자 광고기획팀
                  </p>
                </div>

                {/* 담당자 */}
                <div className="px-6 py-4 border-b border-gray-100">
                  <Label className="text-gray-500 text-sm">담당자</Label>
                  <div className="mt-2 flex flex-wrap gap-6">
                    <div>
                      <span className="text-gray-500 text-sm">나해피 (선임)</span>
                      <div className="text-sm text-gray-600 mt-1">└ 전화 02-1234-5678</div>
                      <div className="text-sm text-gray-600">└ email iamhappy@dminusone.co.kr</div>
                    </div>
                  </div>
                </div>

                {/* OT안내자료 및 기타문서 */}
                <div className="px-6 py-4 border-b border-gray-100">
                  <Label className="text-gray-500 text-sm block mb-2">OT안내자료 및 기타문서 추가</Label>
                  <ul className="space-y-2">
                    {MOCK_ATTACHMENTS.map((f) => (
                      <li key={f.name} className="flex items-center gap-2 text-sm">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span>{f.name}</span>
                        <span className="text-gray-400">| {f.date}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" size="sm" className="mt-2">파일 추가</Button>
                </div>

                {/* 발송 채널 선택(체크박스) + 액션 버튼 */}
                <div className="px-6 py-4 flex flex-wrap items-center gap-6">
                  <div className="flex flex-wrap items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={channelMessage}
                        onCheckedChange={(v) => setChannelMessage(!!v)}
                      />
                      <MessageSquare className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">메세지함</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={channelSms}
                        onCheckedChange={(v) => setChannelSms(!!v)}
                      />
                      <span className="text-sm">문자</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={channelKakao}
                        onCheckedChange={(v) => setChannelKakao(!!v)}
                      />
                      <span className="text-sm">카카오톡</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={channelEmail}
                        onCheckedChange={(v) => setChannelEmail(!!v)}
                      />
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">이메일</span>
                    </label>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm">임시저장</Button>
                    <Button className="bg-pink-600 hover:bg-pink-700">
                      <Send className="w-4 h-4 mr-1" />
                      OT초대 메세지 발송
                    </Button>
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
