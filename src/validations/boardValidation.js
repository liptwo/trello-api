import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'


// dù fe có validate dữ liệu rồi nhưng be vẫn phải cần validate
// bắt buộc phải validate
const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict().messages({
      'any.required' : 'Title is required',
      'string.min' : 'Title min 3 chars',
      'string.max' : 'Title max 25 chars',
      'string.empty' : 'Title not allow to be empty',
      'string.trim' : 'Title must not have leading and whitespace'
    }),
    description: Joi.string().required().min(3).max(256).trim().strict().messages({
      'any.required' : 'Description is required',
      'string.min' : 'Description min 3 chars',
      'string.max' : 'Description max 256 chars',
      'string.empty' : 'Description not allow to be empty',
      'string.trim' : 'Description must not have leading and whitespace'
    })
  })

  try {
    // set AbortEarly để trường hợp có nhiều validation bị lỗi để trả về tất cả
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    // request không bị lỗi thì sẽ đi đến lệnh tiếp theo ở Controller
    next()
  } catch (error) {
    // chuyển về nơi hiển thị lỗi tập trung
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
    // console.log(error)
    // res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
    //   error: new Error(error).message
    // })
  }
}

export const boardValidation = {
  createNew
}