import { eq, and, desc } from "drizzle-orm";
import {
  users,
  projects,
  messages,
  notifications,
  schedules,
  analyticsEvents,
  workProjects,
} from "@shared/schema";
import type {
  User,
  InsertUser,
  InsertProject,
  Project,
  ProjectData,
  Message,
  InsertMessage,
  Notification,
  InsertNotification,
  Schedule,
  InsertSchedule,
  AnalyticsEvent,
  InsertAnalyticsEvent,
} from "@shared/schema";
import type { WorkProject } from "@shared/work-project";
import { getDb } from "./db";
import type { IStorage } from "./mem-storage";

export class DbStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const db = getDb();
    const rows = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return rows[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const db = getDb();
    const rows = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    return rows[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const db = getDb();
    const [row] = await db.insert(users).values(user).returning();
    return row;
  }

  async getProject(userId: string): Promise<Project | undefined> {
    const db = getDb();
    const rows = await db
      .select()
      .from(projects)
      .where(eq(projects.userId, userId))
      .limit(1);
    return rows[0];
  }

  async createProject(userId: string, projectData: ProjectData): Promise<Project> {
    const db = getDb();
    const [row] = await db
      .insert(projects)
      .values({
        userId,
        projectData,
        currentStep: 1,
        maxVisitedStep: 1,
        status: "draft",
        submittedAt: null,
      } as InsertProject)
      .returning();
    return row;
  }

  async updateProject(
    userId: string,
    projectData: Partial<ProjectData>,
    currentStep?: number,
    maxVisitedStep?: number,
  ): Promise<Project | undefined> {
    const db = getDb();
    const existing = await this.getProject(userId);
    if (!existing) return undefined;

    const merged: ProjectData = {
      ...(existing.projectData as ProjectData),
      ...projectData,
    };

    const [row] = await db
      .update(projects)
      .set({
        projectData: merged,
        currentStep: currentStep ?? existing.currentStep,
        maxVisitedStep: maxVisitedStep ?? existing.maxVisitedStep,
        updatedAt: new Date(),
      })
      .where(eq(projects.userId, userId))
      .returning();
    return row;
  }

  async getWorkProjects(
    userId: string,
    projectType: "request" | "participate",
  ): Promise<WorkProject[]> {
    const db = getDb();
    const rows = await db
      .select()
      .from(workProjects)
      .where(
        and(
          eq(workProjects.userId, userId),
          eq(workProjects.projectType, projectType),
        ),
      );
    return rows.map((r) => r.data as WorkProject);
  }

  async getMessages(userId: string, type?: string): Promise<Message[]> {
    const db = getDb();
    if (type) {
      return db
        .select()
        .from(messages)
        .where(and(eq(messages.userId, userId), eq(messages.type, type)));
    }
    return db.select().from(messages).where(eq(messages.userId, userId));
  }

  async getMessage(id: number): Promise<Message | undefined> {
    const db = getDb();
    const rows = await db
      .select()
      .from(messages)
      .where(eq(messages.id, id))
      .limit(1);
    return rows[0];
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const db = getDb();
    const [row] = await db.insert(messages).values(insertMessage).returning();
    return row;
  }

  async markMessageAsRead(id: number): Promise<Message | undefined> {
    const db = getDb();
    const [row] = await db
      .update(messages)
      .set({ isRead: true })
      .where(eq(messages.id, id))
      .returning();
    return row;
  }

  async deleteMessage(id: number): Promise<boolean> {
    const db = getDb();
    const rows = await db
      .delete(messages)
      .where(eq(messages.id, id))
      .returning({ id: messages.id });
    return rows.length > 0;
  }

  async getNotifications(userId: string, type?: string): Promise<Notification[]> {
    const db = getDb();
    const base = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId));
    return type ? base.filter((n) => n.type === type) : base;
  }

  async getNotification(id: number): Promise<Notification | undefined> {
    const db = getDb();
    const rows = await db
      .select()
      .from(notifications)
      .where(eq(notifications.id, id))
      .limit(1);
    return rows[0];
  }

  async createNotification(
    insertNotification: InsertNotification,
  ): Promise<Notification> {
    const db = getDb();
    const [row] = await db
      .insert(notifications)
      .values(insertNotification)
      .returning();
    return row;
  }

  async markNotificationAsRead(id: number): Promise<Notification | undefined> {
    const db = getDb();
    const [row] = await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id))
      .returning();
    return row;
  }

  async deleteNotification(id: number): Promise<boolean> {
    const db = getDb();
    const rows = await db
      .delete(notifications)
      .where(eq(notifications.id, id))
      .returning({ id: notifications.id });
    return rows.length > 0;
  }

  async getSchedule(projectId: string): Promise<Schedule | undefined> {
    const db = getDb();
    const rows = await db
      .select()
      .from(schedules)
      .where(eq(schedules.projectId, projectId))
      .limit(1);
    return rows[0];
  }

  async createSchedule(scheduleData: InsertSchedule): Promise<Schedule> {
    const existing = await this.getSchedule(scheduleData.projectId);
    if (existing) {
      const updated = await this.updateSchedule(
        scheduleData.projectId,
        scheduleData,
      );
      if (!updated) throw new Error("schedule update failed");
      return updated;
    }
    const db = getDb();
    const [row] = await db.insert(schedules).values(scheduleData).returning();
    return row;
  }

  async updateSchedule(
    projectId: string,
    scheduleData: Partial<InsertSchedule>,
  ): Promise<Schedule | undefined> {
    const db = getDb();
    const { projectId: _ignore, ...rest } = scheduleData as InsertSchedule;
    const [row] = await db
      .update(schedules)
      .set({ ...rest, updatedAt: new Date() })
      .where(eq(schedules.projectId, projectId))
      .returning();
    return row;
  }

  async recordAnalyticsEvent(
    insert: InsertAnalyticsEvent,
  ): Promise<{ id: number }> {
    const db = getDb();
    const [row] = await db
      .insert(analyticsEvents)
      .values({
        eventName: insert.eventName,
        properties: insert.properties ?? {},
        sessionId: insert.sessionId ?? null,
      })
      .returning({ id: analyticsEvents.id });
    return { id: row.id };
  }

  async getRecentAnalyticsEvents(limit: number): Promise<AnalyticsEvent[]> {
    const db = getDb();
    const n = Math.min(Math.max(1, limit), 500);
    return db
      .select()
      .from(analyticsEvents)
      .orderBy(desc(analyticsEvents.id))
      .limit(n);
  }
}
