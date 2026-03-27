import React, { createContext, useContext, useState, type ReactNode } from "react";

interface ProjectFilterState {
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
}

const ProjectFilterContext = createContext<ProjectFilterState | null>(null);

export function ProjectFilterProvider({ children }: { children: ReactNode }) {
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  return (
    <ProjectFilterContext.Provider value={{ selectedProjectId, setSelectedProjectId }}>
      {children}
    </ProjectFilterContext.Provider>
  );
}

export function useProjectFilterContext(): ProjectFilterState {
  const ctx = useContext(ProjectFilterContext);
  if (!ctx) {
    return {
      selectedProjectId: null,
      setSelectedProjectId: () => {},
    };
  }
  return ctx;
}

export function useProjectFilterContextOptional(): ProjectFilterState | null {
  return useContext(ProjectFilterContext);
}
