// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'klauth-api',
      script: 'server.js',
      instances: 'max',
      exec_mode: 'cluster',
      watch: false,
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'klauth-worker',
      script: 'worker.js',
      instances: 1,
      watch: false,
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
