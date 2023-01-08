import cluster from 'cluster';
import { cpus } from 'os';

if (cluster.isPrimary) {
  console.log(`http://localhost:${process.env.PORT}`);

  const clusterCount = parseFloat(process.env.CLUSTERS || '0') || cpus().length;
  for (let i = 0; i < clusterCount; i++) {
    cluster.fork();
  }

  cluster.on('exit', worker => {
    console.log(`#${worker.process.pid} Worker died.`);
  });
} else {
  import('./routes.js');
}