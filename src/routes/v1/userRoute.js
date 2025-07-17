import express from 'express'
const Router = express.Router()
import { userValidation } from '~/validations/userValidation.js'
import { userController } from '~/controllers/userController.js'
import { authMiddleware } from '~/middlewares/authMiddlewares'
import { multerUploadMiddlewares } from '~/middlewares/multerUploadMiddlewares'


Router.route('/register')
  .post(userValidation.createNew, userController.createNew)

Router.route('/verify')
  .put(userValidation.verifyAccount, userController.verifyAccount)

Router.route('/login')
  .post(userValidation.login, userController.login)

Router.route('/logout')
  .delete(userController.logout)

Router.route('/refresh_token')
  .get(userController.refreshToken)

Router.route('/update')
  .put(
    authMiddleware.isAuthorized,
    multerUploadMiddlewares.upload.single('avatar'),
    userValidation.update,
    userController.update
  )



export const userRoute = Router