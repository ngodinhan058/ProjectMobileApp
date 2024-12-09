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

const ChatScreen = ({ navigation, route }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef(null);
  const webSocketClientRef = useRef(null); // Ref để lưu WebSocket client

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

    const webSocketClient = useWebSocket(socketUrl, handleNewMessage);
    webSocketClientRef.current = webSocketClient; // Lưu WebSocket client vào ref

    return () => {
      webSocketClient.deactivate(); // Đóng kết nối khi component unmount
    };
  }, []);

  // Lấy tin nhắn từ cơ sở dữ liệu khi mở màn hình
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}auth/messages?sender=admin@gmail.com&receiver=${email}`
        );
        const data = await response.json();
        const formattedMessages = data.map((msg) => ({
          id: msg.id,
          text: msg.content,
          isSender: msg.sender === 'admin@gmail.com',
        }));
        setMessages(formattedMessages);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [email]);

  // Gửi tin nhắn
  const sendMessage = () => {
    if (inputText.trim() && webSocketClientRef.current.connected) {
      const message = {
        sender: 'admin@gmail.com',
        receiver: email,
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
    padding: 10,
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
    fontSize: 16,
  },
  messageTextSender: {
    fontSize: 16,
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    padding: 10,
    backgroundColor: '#f1f1f1',
  },
  sendButton: {
    marginLeft: 10,
  },
});

export default ChatScreen;
