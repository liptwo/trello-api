/* eslint-disable no-console */

import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'
// import ApiError from '~/utils/ApiError'


const createNew = async (req, res, next) => {

  try {
    //Điều hướng dữ liệu sang tầng service
    const createdBoard = await boardService.createNew(req.body)

    //Có kết quả thì trả về client
    res.status(StatusCodes.CREATED).json(createdBoard)
  } catch (error) { next(error) }
}


const getDetails = async (req, res, next) => {
  try {
    const boardId = req.params.id
    //Điều hướng dữ liệu sang tầng service
    const board = await boardService.getDetails(boardId)

    res.status(StatusCodes.OK).json(board)
  } catch (error) { next(error) }
}

export const boardController = {
  createNew,
  getDetails
}