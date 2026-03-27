import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Link } from "wouter"
import { Eye, EyeOff, Building, Users, Palette, ArrowLeft } from "lucide-react"

type UserType = 'advertiser' | 'agency' | 'production'

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [userType, setUserType] = useState<UserType>('advertiser')
  const [agreementChecked, setAgreementChecked] = useState(false)

  const [signupData, setSignupData] = useState({
    // 기본 정보
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    
    // 회사/개인 정보  
    companyName: '',
    businessNumber: '',
    companySize: '',
    description: '',
    website: '',
    
    // 전문 분야 (제작사/대행사)
    specialties: [] as string[],
    portfolio: '',
  })

  const userTypes = [
    {
      value: 'advertiser',
      label: '광고주',
      description: '프로젝트를 의뢰하고 싶어요',
      icon: Building,
      color: 'bg-blue-500'
    },
    {
      value: 'agency',
      label: '대행사', 
      description: '프로젝트 관리와 매칭을 도와드려요',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      value: 'production',
      label: '제작사',
      description: '창의적인 콘텐츠를 제작해요',
      icon: Palette,
      color: 'bg-purple-500'
    }
  ]

  const companySizes = [
    { value: 'startup', label: '스타트업 (1-10명)' },
    { value: 'small', label: '소기업 (11-50명)' },
    { value: 'medium', label: '중기업 (51-300명)' },
    { value: 'large', label: '대기업 (300명 이상)' },
    { value: 'individual', label: '개인사업자' },
  ]

  const specialtyOptions = [
    '브랜드 영상', '광고 영상', '바이럴 영상', '제품 소개 영상',
    '기업 홍보 영상', 'SNS 콘텐츠', '애니메이션', '모션그래픽',
    '웹디자인', '앱디자인', '브랜딩', '패키지 디자인'
  ]

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Signup attempt:', { ...signupData, userType })
    // TODO: 실제 회원가입 API 호출
  }

  const toggleSpecialty = (specialty: string) => {
    setSignupData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }))
  }

  const selectedUserTypeInfo = userTypes.find(type => type.value === userType)!

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* 뒤로가기 및 헤더 */}
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" size="sm" data-testid="button-back-to-login">
              <ArrowLeft className="h-4 w-4 mr-2" />
              로그인으로 돌아가기
            </Button>
          </Link>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">회원가입</h1>
          <p className="text-muted-foreground">CreativeMatch와 함께 새로운 프로젝트를 시작하세요</p>
        </div>

        {/* 진행 단계 */}
        <div className="flex items-center justify-center space-x-4" data-testid="signup-progress">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step <= currentStep 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {step}
              </div>
              {step < 3 && (
                <div className={`w-12 h-0.5 ${
                  step < currentStep ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: 사용자 타입 선택 */}
        {currentStep === 1 && (
          <Card data-testid="signup-step-1">
            <CardHeader>
              <CardTitle>어떤 역할로 참여하시겠어요?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {userTypes.map((type) => {
                const Icon = type.icon
                return (
                  <button
                    key={type.value}
                    onClick={() => setUserType(type.value as UserType)}
                    className={`w-full p-4 rounded-lg border-2 transition-all hover-elevate ${
                      userType === type.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    data-testid={`button-signup-user-type-${type.value}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${type.color} text-white`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="text-left flex-1">
                        <div className="text-lg font-medium">{type.label}</div>
                        <div className="text-muted-foreground">{type.description}</div>
                      </div>
                      {userType === type.value && (
                        <Badge variant="default">선택됨</Badge>
                      )}
                    </div>
                  </button>
                )
              })}
              
              <Button onClick={handleNext} className="w-full" size="lg" data-testid="button-next-step-1">
                다음 단계
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: 기본 정보 */}
        {currentStep === 2 && (
          <Card data-testid="signup-step-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <selectedUserTypeInfo.icon className="h-5 w-5" />
                기본 정보를 입력해주세요
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">이름</Label>
                    <Input
                      id="name"
                      placeholder="이름을 입력하세요"
                      value={signupData.name}
                      onChange={(e) => setSignupData({...signupData, name: e.target.value})}
                      data-testid="input-signup-name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">연락처</Label>
                    <Input
                      id="phone"
                      placeholder="010-0000-0000"
                      value={signupData.phone}
                      onChange={(e) => setSignupData({...signupData, phone: e.target.value})}
                      data-testid="input-signup-phone"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="이메일을 입력하세요"
                    value={signupData.email}
                    onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                    data-testid="input-signup-email"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">비밀번호</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="비밀번호를 입력하세요"
                        value={signupData.password}
                        onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                        data-testid="input-signup-password"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                        data-testid="button-toggle-signup-password"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="비밀번호를 다시 입력하세요"
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                        data-testid="input-signup-confirm-password"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        data-testid="button-toggle-confirm-password"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={handlePrev} data-testid="button-prev-step-2">
                    이전
                  </Button>
                  <Button type="button" onClick={handleNext} className="flex-1" data-testid="button-next-step-2">
                    다음 단계
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Step 3: 상세 정보 */}
        {currentStep === 3 && (
          <Card data-testid="signup-step-3">
            <CardHeader>
              <CardTitle>상세 정보를 입력해주세요</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">회사명</Label>
                    <Input
                      id="companyName"
                      placeholder="회사명을 입력하세요"
                      value={signupData.companyName}
                      onChange={(e) => setSignupData({...signupData, companyName: e.target.value})}
                      data-testid="input-company-name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="businessNumber">사업자번호 (선택)</Label>
                    <Input
                      id="businessNumber"
                      placeholder="000-00-00000"
                      value={signupData.businessNumber}
                      onChange={(e) => setSignupData({...signupData, businessNumber: e.target.value})}
                      data-testid="input-business-number"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>회사 규모</Label>
                  <Select value={signupData.companySize} onValueChange={(value) => setSignupData({...signupData, companySize: value})}>
                    <SelectTrigger data-testid="select-company-size">
                      <SelectValue placeholder="회사 규모를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {companySizes.map((size) => (
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {(userType === 'agency' || userType === 'production') && (
                  <div className="space-y-2">
                    <Label>전문 분야</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {specialtyOptions.map((specialty) => (
                        <button
                          key={specialty}
                          type="button"
                          onClick={() => toggleSpecialty(specialty)}
                          className={`p-2 text-sm rounded-md border transition-colors ${
                            signupData.specialties.includes(specialty)
                              ? 'bg-primary text-primary-foreground border-primary'
                              : 'bg-background border-border hover:bg-muted'
                          }`}
                          data-testid={`button-specialty-${specialty.replace(/\s+/g, '-')}`}
                        >
                          {specialty}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="description">회사 소개</Label>
                  <Textarea
                    id="description"
                    placeholder="회사나 서비스에 대해 간단히 소개해주세요"
                    value={signupData.description}
                    onChange={(e) => setSignupData({...signupData, description: e.target.value})}
                    data-testid="textarea-company-description"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">웹사이트 (선택)</Label>
                  <Input
                    id="website"
                    placeholder="https://www.example.com"
                    value={signupData.website}
                    onChange={(e) => setSignupData({...signupData, website: e.target.value})}
                    data-testid="input-website"
                  />
                </div>

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agreement"
                    checked={agreementChecked}
                    onCheckedChange={(checked) => setAgreementChecked(checked === true)}
                    data-testid="checkbox-agreement"
                  />
                  <Label htmlFor="agreement" className="text-sm">
                    <Link href="/terms" className="text-primary hover:underline">이용약관</Link> 및{" "}
                    <Link href="/privacy" className="text-primary hover:underline">개인정보처리방침</Link>에 동의합니다
                  </Label>
                </div>

                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={handlePrev} data-testid="button-prev-step-3">
                    이전
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1" 
                    disabled={!agreementChecked}
                    data-testid="button-signup-submit"
                  >
                    회원가입 완료
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* 푸터 */}
        <div className="text-center text-xs text-muted-foreground">
          © 2024 CreativeMatch. All rights reserved.
        </div>
      </div>
    </div>
  )
}