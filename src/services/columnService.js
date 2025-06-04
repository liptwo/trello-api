/* eslint-disable no-useless-catch */
import { boardModel } from '~/models/boardModel'
import { columnModel } from '~/models/columnModel'
// import ApiError from '~/utils/ApiError'
// import { slugify } from '~/utils/fomartter'

const createNew = async ( reqBody ) => {
  try {
    const createdColumn = await columnModel.createNew(reqBody)
    const getNewColumn = await columnModel.findOneById(createdColumn.insertedId)
    if ( getNewColumn ) {
      getNewColumn.cards = []
      await boardModel.pushColumnOrderIds(getNewColumn)
    }
    return getNewColumn
  } catch (error) { throw error }
}

const update = async ( columnId, reqBody ) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedColumn = await columnModel.update( columnId, updateData )

    return updatedColumn
  } catch (error) { throw error }
}

export const columnService = {
  createNew,
  update
}