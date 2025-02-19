import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, Alert, View, TouchableOpacity, Image, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import Entypo from "@expo/vector-icons/Entypo";
import NavigationBar from '../Navigation/NavigationBar';
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { ip } from '../../../ContentExport';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { getData } from '../../storageUtility';
import sd from '../../../utils/styleDictionary';
import { Card, TextInput, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import io from 'socket.io-client';

const PatientChat = () => {
  const theme = useTheme();

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const route = useRoute();
  const { userId } = route.params;
  const scrollViewRef = useRef(null);
  const navigation = useNavigation();

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

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <FontAwesome5 name="arrow-left" size={20} color="black" />
      </TouchableOpacity>

      <ScrollView
        style={styles.chatContainer}
        ref={scrollViewRef}
        onContentSizeChange={scrollToBottom}
      >
        {messages.map((msg) => {
          const isSentByCurrentUser = msg.sender === userId.toString();
          const displayName = isSentByCurrentUser ? 'You' : msg.senderName || 'Unknown';

          return (
            <View key={msg._id} style={isSentByCurrentUser ? styles.sentMessage : styles.receivedMessage}>
              {!isSentByCurrentUser && <Text style={styles.senderName}>{displayName}</Text>}
              <Text style={styles.messageText}>{msg.message}</Text>
              <Text style={styles.timestamp}>Sent | {new Date(msg.createdAt).toLocaleString('en-GB')}</Text>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={message}
          onChangeText={setMessage}
          onSubmitEditing={sendMessage}
          editable={!!socket}
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={sendMessage}
          disabled={!socket}
        >
          <Text style={{ color: '#fff' }}>Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  chatContainer: {
    flex: 1,
    flexGrow: 1,
    padding: 10,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#2F88D4',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: '80%',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECECEC',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: '80%',
  },
  senderName: {
    fontSize: 12,
    color: '#555',
    marginBottom: 5,
  },
  messageText: {
    fontSize: 16,
    color: '#fff',
    ...sd.fonts.medium,
  },
  timestamp: {
    fontSize: 10,
    color: '#ddd',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  sendButton: {
    backgroundColor: '#2F88D4',
    padding: 10,
    borderRadius: 20,
  },
  backButton: {
    top: 10,
    left: 10,
    zIndex: 10,
    padding: 10,
    borderRadius: 20,
  },
});

export default PatientChat;
