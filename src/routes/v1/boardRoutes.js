import express from 'express'
const Router = express.Router()
import { StatusCodes } from 'http-status-codes'

Router.route('/')
  .get((req, res) => {
    res.status(200).json({
      message: 'Note: Api get all boards'
    })
  })
  .post((req, res) => {
    res.status(StatusCodes.CREATED).json({
      message: 'Board created'
    })
  }
  )
export const boardRoutes = Router