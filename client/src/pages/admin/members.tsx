import { MemberManagement } from "@/components/admin/member-management"
import { PageHeader } from "@/components/admin/page-header"

export default function MembersPage() {
  return (
    <div className="space-y-6 p-6">
      <PageHeader title="회원 관리" description="플랫폼 회원을 관리하고 권한을 설정하세요" />
      
      <MemberManagement />
    </div>
  )
}