import { Client } from '@stomp/stompjs';


const useWebSocket = (url, onProductUpdate) => {
  const client = new Client({
    brokerURL: url,
    reconnectDelay: 0,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    appendMissingNULLonIncoming: true,
    logRawCommunication: true,
    forceBinaryWSFrames: true,
    debug: (str) => {
      // console.log('WS:' + str);
    },
    onConnect: () => {

      client.subscribe('/topic/products', message => {
        try {
          const updatedProduct = JSON.parse(message.body);
          onProductUpdate(updatedProduct); // Gọi callback với sản phẩm mới
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      }
      );
      client.subscribe('/topic/products/delete', message => {
        try {
          const deletedProduct = JSON.parse(message.body);
          onProductUpdate(deletedProduct); // Gọi callback với sản phẩm bị xóa
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      }
      )
    },
  });


  // Activate connection
  try {
    client.activate();
  } catch (error) {
    console.error('Error activating client:', error);
  }

  return client;
};

export default useWebSocket;
