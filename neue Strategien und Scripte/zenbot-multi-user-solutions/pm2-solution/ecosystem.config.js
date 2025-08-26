module.exports = {
  apps: [
    {
      name: 'zenbot-user-a',
      script: './zenbot.js',
      cwd: '/path/to/zenbot', // Passen Sie diesen Pfad an Ihre Zenbot-Installation an
      args: 'trade --paper --conf=./configs/conf_user_a.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        ZENBOT_USER: 'user_a'
      },
      env_development: {
        NODE_ENV: 'development',
        ZENBOT_USER: 'user_a'
      },
      log_file: './logs/zenbot-user-a.log',
      out_file: './logs/zenbot-user-a-out.log',
      error_file: './logs/zenbot-user-a-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true
    },
    {
      name: 'zenbot-user-b',
      script: './zenbot.js',
      cwd: '/path/to/zenbot', // Passen Sie diesen Pfad an Ihre Zenbot-Installation an
      args: 'trade --paper --conf=./configs/conf_user_b.js',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        ZENBOT_USER: 'user_b'
      },
      env_development: {
        NODE_ENV: 'development',
        ZENBOT_USER: 'user_b'
      },
      log_file: './logs/zenbot-user-b.log',
      out_file: './logs/zenbot-user-b-out.log',
      error_file: './logs/zenbot-user-b-error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true
    }
  ],

  deploy: {
    production: {
      user: 'ubuntu',
      host: 'your-server.com',
      ref: 'origin/master',
      repo: 'git@github.com:your-username/zenbot-multi-user.git',
      path: '/var/www/zenbot-multi-user',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};

