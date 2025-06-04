import express from 'express'
const Router = express.Router()
import { boardValidation } from '~/validations/boardValidation.js'
import { boardController } from '~/controllers/boardController.js'


Router.route('/')
  .get((req, res) => {
    res.status(200).json({
      message: 'Note: Api get all boards'
    })
  })
  .post(boardValidation.createNew, boardController.createNew)


Router.route('/support/moving_card')
  .put(boardValidation.moveCardOutColumn, boardController.moveCardOutColumn)// dùng để update

Router.route('/:id')
  .get(boardController.getDetails)
  .put(boardValidation.update, boardController.update)
export const boardRoute = Router