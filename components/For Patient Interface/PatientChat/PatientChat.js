import React, { useCallback, useEffect, useRef, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Image
} from 'react-native';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import axios from 'axios';
import { ip } from '../../../ContentExport';
import { useNavigation, useRoute } from '@react-navigation/native';
import sd from '../../../utils/styleDictionary';
import { TextInput, Avatar, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import io from 'socket.io-client';

const PatientChat = () => {
  const theme = useTheme();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const route = useRoute();
  const { userId } = route.params;
  const scrollViewRef = useRef(null);
  const navigation = useNavigation();
  
  const MEDICAL_SECRETARY_NAME = "Medical Secretary";
  const MEDICAL_SECRETARY_AVATAR = "https://cdn-icons-png.flaticon.com/512/3209/3209202.png"; // Default medical icon

  useEffect(() => {
    if (!userId) {
      console.error('User ID is not defined.');
      return;
    }

    const newSocket = io(ip.address, { transports: ['websocket'], cors: { origin: '*' } });
    setSocket(newSocket);

    newSocket.emit('identify', { userId: userId.toString(), userRole: 'Patient' });

    newSocket.on('chat message', handleChatMessage);
    
    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  const handleChatMessage = (data) => {
    console.log('Received chat message:', data);
    setMessages((prevMessages) => {
      if (!prevMessages.find((msg) => msg._id === data._id)) {
        return [...prevMessages, data];
      }
      return prevMessages;
    });
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${ip.address}/api/chat/messages`, {
        params: { userId: userId.toString() },
      });

      if (response.data.success) {
        const messagesData = response.data.data.map((msg) => ({
          ...msg,
          sender: msg.sender.toString(),
          receiver: msg.receiver.map((id) => id.toString()),
        }));
        setMessages(messagesData);
        console.log('Fetched messages:', messagesData);
      } else {
        console.error('Failed to fetch messages:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = () => {
    if (message.trim() !== '' && socket) {
      const messageData = {
        senderId: userId.toString(),
        senderModel: 'Patient',
        message,
        receiverModel: 'Staff',
      };

      socket.emit('chat message', messageData, (response) => {
        if (response.success) {
          console.log('Message sent successfully:', response);
          setMessages((prevMessages) => [...prevMessages, response.data]);
        } else {
          console.error('Failed to send message:', response.message);
        }
      });

      setMessage('');
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]);

  const scrollToBottom = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.createdAt).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <SafeAreaView style={styles.container}>
      {/* Chat Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesome5 name="arrow-left" size={20} color={theme.colors.primary} />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <Avatar.Image 
            size={40} 
            source={{ uri: MEDICAL_SECRETARY_AVATAR }}
            style={styles.avatar}
          />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>{MEDICAL_SECRETARY_NAME}</Text>
            <Text style={styles.headerSubtitle}>Usually replies within 24 hours</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={styles.keyboardAvoidView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Chat Messages */}
        <ScrollView
          style={styles.chatContainer}
          ref={scrollViewRef}
          onContentSizeChange={scrollToBottom}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading messages...</Text>
            </View>
          ) : messages.length === 0 ? (
            <View style={styles.emptyContainer}>
              {/* <Image 
                source={require('../../../assets/images/chat-empty.png')} 
                style={styles.emptyImage}
                resizeMode="contain"
              /> */}
              <Text style={styles.emptyText}>
                Send a message to connect with our Medical Secretary.
              </Text>
            </View>
          ) : (
            Object.keys(groupedMessages).map(date => (
              <View key={date}>
                <View style={styles.dateContainer}>
                  <Text style={styles.dateText}>{formatDate(date)}</Text>
                </View>
                
                {groupedMessages[date].map((msg) => {
                  const isSentByCurrentUser = msg.sender === userId.toString();
                  
                  return (
                    <View 
                      key={msg._id} 
                      style={[
                        styles.messageContainer,
                        isSentByCurrentUser ? styles.sentMessageContainer : styles.receivedMessageContainer
                      ]}
                    >
                      {!isSentByCurrentUser && (
                        <Avatar.Image 
                          size={30} 
                          source={{ uri: MEDICAL_SECRETARY_AVATAR }}
                          style={styles.messageAvatar} 
                        />
                      )}
                      
                      <View
                        style={[
                          styles.messageBubble,
                          isSentByCurrentUser ? styles.sentMessage : styles.receivedMessage,
                        ]}
                      >
                        {!isSentByCurrentUser && (
                          <Text style={styles.senderName}>{MEDICAL_SECRETARY_NAME}</Text>
                        )}
                        <Text style={[
                          styles.messageText,
                          isSentByCurrentUser ? styles.sentMessageText : styles.receivedMessageText
                        ]}>
                          {msg.message}
                        </Text>
                        <Text style={[
                          styles.timestamp,
                          isSentByCurrentUser ? styles.sentTimestamp : styles.receivedTimestamp
                        ]}>
                          {formatTime(msg.createdAt)}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            ))
          )}
        </ScrollView>

        {/* Message Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            value={message}
            onChangeText={setMessage}
            onSubmitEditing={sendMessage}
            editable={!!socket}
            mode="outlined"
            outlineColor="#e0e0e0"
            activeOutlineColor={theme.colors.primary}
            dense
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              !message.trim() && styles.disabledSendButton
            ]}
            onPress={sendMessage}
            disabled={!socket || !message.trim()}
          >
            <MaterialIcons name="send" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#f0f0f0',
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: sd.fontSizes.medium,
    fontWeight: '600',
    ...sd.fonts.semiBold,
  },
  headerSubtitle: {
    fontSize: sd.fontSizes.small,
    color: '#888',
    ...sd.fonts.regular,
  },
  keyboardAvoidView: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#888',
    ...sd.fonts.regular,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 40,
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: 20,
    opacity: 0.7,
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    ...sd.fonts.regular,
    fontSize: 14,
  },
  dateContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dateText: {
    fontSize: 12,
    color: '#888',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    ...sd.fonts.regular,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    maxWidth: '80%',
  },
  sentMessageContainer: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  },
  receivedMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageAvatar: {
    marginRight: 8,
    alignSelf: 'flex-end',
    marginBottom: 6,
    width: 30,
    height: 30,
    backgroundColor: '#f0f0f0',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
    maxWidth: '100%',
  },
  sentMessage: {
    backgroundColor: '#2F88D4',
    borderTopRightRadius: 4,
  },
  receivedMessage: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    color: '#555',
    ...sd.fonts.semiBold,
  },
  messageText: {
    fontSize: 15,
    ...sd.fonts.regular,
  },
  sentMessageText: {
    color: '#fff',
  },
  receivedMessageText: {
    color: '#000',
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  sentTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  receivedTimestamp: {
    color: '#888',
  },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    marginRight: 10,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#2F88D4',
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 3, // Offset for send icon
  },
  disabledSendButton: {
    backgroundColor: '#ccc',
  },
});

export default PatientChat;