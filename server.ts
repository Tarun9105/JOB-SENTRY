import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import {
  analyzeJobController,
  getHistoryController,
  clearHistoryController,
  getResearchMetricsController,
  getHealthController,
} from './backend/controllers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProd = process.env.NODE_ENV === 'production' || Boolean(process.env.RENDER);

  app.use(cors());
  app.use(express.json());

  // Backend API Routes (Routed directly to /backend controllers)
  app.post('/api/analyze', analyzeJobController);
  app.post('/analyze', analyzeJobController);

  app.get('/api/history', getHistoryController);
  app.get('/history', getHistoryController);
  app.delete('/api/history', clearHistoryController);

  app.get('/api/research/metrics', getResearchMetricsController);
  app.get('/api/health', getHealthController);

  // Vite middleware in development vs static serving in production
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    const indexHtml = path.resolve(distPath, 'index.html');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
    }
    app.get('*', (_req: Request, res: Response) => {
      if (fs.existsSync(indexHtml)) {
        res.sendFile(indexHtml);
      } else {
        res.json({
          status: 'online',
          service: 'JobSentry API Server (Render)',
          environment: process.env.NODE_ENV || 'production',
          endpoints: [
            '/api/health',
            '/api/analyze',
            '/api/history',
            '/api/research/metrics',
          ],
        });
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[JobSentry] Multi-service server running at http://0.0.0.0:${PORT} (env: ${process.env.NODE_ENV || 'development'})`);
    console.log(`[JobSentry] Backend: /backend | Frontend: /frontend (Vite) | ML: /ml_service | SSOT: /shared`);
  });
}

startServer().catch((err) => {
  console.error('[JobSentry] Failed to start server:', err);
  process.exit(1);
});
