import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Link } from "wouter"
import { Eye, EyeOff, Building, Users, Palette } from "lucide-react"

type UserType = 'advertiser' | 'agency' | 'production'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [userType, setUserType] = useState<UserType>('advertiser')
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Login attempt:', { ...loginData, userType })
    // TODO: 실제 로그인 API 호출
  }

  const selectedUserTypeInfo = userTypes.find(type => type.value === userType)!

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* 로고 및 헤더 */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">CreativeMatch</h1>
          <p className="text-muted-foreground">창의적인 프로젝트 매칭 플랫폼</p>
        </div>

        {/* 사용자 타입 선택 */}
        <Card data-testid="card-user-type-selection">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">어떤 역할로 로그인하시겠어요?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
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
                  data-testid={`button-user-type-${type.value}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${type.color} text-white`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium">{type.label}</div>
                      <div className="text-sm text-muted-foreground">{type.description}</div>
                    </div>
                    {userType === type.value && (
                      <Badge variant="default" className="ml-auto">선택됨</Badge>
                    )}
                  </div>
                </button>
              )
            })}
          </CardContent>
        </Card>

        {/* 로그인 폼 */}
        <Card data-testid="card-login-form">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <selectedUserTypeInfo.icon className="h-5 w-5" />
              {selectedUserTypeInfo.label} 로그인
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="이메일을 입력하세요"
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  data-testid="input-email"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="비밀번호를 입력하세요"
                    value={loginData.password}
                    onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                    data-testid="input-password"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    data-testid="button-toggle-password"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                data-testid="button-login"
              >
                로그인
              </Button>
            </form>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <Link href="/forgot-password">
                  <Button variant="link" className="p-0 h-auto text-sm" data-testid="link-forgot-password">
                    비밀번호를 잊으셨나요?
                  </Button>
                </Link>
              </div>
              
              <div className="text-center text-sm text-muted-foreground">
                아직 계정이 없으신가요?{" "}
                <Link href="/signup">
                  <Button variant="link" className="p-0 h-auto text-sm" data-testid="link-signup">
                    회원가입
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 푸터 */}
        <div className="text-center text-xs text-muted-foreground">
          © 2024 CreativeMatch. All rights reserved.
        </div>
      </div>
    </div>
  )
}