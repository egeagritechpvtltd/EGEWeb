import { createServer } from 'http';
import { parse } from 'url';
import { readFile } from 'fs/promises';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  const server = createServer(async (req, res) => {
    const url = req.url ? req.url : '/';
    
    try {
      // Always serve index.html for all routes
      // Let React Router handle the routing client-side
      const template = await readFile('index.html', 'utf-8');
      
      // Apply Vite HTML transforms
      const html = await app.transformIndexHtml(url, template);
      
      res.setHeader('Content-Type', 'text/html');
      res.end(html);
    } catch (e) {
      app.ssrFixStacktrace(e);
      console.error(e);
      res.statusCode = 500;
      res.end(e.message);
    }
  });

  server.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
  });
}

startServer();
