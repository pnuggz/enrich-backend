const testSocket = (io) => {
  const ioNsp = io.of('/test')

  ioNsp.on('connection', function (socket) {
    console.log('Client connected to /test namespace.');

    socket.emit("test", { test: "New SOcket" })

    // Disconnect listener
    socket.on('disconnect', function () {
      console.log('Client disconnected.');
    });
  });
}

export default testSocket