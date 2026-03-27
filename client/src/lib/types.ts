export interface Step1Option {
  id: 'public' | 'private' | 'consulting';
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  bgColor: string;
  iconColor: string;
}

export interface Step2Option {
  id: 'advertising' | 'video' | 'consulting-agency';
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  bgColor: string;
  iconColor: string;
}

export interface Step3Option {
  id: 'sales' | 'branding' | 'awareness' | 'guide' | 'pr' | 'government' | 'green' | 'startup' | 'others';
  title: string;
  description: string;
  icon: string;
  bgColor: string;
  iconColor: string;
  isSelected?: boolean;
}

export interface ProjectState {
  step1Selection: string | null;
  step2Selection: string | null;
  step3Selection: string | null;
  currentStep: number;
}
