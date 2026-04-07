import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogFooter 
} from "@/components/ui/dialog"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  UserPlus, 
  Shield,
  Clock,
  Database,
  Bell,
  Lock
} from "lucide-react"

interface AdminUser {
  id: string
  name: string
  email: string
  role: 'super' | 'admin' | 'manager'
  isActive: boolean
  lastLogin: string
  createdAt: string
}

interface UserLog {
  id: string
  user: string
  action: string
  target: string
  timestamp: string
  ipAddress: string
  status: 'success' | 'failed'
}

export function AdminSettings({ section = "admins" }: { section?: "admins" | "platform" | "logs" }) {
  const [newAdmin, setNewAdmin] = useState({
    name: '',
    email: '',
    role: 'admin'
  })

  const [platformSettings, setPlatformSettings] = useState({
    maintenanceMode: false,
    registrationOpen: true,
    autoApproval: false,
    emailNotifications: true,
    smsNotifications: false
  })

  // TODO: remove mock data - replace with real API data
  const adminUsers: AdminUser[] = [
    {
      id: "ADM-001",
      name: "김관리자",
      email: "admin@platform.co.kr",
      role: "super",
      isActive: true,
      lastLogin: "2024-06-15 14:30",
      createdAt: "2024-01-01"
    },
    {
      id: "ADM-002",
      name: "이매니저",
      email: "manager@platform.co.kr",
      role: "admin",
      isActive: true,
      lastLogin: "2024-06-15 09:45",
      createdAt: "2024-02-15"
    },
    {
      id: "ADM-003",
      name: "박운영자",
      email: "operator@platform.co.kr",
      role: "manager",
      isActive: false,
      lastLogin: "2024-06-10 16:20",
      createdAt: "2024-03-01"
    }
  ]

  const userLogs: UserLog[] = [
    {
      id: "LOG-001",
      user: "김관리자",
      action: "프로젝트 승인",
      target: "PID-20240615-0001",
      timestamp: "2024-06-15 14:30",
      ipAddress: "192.168.1.100",
      status: "success"
    },
    {
      id: "LOG-002",
      user: "이매니저",
      action: "회원 승인",
      target: "MEM-002",
      timestamp: "2024-06-15 13:20",
      ipAddress: "192.168.1.101",
      status: "success"
    },
    {
      id: "LOG-003",
      user: "박운영자",
      action: "로그인 시도",
      target: "시스템",
      timestamp: "2024-06-15 12:15",
      ipAddress: "192.168.1.102",
      status: "failed"
    }
  ]

  const getRoleBadge = (role: AdminUser['role']) => {
    const variants = {
      'super': 'default',
      'admin': 'secondary', 
      'manager': 'outline'
    }
    const labels = {
      'super': '슈퍼 관리자',
      'admin': '관리자',
      'manager': '매니저'
    }
    return { variant: variants[role] as any, label: labels[role] }
  }

  const handleCreateAdmin = () => {
    console.log('Creating admin:', newAdmin)
    // TODO: replace with real API call
    setNewAdmin({ name: '', email: '', role: 'admin' })
  }

  const handleToggleUserStatus = (userId: string) => {
    console.log(`Toggling user status: ${userId}`)
    // TODO: replace with real API call
  }

  const handlePlatformSettingChange = (setting: string, value: boolean) => {
    setPlatformSettings(prev => ({ ...prev, [setting]: value }))
    console.log(`Platform setting ${setting} changed to ${value}`)
    // TODO: replace with real API call
  }

  const showAdmins = section === "admins"
  const showPlatform = section === "platform"
  const showLogs = section === "logs"
  const sectionTitle =
    section === "admins"
      ? "관리자 계정"
      : section === "platform"
        ? "플랫폼 설정"
        : "사용자 로그"

  return (
    <div className="space-y-6">
      <Card data-testid="card-admin-settings">
        <CardHeader>
          <CardTitle>{sectionTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {showAdmins && (
              <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">관리자 계정 관리</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button data-testid="button-create-admin">
                      <UserPlus className="h-4 w-4 mr-2" />
                      새 관리자 계정
                    </Button>
                  </DialogTrigger>
                  <DialogContent data-testid="dialog-create-admin">
                    <DialogHeader>
                      <DialogTitle>새 관리자 계정 생성</DialogTitle>
                      <DialogDescription>새로운 관리자 계정을 생성하고 권한을 부여하세요</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">이름</label>
                        <Input
                          placeholder="관리자 이름을 입력하세요"
                          value={newAdmin.name}
                          onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
                          data-testid="input-admin-name"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">이메일</label>
                        <Input
                          type="email"
                          placeholder="관리자 이메일을 입력하세요"
                          value={newAdmin.email}
                          onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
                          data-testid="input-admin-email"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">권한</label>
                        <Select 
                          value={newAdmin.role} 
                          onValueChange={(value) => setNewAdmin({...newAdmin, role: value})}
                        >
                          <SelectTrigger data-testid="select-admin-role">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">관리자</SelectItem>
                            <SelectItem value="manager">매니저</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button 
                        onClick={handleCreateAdmin}
                        data-testid="button-save-admin"
                      >
                        계정 생성
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>관리자</TableHead>
                      <TableHead>권한</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead>최근 로그인</TableHead>
                      <TableHead>생성일</TableHead>
                      <TableHead>액션</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adminUsers.map((admin) => {
                      const roleBadge = getRoleBadge(admin.role)
                      return (
                        <TableRow key={admin.id} data-testid={`row-admin-${admin.id}`}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src="" alt={admin.name} />
                                <AvatarFallback>{admin.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{admin.name}</div>
                                <div className="text-xs text-muted-foreground">{admin.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={roleBadge.variant}>
                              <Shield className="h-3 w-3 mr-1" />
                              {roleBadge.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Switch 
                                checked={admin.isActive}
                                onCheckedChange={() => handleToggleUserStatus(admin.id)}
                                data-testid={`switch-admin-${admin.id}`}
                              />
                              <span className="text-sm">
                                {admin.isActive ? '활성' : '비활성'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{admin.lastLogin}</TableCell>
                          <TableCell className="text-sm">{admin.createdAt}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                data-testid={`button-edit-admin-${admin.id}`}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              {admin.role !== 'super' && (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  data-testid={`button-delete-admin-${admin.id}`}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
            )}

            {showPlatform && (
            <div className="space-y-4">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      시스템 설정
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <label className="text-sm font-medium">점검 모드</label>
                        <p className="text-xs text-muted-foreground">
                          점검 모드 활성화 시 일반 사용자 접속이 제한됩니다
                        </p>
                      </div>
                      <Switch 
                        checked={platformSettings.maintenanceMode}
                        onCheckedChange={(value) => handlePlatformSettingChange('maintenanceMode', value)}
                        data-testid="switch-maintenance-mode"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <label className="text-sm font-medium">회원 가입 허용</label>
                        <p className="text-xs text-muted-foreground">
                          신규 회원 가입을 허용합니다
                        </p>
                      </div>
                      <Switch 
                        checked={platformSettings.registrationOpen}
                        onCheckedChange={(value) => handlePlatformSettingChange('registrationOpen', value)}
                        data-testid="switch-registration-open"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <label className="text-sm font-medium">자동 승인</label>
                        <p className="text-xs text-muted-foreground">
                          특정 조건을 만족하는 프로젝트를 자동으로 승인합니다
                        </p>
                      </div>
                      <Switch 
                        checked={platformSettings.autoApproval}
                        onCheckedChange={(value) => handlePlatformSettingChange('autoApproval', value)}
                        data-testid="switch-auto-approval"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      알림 설정
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <label className="text-sm font-medium">이메일 알림</label>
                        <p className="text-xs text-muted-foreground">
                          이메일을 통한 알림 발송을 활성화합니다
                        </p>
                      </div>
                      <Switch 
                        checked={platformSettings.emailNotifications}
                        onCheckedChange={(value) => handlePlatformSettingChange('emailNotifications', value)}
                        data-testid="switch-email-notifications"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <label className="text-sm font-medium">SMS 알림</label>
                        <p className="text-xs text-muted-foreground">
                          SMS를 통한 알림 발송을 활성화합니다
                        </p>
                      </div>
                      <Switch 
                        checked={platformSettings.smsNotifications}
                        onCheckedChange={(value) => handlePlatformSettingChange('smsNotifications', value)}
                        data-testid="switch-sms-notifications"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            )}

            {showLogs && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">사용자 활동 로그</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Database className="h-4 w-4 mr-2" />
                      로그 백업
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      오래된 로그 삭제
                    </Button>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>사용자</TableHead>
                        <TableHead>액션</TableHead>
                        <TableHead>대상</TableHead>
                        <TableHead>시간</TableHead>
                        <TableHead>IP 주소</TableHead>
                        <TableHead>상태</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {userLogs.map((log) => (
                        <TableRow key={log.id} data-testid={`row-log-${log.id}`}>
                          <TableCell className="font-medium">{log.user}</TableCell>
                          <TableCell>{log.action}</TableCell>
                          <TableCell className="font-mono text-sm">{log.target}</TableCell>
                          <TableCell className="text-sm">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {log.timestamp}
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{log.ipAddress}</TableCell>
                          <TableCell>
                            <Badge variant={log.status === 'success' ? 'default' : 'destructive'}>
                              {log.status === 'success' ? '성공' : '실패'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}