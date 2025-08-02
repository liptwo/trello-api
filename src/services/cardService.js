/* eslint-disable no-useless-catch */
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import { CloudinaryProvider } from '~/providers/CloudinaryProvider'
import pickDominantColor from '~/utils/pickDominantColor'
// import ApiError from '~/utils/ApiError'
// import { slugify } from '~/utils/fomartter'

const createNew = async (reqBody) => {
  try {
    const createdCard = await cardModel.createNew(reqBody)
    const getNewCard = await cardModel.findOneById(createdCard.insertedId)
    if (getNewCard) {
      await columnModel.pushCardOrderIds(getNewCard)
    }
    return getNewCard
  } catch (error) {
    throw error
  }
}

const update = async (cardId, reqBody, coverImg, userInfo) => {
  try {
    // console.log(reqBody)
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    let updateCard = {}
    if (coverImg) {
      // trường hợp coverImg xử lý upload ảnh lên cloundinary
      const uploadResult = await CloudinaryProvider.streamUpload(
        coverImg.buffer,
        'cards-trello'
      )
      // console.log(uploadResult)
      updateData.dominantColor = await pickDominantColor(
        uploadResult.secure_url
      )
      // lưu url của file ảnh vào database
      updateData.cover = uploadResult.secure_url
      updateCard = await cardModel.update(cardId, updateData)
    }
    else if (updateData.commentToAdd) {
      const commentData = {
        ...updateData.commentToAdd,
        commentedAt: Date.now(),
        userId: userInfo._id,
        userEmail: userInfo.email
      }
      // console.log('Comment Dâta', commentData)
      updateCard = await cardModel.unshiftNewComment(cardId, commentData)
    }
    else if (updateData.addMemberData) {
      updateCard = await cardModel.updateMembers(cardId, updateData.addMemberData)
      // console.log(updateData)
      // // const { cardId, memberId, action } = req.body
      // if (updateData.action === 'add') {
      //   updateCard = await cardModel.updateOne({ _id: cardId }, { $addToSet: { memberIds: updateData.memberId } })
      //   console.log('add update', updateData)
      // } else if (updateData.action === 'remove') {
      //   updateCard = await cardModel.updateOne({ _id: cardId }, { $pull: { memberIds: updateData.memberId } })
      // }
      // console.log('updateData: ', updateData)
    }
    else {
      updateCard = await cardModel.update(cardId, updateData)
    }

    return updateCard.value
  } catch (error) {
    throw error
  }
}

export const cardService = {
  createNew,
  update
}
