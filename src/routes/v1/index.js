import express from 'express'
const Router = express.Router()
import { StatusCodes } from 'http-status-codes'
import { boardRoute } from './boardRoute.js'
import { columnRoute } from './columnRoute.js'
import { cardRoute } from './cardRoute.js'


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
Router.use('/boards', boardRoute)

/** Column APIs */
Router.use('/columns', columnRoute)

/** Board APIs */
Router.use('/cards', cardRoute)

export const APIs_V1 = Router