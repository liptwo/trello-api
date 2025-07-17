import express from 'express'
import { invitationController } from '~/controllers/invitationController'
const Router = express.Router()
import { authMiddleware } from '~/middlewares/authMiddlewares'
import { invitationValidation } from '~/validations/invitationValidation'


Router.route('/board')
  .post(authMiddleware.isAuthorized, invitationValidation.addUser, invitationController.addUserToBoard)
export const invitationsRoute = Router