import express from 'express'
import { invitationController } from '~/controllers/invitationController'
const Router = express.Router()
import { authMiddleware } from '~/middlewares/authMiddlewares'
import { invitationValidation } from '~/validations/invitationValidation'

Router.route('/board').post(
  authMiddleware.isAuthorized,
  invitationValidation.createBoardInvitation,
  invitationController.createBoardInvitation
)

Router.route('/board/:invitationId').put(
  authMiddleware.isAuthorized,
  invitationController.updateBoardInvitation
)
// get inviations by user
Router.route('/').get( authMiddleware.isAuthorized, invitationController.getInvitations)

export const invitationsRoute = Router
