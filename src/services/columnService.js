/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import { boardModel } from '~/models/boardModel'
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import ApiError from '~/utils/ApiError'
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
const deleteItem = async ( columnId ) => {
  try {
    const targetColumn = await columnModel.findOneById(columnId)
    console.log('🚀 ~ columnService.js:34 ~ deleteItem ~ targetColumn:', targetColumn)

    if ( !targetColumn ) {
      throw new ApiError( StatusCodes.NOT_FOUND, 'Column Not Found!')
    }
    // xoa column
    await columnModel.deleteOneById( columnId )
    // xoa toan bo card thuoc column
    await cardModel.deleteManyByColumnId( columnId )
    // xoa columnId trong columnOrderIds cua board
    await boardModel.pullColumnOrderIds( targetColumn )
    return { deleteResult: 'Successfully delete column and card in it ' }
  } catch (error) { throw error }
}

export const columnService = {
  createNew,
  update,
  deleteItem
}