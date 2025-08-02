/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { boardModel } from '~/models/boardModel'
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
import { CloudinaryProvider } from '~/providers/CloudinaryProvider'
import ApiError from '~/utils/ApiError'
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from '~/utils/constants'
// import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/fomartter'
import pickDominantColor from '~/utils/pickDominantColor'

const createNew = async ( reqBody, userId ) => {
  try {

    // xử lý logic dữ liệu tùy đặc thù dự án
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }


    // gọi tới thằng model để xử lý lưu bản ghi vào db
    //...
    const createdBoard = await boardModel.createNew(newBoard, userId)

    // lấy bảng ghi board sau khi gọi (tùy mục đích dự án)
    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)

    // console.log(getNewBoard)
    // Làm thêm các xử lý logic khác với các collection khác tùy đặc thù dự án... v.v
    // bắn email, notification về cho admin khi có 1 board mới được tạo.. v.v
    if ( getNewBoard ) {
      getNewBoard.columns = []
    }

    return getNewBoard
  } catch (error) { throw error }
}
const getAllBoards = async ( userId, page, itemsPerPages, queryFilters ) => {
  try {
    // xử lý logic dữ liệu tùy đặc thù dự án
    if ( !page ) { page = DEFAULT_PAGE }
    if ( !itemsPerPages ) { itemsPerPages = DEFAULT_ITEMS_PER_PAGE }
    const resultListBoard = await boardModel.getAllBoards(userId, parseInt(page, 10), parseInt(itemsPerPages, 10), queryFilters)


    // console.log(getNewBoard)
    // Làm thêm các xử lý logic khác với các collection khác tùy đặc thù dự án... v.v
    // bắn email, notification về cho admin khi có 1 board mới được tạo.. v.v

    return resultListBoard
  } catch (error) { throw error }
}

const getDetails = async ( boardId ) => {
  try {
    const boardDetail = await boardModel.getDetails( boardId )
    if ( !boardDetail ) { throw new ApiError( StatusCodes.NOT_FOUND, 'Board Not Found!') }

    //b1: cloneDeep tạo ra board mới không ảnh hưởng mảng cũ tùy mục đích
    const resBoard = cloneDeep(boardDetail)
    //b2: đưa card về đúng columns
    resBoard.columns.forEach( column => {
      // cách 1 convert ObjectID về string bằng toString của javascript
      // column.cards = resBoard.cards.filter(card => card.columnId.toString() === column._id.toString())
      // cách 2 equal được mongodb support hàm equals cho ObjectID
      column.cards = resBoard.cards.filter(card => card.columnId.equals(column._id))
    }
    )
    //B3: xóa mảng card khỏi ngang hàng
    delete resBoard.cards

    return resBoard
  } catch (error) { throw error }
}

const update = async ( boardId, reqBody, boardBg ) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }

    if ( boardBg ) {
      // trường hợp coverImg xử lý upload ảnh lên cloundinary
      const uploadResult = await CloudinaryProvider.streamUpload(boardBg.buffer, 'boards-trello')
      // console.log(uploadResult)
      updateData.domicantColor = await pickDominantColor(uploadResult.secure_url)
      // lưu url của file ảnh vào database
      updateData.boardBg = uploadResult.secure_url
    }

    const updatedBoard = await boardModel.update( boardId, updateData )

    return updatedBoard
  } catch (error) { throw error }
}

const moveCardOutColumn = async ( reqBody ) => {
  try {
    // * Khi di chuyển card sang Column khác:
    // * B1: Cập nhật mang cardOrderIds của Column ban đầu chứa nó (Hiểu bản chất là xóa cái id của Card ra khoir
    // mằng)
    await columnModel.update( reqBody.prevColumnId, {
      cardOrderIds: reqBody.preCardOrderIds,
      updatedAt: Date.now()
    })
    // * B2: Cập nhật mảng cardOrderIds của Column tiếp theo (Hiểu bản chất là thêm _id của Card vào mằng)
    await columnModel.update( reqBody.nextColumnId, {
      cardOrderIds: reqBody.nextCardOrderIds,
      updatedAt: Date.now()
    })
    // * B3: Cập nhật lại trường columnId mới của cái Card đã kéo
    await cardModel.update( reqBody.currentCardId, {
      columnId: reqBody.nextColumnId,
      updatedAt: Date.now()
    })
    // * => Làm một API support riêng.
    // const result = await boardModel.deteleColumn(reqBody)
    // const result = await boardModel.deteleColumn(reqBody)
    return { updateResult: 'Successfully!' }
  } catch (error) { throw error }
}

export const boardService = {
  createNew,
  getDetails,
  update,
  moveCardOutColumn,
  getAllBoards
}