import { useLocation } from "wouter";
import Layout from "@/components/layout/layout";
import StepBody from "@/components/project-creation/step-body";
import { Button } from "@/components/ui/button";
import { Edit, CheckCircle } from "lucide-react";

export default function ProjectDetailView() {
  const [, setLocation] = useLocation();

  // 저장된 데이터 불러오기
  const step1Selection = localStorage.getItem('step1Selection');
  const progressStage = localStorage.getItem('progressStage');
  const stageDetails = JSON.parse(localStorage.getItem('stageDetails') || '[]');

  const handleEditSection = (section: string) => {
    // 해당 입력 화면으로 바로 이동
    if (section === 'option') {
      setLocation('/create-project/step1');
    } else if (section === 'stage') {
      setLocation('/create-project/step2');
    }
  };

  return (
    <Layout>
      <StepBody
        title="광고 제작 의뢰 상세 정보"
        subtitle={
          <p className="page-subtitle">
            등록하신 의뢰 정보를 확인하고 수정할 수 있습니다.
          </p>
        }
      >
        {/* 의뢰 요약 */}
        <div className="max-w-[760px] mx-auto space-y-6">
          {/* 선택한 옵션 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="card-title flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                선택한 의뢰 방식
              </h2>
              <button
                onClick={() => handleEditSection('option')}
                className="btn-icon text-gray-600 hover:text-cotton-candy-pink"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
            <p className="text-gray-700">
              {step1Selection === 'public' && '공개 프로젝트로 등록'}
              {step1Selection === 'private' && '1:1 비공개 의뢰'}
              {step1Selection === 'consulting' && '컨설턴트에게 맡길래요'}
            </p>
          </div>

          {/* 진행 단계 */}
          {progressStage && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="card-title flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  진행 단계
                </h2>
                <button
                  onClick={() => handleEditSection('stage')}
                  className="btn-icon text-gray-600 hover:text-cotton-candy-pink"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              <p className="text-gray-700">{progressStage}</p>
              {stageDetails.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600">상세 단계:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    {stageDetails.map((detail: string) => (
                      <li key={detail} className="text-gray-700 text-sm">{detail}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* 액션 버튼 */}
          <div className="btn-group">
            <Button
              onClick={() => setLocation('/create-project/step1')}
              className="btn-secondary"
            >
              처음부터 다시 작성
            </Button>
            <Button
              onClick={() => {
                // 의뢰 제출 로직
                alert('의뢰가 제출되었습니다!');
              }}
              className="btn-primary"
            >
              의뢰 제출하기
            </Button>
          </div>
        </div>
      </StepBody>
    </Layout>
  );
}
