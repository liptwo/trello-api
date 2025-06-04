import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const CARD_COLLECTION_NAME = 'cards'
const CARD_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().min(3).pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  columnId:  Joi.string().required().min(3).pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().optional(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const createValidColumns = async (data) => {
  return await CARD_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async ( data ) => {
  try {
    const validData = await createValidColumns(data)
    // console.log('validata: ', validData)\
    const addNewCard = {
      ...validData,
      boardId: new ObjectId(validData.boardId),
      columnId: new ObjectId(validData.columnId)
    }

    return await GET_DB().collection(CARD_COLLECTION_NAME).insertOne(addNewCard)
  } catch (error) { throw new Error(error) }
}

const findOneById = async( id ) => {
  try {
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOne({
      _id: new ObjectId(id)
    })
    // console.log('result: ', result)
    return result
  } catch (error) { throw new Error(error) }
}
const INVALID_UPDATE_FIELDS = ['_id', 'createdAt']
const update = async( cardId, updateData ) => {
  try {
    Object.keys(updateData).forEach( fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })
    // console.log('updateData: ', updateData)
    if ( updateData.columnId) updateData.columnId = new ObjectId(updateData.columnId)
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(cardId) },
      { $set: updateData },
      { returnDocumnent: 'after' }
    )
    return result
  } catch (error) { throw new Error(error) }
}

const deleteManyByColumnId = async( columnId ) => {
  try {
    const result = await GET_DB().collection(CARD_COLLECTION_NAME).deleteMany({
      columnId: new ObjectId(columnId)
    })
    console.log('🚀 ~ :68 ~ result ~ result:', result)
    // console.log('result: ', result)
    return result
  } catch (error) { throw new Error(error) }
}


export const cardModel = {
  CARD_COLLECTION_NAME,
  CARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  update,
  deleteManyByColumnId
}