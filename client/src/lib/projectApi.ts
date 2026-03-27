import { apiRequest } from "./queryClient";
import type { Project, ProjectData } from "@shared/schema";

// 현재 사용자 ID (자동 로그인 사용)
const CURRENT_USER_ID = "이꽃별";

// 프로젝트 데이터 캐시 (사용자별)
const projectCacheMap = new Map<string, Project>();

/**
 * 프로젝트 데이터 가져오기
 */
export async function getProject(userId: string = CURRENT_USER_ID): Promise<Project> {
  const cached = projectCacheMap.get(userId);
  if (cached) {
    return cached;
  }

  const res = await fetch(`/api/project/${userId}`, {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error(`Failed to get project: ${res.statusText}`);
  }

  const project = await res.json();
  projectCacheMap.set(userId, project);
  return project;
}

/**
 * 프로젝트 데이터 업데이트
 */
export async function updateProject(
  projectData: Partial<ProjectData>,
  currentStep?: number,
  maxVisitedStep?: number,
  userId: string = CURRENT_USER_ID
): Promise<Project> {
  const res = await apiRequest("PUT", `/api/project/${userId}`, {
    projectData,
    currentStep,
    maxVisitedStep,
  });

  const project = await res.json();
  projectCacheMap.set(userId, project);
  return project;
}

/**
 * 특정 필드 값 가져오기 (localStorage 호환)
 */
export async function getProjectField(key: keyof ProjectData): Promise<string | null> {
  try {
    const project = await getProject();
    const projectData = project.projectData as ProjectData;
    const value = projectData[key];
    if (value === undefined || value === null) return null;
    
    // 배열인 경우 JSON으로 변환
    if (Array.isArray(value)) {
      return JSON.stringify(value);
    }
    return String(value);
  } catch (error) {
    console.error("Error getting project field:", error);
    return null;
  }
}

/**
 * 특정 필드 값 설정하기 (localStorage 호환)
 */
export async function setProjectField(key: keyof ProjectData, value: any): Promise<void> {
  try {
    const project = await getProject();
    const projectData = project.projectData as ProjectData;
    const updatedData: Partial<ProjectData> = {
      ...projectData,
      [key]: value,
    };
    await updateProject(updatedData);
  } catch (error) {
    console.error("Error setting project field:", error);
  }
}

/**
 * currentStep 업데이트
 */
export async function updateCurrentStep(step: number): Promise<void> {
  try {
    const project = await getProject();
    const projectData = project.projectData as ProjectData;
    await updateProject(projectData, step);
  } catch (error) {
    console.error("Error updating current step:", error);
  }
}

/**
 * maxVisitedStep 업데이트
 */
export async function updateMaxVisitedStep(step: number): Promise<void> {
  try {
    const project = await getProject();
    const currentMax = project.maxVisitedStep || 1;
    if (step > currentMax) {
      await updateProject(
        project.projectData as ProjectData,
        project.currentStep,
        step
      );
    }
  } catch (error) {
    console.error("Error updating max visited step:", error);
  }
}

/**
 * 캐시 초기화 (로그아웃 시 등)
 */
export function clearProjectCache(userId?: string): void {
  if (userId) {
    projectCacheMap.delete(userId);
  } else {
    projectCacheMap.clear();
  }
}
