import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

interface Environment {
  NODE_ENV: string;
  PORT: number;
  MONGODB_URI: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_EXPIRES_IN: string;
  JWT_REFRESH_EXPIRES_IN: string;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  EMAIL_USER: string;
  EMAIL_APP_PASSWORD: string;
  ADMIN_EMAIL: string;
  CLIENT_URL: string;
  ADMIN_URL: string;
  EMAIL_PASSWORD?: string;
}

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export const env: Environment = {
  NODE_ENV: getEnvVar('NODE_ENV', 'development'),
  PORT: parseInt(getEnvVar('PORT', '5000'), 10),
  MONGODB_URI: getEnvVar('MONGODB_URI'),
  JWT_SECRET: getEnvVar('JWT_SECRET'),
  JWT_REFRESH_SECRET: getEnvVar('JWT_REFRESH_SECRET'),
  JWT_EXPIRES_IN: getEnvVar('JWT_EXPIRES_IN', '1h'),
  JWT_REFRESH_EXPIRES_IN: getEnvVar('JWT_REFRESH_EXPIRES_IN', '7d'),
  CLOUDINARY_CLOUD_NAME: getEnvVar('CLOUDINARY_CLOUD_NAME'),
  CLOUDINARY_API_KEY: getEnvVar('CLOUDINARY_API_KEY'),
  CLOUDINARY_API_SECRET: getEnvVar('CLOUDINARY_API_SECRET'),
  EMAIL_USER: getEnvVar('EMAIL_USER'),
  EMAIL_APP_PASSWORD: getEnvVar('EMAIL_APP_PASSWORD'),
  ADMIN_EMAIL: getEnvVar('ADMIN_EMAIL'),
  CLIENT_URL: getEnvVar('CLIENT_URL', 'http://localhost:5173'),
  ADMIN_URL: getEnvVar('ADMIN_URL', 'http://localhost:5174'),
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || process.env.EMAIL_APP_PASSWORD,
};

export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
