import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Image, StyleSheet, Pressable, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, Badge, Avatar } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from 'react-native-paper';
import axios from 'axios';
import { ip } from '@/ContentExport';
import { SafeAreaView } from 'react-native-safe-area-context';
import sd from '@/utils/styleDictionary';
const DrPostScreen = ({ navigation, route }) => {
    const { doctorId, fetchPosts, drimg } = route.params || {};
    const [content, setContent] = useState("");
    const [selectedImages, setSelectedImages] = useState([]);
    const theme = useTheme();
  
    // Define styles dynamically with the theme
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
  
    const handlePostSubmit = async () => {
        if (content === "") {
          Alert.alert("Content is empty!");
          return;
        }
      
        try {
          const formData = new FormData();
      
          // Add content and doctor_id to the formData
          formData.append("content", content);
          formData.append("doctor_id", doctorId);
      
          // Add images to the formData
          selectedImages.forEach((imageUri) => {
            formData.append(`images`, {
              uri: imageUri,
              type: "image/jpeg", // Ensure type is image/...
              name: imageUri.split("/").pop(), // Extract file name from URI
            });
          });
      
          console.log("FormData contents:");
    formData._parts.forEach((part) => {
      console.log(part[0], part[1]);
    });

          // Make the Axios POST request
          await axios.post(`${ip.address}/api/doctor/api/addpost/${doctorId}`, formData, {
            headers: {
              "Content-Type": "multipart/form-data", // Allow Axios to handle the boundary
            },
          });
      
          fetchPosts(); // Refresh posts
          navigation.goBack(); // Navigate back to the DoctorHome screen
        } catch (error) {
          console.error("Error submitting post:", error);
          Alert.alert("Error submitting post", error.message);
        }
      };
      
  
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          {...(Platform.OS === 'ios' ? { behavior: 'padding' } : {})}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Pressable onPress={() => navigation.goBack()}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.colors.primary }}>Back</Text>
            </Pressable>
            <Text style={styles.header}>Create a New Post</Text>
            <Pressable onPress={handlePostSubmit}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.colors.primary }}>Post</Text>
            </Pressable>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Avatar.Image
              size={50}
              source={{ uri: drimg ? `${ip.address}/${drimg}` : '' }}
              style={styles.avatar}
            />
            <TextInput
              label="Content"
              value={content}
              onChangeText={setContent}
              mode="outlined"
              multiline
              numberOfLines={4}
              style={styles.input}
              autoFocus
              placeholder='Write your post here...'
            />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.imageContainer}>
            {selectedImages.map((image, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image 
                    source={{ uri: image }} 
                    style={styles.image} 
                />
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
        bottom: 0,
        position: "absolute",
    },
      imageWrapper: {
        height: 110,
        flexDirection: "row", 
        alignItems: "center", 
        marginRight: 0,
     },
      image: { width: 100, height: 100, borderRadius: 8 },
      badge: { 
        position: "relative",
        top: -95,
        right: 10 },
      submitButton: { marginTop: 16 },
      avatar: {
        margin: 10,
      },
      buttonWrapper: {
        position: 'relative',
        bottom: 20,
        
      },
    });
  
  export default DrPostScreen;
  