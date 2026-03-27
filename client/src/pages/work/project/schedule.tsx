import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { Schedule, InsertSchedule } from '@shared/schema';
import Layout from '@/components/layout/layout';
import WorkSidebar from '@/components/work/sidebar';
import ProjectButton from '@/components/common/project-button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ScheduleFormData {
  applicationDeadline: string;
  applicationResult: string;
  orientation: string;
  submissionDeadline: string;
  presentation: string;
  presentationResult: string;
  finalPlanSubmission: string;
  shootingDate: string;
  firstDelivery: string;
  finalDelivery: string;
  onAir: string;
}

export default function WorkProjectSchedule() {
  const { toast } = useToast();
  const [selectedProject, setSelectedProject] = useState('1');
  const [scheduleData, setScheduleData] = useState<ScheduleFormData>({
    applicationDeadline: '',
    applicationResult: '',
    orientation: '',
    submissionDeadline: '',
    presentation: '',
    presentationResult: '',
    finalPlanSubmission: '',
    shootingDate: '',
    firstDelivery: '',
    finalDelivery: '',
    onAir: '',
  });

  const projects = [
    { id: '1', title: '[베스트전자] TV 신제품 판매촉진 프로모션' },
    { id: '2', title: '[글로벌식품] 신제품 런칭 캠페인' },
    { id: '3', title: '[패션하우스] FW 시즌 브랜드 캠페인' },
  ];

  const { data: schedule, isLoading } = useQuery<Schedule | null>({
    queryKey: ['/api/schedules', selectedProject],
    queryFn: async () => {
      const res = await fetch(`/api/schedules/${selectedProject}`);
      if (!res.ok) {
        if (res.status === 404) {
          return null;
        }
        throw new Error('Failed to fetch schedule');
      }
      return res.json();
    },
    retry: false,
  });

  useEffect(() => {
    if (schedule) {
      setScheduleData({
        applicationDeadline: schedule.applicationDeadline || '',
        applicationResult: schedule.applicationResult || '',
        orientation: schedule.orientation || '',
        submissionDeadline: schedule.submissionDeadline || '',
        presentation: schedule.presentation || '',
        presentationResult: schedule.presentationResult || '',
        finalPlanSubmission: schedule.finalPlanSubmission || '',
        shootingDate: schedule.shootingDate || '',
        firstDelivery: schedule.firstDelivery || '',
        finalDelivery: schedule.finalDelivery || '',
        onAir: schedule.onAir || '',
      });
    } else {
      setScheduleData({
        applicationDeadline: '',
        applicationResult: '',
        orientation: '',
        submissionDeadline: '',
        presentation: '',
        presentationResult: '',
        finalPlanSubmission: '',
        shootingDate: '',
        firstDelivery: '',
        finalDelivery: '',
        onAir: '',
      });
    }
  }, [schedule]);

  const saveMutation = useMutation({
    mutationFn: async (data: ScheduleFormData) => {
      const schedulePayload: Partial<InsertSchedule> = {
        projectId: selectedProject,
        ...data,
      };

      if (schedule) {
        return apiRequest('PATCH', `/api/schedules/${selectedProject}`, schedulePayload);
      } else {
        return apiRequest('POST', '/api/schedules', schedulePayload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/schedules', selectedProject] });
      toast({
        title: '저장 완료',
        description: '일정이 성공적으로 저장되었습니다.',
      });
    },
    onError: () => {
      toast({
        title: '저장 실패',
        description: '일정 저장 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    },
  });

  const handleInputChange = (field: keyof ScheduleFormData, value: string) => {
    setScheduleData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCancel = () => {
    if (schedule) {
      setScheduleData({
        applicationDeadline: schedule.applicationDeadline || '',
        applicationResult: schedule.applicationResult || '',
        orientation: schedule.orientation || '',
        submissionDeadline: schedule.submissionDeadline || '',
        presentation: schedule.presentation || '',
        presentationResult: schedule.presentationResult || '',
        finalPlanSubmission: schedule.finalPlanSubmission || '',
        shootingDate: schedule.shootingDate || '',
        firstDelivery: schedule.firstDelivery || '',
        finalDelivery: schedule.finalDelivery || '',
        onAir: schedule.onAir || '',
      });
    } else {
      setScheduleData({
        applicationDeadline: '',
        applicationResult: '',
        orientation: '',
        submissionDeadline: '',
        presentation: '',
        presentationResult: '',
        finalPlanSubmission: '',
        shootingDate: '',
        firstDelivery: '',
        finalDelivery: '',
        onAir: '',
      });
    }
  };

  const handleSave = () => {
    saveMutation.mutate(scheduleData);
  };

  return (
    <Layout>
      <div className="work-container">
        <div className="work-content">
          <div className="flex gap-6">
            <WorkSidebar />
            
            <div className="flex-1">
              <div className="mb-6">
                <h1 className="work-title">일정관리</h1>
              </div>

              <div className="bg-white rounded-lg shadow-sm mb-6">
                <div className="px-6 py-4 border-b">
                  <div className="flex items-center justify-end">
                    <Select value={selectedProject} onValueChange={setSelectedProject}>
                      <SelectTrigger className="w-[400px]" data-testid="select-project">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {isLoading ? (
                  <div className="p-6 text-center text-gray-500">
                    일정을 불러오는 중...
                  </div>
                ) : (
                  <div className="p-6 space-y-8">
                    <div>
                      <h2 className="text-lg font-bold mb-4">1. 접수 및 선정 단계</h2>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 items-center">
                          <label className="text-gray-700">접수마감</label>
                          <input
                            type="text"
                            value={scheduleData.applicationDeadline}
                            onChange={(e) => handleInputChange('applicationDeadline', e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                            placeholder="2025.10.15"
                            data-testid="input-application-deadline"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4 items-center">
                          <label className="text-gray-700">접수결과 발표</label>
                          <input
                            type="text"
                            value={scheduleData.applicationResult}
                            onChange={(e) => handleInputChange('applicationResult', e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                            placeholder="2025.10.15"
                            data-testid="input-application-result"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4 items-center">
                          <label className="text-gray-700">OT (오리엔테이션)</label>
                          <input
                            type="text"
                            value={scheduleData.orientation}
                            onChange={(e) => handleInputChange('orientation', e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                            placeholder="2025.10.15"
                            data-testid="input-orientation"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4 items-center">
                          <label className="text-gray-700">제출자료마감</label>
                          <input
                            type="text"
                            value={scheduleData.submissionDeadline}
                            onChange={(e) => handleInputChange('submissionDeadline', e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                            placeholder="2025.10.15"
                            data-testid="input-submission-deadline"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4 items-center">
                          <label className="text-gray-700">PT (프레젠테이션)</label>
                          <input
                            type="text"
                            value={scheduleData.presentation}
                            onChange={(e) => handleInputChange('presentation', e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                            placeholder="2025.10.15"
                            data-testid="input-presentation"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4 items-center">
                          <label className="text-gray-700">PT 결과 발표</label>
                          <input
                            type="text"
                            value={scheduleData.presentationResult}
                            onChange={(e) => handleInputChange('presentationResult', e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                            placeholder="2025.10.15"
                            data-testid="input-presentation-result"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-lg font-bold mb-4">2. 기획 및 제작 단계</h2>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 items-center">
                          <label className="text-gray-700">최종기획안 제출</label>
                          <input
                            type="text"
                            value={scheduleData.finalPlanSubmission}
                            onChange={(e) => handleInputChange('finalPlanSubmission', e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                            placeholder="2025.10.15"
                            data-testid="input-final-plan"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4 items-center">
                          <label className="text-gray-700">촬영일</label>
                          <input
                            type="text"
                            value={scheduleData.shootingDate}
                            onChange={(e) => handleInputChange('shootingDate', e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                            placeholder="2025.10.15"
                            data-testid="input-shooting-date"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-lg font-bold mb-4">3. 납품 및 온에어 단계</h2>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 items-center">
                          <label className="text-gray-700">1차 납품</label>
                          <input
                            type="text"
                            value={scheduleData.firstDelivery}
                            onChange={(e) => handleInputChange('firstDelivery', e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                            placeholder="2025.10.15"
                            data-testid="input-first-delivery"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4 items-center">
                          <label className="text-gray-700">최종 납품</label>
                          <input
                            type="text"
                            value={scheduleData.finalDelivery}
                            onChange={(e) => handleInputChange('finalDelivery', e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                            placeholder="2025.10.15"
                            data-testid="input-final-delivery"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4 items-center">
                          <label className="text-gray-700">OnAir</label>
                          <input
                            type="text"
                            value={scheduleData.onAir}
                            onChange={(e) => handleInputChange('onAir', e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
                            placeholder="2025.10.15"
                            data-testid="input-onair"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-center gap-4 pt-6">
                      <ProjectButton
                        variant="white"
                        className="w-auto px-12"
                        onClick={handleCancel}
                        disabled={saveMutation.isPending}
                        data-testid="button-cancel"
                      >
                        취소
                      </ProjectButton>
                      <ProjectButton
                        variant="pink"
                        className="w-auto px-12"
                        onClick={handleSave}
                        disabled={saveMutation.isPending}
                        data-testid="button-save"
                      >
                        {saveMutation.isPending ? '저장 중...' : '변경내용 적용'}
                      </ProjectButton>
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
