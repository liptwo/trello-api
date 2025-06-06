/* eslint-disable no-useless-catch */
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
// import ApiError from '~/utils/ApiError'
// import { slugify } from '~/utils/fomartter'

const createNew = async ( reqBody ) => {
  try {
    const createdCard = await cardModel.createNew(reqBody)
    const getNewCard = await cardModel.findOneById(createdCard.insertedId)
    if ( getNewCard ) {
      await columnModel.pushCardOrderIds(getNewCard)
    }
    return getNewCard
  } catch (error) { throw error }
}

export const cardService = {
  createNew
}