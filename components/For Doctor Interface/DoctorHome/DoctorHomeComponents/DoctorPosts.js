import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Alert,
} from 'react-native';
import { Avatar, Card, useTheme, Button, Modal, Portal, IconButton, Menu } from 'react-native-paper';
import { ip } from '@/ContentExport';
import { Entypo } from '@expo/vector-icons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';


// Utility function to extract image URLs from <img> tags and remove them from content
const processContent = (content) => {
  const imageRegex = /<img[^>]+src="([^">]+)"/g;
  const images = [];
  let match;

  // Extract image URLs
  while ((match = imageRegex.exec(content)) !== null) {
    images.push(match[1]);
  }

  // Remove <img> tags from content
  const strippedContent = content.replace(/<img[^>]*>/g, '');

  return { strippedContent, images };
};

const stripHTMLTags = (text) => text?.replace(/<\/?[^>]+(>|$)/g, '') || '';




const DoctorPosts = ({ posts, doctor, updatePostInState, refreshPosts }) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [visible, setVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [menuVisible, setMenuVisible] = useState({});
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editPostContent, setEditPostContent] = useState('');
  const [editPostId, setEditPostId] = useState(null);

  const showModal = (imageUrl, index) => {
    setCurrentImage(imageUrl);
    setCurrentIndex(index);
    setVisible(true);
  };

  const navigation = useNavigation();

  const hideModal = () => setVisible(false);

  const toggleMenu = (postId) => {
    setMenuVisible((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };

  const closeMenu = (postId) => {
    setMenuVisible((prevState) => ({
      ...prevState,
      [postId]: false,
    }));
  };

  const openEditPostModal = (postId, content) => {
    setEditPostId(postId);
    setEditPostContent(content);
    setEditModalVisible(true);
  };

  const closeEditPostModal = () => {
    setEditPostId(null);
    setEditPostContent('');
    setEditModalVisible(false);
  };

  const handleEditPost = async () => {
    if (editPostId && editPostContent.trim() !== '') {
      try {
        const response = await axios.put(`${ip.address}/posts/${editPostId}`, { content: editPostContent });

        if (response.status === 200) {
          updatePostInState(response.data);
          closeEditPostModal();
        }
      } catch (error) {
        console.error('Error updating the post:', error);
      }
    }
  };

  const deletePost = async (postId) => {
    Alert.alert(
      'Delete post',
      'Are you sure you want to delete this post?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              await axios.delete(`${ip.address}/api/doctor/api/post/deletepost/${doctor._id}/${postId}`);
              refreshPosts();
            } catch (error) {
              console.error('Error deleting the post:', error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const renderPost = ({ item }) => {
    const doctorImageUrl = doctor?.dr_image ? `${ip.address}/${doctor.dr_image}` : null;

    const { strippedContent, images } = processContent(item.content);
    const postImages = item.images.map((src) => `${ip.address}/${src}`);
    console.log('Post images:', item.images);

    return (
      <Card style={styles.card}>
        <Card.Content>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {doctorImageUrl ? (
                <Avatar.Image size={36} source={{ uri: doctorImageUrl }} style={{ marginRight: 10 }} />
              ) : (
                <Avatar.Text size={36} label="?" style={{ marginRight: 10 }} />
              )}
              <Text style={styles.timestamp}>
                Dr. {doctor?.dr_firstName || 'Unknown'} {doctor?.dr_lastName || ''}
              </Text>
            </View>
            <Menu
              visible={menuVisible[item._id]}
              onDismiss={() => closeMenu(item._id)}
              anchor={
                <IconButton
                  icon={() => <Entypo name="dots-three-horizontal" size={18} color={theme.colors.onSurface} />}
                  onPress={() => toggleMenu(item._id)}
                />
              }
            >
              <Menu.Item
                onPress={() => {
                  closeMenu(item._id);
                  navigation.navigate('dreditpost', { 
                    postId: item._id, 
                    doctorId: doctor._id, 
                    fetchPosts: refreshPosts, 
                    postContent: item.content, 
                    postImages: item.images, 
                    drimg : doctor.dr_image
                  });
                }}
                title="Edit"
              />
              <Menu.Item
                onPress={() => {
                  closeMenu(item._id);
                  deletePost(item._id);
                }}
                title="Delete"
              />
            </Menu>
          </View>

          <Text style={styles.postText}>{stripHTMLTags(strippedContent)}</Text>

          {postImages.length > 0 && (
            <FlatList
              horizontal
              data={postImages}
              keyExtractor={(image, index) => index.toString()}
              renderItem={({ item, index }) => (
                <TouchableOpacity onPress={() => showModal(item, index)}>
                  <Image source={{ uri: item }} style={styles.postImage} />
                </TouchableOpacity>
              )}
            />
          )}
        </Card.Content>
      </Card>
    );
  };

  const toggleShowAll = () => {
    setShowAll((prev) => !prev);
  };

  return (
    <>
      <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
        {posts.slice(0, showAll ? posts.length : 3).map((post, index) => (
          <View key={post._id || index}>{renderPost({ item: post })}</View>
        ))}
      </ScrollView>
      <Button mode="contained" onPress={toggleShowAll} style={styles.showMoreButton}>
        {showAll ? 'Show Less' : 'Show More'}
      </Button>

      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalContainer}>
          {currentImage ? (
            <>
              <Image source={{ uri: currentImage }} style={styles.fullImage} resizeMode="contain" />
              <Button onPress={hideModal}>Close</Button>
            </>
          ) : (
            <ActivityIndicator size="large" color={theme.colors.primary} />
          )}
        </Modal>

        <Modal visible={editModalVisible} onDismiss={closeEditPostModal} contentContainerStyle={styles.modalContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Edit Post"
            value={editPostContent}
            onChangeText={setEditPostContent}
            multiline
          />
          <Button mode="contained" onPress={handleEditPost} style={styles.modalButton}>
            Save Changes
          </Button>
          <Button mode="text" onPress={closeEditPostModal} style={styles.modalButton}>
            Cancel
          </Button>
        </Modal>
      </Portal>
    </>
  );
};

const createStyles = (theme) =>
  StyleSheet.create({
    listContainer: {
      padding: 10,
    },
    card: {
      marginVertical: 10,
      backgroundColor: theme.colors.surface,
    },
    postText: {
      fontSize: 16,
      color: theme.colors.onSurface,
      marginBottom: 10,
    },
    postImage: {
      width: 90,
      height: 90,
      borderRadius: 8,
      marginRight: 10,
    },
    timestamp: {
      fontSize: 12,
      color: theme.colors.onSurfaceVariant,
    },
    showMoreButton: {
      marginVertical: 10,
      alignSelf: 'center',
    },
    modalContainer: {
      backgroundColor: 'white',
      margin: 20,
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    fullImage: {
      width: '100%',
      height: 300,
      borderRadius: 8,
    },
  });

export default DoctorPosts;
