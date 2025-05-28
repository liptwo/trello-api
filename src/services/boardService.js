/* eslint-disable no-useless-catch */
import ApiError from '~/utils/ApiError'
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


    // Làm thêm các xử lý logic khác với các collection khác tùy đặc thù dự án... v.v
    // bắn email, notification về cho admin khi có 1 board mới được tạo.. v.v


    return newBoard
  } catch (error) { throw error }
}

export const boardService = {
  createNew
}