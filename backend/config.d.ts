declare const config: {
  NODE_ENV: 'development' | 'production' | 'test';
  PORT: number | string;
  MONGODB_URI: string;
  JWT_SECRET: string;
  FRONTEND_URL: string;
};

export default config;
