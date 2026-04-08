import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  /** 로그인 ID (프로젝트 API의 userId 문자열과 맞출 수 있음, 예: 이꽃별) */
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name"),
  email: text("email"),
  phone: text("phone"),
  /** 의뢰 | 제작사 등 */
  userType: text("user_type"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const onboardingSelections = pgTable("onboarding_selections", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  step1Selection: text("step1_selection"),
  step2Selection: text("step2_selection"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  /** 한 사용자(세션)당 하나의 의뢰 초안 — API와 동일하게 userId로 조회 */
  userId: text("user_id").notNull().unique(),
  projectData: jsonb("project_data").notNull(),
  currentStep: integer("current_step").notNull().default(1),
  maxVisitedStep: integer("max_visited_step").notNull().default(1),
  /** draft: 작성 중 | submitted: 등록 완료 제출 */
  status: text("status").notNull().default("draft"),
  submittedAt: timestamp("submitted_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/** Work 홈 목록용 프로젝트 카드 (JSON으로 저장) */
export const workProjects = pgTable("work_projects", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  projectType: text("project_type").notNull(),
  data: jsonb("data").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  projectId: text("project_id").notNull(),
  projectTitle: text("project_title").notNull(),
  type: text("type").notNull(), // 'received' | 'sent'
  messageType: text("message_type"), // '문의' | '진행' | ''
  subject: text("subject").notNull(),
  sender: text("sender").notNull(),
  senderCompany: text("sender_company").notNull(),
  content: text("content").notNull(),
  originalContent: text("original_content"),
  attachments: text("attachments").array(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  type: text("type").notNull(), // 'progress' | 'custom' | 'system'
  projectId: text("project_id"),
  projectTitle: text("project_title"),
  title: text("title").notNull(),
  company: text("company"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

/** 클라이언트 분석 이벤트 (Mixpanel과 동시 적재용) */
export const analyticsEvents = pgTable("analytics_events", {
  id: serial("id").primaryKey(),
  eventName: text("event_name").notNull(),
  properties: jsonb("properties").$type<Record<string, unknown>>().notNull().default({}),
  sessionId: text("session_id"),
  userId: text("user_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const schedules = pgTable("schedules", {
  id: serial("id").primaryKey(),
  projectId: text("project_id").notNull().unique(),
  applicationDeadline: text("application_deadline"),
  applicationResult: text("application_result"),
  orientation: text("orientation"),
  submissionDeadline: text("submission_deadline"),
  presentation: text("presentation"),
  presentationResult: text("presentation_result"),
  finalPlanSubmission: text("final_plan_submission"),
  shootingDate: text("shooting_date"),
  firstDelivery: text("first_delivery"),
  finalDelivery: text("final_delivery"),
  onAir: text("on_air"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertOnboardingSelectionSchema = createInsertSchema(onboardingSelections).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const insertScheduleSchema = createInsertSchema(schedules).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAnalyticsEventSchema = createInsertSchema(analyticsEvents).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type OnboardingSelection = typeof onboardingSelections.$inferSelect;
export type InsertOnboardingSelection = z.infer<typeof insertOnboardingSelectionSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Schedule = typeof schedules.$inferSelect;
export type InsertSchedule = z.infer<typeof insertScheduleSchema>;
export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type InsertAnalyticsEvent = z.infer<typeof insertAnalyticsEventSchema>;

// 프로젝트 데이터 Zod 스키마
export const projectDataSchema = z.object({
  // Step 1-2
  requestStyle: z.string().optional(),
  partnerType: z.string().optional(),
  
  // Step 3
  projectName: z.string().optional(),
  
  // Step 4
  projectPurpose: z.string().optional(),
  
  // Step 5
  projectCategory: z.string().optional(),
  
  // Step 6
  targetAudience: z.string().optional(),
  targetAge: z.array(z.string()).optional(),
  targetGender: z.string().optional(),
  
  // Step 7
  productInfo: z.string().optional(),
  hideProductInfo: z.boolean().optional(),
  
  // Step 8
  budgetType: z.enum(['fixed', 'proposal']).optional(),
  campaignScale: z.string().optional(),
  productionBudget: z.string().optional(),
  totalBudget: z.string().optional(),
  productionRange: z.string().optional(),
  totalRange: z.string().optional(),
  hideProduction: z.boolean().optional(),
  hideTotal: z.boolean().optional(),
  
  // Step 9
  paymentAdvance: z.string().optional(),
  paymentInterim: z.string().optional(),
  paymentBalance: z.string().optional(),
  
  // Step 10
  scheduleStartDate: z.string().optional(),
  scheduleEndDate: z.string().optional(),
  scheduleAnnounceDays: z.string().optional(),
  scheduleDeliveryDate: z.string().optional(),
  scheduleOnairDate: z.string().optional(),
  
  // Step 11-18 (나중에 구현 시 여기에 필드 추가)
}).strict(); // 정의된 필드만 허용

// 프로젝트 데이터 타입 정의
export type ProjectData = z.infer<typeof projectDataSchema>;
