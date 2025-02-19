import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Image } from 'react-native';
import { Modal, Button, Portal, Badge } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from 'react-native-paper';
import { DoctorHomeStyles } from '../DoctorHomeStyles';
import { ip } from '@/ContentExport';
import axios from 'axios';

const PostModal = ({ visible, onClose, doctorId, fetchPosts }) => {
  const [content, setContent] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const theme = useTheme();
  const styles = DoctorHomeStyles(theme);

  const handleClose = () => {
    console.log("Modal closing...");
    setContent("");
    setSelectedImages([]);
    onClose();
  };

  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
    });
    if (result?.assets) {
      const newImages = result.assets.map((asset) => asset.uri);
      setSelectedImages((prev) => [...prev, ...newImages]);
    }
  };

  const handlePostSubmit = async () => {
    try {
      const payload = {
        content,
        doctor_id: doctorId,
        images: selectedImages,
      };
      console.log("Submitting Post: ", payload);
      const response = await axios.post(`${ip.address}/api/doctor/api/addpost/${doctorId}`, payload);
      console.log("Post response:", response.data);
      
      handleClose();
    } catch (error) {
      console.error("Error submitting post:", error);
    }
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={handleClose}
        contentContainerStyle={styles.modalContainer}
        key={`post-modal-${visible}`}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Create a New Post</Text>
        <TextInput
          label="Content"
          value={content}
          onChangeText={(text) => {
            console.log("Text input updated:", text);
            setContent(text);
          }}
          mode="outlined"
          multiline
          numberOfLines={4}
          style={styles.input}
        />
        <Button onPress={handleImagePick}>Pick Images</Button>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ marginVertical: 10 }}>
          {selectedImages.map((image, index) => (
            <View key={index} style={{ flexDirection: "row", alignItems: "center" }}>
              <Image source={{ uri: image }} style={{ width: 100, height: 100, marginRight: 10 }} />
              <Badge
                style={styles.badge}
                size={20}
                onPress={() => setSelectedImages((prev) => prev.filter((_, i) => i !== index))}
              >
                X
              </Badge>
            </View>
          ))}
        </ScrollView>
        <Button mode="contained" onPress={handlePostSubmit}>
          Submit Post
        </Button>
      </Modal>
    </Portal>
  );
};

export default PostModal;
