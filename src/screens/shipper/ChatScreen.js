// import React, { useState, useEffect, useRef } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   TextInput,
//   TouchableOpacity,
//   Image,
//   StyleSheet,
// } from 'react-native';
// import { Client as StompClient } from '@stomp/stompjs';
// import SockJS from 'sockjs-client';
// import axios from 'axios';
// import { BASE_URL } from '../api/config_onlyURL';

// const ChatScreen = ({ navigation, route }) => {
//   const [messages, setMessages] = useState([]);
//   const [inputText, setInputText] = useState('');
//   const flatListRef = useRef(null);
//   const stompClientRef = useRef(null);
//   const { id, userFirstName, userLastName } = route.params;

//   // console.log("User ID:", id);

//   // Lấy tin nhắn từ cơ sở dữ liệu
//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const response = await fetch(
//           `${BASE_URL}api/chat/messages?senderId=${id}&receiverId=4e98028c-2157-4568-a9bc-c21033bad79a`
//         );
//         // console.log("lnik",response);

//         const data = await response.json();

//         // Định dạng tin nhắn
//         const formattedMessages = data.map((msg) => ({
//           id: msg.id,
//           text: msg.content,
//           isSender: msg.sender.userId === id, // Kiểm tra người gửi
//         }));

//         setMessages(formattedMessages);
//       } catch (error) {
//         console.error('Error fetching messages:', error);
//       }
//     };

//     fetchMessages();
//   }, [id]);

//   // Kết nối WebSocket
//   useEffect(() => {
//     const socketUrl = `${BASE_URL}ws/chat`;
//     const stompClient = new StompClient({
//       brokerURL: socketUrl,
//       connectHeaders: {},
//       debug: (str) => console.log(str),
//       reconnectDelay: 5000,
//       heartbeatIncoming: 4000,
//       heartbeatOutgoing: 4000,
//       webSocketFactory: () => new SockJS(socketUrl),
//     });

//     stompClient.onConnect = () => {
//       console.log('Connected to WebSocket');
//       stompClient.subscribe('/topic/messages', (messageOutput) => {
//         const message = JSON.parse(messageOutput.body);
//         setMessages((prevMessages) => [
//           ...prevMessages,
//           {
//             id: message.id,
//             text: message.content,
//             isSender: message.sender.userId === id,
//           },
//         ]);
//       });
//     };

//     stompClient.onStompError = (error) => {
//       console.error('STOMP Error:', error);
//     };

//     stompClient.activate();
//     stompClientRef.current = stompClient;

//     return () => {
//       stompClient.deactivate();
//     };
//   }, [id]);

//   // Gửi tin nhắn
//   const sendMessage = () => {
//     if (inputText.trim()) {
//       const message = {
//         sender: { userId: id },
//         receiver: { userId: '4e98028c-2157-4568-a9bc-c21033bad79a' },
//         content: inputText.trim(),
//         timestamp: new Date().toISOString(),
//       };

//       if (stompClientRef.current && stompClientRef.current.connected) {
//         stompClientRef.current.publish({
//           destination: '/app/chat',
//           body: JSON.stringify(message),
//         });

//         // Cập nhật tin nhắn ngay lập tức trong giao diện
//         setMessages((prevMessages) => [
//           ...prevMessages,
//           { id: Date.now().toString(), text: inputText, isSender: true },
//         ]);

//         setInputText('');
//       } else {
//         console.error('STOMP client is not connected');
//       }
//     }
//   };

//   const renderMessage = ({ item }) => (
//     <View
//       style={[
//         styles.messageContainer,
//         item.isSender ? styles.sender : styles.receiver,
//       ]}
//     >
//       <Text
//         style={item.isSender ? styles.messageTextSender : styles.messageText}
//       >
//         {item.text}
//       </Text>
//     </View>
//   );

//   useEffect(() => {
//     if (messages.length > 0) {
//       flatListRef.current.scrollToEnd({ animated: true });
//     }
//   }, [messages]);

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.headerContainer}>
//         <TouchableOpacity
//           style={styles.backButton}
//           onPress={() => navigation.goBack()}
//         >
//           <Text style={{ fontSize: 20 }}>{"<"}</Text>
//         </TouchableOpacity>
//         <View style={styles.headerTextContainer}>
//           <Text style={styles.headerTitle}>Chat Với Admin</Text>
//           <View style={styles.onlineStatusContainer}>
//             <View style={styles.onlineDot} />
//             <Text style={styles.onlineText}>Online</Text>
//           </View>
//         </View>
//       </View>

//       {/* Messages */}
//       <FlatList
//         ref={flatListRef}
//         data={messages}
//         renderItem={renderMessage}
//         keyExtractor={(item) => item.id}
//         showsVerticalScrollIndicator={false}
//       />

//       {/* Input */}
//       <View style={styles.inputContainer}>
//         <TextInput
//           style={styles.input}
//           placeholder="Nhập Tin Nhắn Của Bạn"
//           value={inputText}
//           onChangeText={setInputText}
//         />
//         <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
//           <Image
//             source={require('../../assets/send.png')}
//             style={{ width: 20, height: 20 }}
//           />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     paddingTop: 10,
//     paddingBottom: 10,
//     paddingHorizontal: 10,
//   },
//   headerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 20,
//     paddingVertical: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f1f1f1',
//     backgroundColor: '#fff',
//     marginBottom: 10,
//   },
//   backButton: {
//     paddingRight: 10,
//   },
//   headerTextContainer: {
//     flexDirection: 'column',
//     marginLeft: 10,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#3669c9',
//   },
//   onlineStatusContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   onlineDot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     backgroundColor: 'green',
//     marginRight: 5,
//   },
//   onlineText: {
//     color: 'green',
//   },
//   messageContainer: {
//     padding: 15,
//     borderRadius: 20,
//     marginVertical: 5,
//     maxWidth: '75%',
//   },
//   sender: {
//     backgroundColor: '#3669ff',
//     alignSelf: 'flex-end',
//   },
//   receiver: {
//     backgroundColor: '#f1f1f1',
//     alignSelf: 'flex-start',
//   },
//   messageText: {
//     color: '#000',
//     fontSize: 16,
//   },
//   messageTextSender: {
//     color: '#fff',
//     fontSize: 16,
//   },
//   inputContainer: {
//     position: 'relative',
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 10,
//   },
//   input: {
//     flex: 1,
//     borderRadius: 50,
//     paddingVertical: 15,
//     paddingHorizontal: 15,
//     backgroundColor: '#fff',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.5,
//     shadowRadius: 4,
//     elevation: 4,
//   },
//   sendButton: {
//     position: 'absolute',
//     right: '6%',
//   },
//   sendButtonText: {
//     color: '#fff',
//     fontSize: 16,
//   },
// });
// export default ChatScreen;
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { Client as StompClient } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import Icon from 'react-native-vector-icons/FontAwesome';

const ChatScreen = ({ navigation, route }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef(null);
  const stompClientRef = useRef(null);

  const { email, userFirstName, userLastName } = route.params;
  console.log("idádasd", email);

  // Lấy tin nhắn từ cơ sở dữ liệu
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `http://192.168.219.16:8080/api/chat/messages?sender=${email}&receiver=admin@gmail.com`
        );
        const data = await response.json();
        const formattedMessages = data.map((msg) => ({
          id: msg.id,
          text: msg.content,
          isSender: msg.sender === email,
        }));
        setMessages(formattedMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, []);

  // Kết nối WebSocket
  useEffect(() => {
    const socketUrl = 'http://192.168.219.16:8080/ws/chat';
    const stompClient = new StompClient({
      brokerURL: socketUrl,
      connectHeaders: {},
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      webSocketFactory: () => new SockJS(socketUrl),
    });

    stompClient.onConnect = () => {
      console.log('Connected to WebSocket');
      stompClient.subscribe('/topic/messages', (messageOutput) => {
        const message = JSON.parse(messageOutput.body);
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            id: Date.now().toString(),
            text: message.content,
            isSender: message.sender === email,
          },
        ]);
      });
    };

    stompClient.onStompError = (error) => {
      console.error('STOMP Error:', error);
    };

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      stompClient.deactivate();
    };
  }, []);

  const sendMessage = () => {
    if (inputText.trim()) {
      const message = {
        sender: email,
        receiver: 'admin@gmail.com',
        content: inputText.trim(),
        timestamp: new Date().toISOString(),
      };

      if (stompClientRef.current && stompClientRef.current.connected) {
        stompClientRef.current.publish({
          destination: '/app/chat',
          body: JSON.stringify(message),
        });
        setInputText('');
      } else {
        console.error('STOMP client is not connected');
      }
    }
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.isSender ? styles.sender : styles.receiver,
      ]}
    >
      <Text
        style={item.isSender ? styles.messageTextSender : styles.messageText}
      >
        {item.text}
      </Text>
    </View>
  );

  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="angle-left" size={30} color="#000" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Chat With Admin </Text>
          <View style={styles.onlineStatusContainer}>
            <View style={styles.onlineDot} />
            <Text style={styles.onlineText}>Online</Text>
          </View>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nhập Tin Nhắn Của Bạn"
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Image
            source={require('../../assets/send.png')}
            style={{ width: 20, height: 20 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  backButton: {
    paddingRight: 10,
  },
  headerTextContainer: {
    flexDirection: 'column',
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3669c9',
  },
  onlineStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'green',
    marginRight: 5,
  },
  onlineText: {
    color: 'green',
  },
  messageContainer: {
    padding: 15,
    borderRadius: 20,
    marginVertical: 5,
    maxWidth: '75%',
  },
  sender: {
    backgroundColor: '#3669ff',
    alignSelf: 'flex-end',
  },
  receiver: {
    backgroundColor: '#f1f1f1',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: '#000',
    fontSize: 16,
  },
  messageTextSender: {
    color: '#fff',
    fontSize: 16,
  },
  inputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  input: {
    flex: 1,
    borderRadius: 50,
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  sendButton: {
    position: 'absolute',
    right: '6%',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ChatScreen;
