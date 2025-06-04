import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { BOARD_TYPES } from '~/utils/constants'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'


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
    }),
    type: Joi.boolean().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVITE).required()
  })

  try {
    // set AbortEarly để trường hợp có nhiều validation bị lỗi để trả về tất cả
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    // request không bị lỗi thì sẽ đi đến lệnh tiếp theo ở Controller
    next()
  } catch (error) {
    // chuyển về nơi hiển thị lỗi tập trung
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

const update = async (req, res, next) => {
  // khong dung .required() trong truong hop update
  const correctCondition = Joi.object({
    title: Joi.string().min(3).max(50).trim().strict(),
    description: Joi.string().min(3).max(256).trim().strict(),
    type: Joi.boolean().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVITE),
    columnOrderIds: Joi.array().items(
      Joi.string().pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE)
    )
  })

  try {
    // set AbortEarly để trường hợp có nhiều validation bị lỗi để trả về tất cả
    await correctCondition.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: true
    })
    // request không bị lỗi thì sẽ đi đến lệnh tiếp theo ở Controller
    next()
  } catch (error) {
    // chuyển về nơi hiển thị lỗi tập trung
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}
const moveCardOutColumn = async (req, res, next) => {
  // khong dung .required() trong truong hop update
  const correctCondition = Joi.object({
    currentCardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    prevColumnId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    preCardOrderIds: Joi.array().items(
      Joi.string().pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE)
    ),
    nextColumnId: Joi. string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    nextCardOrderIds: Joi.array().items(
      Joi.string().pattern(OBJECT_ID_RULE)
        .message(OBJECT_ID_RULE_MESSAGE)
    )
  })

  try {
    // set AbortEarly để trường hợp có nhiều validation bị lỗi để trả về tất cả
    await correctCondition.validateAsync(req.body, {
      abortEarly: false
    })
    // request không bị lỗi thì sẽ đi đến lệnh tiếp theo ở Controller
    next()
  } catch (error) {
    // chuyển về nơi hiển thị lỗi tập trung
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const boardValidation = {
  createNew,
  update,
  moveCardOutColumn
}