

// những domain được phép truy cập tới tài nguyên của server
export const WHITELIST_DOMAINS = [
  // 'http://localhost:5173' xoa thằng này vi configcors cũng đã cho dev chạy qua rồi
  // vv ví dụ sau này sẽ deploy lên   domain chính thức ...vv

]

export const BOARD_TYPES = {
  PUBLIC:'public',
  PRIVITE:'private'
}