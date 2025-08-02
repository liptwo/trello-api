import express from 'express'
const Router = express.Router()
import { cardValidation } from '~/validations/cardValidation.js'
import { cardController } from '~/controllers/cardController.js'
import { authMiddleware } from '~/middlewares/authMiddlewares'
import { multerUploadMiddlewares } from '~/middlewares/multerUploadMiddlewares'


Router.route('/')
  .post(authMiddleware.isAuthorized, cardValidation.createNew, cardController.createNew)

Router.route('/:id')
  .put(authMiddleware.isAuthorized,
    multerUploadMiddlewares.upload.single('cover'),
    cardValidation.update,
    cardController.update)

export const cardRoute = Router