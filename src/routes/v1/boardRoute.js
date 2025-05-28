import express from 'express'
const Router = express.Router()
import { StatusCodes } from 'http-status-codes'
import { boardValidation } from '~/validations/boardValidation.js'
import { boardController } from '~/controllers/boardController.js'


Router.route('/')
  .get((req, res) => {
    res.status(200).json({
      message: 'Note: Api get all boards'
    })
  })
  .post(boardValidation.createNew, boardController.createNew)

export const boardRoute = Router