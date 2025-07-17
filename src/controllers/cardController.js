/* eslint-disable no-console */

import { StatusCodes } from 'http-status-codes'
import { cardService } from '~/services/cardService'


const createNew = async (req, res, next) => {

  try {
    const createdCard = await cardService.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createdCard)
  } catch (error) { next(error) }
}
const update = async (req, res, next) => {

  try {
    const cardId = req.params.id
    const coverImg = req.file
    const userInfo = req.jwtDecoded
    // console.log('req: ', req)
    const updateCard = await cardService.update(cardId, req.body, coverImg, userInfo)
    res.status(StatusCodes.CREATED).json(updateCard)
  } catch (error) { next(error) }
}

export const cardController = {
  createNew,
  update
}