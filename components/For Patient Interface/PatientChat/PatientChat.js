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
import {ActivityIndicator} from 'react-native-paper';

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
  const MEDICAL_SECRETARY_AVATAR = "https://cdn-icons-png.flaticon.com/512/3209/3209202.png";

  // Socket connection setup
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

  // Handle incoming messages
  const handleChatMessage = (data) => {
    console.log('Received chat message:', data);
    setMessages((prevMessages) => {
      if (!prevMessages.find((msg) => msg._id === data._id)) {
        return [...prevMessages, data];
      }
      return prevMessages;
    });
  };

  // Initial message fetch
  useEffect(() => {
    fetchMessages();
  }, []);

  // Fetch message history
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
      } else {
        console.error('Failed to fetch messages:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Send message function
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
          setMessages((prevMessages) => [...prevMessages, response.data]);
        } else {
          console.error('Failed to send message:', response.message);
        }
      });

      setMessage('');
    }
  };

  // Auto-scroll to bottom when new messages arrive
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

  // Format time to HH:MM
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format date to MMM D format
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
      {/* Header */}
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
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={styles.loadingText}>Loading messages...</Text>
            </View>
          ) : messages.length === 0 ? (
            <View style={styles.emptyContainer}>
              <FontAwesome5 
                name="comment-medical" 
                size={70} 
                color={`${theme.colors.primary}30`}
                style={{marginBottom: 20}}
              />
              <Text style={styles.emptyTitle}>No messages yet</Text>
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

// Redesigned styles to match BookServices aesthetic
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  // Header styling
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
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
    backgroundColor: '#F5F7FA',
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: sd.fonts.semiBold,
    color: '#333333',
  },
  headerSubtitle: {
    fontSize: 13,
    fontFamily: sd.fonts.regular,
    color: '#777777',
  },
  keyboardAvoidView: {
    flex: 1,
  },
  // Chat container
  chatContainer: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#F9FAFC',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 40,
  },
  loadingText: {
    marginTop: 16,
    color: '#777777',
    fontFamily: sd.fonts.medium,
  },
  // Empty state styling
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginTop: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: sd.fonts.semiBold,
    color: '#555555',
    marginBottom: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: '#777777',
    fontFamily: sd.fonts.regular,
    fontSize: 15,
    maxWidth: '80%',
  },
  // Date separator
  dateContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  dateText: {
    fontSize: 13,
    color: '#777777',
    backgroundColor: 'rgba(240, 242, 245, 0.8)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    fontFamily: sd.fonts.medium,
    overflow: 'hidden',
  },
  // Message containers
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    maxWidth: '85%',
  },
  sentMessageContainer: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  },
  receivedMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageAvatar: {
    marginRight: 10,
    alignSelf: 'flex-end',
    marginBottom: 6,
    width: 30,
    height: 30,
    backgroundColor: '#F5F7FA',
  },
  // Message bubbles
  messageBubble: {
    padding: 14,
    borderRadius: 18,
    maxWidth: '100%',
  },
  sentMessage: {
    backgroundColor: '#1A8AE5', // Primary blue color
    borderBottomRightRadius: 4,
  },
  receivedMessage: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#EBEEF2',
  },
  senderName: {
    fontSize: 12,
    fontFamily: sd.fonts.semiBold,
    marginBottom: 5,
    color: '#555555',
  },
  // Message text
  messageText: {
    fontSize: 15,
    fontFamily: sd.fonts.regular,
    lineHeight: 20,
  },
  sentMessageText: {
    color: '#FFFFFF',
  },
  receivedMessageText: {
    color: '#333333',
  },
  // Timestamp
  timestamp: {
    fontSize: 11,
    marginTop: 6,
    alignSelf: 'flex-end',
    fontFamily: sd.fonts.regular,
  },
  sentTimestamp: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  receivedTimestamp: {
    color: '#9FA6B2',
  },
  // Input area
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginRight: 12,
    maxHeight: 100,
    borderRadius: 20,
  },
  sendButton: {
    backgroundColor: '#1A8AE5', // Primary blue color
    borderRadius: 24,
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 2, // Offset for send icon
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  disabledSendButton: {
    backgroundColor: '#D1D5DB',
  },
});

export default PatientChat;