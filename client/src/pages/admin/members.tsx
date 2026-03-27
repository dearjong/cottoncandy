import { MemberManagement } from "@/components/admin/member-management"

export default function MembersPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">회원 관리</h1>
        <p className="text-muted-foreground">플랫폼 회원을 관리하고 권한을 설정하세요</p>
      </div>
      
      <MemberManagement />
    </div>
  )
}