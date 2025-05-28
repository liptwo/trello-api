/* eslint-disable no-console */

import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'


const createNew = async (req, res, next) => {

  try {
    // console.log(req.body)

    // throw new ApiError(StatusCodes.BAD_GATEWAY, 'Lỗi')
    //Điều hướng dữ liệu sang tầng service

    //Có kết quả thì trả về client
    res.status(StatusCodes.CREATED).json({
      message: 'Post From Controller Board created'
    })
  } catch (error) {
    // console.log(error)
    next(error)
  }
}


export const boardController = {
  createNew
}