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

const getInvitations = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const resInvitation = await invitationService.getInvitations(userId)
    // console.log('resInvitation control:', resInvitation)
    res.status(StatusCodes.OK).json(resInvitation)
  } catch (error) { next(error) }
}
const updateBoardInvitation = async (req, res, next) => {
  try {
    const userId = req.jwtDecoded._id
    const { invitationId } = req.params
    const { status } = req.body
    const resInvitation = await invitationService.updateBoardInvitation(userId, invitationId, status)
    // console.log('resInvitation control:', resInvitation)
    res.status(StatusCodes.OK).json(resInvitation)
  } catch (error) { next(error) }
}

export const invitationController = {
  createBoardInvitation,
  getInvitations,
  updateBoardInvitation
}