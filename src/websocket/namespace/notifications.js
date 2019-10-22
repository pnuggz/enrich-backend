// const notificationSocket = {
//   socket: null
// }

// export const notificationSocket = (io) => {
//   const ioNsp = io.of('/test')

//   ioNsp.on('connection', function (socket) {
//     console.log('Client connected to /test namespace.');

//     // Disconnect listener
//     socket.on('disconnect', function () {
//       console.log('Client disconnected.');
//     });
//   });
// }

const testSocket2 = (io) => {
  const ioNsp = io.of('/test')

  ioNsp.on('connection', function (socket) {
    console.log('Client connected to 2nd /test namespace.');

    socket.emit("test2", { test: "New SOcket" })

    // Disconnect listener
    socket.on('disconnect', function () {
      console.log('Client disconnected.');
    });
  });
}

export default testSocket2