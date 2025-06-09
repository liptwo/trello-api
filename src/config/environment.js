import 'dotenv/config'

export const ENV = {
  MONGO_DB: process.env.MONGO_DB,
  DB_NAME: process.env.DB_NAME,
  LOCAL_DEV_APP_HOST: process.env.LOCAL_DEV_APP_HOST,
  LOCAL_DEV_APP_PORT: process.env.LOCAL_DEV_APP_PORT,
  BUILD_MODE: process.env.BUILD_MODE
}