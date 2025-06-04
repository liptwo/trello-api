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

const update = async (req, res, next) => {
  try {
    // console.log(req.body)
    const boardId = req.params.id
    const updateBoard = await boardService.update(boardId, req.body)

    res.status(StatusCodes.OK).json(updateBoard)
  } catch (error) { next(error) }
}
const moveCardOutColumn = async (req, res, next) => {
  try {
    const result = await boardService.moveCardOutColumn( req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

export const boardController = {
  createNew,
  getDetails,
  update,
  moveCardOutColumn
}