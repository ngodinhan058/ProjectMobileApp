import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ChatScreen = ({ navigation }) => {
    const [messages, setMessages] = useState([
        { id: '1', text: 'Chào admin, bạn có thể kiểm tra đơn hàng #fff được không?', isSender: true },
        { id: '2', text: 'Bạn chờ trong giây lát nhé!', isSender: false },
        { id: '3', text: 'Hiện tại, tình trạng đơn hàng đã nhận giao hàng. Bạn có vấn đề gì trong quá trình vận chuyển?', isSender: false },
        { id: '4', text: 'Shipper có giao hàng đến nơi nhưng gọi không bắt máy.', isSender: true },
    ]);
    const [inputText, setInputText] = useState('');
    const flatListRef = useRef(null);

    const renderMessage = ({ item }) => {
        return (
            <View style={[styles.messageContainer, item.isSender ? styles.sender : styles.receiver]}>
                <Text style={item.isSender ? styles.messageTextSender : styles.messageText}>{item.text}</Text>
            </View>
        );
    };
    // Gửi tin nhắn local
    const sendMessage = () => {
        if (inputText.trim()) {
            setMessages(prevMessages => [
                ...prevMessages,
                { id: (prevMessages.length + 1).toString(), text: inputText, isSender: true }
            ]);
            setInputText('');
        }
    };
    // Tự động cuộn đến cuối khi có tin nhắn mới
    useEffect(() => {
        if (messages.length > 0) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name="angle-left" size={30} color="#000" />
                </TouchableOpacity>
                <View style={styles.headerTextContainer}>
                    <Text style={styles.headerTitle}>Chat</Text>
                    <View style={styles.onlineStatusContainer}>
                        <View style={styles.onlineDot} />
                        <Text style={styles.onlineText}>Online</Text>
                    </View>
                </View>
            </View>

            {/* FlatList for messages */}
            <FlatList
                ref={flatListRef} // Gắn tham chiếu cho FlatList
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })} // Tự cuộn khi có thay đổi nội dung
            />

            {/* Input section */}
            {/* <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Write your message"
                    value={inputText}
                    onChangeText={setInputText}
                />
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                    <Text style={styles.sendButtonText}><Icon name="send" size={20} color="#fff" /></Text>
                </TouchableOpacity>
            </View> */}
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Nhập Tin Nhắn Của Bạn"
                    value={inputText}
                    onChangeText={setInputText}
                />
                <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
                    <Image source={require('../../assets/send.png')} style={{ width: 20, height: 20 }}/>
                </TouchableOpacity>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 30,
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
