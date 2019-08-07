import dotenv from 'dotenv'

dotenv.config()

const enviroment = process.env.NODE_ENV || 'development'

/* Base config for the app, it will be overriden by the specific config for the 
enviroment that that the app is being executed in. */
const config = {
  // App
  APP_NAME: process.env.APP_NAME || 'Express API Starter',
  APP_VERSION: process.env.APP_VERSION || '1.0.0',
  APP_PORT: process.env.APP_PORT || 8000,
  APP_HOST: process.env.APP_HOST || 'localhost',
  // Logs
  FILE_LOG_LEVEL: process.env.FILE_LOG_LEVEL || 'info',
  DISABLE_LOGS: enviroment === 'test',
  // Secrets
  JWT_SECRET: process.env.JWT_SECRET || 'jwtR4nd0mS3cr3t!',
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || '30d'
}

export default config
