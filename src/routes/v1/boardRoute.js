import express from 'express'
const Router = express.Router()
import { boardValidation } from '~/validations/boardValidation.js'
import { boardController } from '~/controllers/boardController.js'
import { authMiddleware } from '~/middlewares/authMiddlewares'
import { multerUploadMiddlewares } from '~/middlewares/multerUploadMiddlewares'


Router.route('/')
  .get(authMiddleware.isAuthorized, boardController.getAllBoards) // dùng để lấy tất cả board của user
  .post(authMiddleware.isAuthorized, boardValidation.createNew, boardController.createNew)


Router.route('/support/moving_card')
  .put(authMiddleware.isAuthorized, boardValidation.moveCardOutColumn, boardController.moveCardOutColumn)// dùng để update

Router.route('/:id')
  .get(authMiddleware.isAuthorized, boardController.getDetails)
  .put(authMiddleware.isAuthorized, multerUploadMiddlewares.upload.single('boardBg'), boardValidation.update, boardController.update)
export const boardRoute = Router