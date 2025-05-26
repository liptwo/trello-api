import 'dotenv/config'

export const ENV = {
  MONGO_DB: process.env.MONGO_DB,
  DB_NAME: process.env.DB_NAME,
  APP_HOST: process.env.APP_HOST,
  APP_PORT: process.env.APP_PORT
}