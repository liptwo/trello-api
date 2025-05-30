/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
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

    return boardDetail
  } catch (error) { throw error }
}
export const boardService = {
  createNew,
  getDetails
}