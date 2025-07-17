/* eslint-disable no-console */

import { StatusCodes } from 'http-status-codes'
import { invitationService } from '~/services/invitationService'


const createBoardInvitation = async (req, res, next) => {

  try {
    const inviterId = req.jwtDecoded._id
    const resInvitation = await invitationService.createBoardInvitation(req.body, inviterId)
    res.status(StatusCodes.CREATED).json(resInvitation)
  } catch (error) { next(error) }
}

export const invitationController = {
  createBoardInvitation
}