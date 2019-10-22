import websocket from "../websocket"

const socketIoLoader = ({ io }) => {
  websocket({ io: io })
}

export default socketIoLoader;