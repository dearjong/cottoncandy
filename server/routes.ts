import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { startSimulation, getSimJob, getLatestSimJob, DEFAULT_CONFIG, type SimConfig } from "./simulate-analytics";
import {
  projectDataSchema,
  type ProjectData,
  insertAnalyticsEventSchema,
  insertNotificationSchema,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // GET /api/project/:userId - 프로젝트 데이터 가져오기
  app.get("/api/project/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const project = await storage.getProject(userId);
      
      if (!project) {
        // 프로젝트가 없으면 빈 프로젝트 생성
        const newProject = await storage.createProject(userId, {});
        return res.json(newProject);
      }
      
      res.json(project);
    } catch (error) {
      console.error('Error getting project:', error);
      res.status(500).json({ error: 'Failed to get project' });
    }
  });

  // PUT /api/project/:userId - 프로젝트 데이터 업데이트
  app.put("/api/project/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Request body 검증
      const requestSchema = z.object({
        projectData: projectDataSchema.optional().default({}),
        currentStep: z.number().int().min(1).optional(),
        maxVisitedStep: z.number().int().min(1).optional(),
      });
      
      const validated = requestSchema.parse(req.body);
      const { projectData, currentStep, maxVisitedStep } = validated;
      
      // 기존 프로젝트 확인
      const existing = await storage.getProject(userId);
      
      let project;
      if (!existing) {
        // 프로젝트가 없으면 새로 생성 (currentStep, maxVisitedStep 포함)
        project = await storage.createProject(userId, projectData);
        // 생성 후 step 업데이트
        if (currentStep !== undefined || maxVisitedStep !== undefined) {
          project = await storage.updateProject(
            userId, 
            projectData, 
            currentStep, 
            maxVisitedStep
          ) || project;
        }
      } else {
        // 기존 프로젝트 업데이트
        project = await storage.updateProject(userId, projectData, currentStep, maxVisitedStep);
      }
      
      res.json(project);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid request data', details: error.errors });
      }
      console.error('Error updating project:', error);
      res.status(500).json({ error: 'Failed to update project' });
    }
  });

  // GET /api/messages - 메시지 목록 조회
  app.get("/api/messages", async (req, res) => {
    try {
      const userId = req.query.userId as string || "1";
      const type = req.query.type as string | undefined;
      
      const messages = await storage.getMessages(userId, type);
      res.json(messages);
    } catch (error) {
      console.error('Error getting messages:', error);
      res.status(500).json({ error: 'Failed to get messages' });
    }
  });

  // GET /api/messages/:id - 특정 메시지 조회
  app.get("/api/messages/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const message = await storage.getMessage(id);
      
      if (!message) {
        return res.status(404).json({ error: 'Message not found' });
      }
      
      // 메시지를 읽음으로 표시
      await storage.markMessageAsRead(id);
      
      res.json(message);
    } catch (error) {
      console.error('Error getting message:', error);
      res.status(500).json({ error: 'Failed to get message' });
    }
  });

  // DELETE /api/messages/:id - 메시지 삭제
  app.delete("/api/messages/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteMessage(id);
      
      if (!success) {
        return res.status(404).json({ error: 'Message not found' });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting message:', error);
      res.status(500).json({ error: 'Failed to delete message' });
    }
  });

  // GET /api/notifications - 알림 목록 조회
  app.get("/api/notifications", async (req, res) => {
    try {
      const userId = req.query.userId as string || "1";
      const type = req.query.type as string | undefined;
      
      const notifications = await storage.getNotifications(userId, type);
      res.json(notifications);
    } catch (error) {
      console.error('Error getting notifications:', error);
      res.status(500).json({ error: 'Failed to get notifications' });
    }
  });

  // POST /api/notifications - 알림 생성(운영/관리자 도구용)
  app.post("/api/notifications", async (req, res) => {
    try {
      const parsed = insertNotificationSchema.parse(req.body);
      const row = await storage.createNotification(parsed);
      res.status(201).json(row);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ error: "Invalid request body", details: error.errors });
      }
      console.error("Error creating notification:", error);
      res.status(500).json({ error: "Failed to create notification" });
    }
  });

  // GET /api/notifications/:id - 특정 알림 조회
  app.get("/api/notifications/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const notification = await storage.getNotification(id);
      
      if (!notification) {
        return res.status(404).json({ error: 'Notification not found' });
      }
      
      // 알림을 읽음으로 표시
      await storage.markNotificationAsRead(id);
      
      res.json(notification);
    } catch (error) {
      console.error('Error getting notification:', error);
      res.status(500).json({ error: 'Failed to get notification' });
    }
  });

  // PATCH /api/notifications/:id/read - 알림 읽음 표시
  app.patch("/api/notifications/:id/read", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const notification = await storage.markNotificationAsRead(id);
      
      if (!notification) {
        return res.status(404).json({ error: 'Notification not found' });
      }
      
      res.json(notification);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      res.status(500).json({ error: 'Failed to mark notification as read' });
    }
  });

  // DELETE /api/notifications/:id - 알림 삭제
  app.delete("/api/notifications/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteNotification(id);
      
      if (!success) {
        return res.status(404).json({ error: 'Notification not found' });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error('Error deleting notification:', error);
      res.status(500).json({ error: 'Failed to delete notification' });
    }
  });

  // GET /api/projects - Work 프로젝트 목록 조회
  app.get("/api/projects", async (req, res) => {
    try {
      const userId = req.query.userId as string || "1";
      const projectType = req.query.projectType as 'request' | 'participate' || 'request';
      
      const projects = await storage.getWorkProjects(userId, projectType);
      res.json(projects);
    } catch (error) {
      console.error('Error getting work projects:', error);
      res.status(500).json({ error: 'Failed to get work projects' });
    }
  });

  // GET /api/schedules/:projectId - 프로젝트 일정 조회
  app.get("/api/schedules/:projectId", async (req, res) => {
    try {
      const projectId = req.params.projectId;
      const schedule = await storage.getSchedule(projectId);
      
      if (!schedule) {
        return res.status(404).json({ error: 'Schedule not found' });
      }
      
      res.json(schedule);
    } catch (error) {
      console.error('Error getting schedule:', error);
      res.status(500).json({ error: 'Failed to get schedule' });
    }
  });

  // POST /api/schedules - 프로젝트 일정 생성
  app.post("/api/schedules", async (req, res) => {
    try {
      const schedule = await storage.createSchedule(req.body);
      res.json(schedule);
    } catch (error) {
      console.error('Error creating schedule:', error);
      res.status(500).json({ error: 'Failed to create schedule' });
    }
  });

  // GET /api/analytics/events — 개발용 최근 이벤트 조회 (MemStorage)
  app.get("/api/analytics/events", async (req, res) => {
    try {
      const limit = Math.min(
        200,
        Math.max(1, parseInt(String(req.query.limit ?? "50"), 10) || 50),
      );
      const rows = await storage.getRecentAnalyticsEvents(limit);
      res.json(rows);
    } catch (error) {
      console.error("Error listing analytics events:", error);
      res.status(500).json({ error: "Failed to list analytics events" });
    }
  });

  // POST /api/analytics/events — 클라이언트 분석 이벤트 적재 (MemStorage / 추후 Postgres)
  app.post("/api/analytics/events", async (req, res) => {
    try {
      const parsed = insertAnalyticsEventSchema.parse(req.body);
      const result = await storage.recordAnalyticsEvent(parsed);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ error: "Invalid request body", details: error.errors });
      }
      console.error("Error recording analytics event:", error);
      res.status(500).json({ error: "Failed to record analytics event" });
    }
  });

  // PATCH /api/schedules/:projectId - 프로젝트 일정 수정
  app.patch("/api/schedules/:projectId", async (req, res) => {
    try {
      const projectId = req.params.projectId;
      const schedule = await storage.updateSchedule(projectId, req.body);
      
      if (!schedule) {
        return res.status(404).json({ error: 'Schedule not found' });
      }
      
      res.json(schedule);
    } catch (error) {
      console.error('Error updating schedule:', error);
      res.status(500).json({ error: 'Failed to update schedule' });
    }
  });

  // POST /api/admin/simulate/start — 시뮬레이션 시작 (비동기 job)
  app.post("/api/admin/simulate/start", async (req, res) => {
    try {
      const b = req.body ?? {};
      const num = (key: keyof SimConfig, min: number, max: number) => {
        const parsed = parseInt(String(b[key] ?? ""), 10);
        const val = Number.isNaN(parsed) ? DEFAULT_CONFIG[key] as number : parsed;
        return Math.min(max, Math.max(min, val));
      };
      const cfg: SimConfig = {
        userCount:        num("userCount", 10, 10000),
        periodSecs:       num("periodSecs", 0, 604800),
        pctAdvertiser:    num("pctAdvertiser", 0, 100),
        pctAgency:        num("pctAgency", 0, 100),
        pctProduction:    num("pctProduction", 0, 100),
        pctTvcf:          num("pctTvcf", 0, 100),
        pctGoogle:        num("pctGoogle", 0, 100),
        pctNaver:         num("pctNaver", 0, 100),
        pctKakao:         num("pctKakao", 0, 100),
        pctOrganic:       num("pctOrganic", 0, 100),
        pctSsoLogin:      num("pctSsoLogin", 0, 100),
        pctManualLogin:   num("pctManualLogin", 0, 100),
        pctSignup:        num("pctSignup", 0, 100),
        pctMale:          num("pctMale", 0, 100),
        pctFemale:        num("pctFemale", 0, 100),
        pct20s:           num("pct20s", 0, 100),
        pct30s:           num("pct30s", 0, 100),
        pct40s:           num("pct40s", 0, 100),
        pct50s:           num("pct50s", 0, 100),
        pctSeoul:         num("pctSeoul", 0, 100),
        pctGyeonggi:      num("pctGyeonggi", 0, 100),
        pctLocal:         num("pctLocal", 0, 100),
        pctAbroad:        num("pctAbroad", 0, 100),
        projectRegCount:          num("projectRegCount", 0, 10000),
        portfolioRegCount:        num("portfolioRegCount", 0, 10000),
        partnerApplyCount:        num("partnerApplyCount", 0, 10000),
        minProjectCompletions:    num("minProjectCompletions", 0, 10000),
        minPortfolioCompletions:  num("minPortfolioCompletions", 0, 10000),
      };
      const jobId = await startSimulation(cfg);
      res.json({ jobId });
    } catch (error) {
      console.error("Simulation start error:", error);
      res.status(500).json({ error: "Failed to start simulation" });
    }
  });

  // GET /api/admin/simulate/status/:jobId — 진행 상황 조회
  app.get("/api/admin/simulate/status/:jobId", (req, res) => {
    const job = getSimJob(req.params.jobId);
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json(job);
  });

  // GET /api/admin/simulate/latest — 최근 시뮬레이션 결과 조회
  app.get("/api/admin/simulate/latest", (req, res) => {
    const latest = getLatestSimJob();
    if (!latest) return res.json(null);
    res.json(latest);
  });

  const httpServer = createServer(app);

  return httpServer;
}
