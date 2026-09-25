import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { createServer as createViteServer, createLogger, type ViteDevServer } from "vite";
import { type Server } from "http";
import { nanoid } from "nanoid";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server): Promise<ViteDevServer> {
  try {
    // Create Vite server in middleware mode
    const vite = await createViteServer({
      configFile: path.resolve(__dirname, '../vite.config.ts'),
      server: {
        middlewareMode: true,
        hmr: {
          server,
          clientPort: 24678,
        },
      },
      appType: 'custom',
      logLevel: 'info',
      customLogger: {
        ...viteLogger,
        error: (msg: string, options?: { error?: Error }) => {
          viteLogger.error(msg, options);
          if (options?.error) {
            console.error(options.error);
          }
        },
      },
    });

    // Use vite's connect instance as middleware
    app.use(vite.middlewares);

    const distPath = path.resolve(__dirname, '../public');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
    }

    // Handle SPA fallback
    app.use("*", async (req, res, next) => {
      const url = req.originalUrl;
      const clientTemplate = path.resolve(__dirname, '../client/index.html');

      if (fs.existsSync(clientTemplate)) {
        try {
          let template = await fs.promises.readFile(clientTemplate, "utf-8");
          template = template.replace(
            `src="/src/main.tsx"`,
            `src="/src/main.tsx?v=${nanoid()}"`,
          );
          const page = await vite.transformIndexHtml(url, template);
          return res.status(200).set({ "Content-Type": "text/html" }).end(page);
        } catch (e) {
          vite.ssrFixStacktrace(e as Error);
          return next(e);
        }
      }
      next();
    });

    log("Vite development server configured");
    return vite;
  } catch (err) {
    console.error("Failed to setup Vite:", err);
    throw err;
  }
}

export function serveStatic(app: Express): void {
  const distPath = path.resolve(__dirname, '../public');

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
