import testSocket from "./namespace/test"
import testSocket2 from "./namespace/notifications"

const websocket = ({ io }) => {
  testSocket(io)
  testSocket2(io)
};

export default websocket;