import React from "react";

interface OptionItem {
  value: string;
  label: string;
}

interface ProjectPageHeaderProps {
  title: string;
  projectOptionsPrefix?: OptionItem[];
}

export function ProjectPageHeader({ title, projectOptionsPrefix }: ProjectPageHeaderProps) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      {projectOptionsPrefix && projectOptionsPrefix.length > 0 && (
        <select className="max-w-xs rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 bg-white">
          {projectOptionsPrefix.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

interface ProjectPageLayoutProps {
  title: string;
  toolbar?: React.ReactNode;
  children: React.ReactNode;
}

export function ProjectPageLayout({ title, toolbar, children }: ProjectPageLayoutProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        {toolbar}
      </div>
      {children}
    </div>
  );
}
