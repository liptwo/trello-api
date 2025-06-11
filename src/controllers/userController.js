/* eslint-disable no-console */

import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/userService'


const createNew = async (req, res, next) => {

  try {
    //Điều hướng dữ liệu sang tầng service
    const createdColumn = await userService.createNew(req.body)

    //Có kết quả thì trả về client
    res.status(StatusCodes.CREATED).json(createdColumn)
  } catch (error) { next(error) }
}

const verifyAccount = async (req, res, next) => {
  try {
    const result = await userService.verifyAccount(req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

const login = async (req, res, next) => {
  try {
    const result = await userService. login(req.body)

    // xử lý trả về http only cookie cho phía trình duyệt
    console. log (result)

    res.status(StatusCodes.OK).json(result)
  } catch (error) { next(error) }
}

export const userController = {
  createNew,
  verifyAccount,
  login
}