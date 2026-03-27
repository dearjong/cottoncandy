import React from "react";

export { default as Header } from "./header";
export { default as Footer } from "./footer";
export { default as Layout } from "./layout";

export function PageHeader({
  title,
  children,
}: {
  title?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      {title && <h1 className="text-2xl font-bold text-slate-900">{title}</h1>}
      {children}
    </div>
  );
}

