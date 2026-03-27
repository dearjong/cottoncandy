/**
 * API 클라이언트 (admin 등에서 사용)
 */

export interface Consultant {
  id: string;
  name: string;
  type: string;
  company?: string;
  expertise: string[];
  career: string;
  managedProjects: number;
  matchRate: string;
  rating: number;
  status: string;
  email?: string;
  phone?: string;
  joinDate?: string;
}

const MOCK_CONSULTANTS: Consultant[] = [
  {
    id: 'CS-2401-001',
    name: '강전문',
    type: 'FREELANCER',
    expertise: ['TVC', '바이럴'],
    career: '10년',
    managedProjects: 5,
    matchRate: '95%',
    rating: 4.8,
    status: 'ACTIVE',
    email: 'kang@example.com',
    phone: '010-1234-5678',
    joinDate: '2024.09.01',
  },
  {
    id: 'CS-2405-012',
    name: '박기획',
    type: 'FREELANCER',
    expertise: ['기획', '퍼포먼스'],
    career: '7년',
    managedProjects: 3,
    matchRate: '88%',
    rating: 4.5,
    status: 'ACTIVE',
    joinDate: '2024.10.01',
  },
  {
    id: 'CS-2403-005',
    name: '이마케팅',
    type: 'FREELANCER',
    company: '마케팅코리아',
    expertise: ['IR', '마케팅'],
    career: '5년',
    managedProjects: 2,
    matchRate: '75%',
    rating: 4.2,
    status: 'PENDING',
    joinDate: '2024.11.01',
  },
];

export async function getConsultants(): Promise<Consultant[]> {
  return Promise.resolve(MOCK_CONSULTANTS);
}
