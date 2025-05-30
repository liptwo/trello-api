/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
// import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/fomartter'

const createNew = async ( reqBody ) => {
  try {

    // xử lý logic dữ liệu tùy đặc thù dự án
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }


    // gọi tới thằng model để xử lý lưu bản ghi vào db
    //...
    const createdBoard = await boardModel.createNew(newBoard)

    // lấy bảng ghi board sau khi gọi (tùy mục đích dự án)
    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)

    // console.log(getNewBoard)
    // Làm thêm các xử lý logic khác với các collection khác tùy đặc thù dự án... v.v
    // bắn email, notification về cho admin khi có 1 board mới được tạo.. v.v


    return getNewBoard
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
export const boardService = {
  createNew,
  getDetails
}