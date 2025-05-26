/* eslint-disable no-console */
import express from 'express'
import { connectToDatabase, GET_DB, EXIT_DB } from '~/config/mongodb'
import exitHook from 'async-exit-hook'
import { ENV } from './config/environment'

const START_SEVER = () => {
  const app = express()

  const hostname = 'localhost'
  const port = 8017

  app.get('/', async (req, res) => {
    try {
      const collections = await GET_DB().listCollections().toArray()
      console.log(collections)
      res.end('<h1>Hello World!</h1><hr>')
    } catch (error) {
      console.error(error)
      res.status(500).end('<h1>Database Error</h1>')
    }
  })

  app.listen(port, hostname, () => {
    console.log(`Hello Liptwo, I am running at http://${ENV.APP_HOST}:${ENV.APP_PORT}/`)
  })

  exitHook(() => {
    console.log('Exit db')
    EXIT_DB()
  })
}

(async () => {
  try {
    console.log('1. Connecting to database...')
    await connectToDatabase() // Make sure to await this
    console.log('2. Successfully connected to database!')

    START_SEVER()
  } catch (error) {
    console.error('Failed to start server:', error)
    process.exit(1) // Use exit code 1 for errors
  }
})()