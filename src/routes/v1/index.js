import express from 'express'
const Router = express.Router()
import { StatusCodes } from 'http-status-codes'
import { boardRoutes } from './boardRoutes.js'


// api v1 status
Router.get('/', (req, res) => {
  res.send('<h1>Bird Home Page</h1><hr>')
})
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({
    status: 'ok',
    message: 'Board service is running'
  })
})

/** Board APIs */
Router.use('/boards', boardRoutes)
export const APIs_V1 = Router