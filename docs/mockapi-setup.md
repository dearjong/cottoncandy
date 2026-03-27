# MockAPI 설정 가이드

## MockAPI 소개
MockAPI는 빠르게 REST API를 프로토타이핑할 수 있는 서비스입니다.

## 설정 방법

### 1. MockAPI 프로젝트 생성
1. [mockapi.io](https://mockapi.io) 방문
2. 새 프로젝트 생성
3. 프로젝트 URL 복사: `https://[project-id].mockapi.io/api/v1`

### 2. 환경 변수 설정
`.env.local` 파일 생성:
```env
NEXT_PUBLIC_API_URL=https://your-project-id.mockapi.io/api/v1
```

### 3. MockAPI 컬렉션 생성

#### Members 컬렉션
```json
{
  "id": "{{random.uuid}}",
  "name": "{{name.firstName}} {{name.lastName}}",
  "nickname": "{{internet.userName}}",
  "department": "{{random.arrayElement(['마케팅팀', '디자인팀', '개발팀', '영업팀'])}}",
  "position": "{{random.arrayElement(['팀장', '매니저', '사원', '대리'])}}",
  "role": "{{random.arrayElement(['대표관리자', '부관리자', '일반직원'])}}",
  "email": "{{internet.email}}",
  "status": "{{random.arrayElement(['active', 'pending'])}}",
  "isMember": "{{random.boolean}}"
}
```

#### Projects 컬렉션
```json
{
  "id": "{{random.uuid}}",
  "title": "{{company.catchPhrase}}",
  "description": "{{lorem.paragraph}}",
  "category": "{{random.arrayElement(['영상 제작', '광고 기획', '디자인'])}}",
  "budget": "{{random.arrayElement(['5,000,000 - 10,000,000원', '10,000,000 - 20,000,000원'])}}",
  "status": "{{random.arrayElement(['draft', 'published', 'in_progress', 'completed'])}}",
  "createdAt": "{{date.recent}}",
  "updatedAt": "{{date.recent}}"
}
```

#### Messages 컬렉션
```json
{
  "id": "{{random.uuid}}",
  "senderId": "{{random.uuid}}",
  "senderName": "{{name.firstName}} {{name.lastName}}",
  "receiverId": "{{random.uuid}}",
  "subject": "{{lorem.sentence}}",
  "content": "{{lorem.paragraph}}",
  "isRead": "{{random.boolean}}",
  "createdAt": "{{date.recent}}"
}
```

### 4. API 클라이언트 사용 예시

```typescript
import { getMembers, createMember } from '@lib/api/members';

// 구성원 목록 조회
const members = await getMembers();

// 새 구성원 초대
const newMember = await createMember({
  email: 'new@example.com',
  department: '마케팅팀',
  position: '매니저',
  role: '일반직원'
});
```

### 5. React Query 사용 예시

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { getMembers, createMember } from '@lib/api/members';

function MembersList() {
  const { data: members, isLoading } = useQuery({
    queryKey: ['/members'],
    queryFn: getMembers,
  });

  const createMemberMutation = useMutation({
    mutationFn: createMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/members'] });
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {members?.map(member => (
        <div key={member.id}>{member.name}</div>
      ))}
    </div>
  );
}
```

## 주의사항
- MockAPI는 개발/테스트 목적으로만 사용
- 실제 프로덕션에서는 실제 백엔드 API로 교체 필요
- 데이터는 영구적이지 않을 수 있음 (MockAPI 정책에 따라 다름)
- Rate limiting 존재 (무료: 분당 10 요청)
