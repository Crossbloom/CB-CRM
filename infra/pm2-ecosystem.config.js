/**
 * crossbloom pm2 ecosystem config (template)
 * - Keeps processes managed by pm2 when deploying without Docker
 * - Adjust cwd and script paths if your project layout differs
 */
module.exports = {
  apps : [
    {
      name: "crossbloom-backend",
      script: "backend/index.js",
      cwd: "/home/cbadmin/CB-CRM",
      instances: 1,
      exec_mode: "cluster",
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 3000
      }
    },
    {
      name: "crossbloom-frontend",
      script: "npm",
      args: "run start",
      cwd: "/home/cbadmin/CB-CRM/frontend",
      instances: 1,
      exec_mode: "fork",
      watch: false,
      env: {
        NODE_ENV: "production",
        PORT: 3001
      }
    }
  ]
};
