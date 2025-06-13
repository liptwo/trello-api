import express from 'express'
const Router = express.Router()
import { boardValidation } from '~/validations/boardValidation.js'
import { boardController } from '~/controllers/boardController.js'
import { authMiddleware } from '~/middlewares/authMiddlewares'


Router.route('/')
  .get(authMiddleware.isAuthorized, (req, res) => {
    res.status(200).json({
      message: 'Note: Api get all boards'
    })
  })
  .post(authMiddleware.isAuthorized, boardValidation.createNew, boardController.createNew)


Router.route('/support/moving_card')
  .put(authMiddleware.isAuthorized, boardValidation.moveCardOutColumn, boardController.moveCardOutColumn)// dùng để update

Router.route('/:id')
  .get(authMiddleware.isAuthorized, boardController.getDetails)
  .put(authMiddleware.isAuthorized, boardValidation.update, boardController.update)
export const boardRoute = Router