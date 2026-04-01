import "dotenv/config";
import os from "node:os";
import { isIPv4 } from "node:net";
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { log } from "./log";
import { serveStatic } from "./static";

function getLanIPv4Addresses(): string[] {
  const nets = os.networkInterfaces();
  const out: string[] = [];
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] ?? []) {
      if (net.internal) continue;
      if (isIPv4(net.address)) out.push(net.address);
    }
  }
  return out;
}

// 예기치 않은 에러 시 로그만 남기고 프로세스가 바로 죽지 않도록 (원인 확인용)
process.on("uncaughtException", (err) => {
  console.error("[uncaughtException]", err);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("[unhandledRejection]", reason);
});

const app = express();

// Vite 호스트 검사: 일부 클라이언트가 Host 헤더를 생략하면 403이 날 수 있음
app.use((req, _res, next) => {
  if (!req.headers.host) {
    const local = req.socket?.localAddress;
    const localPort = req.socket?.localPort;
    if (local && localPort) {
      req.headers.host = local.includes(":") && !local.includes(".")
        ? `[${local}]:${localPort}`
        : `${local}:${localPort}`;
    }
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    const server = await registerRoutes(app);

    app.use('/attached_assets', express.static('attached_assets'));

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      log(`Error ${status}: ${message}`, "express");
      if (status >= 500) console.error(err);
      res.status(status).json({ message });
      // throw 하면 프로세스가 죽음 → 로그만 하고 응답만 보냄
    });

    if (app.get("env") === "development") {
      const { setupVite } = await import("./vite");
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

    const port = Number(process.env.PORT) || 5000;
    const host = process.env.HOST || "0.0.0.0";
    server.listen(port, host, () => {
      log(`serving on port ${port}`);
      log(`  Local:   http://localhost:${port}/`);
      const lan = getLanIPv4Addresses();
      if (lan.length > 0) {
        for (const ip of lan) {
          log(`  Network: http://${ip}:${port}/  (같은 LAN/Wi-Fi)`);
        }
      }
    });
  } catch (e) {
    console.error("서버 시작 실패:", e);
    process.exit(1);
  }
})();
