import Layout from "@/components/layout/layout"
import WorkSidebar from "@/components/work/sidebar"
import { ProjectManagement } from "@/components/admin/project-management"
import { useLocation } from "wouter"

export default function WorkConsultingInquiries() {
  const [, navigate] = useLocation()

  return (
    <Layout>
      <div className="work-container">
        <div className="work-content">
          <div className="flex gap-6">
            <WorkSidebar />
            <div className="flex-1">
              <div className="mb-6">
                <h1 className="work-title">컨설팅 문의</h1>
              </div>

              <ProjectManagement
                filterType="컨설팅"
                onProjectClick={(id) => navigate(`/work/consulting-inquiries/detail?id=${id}`)}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
