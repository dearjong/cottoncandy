/**
 * 제안서·시안 열람 비밀번호 검증.
 * 운영 배포 시 .env에 VITE_ADMIN_PROPOSAL_PASSWORD 설정 권장.
 */
const ENV_PASSWORD =
  typeof import.meta !== "undefined" && (import.meta as unknown as { env?: { VITE_ADMIN_PROPOSAL_PASSWORD?: string } }).env?.VITE_ADMIN_PROPOSAL_PASSWORD
const FALLBACK_PASSWORD = "cottoncandy" // 개발용. 배포 시 env로 교체

export function validateProposalViewPassword(password: string): boolean {
  const expected = (ENV_PASSWORD as string) ?? FALLBACK_PASSWORD
  return password.trim() === expected
}
