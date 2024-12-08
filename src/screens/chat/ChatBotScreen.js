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
import { chatDiscussion } from '../api/GeminiService'; // API được xây dựng trước đó
import CompareModal from "../../components/CompareModal";
import Icon from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import { BASE_URL } from '../api/config';

const ChatScreen = ({ route }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProductsState] = useState([]);
  // const products = [
  //   { id: "1", name: "Sản phẩm A" },
  //   { id: "2", name: "Sản phẩm B" },
  //   { id: "3", name: "Sản phẩm C" },
  //   { id: "4", name: "Sản phẩm D" },
  // ];


  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}products`);
      setProductsState(response.data.data.content);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Lỗi', 'Không thể tải dữ liệu sản phẩm.');
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const handleCompare = (id1, id2) => {
    setSelectedProducts([id1, id2]);
    sendMessageCompa(`Hãy so sánh 2 sản phẩm ${id1} và ${id2}`, true);
    setSelectedProducts([])
  };


  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef(null);

  const sendMessageCompa = async (message, isComparing = false) => {
    if (isComparing) {
      const comparingMessage = {
        id: Date.now().toString(),
        text: 'Hãy so sánh 2 sản phẩm trên',
        isSender: true,
      };
      setMessages((prevMessages) => [...prevMessages, comparingMessage]);
      try {
        const responseText = await chatDiscussion(message.trim()); // Gửi đến API
        const botMessage = {
          id: (Date.now() + 1).toString(),
          text: responseText,
          isSender: false,
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } catch (error) {
        console.error('Error sending message:', error);
        const errorMessage = {
          id: (Date.now() + 2).toString(),
          text: 'Lỗi khi gửi tin nhắn. Vui lòng thử lại.',
          isSender: false,
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }

      setInputText('');
    }


  };
  const sendMessage = async () => {
    if (inputText.trim()) {
      // Hiển thị tin nhắn của người dùng
      const userMessage = {
        id: Date.now().toString(),
        text: inputText.trim(),
        isSender: true,
      };
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      try {
        const responseText = await chatDiscussion(inputText.trim()); // Gửi đến API Gemini
        const botMessage = {
          id: (Date.now() + 1).toString(),
          text: responseText,
          isSender: false,
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } catch (error) {
        console.error('Error sending message:', error);
        const errorMessage = {
          id: (Date.now() + 2).toString(),
          text: 'Lỗi khi gửi tin nhắn. Vui lòng thử lại.',
          isSender: false,
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }

      setInputText('');
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
      {selectedProducts.length === 2 && (
        <View>
          {messages.some((msg) => msg.text === 'Hãy so sánh 2 sản phẩm trên') && (
            <Text style={styles.comparingText}>Hãy so sánh 2 sản phẩm trên</Text>
          )}
        </View>
      )}
    </View>
  );

  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        showsVerticalScrollIndicator={false}
      />


      <View style={styles.inputContainer}>
        <TouchableOpacity style={{
          marginRight: 15,
          width: 50,
          height: 50,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 100,
          backgroundColor: '#fff',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.5,
          shadowRadius: 4,
          elevation: 4,
        }} onPress={() => setIsModalVisible(true)}>
          <Icon name="git-compare-outline" size={22} color="#3669c9" />
        </TouchableOpacity>
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
      <CompareModal
        visible={isModalVisible}
        products={products}
        onClose={() => setIsModalVisible(false)}
        onApply={handleCompare}
      />
      {selectedProducts.length === 2 && (
        <Text>
          Bạn đã chọn: {selectedProducts[0]} và {selectedProducts[1]}
        </Text>
      )}
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
