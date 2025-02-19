import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Image, StyleSheet, Pressable, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, Badge, Avatar, ActivityIndicator } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from 'react-native-paper';
import axios from 'axios';
import { ip } from '@/ContentExport';
import { SafeAreaView } from 'react-native-safe-area-context';
import sd from '@/utils/styleDictionary';

const EditPostScreen = ({ navigation, route }) => {
  const { 
    postId, 
    doctorId, 
    fetchPosts, 
    postContent, 
    postImages, 
    drimg 
} = route.params || {};
  const [content, setContent] = useState(postContent || "");
  const [existingImages, setExistingImages] = useState(postImages || []);
  const [selectedImages, setSelectedImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const styles = createStyles(theme);

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

  const handleImageDelete = (imageToDelete, isNewImage) => {
    if (isNewImage) {
      setSelectedImages((prev) => prev.filter((image) => image !== imageToDelete));
    } else {
      setDeletedImages((prev) => [...prev, imageToDelete]);
      setExistingImages((prev) => prev.filter((image) => image !== imageToDelete));
    }
  };

  const handleUpdate = async () => {
    if (!content.trim()) {
      Alert.alert("Content cannot be empty!");
      return;
    }
  
    Alert.alert(
      "Confirm Update",
      "Are you sure you want to save changes to this post?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Save",
          onPress: async () => {
            const formData = new FormData();
            formData.append("content", content);
  
            existingImages.forEach((image) => {
              formData.append("images", image);
            });
  
            selectedImages.forEach((imageUri) => {
              formData.append("images", {
                uri: imageUri,
                type: "image/jpeg",
                name: imageUri.split("/").pop(),
              });
            });
  
            formData.append("deletedImages", JSON.stringify(deletedImages));
  
            try {
              setLoading(true);
              await axios.put(
                `${ip.address}/api/doctor/api/post/updatepost/${doctorId}/${postId}`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
              );
              fetchPosts(); // Refresh posts after update
              navigation.goBack(); // Navigate back
            } catch (error) {
              console.error("Error updating post:", error);
              Alert.alert("Error updating post", error.message);
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };
  

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView style={{ flex: 1 }} {...(Platform.OS === 'ios' ? { behavior: 'padding' } : {})}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Pressable onPress={() => navigation.goBack()}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.colors.primary }}>Back</Text>
          </Pressable>
          <Text style={styles.header}>Edit Post</Text>
          <Pressable onPress={handleUpdate}>
            {loading ? (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            ) : (
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.colors.primary }}>Save</Text>
            )}
          </Pressable>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Avatar.Image
            size={50}
            source={{ uri: drimg ? `${ip.address}/${drimg}` : '' }}
            style={styles.avatar}
          />
          <TextInput
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={4}
            style={styles.input}
            placeholder="Update your post content..."
          />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.imageContainer}>
          {existingImages.map((image, index) => (
            <View key={`existing-${index}`} style={styles.imageWrapper}>
              <Image source={{ uri: `${ip.address}/${image}` }} style={styles.image} />
              <Badge
                style={styles.badge}
                size={20}
                onPress={() => handleImageDelete(image, false)}
              >
                X
              </Badge>
            </View>
          ))}
          {selectedImages.map((image, index) => (
            <View key={`new-${index}`} style={styles.imageWrapper}>
              <Image source={{ uri: image }} style={styles.image} />
              <Badge
                style={styles.badge}
                size={20}
                onPress={() => handleImageDelete(image, true)}
              >
                X
              </Badge>
            </View>
          ))}
        </ScrollView>
        <View style={styles.buttonWrapper}>
          <Button onPress={handleImagePick}>Pick Images</Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const createStyles = (theme) =>
  StyleSheet.create({
    container: { flex: 1, padding: 16 },
    header: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
    input: {
      marginVertical: 8,
      backgroundColor: theme.colors.background,
      flex: 1,
      fontSize: sd.fontSizes.medium,
    },
    imageContainer: {
      height: 120,
      marginVertical: 10,
    },
    imageWrapper: {
      height: 110,
      marginRight: 10,
    },
    image: { width: 100, height: 100, borderRadius: 8 },
    badge: {
      position: "absolute",
      top: -5,
      right: -5,
      backgroundColor: theme.colors.error,
    },
    avatar: { margin: 10 },
    buttonWrapper: { marginTop: 16 },
  });

export default EditPostScreen;
