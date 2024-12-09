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
import useWebSocket from '../api/useWebSocket';
import { BASE_URL } from '../api/config';
import { SOCKET_URL } from '../api/config_onlyURL';
import { url } from '../api/url';


const ChatScreen = ({ navigation, route }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef(null);
  const webSocketClientRef = useRef(null);

  const { email } = route.params;


  // Hàm nhận tin nhắn từ WebSocket
  const handleNewMessage = (message) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: Date.now().toString(),
        text: message.content,
        isSender: message.sender === email,
      },
    ]);
  };

  // Kết nối WebSocket
  useEffect(() => {
    const socketUrl = `${SOCKET_URL}/ws`;
    // const socketUrl = `https://${url}/ws`;
    const webSocketClient = useWebSocket(socketUrl, handleNewMessage);
    webSocketClientRef.current = webSocketClient;

    return () => {
      webSocketClient.deactivate();
    };
  }, []);

  // Lấy tin nhắn từ cơ sở dữ liệu khi mở màn hình
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}auth/messages?sender=${email}&receiver=admin@gmail.com`
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

  // Gửi tin nhắn
  const sendMessage = () => {
    if (inputText.trim() && webSocketClientRef.current.connected) {
      const message = {
        sender: email,
        receiver: 'admin@gmail.com',
        content: inputText.trim(),
        timestamp: new Date().toISOString(),
      };

      webSocketClientRef.current.publish({
        destination: '/app/chat',
        body: JSON.stringify(message),
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: Date.now().toString(),
          text: inputText.trim(),
          isSender: true,
        },
      ]);
      setInputText('');
    } else {
      console.error('STOMP client is not connected or input is empty');
    }
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.isSender ? styles.sender : styles.receiver,
      ]}
    >
      <Text style={item.isSender ? styles.messageTextSender : styles.messageText}>
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
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nhập tin nhắn"
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
