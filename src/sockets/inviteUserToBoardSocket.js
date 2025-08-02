// params socket se duoc lay tu thu vien socket io
export const inviteUserToBoardSocket = (socket) => {
  // console.log('a user connected', socket.id)
  // lắng nghe sự kiện FE_USER_INVITED_TO_BOARD mà client emit lên
  socket.on('FE_USER_INVITED_TO_BOARD', (invitation) => {
    // cách làm nhanh là emit ngược lại một sự kiện về cho mọi client trừ thằng
    // gửi request lên, rồi để phía FE check
    socket.broadcast.emit('BE_USER_INVITED_TO_BOARD', invitation)
  })
}