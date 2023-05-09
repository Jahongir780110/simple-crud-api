import cluster from 'cluster';
import os from 'os';
import http from 'http';

import 'dotenv/config';
import { ChildServer } from './interfaces/ChildServer';

const cpusCount = os.cpus().length;

if (cluster.isPrimary) {
  const cpusCount = os.cpus().length;
  const childServers: ChildServer[] = [];
  let nextWorkerIndex = 0;

  for (let i = 0; i < cpusCount; i++) {
    const portNumber = Number(process.env.PORT as string) + i + 1;
    cluster.fork({ PORT: portNumber });
    childServers.push({ host: 'localhost', port: portNumber });
  }

  const loadBalancer = http.createServer((request, response) => {
    const nextWorker = childServers[nextWorkerIndex];

    const proxyRequest = http.request(
      {
        host: nextWorker.host,
        port: nextWorker.port,
        method: request.method,
        path: request.url,
        headers: request.headers,
      },
      (proxyRes) => {
        proxyRes.pipe(response);
      },
    );

    request.pipe(proxyRequest);

    nextWorkerIndex = (nextWorkerIndex + 1) % cpusCount;
  });

  loadBalancer.listen(process.env.PORT, () => {
    console.log(`Load balancer is running on port ${process.env.PORT}`);
  });
} else {
  import('./index.js');
}
