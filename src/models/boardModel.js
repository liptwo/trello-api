import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { BOARD_TYPES } from '~/utils/constants'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { columnModel } from './columnModel'
import { cardModel } from './cardModel'
import { pagingSkipValue } from '~/utils/algorithms'
import { userModel } from './userModel'

const BOARD_COLLECTION_NAME = 'boards'
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict(),
  slug: Joi.string().required().min(3).trim().strict(),
  description: Joi.string().required().min(3).max(256).trim().strict(),
  type: Joi.boolean().valid(BOARD_TYPES.PUBLIC, BOARD_TYPES.PRIVITE).required(),
  columnOrderIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),
  // admins của board
  ownerIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),
  // members của board
  memberIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE)
  ).default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ['_id', 'createdAt']


const createValidBoards = async (data) => {
  return await BOARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async ( data , userId) => {
  try {
    const validData = await createValidBoards(data)
    const newBoard = {
      ...validData,
      ownerIds: [new ObjectId(userId)]
    }
    return await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne(newBoard)
  } catch (error) { throw new Error(error) }
}

const findOneById = async( id ) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
    // console.log('result: ', result)
    return result
  } catch (error) { throw new Error(error) }
}
const getAllBoardsByUserID = async( userId, page, itemsPerPage ) => {
  try {

    const queryCondtions = [
      // điều kiện 1: Board Chưa bị xóa (_destroy = false)
      { _destroy: false },
      // điều kiện 2 user ID phải nằm 1 trong 2 cái ảmng ownerIds hoặc memberIds sử dụng toán tử $all của mongodb
      { $or: [
        // bỏ new ObjectId
        { ownerIds: { $all: [new ObjectId(userId)] } },
        { memberIds: { $all: [new ObjectId(userId)] } }
      ] }
    ]

    const query = await GET_DB().collection(BOARD_COLLECTION_NAME).aggregate([
      { $match: { $and: queryCondtions } },
      // sort title của board theo a-z mặc định bị chữ b hoa đứng trước a thưofng theo chuẩn bảng mã ASCII
      { $sort: { title: 1 } },
      // facet để xử lý nhiều luồng tỏng một query
      { $facet: {
        // luồng 1: query boards
        'queryBoards': [
          { $skip: pagingSkipValue(page, itemsPerPage) }, // bỏ qua số lượng bản ghi của page trước
          { $limit: itemsPerPage } // giới hạn tối đa số lượng bản ghi trả về 1 page
        ],
        // luồng 2: query đếm tổng số lượng bản ghi boards trong DB trả về biến countedAllBoards
        'queryTotalBoards': [{ $count: 'countedAllBoards' }]

      }}
    ],
    // khai báo thêm thuộc tính locale en để fix B hoa đứng trước a thường
    { collation: { locale: 'en' } } ).toArray()
    // console.log('query: ', query)
    // mongodb trả về mảng nhiều thành phần nhưng chính thì là query[0]
    const res = query[0]
    return {
      boards: res.queryBoards || [],
      totalBoards: res.queryTotalBoards[0]?.countedAllBoards || 0
    }
  } catch (error) { throw new Error(error) }
}

// Query tổng hợp (aggregate) lấy toàn bộ columns, cards thuộc về boards. sẽ có update sau,
const getDetails = async( id ) => {
  try {
    // const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({
    //   _id: new ObjectId(id)
    // })
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).aggregate([
      { $match: {
        _id: new ObjectId( id ),
        _destroy: false
      } },
      { $lookup: {
        from: columnModel.COLUMN_COLLECTION_NAME,
        localField: '_id',
        foreignField: 'boardId',
        as: 'columns'
      } },
      { $lookup: {
        from: cardModel.CARD_COLLECTION_NAME,
        localField: '_id',
        foreignField: 'boardId',
        as: 'cards'
      } },
      { $lookup: {
        from: userModel.USER_COLLECTION_NAME,
        localField: 'ownerIds',
        foreignField: '_id',
        as: 'owners',
        // pipeline trong lookup là để xử lý một hoặc nhiều luồng cần thiết
        // pipeline là một mảng các bước xử lý dữ liệu
        // nếu không lấy thì cho nó là 0
        // có thể sử dụng $project để chỉ lấy ra các trường cần thiết
        pipeline: [
          { $project: {
            'avatar': 1,
            'displayName': 1,
            '_id': 1
          } }
        ]
      } },
      { $lookup: {
        from: userModel.USER_COLLECTION_NAME,
        localField: 'memberIds',
        foreignField: '_id',
        as: 'members',
        pipeline: [
          { $project: {
            'avatar': 1,
            'displayName': 1,
            '_id': 1
          } }
        ]
      } }
    ]).toArray()
    // console.log(result)
    return result[0] || null
  } catch (error) { throw new Error(error) }
}

// nhiệm vụ của function này là cập nhập push giá trị column id vào mảng columnsOrderIds
const pushColumnOrderIds = async( column ) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(column.boardId) },
      { $push: { columnOrderIds: new ObjectId(column._id) } },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) { throw new Error(error) }
}

const update = async( boardId, updateData ) => {
  try {
    Object.keys(updateData).forEach( fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })
    // console.log('updateData: ', updateData)
    if ( updateData.columnOrderIds) {
      updateData.columnOrderIds = updateData.columnOrderIds.map(_id => new ObjectId(_id))
    }
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(boardId) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) { throw new Error(error) }
}

const pullColumnOrderIds = async( column ) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(column.boardId) },
      { $pull: { columnOrderIds: new ObjectId(column._id) } },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) { throw new Error(error) }
}

export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getDetails,
  pushColumnOrderIds,
  update,
  pullColumnOrderIds,
  getAllBoardsByUserID
}