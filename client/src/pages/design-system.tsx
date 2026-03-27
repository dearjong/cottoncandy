import Layout from "@/components/layout/layout";
import { ChevronRight, Bell, User, Menu, Check, X, Plus, Trash2, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import SelectionCard from "@/components/project-creation/selection-card";

function CodeBlock({ code, className = "" }: { code: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className={`relative bg-gray-100 rounded-lg p-4 ${className}`}>
      <button 
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1.5 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
      >
        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-500" />}
      </button>
      <code className="text-sm text-gray-700 whitespace-pre-wrap block">{code}</code>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12 pb-8 border-b border-gray-200">
      <h2 className="text-xl font-bold mb-6 text-gray-800">{title}</h2>
      {children}
    </section>
  );
}

function SubSection({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-2 text-gray-700">{title}</h3>
      {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}
      {children}
    </div>
  );
}

function TokenRow({ name, value, preview }: { name: string; value: string; preview?: React.ReactNode }) {
  return (
    <div className="flex items-center py-2 border-b border-gray-100 last:border-0">
      <div className="w-1/3">{preview}</div>
      <div className="w-1/3 text-sm text-gray-700">{value}</div>
      <div className="w-1/3 text-right">
        <code className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-500">{name}</code>
      </div>
    </div>
  );
}

export default function DesignSystem() {
  return (
    <Layout>
      <div className="page-container">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-center mb-4">Cotton Candy Design System</h1>
          <p className="text-center text-gray-500 mb-12">클래스명을 복사해서 바로 사용하세요</p>

          {/* ==================== FOUNDATION ==================== */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 pb-4 border-b-2 border-[#EA4C89]">1. Foundation</h2>

            {/* Colors */}
            <Section title="Colors">
              <SubSection title="Brand Colors" description="브랜드 컬러는 CTA, 강조, 링크에 사용">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-16 h-16 rounded-lg bg-[#EA4C89]"></div>
                  <div>
                    <p className="font-medium">Primary Pink</p>
                    <code className="text-sm text-gray-600">bg-[#EA4C89]</code>
                    <p className="text-xs text-gray-400 mt-1">#EA4C89 | var(--cotton-candy-pink)</p>
                  </div>
                </div>
              </SubSection>

              <SubSection title="Text Colors" description="텍스트 계층 구조">
                <div className="bg-gray-50 rounded-lg p-4">
                  <TokenRow name="text-gray-800 (#1f2937)" value="제목, 헤딩" preview={<span className="text-gray-800 font-bold">Heading</span>} />
                  <TokenRow name="text-gray-700 (#374151)" value="본문 텍스트" preview={<span className="text-gray-700">Body</span>} />
                  <TokenRow name="text-gray-500 (#6b7280)" value="보조 설명" preview={<span className="text-gray-500">Description</span>} />
                  <TokenRow name="text-gray-400 (#9ca3af)" value="플레이스홀더" preview={<span className="text-gray-400">Placeholder</span>} />
                  <TokenRow name="cotton-candy-pink (#EA4C89)" value="강조, 필수(*)" preview={<span className="cotton-candy-pink">*필수</span>} />
                </div>
              </SubSection>

              <SubSection title="Background Colors" description="배경 색상">
                <div className="bg-gray-50 rounded-lg p-4">
                  <TokenRow name="bg-white (#ffffff)" value="페이지 배경" preview={<div className="w-12 h-6 bg-white border rounded"></div>} />
                </div>
              </SubSection>
              
              <SubSection title="GNB (Global Navigation Bar)" description="헤더 네비게이션">
                <div className="space-y-4 mt-6 pt-4 border-t border-gray-200">
                  <div>
                    <div className="mb-3 text-[15px] text-gray-600">
                      <a className="inline-block hover:text-pink-600 transition-colors whitespace-nowrap px-2.5 pt-[3px] pb-[1px] rounded-md">GNB</a>
                    </div>
                    <div className="flex justify-between items-center">
                      <code className="text-sm text-gray-500">normal</code>
                      <span className="text-xs text-gray-400">15px / text-gray-600 (#4b5563) / px-2.5 pt-[3px] pb-[1px]</span>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <div className="mb-3 text-[15px] text-gray-600">
                      <a className="inline-block hover:text-pink-600 transition-colors whitespace-nowrap px-2.5 pt-[3px] pb-[1px] rounded-md text-pink-600">GNB</a>
                    </div>
                    <div className="flex justify-between items-center">
                      <code className="text-sm text-gray-500">hover</code>
                      <span className="text-xs text-gray-400">text-pink-600 (#db2777)</span>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <div className="mb-3 text-[15px] text-gray-600">
                      <a className="inline-block hover:text-pink-600 transition-colors whitespace-nowrap px-2.5 pt-[3px] pb-[1px] rounded-md text-pink-600 bg-gray-100">GNB</a>
                    </div>
                    <div className="flex justify-between items-center">
                      <code className="text-sm text-gray-500">selected</code>
                      <span className="text-xs text-gray-400">text-pink-600 (#db2777) / bg-gray-100 (#f3f4f6)</span>
                    </div>
                  </div>
                </div>
              </SubSection>
            </Section>

            {/* Typography */}
            <Section title="Typography">
              <SubSection title="Font Family">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-lg">NanumSquareRound</p>
                  <p className="text-sm text-gray-500 mt-1">전체 프로젝트 기본 폰트</p>
                </div>
              </SubSection>

              <SubSection title="Text Styles - 메인 화면" description="홈페이지, 랜딩페이지">
                <div className="space-y-4">
                  <div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3">"프로가 만드는 광고"</h1>
                    <div className="flex justify-between items-center mb-2">
                      <code className="text-sm text-gray-500">hero-title (타이틀)</code>
                      <span className="text-xs text-gray-400">font-bold (700) / text-gray-800 (#1f2937)</span>
                    </div>
                    <table className="w-full text-xs text-gray-500 border-t pt-2">
                      <tbody>
                        <tr><td className="py-1">default (0px~)</td><td>text-3xl = 30px</td></tr>
                        <tr><td className="py-1">sm (640px~)</td><td>text-4xl = 36px</td></tr>
                        <tr><td className="py-1">lg (1024px~)</td><td>text-5xl = 48px</td></tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="border-t pt-4">
                    <p className="text-lg sm:text-xl text-gray-600 mb-3">광고주는 선택만, 제작은 전문가가, 이 모든것이 무료!</p>
                    <div className="flex justify-between items-center mb-2">
                      <code className="text-sm text-gray-500">hero-subtitle (서브타이틀)</code>
                      <span className="text-xs text-gray-400">text-gray-600 (#4b5563)</span>
                    </div>
                    <table className="w-full text-xs text-gray-500 border-t pt-2">
                      <tbody>
                        <tr><td className="py-1">default (0px~)</td><td>text-lg = 18px</td></tr>
                        <tr><td className="py-1">sm (640px~)</td><td>text-xl = 20px</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </SubSection>
              
              <SubSection title="Text Styles - 서브 화면" description="프로젝트 생성 등 폼 페이지">
                <div className="space-y-4">
                  <div>
                    <p className="page-title !mb-3 !px-0">어떤 파트너를 찾고 계신가요?</p>
                    <div className="flex justify-between items-center mb-2">
                      <code className="text-sm text-gray-500">page-title (타이틀)</code>
                      <span className="text-xs text-gray-400">font-bold (700) / text-gray-800 (#1f2937)</span>
                    </div>
                    <table className="w-full text-xs text-gray-500 border-t pt-2">
                      <tbody>
                        <tr><td className="py-1">default (0px~)</td><td>text-xl = 20px</td></tr>
                        <tr><td className="py-1">sm (640px~)</td><td>text-2xl = 24px</td></tr>
                        <tr><td className="py-1">md (768px~)</td><td>text-3xl = 30px</td></tr>
                        <tr><td className="py-1">lg (1024px~)</td><td>text-4xl = 36px</td></tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="border-t pt-4">
                    <p className="page-subtitle !px-0 mb-3">휴대폰/ 이메일 인증만 하면, 전문 기업이 우르르 대기중~*</p>
                    <div className="flex justify-between items-center mb-2">
                      <code className="text-sm text-gray-500">page-subtitle (서브타이틀)</code>
                      <span className="text-xs text-gray-400">font-light (300) / text-gray-500 (#6b7280)</span>
                    </div>
                    <table className="w-full text-xs text-gray-500 border-t pt-2">
                      <tbody>
                        <tr><td className="py-1">default (0px~)</td><td>text-sm = 14px</td></tr>
                        <tr><td className="py-1">sm (640px~)</td><td>text-base = 16px</td></tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="border-t pt-4">
                    <p className="mb-3 text-sm text-gray-700">본문 텍스트 예시입니다.</p>
                    <div className="flex justify-between items-center">
                      <code className="text-sm text-gray-500">body (바디)</code>
                      <span className="text-xs text-gray-400">14px / text-gray-700 (#374151)</span>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <p className="project-description mb-3">※ 선택한 유형의 회원만 작성하신 내용을 열람 할 수 있습니다.</p>
                    <div className="flex justify-between items-center">
                      <code className="text-sm text-gray-500">project-description (바디-설명)</code>
                      <span className="text-xs text-gray-400">13px / font-weight (400) / rgba(0,0,0,0.5)</span>
                    </div>
                  </div>
                </div>
              </SubSection>
              
            </Section>

            {/* Spacing */}
            <Section title="Spacing">
              <SubSection title="Gap / Padding" description="Tailwind 기본 스페이싱 (4px 단위)">
                <div className="flex flex-wrap gap-6">
                  {[
                    { size: 'gap-1', px: '4px' },
                    { size: 'gap-2', px: '8px' },
                    { size: 'gap-3', px: '12px' },
                    { size: 'gap-4', px: '16px' },
                    { size: 'gap-6', px: '24px' },
                    { size: 'gap-8', px: '32px' },
                  ].map(({ size, px }) => (
                    <div key={size} className="text-center">
                      <div className="w-8 h-8 bg-[#EA4C89] mx-auto mb-2" style={{ width: px }}></div>
                      <code className="text-xs text-gray-600">{size}</code>
                      <p className="text-xs text-gray-400">{px}</p>
                    </div>
                  ))}
                </div>
              </SubSection>
            </Section>
          </div>

          {/* ==================== COMPONENTS ==================== */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 pb-4 border-b-2 border-[#EA4C89]">2. Components</h2>

            {/* Buttons */}
            <Section title="Buttons">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold mb-2">Primary Button</h4>
                  <code className="text-sm text-gray-600 bg-white px-2 py-1 rounded">btn-pink</code>
                  <div className="mt-4 mb-4">
                    <button className="btn-pink max-w-[200px]">다음</button>
                  </div>
                  <CodeBlock code={`<button className="btn-pink">다음</button>`} />
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold mb-2">Secondary Button</h4>
                  <code className="text-sm text-gray-600 bg-white px-2 py-1 rounded">btn-white</code>
                  <div className="mt-4 mb-4">
                    <button className="btn-white max-w-[200px]">이전</button>
                  </div>
                  <CodeBlock code={`<button className="btn-white">이전</button>`} />
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h4 className="font-semibold mb-2">Disabled State</h4>
                  <p className="text-xs text-gray-500 mb-2">실제 화면과 동일 (bg-white 배경)</p>
                  <div className="mt-4 mb-4 max-w-[300px]">
                    <Button className="btn-pink" disabled>다음</Button>
                  </div>
                  <CodeBlock code={`<Button className="btn-pink" disabled>다음</Button>`} />
                </div>
              </div>
            </Section>

            {/* Tabs */}
            <Section title="Tabs">
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-sm text-gray-500 mb-4">선택된 탭: bg-gray-100 / 미선택: bg-white border</p>
                <div className="flex gap-2 mb-4">
                  <button className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-900">선택됨</button>
                  <button className="px-4 py-2 bg-white rounded-lg text-sm font-medium text-gray-500 border border-gray-200">미선택</button>
                </div>
                <CodeBlock code={`{/* 선택된 탭 */}
<button className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-medium text-gray-900">
  선택됨
</button>

{/* 미선택 탭 */}
<button className="px-4 py-2 bg-white rounded-lg text-sm font-medium text-gray-500 border border-gray-200">
  미선택
</button>`} />
              </div>
            </Section>

            {/* Step Indicator */}
            <Section title="Step Indicator">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="step-indicator-container mb-4">
                  <button className="step-button step-button-active">1</button>
                  <button className="step-button step-button-inactive">2</button>
                  <button className="step-button step-button-inactive">3</button>
                  <button className="step-button step-button-disabled">4</button>
                </div>
                <div className="text-sm space-y-1 mb-4">
                  <p><code className="text-gray-600">step-button-active</code> - 현재 단계</p>
                  <p><code className="text-gray-600">step-button-inactive</code> - 완료된 단계 (클릭 가능)</p>
                  <p><code className="text-gray-600">step-button-disabled</code> - 미방문 단계</p>
                </div>
                <CodeBlock code={`<div className="step-indicator-container">
  <button className="step-button step-button-active">1</button>
  <button className="step-button step-button-inactive">2</button>
  <button className="step-button step-button-disabled">3</button>
</div>`} />
              </div>
            </Section>

            {/* Icons */}
            <Section title="Icons">
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-sm text-gray-500 mb-4">Lucide React 사용 | 기본 크기: w-6 h-6 (24px) | 색상: text-[#555555]</p>
                <div className="flex gap-6 mb-4">
                  <div className="text-center">
                    <ChevronRight className="w-6 h-6 text-[#555555] mx-auto" />
                    <p className="text-xs mt-1">ChevronRight</p>
                  </div>
                  <div className="text-center">
                    <Bell className="w-6 h-6 text-[#555555] mx-auto" />
                    <p className="text-xs mt-1">Bell</p>
                  </div>
                  <div className="text-center">
                    <User className="w-6 h-6 text-[#555555] mx-auto" />
                    <p className="text-xs mt-1">User</p>
                  </div>
                  <div className="text-center">
                    <Check className="w-6 h-6 text-[#555555] mx-auto" />
                    <p className="text-xs mt-1">Check</p>
                  </div>
                  <div className="text-center">
                    <X className="w-6 h-6 text-[#555555] mx-auto" />
                    <p className="text-xs mt-1">X</p>
                  </div>
                </div>
                <CodeBlock code={`import { Bell, User, Check } from "lucide-react";

<Bell className="w-6 h-6 text-[#555555]" />`} />
              </div>
            </Section>

            {/* Loading */}
            <Section title="Loading Spinner">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex gap-8 items-end mb-4">
                  <div className="text-center">
                    <div className="spinner spinner-sm mb-2"></div>
                    <code className="text-xs text-gray-600">spinner-sm</code>
                  </div>
                  <div className="text-center">
                    <div className="spinner spinner-md mb-2"></div>
                    <code className="text-xs text-gray-600">spinner-md</code>
                  </div>
                  <div className="text-center">
                    <div className="spinner spinner-lg mb-2"></div>
                    <code className="text-xs text-gray-600">spinner-lg</code>
                  </div>
                </div>
                <CodeBlock code={`<div className="spinner spinner-md"></div>`} />
              </div>
            </Section>
          </div>

          {/* ==================== PATTERNS ==================== */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 pb-4 border-b-2 border-[#EA4C89]">3. Patterns</h2>

            {/* Required Field */}
            <Section title="Required Field Indicator">
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-sm text-gray-500 mb-4">필수 입력 필드 앞에 빨간 별표(*) 표시</p>
                <div className="space-y-3 mb-4">
                  <span className="project-section-title">
                    <span className="cotton-candy-pink">*</span> 프로젝트명
                  </span>
                </div>
                <CodeBlock code={`<span className="project-section-title">
  <span className="cotton-candy-pink">*</span> 프로젝트명
</span>`} />
              </div>
            </Section>

            {/* Form Section */}
            <Section title="Form Section">
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-sm text-gray-500 mb-4">입력 폼 섹션 레이아웃</p>
                <div className="bg-white p-4 rounded-lg mb-4">
                  <div className="project-section">
                    <span className="project-section-title">
                      <span className="cotton-candy-pink">*</span> 프로젝트명
                    </span>
                    <input 
                      type="text" 
                      placeholder="ex) [한국전자] 가전제품 런칭 프로모션"
                      className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
                <CodeBlock code={`<div className="project-section">
  <span className="project-section-title">
    <span className="cotton-candy-pink">*</span> 프로젝트명
  </span>
  <input 
    type="text" 
    placeholder="ex) [한국전자] 가전제품 런칭"
    className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg"
  />
</div>`} />
              </div>
            </Section>

            {/* Selection Card */}
            <Section title="Selection Card">
              <SubSection title="unified-card" description="광고제작 의뢰하기 Step1에서 실제 사용">
                <p className="text-sm text-gray-500 mb-4">사용처: /create-project/step1 (request-style.tsx)</p>
                
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <SelectionCard
                    id="public"
                    title="공개 프로젝트로 등록"
                    subtitle="무료"
                    description="등록된 공고를 보고\n전문 기업이 참여 신청합니다."
                    icon="custom-public"
                    bgColor="bg-cotton-light-pink"
                    iconColor="text-pink-600"
                    isSelected={false}
                    onClick={() => {}}
                  />
                  <SelectionCard
                    id="private"
                    title="1:1 비공개 의뢰"
                    subtitle="무료"
                    description="AI가 추천 기업 or\n내가 원하는 기업에 직접 의뢰"
                    icon="custom-robot"
                    bgColor="bg-cotton-light-blue"
                    iconColor="text-blue-600"
                    isSelected={false}
                    onClick={() => {}}
                  />
                  <SelectionCard
                    id="consulting"
                    title="컨설턴트에게 맡길래요"
                    subtitle="20만원부터~"
                    description="간단상담, 기업매칭,\nOT, PT까지 관리"
                    icon="custom-lock"
                    bgColor="bg-cotton-gray"
                    iconColor="text-gray-400"
                    isSelected={true}
                    onClick={() => {}}
                  />
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">Card Container</p>
                  <table className="w-full text-xs text-gray-500 mb-4">
                    <tbody>
                      <tr className="border-b"><td className="py-2 w-40">unified-card</td><td>rounded-2xl / shadow-lg / border: 1px solid #e5e7eb / padding: 2rem 2rem 1.25rem</td></tr>
                      <tr className="border-b"><td className="py-2">unified-card:hover</td><td>border: 3px solid #EA4C89</td></tr>
                      <tr><td className="py-2">unified-card-selected</td><td>background: #EE70A1 / border: #EE70A1</td></tr>
                    </tbody>
                  </table>
                  
                  <p className="text-sm font-medium text-gray-700 mb-3">Card Typography</p>
                  <table className="w-full text-xs text-gray-500">
                    <tbody>
                      <tr className="border-b"><td className="py-2 w-40">unified-card-title</td><td>17px / font-bold (700) / #363D49</td></tr>
                      <tr className="border-b"><td className="py-2">unified-card-subtitle</td><td>14px / font-medium (500) / text-pink-600 (#db2777)</td></tr>
                      <tr className="border-b"><td className="py-2">unified-card-description</td><td>14px / font-weight (300) / #818898</td></tr>
                      <tr><td className="py-2">unified-card-icon</td><td>80px x 80px</td></tr>
                    </tbody>
                  </table>
                </div>
              </SubSection>
            </Section>
          </div>

          {/* ==================== LAYOUT ==================== */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 pb-4 border-b-2 border-[#EA4C89]">4. Layout</h2>

            {/* Page Container */}
            <Section title="Page Containers">
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold mb-2">프로젝트 생성 페이지</h4>
                  <p className="text-sm text-gray-500 mb-2">사용: /create-project/step1 ~ step18</p>
                  <CodeBlock code={`<div className="page-container">
  <div className="page-content">
    {/* 콘텐츠 */}
  </div>
</div>`} />
                  <div className="mt-4 text-sm">
                    <p><code className="text-gray-600">page-container</code>: py-8 sm:py-12 md:py-20 bg-white</p>
                    <p><code className="text-gray-600">page-content</code>: max-w-4xl mx-auto px-4~16</p>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold mb-2">Work 페이지</h4>
                  <p className="text-sm text-gray-500 mb-2">사용: /work/home, /work/projects 등</p>
                  <CodeBlock code={`<div className="work-container">
  <div className="work-content">
    {/* 콘텐츠 */}
  </div>
</div>`} />
                  <div className="mt-4 text-sm">
                    <p><code className="text-gray-600">work-container</code>: min-h-screen bg-white py-8</p>
                    <p><code className="text-gray-600">work-content</code>: max-w-7xl mx-auto px-4~8</p>
                  </div>
                </div>
              </div>
            </Section>

            {/* Breakpoints */}
            <Section title="Breakpoints">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'sm', value: '640px' },
                  { name: 'md', value: '768px' },
                  { name: 'lg', value: '1024px' },
                  { name: 'xl', value: '1280px' },
                ].map(({ name, value }) => (
                  <div key={name} className="bg-gray-50 rounded-lg p-4 text-center">
                    <code className="text-xl font-bold text-[#EA4C89]">{name}:</code>
                    <p className="text-sm text-gray-600 mt-1">{value}+</p>
                  </div>
                ))}
              </div>
            </Section>
          </div>

          {/* Quick Reference */}
          <div className="bg-gray-900 rounded-lg p-6 text-white">
            <h2 className="text-xl font-bold mb-4">Quick Reference</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400 mb-2">자주 쓰는 버튼</p>
                <code className="text-green-400">btn-pink</code>, <code className="text-green-400">btn-white</code>
              </div>
              <div>
                <p className="text-gray-400 mb-2">필수값 표기</p>
                <code className="text-green-400">&lt;span className="cotton-candy-pink"&gt;*&lt;/span&gt;</code>
              </div>
              <div>
                <p className="text-gray-400 mb-2">페이지 레이아웃</p>
                <code className="text-green-400">page-container</code> + <code className="text-green-400">page-content</code>
              </div>
              <div>
                <p className="text-gray-400 mb-2">Work 레이아웃</p>
                <code className="text-green-400">work-container</code> + <code className="text-green-400">work-content</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
